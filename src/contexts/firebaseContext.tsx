import { createContext } from "react";
import firebase from "../lib/firebase";

export let FirebaseContext = createContext(firebase)