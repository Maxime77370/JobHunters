const body_css = document.createElement("link");
body_css.rel = "stylesheet";
body_css.href = "css/profile.css";
document.body.appendChild(body_css);

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
                    const new_user_data =  Object.assign({}, user_data)
                    delete new_user_data.id;

                    if (new_user_data.role === "particulier" || new_user_data.role === "admin") {
                        // Utilisateur particulier, n'ajoutez rien de spécial
                        keys = ["username", "email", "phone", "password"];
                        if (document.getElementById("password").value === ""){
                            delete new_user_data.password;
                        }
                    }
                    else{
                        keys = ["username", "email", "phone", "companie", "description", "password"];
                        if (document.getElementById("password").value === ""){
                            delete new_user_data.password;
                        }
                    }
                    for (key of keys) {
                        console.log(key);
                        new_user_data[key] = document.getElementById(key).value;
                    }

                    try {
                        console.log(user_data)
                        const response = await fetch("http://localhost:8000/modify_users/"+user_data.id, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(new_user_data),
                        });

                        if (response.ok) {
                            console.log("Modification réussie !");
                            window.location.href = "profile.html";
                        } else {
                            console.log("Erreur lors de la modification. Veuillez réessayer.");
                        }
                    } catch (error) {
                        console.error("Erreur :", error);
                        console.log("Une erreur s'est produite lors de la modification. Veuillez réessayer.");
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
    div.innerHTML += `<p>Email : <input type="text" id="email" value="${user_data.email}"></input></p>`;
    div.innerHTML += `<p>Phone : <input type="text" id="phone" value="${user_data.phone}"></input></p>`;
    
    if (user_data.role === "particulier") {
        // Utilisateur particulier, n'ajoutez rien de spécial.
    } else if (user_data.role === "entreprise") {
        // Utilisateur entreprise, affichez les informations de la compagnie ici.
        div.innerHTML += `<p>Mon entreprise : <input type="text" value="${user_data.companie}"></input></p>`;
        div.innerHTML += `<p>Description : <input type="text" value="${user_data.description}"></input></p>`;
    }

    div.innerHTML += `<p>Password : <input type="text" id="password"></input></p>`;
    
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