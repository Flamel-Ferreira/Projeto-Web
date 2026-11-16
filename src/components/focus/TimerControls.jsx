import { Pause, Play, RotateCcw } from 'lucide-react';
import Button from '../ui/Button.jsx';
import IconButton from '../ui/IconButton.jsx';

export default function TimerControls({ isRunning, onStart, onPause, onReset }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        size="lg"
        icon={isRunning ? Pause : Play}
        onClick={isRunning ? onPause : onStart}
        className="min-w-[150px]"
      >
        {isRunning ? 'Pausar' : 'Iniciar'}
      </Button>

      <IconButton
        icon={RotateCcw}
        label="Reiniciar timer"
        variant="secondary"
        size="lg"
        onClick={onReset}
      />
    </div>
  );
}
