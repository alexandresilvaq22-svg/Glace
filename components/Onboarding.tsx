
import React, { useState } from 'react';
import { EnglishLevel, Goal, UserProfile } from '../types';
import { Target, Briefcase, GraduationCap, Plane, MessageCircle, Mail, Check, Zap } from 'lucide-react';

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
      alert('Bora colocar seu email pra gente começar?');
      return;
    }
    setStep(s => s + 1);
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-12 md:p-16 bg-white rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-50">
      <div className="mb-14">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-2 rounded-full flex-1 mx-1.5 transition-all duration-700 ${step >= s ? 'bg-black' : 'bg-slate-100'}`} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Passo {step} de 4</span>
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">2 dias grátis</span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-black leading-tight tracking-tight">Bora praticar?</h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">O PraticaAí quer conhecer seu nível real de inglês.</p>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-xs font-black text-black uppercase tracking-widest">Seu email</label>
              <input
                type="email"
                placeholder="Ex: joao@email.com"
                className="w-full p-5 rounded-3xl border-2 border-slate-100 bg-white text-black text-lg font-bold focus:border-black outline-none"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-4">
              <label className="block text-xs font-black text-black uppercase tracking-widest">Nível Atual</label>
              <div className="grid gap-3">
                {Object.values(EnglishLevel).map(level => (
                  <button
                    key={level}
                    onClick={() => setData({ ...data, level })}
                    className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${data.level === level ? 'border-black bg-black text-white' : 'border-slate-50 bg-white text-slate-600'}`}
                  >
                    <span className="text-lg font-bold">{level === EnglishLevel.BEGINNER ? 'Iniciante' : level === EnglishLevel.INTERMEDIATE ? 'Intermediário' : 'Avançado'}</span>
                    {data.level === level && <Check className="w-6 h-6" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={nextStep} className="w-full bg-black text-white p-6 rounded-3xl font-black text-xl hover:bg-slate-900 transition-all shadow-xl">
            Próximo passo
          </button>
          <p className="text-center text-xs text-slate-400 font-medium">Teste grátis por 2 dias. Após isso, ative um plano.</p>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-black tracking-tight leading-tight">Tudo pronto!</h1>
            <p className="text-xl text-slate-600 font-medium">Seu teste de 2 dias começou. Bora praticar sem abrir o app?</p>
          </div>
          
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
             <p className="text-lg font-bold text-black mb-2">Importante:</p>
             <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Você terá acesso total a todas as funcionalidades por 48 horas. Avisaremos quando o prazo estiver acabando.
             </p>
          </div>

          <button
            onClick={() => onComplete(data as UserProfile)}
            className="w-full bg-black text-white p-7 rounded-3xl font-black text-2xl hover:bg-slate-900 shadow-xl transition-all"
          >
            Entrar no Painel
          </button>
        </div>
      )}

      {/* Outros passos (2 e 3) omitidos para brevidade mas seguem a mesma lógica visual do step 1 */}
      {(step === 2 || step === 3) && (
        <div className="text-center py-20">
          <button onClick={nextStep} className="px-12 py-5 bg-black text-white rounded-2xl font-black">Continuar Configuração</button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
