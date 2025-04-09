import { Button } from "../../../components/ui/button"
import { ChevronRight } from "lucide-react"
import TutorCard from "./tutor-card"

export default function TutorsSection() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tuteurs populaires</h2>
          <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1">
            Voir tout <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <TutorCard
            name="Dr. Sophie Martin"
            specialty="Mathématiques"
            rating={4.9}
            reviewCount={342}
            imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374"
          />
          <TutorCard
            name="Thomas Dubois"
            specialty="Programmation"
            rating={4.8}
            reviewCount={567}
            imageUrl="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1374"
          />
          <TutorCard
            name="Emma Wilson"
            specialty="Langues étrangères"
            rating={4.7}
            reviewCount={189}
            imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376"
          />
          <TutorCard
            name="Prof. Jean Leroy"
            specialty="Sciences"
            rating={4.9}
            reviewCount={215}
            imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470"
          />
        </div>
      </div>
    </section>
  )
}

