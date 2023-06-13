// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {
	doc,
	setDoc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
	deleteDoc,
} from "firebase/firestore";

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

export const get_collection = async ({ path, queries = null }) => {
	if (queries) {
		let qs = queries.map((query) =>
			where(query.param, query.predicate, query.value)
		);

		const q = query(collection(firestore, ...path), ...qs);
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => doc.data());
	} else {
		const q = query(collection(firestore, ...path));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => doc.data());
	}
};

export const set_doc = async (path, data) => {
	return await setDoc(doc(firestore, ...path), data);
};

export const delete_doc = async (path) => {
	await deleteDoc(doc(firestore, ...path));
};
