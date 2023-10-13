let main_css = document.createElement("link");
main_css.rel = "stylesheet";
main_css.href = "css/cookie.css";
main.appendChild(main_css);

accepted_cookies_json = {
    cookies_essentiel : true,
    cookies_fonctionnel : true,
    cookies_analyse : true
};

function create_cookie(){

        const cookieBanner = document.createElement("div");
        cookieBanner.id = "cookie";
        
        const form = document.createElement("form");
        const cookieBox = document.createElement("div");
        cookieBox.id = "cookie-box";
        
        const message = document.createElement("p");
        message.textContent = "By continuing to browse this site, you accept the use of cookies to provide you with offers and services tailored to your interests.";
        
        const checkboxDiv = document.createElement("div");
        checkboxDiv.id = "cookie-checkbox";
        
        const checkboxEssentiel = document.createElement("input");
        checkboxEssentiel.type = "checkbox";
        checkboxEssentiel.checked = true;
        checkboxEssentiel.id = "checkbox_essentiel";
        const labelEssentiel = document.createElement("label");
        labelEssentiel.textContent = "Essentiel (obligatory)";
        labelEssentiel.htmlFor = "checkbox_essentiel";
        
        const checkboxFonctionnel = document.createElement("input");
        checkboxFonctionnel.type = "checkbox";
        checkboxFonctionnel.checked = true;
        checkboxFonctionnel.id = "checkbox_fonctionnel";
        const labelFonctionnel = document.createElement("label");
        labelFonctionnel.textContent = "Fonctionnel";
        labelFonctionnel.htmlFor = "checkbox_fonctionnel";
        
        const checkboxAnalyse = document.createElement("input");
        checkboxAnalyse.type = "checkbox";
        checkboxAnalyse.checked = true;
        checkboxAnalyse.id = "checkbox_analyse";
        const labelAnalyse = document.createElement("label");
        labelAnalyse.textContent = "Analyse";
        labelAnalyse.htmlFor = "checkbox_analyse";
        
        const cookieBtn = document.createElement("div");
        cookieBtn.id = "cookie-btn";
        
        const acceptAllBtn = document.createElement("button");
        acceptAllBtn.classList.add("btn");
        acceptAllBtn.id = "btn_accept_all";
        acceptAllBtn.textContent = "Tout accepter";
        
        const acceptEssentielBtn = document.createElement("button");
        acceptEssentielBtn.classList.add("btn");
        acceptEssentielBtn.id = "btn_accept";
        acceptEssentielBtn.textContent = "Accepter essentiel";
        
        const customizeBtn = document.createElement("button");
        customizeBtn.classList.add("btn");
        customizeBtn.id = "btn_refuse";
        customizeBtn.textContent = "Personaliser";
        
        // Append elements to build the DOM structure
        checkboxDiv.appendChild(checkboxEssentiel);
        checkboxDiv.appendChild(labelEssentiel);
        checkboxDiv.appendChild(checkboxFonctionnel);
        checkboxDiv.appendChild(labelFonctionnel);
        checkboxDiv.appendChild(checkboxAnalyse);
        checkboxDiv.appendChild(labelAnalyse);
        
        cookieBtn.appendChild(acceptAllBtn);
        cookieBtn.appendChild(acceptEssentielBtn);
        cookieBtn.appendChild(customizeBtn);
        
        cookieBox.appendChild(message);
        cookieBox.appendChild(checkboxDiv);
        cookieBox.appendChild(cookieBtn);
        
        form.appendChild(cookieBox);
        cookieBanner.appendChild(form);
        
        // Add the cookie banner to the body
        document.body.appendChild(cookieBanner);
        
        // Event handler for "Tout accepter" button
        acceptAllBtn.addEventListener("click", function() {
          // Set all checkboxes to checked and update accepted_cookies_json
          checkboxEssentiel.checked = true;
          checkboxFonctionnel.checked = true;
          checkboxAnalyse.checked = true;
          updateCookiePreferences();
          hideCookieBanner();
        });
        
        // Event handler for "Accepter essentiel" button
        acceptEssentielBtn.addEventListener("click", function() {
          checkboxEssentiel.checked = true;
          checkboxFonctionnel.checked = false;
          checkboxAnalyse.checked = false;
          updateCookiePreferences();
          hideCookieBanner();
        });
        
        // Event handler for "Personaliser" button
        customizeBtn.addEventListener("click", function() {
          // You can add your code here to handle custom preferences
          // For example, show a modal for customizing cookies
        });
        
        // Function to update accepted_cookies_json based on checkbox values
        function updateCookiePreferences() {
          accepted_cookies_json.cookies_essentiel = checkboxEssentiel.checked;
          accepted_cookies_json.cookies_fonctionnel = checkboxFonctionnel.checked;
          accepted_cookies_json.cookies_analyse = checkboxAnalyse.checked;
        }
        
        // Function to hide the cookie banner
        function hideCookieBanner() {
          cookieBanner.style.display = "none";
        }
}

if (ask_cookies) {
  create_cookie();
}