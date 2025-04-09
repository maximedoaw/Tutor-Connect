'use client';

import { useRouter } from 'next/navigation';

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Accès non autorisé 🚫</h1>
        <p className="mb-6 text-gray-300">
          Vous n'avez pas la permission d'accéder à cette page.
          <br />
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Retour à l’accueil
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
