const body_css = document.createElement("link");
body_css.rel = "stylesheet";
body_css.href = "css/profile.css";
document.body.appendChild(body_css);

const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
const phoneRegex = /^\d{10}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/;

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

function profile(token){
    if (token) {
        const user_data = getUserDataFromToken(token);

        document.getElementById("profile-box").innerHTML = "";

        if (user_data) {

            show_profile(user_data);

            document.getElementById("modifer-btn").addEventListener("click", () => {

                show_modifier(user_data);

                document.getElementById("exit-btn").addEventListener("click", () => {
                    profile(token);
                    return;
                });

                document.getElementById("save-btn").addEventListener("click", async (event) => {
                    event.preventDefault();
                    
                    // Récupérez les valeurs des champs en utilisant les attributs name
                    const username = document.getElementById("username").value;
                    const email = document.getElementById("email").value;
                    const phone = document.getElementById("phone").value;
                    const oldPassword = document.getElementById("old-password").value;
                    let newPassword = document.getElementById("new-password").value;
                    if (newPassword === "") {
                        newPassword = oldPassword;
                    }

                    console.log(username, email, phone, oldPassword, newPassword);

                    if (usernameRegex.test(username) && passwordRegex.test(newPassword) && phoneRegex.test(phone) && emailRegex.test(email)) {
                    
                        // Objet pour la vérification du mot de passe
                        const passwordData = {
                            username: user_data.username,
                            password: oldPassword
                        };

                        console.log(passwordData)
                    
                        try {
                            // Vérifiez l'ancien mot de passe
                            const response = await fetch("http://localhost:8000/verify-pwd", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(passwordData),
                            });
                    
                            if (response.ok) {
                                // La vérification du mot de passe a réussi, vous pouvez maintenant mettre à jour le mot de passe.

                                const newUserData = {
                                    username: username,
                                    email: email,
                                    phone: phone,
                                    password: newPassword,  // Ajoutez le nouveau mot de passe ici
                                    role: user_data.role,
                                };

                                console.log(newUserData)
                                // Envoyez une nouvelle requête pour mettre à jour l'utilisateur avec le nouveau mot de passe
                                const updateResponse = await fetch(`http://localhost:8000/modify_users/${user_data.id}`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(newUserData),
                                });
                    
                                if (updateResponse.ok) {
                                    console.log("Modification réussie !");
                                    try {
                                        const response = await fetch("http://localhost:8000/login", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({username: username, password: newPassword}),
                                        });
                                
                                        if (response.ok) {
                                            const data = await response.json();
                                            // Stockage du jeton JWT dans le stockage local (localStorage)
                                            localStorage.setItem("Jeton JWT", data.token);
                                            console.log("Connexion réussie !");
                                        } else {
                                            console.log("Erreur lors de la connexion. Veuillez réessayer.");
                                        }
                                    } catch (error) {
                                        console.error("Erreur :", error);
                                        console.log("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
                                    }
                                    window.location.href = "profile.html";
                                } else {
                                    console.log("Erreur lors de la modification. Veuillez réessayer.");
                                }
                            } else {
                                console.log("Ancien mot de passe incorrect. La modification a échoué.");
                            }
                        } catch (error) {
                            console.error("Erreur :", error);
                            console.log("Une erreur s'est produite lors de la modification. Veuillez réessayer.");
                        }
                    }
                    else{
                        if (!passwordRegex.test(newPassword) && !newPassword === "" ){
                            document.getElementById("error-popup-password").style.display = "block";
                        }
                        if (!phoneRegex.test(phone)){
                            document.getElementById("error-popup-phone").style.display = "block";
                        }
                        if (!usernameRegex.test(username)){
                            document.getElementById("error-popup-username").style.display = "block";
                        }
                        if (!emailRegex.test(email)){
                            document.getElementById("error-popup-email").style.display = "block";
                        }
                    }
                });
            });
        }
    } else {
        console.log("Vous n'êtes pas connecté.");
        window.location.href = "login.html";
    }
}

function show_profile(user_data){
    const div_parent = document.getElementById("profile-box");
    const div = document.createElement("div");
    div.id = "profile";
    div.innerHTML = `<img src="img/profile_1.png" alt="profile picture" id="picture">`;
    div.innerHTML += `<p>Username : ${user_data.username}</p>`;
    div.innerHTML += `<p>Email : ${user_data.email}</p>`;
    div.innerHTML += `<p>Phone : ${user_data.phone}</p>`;
    
    if (user_data.role === "particulier") {
        // Utilisateur particulier, n'ajoutez rien de spécial.
    } else if (user_data.role === "entreprise") {
        // Utilisateur entreprise, affichez les informations de la compagnie ici.
        div.innerHTML += `<p>Mon entreprise : ${user_data.companie}</p>`;
        div.innerHTML += `<p>Description : ${user_data.description}</p>`;
    }

    div.innerHTML += `<p>Password : ********</p>`;
    
    let modifer_btn = document.createElement("button");
    modifer_btn.classList.add("btn");
    modifer_btn.id = "modifer-btn";
    modifer_btn.innerHTML = "Modifer";
    div.appendChild(modifer_btn);
    div_parent.appendChild(div);
}

function show_modifier(user_data){
    div = document.getElementById("profile");
    div.innerHTML = `<img src="img/profile_1.png" alt="profile picture" id="picture">`;
    div.innerHTML += `<p>Username : <input type="text" id="username" value="${user_data.username}"></input></p>`;
    div.innerHTML += "<p id=\"error-popup-username\" style=\"color : red ; display : none;\">Username must be between 4 and 16 characters long and contain only letters and numbers.</p>";
    div.innerHTML += `<p>Email : <input type="text" id="email" value="${user_data.email}"></input></p>`;
    div.innerHTML += "<p id=\"error-popup-email\" style=\"color : red ; display : none;\">Email must be valid.</p>";

    div.innerHTML += `<p>Phone : <input type="text" id="phone" value="${user_data.phone}"></input></p>`;
    div.innerHTML += "<p id=\"error-popup-phone\" style=\"color : red ; display : none;\">Phone must be 10 characters long and contain only numbers.</p>";
    
    if (user_data.role === "particulier") {
        // Utilisateur particulier, n'ajoutez rien de spécial.
    } else if (user_data.role === "entreprise") {
        // Utilisateur entreprise, affichez les informations de la compagnie ici.
        div.innerHTML += `<p>Mon entreprise : <input type="text" value="${user_data.companie}"></input></p>`;
        div.innerHTML += `<p>Description : <input type="text" value="${user_data.description}"></input></p>`;
    }

    div.innerHTML += `<p>Old Password (Obligatory): <input type="text" id="old-password"></input></p>`;
    div.innerHTML += `<p>New Password (no change if empty): <input type="text" id="new-password"></input></p>`;
    div.innerHTML += "<p id=\"error-popup-password\" style=\"color : red ; display : none;\">Password must be at least 8 characters long, contain at least one number and one uppercase letter.</p>";
    
    let save_btn = document.createElement("button");
    save_btn.classList.add("btn");
    save_btn.id = "save-btn";
    save_btn.innerHTML = "Save";

    let exit_btn = document.createElement("button");
    exit_btn.classList.add("btn");
    exit_btn.id = "exit-btn";
    exit_btn.innerHTML = "Exit";

    div.appendChild(save_btn);
    div.appendChild(exit_btn);
}

profile(token);