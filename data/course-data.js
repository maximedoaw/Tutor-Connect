export const courseData = {
    id: "python-101",
    title: "Introduction à la programmation Python",
    instructor: "Thomas Dubois",
    progress: 65,
    totalLessons: 12,
    completedLessons: 8,
    totalDuration: "18h",
    remainingDuration: "6h20min",
    description:
      "Apprenez les bases de la programmation avec Python, l'un des langages les plus populaires et accessibles. Ce cours vous guidera des concepts fondamentaux jusqu'à la création de vos premiers programmes.",
    modules: [
      {
        id: "module-1",
        title: "Introduction à Python",
        completed: true,
        lessons: [
          { id: "lesson-1-1", title: "Qu'est-ce que Python?", duration: "10min", completed: true },
          { id: "lesson-1-2", title: "Installation et configuration", duration: "15min", completed: true },
          { id: "lesson-1-3", title: "Votre premier programme", duration: "20min", completed: true },
        ],
      },
      {
        id: "module-2",
        title: "Variables et types de données",
        completed: true,
        lessons: [
          { id: "lesson-2-1", title: "Variables et affectation", duration: "25min", completed: true },
          { id: "lesson-2-2", title: "Types numériques", duration: "30min", completed: true },
          { id: "lesson-2-3", title: "Chaînes de caractères", duration: "35min", completed: true },
        ],
      },
      {
        id: "module-3",
        title: "Structures de contrôle",
        completed: false,
        lessons: [
          { id: "lesson-3-1", title: "Conditions (if, else, elif)", duration: "30min", completed: true },
          { id: "lesson-3-2", title: "Boucles (for, while)", duration: "40min", completed: true },
          { id: "lesson-3-3", title: "Compréhensions de liste", duration: "35min", completed: false },
        ],
      },
      {
        id: "module-4",
        title: "Fonctions et modules",
        completed: false,
        lessons: [
          { id: "lesson-4-1", title: "Définir des fonctions", duration: "30min", completed: false },
          { id: "lesson-4-2", title: "Arguments et retours", duration: "25min", completed: false },
          { id: "lesson-4-3", title: "Modules et packages", duration: "35min", completed: false },
        ],
      },
    ],
    resources: [
      { id: "resource-1", title: "Cheat Sheet Python", type: "PDF", size: "1.2 MB" },
      { id: "resource-2", title: "Exercices supplémentaires", type: "ZIP", size: "3.5 MB" },
      { id: "resource-3", title: "Code source des exemples", type: "ZIP", size: "2.8 MB" },
    ],
    comments: [
      {
        id: "comment-1",
        user: "Marie L.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374",
        date: "Il y a 2 jours",
        text: "Super explication sur les boucles for ! J'ai enfin compris comment les utiliser efficacement.",
        likes: 12,
      },
      {
        id: "comment-2",
        user: "Lucas M.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374",
        date: "Il y a 5 jours",
        text: "Est-ce que quelqu'un pourrait m'expliquer la différence entre une liste et un tuple ? Je suis un peu perdu.",
        likes: 3,
        replies: [
          {
            id: "reply-1",
            user: "Thomas Dubois",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1374",
            date: "Il y a 4 jours",
            text: "Bonjour Lucas ! La principale différence est qu'une liste est mutable (modifiable) alors qu'un tuple est immuable (non modifiable). Nous verrons cela plus en détail dans le module 5.",
            likes: 8,
          },
        ],
      },
    ],
  }
  
  