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



function ui(status) {
  console.log(status)
  if (status == "logedin") {
    document.getElementById("go").style.display = "none"
    document.getElementById("passwort").style.display = "none"
    document.getElementById("Projectname").style.display = "block"
    document.getElementById("MaxUsers").style.display = "block"
    document.getElementById("Class").style.display = "block"
    document.getElementById("Go").style.display = "block"
    document.getElementsByTagName("info")[0].innerHTML = ""
    document.getElementById("Users").style.display = "block"
    document.getElementById("Name").style.display = "block"
    document.getElementById("add").style.display = "block"
    document.getElementsByTagName("hr")[0].style.display = "block"
  }

  if (status == "logedout") {
    document.getElementById("go").style.display = "block"
    document.getElementById("passwort").style.display = "block"
    document.getElementById("Projectname").style.display = "none"
    document.getElementById("MaxUsers").style.display = "none"
    document.getElementById("Class").style.display = "none"
    document.getElementById("Go").style.display = "none"
    document.getElementById("Users").style.display = "none"
    document.getElementById("Name").style.display = "none"
    document.getElementById("add").style.display = "none"
    document.getElementsByTagName("hr")[0].style.display = "none"
  }
}

ui("logedout")

function login() {
   if (document.getElementById("passwort").value == adminSnapshot.data().Key) {
    ui("logedin")
    localStorage.setItem("Key",  document.getElementById("passwort").value)
   } else {
    document.getElementsByTagName("info")[0].innerHTML = "Schlüssel Falsch"
   } 
}

if (localStorage.getItem("Key") == adminSnapshot.data().Key) {
  ui("logedin")
}


document.getElementById("go").addEventListener("click", login)
document.getElementById("Go").addEventListener("click", addProject)

async function addProject() {
  if (localStorage.getItem("Key") == adminSnapshot.data().Key){
    const AdddocRef = await addDoc(collection(db, "Projects"), {
       Name: document.getElementById("Projectname").value,
       MaxUsers: Number(document.getElementById("MaxUsers").value),
       minClass: Number(document.getElementById("Class").value),
       Users: []
       })
  }
  
}


async function addUser() {
  if (localStorage.getItem("Key") == adminSnapshot.data().Key) {
    
  for (const doc of userSnapshot) {
    if (doc.data().Name == document.getElementById("Name").value) {
      await updateDoc(doc(db, "User", doc.id), { Projekt: document.getElementById("Users").value})
    }
  }
    
 
}
}

projectSnapshot.forEach(doc => {
  document.getElementById("Users").innerHTML += "<option value='" + doc.data().Name + "'>" + doc.data().Name + "</option>"
});
