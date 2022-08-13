// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage,ref,getDownloadURL } from "firebase/storage";
import { doc, getDoc,getDocs,getFirestore, collection, query, where,updateDoc,setDoc } from "firebase/firestore";
import {hash256} from "./genFuncs.js"
import express from 'express' 
import cors from 'cors'
import bodyParser from "body-parser"
import 'dotenv/config'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional 
console.log({apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId})
const firebaseConfig = {
  //for some reason when I run this using env variables it throws an error to do access denied? looking into it later, for now forgoing env variables and just eliminating them whenever I push to master
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig, {
  experimentalForceLongPolling: true,
}); 
const storage = getStorage(firebaseApp); 
const db = getFirestore(firebaseApp)
const userRef = collection(db, "users");
const app = express();
app.use(cors())  
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.get('/api/accounts/login', async (req,res)=>{
  let docSnap = query(userRef,where("name","==",req.query['username'], "and", "pass", "==", hash256(req.query['password'])))
  docSnap = await getDocs(docSnap)
  docSnap.forEach((doc)=>{
    if(doc.exists()){
      res.send(true)
    }else{
      res.send(false)

    }
  })
})


app.get("/users/signup", async (req,res) => {
  const userExists = await query(userRef,where("name","==",req.query['name']));
  const qEmpty = !(await getDocs(userExists)).empty
  if(qEmpty){
    res.status(400).send({reason:"userExists"})
    return
  }
  else {
    try {

      const count = (await getDoc(doc(db,'users','userData'))).data()['count']+1
      await setDoc(doc(db,"users","userData"),{count:count},{merge:true})
      await setDoc(doc(db,"users",count.toString()), {name: req.query["name"], password: hash256(req.query['password']), characters: 0})
      res.status(200).send({})
      return;

    }
    catch {

    }
  }
  res.status(400).send({reason:"idk lmao"})
})


app.listen(3001, ()=> console.log('listening....'));
