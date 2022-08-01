/* ////////////////////////// IMPORTS ////////////////////////// */

import { auth, storage, db } from "./firebase-init.js";
import { ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { ref, uploadBytes, getDownloadURL, getStorage, listAll, list } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { collection, doc, getDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { readSessionUserData } from "./session-storage.js";

/* ////////////////////////// VARIABLES ////////////////////////// */

const uploadedImageArray = [];

const SESSION_USER_KEY_VALUE = "sessionUser";

const ARTISTS_IMG_UPLOADS_COLLECTION_NAME = 'artist_img_uploads';

const GALLERY_CONTAINER = document.querySelector(".gallery-container");
const MODAL_ELEMENT = document.querySelector(".modal-background");
const MODAL_CLOSER = document.querySelector(".modal-card-closer");
const BODY_ELEMENT = document.querySelector("body");


const ARTIST_IMG_UPLOADS_STORAGE_FOLDER = "/artist-img-uploads";


/* ////////////////////////// CLASSES   ////////////////////////// */

class ArtistUploadedImage{
  constructor(id, artistId, imgName){
    this.id = id;
    this.artistId = artistId,
    this.imgName = imgName,
    this.url = ""
  }
}

class ArtistBioSmall{
  constructor(artistName, artistInstagram){
    this.artistName = artistName;
    this.artistInstagram = artistInstagram;
  }
}

/* ////////////////////////// FUNCTIONS ////////////////////////// */

// Building Functions ===================
function buildArtistUploadedImageObject(firebaseDocument){
  return new ArtistUploadedImage(firebaseDocument.id, firebaseDocument.data().artist_id, firebaseDocument.data().img_name)
}

function buildUploadedArtistBioSmall(firebaseDocument){
  return new ArtistBioSmall(firebaseDocument.data().full_name, firebaseDocument.data().instagram)
}



// Main Event Functions ===================

//fill image list array
async function fillImageArray(array){

  const imagesUploadedFromArtist = await getDocs(collection(db, ARTISTS_IMG_UPLOADS_COLLECTION_NAME));
  imagesUploadedFromArtist.forEach((doc) => {
    const uploadedImgObject = buildArtistUploadedImageObject(doc);
    array.push(uploadedImgObject);
  });
}

//Create images cards (buttons) from array
function createImageCards(array){
  array.forEach(imageObject => {
    const artistUploadedImageToShowInGallery = document.createElement("button");
    artistUploadedImageToShowInGallery.class = "gallery-artist-uploaded-image";
    artistUploadedImageToShowInGallery.id = imageObject.id;

    const thumbnailRef = ref(storage, ARTIST_IMG_UPLOADS_STORAGE_FOLDER + '/'  + imageObject.artistId + '/' + imageObject.imgName);
    getDownloadURL(thumbnailRef)
    .then((url) => {
      imageObject.url = url;
      const thumbnailImage = document.createElement("img");
      thumbnailImage.src = url;
      artistUploadedImageToShowInGallery.appendChild(thumbnailImage);
    })

    GALLERY_CONTAINER.appendChild(artistUploadedImageToShowInGallery);
  })
}

//Open Modal
function openModalAndReturnUploadedImageObj(array, modalElement, tattooExplorerButtonId) {
  modalElement.style.visibility = "visible";
  BODY_ELEMENT.style.overflowY = "hidden";
  const uploadedImgObj = array.find(image => image.id === tattooExplorerButtonId);
  return uploadedImgObj;
}

function closeModal(modalElement) {
  modalElement.style.visibility = "hidden";
  BODY_ELEMENT.style.overflowY = "auto";
}

function setEventListenerToGalleryContainerForOpenModal(){
  GALLERY_CONTAINER.addEventListener('click',async (e) => {
    if (e.target.matches("button")) {
      // console.log("Clicked Button" + " " + e.target.id)
      const uploadedImgObj = openModalAndReturnUploadedImageObj(uploadedImageArray, MODAL_ELEMENT, e.target.id);
      await populateModalScreen(uploadedImgObj);
    }
  })
}

function setEventListenerToModalCardCloserForCloseModal(){
  MODAL_CLOSER.addEventListener('click', () => {
      closeModal(MODAL_ELEMENT);
  })
}

//Get info from artist
async function getArtistInfo(artistId){
  // Query
  const artistInfoRef = doc(db, "artists", artistId);
  const artistInfo = await getDoc(artistInfoRef);

  console.log(buildUploadedArtistBioSmall(artistInfo));
  
  return buildUploadedArtistBioSmall(artistInfo)
}

//Populate modal
async function populateModalScreen(uploadedImgObject){

  //Get artist info
  const artistInfo = await getArtistInfo(uploadedImgObject.artistId)

  document.querySelector(".modal-card-artist-name").innerHTML = artistInfo.artistName;
  document.querySelector(".modal-card-artist-instagram").innerHTML = artistInfo.artistInstagram;
  document.querySelector(".modal-card-image").src = uploadedImgObject.url;
}

/* ////////////////////////// EVENTS    ////////////////////////// */
await fillImageArray(uploadedImageArray);
createImageCards(uploadedImageArray);
await setEventListenerToGalleryContainerForOpenModal();
setEventListenerToModalCardCloserForCloseModal();




// //Get all artists uid from DB
// const ARTISTS_IMG_UPLOADS = collection(db, 'artist_img_uploads');

// const artistsImgUploadQuery = await getDocs(ARTISTS_IMG_UPLOADS);
// artistsImgUploadQuery.forEach((artist) => {
// artistImgArray.push(artist.data().artist_id, artist.data().img_name)
// })
// console.log(artistImgArray);



// //Get all artists uid from DB
// const artistInfoQuery = await getDocs(ARTISTS_COLLECTION_REFERENCE);
// artistInfoQuery.forEach((artist) => {
// artistInfoArray.push(artist.data())

// })

// artistImgArray.forEach((artist)=>{
//   console.log(artist);
//   const imagesListRef = ref(storage, `artist-img-uploads/${artist}`);
//   listAll(imagesListRef)
//   .then((res) => {
//     res.items.forEach((itemRef) => {
//       console.log(itemRef._location.path_);
//       const pathReference = ref(storage, `${itemRef._location.path_}`
      
// );
//   getDownloadURL(pathReference)
//     .then((url) => {
//      imageDisplay.innerHTML += `<img src='${url}' alt=''>`
 
//     const imagesExplorer = document.querySelectorAll(`.imagesExplorer img`);
//     const modalExplorer = document.querySelector(".modalExplorer");
//     const modalImgExplorer = document.querySelector(".modalImgExplorer");
//     // const modalTxtExplorer = document.querySelector(".modalTxtExplorer");
//     const closeExplorer = document.querySelector(".closeModalExplorer");
//     const prevBtn = document.querySelector(".prevBtn");
//     const nextBtn = document.querySelector(".nextBtn");

//     imagesExplorer.forEach((image, index) => {
//     image.addEventListener("click", () => {
//       // modalTxtExplorer.innerHTML = image.alt;
//       modalExplorer.classList.add("appear");
//       console.log('open');
//       modalImgExplorer.src = image.src;
//       // modalTxtExplorer.innerHTML = image.alt;

//       let imageIndex = index;
//       let next = imageIndex++;
//       let prev = imageIndex--;

//       window.addEventListener("keyup", (e) => {
//         /*if (next >= images.length) {
//                 next = 0;
//               } else if (prev < 0) {
//                 prev = images.length - 1;
//               }*/
  
//         if (e.keyCode === 37) {
//           modalImgExplorer.src = imagesExplorer[prev].src;
//           // modalTxtExplorer.innerHTML = imagesExplorer[prev].alt;
//           prev--;
//           next = prev + 2;
//         } else if (e.keyCode === 39) {
//           modalImgExplorer.src = imagesExplorer[next].src;
//           // modalTxtExplorer.innerHTML = imagesExplorer[next].alt;
//           next++;
//           prev = next - 2;
//         } else if (e.keyCode === 27) {
//           modalExplorer.classList.remove("appear");
//         }
//       });

//       prevBtn.addEventListener("click", () => {
//         modalImgExplorer.src = imagesExplorer[prev].src;
//         // modalTxtExplorer.innerHTML = imagesExplorer[prev].alt;
//         prev--;
//         next = prev + 2;
//       });
  
//       nextBtn.addEventListener("click", () => {
//         modalImgExplorer.src = imagesExplorer[next].src;
//         // modalTxtExplorer.innerHTML = imagesExplorer[next].alt;
//         next++;
//         prev = next - 2;
//       });
  
      
//         ctaBtn.innerHTML = `
//         <h3>Tatto made by</h3>
//         <p><b>${artistInfoArray[1].full_name}</b></p>
//         <p>${artistInfoArray[1].instagram}</p>
//         <a href="../pages/book-appointment.html"><button>Bio</button></a>
//         `
      
//     });
//     closeExplorer.addEventListener("click", () => {
//       modalExplorer.classList.remove("appear");
//       // console.log('closed');
//     });
//     });
//   });
//   });
//   }).catch((error) => {
//     console.log("Error folderRef");
//     // Uh-oh, an error occurred!
//   });
// });




