import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Search, 
  CheckCircle, 
  Download, 
  Copy, 
  Clock, 
  Cpu, 
  Wrench, 
  Award, 
  Info, 
  Send,
  Sparkles,
  ArrowRight,
  Shield,
  Briefcase,
  Lightbulb,
  Check,
  RotateCcw,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRAINING_PROGRAMS, FAQ_DATA, ENROLLMENT_STEPS, GENERAL_INFO } from './data';
import { TrainingProgram, ChatMessage, PqrsDraft } from './types';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'programs' | 'chat' | 'pqrs' | 'admissions'>('home');

  // --- PROGRAMS TAB STATE ---
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Operario' | 'Técnico' | 'Tecnólogo'>('All');
  const [programSearch, setProgramSearch] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  // --- CHAT STATE ---
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sena_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: '¡Epa, mijo! Qué alegría tenerte por acá en el portal interactivo del **SENA Calatrava (Itagüí)**. 🇨🇴\n\nYo soy tu **Asesor Paisa Virtual** de confianza. Conmigo podés enterarte de qué programas de confección, corte, mercadeo o software tenemos, cuáles son las fechas, qué papeles necesitás para matricularte, o cómo pedir el almuercito gratis en Bienestar al Aprendiz.\n\nContame, pues, ¿qué tenés en mente hoy? ¿Querés estudiar o tenés alguna duda sobre tu matrícula? ¡Hablemos fresco!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- PQRS STATE ---
  const [pqrsForm, setPqrsForm] = useState({
    fullName: '',
    email: '',
    documentId: '',
    role: 'aspirante' as 'aspirante' | 'aprendiz' | 'egresado',
    programName: '',
    requestType: 'peticion' as 'peticion' | 'queja' | 'reclamo' | 'sugerencia' | 'apoyo_socioeconomico' | 'novedad_tramite',
    details: ''
  });
  const [isGeneratingPqrs, setIsGeneratingPqrs] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [myPqrsDrafts, setMyPqrsDrafts] = useState<PqrsDraft[]>(() => {
    const saved = localStorage.getItem('sena_pqrs_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  // --- ADMISSIONS STATE ---
  const [checkedSteps, setCheckedSteps] = useState<number[]>(() => {
    const saved = localStorage.getItem('sena_admissions_progress');
    return saved ? JSON.parse(saved) : [1]; // Start with registration as checked or first
  });

  // --- SYNC LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('sena_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('sena_pqrs_drafts', JSON.stringify(myPqrsDrafts));
  }, [myPqrsDrafts]);

  useEffect(() => {
    localStorage.setItem('sena_admissions_progress', JSON.stringify(checkedSteps));
  }, [checkedSteps]);

  // Infinite Scroll or Chat Autoscroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- CHAT ACTIONS ---
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    if (!textToSend) setInputVal('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Clean up history to feed the backend (last 10 messages to keep token footprint low)
      const visibleHistory = messages
        .slice(-10)
        .map(m => ({ sender: m.sender, text: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: visibleHistory })
      });

      const data = await res.json();
      
      const replyMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || data.error || 'Lo siento, mijo, se me congestionó el hilo de costura. ¿Me repites porfa?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, replyMsg]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        id: `assistant-error-${Date.now()}`,
        sender: 'assistant',
        text: '¡Vaya hombre! No logré conectarme con el servidor del SENA. Asegúrate de tener la API Key de Gemini configurada de forma segura.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (questionText: string) => {
    setActiveTab('chat');
    handleSendMessage(questionText);
  };

  const clearChatHistory = () => {
    if (confirm('¿Seguro mijo que querés borrar toda la conversación con el asesor? Te quedará limpia desde cero.')) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: '¡Epa, mijo! Qué alegría saludarte de nuevo. Se limpió el historial de costura. ¿Qué duda tenés hoy sobre el SENA Calatrava, pues?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // --- PQRS ACTIONS ---
  const handlePqrsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pqrsForm.fullName || !pqrsForm.documentId || !pqrsForm.details || !pqrsForm.email) {
      alert('Pilas, tenés que llenar los campos obligatorios del formulario.');
      return;
    }

    setIsGeneratingPqrs(true);
    setGeneratedLetter('');

    try {
      const res = await fetch('/api/pqrs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pqrsData: pqrsForm })
      });

      const data = await res.json();
      if (res.ok && data.letter) {
        setGeneratedLetter(data.letter);
        
        // Save to my local history list
        const brandNewDraft: PqrsDraft = {
          id: `pqrs-${Date.now()}`,
          fullName: pqrsForm.fullName,
          email: pqrsForm.email,
          documentId: pqrsForm.documentId,
          role: pqrsForm.role,
          programName: pqrsForm.programName || undefined,
          requestType: pqrsForm.requestType,
          details: pqrsForm.details,
          formattedText: data.letter,
          createdAt: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
          status: 'generado'
        };

        setMyPqrsDrafts(prev => [brandNewDraft, ...prev]);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert(data.error || 'Ocurrió un inconveniente redactando la carta.');
      }
    } catch (error) {
      alert('Ay caramba, no pudimos conectar con el redactor de solicitudes Inteligente.');
    } finally {
      setIsGeneratingPqrs(false);
    }
  };

  const handleCopyLetter = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handleDeleteDraft = (id: string) => {
    if (confirm('¿Deseas eliminar esta solicitud de tu historial local?')) {
      setMyPqrsDrafts(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- ADMISSIONS PIPELINE ACTIONS ---
  const toggleStep = (stepId: number) => {
    if (checkedSteps.includes(stepId)) {
      setCheckedSteps(prev => prev.filter(id => id !== stepId));
    } else {
      setCheckedSteps(prev => [...prev, stepId]);
    }
  };

  const getAdmissionsProgressPercent = () => {
    return Math.round((checkedSteps.length / ENROLLMENT_STEPS.length) * 100);
  };

  // --- RENDER PORTAL UI ---

  // Main Filtered Programs
  const filteredPrograms = TRAINING_PROGRAMS.filter(prog => {
    const matchesLevel = selectedLevel === 'All' || prog.level === selectedLevel;
    const matchesQuery = prog.name.toLowerCase().includes(programSearch.toLowerCase()) || 
                         prog.description.toLowerCase().includes(programSearch.toLowerCase()) ||
                         prog.machinesUsed.some(m => m.toLowerCase().includes(programSearch.toLowerCase()));
    return matchesLevel && matchesQuery;
  });

  return (
    <div id="app_root" className="min-h-screen bg-zinc-100 font-sans text-zinc-900 flex flex-col antialiased">
      
      {/* HEADER PRINCIPAL SOCIAL BRAND */}
      <header id="main_header" className="sticky top-0 z-40 bg-white text-zinc-900 border-b-2 border-zinc-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between py-4 lg:h-22 gap-4">
            
            {/* SENA BRAND LOGO-TEXT */}
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-12 h-12 bg-[#39A900] rounded-xl flex items-center justify-center font-bold text-white shadow-sm border-2 border-zinc-900">
                <span className="text-xl font-black font-mono">S</span>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight leading-none uppercase text-zinc-900">
                  Centro de Diseño, Confección y Moda
                </h1>
                <p className="text-xs text-zinc-500 font-medium">
                  SENA Regional Antioquia • Itagüí (Calatrava)
                </p>
              </div>
            </div>

            {/* HIGH DENSITY TAB NAVIGATION SYSTEM */}
            <nav className="hidden md:flex items-center space-x-2">
              <button 
                id="nav_nav_home"
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border-2 transition-all duration-150 ${activeTab === 'home' ? 'bg-[#39A900] text-white border-zinc-900 shadow-sm' : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'}`}
              >
                Inicio
              </button>
              <button 
                id="nav_nav_programs"
                onClick={() => setActiveTab('programs')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border-2 transition-all duration-150 ${activeTab === 'programs' ? 'bg-[#39A900] text-white border-zinc-900 shadow-sm' : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'}`}
              >
                Programas
              </button>
              <button 
                id="nav_nav_chat"
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border-2 transition-all duration-150 relative ${activeTab === 'chat' ? 'bg-[#39A900] text-white border-zinc-900 shadow-sm' : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'}`}
              >
                IA Asesor Paisa
                <span className="absolute -top-1.5 -right-1 bg-zinc-900 text-[7px] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest animate-pulse">A.I.</span>
              </button>
              <button 
                id="nav_nav_pqrs"
                onClick={() => setActiveTab('pqrs')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border-2 transition-all duration-150 ${activeTab === 'pqrs' ? 'bg-[#39A900] text-white border-zinc-900 shadow-sm' : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'}`}
              >
                Trámites PQRS
              </button>
              <button 
                id="nav_nav_admissions"
                onClick={() => setActiveTab('admissions')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border-2 transition-all duration-150 ${activeTab === 'admissions' ? 'bg-[#39A900] text-white border-zinc-900 shadow-sm' : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'}`}
              >
                Admisiones
              </button>
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <div className="bg-white border-2 border-zinc-200 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-[#39A900] rounded-full animate-pulse"></span> Convocatoria Abierta
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* MOBILE BAR NAVIGATION (STICKY AT BOTTOM VISIBILITY) */}
      <div className="md:hidden bg-white border-t-2 border-zinc-900 grid grid-cols-5 fixed bottom-0 left-0 right-0 z-30 shadow-lg py-2 text-zinc-800">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 text-[10px] uppercase font-bold tracking-tight ${activeTab === 'home' ? 'text-[#39A900]' : 'text-zinc-500'}`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span>Inicio</span>
        </button>
        <button 
          onClick={() => setActiveTab('programs')}
          className={`flex flex-col items-center justify-center py-1 text-[10px] uppercase font-bold tracking-tight ${activeTab === 'programs' ? 'text-[#39A900]' : 'text-zinc-500'}`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Programas</span>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center py-1 text-[10px] uppercase font-bold tracking-tight ${activeTab === 'chat' ? 'text-[#39A900]' : 'text-zinc-500'}`}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span>IA Asesor</span>
        </button>
        <button 
          onClick={() => setActiveTab('pqrs')}
          className={`flex flex-col items-center justify-center py-1 text-[10px] uppercase font-bold tracking-tight ${activeTab === 'pqrs' ? 'text-[#39A900]' : 'text-zinc-500'}`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>PQRS</span>
        </button>
        <button 
          onClick={() => setActiveTab('admissions')}
          className={`flex flex-col items-center justify-center py-1 text-[10px] uppercase font-bold tracking-tight ${activeTab === 'admissions' ? 'text-[#39A900]' : 'text-zinc-500'}`}
        >
          <Award className="w-4 h-4 mb-0.5" />
          <span>Admisión</span>
        </button>
      </div>

      {/* MAIN CONTAINER FRAMEWORK */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-20 md:mb-10">
        
        {/* TAB CONTROLLERS PANEL FOR ACTIVE TAB */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME PANEL */}
          {activeTab === 'home' && (
            <motion.div 
              key="panel-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              
              {/* BRANDED MODERN BANNER / HERO GRID */}
              <div id="home_hero_block" className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-850 to-zinc-950 text-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] border-2 border-zinc-900">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#39A900]/10 rounded-full blur-3xl rounded-tl-none -z-0 pointer-events-none" />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-800 text-[#39A900] text-xs font-bold tracking-wider uppercase">
                      <span className="w-2.5 h-2.5 bg-[#39A900] rounded-full animate-pulse" />
                      <span>Convocatoria Presencial y Virtual • 100% Gratuito</span>
                    </div>
                    
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none uppercase">
                      Diseñá tu Futuro en el Epicentro de la <span className="text-[#39A900]">Moda Colombiana</span>
                    </h2>
                    
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl font-medium">
                      El **Centro de Formación en Diseño, Confección y Moda del SENA** en Itagüí (Calatrava) te capacita con tecnología de punta y talleres mecánicos industriales para incorporarte de inmediato a las empresas líderes del sector textil o emprender tu propia marca.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 pt-2">
                      <button 
                        onClick={() => setActiveTab('programs')}
                        className="px-6 py-3 bg-[#39A900] hover:bg-[#329200] text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all duration-150 flex items-center border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] cursor-pointer"
                      >
                        Ver Programas
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                      <button 
                        onClick={() => handleQuickQuestion('Que programas hay en el Sena de Calatrava Itagui')}
                        className="px-6 py-3 bg-white hover:bg-zinc-150 text-zinc-900 font-bold uppercase text-xs tracking-widest rounded-xl border-2 border-zinc-900 transition-all duration-150 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] cursor-pointer"
                      >
                        Preguntar a la IA
                      </button>
                    </div>
                  </div>
                  
                  {/* HERO STATS SIDEBAR */}
                  <div className="lg:col-span-4 bg-zinc-950/60 p-6 rounded-3xl border-2 border-zinc-800 space-y-4">
                    <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest font-mono">
                      ¿Por qué elegir nuestro centro?
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2.5">
                        <div className="mt-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-805 text-[#39A900] flex items-center justify-center text-xs font-bold">✓</div>
                        <div>
                          <h4 className="text-xs font-bold uppercase text-white tracking-tight">Talleres Industriales Completos</h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Máquinas planas, fileteadoras, collarines, mesas de corte vertical y plotters CAD.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2.5">
                        <div className="mt-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-805 text-[#39A900] flex items-center justify-center text-xs font-bold">✓</div>
                        <div>
                          <h4 className="text-xs font-bold uppercase text-white tracking-tight">Bienestar Completo</h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Apoyo de alimentación gratuito en el casino del centro y subsidios de transporte.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2.5">
                        <div className="mt-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-805 text-[#39A900] flex items-center justify-center text-xs font-bold">✓</div>
                        <div>
                          <h4 className="text-xs font-bold uppercase text-white tracking-tight">Práctica en Empresa Real</h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5">Vinculación rápida con marcas como Leonisa, GEF, C.I. Jeans bajo contrato de aprendizaje.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* THREE CORE SECTIONS BENTO SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* ADVOCATE AGENT CARDS */}
                <div className="bg-white p-6 rounded-3xl border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] space-y-4 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-[#39A900] border-2 border-zinc-900 flex items-center justify-center shadow-xs">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Chatbot de Orientación</span>
                    <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 leading-none">Charla con el Asesor Paisa</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                      ¿Tenés dudas sobre requisitos, fechas o el examen? Preguntale a nuestra IA entrenada con tono antioqueño y calidez para que te resuelva todo al instante, pues.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className="w-full mt-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase text-xs tracking-widest rounded-xl border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(57,169,0,0.4)] transition-all flex items-center justify-center cursor-pointer"
                  >
                    Iniciar Chat IA
                    <ChevronRight className="w-4 h-4 ml-1 text-[#39A900]" />
                  </button>
                </div>

                {/* PQRS LETTER GENERATOR CARDS */}
                <div className="bg-white p-6 rounded-3xl border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] space-y-4 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-[#39A900] border-2 border-zinc-900 flex items-center justify-center shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Redactor Inteligente</span>
                    <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 leading-none">Genera Cartas PQRS</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                      ¿Necesitás radicar una solicitud formal, novedad o pedir apoyo socioeconómico? Escribe tus datos y nuestra IA te redactará un oficio formal impecable para presentar.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('pqrs')}
                    className="w-full mt-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase text-xs tracking-widest rounded-xl border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(57,169,0,0.4)] transition-all flex items-center justify-center cursor-pointer"
                  >
                    Crear Solicitud
                    <ChevronRight className="w-4 h-4 ml-1 text-[#39A900]" />
                  </button>
                </div>

                {/* ADMISSIONS TRACKER CARDS */}
                <div className="bg-white p-6 rounded-3xl border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] space-y-4 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-[#39A900] border-2 border-zinc-900 flex items-center justify-center shadow-xs">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Paso a Paso Oficial</span>
                    <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 leading-none">Guía de Admisión</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                      Guarda un registro de cada paso de tu matrícula en SofiaPlus hasta tu primer día en Calatrava. Usa el semáforo inteligente para calcular tus requisitos completados.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('admissions')}
                    className="w-full mt-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase text-xs tracking-widest rounded-xl border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(57,169,0,0.4)] transition-all flex items-center justify-center cursor-pointer"
                  >
                    Ver Mi Progreso
                    <ChevronRight className="w-4 h-4 ml-1 text-[#39A900]" />
                  </button>
                </div>

              </div>

              {/* TALLERES INDUSTRIALES EN EL FOCO DE CONFECCIÓN DE MODA */}
              <div className="bg-white rounded-3xl border-2 border-zinc-900 p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Equipamiento Técnico Real</span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 leading-none">Nuestros Talleres Especializados Físicos</h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Sede Calatrava (Itagüí) cuenta con maquinaria real idéntica al clúster productivo. Aquí es donde harás tu práctica lectiva.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2">
                  <div className="bg-zinc-50 p-5 rounded-2xl border-2 border-zinc-200 hover:border-zinc-900 transition-colors space-y-3">
                    <div className="bg-[#39A900] border-2 border-zinc-900 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black">1</div>
                    <h4 className="text-xs font-bold uppercase text-zinc-900 tracking-tight">Taller de Ensamble y Costura</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Equipado con máquinas planas electrónicas automáticas, perfectas para optimizar tiempos de confección en camisas, blusas o vestidos casuales.</p>
                  </div>

                  <div className="bg-zinc-50 p-5 rounded-2xl border-2 border-zinc-200 hover:border-zinc-900 transition-colors space-y-3">
                    <div className="bg-[#39A900] border-2 border-zinc-900 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black">2</div>
                    <h4 className="text-xs font-bold uppercase text-zinc-900 tracking-tight">Taller de Telas Elásticas</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Máquinas collarín con alimentador elástico y fileteadoras especiales para armar ropa deportiva de alta resistencia y encajes delicados de ropa interior.</p>
                  </div>

                  <div className="bg-zinc-50 p-5 rounded-2xl border-2 border-zinc-200 hover:border-zinc-900 transition-colors space-y-3">
                    <div className="bg-[#39A900] border-2 border-zinc-900 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black">3</div>
                    <h4 className="text-xs font-bold uppercase text-zinc-900 tracking-tight">Taller de Denim y Mezclilla</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Máquinas pesadas, ojaladoras de ojo y cerradoras de codo para armar jeans y chaquetas robustas, capaces de perforar lona rígida pesada.</p>
                  </div>

                  <div className="bg-zinc-50 p-5 rounded-2xl border-2 border-zinc-200 hover:border-zinc-900 transition-colors space-y-3">
                    <div className="bg-[#39A900] border-2 border-zinc-900 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black">4</div>
                    <h4 className="text-xs font-bold uppercase text-zinc-900 tracking-tight">Sistemas CAD de Patronaje</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Laboratorios equipados con computadores con software CAD (Gerber/Optitex), mesas digitalizadoras y trazadores industriales plóter.</p>
                  </div>
                </div>
              </div>

              {/* FAQ PREGUNTAS MÁS FRECUENTES LOCAL ACCESSIBILITY */}
              <div id="home_faq_section" className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Orientación y Soporte Rápido</span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 leading-none">Preguntas Frecuentes de Aprendices en Itagüí</h3>
                  <p className="text-xs text-zinc-500 font-medium">Respuestas rápidas para resolver tus dudas antes de matricularte en SofiaPlus.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FAQ_DATA.map((faq, index) => (
                    <div key={`faq-${index}`} className="bg-white p-6 rounded-3xl border-2 border-zinc-200 hover:border-zinc-900 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.03)] shadow-xs space-y-2.5 transition-all duration-150">
                      <div className="flex items-start space-x-2">
                        <span className="text-[#39A900] font-black text-base leading-none">¿</span>
                        <h4 className="text-xs font-black uppercase tracking-tight text-zinc-900 leading-snug">{faq.q}</h4>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed pl-4 whitespace-pre-line font-medium font-sans">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FONDO EMPRENDER & VALOR AGREGADO PANEL */}
              <div className="bg-[#39A900] border-2 border-zinc-900 rounded-3xl p-6 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                <div className="space-y-3 max-w-xl text-white">
                  <div className="inline-block px-3 py-1 rounded-full bg-zinc-900 text-[#39A900] text-[9px] font-mono font-black tracking-widest uppercase">FONDO EMPRENDER</div>
                  <h3 className="text-2xl font-black uppercase tracking-tight leading-none">¿Tienes una idea berraca para montar tu propia marca de ropa?</h3>
                  <p className="text-xs font-medium leading-relaxed opacity-95">
                    El SENA cuenta con un fondo de capital semilla para financiar ideas de negocio de aprendices y egresados. Te acompañan gratis a decolar tu plan de negocio y te otorgan hasta **$80,000,000 COP** no reembolsables para impulsar tu taller o boutique.
                  </p>
                </div>
                <button 
                  onClick={() => handleQuickQuestion('Cuéntame sobre el Fondo Emprender para confecciones, por favor')}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase text-xs tracking-wider px-6 py-3.5 rounded-xl border-2 border-zinc-905 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] transition-all cursor-pointer whitespace-nowrap"
                >
                  Saber más con IA
                </button>
              </div>

            </motion.div>
          )}

          {/* TAB 2: PORTFOLIO / LIST DE PROGRAMAS */}
          {activeTab === 'programs' && (
            <motion.div 
              key="panel-programs"
                       transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              
              {/* PAGE CAPTION HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Oferta y Registro SENA</span>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 leading-none">Catálogo de Programas de Formación</h2>
                  <p className="text-xs text-zinc-500 font-medium">
                    Encuentra el programa ideal en Costura, Diseño, Mantenimiento o Tecnología. Todos acreditados y listos para el trabajo.
                  </p>
                </div>

                {/* SEARCH INPUT FIELD WITH DESKTOP VISIBILITY */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                  <input 
                    type="text"
                    value={programSearch}
                    onChange={(e) => setProgramSearch(e.target.value)}
                    placeholder="Buscar máquina, programa, perfil..."
                    className="w-full bg-white border-2 border-zinc-900 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#39A900] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
                  />
                </div>
              </div>

              {/* LEVEL SEGMENTED BAR BUTTONS */}
              <div className="flex flex-wrap items-center gap-2 border-b-2 border-zinc-900 pb-4">
                <button 
                  onClick={() => setSelectedLevel('All')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${selectedLevel === 'All' ? 'bg-[#39A900] text-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-700 border-2 border-zinc-200 hover:border-zinc-900'}`}
                >
                  Todos ({TRAINING_PROGRAMS.length})
                </button>
                <button 
                  onClick={() => setSelectedLevel('Operario')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${selectedLevel === 'Operario' ? 'bg-[#39A900] text-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-700 border-2 border-zinc-200 hover:border-zinc-900'}`}
                >
                  Nivel Operario (6 meses)
                </button>
                <button 
                  onClick={() => setSelectedLevel('Técnico')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${selectedLevel === 'Técnico' ? 'bg-[#39A900] text-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-700 border-2 border-zinc-200 hover:border-zinc-900'}`}
                >
                  Nivel Técnico (1 año)
                </button>
                <button 
                  onClick={() => setSelectedLevel('Tecnólogo')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${selectedLevel === 'Tecnólogo' ? 'bg-[#39A900] text-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-700 border-2 border-zinc-200 hover:border-zinc-900'}`}
                >
                  Nivel Tecnólogo (2 años)
                </button>
              </div>

              {/* CORE PROGRAMS CARD LIST GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredPrograms.map((prog) => (
                    <motion.div 
                      key={prog.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-3xl border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(57,169,0,0.1)] transition-all duration-200 flex flex-col justify-between overflow-hidden"
                    >
                      {/* CARD BANNER HEADER INDICATING LEVEL */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border-2 ${
                            prog.level === 'Operario' ? 'bg-emerald-50 text-[#39A900] border-[#39A900]/30' :
                            prog.level === 'Técnico' ? 'bg-sky-50 text-sky-700 border-sky-350' :
                            'bg-violet-50 text-violet-700 border-violet-350'
                          }`}>
                            {prog.level}
                          </span>
                          
                          <span className="text-[10px] text-zinc-400 font-mono font-bold flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1 text-[#39A900]" />
                            {prog.duration.split(' ')[0]} {prog.duration.split(' ')[1]}
                          </span>
                        </div>
 
                        <h3 className="text-sm font-black uppercase tracking-tight text-zinc-900 min-h-12 line-clamp-2 leading-snug">
                          {prog.name}
                        </h3>
 
                        <p className="text-xs text-zinc-500 font-medium line-clamp-3 leading-relaxed">
                          {prog.description}
                        </p>
 
                        {/* HIGHLIGHTED TARGET MACHINES OR COGNITIVE PILL */}
                        {prog.machinesUsed.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-[#39A900] font-mono">Maquinaria / Herramientas:</h4>
                            <div className="flex flex-wrap gap-1">
                              {prog.machinesUsed.slice(0, 2).map((mach, i) => (
                                <span key={i} className="bg-zinc-50 text-zinc-700 text-[10px] px-2.5 py-0.5 rounded-lg border-2 border-zinc-200 font-bold block truncate max-w-full">
                                  {mach.split(' (')[0]}
                                </span>
                              ))}
                              {prog.machinesUsed.length > 2 && (
                                <span className="bg-zinc-50 text-zinc-500 text-[9px] px-1.5 py-0.5 rounded-lg border-2 border-zinc-200 font-bold">+{prog.machinesUsed.length - 2}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
 
                      {/* CARD ACTION BUTTONS */}
                      <div className="p-4 bg-zinc-50 border-t-2 border-zinc-900 flex items-center space-x-2">
                        <button 
                          onClick={() => setSelectedProgram(prog)}
                          className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Ver Detalles
                        </button>
                        <button 
                          onClick={() => handleQuickQuestion(`Contame mijo, ¿de qué trata el programa de ${prog.name}? ¿Qué requisitos pide y cómo salgo al campo laboral?`)}
                          title="Hacer consulta interactiva a la IA"
                          className="p-2.5 bg-white hover:bg-zinc-100 text-[#39A900] rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredPrograms.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] space-y-3">
                      <p className="text-sm font-black uppercase tracking-tight text-zinc-900">No encontramos ningún programa que coincida hombre.</p>
                      <p className="text-xs text-zinc-500 font-medium pb-2">Prueba con palabras sencillas como "ropa", "software", "patronaje" o "máquina".</p>
                      <button 
                        onClick={() => { setProgramSearch(''); setSelectedLevel('All'); }}
                        className="px-5 py-2.5 bg-[#39A900] text-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Restablecer filtros
                      </button>
                    </div>
                  )}

                </AnimatePresence>
              </div>

            </motion.div>
          )}

          {/* TAB 3: CHAT DE ASESORÍA IA VIRTUAL */}
          {activeTab === 'chat' && (
            <motion.div 
              key="panel-chat"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* CHAT AREA COMPONENT */}
              <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] flex flex-col h-[525px] overflow-hidden">
                
                {/* CHAT BAR SYSTEM CONTROLS STATUS */}
                <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#39A900] text-zinc-900 flex items-center justify-center font-black text-xs ring-4 ring-[#39A900]/20">
                      <span>AP</span>
                    </div>
                    <div>
                      <h3 className="text-xs font-black tracking-wider uppercase text-[#39A900] leading-tight">Asesor Paisa Virtual</h3>
                      <p className="text-[10px] text-zinc-400 font-medium">SENA Calatrava • En Línea hoy</p>
                    </div>
                  </div>
                  
                  {/* CLEAN SCREEN ACCENTS */}
                  <button 
                    onClick={clearChatHistory}
                    className="p-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300 font-extrabold font-mono border border-zinc-700 rounded-xl hover:text-white transition-colors flex items-center cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Limpiar chat
                  </button>
                </div>

                {/* MESSAGES FLOW SCREEN */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/50">
                  {messages.map((msg) => (
                    <div 
                       key={msg.id}
                       className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 leading-relaxed text-xs relative ${
                        msg.sender === 'user' 
                          ? 'bg-zinc-950 text-slate-100 rounded-tr-none border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' 
                          : 'bg-white text-zinc-850 rounded-tl-none border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.04)] font-medium'
                      }`}>
                        
                        {/* CHAT BODY CONTENT (SUPPORTING RICH MULTILINE AND CORE BOLD) */}
                        <div className="whitespace-pre-line prose max-w-none text-xs">
                          {msg.text}
                        </div>

                        {/* CHAT TIMESTAMP */}
                        <span className="block text-[9px] text-zinc-400 font-mono font-bold text-right mt-2 uppercase">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* TYPING STATUS Bouncing Pills */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-tl-none p-3.5 border-2 border-zinc-900 flex items-center space-x-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)]">
                        <span className="text-[10px] text-zinc-500 mr-1 font-mono font-black italic">El Asesor está costurando tu respuesta, espérate pues</span>
                        <div className="w-1.5 h-1.5 bg-[#39A900] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-1.5 h-1.5 bg-[#39A900] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                        <div className="w-1.5 h-1.5 bg-[#39A900] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* FORM INPUT COMPONENT */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="p-3 bg-white border-t-2 border-zinc-900 flex items-center space-x-2"
                >
                  <input 
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Escribe tu mensaje o pregunta aquí mijo..."
                    className="flex-1 bg-zinc-50 border-2 border-zinc-900 rounded-xl px-4 py-3 text-xs text-zinc-850 focus:outline-none focus:ring-2 focus:ring-[#39A900] font-sans font-medium"
                  />
                  <button 
                    type="submit"
                    disabled={!inputVal.trim() || isTyping}
                    className="p-3 bg-[#39A900] hover:bg-[#329200] disabled:bg-zinc-200 disabled:text-zinc-400 text-white rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-zinc-950" />
                  </button>
                </form>

              </div>

              {/* CHAT HELPER / SUGGESTIONS SIDEBAR (COGNITIVE OVERHEAD LOWERING) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* SUGGESTION QUESTIONS BENTO BOX */}
                <div className="bg-white rounded-3xl border-2 border-zinc-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] space-y-4">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-[#39A900]" />
                    <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest font-mono">Preguntas Recomendadas</h3>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium">Toca cualquiera de estos botones para preguntarle al asesor de forma automatizada:</p>
                  
                  <div className="flex flex-col space-y-2.5">
                    <button 
                      onClick={() => handleSendMessage('¿Cuáles son las fechas de inscripción para el Sena de Calatrava, Itagüí?')}
                      className="text-left p-3 text-zinc-800 bg-zinc-50 hover:bg-[#39A900]/10 hover:border-zinc-900 rounded-xl border-2 border-zinc-200 text-xs transition-all font-bold cursor-pointer hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
                    >
                      📅 ¿Cuándo son las inscripciones, pues?
                    </button>
                    <button 
                      onClick={() => handleSendMessage('¿Qué documentos y requisitos necesito para estudiar Corte u Operario de confección?')}
                      className="text-left p-3 text-zinc-800 bg-zinc-50 hover:bg-[#39A900]/10 hover:border-zinc-900 rounded-xl border-2 border-zinc-200 text-xs transition-all font-bold cursor-pointer hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
                    >
                      📋 ¿Cuáles son los requisitos de Operario?
                    </button>
                    <button 
                      onClick={() => handleSendMessage('¿Cómo pido los apoyos de Bienestar como alimentación o subsidio de transporte?')}
                      className="text-left p-3 text-zinc-800 bg-zinc-50 hover:bg-[#39A900]/10 hover:border-zinc-900 rounded-xl border-2 border-zinc-200 text-xs transition-all font-bold cursor-pointer hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
                    >
                      🍜 ¿Qué hay que hacer para el casino gratuito?
                    </button>
                    <button 
                      onClick={() => handleSendMessage('¿En qué marcas de confección importantes puedo hacer la práctica lectiva o etapa productiva?')}
                      className="text-left p-3 text-zinc-800 bg-zinc-50 hover:bg-[#39A900]/10 hover:border-zinc-900 rounded-xl border-2 border-zinc-200 text-xs transition-all font-bold cursor-pointer hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
                    >
                      🏢 ¿Cómo funciona la práctica en empresa?
                    </button>
                  </div>
                </div>

                {/* SAFETY NOTES FOR TRAINING */}
                <div className="bg-white rounded-3xl border-2 border-zinc-200 p-6 space-y-2.5 text-zinc-650 hover:border-zinc-900 transition-colors shadow-xs">
                  <div className="flex items-center space-x-1.5">
                    <Shield className="w-4 h-4 text-[#39A900]" />
                    <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest font-mono">Consejo de Oro</h3>
                  </div>
                  <p className="text-[11px] leading-relaxed font-sans font-medium">
                    Nuestra Inteligencia Artificial está conectada en tiempo real. Siempre que decolores una consulta, ella buscará darte la mejor respuesta sobre Calatrava. **¿Sabías que el SENA tiene egresados trabajando en marcas gigantes como Leonisa, GEF, C.I. Jeans?** ¡Tú puedes ser el próximo en brillar en esta gran industria!
                  </p>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 4: ASISTENTE DE REDACCIÓN PQRS */}
          {activeTab === 'pqrs' && (
            <motion.div 
              key="panel-pqrs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              
              <div className="space-y-1">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Trámites y Consultas Jurídicas</span>
                <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 leading-none">Asistente de Redacción PQRS</h2>
                <p className="text-xs text-zinc-500 font-medium">
                  Rellena tus datos y explícanos tu necesidad en tus propias palabras. La IA redactará un Oficio Formal y Derecho de Petición listo para radicar en el SENA.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* SOLICITUD INPUT FORM COLUMN */}
                <form 
                  onSubmit={handlePqrsSubmit}
                  className="lg:col-span-5 bg-white p-6 rounded-3xl border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] space-y-4"
                >
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#39A900] font-mono">1. Diligencia los Soportes Básicos</h3>
                  
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-zinc-800 uppercase tracking-wider">Nombre Completo *</label>
                    <input 
                      type="text"
                      required
                      value={pqrsForm.fullName}
                      onChange={(e) => setPqrsForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Ej. Juan Carlos Restrepo"
                      className="w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-3 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#39A900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black text-zinc-800 uppercase tracking-wider">Documento de Identidad *</label>
                      <input 
                        type="text"
                        required
                        value={pqrsForm.documentId}
                        onChange={(e) => setPqrsForm(prev => ({ ...prev, documentId: e.target.value }))}
                        placeholder="C.C o T.I número..."
                        className="w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-3 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#39A900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black text-zinc-800 uppercase tracking-wider">Correo Electrónico *</label>
                      <input 
                        type="email"
                        required
                        value={pqrsForm.email}
                        onChange={(e) => setPqrsForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="juan@correo.com"
                        className="w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-3 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#39A900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black text-zinc-800 uppercase tracking-wider">Rol que desempeñas *</label>
                      <select 
                        value={pqrsForm.role}
                        onChange={(e: any) => setPqrsForm(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-3 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#39A900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold cursor-pointer"
                      >
                        <option value="aspirante">Aspirante / Interesado</option>
                        <option value="aprendiz">Aprendiz con Matrícula Activa</option>
                        <option value="egresado">Egresado del Centro</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black text-zinc-800 uppercase tracking-wider">Tipo de Trámite / PQRS *</label>
                      <select 
                        value={pqrsForm.requestType}
                        onChange={(e: any) => setPqrsForm(prev => ({ ...prev, requestType: e.target.value }))}
                        className="w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-3 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#39A900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-bold cursor-pointer"
                      >
                        <option value="peticion">Petición Formal General</option>
                        <option value="apoyo_socioeconomico">Solicitud de Apoyo (Casino / Transporte)</option>
                        <option value="novedad_tramite">Novedad de Matrícula (Retiro / Aplazamiento)</option>
                        <option value="queja">Queja por Servicio</option>
                        <option value="reclamo">Reclamo sobre Notas o Exámenes</option>
                        <option value="sugerencia">Sugerencia de Mejora para Talleres</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-zinc-800 uppercase tracking-wider">Programa Asociado (Opcional)</label>
                    <input 
                      type="text"
                      value={pqrsForm.programName}
                      onChange={(e) => setPqrsForm(prev => ({ ...prev, programName: e.target.value }))}
                      placeholder="Ej. Tecnólogo en Software o Técnico en Patronaje"
                      className="w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-3 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#39A900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-zinc-800 uppercase tracking-wider">Explica tu situación / Detalle de solicitud *</label>
                    <textarea 
                      required
                      rows={5}
                      value={pqrsForm.details}
                      onChange={(e) => setPqrsForm(prev => ({ ...prev, details: e.target.value }))}
                      placeholder="Por favor cuenta por qué necesitas esta solicitud, qué hechos pasaron y qué le pides al subdirector con exactitud. Redáctalo sencillo, la IA lo convertirá en lenguaje jurídico elegante."
                      className="w-full bg-zinc-50 border-2 border-zinc-900 rounded-xl px-3 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#39A900] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-medium leading-relaxed font-sans"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isGeneratingPqrs}
                    className="w-full py-3.5 bg-[#39A900] hover:bg-[#329200] disabled:bg-[#39A900]/30 disabled:text-white/60 text-white font-black uppercase text-xs tracking-wider rounded-xl border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center cursor-pointer"
                  >
                    {isGeneratingPqrs ? (
                      <>
                        <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-2" />
                        Redactando Carta Oficial con IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 text-zinc-950" />
                        Generar Oficio Oficial de Petición
                      </>
                    )}
                  </button>
                </form>

                {/* THE RESULT DRAFT LETTER PREVIEW AREA */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* LIVE PREVIEW OF THE PRINTABLE NOTIFICATION */}
                  <div className="bg-white rounded-3xl border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full min-h-[450px]">
                    
                    <div className="bg-zinc-900 px-5 py-3.5 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-[#39A900]" />
                        <h4 className="text-xs font-black uppercase tracking-widest font-mono text-white">Documento Oficial Generado</h4>
                      </div>
                      
                      {generatedLetter && (
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleCopyLetter(generatedLetter)}
                            className="bg-white hover:bg-zinc-100 text-[#39A900] p-1.5 px-3 rounded-xl border-2 border-zinc-900 text-[10px] font-black uppercase tracking-wider flex items-center transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none cursor-pointer"
                          >
                            {copiedSuccess ? (
                              <span className="text-[#39A900] flex items-center">✓ ¡Copiado!</span>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 mr-1 text-[#39A900]" />
                                Copiar Texto
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-zinc-50/50 leading-relaxed text-xs text-zinc-800 font-mono whitespace-pre-wrap select-text">
                      {generatedLetter ? (
                        generatedLetter
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16 px-4">
                          <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 border-2 border-zinc-300">
                            <Info className="w-6 h-6 text-[#39A900]" />
                          </div>
                          <h4 className="text-xs font-black uppercase tracking-tight text-zinc-800">Aún no hay ningún oficio redactado.</h4>
                          <p className="text-[11px] text-zinc-500 font-medium max-w-sm">Rellena el formulario de la izquierda con tus propios términos, mijo, y hágale clic al botón Generar. Te enviaremos un modelo perfecto de inmediato.</p>
                        </div>
                      )}
                    </div>

                    {generatedLetter && (
                      <div className="bg-[#39A900]/10 px-5 py-3 border-t-2 border-zinc-900 flex items-center space-x-2 text-xs font-bold text-[#39A900]">
                        <CheckCircle className="w-4 h-4 text-[#39A900] flex-shrink-0" />
                        <p>¡Listo mijo! Copia la carta con el botón superior y radícala en las ventanillas administrativas o en el correo oficial de Calatrava.</p>
                      </div>
                    )}
                  </div>

                  {/* SAVED LOCAL DRAWS PORTAL */}
                  {myPqrsDrafts.length > 0 && (
                    <div className="bg-white rounded-3xl border-2 border-zinc-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#39A900] font-mono">Mis Solicitudes Generadas en esta Navegación ({myPqrsDrafts.length})</h3>
                      
                      <div className="max-h-56 overflow-y-auto space-y-3 pr-2">
                        {myPqrsDrafts.map((draft) => (
                          <div 
                            key={draft.id}
                            className="bg-zinc-50 p-4 rounded-2xl border-2 border-zinc-200 hover:border-zinc-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)] transition-all flex items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="bg-zinc-900 text-white px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border border-zinc-950">
                                  {draft.requestType.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-mono font-bold">{draft.createdAt}</span>
                              </div>
                              <p className="text-xs font-black uppercase tracking-tight text-zinc-900">{draft.fullName} • C.C {draft.documentId}</p>
                              <p className="text-[11px] text-zinc-500 font-medium line-clamp-1 italic">"{draft.details}"</p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => setGeneratedLetter(draft.formattedText || '')}
                                className="bg-[#39A900] hover:bg-[#329200] text-white text-[10px] uppercase font-black tracking-wider px-3 py-1.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none cursor-pointer"
                              >
                                Recuperar
                              </button>
                              <button 
                                onClick={() => handleDeleteDraft(draft.id)}
                                className="bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-[10px] font-bold px-2.5 py-1.5 rounded-xl border-2 border-zinc-200 hover:border-[#39A900] transition-colors cursor-pointer"
                                title="Borrar"
                              >
                                Borrar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 5: GUÍA DE ADMISIONES CON SEMÁFORO DE REQUISITOS */}
          {activeTab === 'admissions' && (
            <motion.div 
              key="panel-admissions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl mx-auto space-y-8"
            >
              
              {/* COMPREHENSIVE ROADMAP HEADER SUMMARY */}
              <div className="bg-white rounded-3xl border-2 border-zinc-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                <div className="md:col-span-8 space-y-2">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Convocatorias Abiertas 2026</span>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 leading-none">Ruta de Ingreso e Inscripción Oficial</h2>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                    Sigue cada paso con cuidado, mijo, para asegurar tu cupo en SofiaPlus. A medida que completes cada tarea, márcala en el checklist del semáforo para medir tu nivel de preparación actual para ingresar al SENA Calatrava.
                  </p>
                </div>

                {/* VISUAL STATS PROGRESS BAR WITH CIRCULAR RADIAL APPROXIMATION */}
                <div className="md:col-span-4 bg-zinc-50 p-4 rounded-2xl border-2 border-zinc-900 flex flex-col items-center justify-center space-y-2.5 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[10px] text-zinc-400 font-mono font-black tracking-widest uppercase">Progreso de Matrícula</span>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl font-black text-[#39A900] font-mono">{getAdmissionsProgressPercent()}%</span>
                    <span className="text-xs text-zinc-550 font-bold text-left font-sans block max-w-28 leading-tight">({checkedSteps.length} de {ENROLLMENT_STEPS.length} completados)</span>
                  </div>

                  <div className="w-full bg-zinc-200 border-2 border-zinc-900 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="bg-[#39A900] h-full rounded-full transition-all duration-300"
                      style={{ width: `${getAdmissionsProgressPercent()}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* VERTICAL STEP FLOW COMPONENT GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* TIMELINE FLUID CONDUIT */}
                <div className="lg:col-span-8 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 font-mono mb-4">Pipeline Paso a Paso para SofiaPlus</h3>

                  <div className="relative border-l-2 border-zinc-900 pl-6 ml-4 space-y-8">
                    
                    {ENROLLMENT_STEPS.map((step, index) => {
                      const isCompleted = checkedSteps.includes(step.id);
                      return (
                        <div key={step.id} className="relative group">
                          
                          {/* TIMELINE DOT BULB COLLAR */}
                          <div className={`absolute -left-10 top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors z-10 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                            isCompleted 
                              ? 'bg-[#39A900] border-zinc-900 text-white' 
                              : 'bg-white border-zinc-900 text-zinc-400'
                          }`}>
                            {isCompleted ? <Check className="w-4.5 h-4.5 text-zinc-955" /> : <span className="text-[11px] font-mono font-bold text-zinc-900">{step.id}</span>}
                          </div>

                          {/* CORE STEP CARD CONTENT PANEL */}
                          <div className={`bg-white p-5 rounded-3xl border-2 transition-all transition-shadow ${
                            isCompleted ? 'border-[#39A900] shadow-[6px_6px_0px_0px_rgba(57,169,0,0.04)] bg-[#39A900]/2' : 'border-zinc-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]'
                          }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                              <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center">
                                  {step.title}
                                  {isCompleted && (
                                    <span className="ml-2 bg-emerald-100 text-emerald-800 text-[8px] uppercase tracking-wide font-black px-1.5 py-0.5 rounded border border-emerald-250">
                                      Completado
                                    </span>
                                  )}
                                </h4>
                                <p className="text-[11px] text-zinc-400 italic font-bold">{step.subtitle}</p>
                              </div>

                              <span className="text-[10px] text-zinc-900 font-mono font-black bg-zinc-50 px-3 py-1 rounded-lg border-2 border-zinc-250 self-start sm:self-center">
                                {step.dateEst}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-550 leading-relaxed font-sans font-medium whitespace-pre-line">
                              {step.description}
                            </p>

                            <div className="mt-3.5 pt-3.5 border-t-2 border-zinc-100 flex items-center justify-between">
                              <button 
                                onClick={() => toggleStep(step.id)}
                                className={`text-[10.5px] font-black uppercase tracking-wider px-4 py-2 rounded-xl flex items-center transition-all cursor-pointer ${
                                  isCompleted 
                                    ? 'bg-zinc-150 text-zinc-700 hover:bg-zinc-200 border-2 border-zinc-200' 
                                    : 'bg-[#39A900] text-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none'
                                }`}
                              >
                                {isCompleted ? 'Marcar como Pendiente' : '✓ Marcar como Completado'}
                              </button>
                              
                              <button 
                                onClick={() => handleSendMessage(`¿Cómo hago exactamente el paso "${step.title}" de la matrícula y qué consejos me das para pasarlo rápido, por favor?`)}
                                className="text-[10px] font-bold text-zinc-400 hover:text-[#39A900] hover:underline flex items-center transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5 mr-1 text-[#39A900]" />
                                Preguntar detalles
                              </button>
                            </div>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* SIDEBAR RULES AND LINKS */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* COMPREHENSIVE REQUIREMENTS ACCORDION CHECKLIST */}
                  <div className="bg-zinc-900 border-2 border-zinc-900 text-white rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] space-y-4">
                    <div className="flex items-center space-x-1.5">
                      <Languages className="w-4 h-4 text-[#39A900]" />
                      <h3 className="text-xs font-black uppercase tracking-widest font-mono text-[#39A900]">Requisitos de Admisión</h3>
                    </div>
                    
                    <div className="space-y-4">
                      
                      <div className="space-y-1 pb-3 border-b border-zinc-800">
                        <h4 className="text-xs font-black tracking-wider text-slate-100 uppercase">🎓 Tecnólogo (2 Años)</h4>
                        <ul className="text-[10.5px] text-zinc-400 list-disc list-inside space-y-1 font-medium font-sans">
                          <li>Diploma y Acta de Grado de 11º.</li>
                          <li>Prueba ICFES / Saber 11 original.</li>
                          <li>Doc. de identidad ampliado 150%.</li>
                          <li>Edad mínima: 16 años cumplidos.</li>
                        </ul>
                      </div>

                      <div className="space-y-1 pb-3 border-b border-zinc-800">
                        <h4 className="text-xs font-black tracking-wider text-slate-100 uppercase">🛠️ Técnico (1 Año)</h4>
                        <ul className="text-[10.5px] text-zinc-400 list-disc list-inside space-y-1 font-medium font-sans">
                          <li>Certificado escolar aprobado de 9º.</li>
                          <li>Doc. de identidad ampliado 150%.</li>
                          <li>Edad mínima: 16 años cumplidos.</li>
                          <li>Aprobar la Prueba Fase I con éxito.</li>
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-black tracking-wider text-slate-100 uppercase">🧵 Operario (6 Meses)</h4>
                        <ul className="text-[10.5px] text-zinc-400 list-disc list-inside space-y-1 font-medium font-sans">
                          <li>Certificado escolar aprobado de 5º.</li>
                          <li>Copia legible de doc. de identidad.</li>
                          <li>Edad mínima: 15 años cumplidos.</li>
                        </ul>
                      </div>

                    </div>
                  </div>

                  {/* BENEVOLENT SUPPORT ADRESSES PANEL */}
                  <div className="bg-white rounded-3xl border-2 border-zinc-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900">Agencias y Bienestar de Apoyo</h3>
                    
                    {GENERAL_INFO.mainAgencies.map((agency, i) => (
                      <div key={i} className="space-y-1 pb-3.5 border-b-2 border-zinc-100 last:border-0 last:pb-0">
                        <h4 className="text-xs font-black uppercase tracking-tight text-zinc-900 leading-snug">{agency.name}</h4>
                        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed font-sans">{agency.desc}</p>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* DETAILED MODAL POPUP FOR SINGLE SELECTED TRAINING PROGRAM */}
      <AnimatePresence>
        {selectedProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs select-text">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border-2 border-zinc-900 flex flex-col max-h-[90vh]"
            >
              
              {/* MODAL TITLE HEADER WITH LEVEL ACCENTS */}
              <div className="p-6 bg-zinc-900 border-b-2 border-zinc-900 text-white flex items-start justify-between gap-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border-2 ${
                      selectedProgram.level === 'Operario' ? 'bg-emerald-950 text-emerald-400 border-emerald-900' :
                      selectedProgram.level === 'Técnico' ? 'bg-sky-950 text-sky-400 border-sky-900' :
                      'bg-purple-955 text-purple-400 border-purple-900'
                    }`}>
                      Nivel {selectedProgram.level}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider">Carga lectiva presencial</span>
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight text-white leading-tight">{selectedProgram.name}</h3>
                </div>
                
                <button 
                  onClick={() => setSelectedProgram(null)}
                  className="px-3 py-1.5 rounded-xl border-2 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-[10px] font-bold font-mono tracking-widest cursor-pointer"
                >
                  Cerrar [X]
                </button>
              </div>

              {/* MODAL DETAILED BODY WITH INTERNAL INDEPENDENT SCROLL */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* PROGRAM DURATION BLOCKS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-50 p-4 rounded-2xl border-2 border-zinc-200">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <span className="text-[9px] font-mono tracking-wider text-zinc-400 uppercase font-black block">Duración Total</span>
                    <span className="text-xs font-black text-zinc-950 block">{selectedProgram.duration}</span>
                  </div>
                  <div className="space-y-0.5 text-center sm:text-left sm:border-l-2 sm:border-zinc-200 sm:pl-3">
                    <span className="text-[9px] font-mono tracking-wider text-zinc-400 uppercase font-black block">Etapa Lectiva</span>
                    <span className="text-xs font-black text-[#39A900] block">{selectedProgram.stageLectiva}</span>
                  </div>
                  <div className="space-y-0.5 text-center sm:text-left sm:border-l-2 sm:border-zinc-200 sm:pl-3">
                    <span className="text-[9px] font-mono tracking-wider text-zinc-400 uppercase font-black block">Etapa Productiva</span>
                    <span className="text-xs font-black text-[#39A900] block">{selectedProgram.stageProductiva}</span>
                  </div>
                </div>

                {/* DESCRIPTION & PROFILE */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#39A900] uppercase tracking-widest font-mono">Presentación del Programa</span>
                    <p className="text-xs text-zinc-600 leading-relaxed font-sans font-medium">{selectedProgram.description}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#39A900] uppercase tracking-widest font-mono">Perfil del Egresado (¿Qué aprenderá?)</span>
                    <p className="text-xs text-zinc-600 leading-relaxed font-sans font-medium">{selectedProgram.profile}</p>
                  </div>
                </div>

                {/* GRID FOR KEY REQUIREMENTS AND SALIDA LABORAL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t-2 border-zinc-100">
                  
                  {/* LEFT: REQUIREMENTS */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-black text-[#39A900] uppercase tracking-wider font-mono block">Requisitos Obligatorios:</span>
                    <ul className="space-y-1.5">
                      {selectedProgram.requirements.map((req, index) => (
                        <li key={index} className="flex items-start text-xs text-zinc-650 leading-relaxed font-medium">
                          <span className="mt-0.5 w-4 h-4 p-0.5 rounded bg-zinc-100 border-2 border-zinc-900 text-zinc-950 font-black flex items-center justify-center text-[10px] mr-2 flex-shrink-0">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* RIGHT: DEPARTAMENTOS DE CAMPO LABORAL */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-black text-[#39A900] uppercase tracking-wider font-mono block">Oportunidades de Empleo:</span>
                    <ul className="space-y-1.5">
                      {selectedProgram.fieldsOfAction.map((field, index) => (
                        <li key={index} className="flex items-start text-xs text-zinc-650 leading-relaxed font-medium">
                          <span className="mt-0.5 w-4 h-4 p-0.5 rounded bg-zinc-100 border-2 border-zinc-900 text-[#39A900] font-black flex items-center justify-center text-[10px] mr-2 flex-shrink-0">✓</span>
                          <span>{field}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* BOTTOM COMPACT BLOCK SPECIFYING HARDWARE/SOFTWARE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-zinc-100">
                  <div className="space-y-2 bg-zinc-50 p-4 rounded-2xl border-2 border-zinc-200">
                    <span className="text-[9px] font-black text-[#39A900] uppercase tracking-widest font-mono block">Talleres y Maquinaria en Sede</span>
                    <ul className="text-xs text-zinc-700 font-bold list-disc list-inside space-y-1">
                      {selectedProgram.machinesUsed.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>

                  <div className="space-y-2 bg-zinc-50 p-4 rounded-2xl border-2 border-zinc-200">
                    <span className="text-[9px] font-black text-[#39A900] uppercase tracking-widest font-mono block">Habilidades Clave</span>
                    <ul className="text-xs text-zinc-700 font-bold list-disc list-inside space-y-1">
                      {selectedProgram.competencies.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                </div>

              </div>

              {/* FOOTER ACTION CLOSER */}
              <div className="p-4 bg-zinc-50 border-t-2 border-zinc-900 flex items-center justify-end space-x-2">
                <button 
                  onClick={() => {
                    setSelectedProgram(null);
                    handleQuickQuestion(`Háblame de los detalles y la moldería en ${selectedProgram.name} en el SENA Calatrava, por favor.`);
                  }}
                  className="px-4 py-2.5 bg-[#39A900] hover:bg-[#329200] text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-zinc-950" />
                  Hacer consulta a la IA
                </button>
                <button 
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-800 border-2 border-zinc-300 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER INFORMACIONAL BRANDING */}
      <footer className="bg-zinc-900 text-zinc-400 py-8 border-t-2 border-zinc-950 mt-auto text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 bg-[#39A900] rounded-xl flex items-center justify-center font-black text-zinc-900 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">S</div>
              <div>
                <p className="text-zinc-100 font-extrabold tracking-tight">Centro de Formación en Diseño, Confección y Moda</p>
                <p className="text-[10px] text-zinc-500 font-semibold">SENA Regional Antioquia • Sede Calatrava Itagüí • 2026</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-[10px] bg-zinc-950 text-[#39A900] border-2 border-zinc-800 px-2.5 py-1 rounded-xl font-mono font-black uppercase tracking-wider">
                100% Educación Gratuita
              </span>
              <span className="text-[10px] bg-zinc-950 text-zinc-400 border-2 border-zinc-800 px-2.5 py-1 rounded-xl font-mono font-black uppercase tracking-wider">
                Poder Paisa
              </span>
            </div>

          </div>

          <p className="text-[10.5px] text-zinc-500 text-center leading-relaxed max-w-3xl mx-auto pt-4 border-t-2 border-zinc-950 font-medium">
            Esta es una plataforma interactiva de orientación académica impulsada por Inteligencia Artificial de Google Gemini real. Todos los nombres, duraciones, perfiles y requisitos están basados en la oferta real certificada por el Estado colombiano del SENA. Para registros oficiales dirígete a **www.senasofiaplus.edu.co**.
          </p>
        </div>
      </footer>

    </div>
  );
}
