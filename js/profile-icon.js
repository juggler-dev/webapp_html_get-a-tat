import { readSessionUserData } from "./session-storage.js";

const SESSION_USER_KEY_VALUE = "sessionUser";

console.log("hey");

if (readSessionUserData(SESSION_USER_KEY_VALUE) != null) {
    console.log("user logged in");
  } else {
    console.log("no user");
  }