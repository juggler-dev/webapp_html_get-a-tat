import { auth, storage, db } from "./firebase-init.js";
import { ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { ref, uploadBytes, getDownloadURL, getStorage, listAll, list } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { collection, doc, getDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

//Variables
const artistImgArray = [];
const artistInfoArray = [];

// //Class
// class Photo {
//   constructor(id, imgURL, fName, instagram) {
//     this.id = id,
//     this.imgURL = imgURL,
//     this.fName = fName,
//     this.instagram = instagram
//   }
// }

// function createImgCard(artist) {
//   return new Photo(artist.id, artist.data().uid, artist.data().imgURL, artist.data().full_name, artist.data().instagram)
// }




//Get all artists uid from DB
const ARTISTS_IMG_UPLOADS = collection(db, 'artist_img_uploads');

const artistsImgUploadQuery = await getDocs(ARTISTS_IMG_UPLOADS);
artistsImgUploadQuery.forEach((artist) => {
artistImgArray.push(artist.data().artist_id, artist.data().img_name)
})
console.log(artistImgArray);



//Get all artists uid from DB
const artistInfoQuery = await getDocs(ARTISTS_COLLECTION_REFERENCE);
artistInfoQuery.forEach((artist) => {
artistInfoArray.push(artist.data())

})






//Get img upload from DB
// const imgUploaded = await getDoc(collection(db, doc.id))

// //Get all artists name from DB
// const artistsName = await getDocs(ARTISTS_COLLECTION_REFERENCE);
// artistsName.forEach((artist) => {
// artistNameArray.push(artist.data().full_name, artist.data().uid, artist.data().instagram)
// })
// console.log(artistNameArray);


//Get all images from storage
artistImgArray.forEach((artist)=>{
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
    // const modalTxtExplorer = document.querySelector(".modalTxtExplorer");
    const closeExplorer = document.querySelector(".closeModalExplorer");
    const prevBtn = document.querySelector(".prevBtn");
    const nextBtn = document.querySelector(".nextBtn");

    imagesExplorer.forEach((image, index) => {
    image.addEventListener("click", () => {
      // modalTxtExplorer.innerHTML = image.alt;
      modalExplorer.classList.add("appear");
      console.log('open');
      modalImgExplorer.src = image.src;
      // modalTxtExplorer.innerHTML = image.alt;

      let imageIndex = index;
      let next = imageIndex++;
      let prev = imageIndex--;

      window.addEventListener("keyup", (e) => {
        /*if (next >= images.length) {
                next = 0;
              } else if (prev < 0) {
                prev = images.length - 1;
              }*/
  
        if (e.keyCode === 37) {
          modalImgExplorer.src = imagesExplorer[prev].src;
          // modalTxtExplorer.innerHTML = imagesExplorer[prev].alt;
          prev--;
          next = prev + 2;
        } else if (e.keyCode === 39) {
          modalImgExplorer.src = imagesExplorer[next].src;
          // modalTxtExplorer.innerHTML = imagesExplorer[next].alt;
          next++;
          prev = next - 2;
        } else if (e.keyCode === 27) {
          modalExplorer.classList.remove("appear");
        }
      });

      prevBtn.addEventListener("click", () => {
        modalImgExplorer.src = imagesExplorer[prev].src;
        // modalTxtExplorer.innerHTML = imagesExplorer[prev].alt;
        prev--;
        next = prev + 2;
      });
  
      nextBtn.addEventListener("click", () => {
        modalImgExplorer.src = imagesExplorer[next].src;
        // modalTxtExplorer.innerHTML = imagesExplorer[next].alt;
        next++;
        prev = next - 2;
      });
  
      
        ctaBtn.innerHTML = `
        <h3>Tatto made by</h3>
        <p><b>${artistInfoArray[1].full_name}</b></p>
        <p>${artistInfoArray[1].instagram}</p>
        <a href="../pages/book-appointment.html"><button>Bio</button></a>
        `
      
    });
    closeExplorer.addEventListener("click", () => {
      modalExplorer.classList.remove("appear");
      // console.log('closed');
    });
    });
  });
  });
  }).catch((error) => {
    console.log("Error folderRef");
    // Uh-oh, an error occurred!
  });
});




