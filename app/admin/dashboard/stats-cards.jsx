import { Users, BookOpen, DollarSign } from "lucide-react"

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Utilisateurs</h3>
          <Users className="h-6 w-6 text-primary" />
        </div>
        <p className="text-3xl font-bold mb-2">{stats.totalUsers}</p>
        <p className="text-sm text-green-500">+{stats.newUsersThisMonth} ce mois-ci</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Cours</h3>
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <p className="text-3xl font-bold mb-2">{stats.totalCourses}</p>
        <p className="text-sm text-gray-400">Cours actifs sur la plateforme</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Revenus</h3>
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <p className="text-3xl font-bold mb-2">{stats.totalRevenue.toLocaleString()} €</p>
        <p className="text-sm text-green-500">+18% par rapport au mois dernier</p>
      </div>
    </div>
  )
}

