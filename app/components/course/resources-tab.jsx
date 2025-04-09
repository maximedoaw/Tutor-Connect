import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

export default function ResourcesTab({ resources }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Ressources supplémentaires</h3>
      <p className="text-gray-400">Téléchargez ces ressources pour approfondir votre apprentissage.</p>

      <div className="space-y-2">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{resource.title}</h4>
                <p className="text-sm text-gray-400">
                  {resource.type} • {resource.size}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

