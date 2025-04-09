import { GraduationCap } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold">TutorConnect</span>
          </div>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} TutorConnect. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

