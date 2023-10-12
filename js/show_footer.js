function create_footer(){
    /*
    <div id="footer">
        <ul class="nav-ul">
            <li><a href="about.html">About</a></li>|
            <li><a href="contact.html">Contact</a></li>
        </ul>
    </div>
   */

    let div_parent = document.getElementById("footer");
    div_parent.innerHTML = ""
    div_parent.innerHTML += "<div id=\"footer-bar\"><ul class=\"nav-ul\"><li><a href=\"about.html\">About</a></li>|<li><a href=\"contact.html\">Contact</a></li></ul></div>";
}

create_footer();