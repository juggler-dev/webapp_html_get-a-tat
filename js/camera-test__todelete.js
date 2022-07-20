import { auth, storage, db, provider, providerTwo, requestAppointment, usersCollectionRef, artistsCollectionRef, storageRef  } from "./main.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged   } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL , uploadString} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

onAuthStateChanged(auth, (user) => {
  console.log(user.uid)
})

// class
class AppoIMG {
  constructor (image, name, age) {
    this.image = image;
    this.name = name;
    this.age = age;
    this.uid = uid;
  }
}


// function renderImgAsHTML( appoImage ) {
//   if ((!appoImage instanceof AppoIMG)) { 
//       return "<div>Not a Valid Dog Object</div>";
//   }
//   let htmlBlock = `<div>
//           <p>Name: ${appoImage.name} </p>        
//           <p>Age: ${appoImage.age} </p>
//           </div>
//           <hr>`;
//           console.log(htmlBlock);

//   if (appoImage.image){
//       htmlBlock += `<div><img src="${appoImage.image}" width="400" ></div>`;
//   } else {
//       htmlBlock += `<div>No Image Provided</div>`;
//   }
//   return htmlBlock;
// }





const appoArray = [];


// variables
const sendForm = document.getElementById('sendIt');
let camBtn = document.getElementById('startCam');
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');

// start camera
camBtn.addEventListener('click', async function() {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false});
  video.srcObject = stream;

  showCamera(true)
});

// stop camera
document.getElementById('stopCam').addEventListener('click', () => {
  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());

  showCamera(false);
});

// take photo
takePhoto.addEventListener('click', function(){
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  const appointmentPhoto = ref(storage, 'appointment-request-photo/images' + Date());

  const imageBlob = canvas.toBlob(handleBlob, "image/jpeg");

  uploadBytes(appointmentPhoto, imageBlob).then((snapshot) => {
      console.log('uploaded a blob');
   })
});

// blob function
function handleBlob(blob) {

  const objectURL = window.URL.createObjectURL(blob);
  console.log('ObjectURL:', objectURL);
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    console.log('Base64:', reader.result);
    document.getElementById('image').value = reader.result;
  });
  reader.readAsDataURL(blob);
}

// show and hide camera function
let taker = true
function showCamera(taker) {
  if (taker==true) {
    document.getElementById('takePhoto').style.display = "block";
    document.getElementById('video').style.display = "block";
    document.getElementById('canvas').style.display = "block";
    document.getElementById('stopCam').style.display = "block";
    // document.getElementById('uploadPhoto').style.display = "block";

    console.log('show camera')
  }
  else {
    document.getElementById('takePhoto').style.display = "none";
    document.getElementById('video').style.display = "none";
    document.getElementById('canvas').style.display = "none";
    document.getElementById('stopCam').style.display = "none";
    // document.getElementById('uploadPhoto').style.display = "none";

    console.log('close and hide camera')
  }
}

// send form
sendForm.addEventListener('submit', function(e){
  e.preventDefault();
  const image = document.getElementById('image').value;
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;

  const appoImage = new AppoIMG (image, name, age)

  appoArray.push(appoImage);
  console.log(appoImage);
  console.info(appoImage.toString());

  const back = document.getElementById("back");
  back.innerHTML = renderImgAsHTML(appoImage);




  setDoc(doc(requestAppointment), {
    image: document.getElementById('image').value,
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
  })
})










// // upload photo
// uploadPhoto.addEventListener('click', function(){
//   const imageBlob = canvas.toBlob(handleBlob, 'image/jpeg')

//   // //Store in Storage
//   // const userFile = document.getElementById('addImageArtist').files[0];
//   // const filename = Date() + '.png';
//   // const storegeRef = ref(storage, userUID + '/' + filename);
  
//   uploadBytes(appointmentPhoto, imageBlob).then((snapshot) => {
//     console.log('uploaded a blob')

//   })
// })



// function handleBlob(blob) {
//   const objectURL = window.URL.createObjectURL(blob);
//   const copyIMG = document.createElement('img');
//   copyIMG.style.height = '120px';
//   copyIMG.src = objectURL;
//   document.body.appendChild(copyImg);
//   console.log('objectURl', objectURL);

//   const reader = new FileReader();

// }


