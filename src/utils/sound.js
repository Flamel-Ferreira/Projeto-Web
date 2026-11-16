/**
 * Bipe curto do Pomodoro usando WebAudio, sem dependências externas.
 * O contexto é criado/retomado em um gesto do usuário (iniciar/pausar).
 */

let audioContext = null;

export function unlockAudio() {
  try {
    if (!audioContext) {
      const AudioContextClass =
        typeof window !== 'undefined' &&
        (window.AudioContext || window.webkitAudioContext);
      if (!AudioContextClass) return null;
      audioContext = new AudioContextClass();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
}

export function playChime() {
  try {
    const context = unlockAudio();
    if (!context) return;

    const now = context.currentTime;
    const notes = [880, 1174.66];

    notes.forEach((frequency, index) => {
      const start = now + index * 0.18;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.18);
    });
  } catch {
    // Bipe é opcional; falhas de áudio não interrompem o timer.
  }
}
