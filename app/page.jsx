"use client"

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import HomeScreen from "./components/home/home-screen";
import AuthScreen from "./components/home/auth-screen";

export default function Home() {

  const [user] = useAuthState(auth);

  return (
    <div>
      {user ? <HomeScreen/> : <AuthScreen/>}
    </div>
  );
}
