
import React, { useState } from 'react';
import { EnglishLevel, Goal, UserProfile } from '../types';
import { Target, Briefcase, GraduationCap, Plane, MessageCircle, Mail, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<UserProfile>>({
    email: '',
    level: EnglishLevel.BEGINNER,
    goal: Goal.CONVERSATION,
    language: 'pt',
    weeklyFrequency: 5,
    knownCommonWords: [],
  });

  const nextStep = () => {
    if (step === 1 && !data.email) {
      alert('Por favor, insira seu email para continuar.');
      return;
    }
    setStep(s => s + 1);
  };

  const handleComplete = () => {
    onComplete(data as UserProfile);
  };

  const levelLabels = {
    [EnglishLevel.BEGINNER]: 'Iniciante',
    [EnglishLevel.INTERMEDIATE]: 'Intermediário',
    [EnglishLevel.ADVANCED]: 'Avançado',
  };

  const goalLabels = {
    [Goal.TRAVEL]: 'Viagem',
    [Goal.WORK]: 'Trabalho',
    [Goal.STUDIES]: 'Estudos',
    [Goal.CONVERSATION]: 'Conversação',
  };

  return (
    <div className="max-w-xl mx-auto mt-4 p-8 bg-white rounded-3xl shadow-2xl border border-slate-100">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1.5 rounded-full flex-1 mx-1 transition-all duration-500 ${step >= s ? 'bg-indigo-600' : 'bg-slate-100'}`} />
          ))}
        </div>
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Passo {step} de 4</span>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Bem-vindo ao GLANCE</h1>
            <p className="text-slate-500 text-sm">Sua prática de inglês baseada em notificações.</p>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3 h-3" /> Endereço de Email
              </label>
              <input
                type="email"
                placeholder="nome@email.com"
                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:ring-0 outline-none bg-white text-slate-900 font-medium transition-all placeholder:text-slate-300"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Qual seu nível atual de inglês?</label>
              <div className="grid gap-2">
                {Object.values(EnglishLevel).map(level => (
                  <button
                    key={level}
                    onClick={() => setData({ ...data, level })}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${data.level === level ? 'border-indigo-600 bg-indigo-50 shadow-sm text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                  >
                    <span className="font-bold">{levelLabels[level]}</span>
                    {data.level === level && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={nextStep}
            className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Qual seu objetivo principal?</h1>
            <p className="text-slate-500 text-sm">Vamos adaptar o contexto às suas necessidades.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: Goal.TRAVEL, icon: <Plane className="w-6 h-6" />, label: goalLabels[Goal.TRAVEL] },
              { id: Goal.WORK, icon: <Briefcase className="w-6 h-6" />, label: goalLabels[Goal.WORK] },
              { id: Goal.STUDIES, icon: <GraduationCap className="w-6 h-6" />, label: goalLabels[Goal.STUDIES] },
              { id: Goal.CONVERSATION, icon: <MessageCircle className="w-6 h-6" />, label: goalLabels[Goal.CONVERSATION] },
            ].map(g => (
              <button
                key={g.id}
                onClick={() => { setData({ ...data, goal: g.id }); nextStep(); }}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 transition-all ${data.goal === g.id ? 'border-indigo-600 bg-indigo-50 shadow-md text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
              >
                <div className={`${data.goal === g.id ? 'text-indigo-600' : 'text-slate-300'}`}>{g.icon}</div>
                <span className="font-bold text-sm">{g.label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-slate-600 font-bold w-full text-center uppercase tracking-widest">Voltar</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Personalização</h1>
          
          <div className="space-y-6">
            {data.goal === Goal.WORK && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Qual sua profissão?</label>
                <input
                  type="text"
                  placeholder="ex: Engenheiro, Designer"
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:ring-0 outline-none bg-white text-slate-900 font-medium transition-all"
                  value={data.profession || ''}
                  onChange={(e) => setData({ ...data, profession: e.target.value })}
                />
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Frequência de prática semanal</label>
                <span className="text-indigo-600 font-black text-sm">{data.weeklyFrequency} dias</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={data.weeklyFrequency}
                onChange={(e) => setData({ ...data, weeklyFrequency: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                <span>Baixa</span>
                <span>Diária</span>
              </div>
            </div>
          </div>

          <button
            onClick={nextStep}
            className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
          >
            Continuar
          </button>
          <button onClick={() => setStep(2)} className="text-xs text-slate-400 hover:text-slate-600 font-bold w-full text-center uppercase tracking-widest">Voltar</button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">Tudo pronto!</h1>
            <p className="text-slate-500 text-sm">O GLANCE enviará lembretes discretos para manter seu contato com o idioma.</p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
               <Target className="w-5 h-5 text-white" />
             </div>
             <div>
                <p className="text-sm font-black text-slate-900">Ciclo Inicial</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Focaremos em vocabulário para {goalLabels[data.goal || Goal.CONVERSATION]} no nível {levelLabels[data.level || EnglishLevel.BEGINNER]}.
                </p>
             </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            Começar Agora
          </button>
          <button onClick={() => setStep(3)} className="text-xs text-slate-400 hover:text-slate-600 font-bold w-full text-center uppercase tracking-widest">Voltar</button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
