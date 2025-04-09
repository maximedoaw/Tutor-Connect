import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function CommentsTab({ courseId }) {
  const [newComment, setNewComment] = useState("");
  const [comments, loading, error] = useCollection(
    collection(db, `courses/${courseId}/comments`)
  );

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Veuillez vous connecter pour poster un commentaire.");
      return;
    }

    try {
      await addDoc(collection(db, `courses/${courseId}/comments`), {
        text: newComment,
        userId: user.uid,
        user: user.displayName || "Anonyme",
        avatar: user.photoURL || "",
        date: serverTimestamp(),
        likes: [],
        dislikes: [],
        replies: [],
      });
      setNewComment("");
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire :", err);
    }
  };

  if (loading) return <div>Chargement des commentaires...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Commentaires et questions</h3>

      <div className="space-y-4">
        <Textarea
          placeholder="Posez une question ou partagez vos réflexions..."
          className="bg-gray-800 border-gray-700 min-h-[100px]"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handlePostComment}>Publier un commentaire</Button>
      </div>

      <Separator className="bg-gray-800" />

      <div className="space-y-6">
        {comments?.docs.map((doc) => (
          <CommentItem key={doc.id} comment={{ id: doc.id, ...doc.data() }} courseId={courseId} />
        ))}
      </div>
    </div>
  );
}

function CommentItem({ comment, courseId }) {
  const user = auth.currentUser;
  const [newReply, setNewReply] = useState("");

  // S'assurer que likes et dislikes sont des tableaux
  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  const dislikes = Array.isArray(comment.dislikes) ? comment.dislikes : [];

  const handleLike = async () => {
    if (!user) return;

    const commentRef = doc(db, `courses/${courseId}/comments`, comment.id);

    if (likes.includes(user.uid)) {
      // Retirer le like
      await updateDoc(commentRef, {
        likes: arrayRemove(user.uid),
      });
    } else {
      // Ajouter un like et retirer un dislike s'il existe
      await updateDoc(commentRef, {
        likes: arrayUnion(user.uid),
        dislikes: arrayRemove(user.uid),
      });
    }
  };

  const handleDislike = async () => {
    if (!user) return;

    const commentRef = doc(db, `courses/${courseId}/comments`, comment.id);

    if (dislikes.includes(user.uid)) {
      // Retirer le dislike
      await updateDoc(commentRef, {
        dislikes: arrayRemove(user.uid),
      });
    } else {
      // Ajouter un dislike et retirer un like s'il existe
      await updateDoc(commentRef, {
        dislikes: arrayUnion(user.uid),
        likes: arrayRemove(user.uid),
      });
    }
  };

  const handlePostReply = async () => {
    if (!newReply.trim()) return;

    try {
      const commentRef = doc(db, `courses/${courseId}/comments`, comment.id);

      // Créer un objet de réponse avec un timestamp
      const reply = {
        text: newReply,
        userId: user.uid,
        user: user.displayName || "Anonyme",
        avatar: user.photoURL || "",
        date: serverTimestamp(), // Utiliser serverTimestamp() ici
      };

      // Ajouter la réponse au tableau `replies`
      await updateDoc(commentRef, {
        replies: arrayUnion(reply),
      });

      setNewReply(""); // Réinitialiser le champ de texte
    } catch (err) {
      console.error("Erreur lors de l'ajout de la réponse :", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.avatar} />
            <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{comment.user}</h4>
                <p className="text-xs text-gray-400">
                  {new Date(comment.date?.toDate()).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`text-gray-400 hover:text-white transition-colors ${
                    likes.includes(user?.uid) ? "text-primary" : ""
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <span className="text-sm">{likes.length}</span>
                <button
                  onClick={handleDislike}
                  className={`text-gray-400 hover:text-white transition-colors ${
                    dislikes.includes(user?.uid) ? "text-red-500" : ""
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <span className="text-sm">{dislikes.length}</span>
              </div>
            </div>
            <p className="mt-2">{comment.text}</p>
            <div className="mt-2 flex gap-4">
              <button className="text-sm text-primary hover:underline">Répondre</button>
              <button className="text-sm text-gray-400 hover:text-white">Signaler</button>
            </div>
          </div>
        </div>
      </div>

      {comment.replies && (
        <div className="ml-12 space-y-4">
          {comment.replies.map((reply, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={reply.avatar} />
                <AvatarFallback>{reply.user.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{reply.user}</h4>
                    <p className="text-xs text-gray-400">
                      {new Date(reply.date?.toDate()).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="mt-2">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="ml-12 space-y-4">
        <Textarea
          placeholder="Répondre à ce commentaire..."
          className="bg-gray-800 border-gray-700 min-h-[60px]"
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
        />
        <Button onClick={handlePostReply}>Publier la réponse</Button>
      </div>
    </div>
  );
}