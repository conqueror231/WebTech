
let paragraph = document.getElementById("output");
let button = document.getElementById("btn");

function showMessage() {
    paragraph.innerText = "Hello world!";
}


button.addEventListener("click", showMessage);