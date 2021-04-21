let input1=document.querySelector(".id-input");
let ul=document.querySelector(".task-list");
let lists=document.querySelectorAll(".task-list li");

function taskdeleter(e) {
  e.currentTarget.remove();
}

input1.addEventListener("keypress",function(e){
    if(e.key=="Enter"){
      let task=input1.value;
      if(task==""){
        alert("ID is empty");
        return;
      }
      input1.value="";
      var li=document.createElement("li");
      li.innerText=task;
      li.classList.add("tasklist-item");
      li.addEventListener("dblclick",taskdeleter);
      ul.insertBefore(li,ul.firstChild);
    }
})

