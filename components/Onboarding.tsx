
import React, { useState } from 'react';
import { EnglishLevel, Goal, UserProfile } from '../types';
import { Check, Zap, User, GraduationCap, Calendar, Bell, Mail } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    level: EnglishLevel.BEGINNER,
    goal: Goal.CONVERSATION,
    language: 'pt',
    weeklyFrequency: 5,
    notificationsPerDay: 2,
    knownCommonWords: [],
  });

  const nextStep = () => {
    if (step === 1 && !data.name) return alert('Como podemos te chamar?');
    if (step === 2 && !data.email) return alert('Precisamos do seu email para criar sua conta.');
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-2xl w-full mx-auto p-10 md:p-16 bg-white rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-50 animate-in slide-in-from-bottom-4">
      <div className="mb-14">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4, 5, 6].map(s => (
            <div key={s} className={`h-1.5 rounded-full flex-1 mx-1 transition-all duration-500 ${step >= s ? 'bg-black' : 'bg-slate-100'}`} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Etapa {step} de 6</span>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Teste Grátis Ativo</span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="space-y-3">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <User className="text-indigo-600 w-7 h-7" />
            </div>
            <h1 className="text-4xl font-black text-black leading-tight tracking-tight">Primeiro, qual seu nome?</h1>
            <p className="text-lg text-slate-500 font-medium">Queremos tornar sua prática única.</p>
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Seu nome aqui..."
            className="w-full p-6 rounded-3xl border-2 border-slate-100 bg-slate-50 text-black text-xl font-bold focus:border-black focus:bg-white outline-none transition-all"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && nextStep()}
          />
          <button onClick={nextStep} className="w-full bg-black text-white p-6 rounded-3xl font-black text-xl hover:bg-slate-900 transition-all shadow-xl">
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="space-y-3">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="text-indigo-600 w-7 h-7" />
            </div>
            <h1 className="text-4xl font-black text-black leading-tight tracking-tight">E o seu melhor email?</h1>
            <p className="text-lg text-slate-500 font-medium">Para salvar seu progresso profissional.</p>
          </div>
          <input
            type="email"
            placeholder="Ex: profissional@email.com"
            className="w-full p-6 rounded-3xl border-2 border-slate-100 bg-slate-50 text-black text-xl font-bold focus:border-black focus:bg-white outline-none transition-all"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && nextStep()}
          />
          <div className="flex gap-4">
            <button onClick={prevStep} className="flex-1 border-2 border-slate-200 text-slate-500 p-6 rounded-3xl font-black text-xl">Voltar</button>
            <button onClick={nextStep} className="flex-[2] bg-black text-white p-6 rounded-3xl font-black text-xl hover:bg-slate-900 shadow-xl transition-all">Continuar</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="space-y-3">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap className="text-indigo-600 w-7 h-7" />
            </div>
            <h1 className="text-4xl font-black text-black leading-tight tracking-tight">Qual seu nível atual?</h1>
            <p className="text-lg text-slate-500 font-medium">Isso adapta a complexidade das frases que a IA gera.</p>
          </div>
          <div className="grid gap-3">
            {Object.values(EnglishLevel).map(level => (
              <button
                key={level}
                onClick={() => { setData({ ...data, level }); nextStep(); }}
                className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${data.level === level ? 'border-black bg-black text-white' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'}`}
              >
                <span className="text-lg font-bold">{level === EnglishLevel.BEGINNER ? 'Iniciante' : level === EnglishLevel.INTERMEDIATE ? 'Intermediário' : 'Avançado'}</span>
                {data.level === level && <Check className="w-6 h-6" />}
              </button>
            ))}
          </div>
          <button onClick={prevStep} className="w-full text-slate-400 font-bold p-2">Voltar</button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="space-y-3">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="text-indigo-600 w-7 h-7" />
            </div>
            <h1 className="text-4xl font-black text-black leading-tight tracking-tight">Frequência Semanal</h1>
            <p className="text-lg text-slate-500 font-medium">Quantos dias por semana você quer praticar?</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[3, 4, 5, 7].map(f => (
              <button
                key={f}
                onClick={() => { setData({ ...data, weeklyFrequency: f }); nextStep(); }}
                className={`p-8 rounded-3xl border-2 transition-all ${data.weeklyFrequency === f ? 'border-black bg-black text-white' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'}`}
              >
                <div className="text-3xl font-black">{f}</div>
                <div className="text-xs font-bold uppercase tracking-widest mt-1">Dias</div>
              </button>
            ))}
          </div>
          <button onClick={prevStep} className="w-full text-slate-400 font-bold p-2">Voltar</button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="space-y-3">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <Bell className="text-indigo-600 w-7 h-7" />
            </div>
            <h1 className="text-4xl font-black text-black leading-tight tracking-tight">Notificações Diárias</h1>
            <p className="text-lg text-slate-500 font-medium">Quantas vezes por dia quer o "PraticaAí" te chamando?</p>
          </div>
          <div className="grid gap-3">
            {[1, 2, 3, 5].map(n => (
              <button
                key={n}
                onClick={() => { setData({ ...data, notificationsPerDay: n }); nextStep(); }}
                className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${data.notificationsPerDay === n ? 'border-black bg-black text-white' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'}`}
              >
                <span className="text-lg font-bold">{n}x por dia</span>
                {data.notificationsPerDay === n && <Check className="w-6 h-6" />}
              </button>
            ))}
          </div>
          <button onClick={prevStep} className="w-full text-slate-400 font-bold p-2">Voltar</button>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-12 animate-in fade-in duration-500 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl animate-bounce-short">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black text-black tracking-tight leading-tight">Tudo pronto, {data.name}!</h1>
            <p className="text-xl text-slate-600 font-medium max-w-sm mx-auto">Seu teste de 2 dias começou agora. Bora dominar o inglês?</p>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-left">
             <div className="flex items-center gap-3 mb-4">
                <Check className="text-green-500 w-6 h-6" />
                <p className="font-bold text-black">Acesso Grátis Liberado</p>
             </div>
             <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Você receberá notificações baseadas nos seus ciclos. Experimente o poder da prática passiva por 48 horas.
             </p>
          </div>

          <button
            onClick={() => onComplete(data as UserProfile)}
            className="w-full bg-black text-white p-7 rounded-3xl font-black text-2xl hover:bg-slate-900 shadow-2xl transition-all active:scale-95"
          >
            Entrar no Painel
          </button>
          <p className="text-xs text-slate-400 font-medium">Ao clicar, você concorda com nossos termos de uso profissional.</p>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
