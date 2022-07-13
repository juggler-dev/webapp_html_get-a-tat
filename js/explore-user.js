import { auth, storage  } from "./main.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";


// document.getElementById('displayGallery').addEventListener('click', async () => {
//   alert("Image is loaded");
//   let counter;

//   for(let counter = 1; counter < 9; counter++){
  
//    // console.log(`testing/tattoo${counter.toString()}.jpg}`);
   
//    let myImage;
//    const divContainer = document.getElementById("imageDisplay");
  
//    myImage = ref(storage,`testing/tattoo${counter.toString()}.jpg`);
  
//    getDownloadURL(myImage)
//       .then((url) => {
  
//         console.log(url);
//         divContainer.innerHTML += `<img src='${url}'></img>`;
//       })
//         .catch((error) => {
//           switch (error.code) {
//             case 'storage/object-not-found':
//               console.log("storage/object-not-found");
//               break;
//             case 'storage/unauthorized':
//             case 'storage/object-not-found':
//               console.log("storage/unauthorized");
//               break;
//             case 'storage/canceled':
//               console.log("storage/canceled");
//               break;
//             case 'storage/unknown':
//               console.log("storage/unknown");
//               break;
//           }
//         });
//       }
// });




window.onload = () => {


  // alert("Image is loaded");
  let counter;

  for(let counter = 1; counter < 9; counter++){
  
   // console.log(`testing/tattoo${counter.toString()}.jpg}`);
   
   let myImage;
   const divContainer = document.getElementById("imageDisplay");
  
   myImage = ref(storage,`testing/tattoo${counter.toString()}.jpg`);
  
   getDownloadURL(myImage)
      .then((url) => {
  
        console.log(url);
        divContainer.innerHTML += `<img src='${url}'></img>`;
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
      }

    }



    



