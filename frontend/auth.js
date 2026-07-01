async function checkAlreadyLoggedIn() {
    try {
        const res = await fetch(`${API_URL}/api/auth/user`, {
            credentials: "include",
        });

        if (res.ok) {
            window.location.replace("dashboard.html");
        }
        
    } catch (err) {
        console.log(err);
    }
}

checkAlreadyLoggedIn();

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const card = document.querySelector(".auth-card");

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        location.reload();
    }
});

function animateAndRedirect() {
    card.style.transition = "all 0.5s ease";
    card.style.transform = "scale(0.95)";
    card.style.opacity = "0.4";

    setTimeout(() => {
        document.body.style.transition = "opacity 0.3s ease";
        document.body.style.opacity = "0";

        setTimeout(() => {
            window.location.replace("dashboard.html");
        }, 300);
    }, 600);
}

loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            animateAndRedirect();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error("Error during login:", err);
        alert("An error occurred during login. Please try again.");
    } finally {
        // Re-enable the button whether the request succeeds or fails
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
});

signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    signupBtn.disabled = true;
    signupBtn.textContent = "Signing Up...";

    try {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",

            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();

        alert(data.message);
    } catch (err) {
        console.error("Error during signup:", err);
        alert("An error occurred during signup. Please try again.");
    } finally {
        signupBtn.disabled = false;
        signupBtn.textContent = "Sign Up";
    }
});
