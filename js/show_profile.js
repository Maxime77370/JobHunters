const body_css = document.createElement("link");
body_css.rel = "stylesheet";
body_css.href = "css/profile.css";
document.body.appendChild(body_css);

const token = localStorage.getItem("Jeton JWT");

// Fonction pour extraire les données de l'utilisateur depuis le jeton JWT
function getUserDataFromToken(token) {
    try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        return {
            id: tokenPayload.id,
            username: tokenPayload.username,
            email: tokenPayload.email,
            companie: tokenPayload.companie,
            role: tokenPayload.role,
            phone: tokenPayload.phone,
        };
    } catch (error) {
        console.error("Erreur de décodage du token :", error);
        return null;
    }
}

if (token) {
    const user_data = getUserDataFromToken(token);

    if (user_data) {
        const div_parent = document.getElementById("profile-box");
        const div = document.createElement("div");
        div.id = "profile";
        div.innerHTML = `<img src="img/profile_1.png" alt="profile picture" id="picture">`;
        div.innerHTML += `<button class="btn" id="btn_picture_${user_data.id}">modify</button>`;
        div.innerHTML += `<p>Username : </p>`;
        div.innerHTML += `<button class="btn" id="btn_username_${user_data.id}">${user_data.username}</button>`;
        div.innerHTML += `<p>Email : </p>`;
        div.innerHTML += `<button class="btn" id="btn_user_${user_data.id}">${user_data.email}</button>`;
        div.innerHTML += `<p>Phone : </p>`;
        div.innerHTML += `<button class="btn" id="btn_phone_${user_data.id}">${user_data.phone}</button>`;
        
        if (user_data.role === "particulier") {
            // Utilisateur particulier, n'ajoutez rien de spécial.
        } else if (user_data.role === "entreprise") {
            // Utilisateur entreprise, affichez les informations de la compagnie ici.
            div.innerHTML += `<p>Mon entreprise : </p>`;
            div.innerHTML += `<button class="btn" id="btn_name_${user_data.id}">${user_data.companie}</button>`;
            div.innerHTML += `<p>Description : </p>`;
            div.innerHTML += `<button class="btn" id="btn_description_${user_data.id}">${user_data.description}</button>`;
        }

        div.innerHTML += `<p>Password : </p>`;
        div.innerHTML += `<button class="btn" id="btn_password_${user_data.id}">********</button>`;
        div_parent.appendChild(div);
    }
} else {
    console.log("Vous n'êtes pas connecté.");
    window.location.href = "/login.html";
}


