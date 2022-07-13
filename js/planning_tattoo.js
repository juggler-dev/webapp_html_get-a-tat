import { auth, storage, db, provider, providerTwo, requestAppointment, usersCollectionRef, artistsCollectionRef  } from "./main.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged   } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";


// Disable past and current date
const today = new Date().toISOString().split('T')[0];
document.getElementsByName("datePicker")[0].setAttribute('min', today);



// ============ Current user request an appointment ==============
onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('user logged in', user)
 
      requestBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const userFile = document.getElementById('choosePicture').files[0];

        console.log(userFile.name);

        // Create a reference to 'images/mountains.jpg'
        const storegeRef = ref(storage, 'appointment/' + user.email + user.uid);

       
        // send appoint data request  
        setDoc(doc(requestAppointment), {
            artist: document.getElementById('artistsListOutput').value,
            placement: document.getElementById('placement').value,
            size: document.getElementById('size').value,
            allergies: document.getElementById('allergies-health').value,
            description: document.getElementById('short-description').value,
            color: document.getElementById('color').value,
            date: document.getElementById('datePicker').value,
            time: document.getElementById('timePicker').value,
            photo_name: userFile.name,
            uid: user.uid
    
        }).then(() => {
            console.log('Request sent')
            uploadBytes(storegeRef, userFile).then((snapshot) => {
                console.log(snapshot);
              });
        })
    })
    } else {
      console.log('User logged out. Need to be logged in to request an appointment');
  
    }
  });

    const artistsQuerySnapshot = await getDocs(collection(db, "artists"));
    artistsQuerySnapshot.forEach((doc) => {
        
        console.log(doc.id, " => ", doc.data());

        const artists = doc.data();
        console.log(artists.full_name)

        artistsListOutput.innerHTML += 
        `
            <div>
                <select>
                    <option>
                    ${artists.full_name}
                    </option>
                </select>
            </div>
        `
    })

 

    