import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, arrayUnion   } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";






let Vorname;
let Nachname;
let Name;
let Projekt;


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

if (!localStorage.getItem("Name") || localStorage.getItem("Name") == "") {
    UI("logedout")
     document.getElementById("go").addEventListener("click", async function () {
     Vorname = document.getElementById("name").value;
     Nachname = document.getElementById("surname").value;
     Name = Vorname + " " + Nachname;

     localStorage.setItem("Name", Name)
     localStorage.setItem("Vorname", Vorname)
     localStorage.setItem("Nachname", Nachname)
     
     const AdddocRef = await addDoc(collection(db, "Users"), {
     Name: Name,
     Vorname: Vorname,
     Nachname: Nachname
     })
 
     UI("choose")
})   
    } else {
     Name = localStorage.getItem("Name");
     Vorname = localStorage.getItem("Vorname");
     Nachname = localStorage.getItem("Nachname");

     const q = query(collection(db, "Users")); 
     const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      if (doc.data().Name == Name) {
        if (doc.data().Projekt) {
            Projekt = doc.data().Projekt
            UI("done")
        } else {
            UI("choose")
        }
      }  
    }
     
    }

    function UI(status) {
        if (status == "logedout") {
            document.getElementById("name").style.display = "block"
            document.getElementById("surname").style.display = "block"
            document.getElementById("go").style.display = "block"
            document.getElementsByClassName("info")[0].style.display = "block"
            document.getElementsByClassName("info")[1].style.display = "block"
            document.getElementsByClassName("info")[2].style.display = "block"
            document.getElementById("projects").style.display = "none"
        }

        if (status == "choose") {
            document.getElementById("name").style.display = "none"
            document.getElementById("surname").style.display = "none"
            document.getElementById("go").style.display = "block"
            document.getElementsByClassName("info")[0].innerHTML = "Hallo, " + Name + ". Wähle ein Projekt"
            document.getElementsByClassName("info")[1].style.display = "none"
            document.getElementsByClassName("info")[2].style.display = "none"
            document.getElementById("projects").style.display = "block"
        }
    }


   async function loadProjects() {
     const q = query(collection(db, "Users")); 
     const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot) {

     }
    }
    