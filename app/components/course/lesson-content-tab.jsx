import { Button } from "@/components/ui/button"

export default function LessonContentTab() {
  return (
    <div className="space-y-6">
      <div className="prose prose-invert max-w-none">
        <h2>Introduction aux boucles en Python</h2>
        <p>
          Les boucles sont des structures de contrôle essentielles en programmation. Elles permettent d'exécuter un bloc
          de code plusieurs fois. Python propose deux types de boucles principales : <code>for</code> et{" "}
          <code>while</code>.
        </p>

        <h3>La boucle for</h3>
        <p>
          La boucle <code>for</code> est utilisée pour itérer sur une séquence (comme une liste, un tuple, un
          dictionnaire, un ensemble ou une chaîne).
        </p>

        <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
          <code>
            {`# Exemple de boucle for
fruits = ["pomme", "banane", "cerise"]
for fruit in fruits:
    print(fruit)

# Résultat:
# pomme
# banane
# cerise`}
          </code>
        </pre>

        <h3>La fonction range()</h3>
        <p>
          La fonction <code>range()</code> est souvent utilisée avec les boucles for pour générer une séquence de
          nombres.
        </p>

        <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
          <code>
            {`# Utilisation de range()
for i in range(5):
    print(i)

# Résultat:
# 0
# 1
# 2
# 3
# 4`}
          </code>
        </pre>

        <h3>La boucle while</h3>
        <p>
          La boucle <code>while</code> exécute un ensemble d'instructions tant qu'une condition est vraie.
        </p>

        <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto">
          <code>
            {`# Exemple de boucle while
count = 0
while count < 5:
    print(count)
    count += 1

# Résultat:
# 0
# 1
# 2
# 3
# 4`}
          </code>
        </pre>

        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-md">
          <h4 className="text-primary font-bold">Conseil du tuteur</h4>
          <p>
            Faites attention aux boucles infinies ! Si la condition d'une boucle while ne devient jamais fausse, votre
            programme continuera à s'exécuter indéfiniment. Assurez-vous toujours que votre condition finira par devenir
            fausse.
          </p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="font-bold mb-4">Exercice pratique</h3>
        <p className="mb-4">Écrivez une boucle qui affiche tous les nombres pairs de 0 à 20.</p>
        <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
          <code>
            {`# Votre code ici
`}
          </code>
        </pre>
        <Button>Vérifier ma réponse</Button>
      </div>
    </div>
  )
}

