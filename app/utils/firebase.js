// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDTi2VDc3bRIfeNS7CgmpQoVxtKT0WUerI",
	authDomain: "creditbanc-b9822.firebaseapp.com",
	projectId: "creditbanc-b9822",
	storageBucket: "creditbanc-b9822.appspot.com",
	messagingSenderId: "661311121128",
	appId: "1:661311121128:web:3f34f70c2889227b6f0b5d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

export const set_doc = async (path, data) => {
	return await setDoc(doc(firestore, ...path), data);
};
