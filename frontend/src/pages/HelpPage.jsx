import React from 'react';
import { Mail, MessageCircle, Phone, Send } from 'lucide-react';

const HelpPage = () => {
  return (
    <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden">
      
      {/* Luces Ambientales */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        
        {/* Encabezado */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
            Centro de Ayuda
          </h1>
          <p className="text-lg text-gray-400">
            Resuelve tus dudas sobre HOUSIO
          </p>
        </div>

        {/* Sección de Preguntas Frecuentes (TUS PREGUNTAS) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white mb-6">Preguntas Frecuentes</h2>
          
          {[
            { 
              q: "¿Cómo puedo publicar mi departamento?", 
              a: "Para publicar, necesitas una cuenta de 'Arrendador'. Ve a tu perfil y selecciona la opción 'Convertirme en anfitrión' o contáctanos para verificar tu propiedad." 
            },
            { 
              q: "¿Cómo busco departamentos con filtros específicos?", 
              a: "En el Dashboard principal, usa la barra de herramientas superior. Puedes filtrar por precio, tipo de propiedad (casa, depa, habitación) y amenidades como Wifi o Cochera." 
            },
            { 
              q: "¿Cómo agendo una visita?", 
              a: "Entra al detalle de la propiedad que te gusta y usa el botón 'Contactar' o 'Agendar Cita'. El propietario recibirá tu solicitud y coordinarán la fecha." 
            },
            { 
              q: "¿Cómo contacto al propietario?", 
              a: "Una vez que inicies sesión, podrás ver los datos de contacto (teléfono o chat interno) en el perfil de la casa seleccionada." 
            },
            { 
              q: "¿Es segura la plataforma?", 
              a: "Sí. Verificamos la identidad de todos los usuarios con correo universitario y revisamos que las propiedades publicadas sean reales para evitar fraudes." 
            },
            { 
              q: "¿Hay algún costo por usar la plataforma?", 
              a: "No, HOUSIO es completamente GRATIS para los estudiantes. Nuestro objetivo es ayudarte a encontrar hogar sin comisiones extra." 
            },
            { 
              q: "¿Qué debo tener en cuenta al rentar?", 
              a: "Revisa bien la ubicación respecto a tu facultad, pregunta si los servicios están incluidos en la renta y lee siempre el contrato antes de firmar." 
            }
          ].map((item, idx) => (
            <div key={idx} className="collapse collapse-arrow bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
              <input type="radio" name="my-accordion-2" defaultChecked={idx === 0} /> 
              <div className="collapse-title text-xl font-medium text-gray-200 group-hover:text-orange-400">
                {item.q}
              </div>
              <div className="collapse-content">
                <p className="text-gray-400">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Contacto (Igual que antes) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white">¿Aún tienes dudas?</h3>
              <p className="text-gray-400">Escríbenos directamente.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="bg-white/10 p-3 rounded-xl text-orange-400"><Mail className="size-6" /></div>
                  <span>soporte@housio.com</span>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="bg-white/10 p-3 rounded-xl text-blue-400"><Phone className="size-6" /></div>
                  <span>+52 (81) 1234 5678</span>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div className="form-control">
                <input type="email" placeholder="Tu correo" className="input bg-black/30 border-white/10 text-white focus:border-orange-500/50 rounded-xl w-full" />
              </div>
              <div className="form-control">
                <textarea className="textarea bg-black/30 border-white/10 text-white focus:border-orange-500/50 rounded-xl h-32 w-full" placeholder="Tu mensaje..."></textarea>
              </div>
              <button className="btn bg-orange-600 hover:bg-orange-700 text-white border-none w-full rounded-xl shadow-lg">
                Enviar <Send className="size-5 ml-2" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpPage;