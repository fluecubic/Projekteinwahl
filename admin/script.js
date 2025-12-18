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

let lastProject = "";



function ui(status) {
  console.log(status)
  if (status == "logedin") {
    document.getElementById("go").style.display = "none"
    document.getElementById("passwort").style.display = "none"
    document.getElementById("Projectname").style.display = "block"
    document.getElementById("MaxUsers").style.display = "block"
    document.getElementById("Go").style.display = "block"
    document.getElementsByTagName("info")[0].innerHTML = ""
    document.getElementById("Projekt").style.display = "block"
    document.getElementById("Name").style.display = "block"
    document.getElementById("add").style.display = "block"
    document.getElementsByTagName("hr")[0].style.display = "block"
    document.getElementsByTagName("hr")[1].style.display = "none"
    document.getElementById("Class5").style.display = "block"
    document.getElementById("Class6").style.display = "block"
    document.getElementById("Class7").style.display = "block"
    document.getElementById("Class8").style.display = "block"
    document.getElementById("Class9").style.display = "block"
    document.getElementById("Class10").style.display = "block"
    document.getElementById("Class11").style.display = "block"
    document.getElementById("Class12").style.display = "block"
    document.getElementsByTagName("label")[0].style.display = "block"
    document.getElementsByTagName("label")[1].style.display = "block"
    document.getElementsByTagName("label")[2].style.display = "block"
    document.getElementsByTagName("label")[3].style.display = "block"
    document.getElementsByTagName("label")[4].style.display = "block"
    document.getElementsByTagName("label")[5].style.display = "block"
    document.getElementsByTagName("label")[6].style.display = "block"
    document.getElementsByTagName("label")[7].style.display = "block"
    document.getElementById("DeleteVotes").style.display = "block"
    document.getElementById("eval").style.display = "block"
    document.getElementById("run").style.display = "block"
  }

  if (status == "logedout") {
    document.getElementById("go").style.display = "block"
    document.getElementById("passwort").style.display = "block"
    document.getElementById("Projectname").style.display = "none"
    document.getElementById("MaxUsers").style.display = "none"
    document.getElementById("Go").style.display = "none"
    document.getElementById("Projekt").style.display = "none"
    document.getElementById("Name").style.display = "none"
    document.getElementById("add").style.display = "none"
    document.getElementsByTagName("hr")[0].style.display = "none"
    document.getElementsByTagName("hr")[1].style.display = "none"
    document.getElementById("Class5").style.display = "none"
    document.getElementById("Class6").style.display = "none"
    document.getElementById("Class7").style.display = "none"
    document.getElementById("Class8").style.display = "none"
    document.getElementById("Class9").style.display = "none"
    document.getElementById("Class10").style.display = "none"
    document.getElementById("Class11").style.display = "none"
    document.getElementById("Class12").style.display = "none"
    document.getElementsByTagName("label")[0].style.display = "none"
    document.getElementsByTagName("label")[1].style.display = "none"
    document.getElementsByTagName("label")[2].style.display = "none"
    document.getElementsByTagName("label")[3].style.display = "none"
    document.getElementsByTagName("label")[4].style.display = "none"
    document.getElementsByTagName("label")[5].style.display = "none"
    document.getElementsByTagName("label")[6].style.display = "none"
    document.getElementsByTagName("label")[7].style.display = "none"
    document.getElementById("DeleteVotes").style.display = "none"
    document.getElementById("eval").style.display = "none"
    document.getElementById("run").style.display = "none"
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
document.getElementById("add").addEventListener("click", addUser)
document.getElementById("DeleteVotes").addEventListener("click", DeleteVotes)
document.getElementById("run").addEventListener("click", evalThis)

async function addProject() {
  if (localStorage.getItem("Key") == adminSnapshot.data().Key){
    const AdddocRef = await addDoc(collection(db, "Projects"), {
       Name: document.getElementById("Projectname").value,
       MaxUsers: Number(document.getElementById("MaxUsers").value),
       Clases: Klassenauswahl(),
       Users: []
       })
  }
  
}


async function addUser() {
  if (localStorage.getItem("Key") == adminSnapshot.data().Key) {
    
  for (const userDoc of userSnapshot.docs) {
    if (userDoc.data().Name == document.getElementById("Name").value) {
      lastProject = userDoc.data().Projekt;
      await updateDoc(doc(db, "User", userDoc.id), { Projekt: document.getElementById("Projekt").value})
    }
  }

  for (const Doc of projectSnapshot.docs) {
    if (Doc.data().Name == document.getElementById("Projekt").value) {
      await updateDoc(doc(db, "Projects", Doc.id), { Users: arrayUnion(document.getElementById("Name").value) })
    }
    if(Doc.data().Name == lastProject){
    await updateDoc(doc(db, "Projects", Doc.id), {
  Users: arrayRemove(document.getElementById("Name").value)
});

    }
  }
    
    
 
}
}

projectSnapshot.forEach(doc => {
  document.getElementById("Projekt").innerHTML += "<option value='" + doc.data().Name + "'>" + doc.data().Name + "</option>"
});


function Klassenauswahl(){

let Klassen = [];
if (document.getElementById("Class5").checked) {
  Klassen[Klassen.length] = "5"
}
if (document.getElementById("Class6").checked) {
  Klassen[Klassen.length] = "6"
}
if (document.getElementById("Class7").checked) {
  Klassen[Klassen.length] = "7"
}
if (document.getElementById("Class8").checked) {
  Klassen[Klassen.length] = "8"
}
if (document.getElementById("Class9").checked) {
  Klassen[Klassen.length] = "9"
}
if (document.getElementById("Class10").checked) {
  Klassen[Klassen.length] = "10"
}
if (document.getElementById("Class11").checked) {
  Klassen[Klassen.length] = "11"
}
if (document.getElementById("Class12").checked) {
  Klassen[Klassen.length] = "12"
}

return Klassen;

}


async function DeleteVotes(){
  console.log("Deleting starts")
  
  if (localStorage.getItem("Key") == adminSnapshot.data().Key){
  for (const userDoc of userSnapshot.docs) {
  await deleteDoc(doc(db, "User", userDoc.id))
    console.log(userDoc.data().Name + "gelöscht")
  }

  for (const Doc of projectSnapshot.docs) {
      await updateDoc(doc(db, "Projects", Doc.id), { Users: [] })
    }
    console.log("Deleting complete")
  }
}

async function evalThis(){
  if (localStorage.getItem("Key") == adminSnapshot.data().Key){
    eval(document.getElementById("eval").value)
    console.log("eval: " + document.getElementById("eval").value)
  }
  
}












