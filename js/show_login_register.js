const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const flipper = document.querySelector('.flipper');


let isFront = true
document.querySelector('.flip-container').style.height = document.querySelector('.back').offsetHeight + 'px';

loginButton.addEventListener('click', function() {
    if (!isFront) {
        flipper.style.transform = 'rotateY(0deg)';
        isFront = true;
        document.querySelector('.flip-container').style.height = document.querySelector('.front').offsetHeight + 'px';
    }
});

registerButton.addEventListener('click', function() {
    if (isFront) {
        flipper.style.transform = 'rotateY(180deg)';
        isFront = false;
        document.querySelector('.flip-container').style.height = document.querySelector('.back').offsetHeight + 'px';
    }
});

const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
const phoneRegex = /^\d{10}$/;

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const errorPopup = document.getElementById("error-popup");

    if (!usernameRegex.test(username) || !passwordRegex.test(password) || !phoneRegex.test(phone)) {
        errorPopup.style.display = "block"; 
    } else {
        const formData = new FormData(registerForm);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        try {
            // utilisation de fetch pour envoyer les données du formulaire au serveur
            const response = await fetch("http://localhost:8000/create_users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataObject),
            });

            if (response.ok) {
                console.log("Inscription réussie ! Vous pouvez maintenant vous connecter.");
                window.location.href = "search.html";
            } else {
                console.log("Erreur lors de l'inscription. Veuillez réessayer.");
            }
        } catch (error) {
            console.error("Erreur :", error);
            console.log("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
        }
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
            // Stockage du jeton JWT dans le stockage local (localStorage)
            localStorage.setItem("Jeton JWT", data.token);
            console.log("Connexion réussie !");
          
            window.location.href = "search.html";
        } else {
            console.log("Erreur lors de la connexion. Veuillez réessayer.");
        }
    } catch (error) {
        console.error("Erreur :", error);
        console.log("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
    }
});


const particulierButton = document.getElementById("btn-particulier");
const entrepriseButton = document.getElementById("btn-entreprise");
const roleInput = document.getElementById("role");

particulierButton.addEventListener("click", () => {
    particulierButton.classList.add("selected");
    entrepriseButton.classList.remove("selected");
    roleInput.value = "particulier";

});

entrepriseButton.addEventListener("click", () => {
    entrepriseButton.classList.add("selected");
    particulierButton.classList.remove("selected");
    roleInput.value = "entreprise";
});


// événement pour gérer la disparition de la popup lors du rechargement de la page
window.addEventListener("load", () => {
    // Cacher la popup d'erreur
    const errorPopup = document.getElementById("error-popup");
    errorPopup.style.display = "none";
});
