
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppState, UserProfile, PracticeCycle, NotificationContent, EnglishLevel, Goal } from './types';
import Onboarding from './components/Onboarding';
import CreateCycleWizard from './components/CreateCycleWizard';
import { TESTIMONIALS, HUMAN_MESSAGES, TRIAL_DURATION_DAYS } from './constants';
import { 
  Bell, 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  PlusCircle, 
  History as HistoryIcon, 
  LogOut,
  ArrowRight,
  Zap,
  Star,
  Lock,
  CreditCard,
  User as UserIcon,
  CheckCircle2,
  Smartphone,
  Watch,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('welcome');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cycles, setCycles] = useState<PracticeCycle[]>([]);
  const [notifications, setNotifications] = useState<NotificationContent[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [isRequestingNotif, setIsRequestingNotif] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const notificationCenterRef = useRef<HTMLDivElement>(null);
  const LOGO_URL = "https://i.postimg.cc/KcJ8V44L/Posts-Sorte-Nordeste-(5).png";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationCenterRef.current && !notificationCenterRef.current.contains(event.target as Node)) {
        setShowNotificationCenter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const requestPermission = async () => {
    console.log("Iniciando pedido de permissão...");
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert("Este navegador não suporta notificações de desktop. Tente usar o Chrome, Edge ou Safari.");
      return;
    }

    setIsRequestingNotif(true);
    try {
      // Alguns navegadores exigem que a permissão seja pedida após um gesto do usuário (que é o caso aqui)
      const permission = await Notification.requestPermission();
      console.log("Permissão concedida/negada:", permission);
      setNotifPermission(permission);
      
      if (permission === 'granted') {
        sendSystemNotification("✅ Notificações Ativas!", "Você agora receberá sua prática diária direto no sistema.");
      } else if (permission === 'denied') {
        alert("As notificações foram bloqueadas. Para ativar, clique no ícone de cadeado na barra de endereços do seu navegador e mude 'Notificações' para 'Permitir'.");
      }
    } catch (error) {
      console.error("Erro crítico ao pedir permissão:", error);
      alert("Houve um erro ao tentar ativar as notificações. Verifique se seu navegador não está em modo incógnito ou com restrições de sistema.");
    } finally {
      setIsRequestingNotif(false);
    }
  };

  const sendSystemNotification = (title: string, body: string) => {
    if (notifPermission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: LOGO_URL,
        });
      } catch (e) {
        console.warn("Navegador impediu notificação nativa, enviando para o log interno.", e);
      }
    }
    
    const newNotif: NotificationContent = {
      id: 'sys_' + Math.random(),
      cycleId: 'system',
      dayNumber: 0,
      title,
      body,
      timestamp: new Date().toISOString(),
      type: 'word'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const trialInfo = useMemo(() => {
    if (!user) return null;
    if (user.isSubscribed) return { active: true, expired: false, daysLeft: 999 };
    const start = new Date(user.trialStartDate);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = TRIAL_DURATION_DAYS - diffDays;
    return { active: daysLeft > 0, expired: daysLeft <= 0, daysLeft: Math.max(0, daysLeft) };
  }, [user]);

  const handleLogoClick = () => {
    if (user) setView('dashboard');
    else setView('welcome');
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser({ 
      ...profile, 
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      trialStartDate: new Date().toISOString(),
      isSubscribed: false
    });
    setView('dashboard');
  };

  const handleCreateCycle = (newCycle: PracticeCycle) => {
    if (trialInfo?.expired) return;
    setCycles([...cycles, newCycle]);
    sendSystemNotification(`Ciclo Ativado!`, `As notificações para "${newCycle.name}" começam agora.`);
    setView('dashboard');
  };

  const SidebarItem = ({ icon: Icon, label, active, onClick, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${active ? 'bg-black text-white font-bold shadow-xl shadow-black/10' : 'text-slate-500 hover:bg-slate-100 hover:text-black'}`}
    >
      <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span className="text-base">{label}</span>
    </button>
  );

  const renderWelcome = () => (
    <div className="w-full min-h-screen bg-white flex flex-col items-center p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl w-full flex flex-col items-center text-center">
        {/* Logo massiva no welcome */}
        <button onClick={handleLogoClick} className="w-full max-w-[95vw] md:w-[70rem] md:h-[45rem] -mt-10 -mb-28 relative flex items-center justify-center transform hover:scale-105 transition-all duration-700 focus:outline-none">
          <img src={LOGO_URL} alt="PraticaAí Logo" className="w-full h-full object-contain" />
        </button>
        
        <div className="space-y-6 relative z-10 -mt-20">
          <h1 className="text-5xl md:text-8xl font-black text-black tracking-tight leading-[1.05]">
            Inglês passivo <br/>
            <span className="text-indigo-600">via notificações.</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-800 max-w-3xl mx-auto font-medium leading-relaxed mt-4">
            Aprenda sem abrir o app. Prática constante direto na sua tela de bloqueio e smartwatch.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center pt-10">
            <button onClick={() => setView('onboarding')} className="group px-16 py-6 bg-black text-white rounded-[2rem] font-black text-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-4 shadow-2xl hover:shadow-indigo-500/20 active:scale-95">
              Criar Conta Grátis <ArrowRight className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="w-full max-w-5xl mt-48 space-y-16">
          <h3 className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Trusted by early adopters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-slate-50 p-12 rounded-[4rem] text-left space-y-6 border border-slate-100 shadow-sm transition-all hover:translate-y-[-10px] hover:shadow-xl">
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({length: t.stars}).map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-700 text-lg font-medium italic leading-relaxed">“{t.text}”</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                  <p className="text-black font-black text-xs uppercase tracking-widest">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const activeCycle = cycles.find(c => c.status === 'active');

    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        {/* Banner de Permissão de Notificação - VISIBILIDADE MAXIMA */}
        {notifPermission !== 'granted' && (
          <div className="p-10 rounded-[4rem] bg-indigo-600 border-4 border-indigo-400 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] text-white animate-in slide-in-from-top-6">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-inner shrink-0">
                <Bell className="w-10 h-10 text-white animate-wiggle" />
              </div>
              <div className="space-y-2">
                <p className="font-black text-2xl tracking-tight leading-none">Ative o Motor de Prática</p>
                <p className="text-lg text-white/80 font-medium max-w-md leading-snug">Sem notificações, o PraticaAí não consegue te enviar as palavras. É essencial para o seu progresso!</p>
              </div>
            </div>
            <button 
              onClick={requestPermission}
              disabled={isRequestingNotif}
              className={`w-full lg:w-auto px-16 py-6 rounded-[2rem] font-black text-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${isRequestingNotif ? 'bg-indigo-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:scale-105 active:bg-slate-100 hover:shadow-indigo-500/40'}`}
            >
              {isRequestingNotif ? 'Ativando...' : 'Ativar Agora'}
              {!isRequestingNotif && <Zap className="w-6 h-6 fill-current" />}
            </button>
          </div>
        )}

        {!user?.isSubscribed && (
          <div className={`p-8 rounded-[3.5rem] border-2 flex flex-col md:flex-row items-center justify-between gap-6 transition-all shadow-sm ${trialInfo?.expired ? 'bg-red-50 border-red-100 text-red-900' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${trialInfo?.expired ? 'bg-red-100' : 'bg-white shadow-sm'}`}>
                {trialInfo?.expired ? <Lock className="w-8 h-8 text-red-600" /> : <Zap className="w-8 h-8 text-indigo-600" />}
              </div>
              <div className="space-y-1">
                <p className="font-black text-xl leading-none">
                  {trialInfo?.expired ? 'Teste expirado' : trialInfo?.daysLeft === 1 ? HUMAN_MESSAGES.trial_ending : HUMAN_MESSAGES.trial_active}
                </p>
                <p className="text-base opacity-70 font-medium">
                  {trialInfo?.expired ? HUMAN_MESSAGES.trial_expired : `Acesso Premium liberado por mais ${trialInfo?.daysLeft} dias.`}
                </p>
              </div>
            </div>
            <button className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-md active:scale-95 ${trialInfo?.expired ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-black text-white hover:bg-slate-900'}`}>
              Subir para Premium
            </button>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter text-black leading-none">👋 Olá, {user?.name}!</h2>
            <p className="text-slate-500 text-2xl font-medium">Pronto para a dose de inglês de hoje? 😉</p>
          </div>
          <button onClick={() => setShowNotificationCenter(!showNotificationCenter)} className="relative p-6 rounded-[2rem] border border-slate-200 bg-white hover:border-black hover:shadow-lg transition-all flex items-center justify-center shrink-0 w-fit">
            <Bell className="w-10 h-10 text-slate-400" />
            {notifications.length > 0 && <span className="absolute top-6 right-6 w-5 h-5 bg-red-500 rounded-full border-4 border-white animate-pulse"></span>}
          </button>
        </header>

        {trialInfo?.expired ? (
          <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[5rem] p-32 text-center space-y-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-md"><Lock className="w-12 h-12 text-slate-300" /></div>
            <div className="max-w-xl space-y-4">
              <h3 className="text-5xl font-black text-black tracking-tight leading-tight">Mantenha o Ritmo</h3>
              <p className="text-slate-500 font-medium text-2xl leading-relaxed">Seu teste acabou, mas o seu progresso não pode parar. Assine para continuar recebendo o motor de IA do PraticaAí.</p>
            </div>
            <button className="flex items-center gap-4 px-16 py-7 bg-black text-white rounded-[2.5rem] font-black text-2xl hover:bg-slate-900 transition-all shadow-2xl active:scale-95">
              <ShieldCheck className="w-8 h-8" /> Ativar Plano Vitalício
            </button>
          </div>
        ) : !activeCycle ? (
          <div className="bg-white border-2 border-slate-100 rounded-[5rem] p-32 text-center space-y-12 flex flex-col items-center shadow-sm">
            <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center relative">
              <PlusCircle className="w-24 h-24 text-indigo-600 animate-pulse" />
              <div className="absolute inset-0 border-2 border-indigo-100 rounded-full scale-125 opacity-20 animate-ping"></div>
            </div>
            <div className="max-w-xl space-y-4">
              <h3 className="text-5xl font-black text-black tracking-tight leading-tight">Crie seu primeiro Ciclo</h3>
              <p className="text-slate-600 font-medium text-2xl leading-relaxed">Escolha as palavras que deseja dominar e deixe o PraticaAí fazer o trabalho pesado.</p>
            </div>
            <button onClick={() => setView('create-cycle')} className="px-16 py-7 bg-black text-white rounded-[2.5rem] font-black text-3xl hover:bg-slate-900 transition-all shadow-2xl hover:scale-105 active:scale-95">Iniciar Agora</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-16 rounded-[5rem] shadow-sm border border-slate-100 space-y-16 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-4xl text-black tracking-tight">Foco de Hoje</h3>
                <span className="px-10 py-4 bg-green-500 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg shadow-green-100">Ciclo Ativo</span>
              </div>
              <div className="space-y-12">
                <div className="space-y-6">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Vocabulário selecionado</p>
                  <div className="flex flex-wrap gap-4">
                    {activeCycle.words.map(w => (
                      <span key={w} className="px-10 py-5 bg-slate-50 rounded-[2rem] text-2xl font-black text-black border border-slate-100 shadow-sm transition-all hover:bg-black hover:text-white cursor-default">{w}</span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => sendSystemNotification("🔥 Prática Relâmpago", `Dominando: ${activeCycle.words[0].toUpperCase()}`)}
                  className="w-full py-6 border-2 border-slate-100 rounded-[2rem] text-slate-400 font-black text-sm uppercase tracking-widest hover:border-black hover:text-black transition-all flex items-center justify-center gap-3"
                >
                  <Smartphone className="w-5 h-5" /> Testar Notificação do Sistema
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-16 rounded-[5rem] border border-slate-200 flex flex-col justify-center space-y-12 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-indigo-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="flex gap-2 text-yellow-400">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
              </div>
              <h4 className="font-black text-4xl text-black leading-tight italic tracking-tight">“{TESTIMONIALS[Math.floor(Math.random() * TESTIMONIALS.length)].text}”</h4>
              <div className="flex items-center gap-4">
                 <div className="w-14 h-1.5 bg-indigo-600 rounded-full"></div>
                 <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">Feedback Real</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 border-b border-slate-100 pb-10">
        <h2 className="text-6xl font-black text-black tracking-tighter leading-none">Minha Evolução</h2>
        <p className="text-slate-500 text-2xl font-medium">Cada ciclo concluído é um degrau a mais, {user?.name}.</p>
      </div>
      
      {cycles.length === 0 ? (
        <div className="bg-white rounded-[5rem] border-2 border-slate-100 p-48 text-center space-y-8 shadow-sm">
          <HistoryIcon className="w-24 h-24 text-slate-200 mx-auto" />
          <div className="space-y-2">
            <p className="text-slate-900 font-black text-3xl">Histórico Vazio</p>
            <p className="text-slate-400 font-medium text-xl">Suas conquistas aparecerão aqui automaticamente.</p>
          </div>
          <button onClick={() => setView('create-cycle')} className="px-12 py-5 bg-black text-white rounded-3xl font-black text-xl shadow-lg hover:scale-105 transition-transform">Iniciar Primeiro Ciclo</button>
        </div>
      ) : (
        <div className="grid gap-8">
          {cycles.map(c => (
            <div key={c.id} className="bg-white p-12 rounded-[3rem] border border-slate-100 flex items-center justify-between shadow-sm hover:border-black hover:shadow-xl transition-all group">
              <div className="flex items-center gap-10">
                <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center group-hover:bg-green-100 transition-colors"><CheckCircle2 className="text-green-600 w-12 h-12" /></div>
                <div className="space-y-1">
                  <h4 className="font-black text-3xl text-black tracking-tight">{c.name}</h4>
                  <p className="text-slate-500 font-medium text-xl">{c.words.length} palavras • Duração de {c.durationDays} dias</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                 <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Finalizado</span>
                 <ArrowRight className="text-slate-200 group-hover:text-black group-hover:translate-x-4 transition-all w-8 h-8" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 border-b border-slate-100 pb-10">
        <h2 className="text-6xl font-black text-black tracking-tighter leading-none">Perfil & Ajustes</h2>
        <p className="text-slate-500 text-2xl font-medium">Configure sua experiência de aprendizado.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-14 rounded-[5rem] border border-slate-100 space-y-12 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center shadow-inner"><UserIcon className="text-indigo-600 w-8 h-8" /></div>
            <h3 className="font-black text-3xl text-black tracking-tight">Dados do Usuário</h3>
          </div>
          <div className="space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nome Registrado</p>
              <p className="text-2xl font-black text-black border-b-2 border-slate-50 pb-4">{user?.name}</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">E-mail de Acesso</p>
              <p className="text-2xl font-black text-black border-b-2 border-slate-50 pb-4">{user?.email}</p>
            </div>
            <div className="flex items-center justify-between">
               <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Notificações</p>
               <div className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest ${notifPermission === 'granted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {notifPermission === 'granted' ? 'Autorizado' : 'Bloqueado'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-14 rounded-[5rem] border border-slate-100 space-y-12 shadow-sm flex flex-col justify-between">
          <div className="space-y-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center shadow-inner"><CreditCard className="text-indigo-600 w-8 h-8" /></div>
              <h3 className="font-black text-3xl text-black tracking-tight">Assinatura</h3>
            </div>
            <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 flex items-center justify-between shadow-inner">
              <div className="space-y-2">
                <p className="text-xs font-black text-black uppercase tracking-widest opacity-40">Plano Atual</p>
                <p className="text-2xl font-black text-slate-600">{user?.isSubscribed ? 'Premium Elite' : 'Beta Test (Trial)'}</p>
              </div>
              {!user?.isSubscribed && (
                <div className="text-right">
                  <span className="text-indigo-600 font-black text-4xl leading-none">{trialInfo?.daysLeft}</span>
                  <span className="text-[10px] block font-black text-indigo-400 uppercase tracking-widest mt-1">Dias Restantes</span>
                </div>
              )}
            </div>
          </div>
          <button className="w-full py-7 bg-black text-white rounded-[2.5rem] font-black text-2xl hover:bg-slate-900 transition-all shadow-2xl hover:scale-105 active:scale-95">
            {user?.isSubscribed ? 'Administrar Plano' : 'Ativar PraticaAí Premium'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {view === 'welcome' ? renderWelcome() : (
        <div className="flex min-h-screen">
          {view !== 'onboarding' && (
            <aside className="w-96 border-r border-slate-100 bg-white p-14 flex flex-col hidden lg:flex sticky top-0 h-screen shrink-0">
              {/* Logo na Sidebar MASSIVA e CENTRALIZADA */}
              <button onClick={handleLogoClick} className="flex flex-col items-center gap-0 mb-20 hover:opacity-80 transition-all focus:outline-none w-full group">
                <div className="w-full h-64 relative flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-black uppercase -mt-8 leading-none">PRATICAAÍ</span>
              </button>
              
              <nav className="space-y-6 flex-1">
                <SidebarItem icon={LayoutDashboard} label="Painel de Prática" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                <SidebarItem 
                  icon={PlusCircle} 
                  label="Criar Novo Ciclo" 
                  active={view === 'create-cycle'} 
                  onClick={() => !trialInfo?.expired && setView('create-cycle')} 
                  disabled={trialInfo?.expired}
                />
                <SidebarItem icon={HistoryIcon} label="Histórico" active={view === 'history'} onClick={() => setView('history')} />
                <SidebarItem icon={SettingsIcon} label="Ajustes da Conta" active={view === 'settings'} onClick={() => setView('settings')} />
              </nav>
              
              <div className="mt-auto pt-10 border-t border-slate-100">
                <SidebarItem icon={LogOut} label="Desconectar" onClick={() => { setUser(null); setView('welcome'); }} />
              </div>
            </aside>
          )}
          <main className="flex-1 bg-white relative">
            <div className="p-10 md:p-16 lg:p-24 max-w-7xl mx-auto w-full">
              {view === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
              {view === 'dashboard' && renderDashboard()}
              {view === 'create-cycle' && <CreateCycleWizard onComplete={handleCreateCycle} onCancel={() => setView('dashboard')} />}
              {view === 'history' && renderHistory()}
              {view === 'settings' && renderSettings()}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
