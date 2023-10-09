
job_json = {
    id : 1,
    title : "job1",
    description : "job1 description",
    full_description : "job1 full description",
    wages : 100,
    location : "location1",
    working_time : "working_time1",
}

function createDiv() {
    let div_parent = document.getElementById("job-board");
    let div = document.createElement("div");
    div.id = job_json.id;
    div.className = "job";
    div.innerHTML = "<p>" + job_json.title + "</p>";
    div.innerHTML += "<p>" + job_json.description + "</p>";
    div.innerHTML += "<button class=\"btn\" id=\"btn_"+job_json.id+"\">Apply</button>";
    div_parent.appendChild(div);
}

for (let i = 0; i < 10; i++) {
    createDiv();
}