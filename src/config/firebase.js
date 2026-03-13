// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Import các hàm từ firebase/storage
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref, get, update, push, onValue, remove, set,onDisconnect } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQGypTleXP89sagSbb4jUjmG8ORPhb5YU",
  authDomain: "book4-e8fe8.firebaseapp.com",
  projectId: "book4-e8fe8",
storageBucket: "book4-e8fe8.appspot.com",
    databaseURL: "https://book4-e8fe8-default-rtdb.asia-southeast1.firebasedatabase.app", 
  messagingSenderId: "666188564095",
  appId: "1:666188564095:web:89868613efbcee6673214a",
  measurementId: "G-BMFRHQ6HLQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Database
const database = getDatabase(app);

// Initialize Firebase Storage
const storage = getStorage(app); // Định nghĩa storage

// Export các hàm và đối tượng cần thiết
export { database, ref, get, update, push, onValue, remove, set, storage, uploadBytes, getDownloadURL,onDisconnect };
