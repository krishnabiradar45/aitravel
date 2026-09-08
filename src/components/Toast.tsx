import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-xl text-sm font-medium animate-slide-up pointer-events-auto
            ${t.type === 'success' ? 'bg-[#1F3A5F] text-white' : t.type === 'error' ? 'bg-[#C8472A] text-white' : 'bg-white text-[#1F3A5F] border border-[#D4D0C8]'}`}
        >
          {t.type === 'success' && <span>✓</span>}
          {t.type === 'error' && <span>✕</span>}
          {t.type === 'info' && <span>ℹ</span>}
          {t.message}
        </div>
      ))}
    </div>
  );
}
