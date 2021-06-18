// database create/open (camera)
//Database objectStore => gallery
//photo capture / video gallery => gallery(obs) store
//format:
//data:{
//   mId: any,
//   type:"img"/"video"
//   media:actual content(img => c.toDatatoUrl(),vid =>(blob));
//  }

let dBAccess;
let container = document.querySelector(".container");
let request = indexedDB.open("Camera", 1);
request.addEventListener("success", function () {
  alert("db was created");
  dBAccess = request.result;
});
request.addEventListener("upgradeneeded", function () {
  alert("upgrade happened");
  let db = request.result;
  db.createObjectStore("gallery", { keyPath: "mId" });
});
request.addEventListener("error", function () {
  alert("some errorr ocuured");
});

function addMedia(type, media) {
  let tx = dBAccess.transaction("gallery", "readwrite");
  let galleryObjectStore = tx.objectStore("gallery");
  let data = {
    mId: Date.now(),
    type,
    media,
  };
  galleryObjectStore.add(data);
}

function viewMedia() {
  let tx = dBAccess.transaction("gallery", "readonly");
  let galleryObjectStore = tx.objectStore("gallery");
  let req = galleryObjectStore.openCursor();
  req.addEventListener("success", function () {
    let cursor = req.result;

    if (cursor) {
      let div = document.createElement("div");
      div.classList.add("media-card");
      div.innerHTML = `<div class="media-container">
</div>
<div class="action-container">
<button class="download">Download</button>
<button class="delete" data-id = "${cursor.value.mId}">Delete</button>
</div>`;
    let downloadBtn = div.querySelector(".download");
    let delBtn = div.querySelector(".delete");

    delBtn.addEventListener("click",function(e){
      let mId = e.currentTarget.getAttribute("data-id")
      //UI se div delete krna h
      e.currentTarget.parentElement.parentElement.remove();
      //indexeddb se data delete krna h
      deleteMediaFromDB(mId);
    })

      if (cursor.value.type == "img") {
        let img = document.createElement("img");
        img.classList.add("media-gallery")
        img.src = cursor.value.media;
        let mediaC = div.querySelector(".media-container");
        mediaC.appendChild(img);

        downloadBtn.addEventListener("click",function(e){
        let a = document.createElement("a");//ek anchor tag banaya jisse hum link nikaal paye image ke download ka
        a.download = "image.jpg";
        a.href = img.src//todataurl se hum jo bhi abhi canvas pe drawn hai usko ek link me convert kr skte hai..and iss link ko humne anchor tag ko dediya jisse wo download kr paye
        a.click() //  khud he click krdiya jisse wo download hojaye 
        a.remove() //aur ab usko hata diya
        })

      } else {
        let video = document.createElement("video");
        video.classList.add("media-gallery")
        video.autoplay = true;
        video.controls = true;
        video.loop = true;
        video.src = window.URL.createObjectURL(cursor.value.media);
        let mediaC = div.querySelector(".media-container");
        mediaC.appendChild(video);

        downloadBtn.addEventListener("click",function(e){
          let a = document.createElement("a");//ek anchor tag banaya jisse hum link nikaal paye image ke download ka
          a.download = "video.mp4";
          a.href = e.currentTarget.parentElement.parentElement.querySelector(".media-container").children[0].src//todataurl se hum jo bhi abhi canvas pe drawn hai usko ek link me convert kr skte hai..and iss link ko humne anchor tag ko dediya jisse wo download kr paye
          a.click() //  khud he click krdiya jisse wo download hojaye 
          a.remove() //aur ab usko hata diya
          });
      }
      container.appendChild(div);
      cursor.continue();
    }
  });
}
function deleteMediaFromDB(mId){
  //code for deletion
  let tx = dBAccess.transaction("gallery", "readwrite");
  let galleryObjectStore = tx.objectStore("gallery");
  galleryObjectStore.delete(Number(mId));
}
