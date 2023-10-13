const body_css = document.createElement("link");
body_css.rel = "stylesheet";
body_css.href = "css/profile.css";
body.appendChild(body_css);

user_json = {
    id : 1,
    username : "username1",
    password : "password1",
    email : "email1",
    phone : "0612345678",
    picture : "picture1"
}

function create_profile() {
    let div_parent = document.getElementById("profile-box");
    let div = document.createElement("div");
    div.id = "profile";
    div.innerHTML = "<img src=\"img/profile_"+user_json.id+".png\" alt=\"profile picture\" id=\"picture\">";
    div.innerHTML += "<button class=\"btn\" id=\"btn_picture_"+user_json.id+"\">modify</button>";
    div.innerHTML += "<p>Username : " + user_json.username + "</p>";
    div.innerHTML += "<button class=\"btn\" id=\"btn_id_"+user_json.id+"\">modify</button>";
    div.innerHTML += "<p>Email : " + user_json.email + "</p>";
    div.innerHTML += "<button class=\"btn\" id=\"btn_user_"+user_json.id+"\">modify</button>";
    div.innerHTML += "<p>Phone : " + user_json.phone + "</p>";
    div.innerHTML += "<button class=\"btn\" id=\"btn_phone_"+user_json.id+"\">modify</button>";
    div.innerHTML += "<p>password : " + "*"*user_json.password.lenght + "</p>";
    div.innerHTML += "<button class=\"btn\" id=\"btn_password_"+user_json.id+"\">modify</button>";
    div_parent.appendChild(div);
}

create_profile();
