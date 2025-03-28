const backendUrl = "http://127.0.0.1:5000"; // Change to actual backend URL

window.addEventListener("DOMContentLoaded", function () {
    // ✅ Redirect logged-in users
    if (localStorage.getItem("token") && window.location.pathname !== "/dashboard.html") {
        window.location.href = "dashboard.html";
    }

    // ✅ Handle Signup
    document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;
        const confirmPassword = document.getElementById("confirm-password")?.value;

        if (!email || !password || !confirmPassword) {
            alert("⚠️ All fields are required!");
            return;
        }

        if (!isValidEmail(email)) {
            alert("⚠️ Enter a valid email!");
            return;
        }

        if (password !== confirmPassword) {
            alert("⚠️ Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Signup Successful! Please log in.");
                window.location.href = "login.html";
            } else {
                alert("❌ Signup failed! " + (data.error || "Try again."));
            }
        } catch (error) {
            alert("🚨 Network error! Check connection.");
            console.error("Signup Error:", error);
        }
    });

    // ✅ Handle Login
    document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            alert("⚠️ Email and Password are required!");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("✅ Login successful!");
                window.location.href = "dashboard.html";
            } else {
                alert("❌ Login failed! " + (data.error || "Invalid credentials."));
            }
        } catch (error) {
            alert("🚨 Network error! Try again later.");
            console.error("Login Error:", error);
        }
    });

    // ✅ Handle Logout
    document.getElementById("logout")?.addEventListener("click", () => {
        localStorage.removeItem("token");
        alert("👋 Logged out successfully!");
        window.location.href = "index.html";
    });

    // ✅ Handle URL Scan
    document.getElementById("scanForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const url = document.getElementById("url")?.value;
        const token = localStorage.getItem("token");

        if (!url) {
            alert("⚠️ Please enter a URL!");
            return;
        }

        if (!token) {
            alert("🔑 You must be logged in to scan URLs!");
            return;
        }

        document.getElementById("scanResult").innerHTML = `
            <img src="assets/images/loading.gif" width="40" alt="Loading..."> Scanning...
        `;

        try {
            const response = await fetch(`${backendUrl}/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();
            if (response.ok) {
                document.getElementById("scanResult").innerHTML = `
                    <p style="color: ${data.status === "dangerous" ? "red" : "green"};">
                        ${data.message}
                    </p>
                `;
            } else {
                document.getElementById("scanResult").innerHTML = `<p style="color: red;">⚠️ ${data.error || "Scan failed!"}</p>`;
            }
        } catch (error) {
            document.getElementById("scanResult").innerHTML = `<p style="color: red;">🚨 Error scanning URL. Try again later.</p>`;
            console.error("Scan Error:", error);
        }
    });

    // ✅ Utility function for email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
