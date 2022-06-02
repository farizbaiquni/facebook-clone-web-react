// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTiS9LDcvazB-fPZzVdKscFDahkriH5OU",
  authDomain: "facebook-clone-react-c5dca.firebaseapp.com",
  projectId: "facebook-clone-react-c5dca",
  storageBucket: "facebook-clone-react-c5dca.appspot.com",
  messagingSenderId: "386456420035",
  appId: "1:386456420035:web:a7b2bdd67238d1928b6c76",
  measurementId: "G-R8V5ZH2X0S"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase)

export default firebase
