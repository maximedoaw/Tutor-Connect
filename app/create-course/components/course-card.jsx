"use client";

import { useState } from "react";
import { doc, updateDoc, deleteDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { ref, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {  db, storage } from "@/firebase/config";
import { Star, Clock, Users, Eye, BookOpen, Edit, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";
import CourseForm from "../../admin/courses/course-form";
import CourseMaterials from "../../admin/courses/course-materials";
import LessonForm from "../../admin/courses/lesson-form";

db
export default function CourseCard({
  course,
  selectedFile,
  uploadProgress,
  handleFileChange,
  handleFileUpload,
  onCourseUpdated,
}) {
  const [showSections, setShowSections] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Supprimer un cours
  const handleDeleteCourse = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${course.title}" ?`)) {
      return;
    }
  
    setIsDeleting(true);
    try {
      // Supprimer les fichiers associés au cours
      if (course.materials && course.materials.length > 0) {
        for (const material of course.materials) {
          if (material.url && material.url.startsWith("gs://")) {
            try {
              const fileRef = ref(storage, material.url);
              await deleteObject(fileRef);
            } catch (error) {
              console.error("Erreur lors de la suppression du fichier:", error);
            }
          }
        }
      }
  
      // Supprimer l'image du cours si elle est dans Firebase Storage
      if (course.imageUrl && course.imageUrl.startsWith("gs://")) {
        try {
          const imageRef = ref(storage, course.imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.error("Erreur lors de la suppression de l'image:", error);
        }
      }
  
      // Supprimer le document du cours
      await deleteDoc(doc(db, "courses", course.id));
  
      // Afficher une notification en temps réel
      toast.success(`Le cours "${course.title}" a été supprimé avec succès.`);
  
      // Notifier le parent
      if (onCourseUpdated) {
        onCourseUpdated();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du cours:", error);
      toast.error("Une erreur est survenue lors de la suppression du cours");
    } finally {
      setIsDeleting(false);
    }
  };

  // Supprimer une leçon
  const handleDeleteLesson = async (sectionId, lessonId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette leçon ?")) {
      return;
    }
  
    try {
      const courseRef = doc(db, "courses", course.id);
  
      // Mettre à jour les sections en filtrant la leçon supprimée
      const updatedSections = course.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
          };
        }
        return section;
      });
  
      // Mettre à jour le document dans Firestore
      await updateDoc(courseRef, {
        sections: updatedSections,
        updatedAt: serverTimestamp(),
      });
  
      // Écouter les changements en temps réel sur le cours
      const unsubscribe = onSnapshot(courseRef, (doc) => {
        if (doc.exists()) {
          const updatedCourse = { id: doc.id, ...doc.data() };
          console.log("Cours mis à jour en temps réel :", updatedCourse);
        } else {
          console.log("Le cours a été supprimé.");
        }
      });
  
      // Nettoyer l'écouteur après la mise à jour
      unsubscribe();
  
      // Notifier le parent
      if (onCourseUpdated) {
        onCourseUpdated();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la leçon:", error);
      toast.error("Une erreur est survenue lors de la suppression de la leçon");
    }
  };

  // Ajouter une leçon
  const handleAddLesson = (sectionId) => {
    setSelectedSection(sectionId);
    setSelectedLesson(null); // Réinitialiser la leçon sélectionnée
    setShowLessonForm(true);
  
    // Écouter les changements en temps réel sur le cours
    const courseRef = doc(db, "courses", course.id);
    const unsubscribe = onSnapshot(courseRef, (doc) => {
      if (doc.exists()) {
        const updatedCourse = { id: doc.id, ...doc.data() };
        console.log("Cours mis à jour en temps réel :", updatedCourse);
      }
    });
  
    // Nettoyer l'écouteur après la mise à jour
    unsubscribe();
  };

  // Éditer une leçon
  const handleEditLesson = (sectionId, lesson) => {
    setSelectedSection(sectionId);
    setSelectedLesson(lesson); // Définir la leçon sélectionnée
    setShowLessonForm(true);
  
    // Écouter les changements en temps réel sur le cours
    const courseRef = doc(db, "courses", course.id);
    const unsubscribe = onSnapshot(courseRef, (doc) => {
      if (doc.exists()) {
        const updatedCourse = { id: doc.id, ...doc.data() };
        console.log("Cours mis à jour en temps réel :", updatedCourse);
      }
    });
  
    // Nettoyer l'écouteur après la mise à jour
    unsubscribe();
  };

  // Gérer la réussite du formulaire de leçon
  const handleLessonFormSuccess = () => {
    if (onCourseUpdated) {
      onCourseUpdated();
    }
  };

  // Gérer la réussite du formulaire de cours
  const handleCourseFormSuccess = () => {
    if (onCourseUpdated) {
      onCourseUpdated();
    }
  };

  // Téléverser une image depuis l'explorateur de fichiers
  const handleImageUpload = async (file) => {
    if (!file) return;
  
    try {
      const storageRef = ref(storage, `courses/${course.id}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Gérer la progression du téléversement
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progression du téléversement : ${progress}%`);
        },
        (error) => {
          console.error("Erreur lors du téléversement de l'image:", error);
          toast.error("Une erreur est survenue lors du téléversement de l'image");
        },
        async () => {
          // Téléversement réussi, obtenir l'URL de l'image
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
          // Mettre à jour le cours avec la nouvelle URL de l'image
          const courseRef = doc(db, "courses", course.id);
          await updateDoc(courseRef, {
            imageUrl: downloadURL,
            updatedAt: serverTimestamp(),
          });
  
          // Écouter les changements en temps réel sur le cours
          const unsubscribe = onSnapshot(courseRef, (doc) => {
            if (doc.exists()) {
              const updatedCourse = { id: doc.id, ...doc.data() };
              console.log("Cours mis à jour en temps réel :", updatedCourse);
            }
          });
  
          // Nettoyer l'écouteur après la mise à jour
          unsubscribe();
  
          // Notifier le parent
          if (onCourseUpdated) {
            onCourseUpdated();
          }
        }
      );
    } catch (error) {
      console.error("Erreur lors du téléversement de l'image:", error);
      toast.error("Une erreur est survenue lors du téléversement de l'image");
    }
  };

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-lg text-white overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 h-48 md:h-auto relative">
            {course.imageUrl ? (
              <img
                src={course.imageUrl.startsWith("gs://") ? "https://via.placeholder.com/384x192" : course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-gray-600" />
              </div>
            )}
          </div>

          <div className="p-6 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">{course.title}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>{course.rating || 0}</span>
                <span className="text-xs text-gray-400">({course.reviewCount || 0})</span>
              </div>
            </div>

            <p className="text-gray-400 mb-4">{course.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400">Instructeur</p>
                <p>{course.instructor}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Catégorie</p>
                <p>{course.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Niveau</p>
                <p>{course.level}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Prix</p>
                <p>{course.price} €</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                <span>{course.enrolledStudents || 0} étudiants</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Eye className="h-4 w-4" />
                <span>{course.views || 0} vues</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="py-1 px-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                onClick={() => setShowEditForm(true)}
              >
                <Edit className="h-4 w-4 mr-1 inline" />
                Éditer
              </button>
              <button
                className="py-1 px-3 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
                onClick={() => setShowSections(!showSections)}
              >
                {showSections ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1 inline" />
                    Masquer les sections
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1 inline" />
                    Voir les sections
                  </>
                )}
              </button>
              <button
                className="py-1 px-3 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                onClick={handleDeleteCourse}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1 inline" />
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>

        {showSections && (
          <div className="border-t border-gray-800 p-4">
            <h4 className="font-medium mb-4">Sections et leçons du cours</h4>

            {course.sections && course.sections.length > 0 ? (
              <div className="space-y-4">
                {course.sections.map((section) => (
                  <div key={section.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">{section.title}</h5>
                      <button
                        className="py-1 px-2 text-xs rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                        onClick={() => handleAddLesson(section.id)}
                      >
                        <Plus className="h-3 w-3 mr-1 inline" />
                        Ajouter une leçon
                      </button>
                    </div>

                    {section.description && <p className="text-sm text-gray-400 mb-3">{section.description}</p>}

                    {section.lessons && section.lessons.length > 0 ? (
                      <ul className="space-y-2 pl-4">
                        {section.lessons.map((lesson) => (
                          <li key={lesson.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                              <span>{lesson.title}</span>
                              {lesson.duration && <span className="text-xs text-gray-500">({lesson.duration})</span>}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                className="p-1 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                                onClick={() => handleEditLesson(section.id, lesson)}
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                className="p-1 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                onClick={() => handleDeleteLesson(section.id, lesson.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Aucune leçon dans cette section</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-400">Aucune section n'a été ajoutée à ce cours.</p>
            )}
          </div>
        )}

        <CourseMaterials
          course={course}
          selectedFile={selectedFile}
          uploadProgress={uploadProgress}
          handleFileChange={handleFileChange}
          handleFileUpload={handleFileUpload}
        />
      </div>

      {showEditForm && (
        <CourseForm
          course={course}
          onClose={() => setShowEditForm(false)}
          onSuccess={handleCourseFormSuccess}
          onImageUpload={handleImageUpload}
        />
      )}

      {showLessonForm && (
        <LessonForm
          course={course}
          sectionId={selectedSection}
          lesson={selectedLesson}
          onClose={() => setShowLessonForm(false)}
          onSuccess={handleLessonFormSuccess}
        />
      )}
    </>
  );
}

