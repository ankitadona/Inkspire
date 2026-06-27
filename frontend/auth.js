const signupBtn = document.querySelector(".signup");
const loginBtn = document.querySelector(".login");
const card = document.querySelector(".auth-card");

function animateAndRedirect() {

    // Step 1: shrink + fade (diary closing feel)
    card.style.transition = "all 0.5s ease";
    card.style.transform = "scale(0.95)";
    card.style.opacity = "0.4";

    // Step 2: small delay before page change
    setTimeout(() => {

        // Optional future: page transition effect
        document.body.style.transition = "opacity 0.3s ease";
        document.body.style.opacity = "0";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 300);

    }, 600);
}

loginBtn.addEventListener("click", () => {

    const email = document.querySelector("input[type='email']").value;
    const password = document.querySelector("input[type='password']").value;

    if (!email || !password) {
        alert("Please fill login details");
        return;
    }

    animateAndRedirect();
});

signupBtn.addEventListener("click", () => {

    const name = document.querySelector("input[type='text']").value;
    const email = document.querySelector("input[type='email']").value;
    const password = document.querySelector("input[type='password']").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    alert("Inkspire account created ✨ (temporary local mode)");
});