"use client"

import React, { useState, useEffect, useRef } from "react";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MessageSquare, Send, Paperclip, Image, File, MoreVertical, Search, ArrowLeft, Check, CheckCheck, Clock, Phone, Video, User, X, Smile, Mic, GraduationCap, Bell } from 'lucide-react';
import { db, storage } from "@/firebase/config";

export default function ChatPage() {
    
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "user123",
    name: "Jean Dupont",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480",
    role: "student"
  });
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Simuler les emojis
  const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"];

  useEffect(() => {
    // Récupérer les conversations de l'utilisateur
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const q = query(
          collection(db, "conversations"),
          where("participants", "array-contains", currentUser.id),
          orderBy("lastMessageAt", "desc")
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const conversationsData = [];
          
          snapshot.forEach((doc) => {
            conversationsData.push({
              id: doc.id,
              ...doc.data(),
              lastMessageAt: doc.data().lastMessageAt?.toDate()
            });
          });
          
          setConversations(conversationsData);
          setIsLoading(false);
        });
        
        return () => unsubscribe();
      } catch (error) {
        console.error("Erreur lors de la récupération des conversations:", error);
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, [currentUser.id]);

  useEffect(() => {
    // Récupérer les messages de la conversation active
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          const q = query(
            collection(db, "messages"),
            where("conversationId", "==", activeConversation.id),
            orderBy("createdAt", "asc")
          );
          
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData = [];
            
            snapshot.forEach((doc) => {
              messagesData.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
              });
            });
            
            setMessages(messagesData);
            
            // Marquer les messages comme lus
            messagesData.forEach(async (message) => {
              if (message.senderId !== currentUser.id && !message.read) {
                await updateDoc(doc(db, "messages", message.id), {
                  read: true,
                  readAt: serverTimestamp()
                });
              }
            });
          });
          
          return () => unsubscribe();
        } catch (error) {
          console.error("Erreur lors de la récupération des messages:", error);
        }
      };
      
      fetchMessages();
      
      // Mettre à jour le statut de la conversation
      const updateConversationStatus = async () => {
        try {
          await updateDoc(doc(db, "conversations", activeConversation.id), {
            [`lastSeen.${currentUser.id}`]: serverTimestamp()
          });
        } catch (error) {
          console.error("Erreur lors de la mise à jour du statut de la conversation:", error);
        }
      };
      
      updateConversationStatus();
    }
  }, [activeConversation, currentUser.id]);

  useEffect(() => {
    // Faire défiler vers le bas lorsque de nouveaux messages arrivent
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() && !selectedFile) return;
    
    try {
      let fileURL = null;
      let fileType = null;
      let fileName = null;
      
      // Télécharger le fichier s'il y en a un
      if (selectedFile) {
        const fileRef = ref(storage, `chat/${activeConversation.id}/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(fileRef, selectedFile);
        fileURL = await getDownloadURL(fileRef);
        fileType = selectedFile.type.startsWith('image/') ? 'image' : 'file';
        fileName = selectedFile.name;
      }
      
      // Ajouter le message à Firestore
      const messageData = {
        conversationId: activeConversation.id,
        senderId: currentUser.id,
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        read: false,
        fileURL,
        fileType,
        fileName
      };
      
      await addDoc(collection(db, "messages"), messageData);
      
      // Mettre à jour la dernière activité de la conversation
      await updateDoc(doc(db, "conversations", activeConversation.id), {
        lastMessageAt: serverTimestamp(),
        lastMessage: newMessage.trim() || (fileType === 'image' ? 'Image' : 'Fichier')
      });
      
      // Réinitialiser le formulaire
      setNewMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const getOtherParticipant = (conversation) => {
    const otherParticipantId = conversation.participants.find(id => id !== currentUser.id);
    return conversation.participantsInfo?.[otherParticipantId] || { name: "Utilisateur inconnu" };
  };

  const formatTime = (date) => {
    if (!date) return "";
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date >= yesterday) {
      return "Hier";
    } else {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  const getMessageStatus = (message) => {
    if (message.senderId !== currentUser.id) return null;
    
    if (message.read) {
      return <CheckCheck className="h-4 w-4 text-blue-500" />;
    } else {
      return <Check className="h-4 w-4 text-gray-400" />;
    }
  };

  // Filtrer les conversations en fonction de la recherche
  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = getOtherParticipant(conversation);
    return otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col dark">
      <header className="border-b border-gray-800 sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">TutorConnect Chat</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img 
                  src={currentUser.avatar || "/placeholder.svg"} 
                  alt={currentUser.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-medium hidden md:inline">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Liste des conversations */}
        <div className={`w-full md:w-80 border-r border-gray-800 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Rechercher une conversation..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(conversation => {
                    const otherParticipant = getOtherParticipant(conversation);
                    const unreadCount = conversation.unreadCount?.[currentUser.id] || 0;
                    
                    return (
                      <button
                        key={conversation.id}
                        className={`w-full flex items-center gap-3 p-4 hover:bg-gray-900 transition-colors ${
                          activeConversation?.id === conversation.id ? 'bg-gray-900' : ''
                        }`}
                        onClick={() => setActiveConversation(conversation)}
                      >
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                            <img 
                              src={otherParticipant.avatar || "https://via.placeholder.com/40"} 
                              alt={otherParticipant.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          {otherParticipant.online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-black"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{otherParticipant.name}</h3>
                            <span className="text-xs text-gray-400">
                              {formatTime(conversation.lastMessageAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400 truncate">
                              {conversation.lastMessage || "Nouvelle conversation"}
                            </p>
                            {unreadCount > 0 && (
                              <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 p-4">
                    <MessageSquare className="h-12 w-12 text-gray-600 mb-4" />
                    <p className="text-gray-400 text-center">
                      {searchQuery ? "Aucune conversation trouvée." : "Aucune conversation active."}
                    </p>
                    <button className="mt-4 py-2 px-4 bg-primary text-white rounded-lg">
                      Nouvelle conversation
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Zone de chat */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col">
            {/* En-tête de la conversation */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  className="md:hidden p-2 rounded-lg bg-gray-900 text-gray-400"
                  onClick={() => setActiveConversation(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img 
                        src={getOtherParticipant(activeConversation).avatar || "https://via.placeholder.com/40"} 
                        alt={getOtherParticipant(activeConversation).name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {getOtherParticipant(activeConversation).online && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-black"></div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{getOtherParticipant(activeConversation).name}</h3>
                    <p className="text-xs text-gray-400">
                      {getOtherParticipant(activeConversation).online ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white">
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((message, index) => {
                  const isCurrentUser = message.senderId === currentUser.id;
                  const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                  
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCurrentUser && showAvatar && (
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                          <img 
                            src={getOtherParticipant(activeConversation).avatar || "https://via.placeholder.com/32"} 
                            alt={getOtherParticipant(activeConversation).name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className={`max-w-[70%] ${!isCurrentUser && !showAvatar ? 'ml-10' : ''}`}>
                        {message.fileURL && message.fileType === 'image' && (
                          <div className={`rounded-lg overflow-hidden mb-1 ${isCurrentUser ? 'bg-primary/20' : 'bg-gray-800'}`}>
                            <img 
                              src={message.fileURL || "/placeholder.svg"} 
                              alt="Image partagée" 
                              className="max-w-full rounded-lg"
                            />
                          </div>
                        )}
                        
                        {message.fileURL && message.fileType === 'file' && (
                          <div className={`p-3 rounded-lg flex items-center gap-3 mb-1 ${isCurrentUser ? 'bg-primary/20' : 'bg-gray-800'}`}>
                            <File className="h-8 w-8 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{message.fileName}</p>
                              <a 
                                href={message.fileURL} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs text-primary hover:underline"
                              >
                                Télécharger
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {message.text && (
                          <div className={`p-3 rounded-lg ${isCurrentUser ? 'bg-primary/20 text-white' : 'bg-gray-800 text-gray-200'}`}>
                            <p>{message.text}</p>
                          </div>
                        )}
                        
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <span>{formatTime(message.createdAt)}</span>
                          {getMessageStatus(message)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <MessageSquare className="h-12 w-12 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-center">
                    Aucun message. Commencez la conversation !
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Zone de saisie */}
            <div className="p-4 border-t border-gray-800">
              {selectedFile && (
                <div className="mb-2 p-2 bg-gray-900 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedFile.type.startsWith('image/') ? (
                      <Image className="h-5 w-5 text-blue-500" />
                    ) : (
                      <File className="h-5 w-5 text-blue-500" />
                    )}
                    <span className="text-sm truncate">{selectedFile.name}</span>
                  </div>
                  <button 
                    className="p-1 rounded-full bg-gray-800 text-gray-400 hover:text-white"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button 
                  type="button" 
                  className="p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-5 w-5" />
                </button>
                
                <button 
                  type="button" 
                  className="p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white"
                  onClick={handleFileSelect}
                >
                  <Paperclip className="h-5 w-5" />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </button>
                
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Écrivez un message..."
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 border border-gray-800 rounded-lg grid grid-cols-8 gap-2">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          className="h-8 w-8 flex items-center justify-center hover:bg-gray-800 rounded"
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  type="button" 
                  className="p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white"
                >
                  <Mic className="h-5 w-5" />
                </button>
                
                <button 
                  type="submit" 
                  className="p-2 rounded-full bg-primary text-white"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Vos messages</h3>
              <p className="text-gray-400 mb-6">
                Sélectionnez une conversation ou commencez-en une nouvelle.
              </p>
              <button className="py-2 px-4 bg-primary text-white rounded-lg">
                Nouvelle conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
