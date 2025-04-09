"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion"
import { BookOpen, GraduationCap, Users, Star, CheckCircle, Menu, X } from "lucide-react"

export default function AuthScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col dark">
      <header className="border-b border-gray-800 sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">TutorConnect</span>
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Témoignages
            </Link>
            <Link href="#faq" className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </Link>
            <div className="flex gap-4">
              <Link href="/auth">
                <Button variant="outline">Se connecter</Button>              
              </Link>
              <Link href={"/auth"}>
                    <Button>S'inscrire</Button>
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-black">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                href="#features"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Témoignages
              </Link>
              <Link
                href="#faq"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-4 pt-4">
                <Link href="/auth">
                    <Button variant="outline" className="w-full">
                        Se connecter
                    </Button>
                </Link>
                <Link href="/auth">
                    <Button className="w-full">S'inscrire</Button>                
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070"
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-medium">
                  Plateforme d'apprentissage #1 pour les étudiants
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Trouvez le tuteur parfait pour réussir vos études
                </h1>
                <p className="text-gray-400 text-lg md:text-xl">
                  Connectez-vous avec des tuteurs experts dans votre domaine d'études et améliorez vos résultats
                  académiques grâce à un accompagnement personnalisé.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-base">
                    Commencer gratuitement
                  </Button>
                  <Button size="lg" variant="outline" className="text-base">
                    Découvrir les tuteurs
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Plus de 10 000 étudiants satisfaits</span>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
                <Image
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470"
                  alt="Étudiant avec tuteur"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce dont vous avez besoin pour réussir</h2>
              <p className="text-gray-400">
                Notre plateforme offre tous les outils nécessaires pour trouver le tuteur idéal et améliorer vos
                compétences académiques.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Tuteurs qualifiés</h3>
                  <p className="text-gray-400">
                    Tous nos tuteurs sont soigneusement sélectionnés et possèdent une expertise avérée dans leur
                    domaine.
                  </p>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Cours personnalisés</h3>
                  <p className="text-gray-400">
                    Recevez un enseignement adapté à votre niveau et à vos objectifs spécifiques.
                  </p>
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <div className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Communauté d'entraide</h3>
                  <p className="text-gray-400">
                    Rejoignez une communauté d'étudiants et partagez vos connaissances et expériences.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que nos étudiants disent</h2>
              <p className="text-gray-400">
                Découvrez comment TutorConnect a aidé des milliers d'étudiants à atteindre leurs objectifs académiques.
              </p>
            </div>

            <Tabs defaultValue="university" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="university">Université</TabsTrigger>
                <TabsTrigger value="highschool">Lycée</TabsTrigger>
                <TabsTrigger value="professional">Formation Pro</TabsTrigger>
              </TabsList>

              <TabsContent value="university" className="space-y-8">
                <TestimonialCard
                  name="Sophie Martin"
                  role="Étudiante en Droit"
                  image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374"
                  content="Grâce à mon tuteur en droit constitutionnel, j'ai pu améliorer considérablement mes notes et comprendre des concepts qui me semblaient impossibles à assimiler. Je recommande vivement TutorConnect !"
                />
                <TestimonialCard
                  name="Thomas Dubois"
                  role="Étudiant en Informatique"
                  image="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1374"
                  content="J'étais complètement perdu en algorithmique avancée jusqu'à ce que je trouve un tuteur sur cette plateforme. Les sessions sont interactives et parfaitement adaptées à mon rythme d'apprentissage."
                />
              </TabsContent>

              <TabsContent value="highschool" className="space-y-8">
                <TestimonialCard
                  name="Emma Petit"
                  role="Élève en Terminale"
                  image="https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=1374"
                  content="Mon tuteur en mathématiques m'a aidée à préparer le bac avec confiance. J'ai obtenu une mention très bien alors que j'étais en difficulté au début de l'année !"
                />
                <TestimonialCard
                  name="Lucas Bernard"
                  role="Élève en Première"
                  image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374"
                  content="Les cours de physique-chimie sur TutorConnect sont beaucoup plus clairs que ceux que je reçois au lycée. Mon tuteur utilise des exemples concrets qui m'aident vraiment à comprendre."
                />
              </TabsContent>

              <TabsContent value="professional" className="space-y-8">
                <TestimonialCard
                  name="Julie Moreau"
                  role="En reconversion professionnelle"
                  image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376"
                  content="Je me suis inscrite pour apprendre le développement web dans le cadre de ma reconversion. Mon tuteur m'a guidée pas à pas et j'ai pu décrocher mon premier emploi dans le domaine !"
                />
                <TestimonialCard
                  name="Antoine Leroy"
                  role="Entrepreneur"
                  image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470"
                  content="Les cours de comptabilité et gestion m'ont permis de mieux gérer ma petite entreprise. Un investissement qui a rapidement porté ses fruits."
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions fréquentes</h2>
              <p className="text-gray-400">Tout ce que vous devez savoir sur notre plateforme de tutorat.</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-gray-900 rounded-lg border border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    Comment choisir le bon tuteur ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-400">
                    Vous pouvez parcourir les profils des tuteurs, lire leurs évaluations et leurs spécialités. Nous
                    proposons également une session d'essai de 15 minutes pour vous assurer que le tuteur correspond à
                    vos besoins.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-gray-900 rounded-lg border border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    Combien coûtent les sessions de tutorat ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-400">
                    Les tarifs varient selon l'expérience du tuteur et la matière enseignée. Les prix commencent à 15€
                    de l'heure et peuvent aller jusqu'à 50€ pour des tuteurs très expérimentés ou des sujets
                    spécialisés.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-gray-900 rounded-lg border border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    Comment se déroulent les sessions de tutorat ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-400">
                    Les sessions se déroulent en ligne via notre plateforme intégrée de visioconférence. Vous pouvez
                    partager votre écran, utiliser un tableau blanc virtuel et échanger des documents avec votre tuteur.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-gray-900 rounded-lg border border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    Puis-je annuler une session réservée ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-400">
                    Oui, vous pouvez annuler une session jusqu'à 24 heures avant l'heure prévue sans frais. Pour les
                    annulations de dernière minute, des frais peuvent s'appliquer.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-gray-900 rounded-lg border border-gray-800">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    Comment devenir tuteur sur la plateforme ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-400">
                    Pour devenir tuteur, vous devez postuler via notre site, passer un entretien et démontrer votre
                    expertise dans votre domaine. Nous vérifions également vos diplômes et références.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Prêt à améliorer vos résultats académiques ?</h2>
                <p className="text-gray-300 text-lg">
                  Rejoignez des milliers d'étudiants qui ont transformé leur parcours académique grâce à TutorConnect.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-base">
                    S'inscrire maintenant
                  </Button>
                  <Button size="lg" variant="outline" className="text-base">
                    Explorer les matières
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">TutorConnect</span>
              </div>
              <p className="text-gray-400 mb-4">
                La plateforme de tutorat qui connecte les étudiants avec les meilleurs tuteurs pour réussir leurs
                études.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
                    Témoignages
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Matières</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Mathématiques
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Physique-Chimie
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Langues étrangères
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Informatique
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Sciences humaines
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  <span className="block">Email:</span>
                  <a href="mailto:contact@tutorconnect.com" className="hover:text-white transition-colors">
                    contact@tutorconnect.com
                  </a>
                </li>
                <li className="text-gray-400">
                  <span className="block">Téléphone:</span>
                  <a href="tel:+33123456789" className="hover:text-white transition-colors">
                    +33 1 23 45 67 89
                  </a>
                </li>
                <li className="text-gray-400">
                  <span className="block">Adresse:</span>
                  <address className="not-italic">
                    123 Avenue de l'Éducation
                    <br />
                    75001 Paris, France
                  </address>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TutorConnect. Tous droits réservés.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Mentions légales
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Politique de confidentialité
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function TestimonialCard({ name, role, image, content }) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div>
            <h4 className="font-bold">{name}</h4>
            <p className="text-gray-400 text-sm">{role}</p>
          </div>
          <div className="ml-auto flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
        </div>
        <p className="text-gray-300 italic">"{content}"</p>
      </div>
    </Card>
  )
}

