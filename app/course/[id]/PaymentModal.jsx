"use client"

import { useState } from "react"
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore"
import { X, Check } from "lucide-react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../../firebase/config"

export default function PaymentModal({ course, onClose, onPaymentSuccess }) {
  const [user] = useAuthState(auth)
  const [paymentMethod, setPaymentMethod] = useState("momo")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handlePayment = async () => {
    if (!user) {
      setError("Vous devez être connecté pour effectuer un paiement")
      return
    }

    if (!phoneNumber) {
      setError("Veuillez entrer votre numéro de téléphone")
      return
    }

    setProcessing(true)
    setError("")

    try {
      // 1. Enregistrer la transaction
      const transactionRef = doc(collection(db,  `users/${user?.uid}/transactions`))
      await setDoc(transactionRef, {
        userId: user.uid,
        courseId: course.id,
        paymentMethod,
        phoneNumber,
        amount: course.price,
        status: "pending",
        createdAt: serverTimestamp(),
      })

      // 2. Ajouter aux cours achetés
      const myCourseRef = doc(db, `users/${user.uid}/myCourses`, course.id)
      await setDoc(myCourseRef, {
        ...course,
        purchasedAt: serverTimestamp(),
        paymentStatus: "paid",
      })

      setSuccess(true)
      setTimeout(() => {
        onPaymentSuccess()
      }, 1500)
    } catch (err) {
      console.error("Payment error:", err)
      setError("Erreur lors du paiement: " + err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Paiement du cours</h2>
        
        {success ? (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Paiement effectué!</h3>
            <p className="text-gray-300">Vous pouvez maintenant accéder au cours.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-lg mb-2">
                <span className="font-semibold">{course.title}</span>
                <span className="float-right font-bold">{course.price} €</span>
              </p>

              <div className="space-y-3 my-4">
                <p className="font-medium">Méthode de paiement:</p>
                <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-md">
                  <input
                    type="radio"
                    checked={paymentMethod === "momo"}
                    onChange={() => setPaymentMethod("momo")}
                    className="h-4 w-4 text-primary"
                  />
                  <span>Mobile Money (MOMO)</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-700 rounded-md">
                  <input
                    type="radio"
                    checked={paymentMethod === "om"}
                    onChange={() => setPaymentMethod("om")}
                    className="h-4 w-4 text-primary"
                  />
                  <span>Orange Money (OM)</span>
                </label>
              </div>

              <div className="mt-4">
                <label className="block mb-2">Numéro {paymentMethod === "momo" ? "MOMO" : "OM"}</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={`6XX XX XX XX`}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={processing}
                className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handlePayment}
                disabled={processing}
                className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-md disabled:opacity-50"
              >
                {processing ? "Traitement..." : "Payer maintenant"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}