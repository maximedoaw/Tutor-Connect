"use client"

import { useState, useEffect, use } from "react"
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth, db, storage } from "../../firebase/config"

import Sidebar from "./sidebar"
import MobileHeader from "./mobile-header"
import DashboardView from "./dashboard/dashboard-view"
import CommentsView from "./comments/comments-view"
import UsersView from "./users/users-view"
import CoursesView from "./courses/courses-view"
import { ToastContainer } from "react-toastify"
import { useAuthState } from "react-firebase-hooks/auth"
import Unauthorized from "./unauthorized"
import { useRouter } from "next/navigation"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [filterStatus, setFilterStatus] = useState("all")
  const [user, loadingUser, error] = useAuthState(auth)
  const [isUnauthorized, setIsUnauthorized] = useState(false)
  const router = useRouter()

  // Statistiques pour le tableau de bord
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    newUsersThisMonth: 0,
    activeChats: 0,
    pendingComments: 0,
  })

  useEffect(() => {
    fetchData()
  }, [activeTab, filterStatus, searchQuery])

  useEffect(() => {
    if(user?.email !== "maximedoaw204@gmail.com" && user?.email !== "foumanechrispel@gmail.com") {
      setIsUnauthorized(true)
    }
  }, [user, loadingUser, router])


  if (isUnauthorized) return <Unauthorized/>

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === "dashboard" || activeTab === "all") {
        // Récupérer les statistiques
        const usersSnapshot = await getDocs(collection(db, "users"))
        const coursesSnapshot = await getDocs(collection(db, "courses"))
        const revenueSnapshot = await getDocs(collection(db, "payments"))
        const chatsSnapshot = await getDocs(query(collection(db, "chats"), where("status", "==", "active")))
        const pendingCommentsSnapshot = await getDocs(
          query(collection(db, "comments"), where("status", "==", "pending")),
        )

        // Calculer les statistiques
        const totalRevenue = revenueSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0)

        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

        const newUsersThisMonth = usersSnapshot.docs.filter(
          (doc) => doc.data().createdAt?.toDate() > oneMonthAgo,
        ).length

        setStats({
          totalUsers: usersSnapshot.size,
          totalCourses: coursesSnapshot.size,
          totalRevenue,
          newUsersThisMonth,
          activeChats: chatsSnapshot.size,
          pendingComments: pendingCommentsSnapshot.size,
        })
      }

      if (activeTab === "comments" || activeTab === "all") {
        // Récupérer les commentaires avec filtre
        let commentsQuery = collection(db, "comments")

        if (filterStatus !== "all") {
          commentsQuery = query(commentsQuery, where("status", "==", filterStatus))
        }

        commentsQuery = query(commentsQuery, orderBy("createdAt", "desc"))

        const commentsSnapshot = await getDocs(commentsQuery)
        const commentsData = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }))

        setComments(commentsData)
      }

      if (activeTab === "users" || activeTab === "all") {
        // Récupérer les utilisateurs
        const usersSnapshot = await getDocs(collection(db, "users"))
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }))

        setUsers(usersData)
      }

      if (activeTab === "courses" || activeTab === "all") {
        // Récupérer les cours
        const coursesSnapshot = await getDocs(collection(db, "courses"))
        const coursesData = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }))

        setCourses(coursesData)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleApproveComment = async (commentId) => {
    try {
      await updateDoc(doc(db, "comments", commentId), {
        status: "approved",
        updatedAt: serverTimestamp(),
      })

      // Mettre à jour l'état local
      setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, status: "approved" } : comment)))
    } catch (error) {
      console.error("Erreur lors de l'approbation du commentaire:", error)
    }
  }

  const handleRejectComment = async (commentId) => {
    try {
      await updateDoc(doc(db, "comments", commentId), {
        status: "rejected",
        updatedAt: serverTimestamp(),
      })

      // Mettre à jour l'état local
      setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, status: "rejected" } : comment)))
    } catch (error) {
      console.error("Erreur lors du rejet du commentaire:", error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      try {
        await deleteDoc(doc(db, "comments", commentId))

        // Mettre à jour l'état local
        setComments(comments.filter((comment) => comment.id !== commentId))
      } catch (error) {
        console.error("Erreur lors de la suppression du commentaire:", error)
      }
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment)
    setEditText(comment.text)
  }

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, "comments", editingComment.id), {
        text: editText,
        updatedAt: serverTimestamp(),
      })

      // Mettre à jour l'état local
      setComments(
        comments.map((comment) => (comment.id === editingComment.id ? { ...comment, text: editText } : comment)),
      )

      setEditingComment(null)
      setEditText("")
    } catch (error) {
      console.error("Erreur lors de la modification du commentaire:", error)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleFileUpload = async (courseId) => {
    if (!selectedFile) return

    try {
      const fileRef = ref(storage, `courses/${courseId}/${selectedFile.name}`)

      // Simuler la progression du téléchargement
      setUploadProgress(30)
      setTimeout(() => setUploadProgress(60), 500)
      setTimeout(() => setUploadProgress(90), 1000)

      await uploadBytes(fileRef, selectedFile)
      const downloadURL = await getDownloadURL(fileRef)

      // Vérifier si le cours existe avant de le mettre à jour
      const courseRef = doc(db, "courses", courseId)

      try {
        // Mettre à jour le document du cours avec l'URL du fichier
        await updateDoc(courseRef, {
          materials: [
            ...(courses.find((c) => c.id === courseId).materials || []),
            {
              name: selectedFile.name,
              url: downloadURL,
              uploadedAt: serverTimestamp(),
            },
          ],
        })

        setUploadProgress(100)

        // Mettre à jour l'état local
        setCourses(
          courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  materials: [
                    ...(course.materials || []),
                    {
                      name: selectedFile.name,
                      url: downloadURL,
                      uploadedAt: new Date(),
                    },
                  ],
                }
              : course,
          ),
        )

        setSelectedFile(null)
        setTimeout(() => setUploadProgress(0), 1000)
      } catch (updateError) {
        if (updateError.code === "not-found") {
          alert("Ce cours n'existe plus dans la base de données.")
          // Rafraîchir les données pour mettre à jour l'interface
          fetchData()
        } else {
          throw updateError
        }
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error)
      setUploadProgress(0)
    }
  }

  // Filtrer les données en fonction de la recherche
  const filteredComments = comments.filter(
    (comment) =>
      comment.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.userName?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-black text-white flex dark">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} pendingCommentsCount={stats.pendingComments} />

      <MobileHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 md:ml-64 pt-20 md:pt-0 ">
        {activeTab === "dashboard" && (
          <DashboardView
            stats={stats}
            comments={comments}
            loading={loading}
            handleApproveComment={handleApproveComment}
            handleRejectComment={handleRejectComment}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "comments" && (
          <CommentsView
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            loading={loading}
            filteredComments={filteredComments}
            editingComment={editingComment}
            editText={editText}
            setEditText={setEditText}
            handleApproveComment={handleApproveComment}
            handleRejectComment={handleRejectComment}
            handleEditComment={handleEditComment}
            handleSaveEdit={handleSaveEdit}
            handleDeleteComment={handleDeleteComment}
            setEditingComment={setEditingComment}
          />
        )}

        {activeTab === "users" && (
          <UsersView
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            loading={loading}
            filteredUsers={filteredUsers}
            fetchData={fetchData}
          />
        )}

        {activeTab === "courses" && (
          <CoursesView
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            loading={loading}
            selectedFile={selectedFile}
            uploadProgress={uploadProgress}
            handleFileChange={handleFileChange}
            handleFileUpload={handleFileUpload}
            fetchData={fetchData}
          />
        )}
      </main>
      <ToastContainer/>
    </div>
  )
}


export default AdminDashboard

