import { auth, storage, db } from "./firebase-init.js";
import { ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { ref, uploadBytes, getDownloadURL, getStorage, listAll, list } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { collection, doc, getDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

//Variables
const artistUIDArray = [];
const artistNameArray = [];

//Get all artists uid from DB
const artists = await getDocs(ARTISTS_COLLECTION_REFERENCE);
artists.forEach((artist) => {
artistUIDArray.push(artist.data().uid)
})
console.log(artistUIDArray);

//Get all artists name from DB
const artistsName = await getDocs(ARTISTS_COLLECTION_REFERENCE);
artistsName.forEach((artist) => {
artistNameArray.push(artist.data().full_name, artist.data().uid)
})
console.log(artistNameArray);


//Get all images from storage
artistNameArray.forEach((artist)=>{
  console.log(artist);
  const imagesListRef = ref(storage, `artist-img-uploads/${artist}`);
  listAll(imagesListRef)
  .then((res) => {
    res.items.forEach((itemRef) => {
      console.log(itemRef._location.path_);
      const pathReference = ref(storage, `${itemRef._location.path_}`
);
  getDownloadURL(pathReference)
    .then((url) => {
     imageDisplay.innerHTML += `<img src='${url}' alt=''>`
 
    const imagesExplorer = document.querySelectorAll(`.imagesExplorer img`);
    const modalExplorer = document.querySelector(".modalExplorer");
    const modalImgExplorer = document.querySelector(".modalImgExplorer");
    const modalTxtExplorer = document.querySelector(".modalTxtExplorer");
    const closeExplorer = document.querySelector(".closeModalExplorer");


    imagesExplorer.forEach((image) => {
    image.addEventListener("click", () => {
      // modalTxtExplorer.innerHTML = image.alt;
      modalExplorer.classList.add("appear");
      console.log('open');
      modalImgExplorer.src = image.src;
      // modalTxtExplorer.innerHTML = image.alt;
      ctaBtn.innerHTML = `
      <h3>Tatto made by</h3>
      <p><b>Artist name</b></p>
      <p>@instagram</p>
      <a href="../pages/book-appointment.html"><button>Bio</button></a>
      `
    });
    closeExplorer.addEventListener("click", () => {
      modalExplorer.classList.remove("appear");
      // console.log('closed');

    });
      });
        })
         });
  }).catch((error) => {
    console.log("Error folderRef");
    // Uh-oh, an error occurred!
  });
});