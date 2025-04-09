import { Users, DollarSign, Star, AlertTriangle } from "lucide-react"

export default function RecentActivity() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Activité récente</h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="font-medium">Nouvel utilisateur inscrit</p>
            <p className="text-sm text-gray-400">Marie Dupont s'est inscrite</p>
            <p className="text-xs text-gray-500">Il y a 23 minutes</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="font-medium">Nouveau paiement reçu</p>
            <p className="text-sm text-gray-400">Thomas Martin a acheté "Mathématiques avancées"</p>
            <p className="text-xs text-gray-500">Il y a 42 minutes</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <Star className="h-4 w-4 text-yellow-500" />
          </div>
          <div>
            <p className="font-medium">Nouvelle évaluation</p>
            <p className="text-sm text-gray-400">Julie Petit a évalué "Introduction à Python" (5 étoiles)</p>
            <p className="text-xs text-gray-500">Il y a 1 heure</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <p className="font-medium">Commentaire signalé</p>
            <p className="text-sm text-gray-400">Un commentaire a été signalé pour examen</p>
            <p className="text-xs text-gray-500">Il y a 2 heures</p>
          </div>
        </div>
      </div>
    </div>
  )
}

