import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";  
import { getDoc, addDoc, doc, getFirestore, getDocs, getDocFromCache, collection, updateDoc, Timestamp, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, arrayUnion, arrayRemove   } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";






let Vorname;
let Nachname;
let Name;
let Projekt;
 let Klasse;
let Status = "logedout"

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


const q = query(collection(db, "User")); 
const querySnapshot = await getDocs(q);

 async function login() {
     Vorname = document.getElementById("name").value;
     Nachname = document.getElementById("surname").value;
     Name = Vorname + " " + Nachname;
     Klasse  = document.getElementById("class").value;


     localStorage.setItem("Name", Name)
     localStorage.setItem("Vorname", Vorname)
     localStorage.setItem("Nachname", Nachname)
     
     let found = false;
     for (const doc of querySnapshot.docs) {
      if (doc.data().Name == Name) {
       found = true
       Klasse = doc.data().Klasse
      }  
    }

    
    if (!found) {
      const AdddocRef = await addDoc(collection(db, "User"), {
     Name: Name,
     Vorname: Vorname,
     Nachname: Nachname,
     Klasse: Klasse,
     Projekt: ""
     })
    }
     
 
     UI("choose")
}   


document.getElementById("go").addEventListener("click", function () {
      if (Status == "logedout") {
        login()
      } else if(Status == "choose"){
        setProject()
      } else if(Status == "done"){
        reset()
        
      }
     })



if (!localStorage.getItem("Name") || localStorage.getItem("Name") == "") {
    UI("logedout")



    
    } else {
     Name = localStorage.getItem("Name");
     Vorname = localStorage.getItem("Vorname");
     Nachname = localStorage.getItem("Nachname");



    for (const doc of querySnapshot.docs) {
      
      if (doc.data().Name == Name) {
        Klasse = doc.data().Klasse;
        if (doc.data().Projekt && doc.data().Projekt != "") {
            Projekt = doc.data().Projekt
            UI("done")
        } else {
            UI("choose")
        }
      }  else {
      }
    }
     
    }
  
    function UI(status) {

      console.log(status)
      Status = status;
        if (status == "logedout") {
            document.getElementById("name").style.display = "block"
            document.getElementById("surname").style.display = "block"
            document.getElementById("go").style.display = "block"
            document.getElementById("go").innerHTML = "Weiter"
            document.getElementsByClassName("info")[0].style.display = "block"
            document.getElementsByClassName("info")[1].style.display = "block"
            document.getElementsByClassName("info")[2].style.display = "block"
            document.getElementsByClassName("zeileninfo")[0].style.display = "none"
            document.getElementsByClassName("zeileninfo")[1].style.display = "none"
            document.getElementById("projects").style.display = "none"
            document.getElementById("class").style.display = "block"
        }

        if (status == "choose") {
            document.getElementById("name").style.display = "none"
            document.getElementById("surname").style.display = "none"
            document.getElementById("go").style.display = "block"
            document.getElementById("go").innerHTML = "Fertig"
            document.getElementsByClassName("info")[0].innerHTML = "Hallo, " + Name + ". Wähle ein Projekt"
            document.getElementsByClassName("info")[1].style.display = "none"
            document.getElementsByClassName("info")[2].style.display = "none"
            document.getElementById("projects").style.display = "block"
            document.getElementsByClassName("zeileninfo")[0].style.display = "block"
            document.getElementsByClassName("zeileninfo")[1].style.display = "block"
            document.getElementById("class").style.display = "none"
            loadProjects()
        }

        if (status == "done") {
          document.getElementById("name").style.display = "none"
          document.getElementById("surname").style.display = "none"
          document.getElementById("go").style.display = "block"
          document.getElementById("go").innerHTML = "Ändern"
          document.getElementsByClassName("info")[0].innerHTML = "Hallo, " + Name + ". Du bist im Projekt " + Projekt;
          document.getElementsByClassName("info")[1].style.display = "none"
          document.getElementsByClassName("info")[2].style.display = "none"
          document.getElementsByClassName("zeileninfo")[0].style.display = "none"
          document.getElementsByClassName("zeileninfo")[1].style.display = "none"
          document.getElementById("projects").style.display = "none"
          document.getElementById("class").style.display = "none"

        }
    }


   async function loadProjects() {
     const q = query(collection(db, "Projects")); 
     const querySnapshot = await getDocs(q);
     console.log("loading...")

     let html = "";
    for (const doc of querySnapshot.docs) {
      if (doc.data().Users.length < doc.data().MaxUsers ) {
      if (doc.data().minClass <= Number(Klasse.charAt(0)) || Klasse.charAt(0) == "1") { 

        html += "<div class='project' id='" + doc.data().Name +"'><p class='projectName'>" + doc.data().Name + "</p><p class='persons'>" + doc.data().Users.length + "/" + doc.data().MaxUsers + "</p></div>"
         }}
     }
          document.getElementById("projects").innerHTML = html
    }

   
    

   async function setProject() {
     
     const querySnapshot = await getDocs(query(collection(db, "Projects")));
     const QuerySnapshot = await getDocs(query(collection(db, "User")));
     console.log("Sending")

    for (const Doc of querySnapshot.docs) {
         if(Doc.data().Name == Projekt ){

           await updateDoc(doc(db, "Projects", Doc.id), { Users: arrayUnion(Name) })
          } 
          
         }
   

    for (const Doc of QuerySnapshot.docs) {
         if(Doc.data().Name == Name){
          await updateDoc(
        doc(db, "User", Doc.id), 
        {Projekt: Projekt }
        )
         }
    }
      
    UI("done")
    }
  
  


  document.addEventListener("click", async function (e) {
 if (e.target.classList[0] == "project") {
    console.log(e.target.id)
    let Id = e.target.id;
    Projekt = Id;
    for (const p of document.getElementsByClassName("project")) {
      p.style.backgroundColor = "rgba(0, 0, 0, 0)"
    }

    document.getElementById(Id).style.backgroundColor = "blue"
}})

async function reset() {
   const querySnapshot = await getDocs(query(collection(db, "Projects")));
     const QuerySnapshot = await getDocs(query(collection(db, "User")));
     console.log("Deleting")

    for (const Doc of querySnapshot.docs) {
         if(Doc.data().Name == Projekt ){
          await updateDoc(
        doc(db, "Projects", Doc.id), 
        {Users: arrayRemove(Name) }
        )
          
         }
    }

    for (const Doc of QuerySnapshot.docs) {
         if(Doc.data().Name == Name){
          await updateDoc(
        doc(db, "User", Doc.id), 
        {Projekt: "" }
        )
         }
    }

    UI("choose")
}

const Q = query(collection(db, "Projects")); 

 onSnapshot(Q, async (querySnapshot) => {
  if (Status != "logedout") {
    loadProjects()
  }
  
 })
    
 