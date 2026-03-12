const SPEECHES = [
  "You've entered the core. Solve my riddles to learn who I am.",
  "Hmm... not quite. Think differently.",
  "Closer than you think. Try again.",
  "CORRECT. Another file unlocked.",
  "Impressive. You're getting warmer.",
  "All files decrypted. Identity confirmed.",
];

let score = 0;
const total = 5;

function checkAnswer(idx) {
  const input = document.querySelector(`.enigma-input[data-idx="${idx}"]`);
  const btn = input.nextElementSibling;
  const hint = document.getElementById(`hint-${idx}`);
  const row = document.getElementById(`enigma-${idx}`);
  const answer = input.dataset.answer;
  const userVal = input.value.trim().toLowerCase();

  if (!userVal) return;

  // Support multiple correct answers (pipe-separated)
  const accepted = answer.split('|');
  const correct = accepted.some(a => userVal.includes(a.toLowerCase()));

  if (correct) {
    row.classList.add('solved');
    row.classList.remove('wrong');
    hint.textContent = '✓ DECRYPTED';
    hint.className = 'enigma-hint correct';
    input.disabled = true;
    btn.disabled = true;
    score++;
    document.getElementById('score-display').textContent = `${score} / ${total}`;
    setSpeech(SPEECHES[3]);

    if (score === total) {
      setTimeout(() => {
        setSpeech(SPEECHES[5]);
        document.getElementById('win-screen').classList.add('visible');
      }, 800);
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
  el.textContent = '';
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(iv);
  }, 22);
}

// Allow Enter key on inputs
document.querySelectorAll('.enigma-input').forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') checkAnswer(parseInt(input.dataset.idx));
  });
});

// Expose to HTML onclick
window.checkAnswer = checkAnswer;
