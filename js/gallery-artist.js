import { auth, storage, db } from "./main.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { collection, doc, getDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

// Variables =====================
let userUID;

function drawNewTableRow(imgName, row) {
    let thumbnail = row.insertCell(0);
    let name = row.insertCell(1);

    //Thumbnail calling
    const imageRef = ref(storage, "0QZE1DOE8LXDg9P50VcBoBzkNo32" + '/' + imgName);

    getDownloadURL(imageRef)
        .then((url) => {
            thumbnail.innerHTML += `<img src='${url}' class="thumbnail-image"></img>`
        })

    //Name
    name.innerHTML = `<p>${imgName}</p>`;
}

async function updateTable(collectionName) {
    //Table Name
    galleryTable.innerHTML = "";

    const artistCollectionQuery = query(collection(db, collectionName), where("artist_id", "==", "0QZE1DOE8LXDg9P50VcBoBzkNo32"));
    const artistCollection = await getDocs(artistCollectionQuery);
    // const artistCollection = await getDocs(collection(db, collectionName));
    artistCollection.forEach((doc) => {
        drawNewTableRow(doc.data().img_name, galleryTable.insertRow(0))
        // console.log(doc.data());
    });
}

// Events

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        console.log('user logged in', user)
        // console.log(user.uid);
        // console.log(user.email);
        userUID = user.uid;

        // ...
    } else {
        // User is signed out
        // ...

        console.log('user logged out');
    }
});

updateTable("artist_img_uploads");

document.getElementById('addImageToGallery').addEventListener('click', async () => {

    //Store in Storage
    const userFile = document.getElementById('addImageArtist').files[0];
    const filename = Date() + '.png';
    const storegeRef = ref(storage, userUID + '/' + filename);

    uploadBytes(storegeRef, userFile)
        .then((snapshot) => {
            console.log(snapshot);
        });

    console.log("Added");

    //Store in Firestore

    const docRef = await addDoc(collection(db, "artist_img_uploads"), {
        artist_id: userUID,
        img_name: filename
    });

    updateTable("artist_img_uploads");

})