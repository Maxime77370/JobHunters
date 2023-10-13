const connected = true;

let div_parent = document.querySelectorAll("#connect");

function create_connexion(){
    for (div of div_parent){
        div.innerHTML = "<li><a href=\"portal.html\">register</a><\li>|"
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
    user_data = {
        id : 1,
        username : "username1"
    }
    create_connected(user_data);
}
else {
    create_connexion();
}