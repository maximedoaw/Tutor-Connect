"use client"

import { useEffect, useState, useMemo } from "react"
import { collection, query, orderBy, limit, startAfter, getDocs, onSnapshot, doc, deleteDoc } from "firebase/firestore"
import { auth, db } from "../../firebase/config"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import {
  Calculator,
  BookOpen,
  Code,
  Languages,
  Music,
  Palette,
  Briefcase,
  Search,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { toast } from "react-hot-toast"
import React from "react"
import Link from "next/link"
import { useAuthState } from "react-firebase-hooks/auth"


const categories = [
  { id: "math", name: "Mathématiques", icon: <Calculator className="h-4 w-4" /> },
  { id: "science", name: "Sciences", icon: <BookOpen className="h-4 w-4" /> },
  { id: "programming", name: "Programmation", icon: <Code className="h-4 w-4" /> },
  { id: "languages", name: "Langues", icon: <Languages className="h-4 w-4" /> },
  { id: "music", name: "Musique", icon: <Music className="h-4 w-4" /> },
  { id: "art", name: "Art & Design", icon: <Palette className="h-4 w-4" /> },
  { id: "business", name: "Business", icon: <Briefcase className="h-4 w-4" /> },
]

// Fonction pour obtenir l'icône de la catégorie
const getCategoryIcon = (categoryId) => {
  const category = categories.find((cat) => cat.id === categoryId);
  
  if (!category) {
    // Retourne une icône par défaut si la catégorie n'est pas trouvée
    return <BookOpen className="h-4 w-4 text-gray-400" />;
  }

  // Clone l'élément JSX de l'icône avec des props supplémentaires si besoin
  return React.cloneElement(category.icon, {
    className: `h-4 w-4 ${category.icon.props.className || ''}`,
    'aria-hidden': true
  });
};

// Fonction pour obtenir le nom de la catégorie
const getCategoryName = (categoryId) => {
  const category = categories.find((cat) => cat.id === categoryId);
  
  // Retourne l'ID de la catégorie si non trouvée (avec mise en forme)
  if (!category) {
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' ');
  }

  return category.name;
};


export default function CoursesAdminPage() {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const userId = user?.uid

  // États
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [lastDoc, setLastDoc] = useState(null)
  const [docs, setDocs] = useState([])

  // Récupération des cours
  useEffect(() => {
    if (!userId) return

    setLoading(true)
    const q = query(
      collection(db, `users/${userId}/userCourses`),
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setCourses(coursesData)
      setDocs(snapshot.docs)
      setLoading(false)
      
  
    })

    return () => unsubscribe()
  }, [userId])

  // Pagination suivante
  const handleNextPage = async () => {
    if (!lastDoc || currentPage >= totalPages) return
    
    setLoading(true)
    try {
      const nextQuery = query(
        collection(db, `users/${userId}/userCourses`),
        limit(ITEMS_PER_PAGE)
      )
      
      const snapshot = await getDocs(nextQuery)
      setCourses(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      setLastDoc(snapshot.docs[snapshot.docs.length - 1])
      setCurrentPage(prev => prev + 1)
    } catch (error) {
      toast.error("Erreur de pagination")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Pagination précédente
  const handlePrevPage = async () => {
    if (currentPage <= 1) return
    
    setLoading(true)
    try {
      const prevQuery = query(
        collection(db, `users/${userId}/userCourses`),
        limit(ITEMS_PER_PAGE)
      )
      const snapshot = await getDocs(prevQuery)
      setCourses(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      setCurrentPage(prev => prev - 1)
    } catch (error) {
      toast.error("Erreur de pagination")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Suppression d'un cours
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Supprimer ce cours définitivement ?")) return
    
    try {
      await deleteDoc(doc(db, `users/${userId}/userCourses`, courseId))
      toast.success("Cours supprimé avec succès")
    } catch (error) {
      toast.error("Échec de la suppression")
      console.error(error)
    }
  }

  // Filtrage des cours
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || course.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [courses, searchQuery, selectedCategory])

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex">
        <Button className="flex items-center gap-2 py-2 px-4 bg-primary hover:bg-primary/90 rounded-lg mr-auto mb-10
          cursor-pointer hover:brightness-125" onClick={() => router.push('/')}>
          <ArrowLeft className="h-5 w-5"/>
        </Button>
        {/* ... (votre JSX existant avec ces modifications) ... */}
        <Link href={`/create-course`}>
          <Button className="flex items-center gap-2 py-2 px-4 bg-primary hover:bg-primary/90 rounded-lg ml-auto mb-10
          cursor-pointer hover:brightness-125">
            Ajouter un cours
          </Button>
        </Link>
      </div>
      
      {/* Barre de recherche améliorée */}
      <Input
        placeholder="Rechercher par nom ou description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-gray-800 border-gray-700 text-white mb-20"
      />
      
      {/* Tableau avec CRUD */}
      <Table>
  <TableHeader className="bg-gray-700">
    <TableRow>
      <TableHead className="text-white">Titre</TableHead>
      <TableHead className="text-white">Instructeur</TableHead>
      <TableHead className="text-white">Note</TableHead>
      <TableHead className="text-white">Prix</TableHead>
      <TableHead className="text-white">Catégorie</TableHead>
      <TableHead className="text-white">Niveau</TableHead>
      <TableHead className="text-white">Durée</TableHead>
      <TableHead className="text-white">Étudiants</TableHead>
      <TableHead className="text-white text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredCourses.map((course) => (
      <TableRow key={course.id} className="border-none hover:bg-gray-700/50 text-white">
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            <img 
              src={course.imageUrl} 
              alt={course.title}
              className="h-10 w-10 rounded-md object-cover"
            />
            <div>
              <p className="font-medium">{course.title}</p>
              <p className="text-sm text-gray-400 line-clamp-1">{course.description}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>{course.instructor}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">{course.rating}</span>
            <span className="text-gray-400">({course.reviewCount})</span>
          </div>
        </TableCell>
        <TableCell>
        {typeof course.price === 'number' && !isNaN(course.price)
    ? course.price === 0
      ? "Gratuit"
      : `$${course.price.toFixed(2)}`
    : "Gratuit"}
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="flex items-center gap-1 bg-gray-700">
            {getCategoryIcon(course.category)}
            <span>{getCategoryName(course.category)}</span>
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-500">
            {course.level}
          </Badge>
        </TableCell>
        <TableCell>{course.duration}</TableCell>
        <TableCell>{course.students.toLocaleString()}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-none">
              <DropdownMenuItem
                onClick={() => handleViewCourse(course.id)}
                className="text-white hover:bg-gray-700 cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                Voir
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/tutor-courses/${course.id}`)}
                className="text-white hover:bg-gray-700 cursor-pointer"
                
              >
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteCourse(course.id)}
                className="text-red-500 hover:bg-gray-700 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
      
      {/* Pagination améliorée */}
      <div className="flex justify-between items-center mt-4">
        <Button 
          onClick={handlePrevPage} 
          disabled={currentPage <= 1 || loading}>
          Précédent
        </Button>
        
        <span>Page {currentPage} sur {totalPages}</span>
        
        <Button 
          onClick={handleNextPage} 
          disabled={currentPage >= totalPages || loading || !lastDoc}>
          Suivant
        </Button>
      </div>
    </div>
  )
}