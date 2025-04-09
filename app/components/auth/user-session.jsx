"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
// Créer le contexte

import { auth, db } from "../../../firebase/config";

const UserContext = createContext(null);

// Hook personnalisé pour utiliser le contexte
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser doit être utilisé à l'intérieur d'un UserProvider");
  }
  return context;
}

// Provider du contexte
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // L'utilisateur est connecté
        try {
          // Récupérer les informations supplémentaires de l'utilisateur depuis Firestore
          const q = query(collection(db, "users"), where("uid", "==", authUser.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserRole(userData.role);

            // Combiner les données d'authentification avec les données Firestore
            setUser({
              ...authUser,
              id: querySnapshot.docs[0].id,
              name: userData.name,
              role: userData.role,
              status: userData.status,
              enrolledCourses: userData.enrolledCourses || 0,
              createdAt: userData.createdAt,
            });
          } else {
            // L'utilisateur existe dans Auth mais pas dans Firestore
            setUser(authUser);
            setUserRole("student"); // Rôle par défaut
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
          setUser(authUser);
          setUserRole(null);
        }
      } else {
        // L'utilisateur n'est pas connecté
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => unsubscribe();
  }, []);

  // Vérifier si l'utilisateur a accès à une ressource en fonction de son rôle
  const hasAccess = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
  };

  return (
    <UserContext.Provider value={{ user, userRole, loading, hasAccess }}>
      {children}
    </UserContext.Provider>
  );
}

// Composant HOC pour protéger les routes
export function withAuth(Component, requiredRoles = []) {
  return function AuthenticatedComponent(props) {
    const { user, userRole, loading, hasAccess } = useUser();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!user) {
      // Rediriger vers la page de connexion
      window.location.href = "/auth";
      return null;
    }

    if (requiredRoles.length > 0 && !hasAccess(requiredRoles)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-6 rounded-lg max-w-md text-center">
            <h2 className="text-xl font-bold mb-2">Accès refusé</h2>
            <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}