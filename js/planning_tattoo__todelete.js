import { auth, storage, db, provider, providerTwo, requestAppointment, usersCollectionRef, artistsCollectionRef  } from "./main.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged   } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";


// Disable past and current date
const today = new Date().toISOString().split('T')[0];
document.getElementsByName("timePicker")[0].setAttribute('min', today);



// ============ Current user request an appointment ==============
onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('user logged in', user)
 
    requestBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // const userFile = document.getElementById('choosePicture').files[0];

        // console.log(userFile.name);

        // // Create a reference to 'images/mountains.jpg'
        // const storegeRef = ref(storage, 'appointment/' + user.email + user.uid);
        // const appointmentPhoto = ref(storage, 'appointment-request-photo/images' + user.uid);

        // const imageBlob = canvas.toBlob(handleBlob, 'image/png');


       
        // send appoint data request  
        setDoc(doc(requestAppointment), {
            artist: document.getElementById('artistsListOutput').value,
            placement: document.getElementById('placement').value,
            size: document.getElementById('size').value,
            allergies: document.getElementById('allergies-health').value,
            description: document.getElementById('short-description').value,
            color: document.getElementById('color').value,
            // date: document.getElementById('datePicker').value,
            date_time: document.getElementById('timePicker').value,
            // file_name: userFile.name,
            image: document.getElementById('image').value,
            uid: user.uid
    
        }).then(() => {

          const userFile = document.getElementById('choosePicture').files[0];

          // console.log(userFile.name);
  
          // Create a reference to 'images/mountains.jpg'
          const storegeRef = ref(storage, 'appointment/' + user.email + user.uid);
            console.log('Request sent')
            uploadBytes(storegeRef, userFile).then((snapshot) => {
              
                console.log(snapshot);
              });
              // const storage = getStorage();
              const appointmentPhoto = ref(storage, 'appointment-request-photo/images' + user.uid);

              const imageBlob = canvas.toBlob(handleBlob, 'image/png');
            uploadBytes(appointmentPhoto, imageBlob).then((snapshot) => {
                console.log('uploaded a blob');
                console.log(snapshot)

            })
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

// blob function
function handleBlob(blob) {
  const objectURL = window.URL.createObjectURL(blob);
  console.log('ObjectURL:', objectURL);
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    console.log('Base64:', reader.result);
    document.getElementById('image').value = reader.result;
    // const imageInput = document.getElementById('image');
    // imageInput.value = reader.result;


  });
  reader.readAsDataURL(blob);
}

// start camera
let camBtn = document.getElementById('startCam');
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');

camBtn.addEventListener('click', async function() {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false});
  video.srcObject = stream;

  showCamera(true)
});

 // stop camera
document.getElementById('stopCam').addEventListener('click', () => {
  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());

  showCamera(false);
});
 
// take photo
takePhoto.addEventListener('click', function(){
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  // // const storage = getStorage();
  // const appointmentPhoto = ref(storage, 'appointment-request-photo/images' + Date());

  // const imageBlob = canvas.toBlob(handleBlob, 'image/png');

  // uploadBytes(appointmentPhoto, imageBlob).then((snapshot) => {
  //     console.log('uploaded a blob');
  //  })

});
    