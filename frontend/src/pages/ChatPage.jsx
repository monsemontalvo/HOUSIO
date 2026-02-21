import React, { useState } from 'react';
import { Send, Search, MoreVertical, Smile, Paperclip } from 'lucide-react'; // Eliminados Phone y Video

const ChatPage = () => {
  // Estado local para simular mensajes
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Agregar mensaje simulado
    setMessages([...messages, { id: Date.now(), text: inputValue, sender: 'me', time: 'Justo ahora' }]);
    setInputValue("");
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative pt-20 px-4 pb-4 overflow-hidden flex flex-col">
      
      {/* Luces Ambientales */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Contenedor Principal de Chat (Glass) */}
      <div className="flex-1 max-w-7xl mx-auto w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex">
        
        {/* --- SIDEBAR (Lista de Contactos) --- */}
        <div className="w-80 border-r border-white/10 bg-black/20 hidden md:flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Mensajes</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500 size-4" />
              <input type="text" placeholder="Buscar..." className="w-full bg-black/30 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-orange-500/50 outline-none" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {/* Contacto Simulado (Activo) */}
            <div className="p-3 rounded-xl bg-white/10 border border-white/5 cursor-pointer flex gap-3 items-center">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Host" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Roberto Gómez</h3>
                <p className="text-gray-400 text-xs truncate">Anfitrión - Loft San Nicolás</p>
              </div>
            </div>
            {/* Otros contactos (inactivos) */}
            {[1, 2].map((i) => (
              <div key={i} className="p-3 rounded-xl hover:bg-white/5 cursor-pointer flex gap-3 items-center opacity-50">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                </div>
                <div>
                  <div className="h-4 w-24 bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 w-32 bg-gray-700/50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ÁREA DE CHAT --- */}
        <div className="flex-1 flex flex-col bg-black/40 relative">
          
          {/* Header del Chat (LIMPIO) */}
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="avatar"> 
                <div className="w-10 h-10 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold">Roberto Gómez</h3>
                {/* Eliminado el texto de "En línea" */}
              </div>
            </div>

          </div>

          {/* Cuerpo de Mensajes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              // ESTADO VACÍO (Placeholder por defecto)
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Send className="size-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Aún no hay mensajes</h3>
                <p className="text-gray-400 max-w-xs">Envía un mensaje para comenzar a coordinar tu visita con Roberto.</p>
              </div>
            ) : (
              // LISTA DE MENSAJES
              messages.map((msg) => (
                <div key={msg.id} className={`chat ${msg.sender === 'me' ? 'chat-end' : 'chat-start'}`}>
                  <div className={`chat-bubble ${msg.sender === 'me' ? 'bg-orange-600 text-white' : 'bg-white/10 text-gray-200'}`}>
                    {msg.text}
                  </div>
                  <div className="chat-footer opacity-50 text-xs text-gray-400 mt-1">{msg.time}</div>
                </div>
              ))
            )}
          </div>

          {/* Input de Mensaje */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button type="button" className="btn btn-ghost btn-circle text-gray-400 hover:text-white"><Paperclip className="size-5" /></button>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe un mensaje..." 
                  className="w-full bg-black/30 border border-white/10 rounded-full py-3 pl-4 pr-10 text-white focus:border-orange-500/50 outline-none"
                />
                <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-white"><Smile className="size-5" /></button>
              </div>
              <button type="submit" className="btn btn-circle bg-orange-600 hover:bg-orange-700 text-white border-none shadow-lg shadow-orange-900/20">
                <Send className="size-5" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;