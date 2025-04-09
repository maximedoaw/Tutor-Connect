import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { coursesData } from "../data/courses-data";
import { useAuthState } from "react-firebase-hooks/auth";

export const useFetchCourses = () => {
  const [coursesFetching, setCoursesFetching] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);

  const createCoursesCollection = async () => {
    if (!user) return; // Arrête l'exécution si l'utilisateur n'est pas connecté

    try {
      // Chemin corrigé : collection utilisateur -> sous-collection 'userCourses'
      const userCoursesRef = collection(db, `courses`);


    } catch (err) {
      console.error("Erreur Firestore :", err);
      setError(err);
    }
  };

  const fetchCourses = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userCoursesRef = collection(db, `courses`);
      const snapshot = await getDocs(userCoursesRef);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCoursesFetching(data);
    } catch (err) {
      setError(err);
      console.error("Erreur de récupération :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) { // Ne s'exécute que quand `user` est disponible
      createCoursesCollection();
      fetchCourses();
    }
  }, [user]); // Dépendance critique

  return { coursesFetching, loading, error };
};