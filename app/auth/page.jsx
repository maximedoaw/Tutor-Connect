"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { GraduationCap, Eye, EyeOff, ArrowLeft, Loader } from "lucide-react";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
  useCreateUserWithEmailAndPassword,
  useSendPasswordResetEmail,
} from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";


export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);

  const [signInWithEmailAndPassword, user1, loading, error] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
  const [createUserWithEmailAndPassword, user2, signUpLoading, signUpError] = useCreateUserWithEmailAndPassword(auth);
  const [sendPasswordResetEmail, resetLoading, resetError] = useSendPasswordResetEmail(auth);

  const router = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (loading || !user) return

    const checkAndCreateUser = async () => {
      const userRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(userRef)

      if (!docSnap.exists()) {
        // utilisateur inexistant → on le crée
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'user', // ou 'admin' si tu veux gérer les rôles
          createdAt: serverTimestamp(),
        })
        console.log('Nouvel utilisateur ajouté à Firestore ✅')
      } else {
        console.log('Utilisateur déjà existant en base.')
      }

      router.push('/')
    }

    checkAndCreateUser()
  }, [user, loading, router])

  // Gérer les erreurs
  useEffect(() => {
    if (error || googleError || signUpError || resetError) {
      setErrorMessage(
        error?.message || googleError?.message || signUpError?.message || resetError?.message
      );
    } else {
      setErrorMessage("");
    }
  }, [error, googleError, signUpError, resetError]);

  // Connexion avec email et mot de passe
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    await signInWithEmailAndPassword(email, password);
    if (!error) {
      setEmail("");
      setPassword("");
    }
  };

  // Inscription avec email et mot de passe
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    await createUserWithEmailAndPassword(email, password);
    if (!signUpError) {
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
    }
  };

  // Réinitialisation du mot de passe
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const success = await sendPasswordResetEmail(email);
    if (success) {
      toast.success("Un email de réinitialisation a été envoyé à votre adresse email.");
      setIsResetPassword(false);
      setEmail("");
    }
  };

  // Connexion avec Google
  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    await signInWithGoogle();
  };



  return (
    <div className="min-h-screen bg-black text-white flex flex-col dark">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col md:flex-row md:items-center md:justify-center">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l'accueil</span>
          </Link>

          <div className="hidden md:block">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">TutorConnect</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">Bienvenue sur TutorConnect</h1>

            <p className="text-gray-400 text-lg mb-6">
              Connectez-vous pour accéder à votre espace personnel et retrouver vos tuteurs favoris.
            </p>

            <div className="relative h-[300px] rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471"
                alt="Étudiants qui travaillent ensemble"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="md:w-1/2 max-w-md mx-auto md:mx-0">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
            <div className="flex items-center justify-center gap-2 mb-6 md:hidden">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">TutorConnect</span>
            </div>

            {isResetPassword ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h2>
                <p className="text-gray-400 mb-6">
                  Entrez votre adresse email pour recevoir un lien de réinitialisation.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="exemple@email.com"
                    required
                    className="bg-gray-800 border-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={resetLoading}>
                  {resetLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Envoyer"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                  onClick={() => setIsResetPassword(false)}
                >
                  Retour
                </Button>
              </form>
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="exemple@email.com"
                        required
                        className="bg-gray-800 border-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Mot de passe</Label>
                        <button
                          type="button"
                          className="text-xs text-primary hover:underline"
                          onClick={() => setIsResetPassword(true)}
                        >
                          Mot de passe oublié?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          className="bg-gray-800 border-gray-700 pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader className="h-4 w-4 animate-spin" /> : "Se connecter"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          placeholder="Jean"
                          required
                          className="bg-gray-800 border-gray-700"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          placeholder="Dupont"
                          required
                          className="bg-gray-800 border-gray-700"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-register">Email</Label>
                      <Input
                        id="email-register"
                        type="email"
                        placeholder="exemple@email.com"
                        required
                        className="bg-gray-800 border-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password-register">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="password-register"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          className="bg-gray-800 border-gray-700 pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={signUpLoading}>
                      {signUpLoading ? <Loader className="h-4 w-4 animate-spin" /> : "S'inscrire"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}

            {!isResetPassword && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-400">Ou continuer avec</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <svg
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="google"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 488 512"
                        >
                          <path
                            fill="currentColor"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                          ></path>
                        </svg>
                        Continuer avec Google
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            En vous connectant, vous acceptez notre{" "}
            <Link href="/terms" className="text-primary hover:underline">
              politique de confidentialité
            </Link>{" "}
            et nos{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              conditions d'utilisation
            </Link>
          </p>
        </div>
      </div>

      <footer className="py-6 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} TutorConnect. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}