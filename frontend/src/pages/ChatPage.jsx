import React, { useEffect, useState, useRef } from 'react';
import { Send, Search, Smile, Paperclip } from 'lucide-react'; 
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

const ChatPage = () => {
  const { authUser } = useAuthStore();
  const { mensajes, contactos, getContactos, getMensajes, enviarMensaje, selectedUser, setSelectedUser, connectSocket, disconnectSocket } = useChatStore();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Inicializar contactos y socket
  useEffect(() => {
    getContactos();
    connectSocket();
    return () => disconnectSocket();
  }, [getContactos, connectSocket, disconnectSocket]);

  // Cargar mensajes cuando cambia el usuario seleccionado
  useEffect(() => {
    if (selectedUser) getMensajes(selectedUser._id);
  }, [selectedUser, getMensajes]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await enviarMensaje(inputValue);
    setInputValue("");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-neutral-950 relative pt-20 px-4 pb-4 overflow-hidden flex flex-col">
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="flex-1 max-w-7xl mx-auto w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex h-[80vh]">
        
        {/* SIDEBAR DE CONTACTOS */}
        <div className="w-80 border-r border-white/10 bg-black/20 hidden md:flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Mensajes</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {contactos.map((contacto) => (
              <div 
                key={contacto._id} 
                onClick={() => setSelectedUser(contacto)}
                className={`p-3 rounded-xl cursor-pointer flex gap-3 items-center transition-colors
                  ${selectedUser?._id === contacto._id ? 'bg-white/10 border border-white/5' : 'hover:bg-white/5 opacity-70'}`}
              >
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full bg-black/50 overflow-hidden">
                    <img src={contacto.profilePic || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt={contacto.fullName} />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm capitalize">{contacto.fullName}</h3>
                  <p className="text-gray-400 text-xs truncate capitalize">{contacto.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ÁREA DE CHAT */}
        <div className="flex-1 flex flex-col bg-black/40 relative">
          {!selectedUser ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <h3 className="text-2xl font-bold text-white">Selecciona un chat</h3>
              <p className="text-gray-400">Elige un contacto de la barra lateral.</p>
            </div>
          ) : (
            <>
              <div className="h-16 border-b border-white/10 flex items-center px-6 bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="avatar"> 
                    <div className="w-10 h-10 rounded-full bg-black/50 overflow-hidden">
                      <img src={selectedUser.profilePic || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt="User" />
                    </div>
                  </div>
                  <h3 className="text-white font-bold capitalize">{selectedUser.fullName}</h3>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {mensajes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-50">
                     <p className="text-gray-400 text-center max-w-xs">Envía un mensaje para comenzar la conversación.</p>
                  </div>
                ) : (
                  mensajes.map((msg) => {
                    const isMe = msg.remitente === authUser._id;
                    return (
                      <div key={msg._id} className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}>
                        <div className={`chat-bubble ${isMe ? 'bg-orange-600 text-white' : 'bg-white/10 text-gray-200'}`}>
                          {msg.contenido}
                        </div>
                        <div className="chat-footer opacity-50 text-xs text-gray-400 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Escribe un mensaje..." 
                      className="w-full bg-black/30 border border-white/10 rounded-full py-3 pl-4 pr-10 text-white focus:border-orange-500/50 outline-none"
                    />
                  </div>
                  <button type="submit" className="btn btn-circle bg-orange-600 hover:bg-orange-700 text-white border-none shadow-lg">
                    <Send className="size-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;