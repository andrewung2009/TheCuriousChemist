/* ========= Utility ========= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ========= Nav (mobile) ========= */
(function setupNav(){
  const toggle = $('#navToggle');
  const nav = $('#nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
})();

/* ========= Tabs (Learning Hub) ========= */
(function setupTabs(){
  const tabs = $$('.tab');
  const panels = $$('.tab-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.id === id));
      // Manage ARIA state
      tabs.forEach(t => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
    });
  });
})();

/* ========= Quiz (Learning Hub) ========= */
(function setupQuiz(){
  const form = $('#quiz-g1');
  const result = $('#quiz-g1-result');
  if (!form || !result) return;

  const answers = [
    '2M + 2H₂O → 2MOH + H₂',
    'Lilac',
    'Outer electron is further and more shielded, easier to lose'
  ];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const chosen = $$('select', form).map(s => s.value);
    const correctCount = chosen.filter((c, i) => c === answers[i]).length;
    const total = answers.length;

    let message = `You scored ${correctCount}/${total}. `;
    if (correctCount === total) message += 'Excellent! ✅';
    else if (correctCount === total - 1) message += 'Great — review the one you missed. 👍';
    else message += 'Keep practising — check the Overview & Reactions tabs. 💪';

    result.textContent = message;
    result.style.color = correctCount === total ? 'var(--ok)'
                        : correctCount >= 2 ? 'var(--warn)'
                        : 'var(--danger)';
  });
})();

/* ========= Community Posts (Local only) ========= */
(function setupPosts(){
  const form = $('#postForm');
  const postsList = $('#posts');
  const info = $('#postInfo');
  if (!form || !postsList) return;

  // Simple in-memory store for demo (resets on refresh)
  const posts = [];

  const render = () => {
    postsList.innerHTML = '';
    posts.slice().reverse().forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="post-meta">${p.name} • ${new Date(p.date).toLocaleString()}</div>
        <div>${p.text}</div>
      `;
      postsList.appendChild(li);
    });
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#postName').value.trim();
    const text = $('#postText').value.trim();
    if (!name || !text) {
      info.textContent = 'Please provide both name and comment.';
      return;
    }
    posts.push({ name, text, date: Date.now() });
    $('#postName').value = '';
    $('#postText').value = '';
    info.textContent = 'Posted! (Local demo — persists until refresh.)';
    render();
  });

  render();
})();
