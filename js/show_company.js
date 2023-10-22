const company_board = document.getElementById("company-board");
const company_advertisement = document.getElementById("company-advertisement");
const apply = document.getElementById("show-apply");
init_company();

function checkUserRole() {
    if (!token) {
        console.error("Aucun token trouvé.")
        window.location.href = "home.html";
        return;
    }

try {
    const user = JSON.parse(atob(token.split(".")[1]));
    if (user && (user.role === "entreprise" || user.role === "admin")) {
        console.log("L'utilisateur est un entrepreneur.");
    } else {
        console.log("L'utilisateur n'est pas un entrepreneur.");
        window.location.href = "home.html";
    }
} catch (error) {
    console.error("Erreur du décodage du token:", error);
    console.log("Une erreur s'est produite lors de la vérification du rôle de l'utilisateur.");
}
}

checkUserRole();

function getUserDataFromToken(token) {
    try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        return {
            id: tokenPayload.id,
            username: tokenPayload.username,
            email: tokenPayload.email,
            role: tokenPayload.role,
            phone: tokenPayload.phone,
        };
    } catch (error) {
        console.error("Erreur de décodage du token :", error);
        return null;
    }
}

async function init_company(){
    user_data = getUserDataFromToken(token);

    try{
        const response = await fetch("http://localhost:8000/get_company_owned/" + user_data.id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log(response);

        if (response.ok){
            company_id = await response.json();
            if (company_id.length == undefined){
                create_company();
            }
            else{
                show_company(company_id[0].id);
                show_job(company_id[0].id);

                document.getElementById("add-advertisement").addEventListener("click", async (e) => {
                    add_job(company_id[0].id);
                });
            }
        }
        else{
            create_company();
        }
    }
    catch(error){
        console.error("Erreur :", error);
    }
}

async function show_company(company_id){

    try{
        response = await fetch("http://localhost:8000/get_table/companies/" + company_id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok){
            company_data = await response.json();
            console.log(company_data);
            div_company = document.createElement("div");
            div_company.innerHTML = `
            <h1>${company_data.name}</h1>
            <p>${company_data.description}</p>
            <button id="btn_edit_company">Editer</button>
            `;
            company_board.appendChild(div_company);
            btn_edit_company = document.getElementById("btn_edit_company");
            btn_edit_company.addEventListener("click", async (e) => {
                e.preventDefault();
                edit_company(company_data);
            });
        }
    }
    catch(error){
        console.error("Erreur :", error);
    }
}

async function create_company(){

    user_data = getUserDataFromToken(token);

    div_create = document.createElement("div");
    
    div_create.innerHTML = `
        <form id="form_create_company">
            <label for="name">Nom de l'entreprise</label>
            <input type="text" id="name" name="name" required>
            <label for="description">Description de l'entreprise</label>
            <textarea id="description" name="description" 
            placeholder="Décrivez votre entreprise ici..." required></textarea>
            <button type="submit" id="btn_create_company">Créer</button>
        </form>`;

    company_board.appendChild(div_create);

    const form_create_company = document.getElementById("form_create_company");

    form_create_company.addEventListener("submit", async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:8000/create_companies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form_create_company.name.value,
                    description: form_create_company.description.value,
                    owner_id: user_data.id,
                }),
            });
            window.location.href = "company.html";
        }
        catch(error){
            console.error("Erreur :", error);
        }
    });

}

async function edit_company(company_data){
    div_edit = document.createElement("div");
    
    div_edit.innerHTML = `
        <form id="form_edit_company">
            <label for="name">Nom de l'entreprise</label>
            <input type="text" id="name" name="name" value="${company_data.name}" required>
            <label for="description">Description de l'entreprise</label>
            <textarea id="description" name="description" 
            placeholder="Décrivez votre entreprise ici..." required>${company_data.description}</textarea>
            <button type="submit" id="btn_edit_company">Editer</button>
        </form>`;

    company_board.appendChild(div_edit);

    const form_edit_company = document.getElementById("form_edit_company");

    form_edit_company.addEventListener("submit", async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:8000/modify_companies/" + company_data.id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form_edit_company.name.value,
                    description: form_edit_company.description.value,
                    owner_id: company_data.owner_id,
                }),
            });
            window.location.href = "company.html";
        }
        catch(error){
            console.error("Erreur :", error);
        }
    });
}

async function show_job(company_id){
    try{
        console.log(company_id);
        const response = await fetch("http://localhost:8000/get_id_by_company/" + company_id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            data = await response.json();
            data.forEach(async element => {
                displayJobDetails(element.id, company_id);
            });
        }
    }
    catch(error){
        console.error("Erreur :", error);
    }
}

