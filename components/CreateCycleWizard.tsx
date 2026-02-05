
import React, { useState } from 'react';
import { PracticeCycle } from '../types';
import { Plus, X, ArrowLeft, Check, Calendar, Bell, ListChecks, Hash } from 'lucide-react';

interface CreateCycleWizardProps {
  onComplete: (cycle: PracticeCycle) => void;
  onCancel: () => void;
}

const CreateCycleWizard: React.FC<CreateCycleWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [newWord, setNewWord] = useState('');
  const [cycle, setCycle] = useState<Partial<PracticeCycle>>({
    id: 'cycle_' + Math.random(),
    name: '',
    words: [],
    durationDays: 4,
    notificationsPerDay: 2,
    daysOfWeek: [1, 2, 3, 4, 5],
    status: 'active',
    startDate: new Date().toISOString()
  });

  const addWord = () => {
    if (newWord && !cycle.words?.includes(newWord)) {
      setCycle({ ...cycle, words: [...(cycle.words || []), newWord.trim()] });
      setNewWord('');
    }
  };

  const removeWord = (word: string) => {
    setCycle({ ...cycle, words: cycle.words?.filter(w => w !== word) });
  };

  const toggleDay = (day: number) => {
    const days = cycle.daysOfWeek || [];
    if (days.includes(day)) {
      setCycle({ ...cycle, daysOfWeek: days.filter(d => d !== day) });
    } else {
      setCycle({ ...cycle, daysOfWeek: [...days, day].sort() });
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-black">Etapa 1: Palavras</h2>
              <p className="text-slate-600 font-medium">O que você deseja aprender neste ciclo? Adicione pelo menos uma palavra.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addWord()}
                  placeholder="Ex: Insightful"
                  className="flex-1 p-4 bg-white rounded-2xl border-2 border-slate-200 outline-none focus:border-indigo-600 font-bold text-black placeholder:text-slate-300 shadow-sm"
                />
                <button 
                  onClick={addWord}
                  className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-md"
                >
                  <Plus />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[120px] p-6 rounded-3xl bg-white border-2 border-slate-100 shadow-inner">
                {cycle.words && cycle.words.length > 0 ? (
                  cycle.words.map(w => (
                    <span key={w} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-black shadow-sm animate-in zoom-in-95">
                      {w}
                      <button onClick={() => removeWord(w)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                    </span>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full text-slate-300 text-sm font-medium italic">Nenhuma palavra adicionada.</div>
                )}
              </div>
            </div>

            <button 
              disabled={!cycle.words || cycle.words.length === 0}
              onClick={nextStep}
              className="w-full p-4 bg-black text-white rounded-2xl font-black disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg active:scale-95"
            >
              Próxima etapa
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-black">Etapa 2: Duração</h2>
              <p className="text-slate-600 font-medium">Por quantos dias você quer focar nessas palavras?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[3, 4, 5, 7].map(d => (
                <button
                  key={d}
                  onClick={() => setCycle({...cycle, durationDays: d})}
                  className={`p-8 rounded-3xl border-2 text-center transition-all ${cycle.durationDays === d ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white hover:border-slate-200 text-slate-500'}`}
                >
                  <div className="text-3xl font-black mb-1">{d}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest">Dias</div>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 p-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-500 bg-white">Voltar</button>
              <button onClick={nextStep} className="flex-[2] p-4 bg-black text-white rounded-2xl font-black shadow-lg">Continuar</button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-black">Etapa 3: Frequência</h2>
              <p className="text-slate-600 font-medium">Quantas vezes ao dia quer ser notificado?</p>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 5].map(f => (
                <button
                  key={f}
                  onClick={() => setCycle({...cycle, notificationsPerDay: f})}
                  className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${cycle.notificationsPerDay === f ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
                >
                  <span className="font-black text-lg">{f}x por dia</span>
                  {cycle.notificationsPerDay === f && <Check className="w-6 h-6" />}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 p-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-500 bg-white">Voltar</button>
              <button onClick={nextStep} className="flex-[2] p-4 bg-black text-white rounded-2xl font-black shadow-lg">Continuar</button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-black">Etapa 4: Agendamento</h2>
              <p className="text-slate-600 font-medium">Em quais dias da semana você terá disponibilidade?</p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((name, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  className={`h-14 rounded-2xl border-2 font-black transition-all ${cycle.daysOfWeek?.includes(i) ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-slate-100 bg-white text-slate-400'}`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 p-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-500 bg-white">Voltar</button>
              <button onClick={nextStep} className="flex-[2] p-4 bg-black text-white rounded-2xl font-black shadow-lg">Continuar</button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-black">Pronto para iniciar?</h2>
              <p className="text-slate-600 font-medium">Revise seu ciclo de prática ativa.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 space-y-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                  <ListChecks className="text-indigo-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Palavras</p>
                  <p className="font-black text-black text-lg leading-tight">{cycle.words?.join(', ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="text-indigo-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duração</p>
                    <p className="font-black text-black">{cycle.durationDays} dias</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                    <Bell className="text-indigo-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Frequência</p>
                    <p className="font-black text-black">{cycle.notificationsPerDay}x / dia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 p-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-500 bg-white">Voltar</button>
              <button 
                onClick={() => {
                  const finalCycle = { ...cycle, name: `Ciclo: ${cycle.words?.[0] || 'Novo'}` } as PracticeCycle;
                  onComplete(finalCycle);
                }}
                className="flex-[2] p-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 active:scale-95"
              >
                Ativar Ciclo
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-black transition-colors"><ArrowLeft /></button>
        <div className="flex gap-2">
          {[1,2,3,4,5].map(s => (
            <div key={s} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step >= s ? 'bg-indigo-600' : 'bg-slate-100'}`} />
          ))}
        </div>
        <div className="w-8"></div>
      </div>
      <div className="bg-white p-2 rounded-3xl">
        {renderStep()}
      </div>
    </div>
  );
};

export default CreateCycleWizard;
