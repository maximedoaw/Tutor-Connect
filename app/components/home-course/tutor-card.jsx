import Image from "next/image"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Star } from "lucide-react"

export default function TutorCard({ name, specialty, rating, reviewCount, imageUrl }) {
  return (
    <Card className="bg-gray-900 border-gray-800 p-6 flex flex-col items-center text-center">
      <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
        <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <h3 className="font-bold mb-1">{name}</h3>
      <p className="text-gray-400 text-sm mb-2">{specialty}</p>
      <div className="flex items-center gap-1 mb-4">
        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        <span>{rating}</span>
        <span className="text-xs text-gray-400">({reviewCount} avis)</span>
      </div>
      <Button variant="outline" size="sm" className="w-full">
        Voir le profil
      </Button>
    </Card>
  )
}

