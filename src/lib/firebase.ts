import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC24norp6rZjXJoxVj3s4ZGZhJNtXN4Mpc",
  authDomain: "hamyareketabdar.firebaseapp.com",
  projectId: "hamyareketabdar",
  storageBucket: "hamyareketabdar.firebasestorage.app",
  messagingSenderId: "574623248660",
  appId: "1:574623248660:web:ef0e71a183b860aae2d201"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 