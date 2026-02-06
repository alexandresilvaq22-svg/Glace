
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppState, UserProfile, PracticeCycle, NotificationContent, EnglishLevel, Goal } from './types';
import Onboarding from './components/Onboarding';
import NotificationPreview from './components/NotificationPreview';
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
  Target,
  X,
  Star,
  Lock,
  CreditCard,
  User as UserIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('welcome');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cycles, setCycles] = useState<PracticeCycle[]>([]);
  const [notifications, setNotifications] = useState<NotificationContent[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
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

  const trialInfo = useMemo(() => {
    if (!user) return null;
    if (user.isSubscribed) return { active: true, expired: false, daysLeft: 999 };
    
    const start = new Date(user.trialStartDate);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = TRIAL_DURATION_DAYS - diffDays;
    
    return {
      active: daysLeft > 0,
      expired: daysLeft <= 0,
      daysLeft: Math.max(0, daysLeft)
    };
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
    setNotifications([{
      id: 'notif_' + Math.random(),
      cycleId: newCycle.id,
      dayNumber: 1,
      title: `Bora começar!`,
      body: `Ciclo "${newCycle.name}" ativado. ${HUMAN_MESSAGES.encouragement}`,
      timestamp: new Date().toISOString(),
      type: 'word'
    }, ...notifications]);
    setView('dashboard');
  };

  const SidebarItem = ({ icon: Icon, label, active, onClick, disabled }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${active ? 'bg-slate-100 text-black font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-black'}`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
      <span className="text-sm">{label}</span>
    </button>
  );

  const renderWelcome = () => (
    <div className="w-full min-h-screen bg-white flex flex-col items-center p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl w-full flex flex-col items-center text-center">
        <button onClick={handleLogoClick} className="w-full max-w-[90vw] md:w-[48rem] md:h-[32rem] mt-4 -mb-16 relative flex items-center justify-center transform hover:scale-105 transition-transform duration-700 ease-out focus:outline-none">
          <img src={LOGO_URL} alt="PraticaAí Logo" className="w-full h-full object-contain" />
        </button>
        
        <div className="space-y-4 relative z-10 -mt-10">
          <h1 className="text-4xl md:text-7xl font-black text-black tracking-tight leading-[1.05]">
            Pratique inglês todos os dias <br/>
            <span className="text-indigo-600">sem precisar abrir o app.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-800 max-w-2xl mx-auto font-medium leading-relaxed mt-4">
            Transformamos notificações em aprendizado contínuo. Experimente grátis por 2 dias.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center pt-8">
            <button onClick={() => setView('onboarding')} className="group px-12 py-5 bg-black text-white rounded-2xl font-black text-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-4 shadow-2xl">
              Começar Teste Grátis <ArrowRight className="w-6 h-6" />
            </button>
            <button className="px-12 py-5 bg-white text-black border-2 border-slate-200 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all">
              Já tenho conta
            </button>
          </div>
        </div>

        <div className="w-full max-w-5xl mt-24 space-y-12">
          <h3 className="text-slate-400 font-black uppercase tracking-widest text-sm">O que dizem sobre o PraticaAí</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] text-left space-y-4 border border-slate-100 shadow-sm">
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({length: t.stars}).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-700 font-medium italic leading-relaxed">“{t.text}”</p>
                <p className="text-black font-black text-sm">— {t.name}</p>
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
        {!user?.isSubscribed && (
          <div className={`p-6 rounded-[2rem] border-2 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${trialInfo?.expired ? 'bg-red-50 border-red-100 text-red-900' : 'bg-indigo-50 border-indigo-100 text-indigo-900'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${trialInfo?.expired ? 'bg-red-100' : 'bg-white shadow-sm'}`}>
                {trialInfo?.expired ? <Lock className="w-6 h-6 text-red-600" /> : <Zap className="w-6 h-6 text-indigo-600" />}
              </div>
              <div>
                <p className="font-black text-lg">
                  {trialInfo?.expired ? 'Seu teste expirou' : trialInfo?.daysLeft === 1 ? HUMAN_MESSAGES.trial_ending : HUMAN_MESSAGES.trial_active}
                </p>
                <p className="text-sm opacity-80 font-medium">
                  {trialInfo?.expired ? HUMAN_MESSAGES.trial_expired : `Faltam ${trialInfo?.daysLeft} dias para o PraticaAí continuar funcionando.`}
                </p>
              </div>
            </div>
            <button className={`w-full md:w-auto px-8 py-4 rounded-xl font-black text-sm transition-all shadow-sm ${trialInfo?.expired ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-indigo-600 hover:bg-slate-50'}`}>
              Ativar Plano agora
            </button>
          </div>
        )}

        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tight text-black">{HUMAN_MESSAGES.welcome} {user?.email?.split('@')[0]}!</h2>
            <p className="text-slate-600 text-lg font-medium">{HUMAN_MESSAGES.praise}</p>
          </div>
          <button onClick={() => setShowNotificationCenter(!showNotificationCenter)} className="relative p-4 rounded-2xl border border-slate-200 bg-white hover:border-black transition-all">
            <Bell className="w-7 h-7 text-slate-400" />
            {notifications.length > 0 && <span className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
        </header>

        {trialInfo?.expired ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem] p-16 text-center space-y-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm"><Lock className="w-10 h-10 text-slate-300" /></div>
            <div className="max-w-md space-y-4">
              <h3 className="text-3xl font-black text-black">Bora assinar?</h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">Seu teste de 2 dias acabou. Para continuar recebendo notificações e evoluindo seu inglês, escolha um plano.</p>
            </div>
            <button className="flex items-center gap-3 px-12 py-5 bg-black text-white rounded-2xl font-black text-xl hover:bg-slate-900 transition-all shadow-xl">
              <CreditCard className="w-6 h-6" /> Ver Planos
            </button>
          </div>
        ) : !activeCycle ? (
          <div className="bg-white border-2 border-slate-100 rounded-[4rem] p-20 text-center space-y-8 flex flex-col items-center shadow-sm">
            <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center"><PlusCircle className="w-14 h-14 text-slate-300" /></div>
            <div className="max-w-md space-y-3">
              <h3 className="text-4xl font-black text-black tracking-tight leading-tight">Vamos criar seu primeiro ciclo?</h3>
              <p className="text-slate-600 font-medium text-xl">Só 2 minutinhos agora para garantir sua prática do dia todo.</p>
            </div>
            <button onClick={() => setView('create-cycle')} className="px-12 py-5 bg-black text-white rounded-2xl font-black text-xl hover:bg-slate-900 transition-all shadow-lg active:scale-95">Criar Novo Ciclo</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-3xl text-black">Ciclo Ativo</h3>
                <span className="px-6 py-2 bg-indigo-600 text-white text-xs font-black rounded-full uppercase tracking-widest">Praticando</span>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Suas palavras</p>
                  <div className="flex flex-wrap gap-3">
                    {activeCycle.words.map(w => (
                      <span key={w} className="px-6 py-3 bg-slate-50 rounded-2xl text-base font-bold text-black border border-slate-100">{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-200 flex flex-col justify-center space-y-6">
              <h4 className="font-black text-xl text-black leading-tight italic">“{TESTIMONIALS[Math.floor(Math.random() * TESTIMONIALS.length)].text}”</h4>
              <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">— Prova Social do PraticaAí</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-black">Seu Histórico</h2>
        <p className="text-slate-600 font-medium">Veja o quanto você já evoluiu por aqui.</p>
      </div>
      
      {cycles.length === 0 ? (
        <div className="bg-white rounded-[4rem] border-2 border-slate-50 p-32 text-center space-y-6">
          <HistoryIcon className="w-16 h-16 text-slate-200 mx-auto" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Nenhum ciclo concluído ainda.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {cycles.map(c => (
            <div key={c.id} className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center"><CheckCircle2 className="text-green-600 w-8 h-8" /></div>
                <div>
                  <h4 className="font-black text-xl text-black">{c.name}</h4>
                  <p className="text-slate-500 font-medium">{c.words.length} palavras dominadas • {c.durationDays} dias</p>
                </div>
              </div>
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Concluído</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-black">Ajustes</h2>
        <p className="text-slate-600 font-medium">Configure sua experiência no PraticaAí.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-8 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <UserIcon className="text-indigo-600 w-6 h-6" />
            <h3 className="font-black text-xl">Perfil do Estudante</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
              <p className="font-bold text-black">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível de Inglês</p>
              <p className="font-bold text-black">{user?.level === EnglishLevel.BEGINNER ? 'Iniciante' : 'Intermediário'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequência de Notificações</p>
              <p className="font-bold text-black">{user?.weeklyFrequency} dias por semana</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-8 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <CreditCard className="text-indigo-600 w-6 h-6" />
            <h3 className="font-black text-xl">Assinatura</h3>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-black uppercase tracking-widest">Plano Atual</p>
              <p className="font-bold text-slate-500">{user?.isSubscribed ? 'Premium' : 'Teste Gratuito'}</p>
            </div>
            {!user?.isSubscribed && <span className="text-indigo-600 font-black text-xs uppercase tracking-widest">Faltam {trialInfo?.daysLeft} dias</span>}
          </div>
          <button className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm hover:bg-slate-900 transition-all">
            {user?.isSubscribed ? 'Gerenciar Plano' : 'Ativar Premium'}
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
              <button onClick={handleLogoClick} className="flex items-center gap-4 mb-16 hover:opacity-80 transition-opacity focus:outline-none">
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-black">PraticaAí</span>
              </button>
              <nav className="space-y-3 flex-1">
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
            <div className="p-8 md:p-16 max-w-7xl mx-auto w-full">
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
