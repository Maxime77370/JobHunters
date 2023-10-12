ask_cookies = true;

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