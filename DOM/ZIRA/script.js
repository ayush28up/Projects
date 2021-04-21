let tc = document.querySelector(".ticket-container");
let allfilters = document.querySelectorAll(".filter");

for(let i=0;i<allfilters.length;i++){
    allfilters[i].addEventListener("click",filterHandler);
}

function filterHandler(e){
  let filter=e.currentTarget.children[0].classList[0];
  tc.style.backgroundColor = filter;
}