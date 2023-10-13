
const body_css = document.createElement("link");
body_css.rel = "stylesheet";
body_css.href = "css/search.css";
body.appendChild(body_css);

async function init_advertisement() {
    try {
        const response = await fetch("http://localhost:8500/get_id_advertisements/job_advertisements", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            data.forEach(item => { // Utilisez "data" au lieu de "array"
                creat_job_advertisement(item.id);
            });
        } else {
            console.log("Erreur lors de la récupération des identifiants des offres d'emploi.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}



async function creat_job_advertisement(id) {

    try {
        const response = await fetch("http://localhost:8500/get_advertisement/"+id, {
            method: "GET",
        });
    
        if (response.ok) {
            const data = await response.json();

            let div_parent = document.getElementById("job-board");
            let div = document.createElement("div");
            div.id = data.id;
            div.className = "job";

            // Créez des éléments HTML pour afficher les informations de l'annonce
            let title = document.createElement("p");
            title.className = "title";
            title.textContent = "Titre : " + data.title;

            let description = document.createElement("p");
            description.className = "description";
            description.textContent = "Description : " + data.description;

            // Ajoutez ces éléments au div parent
            div.appendChild(title);
            div.appendChild(description);

            // Créez un élément pour afficher le lieu
            let location = document.createElement("p");
            location.className = "location";
            location.textContent = "Lieu : " + data.location; // Supposons que l'emplacement de l'annonce soit stocké dans data.location

            // Ajoutez l'élément de lieu au div parent
            div.appendChild(location);

            // Créez un bouton "Apply" et ajoutez un gestionnaire d'événements
            let applyButton = document.createElement("button");
            applyButton.className = "btn";
            applyButton.textContent = "Apply";
            applyButton.id = "btn_" + data.id;

            // Gestionnaire d'événements pour le bouton "Apply" (exemple)
            applyButton.addEventListener("click", () => {
                // Vous pouvez ajouter ici le code pour gérer l'application à une annonce
                alert("Application à l'annonce avec ID : " + data.id);
            });

            // Ajoutez le bouton au div parent
            div.appendChild(applyButton);

            div_parent.appendChild(div);

        } else {
            console.log("Erreur lors de la récupération des identifiants des offres d'emploi.");
        }
    } catch (error) {
        console.error("Erreur :", error);
        console.log("Une erreur s'est produite lors de la récupération des identifiants des offres d'emploi.");
    }

}

// Fonction pour effectuer la recherche
function performSearch() {
    const searchName = document.getElementById("search-names").value.toLowerCase();
    const searchLocation = document.getElementById("search-locations").value.toLowerCase();

    const jobElements = document.getElementsByClassName("job");

    for (let i = 0; i < jobElements.length; i++) {
        const element = jobElements[i];
        const titleElement = element.querySelector(".title"); // Assuming location is stored in an element with class "location"
        const titleText = element.textContent.toLowerCase();
        const descriptionElement = element.querySelector(".description"); // Assuming location is stored in an element with class "location"
        const descriptionText = element.textContent.toLowerCase();
        const locationElement = element.querySelector(".location"); // Assuming location is stored in an element with class "location"
        const locationText = locationElement ? locationElement.textContent.toLowerCase() : "";

        if (!titleText.includes(searchName) || !descriptionText.includes(searchName) || !locationText.includes(searchLocation)) {
            element.style.display = "none";
        } else {
            element.style.display = "flex"; // Show elements that match the search term
        }
    }
}

init_advertisement();

// Ajoutez un gestionnaire d'événements pour le bouton de recherche
document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
    performSearch(); // Appel de la fonction de recherche
});