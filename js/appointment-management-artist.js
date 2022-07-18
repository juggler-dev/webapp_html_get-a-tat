import { db, storage } from "./firebase-init.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { collection, doc, getDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

// Variables =====================
let userUID = "";

function drawNewTableRow(clientName, appoinmentDescription, appointmentDate, row){
    let name = row.insertCell(0);
    let description = row.insertCell(1);
    let date = row.insertCell(2);

    // //Thumbnail calling
    // const imageRef = ref(storage, userUID+ '/' +imgName);

    // getDownloadURL(imageRef)
    // .then((url) => {
    //     thumbnail.innerHTML += `<img src='${url}' class="thumbnail-image"></img>`
    // })

    //Name
    name.innerHTML = `<p>${clientName}</p>`;
    description.innerHTML = `<p>${appoinmentDescription}</p>`;
    date.innerHTML = `<p>${appointmentDate}</p>`;
}

async function updateTable(collectionName) {
    //Table Name
    appointmentTable.innerHTML = "";

    //Query
    const appointmentQuery = query(collection(db, collectionName), where("artist_id", "==", "0QZE1DOE8LXDg9P50VcBoBzkNo32"));
    const artistAppointments = await getDocs(appointmentQuery);
    artistAppointments.forEach((doc) => {
        drawNewTableRow(doc.data().uid, doc.data().description, doc.data().date, appointmentTable.insertRow(0))
    });
}

// Events

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        // console.log('user logged in', user)
        console.log(user.uid);
        // console.log(user.email);
        userUID = user.uid;

        // ...
    } else {
        // User is signed out
        // ...

        console.log('user logged out');
    }
});

updateTable("request_appointment");

