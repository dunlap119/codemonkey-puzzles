export function showSuccess(stars, isLastPuzzle) {
  const modal = document.getElementById('success-modal');
  const starsEl = document.getElementById('modal-stars');
  const msgEl = document.getElementById('modal-message');
  const nextBtn = document.getElementById('btn-next');

  let starHtml = '';
  for (let i = 0; i < 3; i++) {
    starHtml += i < stars
      ? '<span class="star-filled">&#9733;</span>'
      : '<span class="star-empty">&#9733;</span>';
  }
  starsEl.innerHTML = starHtml;

  const messages = [
    'Nice work! You solved it!',
    'Great job! Your code is efficient!',
    'Perfect! Couldn\'t be shorter!',
  ];
  msgEl.textContent = messages[Math.min(stars, 3) - 1];

  if (isLastPuzzle) {
    nextBtn.textContent = 'Back to Menu';
  } else {
    nextBtn.textContent = 'Next Puzzle';
  }

  modal.classList.remove('hidden');
}

export function hideSuccess() {
  document.getElementById('success-modal').classList.add('hidden');
}

export function showFailure(title, message) {
  document.getElementById('failure-title').textContent = title || 'Oops!';
  document.getElementById('failure-message').textContent = message;
  document.getElementById('failure-modal').classList.remove('hidden');
}

export function hideFailure() {
  document.getElementById('failure-modal').classList.add('hidden');
}
