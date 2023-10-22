function create_footer(){
    /*
    <div id="footer">
        <ul class="nav-ul">
            <li><a href="about.html">About</a></li>|
            <li><a href="contact.html">Contact</a></li>
        </ul>
    </div>
   */

    
    footer.innerHTML = ""
    footer.innerHTML += "<div id=\"footer-bar\"><ul class=\"nav-ul\"><li><a href=\"about.html\">A propos</a></li>|<li><a href=\"contact.html\">Contact</a></li></ul></div>";
}

create_footer();