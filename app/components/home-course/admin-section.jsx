import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"

export default function AdminSection() {
  return (
    <section className="py-8 bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Administration</h2>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/20">
            Accéder au tableau de bord
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800 p-6">
            <h3 className="font-bold mb-2">Utilisateurs</h3>
            <p className="text-3xl font-bold mb-2">1,245</p>
            <p className="text-green-500 text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +12% ce mois-ci
            </p>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <h3 className="font-bold mb-2">Cours actifs</h3>
            <p className="text-3xl font-bold mb-2">87</p>
            <p className="text-green-500 text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +5% ce mois-ci
            </p>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <h3 className="font-bold mb-2">Revenus</h3>
            <p className="text-3xl font-bold mb-2">9,845 €</p>
            <p className="text-green-500 text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +18% ce mois-ci
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}

