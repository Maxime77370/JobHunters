let connected = false;
let user_data = null;

if (token) {
    try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        user_data = {
            id: decoded.sub,
            username: decoded.username,
            role: decoded.role,
        };
        connected = true;
    } catch (error) {
        console.error("Erreur de décodage du token:", error);
    }
}

const div_parent = document.querySelectorAll("#connect");

function create_connexion() {
    for (div of div_parent) {
        div.innerHTML += "<li><a href=\"login.html\">Connexion</a></li>";
    }
}

function create_connected(user_data) {
    for (div of div_parent) {
        div.innerHTML = `<li><a href="profile.html"><img src="img/profile_1.png" alt="profile picture nav" id="nav-profile-picture"> ${user_data.username}</a></li>|`;
        if (user_data.role === "particulier") {
            div.innerHTML += '<li><a href="job_apply" id="job_apply">Mes emplois</a></li>';
        } else if (user_data.role === "entreprise") {
            // Utilisateur entreprise, ajoutez des options d'entreprise.
            div.innerHTML += '<li><a href="company.html">Mon entreprise</a></li>';
        } else if (user_data.role === "admin") {
            div.innerHTML += '<li><a href="job_apply" id="job_apply">Mes emplois</a></li>|';
            div.innerHTML += '<li><a href="admin.html">Panel</a></li>|';
        }
        div.innerHTML += '<li><a href="search.html" id="logout-button">Déconnexion</a></li>';
    }
}

if (connected) {
    create_connected(user_data);
} else {
    create_connexion();
}

// Ajouter un gestionnaire d'événements au niveau du document pour les clics
document.addEventListener("click", (event) => {
    if (event.target.id === "logout-button") {
        // Supprimez le token du Local Storage lorsque l'utilisateur se déconnecte
        localStorage.removeItem("Jeton JWT");
    }
});
