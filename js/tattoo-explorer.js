import { auth, storage, db } from "./firebase-init.js";
import { ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { ref, uploadBytes, getDownloadURL, getStorage, listAll, list } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { collection, doc, getDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

//Variables
const artistUIDArray = [];

//Get all artists uid from DB
const artists = await getDocs(ARTISTS_COLLECTION_REFERENCE);
artists.forEach((artist) => {
artistUIDArray.push(artist.data().uid)
})
console.log(artistUIDArray);


//Get all images from storage
artistUIDArray.forEach((artist)=>{
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
      imageDisplay.innerHTML += `<img src='${url}'>`
  })
    });
  }).catch((error) => {
    console.log("Error folderRef");
    // Uh-oh, an error occurred!
  });
});