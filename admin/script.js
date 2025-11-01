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
const adminSnapshot = await getDoc(doc(db, "admin", "admin"))

function login() {
   if (document.getElementById("passwort").value == adminSnapshot.data().Key) {
    
   } else {
    document.getElementsByTagName("info")[0].innerHTML = "Schlüssel Falsch"
   } 
}


document.getElementById("go").addEventListener("click", login)