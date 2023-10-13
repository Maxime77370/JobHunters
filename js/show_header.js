function create_header(){

    /*
    <div id="nav-bar">
        <img src="img/burger_icon.png" alt="burger" id="burger">
        <ul class="nav-ul" id="page">
            <li><a href="home.html">Home</a></li>|
            <li><a href="search.html">Search</a></li>|
            <li><a href="profile.html">Profile</a></li>
        </ul>
        <div class="logo">
            <img src="img/KC_icon.png" alt="Logo">
        </div>
        <ul class="nav-ul" id="connect">
        </ul>
    </div>
    <div id="nav-bar-under" class="inactive">
        <ul class="nav-ul" id="page">
            <li><a href="home.html">Home</a></li>|
            <li><a href="search.html">Search</a></li>|
            <li><a href="profile.html">Profile</a></li>
        </ul>
        <ul class="nav-ul" id="connect">
        </ul>
    </div>
    */

    // in one line because balise are automatically closed afer innerHTML

    
    header.innerHTML = ""
    header.innerHTML += "<div id=\"nav-bar\"><img src=\"img/burger_icon.png\" alt=\"burger\" id=\"burger\"><ul class=\"nav-ul\" id=\"page\"><li><a href=\"home.html\">Home</a></li>|<li><a href=\"search.html\">Search</a></li>|<li><a href=\"profile.html\">Profile</a></li></ul><div class=\"logo\"><img src=\"img/KC_icon.png\" alt=\"Logo\"></div><ul class=\"nav-ul\" id=\"connect\"></ul></div><div id=\"nav-bar-under\" class=\"inactive\"><ul class=\"nav-ul\" id=\"page\"><li><a href=\"home.html\">Home</a></li>|<li><a href=\"search.html\">Search</a></li>|<li><a href=\"profile.html\">Profile</a></li></ul><ul class=\"nav-ul\" id=\"connect\"></ul></div>";
    
}

create_header();

const burger = document.getElementById("burger");
const nav_bar_under = document.getElementById("nav-bar-under");

burger.addEventListener("mouseover", function(){
    nav_bar_under.classList.add("active");
    nav_bar_under.classList.remove("inactive");
    console.log(nav_bar_under);
});

main.addEventListener("mouseover", function(){
    nav_bar_under.classList.add("inactive");
    nav_bar_under.classList.remove("active");    
});