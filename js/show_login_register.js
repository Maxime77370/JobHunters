const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// fonction pour définir les cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";

}
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
        // utilisation de fetch pour envoyer les données du formulaire au serveur
        const response = await fetch("http://localhost:8000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataObject),
        });

        if (response.ok) {
            console.log("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            window.location.href = "/search.html";
        } else {
            console.log("Erreur lors de l'inscription. Veuillez réessayer.");
        }
    } catch (error) {
        console.error("Erreur :", error);
        console.log("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
    }
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    try {
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataObject),
        });

        if (response.ok) {
            const data = await response.json();
            // Stockez le jeton JWT dans le stockage local (localStorage)
            localStorage.setItem("Jeton JWT", data.token);
            // Utilisez les données de l'utilisateur comme nécessaire
            console.log("User Data:", data.user_data);
            console.log("Connexion réussie !");
                   
          
           // Redirigez l'utilisateur vers une autre page ou effectuez d'autres actions
           // window.location.href = "/search.html";
        } else {
            console.log("Erreur lors de la connexion. Veuillez réessayer.");
        }
    } catch (error) {
        console.error("Erreur :", error);
        console.log("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
    }
});
