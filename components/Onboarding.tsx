
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
    <div className="max-w-xl w-full mx-auto p-10 bg-white rounded-[3rem] shadow-xl border border-slate-100 animate-in fade-in duration-700">
      <div className="mb-10">
        <div className="flex justify-between mb-3">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1.5 rounded-full flex-1 mx-1 transition-all duration-500 ${step >= s ? 'bg-indigo-600' : 'bg-slate-100'}`} />
          ))}
        </div>
        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Passo {step} de 4</span>
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-black leading-tight">Bem-vindo ao GLANCE</h1>
            <p className="text-slate-600 font-medium">Personalize sua experiência de aprendizado.</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> Endereço de Email
              </label>
              <input
                type="email"
                placeholder="ex: voce@email.com"
                className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white text-black font-bold focus:border-indigo-600 outline-none transition-all placeholder:text-slate-200"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Qual seu nível de inglês?</label>
              <div className="grid gap-2">
                {Object.values(EnglishLevel).map(level => (
                  <button
                    key={level}
                    onClick={() => setData({ ...data, level })}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${data.level === level ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-black' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
                  >
                    <span>{levelLabels[level]}</span>
                    {data.level === level && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={nextStep}
            className="w-full bg-black text-white p-5 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-black leading-tight">Qual seu objetivo?</h1>
            <p className="text-slate-600 font-medium">O conteúdo será adaptado para o seu contexto.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: Goal.TRAVEL, icon: <Plane className="w-8 h-8" />, label: goalLabels[Goal.TRAVEL] },
              { id: Goal.WORK, icon: <Briefcase className="w-8 h-8" />, label: goalLabels[Goal.WORK] },
              { id: Goal.STUDIES, icon: <GraduationCap className="w-8 h-8" />, label: goalLabels[Goal.STUDIES] },
              { id: Goal.CONVERSATION, icon: <MessageCircle className="w-8 h-8" />, label: goalLabels[Goal.CONVERSATION] },
            ].map(g => (
              <button
                key={g.id}
                onClick={() => { setData({ ...data, goal: g.id }); nextStep(); }}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] border-2 transition-all ${data.goal === g.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
              >
                <div className={`${data.goal === g.id ? 'text-indigo-600' : 'text-slate-200'}`}>{g.icon}</div>
                <span className="font-black text-sm">{g.label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="text-[10px] text-slate-400 hover:text-black font-black w-full text-center uppercase tracking-widest">Voltar</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <h1 className="text-3xl font-black text-black">Ajustes finais</h1>
          
          <div className="space-y-8">
            {data.goal === Goal.WORK && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Profissão</label>
                <input
                  type="text"
                  placeholder="ex: Software Engineer, Doctor"
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white text-black font-bold focus:border-indigo-600 outline-none"
                  value={data.profession || ''}
                  onChange={(e) => setData({ ...data, profession: e.target.value })}
                />
              </div>
            )}
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Dias de prática p/ semana</label>
                <span className="text-indigo-600 font-black text-lg">{data.weeklyFrequency} dias</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={data.weeklyFrequency}
                onChange={(e) => setData({ ...data, weeklyFrequency: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <button
            onClick={nextStep}
            className="w-full bg-black text-white p-5 rounded-2xl font-black hover:bg-slate-800 shadow-lg transition-all"
          >
            Continuar
          </button>
          <button onClick={() => setStep(2)} className="text-[10px] text-slate-400 hover:text-black font-black w-full text-center uppercase tracking-widest">Voltar</button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-black leading-tight">Configuração concluída</h1>
            <p className="text-slate-600 font-medium">Prepare-se para evoluir com o GLANCE.</p>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex items-start gap-5">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
               <Target className="w-6 h-6 text-white" />
             </div>
             <div>
                <p className="text-lg font-black text-black">Prática em espera</p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed font-medium">
                  Seu perfil está configurado para o nível {levelLabels[data.level || EnglishLevel.BEGINNER]}. Agora falta apenas criar seu primeiro ciclo.
                </p>
             </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            Acessar Painel
          </button>
          <button onClick={() => setStep(3)} className="text-[10px] text-slate-400 hover:text-black font-black w-full text-center uppercase tracking-widest">Voltar</button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
