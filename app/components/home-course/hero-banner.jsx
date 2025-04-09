import { Badge } from "../../../components/ui/badge"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../../firebase/config"

export default function HeroBanner() {
  const [user] = useAuthState(auth)

  return (
    <section className="bg-gradient-to-r from-primary/30 to-primary/10 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Bienvenue, {user ? user.displayName : ""}</h1>
          <p className="text-xl text-gray-300 mb-6">Que souhaitez-vous apprendre aujourd'hui ?</p>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer">Mathématiques</Badge>
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer">Programmation</Badge>
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer">Langues</Badge>
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer">Sciences</Badge>
          </div>
        </div>
      </div>
    </section>
  )
}

