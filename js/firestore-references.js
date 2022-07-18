import { db } from "./firebase-init.js";
import { collection } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

const CLIENTS_COLLECTION_REFERENCE = collection(db,'clients');
const ARTISTS_COLLECTION_REFERENCE = collection(db, 'artists');
const REQUEST_APPOINTMENTS_COLLECTION_REFERENCE = collection(db, 'request_appointment');

export { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE, REQUEST_APPOINTMENTS_COLLECTION_REFERENCE };