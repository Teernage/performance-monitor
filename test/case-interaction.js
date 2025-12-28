// 1. Interaction (FID / INP)
const btnInteraction = document.getElementById('btn-interaction');
if (btnInteraction) {
  btnInteraction.addEventListener('click', () => {
    window.log('Interaction button clicked.');
    const start = performance.now();
    // Simulate a small delay to ensure it registers as an interaction
    while (performance.now() - start < 20) {
      /* busy wait 20ms */
    }
  });
}
