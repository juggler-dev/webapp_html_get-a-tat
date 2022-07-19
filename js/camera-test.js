import { auth, db, storage } from "./firebase-init.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

// references
const CLIENTS_COLLECTION_REFERENCE = collection(db,'clients');
const ARTISTS_COLLECTION_REFERENCE = collection(db, 'artists');
const REQUEST_APPOINTMENTS_COLLECTION_REFERENCE = collection(db, 'request_appointment');
const CAM_APPOINTMENT_REFERENCE = collection(db, 'cam_appointment');



// class
class AppoIMG {
  constructor (image, name, age, uid) {
    this.image = image;
    this.name = name;
    this.age = age;
    this.uid = uid;
    // this.artistUID = artistUID;
  }
}

// variables
const sendForm = document.getElementById('sendIt');
const appoArray = [];
let camBtn = document.getElementById('startCam');
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');

// book with current user
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('user logged in', user)

    sendForm.addEventListener('submit', function(e){
      e.preventDefault();
      const image = document.getElementById('image').value;
      const name = document.getElementById('name').value;
      const age = document.getElementById('age').value;
      const uid = user.uid;
      // const artistUID = artists.uid;
    
      const appoImage = new AppoIMG (image, name, age, uid)
    
      appoArray.push(appoImage);
      console.log(appoImage);
      console.info(appoImage.toString());
    
      const back = document.getElementById("back");
      back.innerHTML = renderImgAsHTML(appoImage);
    
    
    const requestAppointment = collection(db, 'cam_appointment');
    
      setDoc(doc(requestAppointment), {
        image: document.getElementById('image').value,
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        uid: user.uid,
        // artistUID: artists.uid
      })
    })
} else {
console.log('User logged out. Need to be logged in to request an appointment');

}
});

// display photo in html
function renderImgAsHTML( appoImage ) {
  if ((!appoImage instanceof AppoIMG)) { 
      return "<div>Not Valid</div>";
  }
  let htmlBlock = `<div>
          <p>Name: ${appoImage.name} </p>        
          <p>Age: ${appoImage.age} </p>
          <p>uid: ${appoImage.uid} </p>
          </div>
          <hr>`;
          console.log(htmlBlock);

  if (appoImage.image){
      htmlBlock += `<div><img src="${appoImage.image}" width="400" ></div>`;
  } else {
      htmlBlock += `<div>No Image Provided</div>`;
  }
  return htmlBlock;
}



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

  videoFlame.style.display = "none";


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

// get artists information
const artistsQuerySnapshot = await getDocs(ARTISTS_COLLECTION_REFERENCE);
    artistsQuerySnapshot.forEach((doc) => {
        
        console.log(doc.id, " => ", doc.data());

        const artists = doc.data();
        console.log(artists.full_name)

        artistsListOutput.innerHTML += 
        `
            
                <select>
                  <option>
                    ${artists.uid}
                  </option>
                </select>
            
        `
    })

  // get pictures information

  const artistsPicturesAppo = await getDocs(CAM_APPOINTMENT_REFERENCE);
    artistsPicturesAppo.forEach((doc) => {
        
        console.log(doc.id, " => ", doc.data());

        const camImg = doc.data();
        console.log(camImg.image)

        photosAppo.innerHTML += 
        ` 
        <img src="${camImg.image}">
        `
    })


// 

// const artistsQuerySnapshot = await getDocs(ARTISTS_COLLECTION_REFERENCE);
//     artistsQuerySnapshot.forEach((doc) => {
        
//         console.log(doc.id, " => ", doc.data());

//         const artists = doc.data();
//         console.log(artists.full_name)

//         artistsListOutput.innerHTML += 
//         `
            
//                 <select>
//                   <option>
//                     ${artists.uid}
//                   </option>
//                 </select>
            
//         `
//     })




// send form

// sendForm.addEventListener('submit', function(e){
//   e.preventDefault();
//   const image = document.getElementById('image').value;
//   const name = document.getElementById('name').value;
//   const age = document.getElementById('age').value;
//   const uid = user.uid;

//   const appoImage = new AppoIMG (image, name, age)

//   appoArray.push(appoImage);
//   console.log(appoImage);
//   console.info(appoImage.toString());

//   const back = document.getElementById("back");
//   back.innerHTML = renderImgAsHTML(appoImage);




//   setDoc(doc(requestAppointment), {
//     image: document.getElementById('image').value,
//     name: document.getElementById('name').value,
//     age: document.getElementById('age').value,
//   })
// })









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


