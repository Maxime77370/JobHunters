const token = localStorage.getItem("Jeton JWT");

let connected = false;
let user_data = null;

if (token) {
    try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        user_data=  {
            id : decoded.sub,
            username : decoded.username,
        };
        connected = true;
    } catch (error) {
        console.error("Erreur de décodage du token:", error);
    }
}

let div_parent = document.querySelectorAll("#connect");

function create_connexion(){
    for (div of div_parent){
        div.innerHTML = "<li><a href=\"login.html\">register</a><\li>|"
        div.innerHTML += "<li><a href=\"portal.html\">sign</a><\li>"
    }
}

function create_connected(user_data){
    for (div of div_parent){
        div.innerHTML = "<li><a href=\"profile.html\"><img src=\"img/profile_"+user_data.id+".png\" alt=\"profile picture nav\" id=\"nav-profile-picture\"> "+user_data.username+"</a><\li>|"
        div.innerHTML += "<li><a href=\"portal.html\">Sign out</a><\li>"
    }
}

if (connected){
    create_connected(user_data);
    } else {
    create_connexion();
}