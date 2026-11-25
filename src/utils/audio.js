/**
 * Shared temple ambient sound controller
 * Plays Bhagvat_prasadam_mastered_1.wav when unmuted
 */

let audioInstance = null;

export function getTempleAudio() {
  if (typeof window === 'undefined') return null;
  if (!audioInstance) {
    audioInstance = new Audio('/Bhagvat_prasadam_mastered_1.wav');
    audioInstance.loop = true;
    audioInstance.preload = 'auto';
  }
  return audioInstance;
}

export function playTempleAudio() {
  const audio = getTempleAudio();
  if (!audio) return Promise.resolve(false);
  return audio
    .play()
    .then(() => true)
    .catch((err) => {
      console.warn('Temple audio play prevented:', err);
      return false;
    });
}

export function pauseTempleAudio() {
  const audio = getTempleAudio();
  if (audio) {
    audio.pause();
  }
}

export function isTempleAudioPlaying() {
  const audio = getTempleAudio();
  return Boolean(audio && !audio.paused && !audio.ended);
}
