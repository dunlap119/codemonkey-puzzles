// Lesson intro and assessment UI

const LESSONS_SEEN_KEY = 'codemonkey_lessons_seen';
const ASSESSMENTS_KEY = 'codemonkey_assessments';

function getLessonsSeen() {
  try {
    return JSON.parse(localStorage.getItem(LESSONS_SEEN_KEY)) || {};
  } catch { return {}; }
}

function markLessonSeen(lesson) {
  const seen = getLessonsSeen();
  seen[lesson] = true;
  localStorage.setItem(LESSONS_SEEN_KEY, JSON.stringify(seen));
}

function getAssessments() {
  try {
    return JSON.parse(localStorage.getItem(ASSESSMENTS_KEY)) || {};
  } catch { return {}; }
}

function markAssessmentDone(puzzleId) {
  const done = getAssessments();
  done[puzzleId] = true;
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(done));
}

// Show lesson intro modal for first puzzle of a new lesson
export function showLessonIntro(puzzle, onDismiss) {
  if (!puzzle.lessonContent) { onDismiss(); return; }

  const seen = getLessonsSeen();
  if (seen[puzzle.lesson]) { onDismiss(); return; }

  const modal = document.getElementById('lesson-modal');
  const content = document.getElementById('lesson-content');
  const title = document.getElementById('lesson-modal-title');

  title.textContent = `Lesson ${puzzle.lesson}: ${puzzle.lessonTitle || ''}`;
  content.innerHTML = puzzle.lessonContent;

  modal.classList.remove('hidden');

  const btn = document.getElementById('btn-lesson-ok');
  const handler = () => {
    btn.removeEventListener('click', handler);
    modal.classList.add('hidden');
    markLessonSeen(puzzle.lesson);
    onDismiss();
  };
  btn.addEventListener('click', handler);
}

// Show assessment modal after completing last puzzle of a lesson
export function showAssessment(puzzle, onPass) {
  if (!puzzle.assessments || puzzle.assessments.length === 0) { onPass(); return; }

  const done = getAssessments();
  if (done[puzzle.id]) { onPass(); return; }

  const modal = document.getElementById('assessment-modal');
  const container = document.getElementById('assessment-questions');
  const feedback = document.getElementById('assessment-feedback');
  const submitBtn = document.getElementById('btn-assessment-submit');

  container.innerHTML = '';
  feedback.textContent = '';
  feedback.classList.add('hidden');

  puzzle.assessments.forEach((q, idx) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'assessment-question';
    qDiv.innerHTML = `<p class="q-text"><strong>Q${idx + 1}:</strong> ${q.question}</p>`;

    if (q.type === 'multiple-choice') {
      q.options.forEach((opt, oi) => {
        const label = document.createElement('label');
        label.className = 'assessment-option';
        label.innerHTML = `<input type="radio" name="q${idx}" value="${oi}" /> ${opt}`;
        qDiv.appendChild(label);
      });
    } else if (q.type === 'true-false') {
      ['True', 'False'].forEach((opt, oi) => {
        const label = document.createElement('label');
        label.className = 'assessment-option';
        label.innerHTML = `<input type="radio" name="q${idx}" value="${oi === 0 ? 'true' : 'false'}" /> ${opt}`;
        qDiv.appendChild(label);
      });
    }

    container.appendChild(qDiv);
  });

  modal.classList.remove('hidden');

  const handler = () => {
    let allCorrect = true;
    let feedbackText = '';

    puzzle.assessments.forEach((q, idx) => {
      const selected = container.querySelector(`input[name="q${idx}"]:checked`);
      if (!selected) {
        allCorrect = false;
        feedbackText = 'Please answer all questions!';
        return;
      }

      let correct = false;
      if (q.type === 'multiple-choice') {
        correct = parseInt(selected.value) === q.correct;
      } else if (q.type === 'true-false') {
        correct = (selected.value === 'true') === q.correct;
      }

      if (!correct) {
        allCorrect = false;
        feedbackText = q.feedback || 'Not quite! Try again.';
      }
    });

    if (allCorrect) {
      submitBtn.removeEventListener('click', handler);
      modal.classList.add('hidden');
      markAssessmentDone(puzzle.id);
      onPass();
    } else {
      feedback.textContent = feedbackText;
      feedback.classList.remove('hidden');
    }
  };

  submitBtn.addEventListener('click', handler);
}
