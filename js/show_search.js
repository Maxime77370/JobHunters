const body = document.getElementsByTagName('body')[0];
const body_css = document.createElement("link");
body_css.rel = "stylesheet";
body_css.href = "css/search.css";
body.appendChild(body_css);


// ...

// Récupérez les annonces depuis votre API (vous devrez peut-être ajuster cette partie pour votre code)
fetch("http://get-advertisement/") // Remplacez par l'URL de votre API FastAPI
    .then(response => response.json())
    .then(advertisements => {
        advertisements.forEach(advertisement => {
            createDiv(advertisement);
        });
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des annonces : " + error);
    });

function createDiv(advertisement) {
    let div_parent = document.getElementById("job-board");
    let div = document.createElement("div");
    div.id = advertisement.id;
    div.className = "job";

    // Créez des éléments HTML pour afficher les informations de l'annonce
    let title = document.createElement("p");
    title.textContent = "Titre : " + advertisement.title;
    
    let description = document.createElement("p");
    description.textContent = "Description : " + advertisement.description;

    // Ajoutez ces éléments au div parent
    div.appendChild(title);
    div.appendChild(description);

    // Créez un bouton "Apply" et ajoutez un gestionnaire d'événements
    let applyButton = document.createElement("button");
    applyButton.className = "btn";
    applyButton.textContent = "Apply";
    applyButton.id = "btn_" + advertisement.id;

    // Gestionnaire d'événements pour le bouton "Apply" (exemple)
    applyButton.addEventListener("click", () => {
        // Vous pouvez ajouter ici le code pour gérer l'application à une annonce
        alert("Application à l'annonce avec ID : " + advertisement.id);
    });

    // Ajoutez le bouton au div parent
    div.appendChild(applyButton);

    div_parent.appendChild(div);
}
