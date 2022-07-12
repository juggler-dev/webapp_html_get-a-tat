import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAw0RBWZgTpqCkdH6B3oWhU9rXjpz7-7Bw",
  authDomain: "juggler-test-project.firebaseapp.com",
  projectId: "juggler-test-project",
  storageBucket: "juggler-test-project.appspot.com",
  messagingSenderId: "1082104770953",
  appId: "1:1082104770953:web:cbef63c511a7248aa3b158",
  measurementId: "G-0CMQ3R7X0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById('clientSignUpButton').addEventListener('click', () => {

  const userEmail = document.getElementById('clientInputEmail').value;
  const userPassword = document.getElementById('clientInputPassword').value;

  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then((res) => {
      console.log(res.user)
    })
    .catch((err) => {
      console.log(err.code)
      console.log(err.message)
    })
})

document.getElementById('artistSignUpButton').addEventListener('click', () => {

  const userEmail = document.getElementById('artistInputEmail').value;
  const userPassword = document.getElementById('artistInputPassword').value;

  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then((res) => {
      console.log(res.user)
    })
    .catch((err) => {
      console.log(err.code)
      console.log(err.message)
    })
})

document.getElementById('clientSignInButton').addEventListener('click', () => {

  const userEmail = document.getElementById('clientInputEmail').value;
  const userPassword = document.getElementById('clientInputPassword').value;

  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then((res) => {
      console.log(res.user)
    })
    .catch((err) => {
      console.log(err.code)
      console.log(err.message)
    })
})

document.getElementById('artistSignInButton').addEventListener('click', () => {

  const userEmail = document.getElementById('artistInputEmail').value;
  const userPassword = document.getElementById('artistInputPassword').value;

  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then((res) => {
      console.log(res.user)
    })
    .catch((err) => {
      console.log(err.code)
      console.log(err.message)
    })
})

document.getElementById('clientAddData').addEventListener('click', async () => {

  const clientName = document.getElementById('clientInputName').value;
  const clientPhone = document.getElementById('clientInputPhone').value;
  const clientCity = document.getElementById('clientInputCity').value;

  const docRef = await addDoc(collection(db, "client"), {
    name: clientName,
    phone: clientPhone,
    city: clientCity,
  });
  console.log("Document written with ID: ", docRef.id);
})

document.getElementById('artistAddData').addEventListener('click', async () => {

  const artistName = document.getElementById('artistInputName').value;
  const artistPhone = document.getElementById('artistInputPhone').value;
  const artistCity = document.getElementById('artistInputCity').value;

  const docRef = await addDoc(collection(db, "artist"), {
    name: artistName,
    phone: artistPhone,
    city: artistCity,
  });
  console.log("Document written with ID: ", docRef.id);
})

// document.getElementById('addAppoinment').addEventListener('click', async () => {

//   const requestedArtist = document.getElementById('userInputRequestedArtist').value;
//   const requestedDate = document.getElementById('userInputRequestedDate').value;

//   const docRef = await addDoc(collection(db, "appoinments"), {
//     artist: requestedArtist,
//     date: requestedDate
//   });
//   console.log("Document written with ID: ", docRef.id);
// })

// document.getElementById('getData').addEventListener('click', async () => {

//   const userEmail = document.getElementById('userInputEmail').value;
//   const userPassword = document.getElementById('userInputPassword').value;
//   const userDocId = document.getElementById('userInputDocId').value;

//   const docRef = doc(db, "artist", userDocId);
//   const docSnap = await getDoc(docRef);
  
//   if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data());
//   } else {
//     // doc.data() will be undefined in this case
//     console.log("No such document!");
//   }
// })

// document.getElementById('getAllClients').addEventListener('click', async () => {

//   const clientdb = collection(db, "client");

//   const q = query(clientdb, where("name", "==", true));

//   const querySnapshot = await getDocs(q);
//   // console.log(querySnapshot);
//   querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
//   });

// })

document.getElementById('savePicture').addEventListener('click', async () => {

  const userFile = document.getElementById('imageFile').files[0];

  // const myFile = new File(userFile, "testString", {type: userFile.type })

  console.log(userFile.name);

  // Create a reference to 'images/mountains.jpg'
const storegeRef = ref(storage, 'testing/testinpic.png');

uploadBytes(storegeRef, userFile).then((snapshot) => {
  console.log(snapshot);
});

})

