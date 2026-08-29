import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 size={32} className="text-cyan-accent-400 animate-spin" />
      <span className="text-sm text-gray-400">{text}</span>
    </div>
  );
}
