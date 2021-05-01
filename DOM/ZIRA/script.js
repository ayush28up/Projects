let tc = document.querySelector(".ticket-container");
let allfilters = document.querySelectorAll(".filter");
let delbutton = document.querySelector(".delete");
let modalVisible = false;
let selectedpriority = "pink";

function loadTickets(priority){
  let allTaskData = localStorage.getItem("allTasks");
  if(allTaskData!=null){
      let data = JSON.parse(allTaskData);
      if(priority){
        data = data.filter(function(ticket){
          return ticket.selectedPriority == priority;
        });
      }
      tc.innerHTML = "";
      for(let i = 0;i<data.length;i++){
          let ticket = document.createElement("div");
          ticket.classList.add("ticket");
          ticket.innerHTML = `<div class="ticket-color ticket-color-${data[i].selectedPriority}"></div>
                        <div class="ticket-id">${data[i].taskId}</div>
                        <div class="task">
                          ${data[i].task}
                        </div>`;
            ticket.addEventListener("click",function(e){
              if(e.currentTarget.classList.contains("active")){
                  e.currentTarget.classList.remove("active");
              }else{
                e.currentTarget.classList.add("active");
              }
        })
        tc.appendChild(ticket);
  }
}
}

loadTickets();


for(let i=0;i<allfilters.length;i++){
    allfilters[i].addEventListener("click",filterHandler);
}

function filterHandler(e){
  if(e.currentTarget.classList.contains("active")){
     e.currentTarget.classList.remove("active");
     loadTickets();
  }else{
      let selectedfilter = document.querySelector(".filter.active");
      if(selectedfilter){
        selectedfilter.classList.remove("active");
      }
      e.currentTarget.classList.add("active");
      loadTickets(e.currentTarget.children[0].classList[0].split("-")[0]);
  }
}

let adbutton=document.querySelector(".add");

adbutton.addEventListener("click",showModal);


function showModal(e){
  if(modalVisible==false){
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `<div class="input" data-type="false" contenteditable="true" >
                    <span class="placeholder">Enter your text here</span>
                  </div>
                  <div class="priority-list">
                    <div class="pink-priority modal-filter active"></div>
                    <div class="blue-priority modal-filter"></div>
                    <div class="yellow-priority modal-filter"></div>
                    <div class="green-priority modal-filter"></div>
                  </div>`;
        tc.appendChild(modal);
        selectedpriority = "pink";
        let tasktyper = document.querySelector(".input");
        tasktyper.addEventListener("click",function(e){
          if(e.currentTarget.getAttribute("data-type")=="false"){
            e.currentTarget.innerHTML = "";
            e.currentTarget.setAttribute("data-type","true");
          }
        })

        tasktyper.addEventListener("keypress",addticket.bind(this,tasktyper));
        modalVisible=true;

  let modalfilters = document.querySelectorAll(".modal-filter");
  for(let i=0;i<modalfilters.length;i++){
    modalfilters[i].addEventListener("click",selectpriority);
  }
  }
  
}


function selectpriority(e){
  let activefilter = document.querySelector(".modal-filter.active");
  activefilter.classList.remove("active");
  selectedpriority = e.currentTarget.classList[0].split("-")[0];
  e.currentTarget.classList.add("active");
}
function addticket(tasktyper,e){
  if(e.key == "Enter" && e.shiftKey == false && tasktyper.innerText.trim() !=""){
        //let ticket = document.createElement("div"); 
        let id = uid();
        let task = tasktyper.innerText;
        //ticket.classList.add("ticket");
        //ticket.innerHTML = `<div class="ticket-color ticket-color-${selectedpriority}"></div>
          //            <div class="ticket-id">${id}</div>
            //          <div class="task">
              //          ${task}
                //      </div>`;
          document.querySelector(".modal").remove();
          modalVisible = false;
          //ticket.addEventListener("click",function(e){
            //if(e.currentTarget.classList.contains("active")){
              //e.currentTarget.classList.remove("active");
            //}else{
            //e.currentTarget.classList.add("active");
            //}
        //})
        //tc.appendChild(ticket);
        let allTaskData = localStorage.getItem("allTasks");
        if(allTaskData == null){
          let data = [{"taskId": id, "task" : task, "selectedPriority" : selectedpriority}];
          localStorage.setItem("allTasks", JSON.stringify(data));
        }else{
          let data = JSON.parse(allTaskData);
          data.push({"taskId": id, "task" : task, "selectedPriority" : selectedpriority});
          localStorage.setItem("allTasks", JSON.stringify(data));
        }
        let selectedfilter = document.querySelector(".filter.active");
        if(selectedfilter){
          let priority = selectedfilter.children[0].classList[0].split("-")[0];
          loadTickets(priority);
        }else{
          loadTickets();
        }
       
  }else if(e.key == "Enter" && e.shiftKey == false){
        e.preventDefault();
        alert("Please type something.");
  }

}

delbutton.addEventListener("click",function(e){
  let selectedtickets = document.querySelectorAll(".ticket.active");
  let allTasks = JSON.parse(localStorage.getItem("allTasks"));
  for(let i=0;i<selectedtickets.length;i++){
    selectedtickets[i].remove();
    allTasks = allTasks.filter(function(data){
      return data.taskId!=selectedtickets[i].querySelector(".ticket-id").innerText;
    })
  }
  localStorage.setItem("allTasks",JSON.stringify(allTasks));
})