async function displayJobDetails(job_id, company_id) {
    const response = await fetch(`http://localhost:8000/get_table/job_advertisements/${job_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const job_data = await response.json();
        const div_job = document.createElement("div");
        div_job.id = "job_" + job_id;
        
        const elements = [
            { element: 'p', content: `<strong>${job_data.title}</strong>` },
            { element: 'p', content: `${job_data.description}` },
            { element: 'p', content: `${job_data.full_description}` },
            { element: 'p', content: `Rémunération : ${job_data.wages}` },
            { element: 'p', content: `Lieu : ${job_data.location}` },
            { element: 'p', content: `Horaire : ${job_data.working_time}` }
        ];
        
        elements.forEach(item => {
            const elem = document.createElement(item.element);
            elem.innerHTML = item.content;
            div_job.appendChild(elem);
        });
        
        const btn_edit_job = document.createElement("button");
        btn_edit_job.id = "btn_edit_job_" + job_id;
        btn_edit_job.innerHTML = "Editer";

        const btn_show_applicants = document.createElement("button");
        btn_show_applicants.id = "btn_show_applicants_" + job_id;
        btn_show_applicants.innerHTML = "Voir les candidats";

        div_job.appendChild(btn_edit_job);
        div_job.appendChild(btn_show_applicants);
        company_advertisement.appendChild(div_job);

        document.getElementById(`btn_edit_job_${job_id}`).addEventListener("click", () => {
            editJobDetails(job_id, job_data, company_id);
        });

        document.getElementById(`btn_show_applicants_${job_id}`).addEventListener("click", () => {
            showAplicants(job_id);
        });
    }
}

async function editJobDetails(job_id, job_data, company_id) {
    const div_job = document.getElementById(`job_${job_id}`);
    div_job.innerHTML = `
        <form id="form_edit_job">
            <label for="nom">Nom du poste</label>
            <input type="text" id="nom" name="nom" value="${job_data.title}" required>
            <label for="description">Description du poste</label>
            <textarea id="description" name="description" 
            placeholder="Décrivez votre entreprise ici..." required>${job_data.description}</textarea>
            <label for="full_description">Description complète du poste</label>
            <textarea id="full_description" name="full_description" 
            placeholder="Décrivez votre entreprise ici..." required>${job_data.full_description}</textarea>
            <label for="remuneration">Rémunération</label>
            <input type="number" id="remuneration" name="remuneration" value="${job_data.wages}" required>
            <label for="lieu">Lieu</label>
            <input type="text" id="lieu" name="lieu" value="${job_data.location}" required>
            <label for="horaire">Horaire</label>
            <input type="text" id="horaire" name="horaire" value="${job_data.working_time}" required>
            <button type="submit" id="btn_edit_job">Save</button>
        </form>`;

    const form_edit_job = document.getElementById("form_edit_job");
    form_edit_job.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/modify_job_advertisements/${job_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: form_edit_job.nom.value,
                    description: form_edit_job.description.value, 
                    full_description: form_edit_job.full_description.value, 
                    wages: parseFloat(form_edit_job.remuneration.value),
                    location: form_edit_job.lieu.value,
                    working_time: form_edit_job.horaire.value,
                    company_id: company_id,
                }),
            });

            if (response.ok) {
                document.getElementById("job_"+job_id).remove();
                displayJobDetails(job_id, company_id);  // retour à l'affichage après la modification
            } else {
                console.error("Erreur lors de la modification:", response.statusText);
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    });
}

async function add_job(company_id){
    const form_create_job = document.getElementById
    ("form-add-advertisement");
    document.getElementById("main-box-ann").style.display = "block";
    console.log(form_create_job);
    form_create_job.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/create_job_advertisements", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: form_create_job.nom.value,
                    description: form_create_job.description.value, 
                    full_description: form_create_job.full_description.value, 
                    wages: parseFloat(form_create_job.remuneration.value), //conversion en float
                    location: form_create_job.lieu.value,
                    working_time: form_create_job.horaire.value,
                    company_id: company_id,
                }),
            });
        } catch (error) {
            console.error("Erreur:", error);
        }
    });
}

async function showAplicants(job_id){
    try{
        const reponse = await fetch("http://localhost:8000/get_id_by_advertisement/" + job_id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (reponse.ok){
            data = await reponse.json();
            console.log(data);

            data.forEach(async element => {
                displayAplicants(element.id);
            });
        }
    }
    catch(error){
        console.error("Erreur :", error);
    }
}

async function displayAplicants(application_id){
    try{
        const reponse = await fetch("http://localhost:8000/get_table/job_applications/" + application_id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (reponse.ok){
            application_data = await reponse.json();
            try{
                const response = await fetch("http://localhost:8000/get_table/users/" + application_data.user_id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (reponse.ok){
                    user_data = await response.json();
                    div_aplicants = document.createElement("div");
                    div_aplicants.innerHTML = `
                    <h1>${user_data.username}</h1>
                    <p>${application_data.message}</p>
                    <p>${user_data.email}</p>
                    <p>${user_data.phone}</p>
                    `;
                    apply.appendChild(div_aplicants);
                }
            }
            catch(error){
                console.error("Erreur :", error);
            }
        }
    }
    catch(error){
        console.error("Erreur :", error);
    }
}