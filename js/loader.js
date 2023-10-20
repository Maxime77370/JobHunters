ask_cookies = false;

const token = localStorage.getItem("Jeton JWT");


const body = document.getElementsByTagName('body')[0];
const header = document.getElementById("header");
const main = document.getElementsByTagName("main")[0];
const footer = document.getElementById("footer");


function createDivParent() {
  const div_parent = document.getElementsByTagName("footer")[0];
  return div_parent;
}
  
const show_header = document.createElement("script");
show_header.src = "js/show_header.js";
createDivParent().after(show_header);

const show_loged = document.createElement("script");
show_loged.src = "js/show_loged.js";
createDivParent().after(show_loged);

const show_footer = document.createElement("script");
show_footer.src = "js/show_footer.js";
createDivParent().after(show_footer);


const show_cookie = document.createElement("script");
show_cookie.src = "js/show_cookie.js";
createDivParent().after(show_cookie);