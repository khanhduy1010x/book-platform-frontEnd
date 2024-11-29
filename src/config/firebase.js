// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Import các hàm từ firebase/storage
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref, get, update, push, onValue, remove, set,onDisconnect } from "firebase/database";

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

// Initialize Firebase Database
const database = getDatabase(app);

// Initialize Firebase Storage
const storage = getStorage(app); // Định nghĩa storage

// Export các hàm và đối tượng cần thiết
export { database, ref, get, update, push, onValue, remove, set, storage, uploadBytes, getDownloadURL,onDisconnect };