// document.getElementById('displayImage').addEventListener('click', async () => {

//   const imageRef = ref(storage, 'testing/starkiller_wallpaper.jpg');
//   const divContainer = document.getElementById("imageDisplay");

//   getDownloadURL(imageRef)
//     .then((url) => {
//       console.log(url);
//       divContainer.innerHTML += `<img src='${url}'></img>`
//     })
//     .catch((error) => {
//       switch (error.code) {
//         case 'storage/object-not-found':
//           console.log("storage/object-not-found");
//           break;
//         case 'storage/unauthorized':
//         case 'storage/object-not-found':
//           console.log("storage/unauthorized");
//           break;
//         case 'storage/canceled':
//           console.log("storage/canceled");
//           break;
//         case 'storage/unknown':
//           console.log("storage/unknown");
//           break;
//       }
//     });
// })

document.getElementById('displayGallery').addEventListener('click', async () => {

  const imageRef1 = ref(storage, 'testing/tattoo1.jpg');
  const imageRef2 = ref(storage, 'testing/tattoo2.jpg');
  const imageRef3 = ref(storage, 'testing/tattoo3.jpg');

  // let imageRef = [ref(storage, 'testing/tattoo1.jpg'), ref(storage, 'testing/tattoo2.jpg'), ref(storage, 'testing/tattoo3.jpg'), ref(storage, 'testing/tattoo4.jpg'), ref(storage, 'testing/tattoo5.jpg'), ref(storage, 'testing/tattoo6.jpg'), ref(storage, 'testing/tattoo7.jpg'), ref(storage, 'testing/tattoo8.jpg')]

  const divContainer = document.getElementById("imageDisplay");

  // for (let i = 0; i < 8; i++) {
  //   getDownloadURL(imageRef[0])
  //     .then((url) => {
  //       console.log(url);
  //       divContainer.innerHTML += `<img src='${url}'></img>`
  //     })
  //     .catch((error) => {
  //       switch (error.code) {
  //         case 'storage/object-not-found':
  //           console.log("storage/object-not-found");
  //           break;
  //         case 'storage/unauthorized':
  //         case 'storage/object-not-found':
  //           console.log("storage/unauthorized");
  //           break;
  //         case 'storage/canceled':
  //           console.log("storage/canceled");
  //           break;
  //         case 'storage/unknown':
  //           console.log("storage/unknown");
  //           break;
  //       }
  //     });
  // }

  getDownloadURL(imageRef1)
  .then((url) => {
    console.log(url);
    divContainer.innerHTML += `<img src='${url}'></img>`
  })
  .catch((error) => {
    switch (error.code) {
      case 'storage/object-not-found':
        console.log("storage/object-not-found");
        break;
      case 'storage/unauthorized':
      case 'storage/object-not-found':
        console.log("storage/unauthorized");
        break;
      case 'storage/canceled':
        console.log("storage/canceled");
        break;
      case 'storage/unknown':
        console.log("storage/unknown");
        break;
    }
  });

  getDownloadURL(imageRef2)
  .then((url) => {
    console.log(url);
    divContainer.innerHTML += `<img src='${url}'></img>`
  })
  .catch((error) => {
    switch (error.code) {
      case 'storage/object-not-found':
        console.log("storage/object-not-found");
        break;
      case 'storage/unauthorized':
      case 'storage/object-not-found':
        console.log("storage/unauthorized");
        break;
      case 'storage/canceled':
        console.log("storage/canceled");
        break;
      case 'storage/unknown':
        console.log("storage/unknown");
        break;
    }
  });

  getDownloadURL(imageRef3)
  .then((url) => {
    console.log(url);
    divContainer.innerHTML += `<img src='${url}'></img>`
  })
  .catch((error) => {
    switch (error.code) {
      case 'storage/object-not-found':
        console.log("storage/object-not-found");
        break;
      case 'storage/unauthorized':
      case 'storage/object-not-found':
        console.log("storage/unauthorized");
        break;
      case 'storage/canceled':
        console.log("storage/canceled");
        break;
      case 'storage/unknown':
        console.log("storage/unknown");
        break;
    }
  });

})






