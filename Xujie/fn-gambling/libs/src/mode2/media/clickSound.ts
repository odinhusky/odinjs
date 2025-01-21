export const clickSound: HTMLAudioElement = new Audio(`/button-2.mp3`);

clickSound.addEventListener('canplaythrough', () => {
  clickSound.play().catch((error) => {
    console.log('Failed to play:', error);
  });
});

clickSound.addEventListener('error', (e) => {
  console.log('Failed to load the audio file:', e);
});
