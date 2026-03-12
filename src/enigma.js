const SPEECHES = [
  "You've entered the core. Solve my riddles to learn who I am.",
  "Hmm... not quite. Think differently.",
  "Closer than you think. Try again.",
  "CORRECT. Another file unlocked.",
  "Impressive. Keep going.",
  "All files decrypted. Identity confirmed.",
];

let score = 0;
const total = 5;

function checkAnswer(idx) {
  const input = document.querySelector(`.enigma-input[data-idx="${idx}"]`);
  const btn   = document.querySelector(`.enigma-btn[data-check="${idx}"]`);
  const hint  = document.getElementById(`hint-${idx}`);
  const row   = document.getElementById(`enigma-${idx}`);

  if (!input || !btn || input.disabled) return;

  const userVal  = input.value.trim().toLowerCase();
  if (!userVal) return;

  const accepted = input.dataset.answer.split('|');
  const correct  = accepted.some(a => userVal.includes(a.toLowerCase()));

  if (correct) {
    row.classList.add('solved');
    row.classList.remove('wrong');
    hint.textContent = '✓ DECRYPTED';
    hint.className = 'enigma-hint correct';
    input.disabled = true;
    btn.disabled = true;
    score++;
    document.getElementById('score-display').textContent = `${score} / ${total}`;
    setSpeech(SPEECHES[score === total ? 5 : 3]);

    if (score === total) {
      setTimeout(() => {
        document.getElementById('win-screen').classList.add('visible');
      }, 900);
    }
  } else {
    row.classList.add('wrong');
    setTimeout(() => row.classList.remove('wrong'), 400);
    hint.textContent = '✗ INCORRECT — TRY AGAIN';
    hint.className = 'enigma-hint incorrect';
    setSpeech(SPEECHES[Math.random() > 0.5 ? 1 : 2]);
  }
}

function setSpeech(text) {
  const el = document.getElementById('speech-text');
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(iv);
  }, 22);
}

// ── Event delegation (no inline onclick needed) ───────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.enigma-btn[data-check]');
  if (btn) checkAnswer(parseInt(btn.dataset.check));
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const input = e.target.closest('.enigma-input[data-idx]');
  if (input) checkAnswer(parseInt(input.dataset.idx));
});
