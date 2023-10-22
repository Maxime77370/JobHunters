const search_css = document.createElement("link");
search_css.rel = "stylesheet";
search_css.href = "css/search.css";
body.appendChild(search_css);

const postule_css = document.createElement("link");
postule_css.rel = "stylesheet";
postule_css.href = "css/postule.css";
body.appendChild(postule_css);

const userId = getUserIdFromToken(token);

function formatDate(isoDate) {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0 en JavaScript
    const year = date.getFullYear().toString().substr(2,2); // Pour obtenir seulement les deux derniers chiffres de l'année

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return ` Postulé le ${day}/${month}/${year} à  ${hours}:${minutes}:${seconds}`;
}


async function getCompanyNameFromJobApplication(jobApplicationId) {
    // 1. Récupération de l'enregistrement de job_application par son ID
    const jobAppResponse = await fetch(`http://localhost:8000/get_table/job_applications/${jobApplicationId}`, {
        method: "GET",
    });
    if (!jobAppResponse.ok) {
        console.error("Erreur lors de la récupération de job_application.");
        return null;
    }
    const jobAppData = await jobAppResponse.json();

    // Vérification si job_advertisement_id existe dans jobAppData
    if (!jobAppData.job_advertisement_id) {
        console.error("job_advertisement_id manquant dans les données de job_application.");
        return null;
    }

    // 2. Récupération de l'enregistrement de job_advertisement par job_advertisement_id
    const jobAdResponse = await fetch(`http://localhost:8000/get_table/job_advertisements/${jobAppData.job_advertisement_id}`, {
        method: "GET",
    });

    const jobAdData = await jobAdResponse.json();

    // Vérification si company_id existe dans jobAdData
    if (!jobAdData.company_id) {
        console.error("company_id manquant dans les données de job_advertisement.");
        return null;
    }

    // 3. Récupération de l'enregistrement de la table companies par company_id
    const companyResponse = await fetch(`http://localhost:8000/get_table/companies/${jobAdData.company_id}`, {
        method: "GET",
    });
    if (!companyResponse.ok) {
        console.error("Erreur lors de la récupération de companies.");
        return null;
    }
    const companyData = await companyResponse.json();

    return companyData.name; // Retour du nom de la compagnie
}

async function getJobAdTitleFromJobApplication(jobApplicationId) {
    // 1. Récupération de l'enregistrement de job_application par son ID
    const jobAppResponse = await fetch(`http://localhost:8000/get_table/job_applications/${jobApplicationId}`, {
        method: "GET",
    });
    if (!jobAppResponse.ok) {
        console.error("Erreur lors de la récupération de job_application.");
        return null;
    }
    const jobAppData = await jobAppResponse.json();

    // Vérification si job_advertisement_id existe dans jobAppData
    if (!jobAppData.job_advertisement_id) {
        console.error("job_advertisement_id manquant dans les données de job_application.");
        return null;
    }

    // 2. Récupération de l'enregistrement de job_advertisement par job_advertisement_id
    const jobAdResponse = await fetch(`http://localhost:8000/get_table/job_advertisements/${jobAppData.job_advertisement_id}`, {
        method: "GET",
    });
    if (!jobAdResponse.ok) {
        console.error("Erreur lors de la récupération de job_advertisement.");
        return null;
    }
    const jobAdData = await jobAdResponse.json();

    return jobAdData.title; // Retour du titre de l'annonce
}


async function init_advertisement() {
    try {
        const response = await fetch("http://localhost:8000/get_id_table_by_user/job_applications/"+userId, {
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
    const jobAdTitle = await getJobAdTitleFromJobApplication(id);
    const companyName = await getCompanyNameFromJobApplication(id);

    try {
        const response = await fetch("http://localhost:8000/get_table/job_applications/"+id, {
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
            let job_advertisement_id = document.createElement("p");
            job_advertisement_id.className = "job_advertisement_id";
            job_advertisement_id.textContent = jobAdTitle;

            let message = document.createElement("p");
            message.className = "message";
            message.textContent = data.message;


            // Créez un élément pour afficher le lieu

            let application_date = document.createElement("p");
            application_date.className = "application_date";
            application_date.textContent = formatDate(data.application_date);


            let max_div = document.createElement("div");
            max_div.className = "max";

            let full_description = document.createElement("p");
            full_description.className = "full_description";
            full_description.textContent = data.description;



            let showButton = document.createElement("button");
            showButton.className = "btn";
            showButton.textContent = companyName;
            showButton.id = "btn_show_" + count_job;

            
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

            // Ajoutez le bouton au div parent
            job.appendChild(showButton);

            min_div.appendChild(job_advertisement_id);
            min_div.appendChild(application_date);
            min_div.appendChild(message);
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

init_advertisement();
;