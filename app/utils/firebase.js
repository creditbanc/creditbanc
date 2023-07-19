// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
	getCountFromServer,
	getFirestore,
	onSnapshot,
	orderBy,
	updateDoc,
} from "firebase/firestore";
import {
	doc,
	setDoc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
	deleteDoc,
	limit as firelimit,
	orderBy as fireorder,
	startAt as fireStartAt,
	startAfter as fireStartAfter,
	endAt as fireEndAt,
	endBefore as fireEndBefore,
} from "firebase/firestore";
import { isEmpty } from "ramda";
import { inspect } from "./helpers";

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

let fire_cursors = {
	startAt: fireStartAt,
	startAfter: fireStartAfter,
	endAt: fireEndAt,
	endBefore: fireEndBefore,
};

export const get_collection_listener = async (
	{ path, queries = [], limit = [], orderBy = [], cursors = [] },
	callback
) => {
	let limit_args = limit.map((limit_amount) => firelimit(limit_amount));
	let order_args = orderBy.map(({ field, direction = "desc" }) =>
		fireorder(field, direction)
	);

	let query_args = queries.map((query) =>
		where(query.param, query.predicate, query.value)
	);

	// console.log("cursors");
	// console.log(cursors);

	let cursor_args = await Promise.all(
		cursors.map(async (cursor) => {
			// console.log("cursor");
			// console.log(cursor);

			let { type, value, is_snapshot = false } = cursor;

			if (is_snapshot) {
				let docSnapshot = await get_doc_snapshot(value);
				return fire_cursors[type](docSnapshot);
			}

			// return fire_cursors[type](...value);
			return fire_cursors[type](value);
		})
	);

	let args = [...query_args, ...order_args, ...cursor_args, ...limit_args];

	// console.log("args");
	// inspect([...query_args, ...order_args, limit_args, cursors]);

	const q = query(collection(firestore, ...path), ...args);
	const unsubscribe = onSnapshot(q, callback);
	return unsubscribe;
};

export const get_collection = async ({
	path,
	queries = [],
	limit = [],
	orderBy = [],
	cursors = [],
}) => {
	let limit_args = limit.map((limit_amount) => firelimit(limit_amount));
	let order_args = orderBy.map(({ field, direction = "desc" }) =>
		fireorder(field, direction)
	);

	let query_args = queries.map((query) =>
		where(query.param, query.predicate, query.value)
	);

	let cursor_args = await Promise.all(
		cursors.map(async (cursor) => {
			let { type, value, is_snapshot = false } = cursor;

			if (is_snapshot) {
				let docSnapshot = await get_doc_snapshot(value);
				return fire_cursors[type](docSnapshot);
			}

			return fire_cursors[type](...value);
		})
	);

	let args = [...query_args, ...order_args, ...cursor_args, ...limit_args];

	// console.log("args");
	// inspect([...query_args, ...order_args, limit_args, cursors]);

	const q = query(collection(firestore, ...path), ...args);
	const querySnapshot = await getDocs(q);

	return querySnapshot.docs.map((doc) => ({ doc_id: doc.id, ...doc.data() }));
};

export const get_count = async ({
	path,
	queries = [],
	limit = [],
	orderBy = [],
	cursors = [],
}) => {
	let limit_args = limit.map((limit_amount) => firelimit(limit_amount));
	let order_args = orderBy.map(({ field, direction = "desc" }) =>
		fireorder(field, direction)
	);

	let query_args = queries.map((query) =>
		where(query.param, query.predicate, query.value)
	);

	let cursor_args = await Promise.all(
		cursors.map(async (cursor) => {
			let { type, value, is_snapshot = false } = cursor;

			if (is_snapshot) {
				let docSnapshot = await get_doc_snapshot(value);
				return fire_cursors[type](docSnapshot);
			}

			return fire_cursors[type](...value);
		})
	);

	let args = [...query_args, ...order_args, ...cursor_args, ...limit_args];

	// console.log("args");
	// inspect([...query_args, ...order_args, limit_args, cursors]);

	const q = query(collection(firestore, ...path), ...args);
	const querySnapshot = await getCountFromServer(q);

	// console.log("count_______");
	// console.log(querySnapshot.data());

	return querySnapshot.data().count;
};

export const get_doc_snapshot = async (path) => {
	let docSnapshot = await getDoc(doc(firestore, ...path));
	return docSnapshot;
};

export const get_doc = async (path, is_empty_return = {}) => {
	let docSnapshot = await getDoc(doc(firestore, ...path));
	return docSnapshot.data() ?? is_empty_return;
};

export const get_doc_listener = (path, callback) => {
	let unsubscribe = onSnapshot(doc(firestore, ...path), callback);
	return unsubscribe;
};

export const set_doc = async (path, data, merge = false) => {
	if (merge) {
		return await setDoc(doc(firestore, ...path), data, { merge: true });
	} else {
		return await setDoc(doc(firestore, ...path), data);
	}
};

export const update_doc = async (path, data) => {
	return await updateDoc(doc(firestore, ...path), data);
};

export const delete_doc = async (path) => {
	await deleteDoc(doc(firestore, ...path));
};
