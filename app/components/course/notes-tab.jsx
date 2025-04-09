"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function NotesTab({ noteText, setNoteText, handleAddNote }) {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Mes notes personnelles</h3>
      <p className="text-gray-400">Prenez des notes pour vous aider à mémoriser les concepts importants.</p>

      <div className="space-y-4">
        <Textarea
          placeholder="Écrivez vos notes ici..."
          className="bg-gray-800 border-gray-700 min-h-[200px]"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <Button onClick={handleAddNote}>Enregistrer la note</Button>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <h4 className="font-medium mb-2">Conseil pour prendre des notes efficaces</h4>
        <ul className="list-disc list-inside text-gray-400 space-y-1">
          <li>Utilisez vos propres mots pour reformuler les concepts</li>
          <li>Notez les exemples qui vous aident à comprendre</li>
          <li>Créez des associations avec ce que vous connaissez déjà</li>
          <li>Posez-vous des questions et notez les réponses</li>
        </ul>
      </div>
    </div>
  )
}

