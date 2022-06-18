import { createContext } from "react";

type userType = {
  uid: string | null;
  displayName: String;
  email: String;
  photoURL: String;
  metadata: String;
};

export const AuthContext = createContext<userType | null>(null);
