
import React from 'react';
import { Smartphone, Watch, Bell } from 'lucide-react';

interface NotificationPreviewProps {
  title: string;
  body: string;
  type: 'word' | 'sentence' | 'text';
}

const NotificationPreview: React.FC<NotificationPreviewProps> = ({ title, body, type }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-6 bg-slate-100 rounded-3xl border border-slate-200 shadow-inner">
      {/* Mobile Mockup */}
      <div className="relative w-64 h-[420px] bg-slate-900 rounded-[3rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center">
        <div className="w-24 h-5 bg-slate-800 rounded-b-xl mb-4"></div>
        <div className="w-full px-4 pt-12">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-white/20 animate-bounce-short">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">G</span>
              </div>
              <span className="text-xs font-semibold text-slate-800">GLANCE</span>
              <span className="text-[10px] text-slate-400 ml-auto">now</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">{title}</h4>
            <p className="text-sm text-slate-600 leading-tight">{body}</p>
          </div>
        </div>
      </div>

      {/* Smartwatch Mockup */}
      <div className="relative w-40 h-44 bg-slate-900 rounded-[2.5rem] border-[4px] border-slate-800 shadow-2xl flex flex-col items-center justify-center p-4">
        <div className="absolute -top-10 w-20 h-10 bg-slate-700 rounded-t-lg -z-10"></div>
        <div className="absolute -bottom-10 w-20 h-10 bg-slate-700 rounded-b-lg -z-10"></div>
        
        <div className="bg-white/10 backdrop-blur-md w-full h-full rounded-2xl p-3 flex flex-col items-start overflow-hidden border border-white/5">
           <div className="flex items-center gap-1 mb-1">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="text-[8px] text-white/60 font-medium">GLANCE</span>
           </div>
           <h4 className="text-[10px] font-bold text-white mb-1 line-clamp-1">{title}</h4>
           <p className="text-[10px] text-white/80 leading-tight line-clamp-3">{body}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreview;
