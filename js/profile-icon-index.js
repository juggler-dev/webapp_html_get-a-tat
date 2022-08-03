
import { auth, storage, db } from "./firebase-init.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE, REQUEST_APPOINTMENTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { collection, doc, getDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { storeSessionUserData, readSessionUserData } from "./session-storage.js";

const SESSION_USER_KEY_VALUE = "sessionUser";
const USER_TYPE_CLIENT = "client";
const USER_TYPE_ARTIST = "artist";
const ARTIST_COLLECTION = "artists";





// if (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == 'artist'){
//   console.log('user is logged in');

//   const artistButton = document.getElementById("dropdownMenuButton");
//   const anchorTag = document.getElementById("loginButtonAnchorTag");

//   console.log(artistButton);
//   console.log(anchorTag);

//   const myIcon = document.createElement("img");
//   const imgSrc = document.createAttribute("src");
//   imgSrc.value = "../icons/user-icon.png";
//   myIcon.setAttributeNode(imgSrc);
//   anchorTag.appendChild


// }

// Open menu
const btnMenu = document.getElementById('openMenu');

btnMenu.addEventListener('click', function(){
  document.body.classList.toggle('menu-open');
});

// get features artists

//Get info from artist
async function getArtistInfo(artistId) {
  // Query
  const artistInfoRef = doc(db, "artists", "uid");
  const artistInfo = await getDoc(artistInfoRef);

  const artistProfilePhotoUrl = await getArtistProfileUrl(artistId)
  console.log(artistProfilePhotoUrl);

  return buildUploadedArtistBioSmall(artistInfo, artistProfilePhotoUrl)
}


//////////////////////////////

// if no user move to login when clicking "booking"
const bookingLink3 = document.getElementById('bookingLink');
bookingLink3.addEventListener('click', function(){
if (readSessionUserData(SESSION_USER_KEY_VALUE) == null) {
  alert('please log in to access this function')
  window.location.href  = "../pages/login-client.html";

}
});

const bookingLink4 = document.getElementById('bookingLink2');
bookingLink4.addEventListener('click', function(){
if (readSessionUserData(SESSION_USER_KEY_VALUE) == null) {
  alert('please log in to access this function')

  window.location.href  = "../pages/login-client.html";
}
});

// if no user move to login when clicking user icon
const userIconLogin = document.getElementById('buttonDropdownMenuMobile');
userIconLogin.addEventListener('click', function(){
  if (readSessionUserData(SESSION_USER_KEY_VALUE) == null) {
  
    window.location.href  = "../pages/login-client.html";
  }
  });

// move to explorer page
const showExplorerPage = document.getElementById('showExplorerPage');
showExplorerPage.addEventListener('click', function(){
  window.location.href  = "../pages/tattoo-explorer-main.html";
});

// login menu

if  (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == 'artist') {
  console.log('user is logged in');
  console.log(readSessionUserData(SESSION_USER_KEY_VALUE).user_type);

  const anchorTag = document.getElementById("loginButtonAnchorTag");
  
  

  if( typeof(anchorTag) != undefined && anchorTag != null){
    anchorTag.remove();
  }
  
  const artistButton = document.getElementById("dropdownMenuButton");
  console.log(artistButton);

  const myIcon = document.createElement("img");
  const imgSrc = document.createAttribute("src");
  imgSrc.value = "icons/user-icon.png";
  myIcon.setAttributeNode(imgSrc);
  artistButton.appendChild(myIcon);

  artistButton.addEventListener("click", () => {

  const artistMenu = document.getElementById("artistDropdownMenu");
 
    if (artistMenu.style.display === "block") {
      artistMenu.style.display = "none";
    } else {
      artistMenu.style.display = "block";
    }

    const artistName = document.getElementById("artistName");
    console.log(artistName);

    artistName.innerHTML = readSessionUserData(SESSION_USER_KEY_VALUE).full_name;
    
  });

  const artistButtonMobile = document.getElementById("buttonDropdownMenuMobile");

  artistButtonMobile.addEventListener("click", () => {
    const artistMenu = document.getElementById("artistDropdownMenu");
 
    if (artistMenu.style.display === "block") {
      artistMenu.style.display = "none";
    } else {
      artistMenu.style.display = "block";
    }

    const artistName = document.getElementById("artistName");
    console.log(artistName);

    artistName.innerHTML = readSessionUserData(SESSION_USER_KEY_VALUE).full_name;

  })


} else if  (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == 'client') {
  console.log('logged in');
  console.log(readSessionUserData(SESSION_USER_KEY_VALUE).user_type);

  const clientAnchorTag = document.getElementById("loginButtonAnchorTag");
  if( typeof(clientAnchorTag) != undefined && clientAnchorTag != null){
    clientAnchorTag.remove();
  }
  

  const clientButton = document.getElementById("dropdownMenuButton");
  
  const myIcon = document.createElement("img");
  const imgSrc = document.createAttribute("src");
 
  imgSrc.value = "icons/user-icon.png";

  myIcon.setAttributeNode(imgSrc);

  clientButton.appendChild(myIcon);

  clientButton.addEventListener("click", () => {

    const clientMenu = document.getElementById("clientDropdownMenu");

    if (clientMenu.style.display === "block") {
      clientMenu.style.display = "none";
    } else {
      clientMenu.style.display = "block";
    }

    const clientName = document.getElementById("clientName");

    clientName.innerHTML = readSessionUserData(SESSION_USER_KEY_VALUE).full_name;


  })

  const artistButtonMobile = document.getElementById("buttonDropdownMenuMobile");

  artistButtonMobile.addEventListener("click", () => {
    const artistMenu = document.getElementById("artistDropdownMenu");
 
    if (artistMenu.style.display === "block") {
      artistMenu.style.display = "none";
    } else {
      artistMenu.style.display = "block";
    }

    const artistName = document.getElementById("artistName");
    console.log(artistName);

    artistName.innerHTML = readSessionUserData(SESSION_USER_KEY_VALUE).full_name;

  })

} else {
  console.log('no user'); 
}

// Logout
const logout = document.getElementById('signOutBtn');

logout.addEventListener('click',(e) => {
  sessionStorage.clear();
  console.log('user logged out')
  window.location.href  = "../index.html";
})

const logout2 = document.getElementById('signOutBtn2');

logout2.addEventListener('click',(e) => {
  sessionStorage.clear();
  console.log('user logged out 2')
  window.location.href  = "../index.html";
})


// move to correct booking site when user are logged in
const bookingLink = document.getElementById('bookingLink');
bookingLink.addEventListener('click', function(){

  if (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == USER_TYPE_ARTIST) {
    window.location.href  = "../pages/appointment-management-artist.html";
  } else if (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == USER_TYPE_CLIENT) {
    window.location.href  = "../pages/appointment-management-client.html";
  }

});

const bookingLink2 = document.getElementById('bookingLink2');
bookingLink2.addEventListener('click', function(){

  if (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == USER_TYPE_ARTIST) {
    window.location.href  = "../pages/appointment-management-artist.html";
  } else if (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == USER_TYPE_CLIENT) {
    window.location.href  = "../pages/appointment-management-client.html";
  }
  
});


