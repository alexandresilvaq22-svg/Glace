
import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserProfile, PracticeCycle, NotificationContent, EnglishLevel, Goal } from './types';
import Onboarding from './components/Onboarding';
import NotificationPreview from './components/NotificationPreview';
import CreateCycleWizard from './components/CreateCycleWizard';
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
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('welcome');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cycles, setCycles] = useState<PracticeCycle[]>([]);
  const [notifications, setNotifications] = useState<NotificationContent[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const notificationCenterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationCenterRef.current && !notificationCenterRef.current.contains(event.target as Node)) {
        setShowNotificationCenter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser({ ...profile, id: 'user_' + Math.random().toString(36).substr(2, 9) });
    setView('dashboard');
  };

  const handleCreateCycle = (newCycle: PracticeCycle) => {
    setCycles([...cycles, newCycle]);
    const firstNotif: NotificationContent = {
      id: 'notif_' + Math.random(),
      cycleId: newCycle.id,
      dayNumber: 1,
      title: `Ciclo Ativado: ${newCycle.name}`,
      body: `Prepare-se! Você receberá ${newCycle.notificationsPerDay} notificações por dia.`,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setNotifications([firstNotif, ...notifications]);
    setView('dashboard');
  };

  const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
    </button>
  );

  const renderWelcome = () => (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in duration-700 overflow-x-hidden">
      <div className="max-w-5xl w-full flex flex-col items-center text-center space-y-12 md:space-y-16">
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-100">
            <span className="text-white text-4xl font-black">G</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black text-black tracking-tight leading-[1.05]">
              Pratique inglês todos os dias <br/>
              <span className="text-indigo-600">sem precisar abrir o app.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed">
              O GLANCE transforma notificações em aprendizado contínuo. Pratique no celular ou smartwatch com o mínimo esforço.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {[
            { icon: Bell, title: "Foco em Notificações", desc: "Aprenda pela tela de bloqueio, sem interromper seu dia." },
            { icon: Zap, title: "Inteligência de Ciclos", desc: "Evolução progressiva de 4 dias para fixação real do conteúdo." },
            { icon: Target, title: "Personalização IA", desc: "Vocabulário adaptado para sua profissão e objetivos reais." }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 text-left space-y-4 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center transition-colors group-hover:bg-indigo-600">
                <item.icon className="w-6 h-6 text-indigo-600 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-bold text-black text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center pt-8">
          <button 
            onClick={() => setView('onboarding')}
            className="group px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
          >
            Começar agora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-10 py-5 bg-white text-black border-2 border-slate-200 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all">
            Já tenho conta
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const activeCycle = cycles.find(c => c.status === 'active');

    return (
      <div className="space-y-8 animate-in fade-in duration-500 text-black">
        <header className="flex items-center justify-between relative">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-black">Olá, {user?.email?.split('@')[0] || 'Explorador'}!</h2>
            <p className="text-slate-600 font-medium">Sua prática passiva está configurada.</p>
          </div>
          
          <div className="relative" ref={notificationCenterRef}>
            <button 
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className={`relative p-3 rounded-2xl border transition-all ${showNotificationCenter ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600'}`}
            >
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {showNotificationCenter && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 origin-top-right animate-in zoom-in-95">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white">
                  <h4 className="font-bold text-black">Avisos</h4>
                  <button onClick={() => setShowNotificationCenter(false)} className="p-1 hover:bg-slate-100 rounded-full">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                            <Bell className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-black">{n.title}</p>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{n.body}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase mt-1">Agora</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center">
                      <p className="text-sm font-medium text-slate-400 italic">Sem notificações recentes.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {!activeCycle ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center space-y-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
              <PlusCircle className="w-12 h-12 text-slate-300" />
            </div>
            <div className="max-w-md space-y-3">
              <h3 className="text-3xl font-black text-black tracking-tight">Comece sua prática</h3>
              <p className="text-slate-600 font-medium text-lg">Crie seu primeiro ciclo de palavras para começar a receber notificações personalizadas.</p>
            </div>
            <button 
              onClick={() => setView('create-cycle')}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
              Criar primeiro ciclo
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-2xl text-black">Ciclo Ativo</h3>
                <span className="px-5 py-2 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full uppercase tracking-widest">Dia 1/{activeCycle.durationDays}</span>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{activeCycle.name}</span>
                    <span className="text-sm font-black text-indigo-600">Em progresso</span>
                  </div>
                  <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full bg-indigo-600 rounded-full w-[10%]" />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Vocabulário selecionado</p>
                  <div className="flex flex-wrap gap-2">
                    {activeCycle.words.map(w => (
                      <span key={w} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-black shadow-sm">{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white flex flex-col justify-between">
              <div className="relative z-10">
                <h3 className="font-black text-2xl mb-10 tracking-tight">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <p className="text-white/40 text-[11px] font-black uppercase tracking-widest mb-2">Palavras</p>
                    <p className="text-5xl font-black">0</p>
                  </div>
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <p className="text-white/40 text-[11px] font-black uppercase tracking-widest mb-2">Dias</p>
                    <p className="text-5xl font-black text-indigo-400">1</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] font-black text-white/40 uppercase tracking-widest mb-5">
                  <span>Prática Diária</span>
                  <span className="text-indigo-400">{activeCycle.notificationsPerDay}x / dia</span>
                </div>
                <div className="flex gap-3">
                  {Array.from({length: 7}).map((_, i) => (
                    <div key={i} className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full bg-indigo-500 ${i === 0 ? 'w-full' : 'w-0'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {view === 'welcome' ? (
        renderWelcome()
      ) : (
        <div className="flex min-h-screen">
          {view !== 'onboarding' && (
            <aside className="w-80 border-r border-slate-200 bg-white p-10 flex flex-col hidden lg:flex sticky top-0 h-screen shrink-0">
              <div className="flex items-center gap-4 mb-14">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <span className="text-white font-black text-2xl tracking-tighter">G</span>
                </div>
                <span className="text-2xl font-black tracking-tighter text-black">GLANCE</span>
              </div>

              <nav className="space-y-2 flex-1">
                <SidebarItem icon={LayoutDashboard} label="Painel de Controle" active={view === 'dashboard'} onClick={() => { setView('dashboard'); setShowNotificationCenter(false); }} />
                <SidebarItem icon={PlusCircle} label="Criar Novo Ciclo" active={view === 'create-cycle'} onClick={() => { setView('create-cycle'); setShowNotificationCenter(false); }} />
                <SidebarItem icon={HistoryIcon} label="Histórico" active={view === 'history'} onClick={() => { setView('history'); setShowNotificationCenter(false); }} />
                <SidebarItem icon={SettingsIcon} label="Configurações" active={view === 'settings'} onClick={() => { setView('settings'); setShowNotificationCenter(false); }} />
              </nav>

              <div className="mt-auto border-t border-slate-100 pt-10">
                <SidebarItem icon={LogOut} label="Desconectar" onClick={() => setView('welcome')} />
              </div>
            </aside>
          )}

          <main className="flex-1 bg-white relative">
            {view === 'onboarding' ? (
              <div className="min-h-screen w-full flex items-center justify-center p-6">
                <Onboarding onComplete={handleOnboardingComplete} />
              </div>
            ) : (
              <div className="p-6 md:p-12 lg:p-20 max-w-7xl mx-auto w-full">
                {view === 'dashboard' && renderDashboard()}
                {view === 'create-cycle' && <CreateCycleWizard onComplete={handleCreateCycle} onCancel={() => setView('dashboard')} />}
                {view === 'history' && (
                   <div className="text-center py-40 bg-white rounded-[4rem] border border-slate-100">
                     <HistoryIcon className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                     <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">O histórico aparecerá aqui em breve.</p>
                   </div>
                )}
                {view === 'settings' && (
                   <div className="text-center py-40 bg-white rounded-[4rem] border border-slate-100">
                     <SettingsIcon className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                     <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">Gerencie suas notificações e conta.</p>
                   </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
