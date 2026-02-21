import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ScheduleVisitPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // DATOS MOCK: Días disponibles en el mes (ej. 5, 8, 12...)
  const availableDays = [5, 8, 12, 14, 15, 19, 22, 23, 26, 29];
  
  // Generar días del mes (simulado 30 días)
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Por favor selecciona fecha y hora");
      return;
    }
    toast.success("¡Visita agendada con éxito! El anfitrión confirmará pronto.");
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden flex items-center justify-center">
      
      {/* Luces Ambientales */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl">
        
        <Link to={`/product/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="size-5" /> Volver a la propiedad
        </Link>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* LADO IZQUIERDO: Calendario */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Selecciona una fecha</h2>
            <p className="text-gray-400 mb-6 text-sm">Los días marcados en verde están disponibles.</p>

            {/* Cabecera del Mes */}
            <div className="flex justify-between items-center mb-4 bg-black/20 p-3 rounded-xl border border-white/5">
              <button className="btn btn-circle btn-ghost btn-sm text-white"><ChevronLeft /></button>
              <span className="text-lg font-bold text-white">Octubre 2025</span>
              <button className="btn btn-circle btn-ghost btn-sm text-white"><ChevronRight /></button>
            </div>

            {/* Grid del Calendario */}
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                <span key={d} className="text-gray-500 text-xs font-bold">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const isAvailable = availableDays.includes(day);
                const isSelected = selectedDate === day;
                
                return (
                  <button
                    key={day}
                    disabled={!isAvailable}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all
                      ${isSelected ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 scale-110' : ''}
                      ${!isSelected && isAvailable ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 cursor-pointer' : ''}
                      ${!isSelected && !isAvailable ? 'text-gray-600 cursor-not-allowed' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LADO DERECHO: Hora y Confirmación */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Selecciona una hora</h2>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {['09:00 AM', '10:30 AM', '01:00 PM', '04:30 PM', '06:00 PM'].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      py-3 rounded-xl border transition-all flex items-center justify-center gap-2
                      ${selectedTime === time 
                        ? 'bg-white text-black border-white font-bold' 
                        : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'}
                    `}
                  >
                    <Clock className="size-4" /> {time}
                  </button>
                ))}
              </div>

              {/* Resumen */}
              <div className="bg-black/30 rounded-2xl p-4 border border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fecha:</span>
                  <span className="text-white font-medium">{selectedDate ? `${selectedDate} de Octubre` : '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hora:</span>
                  <span className="text-white font-medium">{selectedTime || '-'}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSchedule}
              className="w-full btn bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl h-12 text-lg shadow-lg shadow-orange-900/20 mt-6"
            >
              Confirmar Visita <CheckCircle className="size-5 ml-2" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ScheduleVisitPage;