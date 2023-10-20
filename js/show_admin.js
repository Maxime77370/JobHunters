captureConsoleLog();

function checkUserRole() {
    const token = localStorage.getItem("Jeton JWT");
    if (!token) {
        console.error("Aucun token trouvé.")
        window.location.href = "home.html";
        return;
    }

try {
    const user = JSON.parse(atob(token.split(".")[1]));
    if (user && user.role === "admin") {
        console.log("L'utilisateur est un administrateur.");
    } else {
        console.log("L'utilisateur n'est pas un administrateur.");
        window.location.href = "home.html";
    }
} catch (error) {
    console.error("Erreur du décodage du token:", error);
    console.log("Une erreur s'est produite lors de la vérification du rôle de l'utilisateur.");
}
}

checkUserRole();

const db_selectors = document.getElementById('select-db');

init_table_output_db("companies");
init_table_input_db("companies");
db_selectors.addEventListener('change', function(){
    init_table_output_db(db_selectors.value);
    init_table_input_db(db_selectors.value);
});

async function init_table_output_db(db_name){

    const table_head_db = document.getElementById('table-head-db');
    const table_body_db = document.getElementById('table-body-db');

    try {
        const key_response = await fetch("http://localhost:8000/get_key_table/"+db_name, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });


        if (key_response.ok) {
            const data_key = await key_response.json();

            const key_names = data_key.map(item => item.Field);

            table_head_db.innerHTML = "";
            table_body_db.innerHTML = "";

            let tr = document.createElement('tr');
            for (const cle in key_names) {
                let td = document.createElement('td');
                td.textContent = key_names[cle];

                tr.appendChild(td);

            }
            table_head_db.appendChild(tr);
            
            try {
                const id_response = await fetch("http://localhost:8000/get_id_table/"+db_name, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (id_response.ok) {
                    const id_data = await id_response.json();
                    id_data.forEach(id_item => {
                        fill_table_db(db_name, id_item.id);
                    });
                    
                } else {
                    console.log("Erreur lors de la récupération des identifiants.");
                }

            } catch (error) {
                console.error("Erreur :", error);
            }

        } else {
            console.log("Erreur lors de la récupération des identifiants.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }

    async function fill_table_db(table, id){
        try {
            const response = await fetch("http://localhost:8000/get_table/"+table+"/"+id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                
                let tr = document.createElement('tr');
                for (const cle in data) {
                    let th = document.createElement('th');
                    th.textContent = data[cle];
    
                    tr.appendChild(th);
                }
                table_body_db.appendChild(tr);
    
            } else {
                console.log("Erreur lors de la récupération des identifiants des offres d'emploi.");
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    }
}

async function init_table_input_db(db_name){

    const admin_modifier = document.getElementById('admin-modifier');
    const table_input_db = document.getElementById('table-input-db');

    try {
        const key_response = await fetch("http://localhost:8000/get_key_table/"+db_name, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });


        if (key_response.ok) {
            const data_key = await key_response.json();

            const key_names = data_key.map(item => item.Field);

            table_input_db.innerHTML = "";

            for (const cle in key_names){
                let tr = document.createElement('tr');
                let th = document.createElement('th');
                th.textContent = key_names[cle];
                let td = document.createElement('td');
                let input = document.createElement('input');
                input.id = "input_"+key_names[cle];
                input.type = "text";
                input.name = key_names[cle];
                td.appendChild(input);
                tr.appendChild(th);
                tr.appendChild(td);
                table_input_db.appendChild(tr);
            }

            if (document.getElementById('create_btn') != null){
                document.getElementById('create_btn').remove();
            }

            create_btn = document.createElement('button');
            create_btn.textContent = "Créer";
            create_btn.id = "create_btn";
            admin_modifier.appendChild(create_btn);

            modified_data = {};
            create_btn.addEventListener('click', async function(){
                for (const cle in key_names){
                    let input = document.getElementById('input_'+key_names[cle]);
                    modified_data[key_names[cle]] = input.value;
                }
                create_table_db(db_name, modified_data);
            });

            input_id = document.getElementById('input_id');
            input_id.addEventListener('change', async function(){


                if (document.getElementById('modify_btn') != null)
                    document.getElementById('modify_btn').remove();

                if (document.getElementById('del_btn') != null)
                    document.getElementById('del_btn').remove();
                

                try {
                    const response = await fetch("http://localhost:8000/get_table/"+db_name+"/"+input_id.value, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
 
                    create_btn.style.display = "none";
                    if (response.ok) {
                        const data = await response.json();
                        
                        modified_data = data;
                        for (const cle in data) {
                            let input = document.getElementById('input_'+cle);
                            input.value = data[cle];
                            input.addEventListener('change', function(){
                                modified_data[cle] = input.value;
                            });
                        }
                        delete modified_data.id;

                        const modify_btn = document.createElement('button');
                        modify_btn.textContent = "Modifier";
                        modify_btn.id = "modify_btn";
                        admin_modifier.appendChild(modify_btn);

                        modify_btn.addEventListener('click', async function(){
                            modifie_table_db(db_name, input_id.value, modified_data);
                        });  

                        const del_btn = document.createElement('button');
                        del_btn.textContent = "Supprimer";
                        del_btn.id = "del_btn";
                        admin_modifier.appendChild(del_btn);

                        del_btn.addEventListener('click', async function(){
                            delete_table_db(db_name, input_id.value);
                        });

                    } else {
                        create_btn.style.display = "block";
                        console.log("Erreur lors de la récupération des identifiants des offres d'emploi.");
                    }
                } catch (error) {
                    create_btn.style.display = "block";
                    console.error("Erreur :", error);
                }
            });
            
        } else {
            console.log("Erreur lors de la récupération des identifiants.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

async function modifie_table_db(table, id, data) {
    try {
        const response = await fetch("http://localhost:8000/modify_"+table+"/"+id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log("Modification de la table " + table + " réussie.");
            init_table_output_db(table);
        }
        else {
            console.error("La requête a échoué avec le statut : " + response.status);
        }
    }
    catch (error) {
        console.error("Erreur :", error);
    }
}

async function create_table_db(table, data) {
    try {
        const response = await fetch("http://localhost:8000/create_" + table, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),  // Inclure les données JSON dans le corps de la requête
        });

        if (response.ok) {
            console.log("Création de la table " + table + " réussie.");
            init_table_output_db(table);
        } else {
            console.error("La requête a échoué avec le statut : " + response.status);
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

async function delete_table_db(table, id) {
    try {
        const response = await fetch("http://localhost:8000/delete/" + table + "/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log("Suppression de la table " + table + " réussie.");
            init_table_output_db(table);
        } else {
            console.error("La requête a échoué avec le statut : " + response.status);
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function captureConsoleLog(){
    const console_output = document.getElementById('admin-console-output');
    console.log = function(message) {
        console_output.innerHTML += "<p style='color: white;'>" + message + "</p>";
    };

    // Vous pouvez également rediriger d'autres méthodes de console (console.error, console.warn, etc.) de la même manière.
    console.error = function(message) {
        console_output.innerHTML += "<p style='color: red;'>" + message + "</p>";
    };
}

function askConsoleLog(){
    const admin_btn = document.getElementById('admin-btn');
    const admin_input = document.getElementById('admin-input');

    admin_btn.addEventListener('click', function(){
        try{
        console.log(eval(admin_input.value));
        }
        catch(error){
            console.error(error);
        }
        admin_input.value = "";
    });
}

askConsoleLog();