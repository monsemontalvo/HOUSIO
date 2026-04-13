import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, ArrowLeft, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useVisitaStore } from '../store/useVisitaStore';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const HORARIOS = ['09:00 AM', '10:30 AM', '01:00 PM', '04:30 PM', '06:00 PM'];

const ScheduleVisitPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agendarVisita, isLoading } = useVisitaStore();
  
  // FECHAS BASE
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  // ESTADOS DEL CALENDARIO
  const [viewDate, setViewDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedTime, setSelectedTime] = useState(null);

  // NAVEGACIÓN DE MESES
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const isCurrentMonth = viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();
    if (!isCurrentMonth) {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    }
  };

  // MATEMÁTICA DEL CALENDARIO
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); 

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const blanks = Array(firstDay).fill(null); 
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1); 

  const isDatePast = (day) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // --- NUEVA LÓGICA: Validar si la hora ya pasó el día de hoy ---
  const isTimePast = (timeStr) => {
    if (!selectedDate) return false;

    const ahora = new Date();
    const esHoy = selectedDate.getDate() === ahora.getDate() && 
                  selectedDate.getMonth() === ahora.getMonth() && 
                  selectedDate.getFullYear() === ahora.getFullYear();

    // Si no es hoy (es decir, es mañana o el próximo mes), todas las horas están libres
    if (!esHoy) return false;

    // Convertimos "04:30 PM" a formato militar (16:30) para comparar
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const horaDeCita = new Date();
    horaDeCita.setHours(hours, minutes, 0, 0);

    // Retorna true si la hora de la cita es menor a la hora actual
    return horaDeCita < ahora;
  };

  // Si el usuario cambia a "Hoy" y tenía seleccionada una hora que ya pasó, se la quitamos
  useEffect(() => {
    if (selectedDate && selectedTime && isTimePast(selectedTime)) {
      setSelectedTime(null);
    }
  }, [selectedDate]);

  // GUARDAR EN BASE DE DATOS
  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Por favor selecciona fecha y hora");
      return;
    }
    
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const fechaCompleta = `${year}-${month}-${day}`;
    
    const success = await agendarVisita({
        inmuebleId: id,
        fecha: fechaCompleta,
        hora: selectedTime
    });

    if(success) {
        setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden flex items-center justify-center">
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

            <div className="flex justify-between items-center mb-4 bg-black/20 p-3 rounded-xl border border-white/5">
              <button 
                onClick={prevMonth} 
                disabled={viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear()}
                className="btn btn-circle btn-ghost btn-sm text-white disabled:opacity-20"
              >
                <ChevronLeft />
              </button>
              <span className="text-lg font-bold text-white capitalize">
                {MESES[currentMonth]} {currentYear}
              </span>
              <button onClick={nextMonth} className="btn btn-circle btn-ghost btn-sm text-white">
                <ChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                <span key={i} className="text-gray-500 text-xs font-bold">{d}</span>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} className="aspect-square"></div>
              ))}

              {days.map((day) => {
                const isPast = isDatePast(day);
                const isSelected = selectedDate?.getDate() === day && 
                                   selectedDate?.getMonth() === currentMonth && 
                                   selectedDate?.getFullYear() === currentYear;
                
                return (
                  <button
                    key={day}
                    disabled={isPast}
                    onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                    className={`
                      aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all
                      ${isSelected ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 scale-110' : ''}
                      ${!isSelected && !isPast ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 cursor-pointer' : ''}
                      ${!isSelected && isPast ? 'text-gray-600 bg-white/5 cursor-not-allowed opacity-50' : ''}
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
                {HORARIOS.map((time) => {
                  const pastTime = isTimePast(time); // Verificamos si la hora ya pasó

                  return (
                    <button
                      key={time}
                      disabled={pastTime || !selectedDate} // Se bloquea si ya pasó o si no han elegido día
                      onClick={() => setSelectedTime(time)}
                      className={`
                        py-3 rounded-xl border transition-all flex items-center justify-center gap-2
                        ${pastTime || !selectedDate
                          ? 'opacity-30 cursor-not-allowed bg-black/20 border-white/5 text-gray-500' // Estilo bloqueado
                          : selectedTime === time 
                            ? 'bg-white text-black border-white font-bold scale-105' // Seleccionado
                            : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5' // Disponible
                        }
                      `}
                    >
                      <Clock className="size-4" /> {time}
                    </button>
                  );
                })}
              </div>

              {/* Resumen */}
              <div className="bg-black/30 rounded-2xl p-4 border border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Fecha:</span>
                  <span className="text-white font-medium capitalize">
                    {selectedDate ? `${selectedDate.getDate()} de ${MESES[selectedDate.getMonth()]}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hora:</span>
                  <span className="text-white font-medium">{selectedTime || '-'}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSchedule}
              disabled={isLoading || !selectedDate || !selectedTime}
              className="w-full btn bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl h-12 text-lg shadow-lg shadow-orange-900/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader className="animate-spin" /> : <>Confirmar Visita <CheckCircle className="size-5 ml-2" /></>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ScheduleVisitPage;