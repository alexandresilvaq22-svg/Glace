
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
  ShieldCheck,
  Menu,
  X as CloseIcon
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
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert("Este navegador não suporta notificações de desktop. Tente usar o Chrome, Edge ou Safari.");
      return;
    }

    setIsRequestingNotif(true);
    try {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      
      if (permission === 'granted') {
        sendSystemNotification("✅ Notificações Ativas!", "Você agora receberá sua prática diária direto no sistema.");
      } else if (permission === 'denied') {
        alert("As notificações foram bloqueadas. Ative nas configurações do navegador para o PraticaAí funcionar.");
      }
    } catch (error) {
      console.error("Erro ao pedir permissão:", error);
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
        console.warn("Erro ao disparar notificação nativa", e);
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
    sendSystemNotification(`Ciclo Ativado!`, `As notificações começam agora.`);
    setView('dashboard');
  };

  const SidebarItem = ({ icon: Icon, label, active, onClick, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${active ? 'bg-black text-white font-bold shadow-xl' : 'text-slate-500 hover:bg-slate-100 hover:text-black'}`}
    >
      <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span className="text-base">{label}</span>
    </button>
  );

  const MobileTabItem = ({ icon: Icon, label, active, onClick, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all ${disabled ? 'opacity-30' : ''} ${active ? 'text-indigo-600' : 'text-slate-400'}`}
    >
      <Icon className={`w-6 h-6 ${active ? 'fill-indigo-50' : ''}`} />
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );

  const renderWelcome = () => (
    <div className="w-full min-h-screen bg-white flex flex-col items-center p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl w-full flex flex-col items-center text-center">
        <button onClick={handleLogoClick} className="w-full max-w-[95vw] md:w-[70rem] md:h-[45rem] -mt-10 -mb-20 md:-mb-28 relative flex items-center justify-center transform hover:scale-105 transition-all duration-700 focus:outline-none">
          <img src={LOGO_URL} alt="PraticaAí Logo" className="w-full h-full object-contain" />
        </button>
        
        <div className="space-y-6 relative z-10 -mt-10 md:-mt-20">
          <h1 className="text-4xl md:text-8xl font-black text-black tracking-tight leading-[1.05]">
            Inglês passivo <br/>
            <span className="text-indigo-600">via notificações.</span>
          </h1>
          <p className="text-lg md:text-3xl text-slate-800 max-w-3xl mx-auto font-medium leading-relaxed mt-4">
            Aprenda sem abrir o app. Prática constante direto na sua tela de bloqueio e smartwatch.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center pt-10">
            <button onClick={() => setView('onboarding')} className="group px-12 md:px-16 py-5 md:py-6 bg-black text-white rounded-[2rem] font-black text-xl md:text-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95">
              Criar Conta Grátis <ArrowRight className="w-6 md:w-8 h-6 md:h-8" />
            </button>
          </div>
        </div>

        <div className="w-full max-w-5xl mt-32 md:mt-48 space-y-16">
          <h3 className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Trusted by early adopters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-slate-50 p-10 md:p-12 rounded-[3rem] md:rounded-[4rem] text-left space-y-6 border border-slate-100 shadow-sm transition-all hover:translate-y-[-10px]">
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({length: t.stars}).map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-700 text-base md:text-lg font-medium italic leading-relaxed">“{t.text}”</p>
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
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500 pb-24 lg:pb-0">
        {notifPermission !== 'granted' && (
          <div className="p-8 md:p-10 rounded-[3rem] md:rounded-[4rem] bg-indigo-600 border-4 border-indigo-400 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 shadow-xl text-white">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-inner shrink-0">
                <Bell className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="font-black text-xl md:text-2xl tracking-tight leading-none">Ative o Motor de Prática</p>
                <p className="text-base md:text-lg text-white/80 font-medium max-w-md leading-snug">Sem notificações, o PraticaAí não consegue te enviar as palavras.</p>
              </div>
            </div>
            <button 
              onClick={requestPermission}
              disabled={isRequestingNotif}
              className={`w-full lg:w-auto px-10 md:px-16 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${isRequestingNotif ? 'bg-indigo-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:scale-105'}`}
            >
              {isRequestingNotif ? 'Ativando...' : 'Ativar Agora'}
              {!isRequestingNotif && <Zap className="w-6 h-6 fill-current" />}
            </button>
          </div>
        )}

        <header className="flex items-end justify-between gap-6 border-b border-slate-100 pb-8 md:pb-10">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black leading-none">👋 Olá, {user?.name}!</h2>
            <p className="text-slate-500 text-lg md:text-2xl font-medium">Pronto para o inglês de hoje? 😉</p>
          </div>
          <button onClick={() => setShowNotificationCenter(!showNotificationCenter)} className="relative p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 bg-white hover:border-black transition-all flex items-center justify-center shrink-0 shadow-sm">
            <Bell className="w-6 h-6 md:w-10 md:h-10 text-slate-400" />
            {notifications.length > 0 && <span className="absolute top-4 md:top-6 right-4 md:right-6 w-3 h-3 md:w-5 md:h-5 bg-red-500 rounded-full border-4 border-white animate-pulse"></span>}
          </button>
        </header>

        {trialInfo?.expired ? (
          <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] md:rounded-[5rem] p-12 md:p-32 text-center space-y-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-md"><Lock className="w-10 h-10 text-slate-300" /></div>
            <div className="max-w-xl space-y-4">
              <h3 className="text-3xl md:text-5xl font-black text-black tracking-tight leading-tight">Mantenha o Ritmo</h3>
              <p className="text-slate-500 font-medium text-lg md:text-2xl leading-relaxed">Seu teste acabou, mas o seu progresso não pode parar.</p>
            </div>
            <button className="flex items-center gap-4 px-10 md:px-16 py-5 md:py-7 bg-black text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-xl md:text-2xl hover:bg-slate-900 transition-all shadow-2xl active:scale-95">
              <ShieldCheck className="w-6 md:w-8 h-6 md:h-8" /> Ativar Plano Vitalício
            </button>
          </div>
        ) : !activeCycle ? (
          <div className="bg-white border-2 border-slate-100 rounded-[3rem] md:rounded-[5rem] p-12 md:p-32 text-center space-y-12 flex flex-col items-center shadow-sm">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-50 rounded-full flex items-center justify-center">
              <PlusCircle className="w-20 h-20 md:w-24 md:h-24 text-indigo-600 animate-pulse" />
            </div>
            <div className="max-w-xl space-y-4">
              <h3 className="text-3xl md:text-5xl font-black text-black tracking-tight leading-tight">Crie seu primeiro Ciclo</h3>
              <p className="text-slate-600 font-medium text-lg md:text-2xl leading-relaxed">Escolha as palavras que deseja dominar e deixe o PraticaAí fazer o trabalho pesado.</p>
            </div>
            <button onClick={() => setView('create-cycle')} className="px-10 md:px-16 py-5 md:py-7 bg-black text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-xl md:text-3xl hover:bg-slate-900 transition-all shadow-2xl active:scale-95">Iniciar Agora</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white p-10 md:p-16 rounded-[3rem] md:rounded-[5rem] shadow-sm border border-slate-100 space-y-12 md:space-y-16">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-2xl md:text-4xl text-black tracking-tight">Foco de Hoje</h3>
                <span className="px-6 md:px-10 py-3 md:py-4 bg-green-500 text-white text-[10px] md:text-xs font-black rounded-full uppercase tracking-widest">Ativo</span>
              </div>
              <div className="space-y-8 md:space-y-12">
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Vocabulário</p>
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {activeCycle.words.map(w => (
                      <span key={w} className="px-6 md:px-10 py-3 md:py-5 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] text-lg md:text-2xl font-black text-black border border-slate-100 shadow-sm">{w}</span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => sendSystemNotification("🔥 Prática Relâmpago", `Dominando: ${activeCycle.words[0].toUpperCase()}`)}
                  className="w-full py-4 md:py-6 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] text-slate-400 font-black text-[10px] md:text-sm uppercase tracking-widest hover:border-black hover:text-black transition-all flex items-center justify-center gap-3"
                >
                  <Smartphone className="w-5 h-5" /> Testar Notificação
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-10 md:p-16 rounded-[3rem] md:rounded-[5rem] border border-slate-200 flex flex-col justify-center space-y-10 md:space-y-12 relative overflow-hidden group">
              <div className="flex gap-2 text-yellow-400">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 md:w-6 h-5 md:h-6 fill-current" />)}
              </div>
              <h4 className="font-black text-2xl md:text-4xl text-black leading-tight italic tracking-tight">“{TESTIMONIALS[Math.floor(Math.random() * TESTIMONIALS.length)].text}”</h4>
              <div className="flex items-center gap-4">
                 <div className="w-10 md:w-14 h-1 md:h-1.5 bg-indigo-600 rounded-full"></div>
                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Feedback Real</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 pb-24 lg:pb-0">
      <div className="space-y-2 border-b border-slate-100 pb-10 text-center md:text-left">
        <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none">Minha Evolução</h2>
        <p className="text-slate-500 text-lg md:text-2xl font-medium">Cada ciclo concluído é um degrau a mais.</p>
      </div>
      
      {cycles.length === 0 ? (
        <div className="bg-white rounded-[3rem] md:rounded-[5rem] border-2 border-slate-100 p-20 md:p-48 text-center space-y-8 shadow-sm">
          <HistoryIcon className="w-16 md:w-24 h-16 md:h-24 text-slate-200 mx-auto" />
          <div className="space-y-2">
            <p className="text-slate-900 font-black text-2xl md:text-3xl">Histórico Vazio</p>
            <p className="text-slate-400 font-medium text-base md:text-xl">Suas conquistas aparecerão aqui automaticamente.</p>
          </div>
          <button onClick={() => setView('create-cycle')} className="px-10 py-4 bg-black text-white rounded-2xl font-black shadow-lg">Iniciar Primeiro Ciclo</button>
        </div>
      ) : (
        <div className="grid gap-6 md:gap-8">
          {cycles.map(c => (
            <div key={c.id} className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 flex items-center justify-between shadow-sm hover:border-black transition-all group">
              <div className="flex items-center gap-6 md:gap-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center"><CheckCircle2 className="text-green-600 w-10 md:w-12 h-10 md:h-12" /></div>
                <div className="space-y-1">
                  <h4 className="font-black text-xl md:text-3xl text-black tracking-tight">{c.name}</h4>
                  <p className="text-slate-500 font-medium text-base md:text-xl">{c.words.length} palavras dominadas</p>
                </div>
              </div>
              <ArrowRight className="text-slate-200 group-hover:text-black group-hover:translate-x-4 transition-all w-6 md:w-8 h-6 md:h-8" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 pb-24 lg:pb-0">
      <div className="space-y-2 border-b border-slate-100 pb-10 text-center md:text-left">
        <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none">Perfil & Ajustes</h2>
        <p className="text-slate-500 text-lg md:text-2xl font-medium">Configure sua experiência.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="bg-white p-10 md:p-14 rounded-[3rem] md:rounded-[5rem] border border-slate-100 space-y-10 md:space-y-12 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-50 rounded-2xl md:rounded-3xl flex items-center justify-center"><UserIcon className="text-indigo-600 w-6 md:w-8 h-6 md:h-8" /></div>
            <h3 className="font-black text-2xl md:text-3xl text-black tracking-tight">Dados do Usuário</h3>
          </div>
          <div className="space-y-8 md:space-y-10">
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Registrado</p>
              <p className="text-xl md:text-2xl font-black text-black border-b-2 border-slate-50 pb-4">{user?.name}</p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail de Acesso</p>
              <p className="text-xl md:text-2xl font-black text-black border-b-2 border-slate-50 pb-4">{user?.email}</p>
            </div>
            <button onClick={() => { setUser(null); setView('welcome'); }} className="lg:hidden w-full py-4 border-2 border-red-50 text-red-500 rounded-2xl font-black text-sm uppercase tracking-widest">Desconectar</button>
          </div>
        </div>

        <div className="bg-white p-10 md:p-14 rounded-[3rem] md:rounded-[5rem] border border-slate-100 space-y-10 md:space-y-12 shadow-sm">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-50 rounded-2xl md:rounded-3xl flex items-center justify-center"><CreditCard className="text-indigo-600 w-6 md:w-8 h-6 md:h-8" /></div>
              <h3 className="font-black text-2xl md:text-3xl text-black tracking-tight">Assinatura</h3>
            </div>
            <div className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-slate-50 border border-slate-100 flex items-center justify-between shadow-inner">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-black uppercase tracking-widest opacity-40">Plano Atual</p>
                <p className="text-xl md:text-2xl font-black text-slate-600">{user?.isSubscribed ? 'Premium Elite' : 'Beta Test'}</p>
              </div>
              {!user?.isSubscribed && (
                <div className="text-right">
                  <span className="text-indigo-600 font-black text-3xl md:text-4xl leading-none">{trialInfo?.daysLeft}</span>
                  <span className="text-[10px] block font-black text-indigo-400 uppercase tracking-widest">Dias</span>
                </div>
              )}
            </div>
            <button className="w-full py-5 md:py-7 bg-black text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-xl md:text-2xl hover:bg-slate-900 shadow-xl transition-all active:scale-95">
              Ativar Premium
            </button>
        </div>
      </div>
    </div>
  );

  const showNavs = view !== 'welcome' && view !== 'onboarding' && user;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {view === 'welcome' ? renderWelcome() : (
        <div className="flex min-h-screen">
          {view !== 'onboarding' && (
            <aside className="w-[420px] border-r border-slate-100 bg-white p-10 flex flex-col hidden lg:flex sticky top-0 h-screen shrink-0 overflow-y-auto">
              {/* Logo na Sidebar */}
              <button onClick={handleLogoClick} className="flex flex-col items-center gap-0 mb-12 hover:opacity-90 transition-all focus:outline-none w-full group">
                <div className="w-full h-[320px] relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
                </div>
              </button>
              
              <nav className="space-y-4 flex-1">
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
            <div className="p-6 md:p-16 lg:p-24 max-w-7xl mx-auto w-full">
              {view === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
              {view === 'dashboard' && renderDashboard()}
              {view === 'create-cycle' && <CreateCycleWizard onComplete={handleCreateCycle} onCancel={() => setView('dashboard')} />}
              {view === 'history' && renderHistory()}
              {view === 'settings' && renderSettings()}
            </div>
          </main>

          {/* Mobile Navigation Tab Bar */}
          {showNavs && view !== 'create-cycle' && (
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-4 pb-safe pt-2 flex items-center justify-around z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
              <MobileTabItem 
                icon={LayoutDashboard} 
                label="Painel" 
                active={view === 'dashboard'} 
                onClick={() => setView('dashboard')} 
              />
              <MobileTabItem 
                icon={PlusCircle} 
                label="Novo" 
                active={view === 'create-cycle'} 
                onClick={() => !trialInfo?.expired && setView('create-cycle')}
                disabled={trialInfo?.expired}
              />
              <MobileTabItem 
                icon={HistoryIcon} 
                label="Histórico" 
                active={view === 'history'} 
                onClick={() => setView('history')} 
              />
              <MobileTabItem 
                icon={SettingsIcon} 
                label="Ajustes" 
                active={view === 'settings'} 
                onClick={() => setView('settings')} 
              />
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
