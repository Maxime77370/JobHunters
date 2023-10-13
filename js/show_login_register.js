const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

loginButton.addEventListener("click", () => {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
});

registerButton.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(registerForm);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    try {
        const response = await fetch("http://localhost:8000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataObject),
        });

        if (response.ok) {
            console.log("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            window.location.href = "/connexion.html";
        } else {
            console.log("Erreur lors de l'inscription. Veuillez réessayer.");
        }
    } catch (error) {
        console.error("Erreur :", error);
        console.log("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
    }
});






