export default function StatisticsPanel({ stats }) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Statistiques</h3>
  
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Conversations actives</p>
              <p className="font-medium">{stats.activeChats}</p>
            </div>
            <div className="h-2 bg-gray-800 rounded-full">
              <div className="h-2 bg-primary rounded-full" style={{ width: `${(stats.activeChats / 100) * 100}%` }}></div>
            </div>
          </div>
  
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Commentaires en attente</p>
              <p className="font-medium">{stats.pendingComments}</p>
            </div>
            <div className="h-2 bg-gray-800 rounded-full">
              <div
                className="h-2 bg-yellow-500 rounded-full"
                style={{ width: `${(stats.pendingComments / 50) * 100}%` }}
              ></div>
            </div>
          </div>
  
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Taux de complétion des cours</p>
              <p className="font-medium">68%</p>
            </div>
            <div className="h-2 bg-gray-800 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: "68%" }}></div>
            </div>
          </div>
  
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Satisfaction utilisateurs</p>
              <p className="font-medium">92%</p>
            </div>
            <div className="h-2 bg-gray-800 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: "92%" }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  