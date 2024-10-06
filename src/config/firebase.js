// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth"; // Corrected import
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; // Added `doc` import
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyBEDf2fmMZoevjzubHQQJU3VTMK_hztOWY",
  authDomain: "chatapp-b0770.firebaseapp.com",
  projectId: "chatapp-b0770",
  storageBucket: "chatapp-b0770.appspot.com",
  messagingSenderId: "1015990943660",
  appId: "1:1015990943660:web:57ef448be1d60105470409"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password); // Fixed import usage
        const user = res.user;
        
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "", // Fixed typo from "avtar" to "avatar"
            bio: "",
            lastSeen: Date.now()
        });

        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        });
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
};

const login=async(email,password)=>{
        try {
            await signInWithEmailAndPassword(auth,email,password);
        } catch (error) {
            console.error(error);
            toast.error(error.code.split('/')[1].split('-').join(" "));
        }
}

const logout=async()=>{
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const resetPassword=async(email)=>{
    if(!email){
        toast.error("Enter The Email..");
        return null;
    }
    try {
        const userRef=collection(db,"users");
        const q=query(userRef,where("email","==",email));
        const querySnap=await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset Email sent");
        }
        else{
            toast.error("Email does't Exist");
        }
    } catch (error) {
        toast.error(error.message);   
    }
}

export { signup,login ,logout,auth,db,resetPassword};
