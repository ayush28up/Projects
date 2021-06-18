let video = document.querySelector("video"); // video tag ko get kara html se pehle
let audio = document.querySelector("audio"); // then audio tag ko
let galleryBtn = document.querySelector("#gallery");
let constraints = { video: true, audio: true }; // constraints decide kiye ke humko kya chahiye jaise yaha video and audio chahiye toh unko true krdiya
let body = document.querySelector("body");
let Vidbtn = document.querySelector("button#record");
let Capbtn = document.querySelector("button#capture");
let mediaRecorder;
let filterss = document.querySelectorAll(".filter");
let isRecording = false; //  basically ek flag hai jisse hum control  krenge ke kab recording start krni h aur kab bndd
let chunks = [];
let zoomin = document.querySelector(".zoom-in");
let zoomout = document.querySelector(".zoom-out");
let filter = "";
for(let i = 0;i<filterss.length;i++){
    console.log(filterss[i]);
    filterss[i].addEventListener("click",function(e){
    filter = e.currentTarget.style.backgroundColor;
    removeFilter();
    applyFilter(filter);
  })
}
let minzoom = 1;
let currzoom = 1;
let maxzoom = 3;

zoomin.addEventListener("click",function(){
  let VidCurrScale =  video.style.transform.split("(")[1].split(")")[0];
  if(VidCurrScale>maxzoom){
    return;
  }else{
    currzoom = Number(VidCurrScale) + 0.1;
    video.style.transform = `scale(${currzoom})`
  }
})
zoomout.addEventListener("click",function(){
  if(currzoom>minzoom){
      currzoom -= 0.1;
      video.style.transform = `scale(${currzoom})`
  }
})

galleryBtn.addEventListener("click",function(){
  location.assign("gallery.html");
})



Vidbtn.addEventListener("click", function () {
  // button ko click krne pe hum 2 chize check krenge
  let innerdiv = Vidbtn.querySelector("div")

  if (isRecording) {
    // check krenge if ye true h toh mtlb recording on h
    mediaRecorder.stop(); // stop krenge recording
    isRecording = false; //then flag ko false kardiya
    innerdiv.classList.remove("record-animation");
  } else {
    mediaRecorder.start();
    filter = ""; //ab isme ayenge toh mtlb recording off hai toh on clicking recording start hojayegi
    removeFilter()
    video.style.transform = `scale(1)`; //jab bhi hum video pe click krenge tohh zoom ht jayega
    currzoom = 1; //aur wapis se currzoom ko 1 krdenge for further zoom-in-zoomout
    isRecording = true; //true krne ka mtlb recording on hai
    innerdiv.classList.add("record-animation");
  }
});

Capbtn.addEventListener("click",function(){
  let innerdiv = Capbtn.querySelector("div");
  innerdiv.classList.add("capture-animation");
  setTimeout(function(){
    innerdiv.classList.remove("capture-animation");
  },500)
    capture()
});
navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
  // navigator is an object jo ke browser ke pass hota h..ussi ka ek child object h mediaDevices jisme ek function h getUserMedia
  // jo ki ek promise deta hai..on resolving wo promise ek object deta h jiska name h mediaStream and on rejection it gives an error

  video.srcObject = mediaStream; //yaha pe humne video and audio dono ko as a sourceobject banaya aur jo humko on resolving object mila tha
  // ussi ke andr hamara mic and camera ka live feed hai..toh ussi ko bas video and audio me bheja
  mediaRecorder = new MediaRecorder(mediaStream); //mediarecorder jo variable banaya h usko initialise kr rhe hai mediaStream se..kyuki yahi se toh humko live  feed mil rhi  h
  mediaRecorder.addEventListener("dataavailable", function (e) {
    //jab upr line no.30 pe hum start krenge toh wo record krna start krdega and after some time jab thoda data ajayega toh hum uss data ko ek array me daal denge
    chunks.push(e.data); //pushing the raw data into the array
  });

  mediaRecorder.addEventListener("stop", function () {
    //abb ye kaam tab ho rhaa h jabb hum stop krenge upr line 26 me
    let blob = new Blob(chunks, { type: "video/mp4" }); //jo data humne banaya tha video start hone ke baad bas ab ussi ko fetch krenge hum..blob use krke hum iss raw data ko url me convert krenge..jisse isko download kr paye
    
    addMedia("video",blob);
    
    chunks = []; //ab blob me jab humne data store krliya toh chunks ko khali kr denge isse agli baar jab hum recordinng start krenge toh data store kr payein
    //let url = URL.createObjectURL(blob); //blob me jo raw data tha usko url me change kiya yaha

    ///let a = document.createElement("a"); //ek new anchor tag banaya
    //a.href = url; //uske href me wohi url rkh diya
    //a.download = "video.mp4"; //ab jo file download hogi uska naam bhi dediya
    //a.click(); //khud se humne uss anchor tag bhi click bhi krdiya yahan
    //a.remove(); //aur download hojane ke baad waha se hata bhi diya
  });
});

function capture(){//created a function for capturing the image
    let canvas = document.createElement("canvas"); //created a canvas element
    let ctx = canvas.getContext("2d") //describe kiya ke jo dimension h wo 2d hai
    
    ctx.translate(canvas.width/2 , canvas.height/2);//canvas ka origin centre pe agya isse
    ctx.scale(currzoom,currzoom);//canvas ko scale krdiya abb..utna jitna currzoom hai
    ctx.translate(-canvas.width/2,-canvas.height/2);//ab origin ko wapas wahi shift krdiya jahan pe tha jisse jo image draw hogi canvas pe wo same ho live feed se
    
    
    canvas.height = video.videoHeight;//humne canvas ki height hamari camera ke live feed ke resolution ke eqaul krdi
    canvas.width = video.videoWidth//same as above but ab canvas ki width video ki resolution ke equal krdi
    ctx.drawImage(video,0,0)// ab humne live video ke ek particular frame ko liya..jab hum capture buttonn press krenge ussi waqt live video ka ek frame canvas ki help se draw hojayea 
    if(filter!=""){
      ctx.fillStyle = filter;
      ctx.fillRect(0,0,canvas.width,canvas.height)
    }
    //let a = document.createElement("a");//ek anchor tag banaya jisse hum link nikaal paye image ke download ka
    //a.download = "image.jpg";
    //a.href = canvas.toDataURL(); //todataurl se hum jo bhi abhi canvas pe drawn hai usko ek link me convert kr skte hai..and iss link ko humne anchor tag ko dediya jisse wo download kr paye
    
    addMedia("img",canvas.toDataURL());

    //a.click() //  khud he click krdiya jisse wo download hojaye 
    //a.remove() //aur ab usko hata diya
}
function applyFilter(filtercolor){
  let filterdiv = document.createElement("div");
  filterdiv.classList.add("filter-div")
  filterdiv.style.backgroundColor = filtercolor;
  body.appendChild(filterdiv);
}
function removeFilter(){
  let filterdiv = document.querySelector(".filter-div");
  if(filterdiv) filterdiv.remove()
}
