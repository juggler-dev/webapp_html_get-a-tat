


import { storeSessionUserData, readSessionUserData } from "./session-storage.js";

const SESSION_USER_KEY_VALUE = "sessionUser";
const USER_TYPE_CLIENT = "client";
const USER_TYPE_ARTIST = "artist";




console.log("hey");


if (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == 'client'){
  console.log('logged in');
  console.log(readSessionUserData(SESSION_USER_KEY_VALUE).user_type);

  const clientAnchorTag = document.getElementById("clientLoginButtonAnchorTag");
  clientAnchorTag.remove();

  const clientButton = document.getElementById("dropdownMenuClientButton");
  
  const myIcon = document.createElement("img");
  const imgSrc = document.createAttribute("src");
 
  imgSrc.value = "../icons/user-icon.png";

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
}


// if (readSessionUserData(SESSION_USER_KEY_VALUE) != null) {
//   console.log("user.log")

//   // const auth = getAuth();
//   // const user = auth.currentUser;

//   // db.collection("storie").where("author", "==", user.uid).get()
//   // // onAuthStateChanged(auth, (user) => {
//   // //  if (user) {
//   // //   // User is signed in, see docs for a list of available properties
//   // //   // https://firebase.google.com/docs/reference/js/firebase.User
//   // //   const uid = user.uid;
//   // //   console.log(uid);
//   // //   const type = uid.user_type;
//   // //   console.log(type);
//   // //   // ...
//   // // } else {
//   // //   // User is signed out
//   // //   // ...
//   // // }
// }

  // const ARTISTS_COLLECTION_REFERENCE = collection(db, 'artists');


  // if(artists.data.user_type == USER_TYPE_ARTIST) {
  //   console.log("artist.log");
  // }

    // console.log("user logged in");

    // const anchorTag = document.getElementById("loginButtonAnchorTag");
    // anchorTag.remove();

    // const myButton = document.getElementById("myLoginButton");
    // const myIcon = document.createElement("img");
    // const imgSrc = document.createAttribute("src");
   
    // imgSrc.value = "../icons/user-icon.png";

    // myIcon.setAttributeNode(imgSrc);

    // myButton.appendChild(myIcon);



  //  else {
  //   console.log("no user");
  // }




  // if (readSessionUserData(SESSION_USER_KEY_VALUE)) {
  //   console.log("user logged in");

    // const anchorTag = document.getElementById("loginButtonAnchorTag");
    // anchorTag.remove();

    // const artistButton = document.getElementById("dropdownMenuArtist");

    // const myIcon = document.createElement("img");
    // const imgSrc = document.createAttribute("src");
   
    // imgSrc.value = "../icons/user-icon.png";

    // myIcon.setAttributeNode(imgSrc);

    // artistButton.appendChild(myIcon);

    



  // } else {
  //   console.log("no user");
  // }




