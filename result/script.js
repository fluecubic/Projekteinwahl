import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, arrayUnion, arrayRemove   } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0Xp9IRIk9FzDrIEDIlVUUbW4nI31ebb4",
  authDomain: "projekteinwahl.firebaseapp.com",
  projectId: "projekteinwahl",
  storageBucket: "projekteinwahl.firebasestorage.app",
  messagingSenderId: "198530664417",
  appId: "1:198530664417:web:14cb7e9137d3cbbe9474a0",
  measurementId: "G-B47SX5TV37"
};

const db = getFirestore(initializeApp(firebaseConfig));

const userSnapshot = await getDocs(query(collection(db, "User"), orderBy("Klasse", "desc")));
const projectSnapshot = await getDocs(query(collection(db, "Projects"), orderBy("Name", "desc")));

userSnapshot.forEach(element => {
   document.getElementById("Users").innerHTML += "<tr><td>" + element.data().Klasse + "</td><td>" + element.data().Nachname + "</td><td>" +  element.data().Vorname + "</td><td>" + element.data().Projekt + "</td></tr>"
});

projectSnapshot.forEach(element => {
   document.getElementById("Projects").innerHTML += "<tr><td>" + element.data().Name + "</td><td>" + element.data().Users + "</td><td>" +  element.data().Users.length + "/" + element.data().MaxUsers + "</td></tr>"
});