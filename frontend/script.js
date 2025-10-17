// Simple quiz logic for the static frontend
const quizData = [
  { q: 'Which language runs in a web browser?', a: ['Java', 'C', 'Python', 'JavaScript'], correct: 3 },
  { q: 'What does CSS stand for?', a: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 1 },
  { q: 'Which HTML element do we put the JS in?', a: ['<js>', '<script>', '<javascript>', '<code>'], correct: 1 },
  { q: 'Which company developed the React library?', a: ['Google', 'Facebook', 'Twitter', 'Microsoft'], correct: 1 },
  { q: 'Which attribute is used to add a unique id to an element?', a: ['class', 'id', 'data-name', 'key'], correct: 1 }
];

// State
let current = 0;
let score = 0;
let selected = null;

// Elements
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const themeToggle = document.getElementById('theme-toggle');
const darkModeBtn = document.getElementById('dark-mode-btn');

function render() {
  const item = quizData[current];
  questionEl.textContent = item.q;
  optionsEl.innerHTML = '';
  item.a.forEach((opt, idx) => {
    const li = document.createElement('li');
    li.tabIndex = 0;
    li.className = '';
    li.textContent = opt;
    li.addEventListener('click', () => selectOption(idx, li));
    li.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') selectOption(idx, li); });
    optionsEl.appendChild(li);
  });
  currentEl.textContent = current + 1;
  totalEl.textContent = quizData.length;
  scoreEl.textContent = score;
  selected = null;
}

function selectOption(idx, el) {
  // ignore if already answered
  if (selected !== null) return;
  selected = idx;
  // mark selection visually
  Array.from(optionsEl.children).forEach((li,i)=>{ li.classList.toggle('selected', i===idx); });
}

function showResult() {
  const correctIdx = quizData[current].correct;
  Array.from(optionsEl.children).forEach((li, i) => {
    if (i === correctIdx) li.classList.add('correct');
    if (selected === i && selected !== correctIdx) li.classList.add('wrong');
    li.classList.remove('selected');
  });
}

nextBtn.addEventListener('click', () => {
  // If nothing selected, move next but warn
  if (selected === null) {
    // proceed to next question without score change
    current++;
    if (current >= quizData.length) return finish();
    render();
    return;
  }

  // check answer
  if (selected === quizData[current].correct) {
    score++;
  }
  showResult();
  scoreEl.textContent = score;

  // short delay before moving to next
  setTimeout(() => {
    current++;
    if (current >= quizData.length) return finish();
    render();
  }, 900);
});

restartBtn.addEventListener('click', () => {
  current = 0; score = 0; selected = null; render();
  nextBtn.disabled = false;
});

function finish() {
  questionEl.textContent = `Quiz finished! Your score: ${score}/${quizData.length}`;
  optionsEl.innerHTML = '';
  nextBtn.disabled = true;
}

// Theme handling
function loadTheme(){
  const t = localStorage.getItem('site-theme') || 'light';
  if (t === 'light') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
  themeToggle.textContent = `Theme: ${t}`;
}

function setTheme(name){
  if (name === 'light') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('site-theme', name);
  themeToggle.textContent = `Theme: ${name}`;
}

themeToggle.addEventListener('click', ()=>{
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const order = ['light','dark','sepia'];
  const next = order[(order.indexOf(cur)+1) % order.length];
  if (next === 'light') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('site-theme', next);
  themeToggle.textContent = `Theme: ${next}`;
});

// Dedicated dark mode button: immediately switch to dark theme
if (darkModeBtn) {
  darkModeBtn.addEventListener('click', ()=>{
    setTheme('dark');
  });
}

// init
loadTheme();
render();
