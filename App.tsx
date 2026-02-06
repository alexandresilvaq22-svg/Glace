
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
  AlertCircle
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
    if (typeof Notification === 'undefined') {
      alert("Seu navegador não suporta notificações do sistema. Tente usar o Chrome ou Safari.");
      return;
    }

    setIsRequestingNotif(true);
    try {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      
      if (permission === 'granted') {
        sendSystemNotification("🎉 PraticaAí Ativado!", "Suas notificações de inglês chegarão por aqui.");
      } else if (permission === 'denied') {
        alert("Parece que as notificações estão bloqueadas no seu navegador. Ative-as nas configurações do site (ícone de cadeado ao lado da URL).");
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
        console.error("Erro ao disparar notificação:", e);
      }
    }
    
    // Sempre adiciona ao centro de notificações interno
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
    sendSystemNotification(`Bora começar!`, `Ciclo "${newCycle.name}" ativado. ${HUMAN_MESSAGES.encouragement}`);
    setView('dashboard');
  };

  const SidebarItem = ({ icon: Icon, label, active, onClick, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${active ? 'bg-slate-100 text-black font-bold border border-slate-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-black'}`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
      <span className="text-sm">{label}</span>
    </button>
  );

  const renderWelcome = () => (
    <div className="w-full min-h-screen bg-white flex flex-col items-center p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl w-full flex flex-col items-center text-center">
        {/* Logo bem grande no welcome */}
        <button onClick={handleLogoClick} className="w-full max-w-[90vw] md:w-[60rem] md:h-[40rem] mt-0 -mb-24 relative flex items-center justify-center transform hover:scale-105 transition-transform duration-700 focus:outline-none">
          <img src={LOGO_URL} alt="PraticaAí Logo" className="w-full h-full object-contain" />
        </button>
        
        <div className="space-y-4 relative z-10 -mt-20">
          <h1 className="text-4xl md:text-7xl font-black text-black tracking-tight leading-[1.05]">
            Pratique inglês todos os dias <br/>
            <span className="text-indigo-600">sem precisar abrir o app.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-800 max-w-2xl mx-auto font-medium leading-relaxed mt-4">
            Transformamos notificações em aprendizado contínuo. Experimente grátis por 2 dias.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center pt-8">
            <button onClick={() => setView('onboarding')} className="group px-12 py-5 bg-black text-white rounded-2xl font-black text-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95">
              Começar Teste Grátis <ArrowRight className="w-6 h-6" />
            </button>
            <button className="px-12 py-5 bg-white text-black border-2 border-slate-200 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all">
              Já tenho conta
            </button>
          </div>
        </div>

        <div className="w-full max-w-5xl mt-32 space-y-12">
          <h3 className="text-slate-400 font-black uppercase tracking-widest text-xs">O que dizem sobre o PraticaAí</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-slate-50 p-10 rounded-[3rem] text-left space-y-4 border border-slate-100 shadow-sm transition-all hover:scale-105">
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({length: t.stars}).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-700 font-medium italic leading-relaxed">“{t.text}”</p>
                <p className="text-black font-black text-sm uppercase tracking-wide">— {t.name}</p>
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
      <div className="space-y-10 animate-in fade-in duration-500">
        {/* Banner de Permissão de Notificação Refinado */}
        {notifPermission !== 'granted' && (
          <div className="p-8 rounded-[3rem] bg-indigo-600 border-2 border-indigo-500 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-white animate-in slide-in-from-top-4">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 backdrop-blur flex items-center justify-center shadow-inner">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-xl tracking-tight">Ative as Notificações de Prática</p>
                <p className="text-base text-white/80 font-medium">Você precisa permitir o navegador para o PraticaAí funcionar.</p>
              </div>
            </div>
            <button 
              onClick={requestPermission}
              disabled={isRequestingNotif}
              className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 ${isRequestingNotif ? 'bg-indigo-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-slate-50'}`}
            >
              {isRequestingNotif ? 'Aguardando...' : 'Ativar Agora'}
              <Zap className={`w-5 h-5 ${isRequestingNotif ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        )}

        {/* Banner de Trial */}
        {!user?.isSubscribed && (
          <div className={`p-8 rounded-[3rem] border-2 flex flex-col md:flex-row items-center justify-between gap-6 transition-all shadow-sm ${trialInfo?.expired ? 'bg-red-50 border-red-100 text-red-900' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${trialInfo?.expired ? 'bg-red-100' : 'bg-white shadow-sm'}`}>
                {trialInfo?.expired ? <Lock className="w-8 h-8 text-red-600" /> : <Zap className="w-8 h-8 text-indigo-600" />}
              </div>
              <div className="space-y-1">
                <p className="font-black text-xl">
                  {trialInfo?.expired ? 'Seu teste expirou' : trialInfo?.daysLeft === 1 ? HUMAN_MESSAGES.trial_ending : HUMAN_MESSAGES.trial_active}
                </p>
                <p className="text-base opacity-70 font-medium leading-tight">
                  {trialInfo?.expired ? HUMAN_MESSAGES.trial_expired : `Aproveite seu acesso completo por mais ${trialInfo?.daysLeft} dias.`}
                </p>
              </div>
            </div>
            <button className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-sm active:scale-95 ${trialInfo?.expired ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-black text-white hover:bg-slate-900'}`}>
              Assinar Premium
            </button>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tighter text-black">👋 Olá, {user?.name}!</h2>
            <p className="text-slate-500 text-xl font-medium">Bora praticar um pouquinho hoje? 😉</p>
          </div>
          <button onClick={() => setShowNotificationCenter(!showNotificationCenter)} className="relative p-5 rounded-[1.5rem] border border-slate-200 bg-white hover:border-black transition-all flex items-center justify-center shrink-0 w-fit shadow-sm">
            <Bell className="w-8 h-8 text-slate-400" />
            {notifications.length > 0 && <span className="absolute top-5 right-5 w-4 h-4 bg-red-500 rounded-full border-4 border-white animate-pulse"></span>}
          </button>
        </header>

        {trialInfo?.expired ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem] p-24 text-center space-y-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-md"><Lock className="w-12 h-12 text-slate-300" /></div>
            <div className="max-w-lg space-y-4">
              <h3 className="text-4xl font-black text-black tracking-tight">Evolua para o Premium</h3>
              <p className="text-slate-500 font-medium text-xl leading-relaxed">Seu período de teste acabou. Não perca o ritmo! Assine agora para continuar dominando o inglês.</p>
            </div>
            <button className="flex items-center gap-4 px-14 py-6 bg-black text-white rounded-3xl font-black text-2xl hover:bg-slate-900 transition-all shadow-2xl active:scale-95">
              <CreditCard className="w-7 h-7" /> Ver Planos
            </button>
          </div>
        ) : !activeCycle ? (
          <div className="bg-white border-2 border-slate-100 rounded-[4rem] p-24 text-center space-y-10 flex flex-col items-center shadow-sm">
            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center"><PlusCircle className="w-16 h-16 text-indigo-600" /></div>
            <div className="max-w-lg space-y-4">
              <h3 className="text-4xl font-black text-black tracking-tight leading-tight">Vamos criar seu primeiro ciclo?</h3>
              <p className="text-slate-600 font-medium text-xl leading-relaxed">Defina suas palavras e o PraticaAí cuida do resto via notificações.</p>
            </div>
            <button onClick={() => setView('create-cycle')} className="px-14 py-6 bg-black text-white rounded-3xl font-black text-2xl hover:bg-slate-900 transition-all shadow-xl active:scale-95">Criar Novo Ciclo</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-14 rounded-[4rem] shadow-sm border border-slate-100 space-y-12">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-3xl text-black tracking-tight">Seu Plano de Hoje</h3>
                <span className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md">Ativo</span>
              </div>
              <div className="space-y-10">
                <div className="space-y-6">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" /> Palavras em foco</p>
                  <div className="flex flex-wrap gap-4">
                    {activeCycle.words.map(w => (
                      <span key={w} className="px-8 py-4 bg-slate-50 rounded-3xl text-lg font-bold text-black border border-slate-100 shadow-sm transition-all hover:bg-white hover:border-indigo-200 cursor-default">{w}</span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => sendSystemNotification("📚 Hora de Praticar!", `Sua palavra do momento é: ${activeCycle.words[Math.floor(Math.random() * activeCycle.words.length)]}`)}
                  className="w-full py-4 border-2 border-slate-100 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all"
                >
                  Testar Notificação Real
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-14 rounded-[4rem] border border-slate-200 flex flex-col justify-center space-y-10 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 opacity-5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="flex gap-1 text-yellow-400">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <h4 className="font-black text-3xl text-black leading-tight italic tracking-tight">“{TESTIMONIALS[Math.floor(Math.random() * TESTIMONIALS.length)].text}”</h4>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
                 <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">Prova Social • Usuário Real</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-5xl font-black text-black tracking-tighter">Histórico de Conquistas</h2>
        <p className="text-slate-500 text-xl font-medium">Olha só tudo o que você já dominou, {user?.name}.</p>
      </div>
      
      {cycles.length === 0 ? (
        <div className="bg-white rounded-[4rem] border-2 border-slate-100 p-40 text-center space-y-8 shadow-sm">
          <HistoryIcon className="w-20 h-20 text-slate-200 mx-auto" />
          <div className="space-y-2">
            <p className="text-slate-900 font-black text-2xl">Ainda sem histórico.</p>
            <p className="text-slate-400 font-medium">Conclua seu primeiro ciclo para ver sua evolução aqui.</p>
          </div>
          <button onClick={() => setView('create-cycle')} className="px-10 py-4 bg-black text-white rounded-2xl font-black shadow-lg">Começar Agora</button>
        </div>
      ) : (
        <div className="grid gap-6">
          {cycles.map(c => (
            <div key={c.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm hover:border-black transition-all group">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors"><CheckCircle2 className="text-green-600 w-10 h-10" /></div>
                <div>
                  <h4 className="font-black text-2xl text-black">{c.name}</h4>
                  <p className="text-slate-500 font-medium text-lg">{c.words.length} palavras dominadas • {c.durationDays} dias de foco</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Finalizado</span>
                 <ArrowRight className="text-slate-200 group-hover:text-black group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-5xl font-black text-black tracking-tighter">Ajustes da Conta</h2>
        <p className="text-slate-500 text-xl font-medium">Personalize seu ambiente de aprendizado.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 space-y-10 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center"><UserIcon className="text-indigo-600 w-7 h-7" /></div>
            <h3 className="font-black text-2xl text-black">Seu Perfil</h3>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</p>
              <p className="text-xl font-bold text-black border-b border-slate-100 pb-2">{user?.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Profissional</p>
              <p className="text-xl font-bold text-black border-b border-slate-100 pb-2">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Notificações</p>
              <div className={`inline-block px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest ${notifPermission === 'granted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {notifPermission === 'granted' ? 'Ativas' : 'Bloqueadas'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 space-y-10 shadow-sm flex flex-col justify-between">
          <div className="space-y-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center"><CreditCard className="text-indigo-600 w-7 h-7" /></div>
              <h3 className="font-black text-2xl text-black">Plano PraticaAí</h3>
            </div>
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-between shadow-inner">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-black uppercase tracking-widest">Status da Assinatura</p>
                <p className="text-xl font-bold text-slate-500">{user?.isSubscribed ? 'Plano Premium Ativo' : 'Teste Gratuito'}</p>
              </div>
              {!user?.isSubscribed && (
                <div className="text-right">
                  <span className="text-indigo-600 font-black text-2xl">{trialInfo?.daysLeft}</span>
                  <span className="text-[10px] block font-black text-indigo-400 uppercase tracking-widest">Dias Restantes</span>
                </div>
              )}
            </div>
          </div>
          <button className="w-full py-6 bg-black text-white rounded-[2rem] font-black text-xl hover:bg-slate-900 transition-all shadow-xl active:scale-95">
            {user?.isSubscribed ? 'Gerenciar Assinatura' : 'Quero ser Premium'}
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
            <aside className="w-80 border-r border-slate-100 bg-white p-12 flex flex-col hidden lg:flex sticky top-0 h-screen shrink-0">
              {/* Logo na Sidebar Aumentada */}
              <button onClick={handleLogoClick} className="flex flex-col items-center gap-4 mb-20 hover:opacity-80 transition-opacity focus:outline-none w-full">
                <div className="w-48 h-32 relative flex items-center justify-center">
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-black uppercase -mt-4">PraticaAí</span>
              </button>
              <nav className="space-y-4 flex-1">
                <SidebarItem icon={LayoutDashboard} label="Painel" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                <SidebarItem 
                  icon={PlusCircle} 
                  label="Novo Ciclo" 
                  active={view === 'create-cycle'} 
                  onClick={() => !trialInfo?.expired && setView('create-cycle')} 
                  disabled={trialInfo?.expired}
                />
                <SidebarItem icon={HistoryIcon} label="Histórico" active={view === 'history'} onClick={() => setView('history')} />
                <SidebarItem icon={SettingsIcon} label="Ajustes" active={view === 'settings'} onClick={() => setView('settings')} />
              </nav>
              <div className="mt-auto pt-10 border-t border-slate-50">
                <SidebarItem icon={LogOut} label="Desconectar" onClick={() => { setUser(null); setView('welcome'); }} />
              </div>
            </aside>
          )}
          <main className="flex-1 bg-white relative">
            <div className="p-8 md:p-16 lg:p-24 max-w-7xl mx-auto w-full">
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
