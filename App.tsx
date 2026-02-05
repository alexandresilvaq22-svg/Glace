
import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserProfile, PracticeCycle, NotificationContent, EnglishLevel, Goal } from './types';
import Onboarding from './components/Onboarding';
import NotificationPreview from './components/NotificationPreview';
import { 
  Bell, 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  PlusCircle, 
  History as HistoryIcon, 
  LogOut,
  Clock,
  CheckCircle2,
  Calendar,
  BookOpen,
  User,
  Shield,
  Smartphone,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('onboarding');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cycles, setCycles] = useState<PracticeCycle[]>([]);
  const [notifications, setNotifications] = useState<NotificationContent[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const notificationCenterRef = useRef<HTMLDivElement>(null);

  // Dados fictícios para demonstração
  const mockHistory: PracticeCycle[] = [
    { id: 'h1', userId: 'user_1', name: 'Vocabulário de Reuniões', words: ['Schedule', 'Deadline', 'Feedback'], durationDays: 4, daysOfWeek: [1,2,3,4], status: 'completed', startDate: '2023-10-01' },
    { id: 'h2', userId: 'user_1', name: 'Inglês para Viagem', words: ['Boarding', 'Gate', 'Luggage'], durationDays: 4, daysOfWeek: [1,2,3,4], status: 'completed', startDate: '2023-09-15' },
  ];

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
    setUser({ ...profile, id: profile.id || 'user_1' });
    setView('dashboard');
    
    const initialCycle: PracticeCycle = {
      id: 'cycle_1',
      userId: 'user_1',
      name: 'Básicos Essenciais',
      words: ['Productive', 'Goal', 'Process', 'Feedback'],
      durationDays: 4,
      daysOfWeek: [1, 2, 3, 4, 5],
      status: 'active',
      startDate: new Date().toISOString(),
    };
    setCycles([initialCycle]);

    setNotifications([
      {
        id: 'notif_1',
        cycleId: 'cycle_1',
        dayNumber: 1,
        title: 'Nova Palavra: Productive',
        body: 'Adjetivo: Produzindo uma quantidade significativa de resultado.',
        timestamp: new Date().toISOString(),
        type: 'word'
      },
      {
        id: 'notif_0',
        cycleId: 'cycle_1',
        dayNumber: 0,
        title: 'Bem-vindo ao GLANCE!',
        body: 'Seu primeiro ciclo começou. Prepare-se para as notificações!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'text'
      }
    ]);
  };

  const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
    </button>
  );

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-900">
      <header className="flex items-center justify-between relative">
        <div>
          <h2 className="text-3xl font-bold">Olá, {user?.email?.split('@')[0] || 'Explorador'}!</h2>
          <p className="text-slate-500">Seu inglês está melhorando a cada minuto.</p>
        </div>
        
        <div className="relative" ref={notificationCenterRef}>
          <button 
            onClick={() => setShowNotificationCenter(!showNotificationCenter)}
            className={`relative p-2 rounded-full transition-all ${showNotificationCenter ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'}`}
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {showNotificationCenter && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h4 className="font-bold text-slate-900">Notificações</h4>
                <button onClick={() => setShowNotificationCenter(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                          <Bell className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-2">{n.body}</p>
                          <p className="text-[10px] text-slate-300 font-medium">Hoje às {new Date(n.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Nenhuma notificação nova.</p>
                  </div>
                )}
              </div>
              <div className="p-3 text-center bg-slate-50">
                <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Ver todas</button>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Ciclo Atual</h3>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase">Dia 1/4</span>
          </div>
          {cycles.filter(c => c.status === 'active').map(c => (
            <div key={c.id}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-slate-600">{c.name}</span>
                <span className="text-sm font-bold text-indigo-600">25%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-indigo-600 rounded-full w-1/4" />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Palavras Ativas</p>
                <div className="flex flex-wrap gap-2">
                  {c.words.map(w => (
                    <span key={w} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700">{w}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl shadow-lg text-white">
          <h3 className="font-bold text-lg mb-6">Estatísticas de Prática</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-white/60 text-xs mb-1">Total de Palavras</p>
              <p className="text-2xl font-bold">128</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-white/60 text-xs mb-1">Sequência Atual</p>
              <p className="text-2xl font-bold text-orange-400">12 dias</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 col-span-2">
              <p className="text-white/60 text-xs mb-2">Meta Semanal ({user?.weeklyFrequency || 5} dias)</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(d => (
                  <div key={d} className={`h-8 flex-1 rounded-md flex items-center justify-center ${d <= 4 ? 'bg-indigo-500' : 'bg-white/10 text-white/40'}`}>
                    {d <= 4 ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px]">{['S','T','Q','Q','S','S','D'][d-1]}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
         <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl">Fluxo de Notificações</h3>
          <span className="text-sm text-slate-500 flex items-center gap-1"><Clock className="w-4 h-4" /> Prévia Visual</span>
        </div>
        <div className="grid md:grid-cols-1 gap-8">
          {notifications.length > 0 && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 border-l-4 border-indigo-600 rounded-r-xl">
                <p className="text-sm text-indigo-900 font-medium">Isso é o que aparecerá nos seus dispositivos hoje.</p>
              </div>
              <NotificationPreview title={notifications[0].title} body={notifications[0].body} type={notifications[0].type} />
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderCreateCycle = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Criar Novo Ciclo</h2>
        <p className="text-slate-500">Defina as palavras que deseja dominar nos próximos 4 dias.</p>
      </div>
      
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Ciclo</label>
          <input 
            type="text" 
            placeholder="Ex: Vocabulário de Design" 
            className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-indigo-600 transition-all bg-white text-slate-900 placeholder:text-slate-300 shadow-sm" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Adicionar Palavras (separadas por vírgula)</label>
          <textarea 
            rows={3} 
            placeholder="Focus, Consistency, Leverage..." 
            className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-indigo-600 transition-all bg-white text-slate-900 placeholder:text-slate-300 shadow-sm" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Duração (Dias)</label>
            <select className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium">
              <option>4 dias (Recomendado)</option>
              <option>7 dias</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Intensidade</label>
            <select className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium">
              <option>Moderada (2 notif/dia)</option>
              <option>Intensa (5 notif/dia)</option>
            </select>
          </div>
        </div>

        <button className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">
          Ativar Ciclo
        </button>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <h2 className="text-3xl font-bold text-slate-900">Histórico de Ciclos</h2>
      
      <div className="grid gap-4">
        {mockHistory.map(h => (
          <div key={h.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition-all cursor-pointer">
            <div className="flex items-center gap-4 text-slate-900">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">{h.name}</h4>
                <p className="text-xs text-slate-400">{h.words.join(' • ')}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">Concluído</span>
              <p className="text-[10px] text-slate-400 mt-1">{new Date(h.startDate).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900">Configurações</h2>
      
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">Perfil do Usuário</span>
            </div>
            <span className="text-xs text-slate-400">{user?.email}</span>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">Preferências de Notificação</span>
            </div>
            <span className="text-xs text-indigo-600 font-bold">Ativadas</span>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">Segurança e Privacidade</span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between cursor-pointer group hover:bg-red-100 transition-colors">
          <div className="flex items-center gap-3 text-red-600">
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Encerrar Sessão</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {view !== 'onboarding' && (
        <aside className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col hidden md:flex sticky top-0 h-screen">
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">G</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">GLANCE</span>
          </div>

          <nav className="space-y-1 flex-1">
            <SidebarItem icon={LayoutDashboard} label="Painel" active={view === 'dashboard'} onClick={() => { setView('dashboard'); setShowNotificationCenter(false); }} />
            <SidebarItem icon={PlusCircle} label="Novo Ciclo" active={view === 'create-cycle'} onClick={() => { setView('create-cycle'); setShowNotificationCenter(false); }} />
            <SidebarItem icon={HistoryIcon} label="Histórico" active={view === 'history'} onClick={() => { setView('history'); setShowNotificationCenter(false); }} />
            <SidebarItem icon={SettingsIcon} label="Configurações" active={view === 'settings'} onClick={() => { setView('settings'); setShowNotificationCenter(false); }} />
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-6">
            <SidebarItem icon={LogOut} label="Sair" onClick={() => setView('onboarding')} />
          </div>
        </aside>
      )}

      <main className="flex-1 overflow-y-auto">
        {view === 'onboarding' ? (
          <div className="py-12 px-4">
             <div className="flex items-center justify-center gap-2 mb-12">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white text-xl font-black">G</span>
              </div>
              <span className="text-3xl font-black tracking-tighter text-slate-900">GLANCE</span>
            </div>
            <Onboarding onComplete={handleOnboardingComplete} />
          </div>
        ) : (
          <div className="p-4 md:p-10 max-w-5xl mx-auto space-y-8">
            {view === 'dashboard' && renderDashboard()}
            {view === 'create-cycle' && renderCreateCycle()}
            {view === 'history' && renderHistory()}
            {view === 'settings' && renderSettings()}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
