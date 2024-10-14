// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {set, getDatabase, ref,get,update, push ,onValue, remove } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_mXFarusK6wPKvTQhto1NMkthSJusQIY",
  authDomain: "duancuoi-55096.firebaseapp.com",
  projectId: "duancuoi-55096",
  storageBucket: "duancuoi-55096.appspot.com",
  messagingSenderId: "991422442200",
  appId: "1:991422442200:web:817014cb6d19c5a3ca05ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
export{database, ref,get,update, push ,onValue, remove,set}

export const storage = getStorage(app);