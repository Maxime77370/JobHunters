const search_css = document.createElement("link");
search_css.rel = "stylesheet";
search_css.href = "css/search.css";
body.appendChild(search_css);

const postule_css = document.createElement("link");
postule_css.rel = "stylesheet";
postule_css.href = "css/postule.css";
body.appendChild(postule_css);



async function init_advertisement() {
    try {
        const response = await fetch("http://localhost:8000/get_id_table/job_advertisements", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });



        if (response.ok) {
            const data = await response.json();
            count_job = 0;

            async function createJobAdvertisementRecursively(index) {
                if (index < data.length) {
                    count_job++;
                    await creat_job_advertisement(data[index].id, count_job);
                    createJobAdvertisementRecursively(index + 1);
                }
            }
            createJobAdvertisementRecursively(0); 
        } else {
            console.log("Erreur lors de la récupération des identifiants des offres d'emploi.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}



async function creat_job_advertisement(id , count_job) {

    try {
        const response = await fetch("http://localhost:8000/get_table/job_advertisements/"+id, {
            method: "GET",
        });
    
        if (response.ok) {
            const data = await response.json();

            let job_board = document.getElementById("job-board");
            let job = document.createElement("div");
            job.className = "job-card";
            job.id = count_job;
            job.className = "job";

            let job_container = document.createElement("div");
            job_container.className = "job-container";

            let min_div = document.createElement("div");
            min_div.className = "min";

            // Créez des éléments HTML pour afficher les informations de l'annonce
            let title = document.createElement("p");
            title.className = "title";
            title.textContent = data.title;

            let description = document.createElement("p");
            description.className = "description";
            description.textContent = data.description;


            // Créez un élément pour afficher le lieu
            let location = document.createElement("p");
            location.className = "location";
            location.textContent = data.location; // Supposons que l'emplacement de l'annonce soit stocké dans data.location

            let salary = document.createElement("p");
            salary.className = "wages";
            salary.textContent = data.wages + "€/an";

            let working_time = document.createElement("p");
            working_time.className = "working_time";
            working_time.textContent = data.working_time;

            let max_div = document.createElement("div");
            max_div.className = "max";


            let full_description = document.createElement("p");
            full_description.className = "full_description";
            full_description.textContent = data.full_description;

            // Créez un bouton "Apply" et ajoutez un gestionnaire d'événements
            let applyButton = document.createElement("button");
            applyButton.className = "btn";
            applyButton.textContent = "Apply";
            applyButton.id = "btn_apply_" + count_job;

            let showButton = document.createElement("button");
            showButton.className = "btn";
            showButton.textContent = "Show";
            showButton.id = "btn_show_" + count_job;

            // Gestionnaire d'événements pour le bouton "Apply" (exemple)
            
            showButton.addEventListener("click", () => {
                var job_full = document.querySelectorAll(".job-full");
                var all_job = document.querySelectorAll(".job");
                
                // Réinitialiser tous les éléments "job" existants
                job = document.getElementById(count_job);
                job.classList.add("job-full");
                if (body.offsetWidth < 719) {
                    job.style.transition = "all 0.5s";
                    job.style.maxHeight = "80vh";
                }
                else{
                    console.log(count_job, all_job.length);
                    if (count_job != all_job.length) {
                        if (count_job % 2 == 0) {
                            job_side = all_job[count_job-2];
                        }
                        else{
                            job_side = all_job[count_job];
                        }
                        job_side.style.transition = "all 0.5s";
                        job_side.style.maxWidth = "0";
                    }
                    job.style.transition = "0.5s";
                    job.style.maxWidth = "80vw";
                    job.style.flex = "100%";
                }
                

                for (var i = 0; i < job_full.length; i++) {
                    var job = job_full[i];
                    if (body.offsetWidth < 719) {
                        job.style.maxHeight = "40ch";
                        job.classList.remove("job-full");
                    } 
                    else {
                        if (count_job != all_job.length) {
                            if (count_job % 2 == 0) {
                                job_side = all_job[count_job-2];
                            }
                            else{
                                job_side = all_job[count_job];
                            }
                            job_side.style.transition = "all 0.5s";
                            job_side.style.maxWidth = "40vw";
                        }

                        job.style.flex = "100%";
                        job.style.transition = "0.5s";
                        job.style.maxWidth = "40vw";
                        job.classList.remove("job-full");
                    }
                }
                
                // Appliquer les styles à l'élément sélectionné
            });

            applyButton.addEventListener("click", async () => {
                apply_advertisment(data.id).then((form) => {
                    
                });
            });

            // Ajoutez le bouton au div parent
            job.appendChild(applyButton);
            job.appendChild(showButton);

            min_div.appendChild(title);
            min_div.appendChild(location);
            min_div.appendChild(working_time);
            min_div.appendChild(salary);
            min_div.appendChild(description);

            max_div.appendChild(full_description);


            job_container.appendChild(min_div);
            job_container.appendChild(max_div);

            job.appendChild(job_container);


            job_board.appendChild(job);

        } else {
            console.log("Erreur lors de la récupération des identifiants des offres d'emploi.");
        }
    } catch (error) {
        console.error("Erreur :", error);
        console.log("Une erreur s'est produite lors de la récupération des identifiants des offres d'emploi.");
    }

}


async function sendApplicationData(jobId, motivationLetter) {
   const user_id = getUserIdFromToken(token);
    try {
        const applicationData = {
            job_advertisement_id: jobId,
            message: motivationLetter,
            user_id: user_id,
            // Vous pouvez ajouter d'autres informations ici si nécessaire
        };

        const response = await fetch("http://localhost:8000/apply_for_job", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + token
            },
            body: JSON.stringify(applicationData),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log("Data sent successfully:", responseData);
            // Vous pouvez ajouter une logique pour afficher un message de confirmation à l'utilisateur
        } else {
            console.error("Erreur lors de l'envoi des données :", await response.text());
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi des données :", error);
    }
}

async function apply_advertisment(jobId) {
    // Créer le formulaire
    const main_post = document.createElement("div");
    main_post.className = "main-box-post";

    const form = document.createElement("form");
    form.className = "postule";

    // Créer la div avec la classe "title"
    const titleDiv = document.createElement("div");
    titleDiv.className = "title";

    // Créer le titre "Apply"
    const title = document.createElement("h1");
    title.textContent = "Apply";

    // Créer la div avec la classe "post-box"
    const postBoxDiv = document.createElement("div");
    postBoxDiv.className = "post-box";

    // Créer les champs du formulaire
    const fields = [
        { label: "Lettre de Motivation :", type: "textarea", id: "a_propos", name: "a_propos", placeholder: "Entrez une lettre de motivation", rows: 8, required: true }
    ];

    // Créer les champs du formulaire
    fields.forEach((fieldData) => {
        const label = document.createElement("label");
        label.textContent = fieldData.label;

        let input;
        if (fieldData.type === "textarea") {
            input = document.createElement("textarea");
            input.rows = fieldData.rows || 4; // Par défaut, 4 lignes
        } else {
            input = document.createElement("input");
            input.type = fieldData.type;
        }

        input.id = fieldData.id;
        input.name = fieldData.name;
        input.placeholder = fieldData.placeholder;
        input.required = fieldData.required;

        // Ajouter le label et l'input à la div "post-box"
        postBoxDiv.appendChild(label);
        postBoxDiv.appendChild(input);

    
    });

    let exitButton = document.createElement("button");
    exitButton.className = "btn";
    exitButton.textContent = "X";
    exitButton.id = "btn-exit";

    exitButton.addEventListener("click", () => {
        main_post.remove();
    });

    // Créer le bouton "Envoyer"
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Envoyer";

    // Ajouter le titre, la div "post-box" et le bouton au formulaire
    titleDiv.appendChild(title);
    form.appendChild(titleDiv);
    form.appendChild(postBoxDiv);
    form.appendChild(submitButton);
    form.appendChild(exitButton);

    main_post.appendChild(form);
    
    body.appendChild(main_post);

    exitButton.style = "top: " + form.offsetTop + "px; left: " + form.offsetWidth + "px; position: absolute;";

    submitButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire

        const motivationLetter = document.getElementById("a_propos").value;
        await sendApplicationData(jobId, motivationLetter);




    });
    return form;
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
            element.style.display = "block"; // Show elements that match the search term
        }
    }
}

init_advertisement();

// Ajoutez un gestionnaire d'événements pour le bouton de recherche
document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
    performSearch(); // Appel de la fonction de recherche
});