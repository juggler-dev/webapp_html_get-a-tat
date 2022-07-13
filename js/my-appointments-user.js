import { auth, storage, db, provider, providerTwo, requestAppointment, usersCollectionRef, artistsCollectionRef  } from "./main.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged   } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { addDoc, doc, setDoc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

// ===================== GET CURRENT USER =======================
onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('user logged in', user)

    //  document.getElementById('myAppoinmentsUserBtn').addEventListener('click', () => {

    //     window.location.href  = "my-appoinments-user.html"

    

    // }).then(() => {
    //     console.log('hello')
    // })





       
    } else {
      console.log('user logged out');
    }
  });







// get all appointments requested
const querySnapshot = await getDocs(collection(db, "request_appointment"));
querySnapshot.forEach((doc) => {
    
    console.log(doc.id, " => ", doc.data());

    const appointments = doc.data();
    console.log(appointments.artist)
    //   console.log(appointments.(user.name))

    myUserAppointments.innerHTML += 
    `
    <li>Artist: ${appointments.artist} Date: ${appointments.date} Time: ${appointments.time} Location: </li>
    `

})




  

// // get all artists names
// const artistsQuerySnapshot = await getDocs(collection(db, "artists"));
//   artistsQuerySnapshot.forEach((doc) => {
      
//   console.log(doc.id, " => ", doc.data());

//   const artists = doc.data();
//   console.log(artists.full_name)

// })






// class Person {
//     constructor (name, age, height, description) {
//         this.name = name;
//         this.age = age;
//         this.height = height;
//         this.description = description
//     }
// }

// const personForm = document.getElementById("personForm")
// const personArray = [];

// personForm.addEventListener('submit', (event) => {
//     event.preventDefault();

//     const name = document.getElementById("name").value;
//     const age = parseInt(document.getElementById("age").value);
//     const height = document.getElementById("height").value;
//     const description = document.getElementById("description").value;

//     const person = new Person (name, age, height, description);

//     personArray.push(person);
//     console.log(person);

//     document.getElementById("name").value= "";
//     document.getElementById("age").value= "";
//     document.getElementById("height").value= "";
//     document.getElementById("description").value= "";

//     let data = printToScreen(personArray);

//     personList.innerHTML = data;
// })

// function printToScreen(arr) {
//     let listPersonInfo = "";
//     for (let i=0; i < arr.length; i++){
//         console.log(arr[i].name);
//         listPersonInfo += `<li>Name: ${arr[i].name} Age: ${arr[i].age} Height: ${arr[i].height} Description: ${arr[i].description}</li>`;
//     }
//     return listPersonInfo;
// }
