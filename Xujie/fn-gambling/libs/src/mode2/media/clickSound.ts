// export const clickSound: HTMLAudioElement = new Audio(`/button-2.mp3`);
export const clickSound: HTMLAudioElement = new Audio(
  import.meta.env['VITE_COUNTRY_CODE'] === 'IN' &&
  import.meta.env['VITE_V_VERSION'] === 'v6'
    ? '/button-6.mp3'
    : '/button-2.mp3'
);

clickSound.addEventListener('canplaythrough', () => {
  clickSound.play().catch((error) => {
    console.log('Failed to play:', error);
  });
});

clickSound.addEventListener('error', (e) => {
  console.log('Failed to load the audio file:', e);
});
