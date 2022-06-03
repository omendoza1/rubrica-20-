import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyALCDXxmZf4fQDgatUU5eazfhNdWnb5EY9",
    authDomain: "company-crud-b6903.firebaseapp.com",
    projectId: "company-crud-b6903",
    storageBucket: "company-crud-b6903.appspot.com",
    messagingSenderId: "37106942654",
    appId: "1:37106942654:web:199ad6184b5850745a94ef"
  };



// Initialize Firebase
app.initializeApp(firebaseConfig);
const dataBase = app.firestore();
const auth = app.auth();

export {dataBase,auth}

