const main = document.getElementsByTagName('main')[0];
const main_css = document.createElement("link");
main_css.rel = "stylesheet";
main_css.href = "css/cookie.css";
main.appendChild(main_css);

accepted_cookies_json = {
    cookies_essentiel : true,
    cookies_fonctionnel : true,
    cookies_analyse : true
}

function create_cookie(){

    /*
    <div id="cookie">
        <form>
            <div id="cookie-box">
                <p>By continuing to browse this site, you accept the use of cookies to provide you with offers and services tailored to your interests.</p>
                <hr> 
                <div id="cookie-checkbox">
                    <input type="checkbox" checked="checked" id="checkbox_essentiel">
                    <label for="checkbox_essentiel">Essentiel (obligatory)</label>
                    <input type="checkbox" checked="checked" id="checkbox_fonctionnel">
                    <label for="checkbox_fonctionnel">Fonctionnel</label>
                    <input type="checkbox" checked="checked" id="checkbox_analyse">
                    <label for="checkbox_analyse">Analyse</label>
                </div>
                <div id="cookie-btn">
                    <button class="btn" id="btn_accept_all">Tout accepter</button>
                    <button class="btn" id="btn_accept">Accepter essentiel</button>
                    <button class="btn" id="btn_refuse">Personaliser</button>
                </div>
            </div>
        </form>
    </div> 
    */

    let   = 
    div_parent.innerHTML += "<div id=\"cookie\"><form><div id=\"cookie-box\"><p>By continuing to browse this site, you accept the use of cookies to provide you with offers and services tailored to your interests.</p><div id=\"cookie-checkbox\"><input type=\"checkbox\" checked=\"checked\" id=\"checkbox_essentiel\"><label for=\"checkbox_essentiel\">Essentiel (obligatory)</label><input type=\"checkbox\" checked=\"checked\" id=\"checkbox_fonctionnel\"><label for=\"checkbox_fonctionnel\">Fonctionnel</label><input type=\"checkbox\" checked=\"checked\" id=\"checkbox_analyse\"><label for=\"checkbox_analyse\">Analyse</label></div><div id=\"cookie-btn\"><button class=\"btn\" id=\"btn_accept_all\">Tout accepter</button><button class=\"btn\" id=\"btn_accept\">Accepter essentiel</button><button class=\"btn\" id=\"btn_refuse\">Personaliser</button></div></div></form></div> ";
}

create_cookie();