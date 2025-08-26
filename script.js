/* script.js — main interactive + animation logic */
/* Uses: GSAP (loaded in HTML) */

/* ===== helpers ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ===== Mobile nav toggle ===== */
(function navToggle(){
  const btns = $$('.nav-toggle');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = $('#nav');
      if (!nav) return;
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });
})();

/* ===== Tabs ===== */
(function tabs(){
  const tabs = $$('.tab');
  const panels = $$('.tab-panel');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.id === id));
      tabs.forEach(t => t.setAttribute('aria-selected', t.classList.contains('active')));
    });
  });
})();

/* ===== GSAP entrance animations ===== */
window.addEventListener('load', () => {
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    // header fade
    gsap.from('.brand', {y:-8, opacity:0, duration:0.6, ease:"power2.out"});
    gsap.from('.site-nav a', {stagger:0.08, y:-6, opacity:0, duration:0.6, ease:"power2.out"});
    // hero
    gsap.from('.hero-copy', {x:-20, opacity:0, duration:0.8});
    gsap.from('.hero-visual', {x:20, opacity:0, duration:0.8});
    // reveal content on scroll
    gsap.utils.toArray('.content-card, .card, .reaction-block').forEach(elem => {
      gsap.from(elem, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {trigger: elem, start: 'top 85%'},
      });
    });
  }
});

/* ===== QUIZ handler ===== */
(function quiz(){
  const form = $('#quiz-g1');
  const result = $('#quiz-g1-result');
  if (!form) return;
  const answers = [
    '2M + 2H₂O → 2MOH + H₂',
    'Lilac',
    'Outer electron is further and more shielded, easier to lose'
  ];
  form.addEventListener('submit', e => {
    e.preventDefault();
    const vals = $$('select', form).map(s=>s.value);
    // map simplified answers if needed
    const correct = [vals[0] === answers[0], vals[1] === 'Lilac' ? vals[1] === 'Lilac' : vals[1] === answers[1], vals[2].includes('Outer')];
    const score = correct.filter(Boolean).length;
    result.textContent = `You scored ${score}/${answers.length}. ${score===3?'Excellent!':score===2?'Good — review the rest.':'Keep practising!'}`;
    result.style.color = score===3 ? 'var(--ok)' : (score===2 ? 'var(--accent)' : 'var(--danger)');
  });
})();

/* ===== Community posts (local only) ===== */
(function posts(){
  const form = $('#postForm');
  const postsList = $('#posts');
  const info = $('#postInfo');
  if (!form || !postsList) return;
  const posts = [];
  function render(){
    postsList.innerHTML = '';
    posts.slice().reverse().forEach(p=>{
      const li = document.createElement('li');
      li.innerHTML = `<div class="post-meta">${escapeHtml(p.name)} • ${new Date(p.date).toLocaleString()}</div><div>${escapeHtml(p.text)}</div>`;
      postsList.appendChild(li);
    });
  }
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = $('#postName').value.trim();
    const text = $('#postText').value.trim();
    if(!name || !text){ info.textContent = 'Please enter name & comment.'; return;}
    posts.push({name, text, date: Date.now()});
    $('#postName').value=''; $('#postText').value='';
    info.textContent='Posted (local demo).';
    render();
  });
  function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
})();

/* ===== Reaction animations collection ===== */
/* We'll create modular play/reset handlers for each reaction. */
(function reactions(){
  const playButtons = $$('[data-action="play"]');
  const resetButtons = $$('[data-action="reset"]');

  playButtons.forEach(btn => btn.addEventListener('click', e => {
    const r = btn.dataset.reaction;
    if (r === 'na-water') playNaWater();
    if (r === 'li-o2') playLiO2();
    if (r === 'k-flame') playKFlame();
    if (r === 'na-cl2') playNaCl2();
  }));

  resetButtons.forEach(btn => btn.addEventListener('click', e => {
    const r = btn.dataset.reaction;
    if (r === 'na-water') resetNaWater();
    if (r === 'li-o2') resetLiO2();
    if (r === 'k-flame') resetKFlame();
    if (r === 'na-cl2') resetNaCl2();
  }));

  /* ---------- Na + Water (canvas) ---------- */
  let naWaterAnim = null;
  function playNaWater(){
    const canvas = $('#canvasNaWater');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    // scale for high-DPI
    function scaleCanvas() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      ctx.scale(ratio, ratio);
    }
    // small particle bubble system
    const bubbles = [];
    let chunk = {x:120, y:120, w:60, h:26, vx:0.6};
    // create water molecules as background
    function drawBackground(){
      ctx.fillStyle = 'rgba(7,18,40,0.12)';
      ctx.fillRect(0,0,canvas.clientWidth, canvas.clientHeight);
      // water surface
      ctx.fillStyle = '#04233f';
      ctx.fillRect(0,130,canvas.clientWidth,canvas.clientHeight-130);
    }
    function spawnBubble(){
      const bx = chunk.x + Math.random()*chunk.w;
      bubbles.push({x:bx, y:150, r:2+Math.random()*3, vy:1+Math.random()*1.6, alpha:0.9});
      if (bubbles.length>110) bubbles.shift();
    }
    let frame=0;
    function step(){
      frame++;
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      ctx.clearRect(0,0,cw,ch);
      drawBackground();

      // sodium chunk (silvery)
      ctx.save();
      ctx.translate(chunk.x, chunk.y);
      ctx.fillStyle = '#FFF5C3';
      ctx.strokeStyle = '#ffecb3';
      ctx.fillRect(0,0,chunk.w, chunk.h);
      ctx.strokeRect(0,0,chunk.w, chunk.h);
      ctx.restore();

      // chunk floats & melts (slight bobbing and vx)
      chunk.x += chunk.vx;
      if(chunk.x>cw-120 || chunk.x<40) chunk.vx *= -1;

      // spawn bubbles when playing
      if (frame % 6 === 0) spawnBubble();

      // draw bubbles
      for (let i = 0; i < bubbles.length; i++){
        const b = bubbles[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${b.alpha})`;
        ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
        ctx.fill();
        b.y -= b.vy;
        b.alpha -= 0.005;
      }
      // remove faded
      while (bubbles.length && bubbles[0].alpha <= 0.01) bubbles.shift();

      // hydrogen pocket effect
      if (frame % 30 < 8){
        ctx.beginPath();
        const hx = chunk.x + chunk.w + 20;
        ctx.fillStyle = 'rgba(255,240,200,0.06)';
        ctx.arc(hx, 80 - (frame%30), 20 + Math.sin(frame/6)*3, 0, Math.PI*2);
        ctx.fill();
      }

      naWaterAnim = requestAnimationFrame(step);
    }

    resetNaWater(); // clear previous
    scaleCanvas();
    naWaterAnim = requestAnimationFrame(step);
  }

  function resetNaWater(){
    const canvas = $('#canvasNaWater');
    if(!canvas) return;
    if (naWaterAnim) cancelAnimationFrame(naWaterAnim);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width, canvas.height);
    // static initial scene
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    // draw a calm scene
    ctx.fillStyle = 'rgba(7,18,40,0.12)';
    ctx.fillRect(0,0,cw,ch);
    ctx.fillStyle = '#04233f';
    ctx.fillRect(0,130,cw,ch-130);
    // sodium chunk
    ctx.fillStyle = '#FFF5C3';
    ctx.fillRect(120,110,60,26);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('Click Play to animate reaction', 220, 60);
  }

  /* ---------- Li + O2 (SVG + GSAP) ---------- */
  function playLiO2(){
    const svg = $('#svgLiO2');
    if(!svg || !window.gsap) return;
    const o2Group = svg.querySelector('#o2s');
    const liChunk = svg.querySelector('#li-chunk');
    const flame = svg.querySelector('#li-flame');
    // create oxygen molecules (O2) as circles
    o2Group.innerHTML = '';
    for(let i=0;i<6;i++){
      const cx = 400 + Math.random()*320 - 160;
      const cy = 40 + Math.random()*60;
      const g = document.createElementNS('http://www.w3.org/2000/svg','g');
      g.innerHTML = `<circle cx="${cx}" cy="${cy}" r="8" fill="#a6d6ff" opacity="0.95"></circle>
                     <circle cx="${cx+12}" cy="${cy}" r="8" fill="#a6d6ff" opacity="0.95"></circle>`;
      o2Group.appendChild(g);
    }
    // timeline: move o2 toward lithium chunk & grow flame
    const tl = gsap.timeline();
    tl.to('#o2s g', {x: -120, duration: 1.2, stagger: 0.12, ease: 'power2.in'});
    tl.to('#li-chunk rect', {fill: '#ffd1d1', duration: 0.6}, '-=0.6');
    tl.to('#li-flame', {scale:1.05, transformOrigin:'center bottom', duration: 0.2, repeat:6, yoyo:true, ease:'sine.inOut'}, '-=0.2');
    tl.to('#li-flame', {scale:1.6, duration:0.5, opacity:1, ease:'power1.out'});
    // small glow on chunk
    tl.to('#li-chunk rect', {filter:'brightness(1.2)', duration:0.4}, '-=0.3');
  }
  function resetLiO2(){
    const svg = $('#svgLiO2');
    if(!svg) return;
    svg.querySelector('#o2s').innerHTML = '';
    gsap.set('#li-flame', {scale: 0.001});
    gsap.set('#li-chunk rect', {fill:'#f2d8d8', clearProps:'filter'});
  }

  /* ---------- Potassium flame (canvas particles lilac) ---------- */
  let kFlameAnim = null;
  function playKFlame(){
    const canvas = $('#canvasKFlame');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    function scaleCanvas(){ const r = window.devicePixelRatio || 1; canvas.width = canvas.clientWidth*r; canvas.height = canvas.clientHeight*r; ctx.scale(r,r);}
    scaleCanvas();
    const particles = [];
    function spawn() {
      const x = canvas.clientWidth/2 + (Math.random()-0.5)*40;
      particles.push({
        x, y: 160, vx:(Math.random()-0.5)*0.8, vy: - (1.5 + Math.random()*2.2),
        life: 40 + Math.round(Math.random()*40), size: 6+Math.random()*6,
        hue: 270 + Math.random()*20
      });
      if(particles.length>200) particles.shift();
    }
    function step(){
      ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight);
      // base holder
      ctx.fillStyle = '#071226'; ctx.fillRect(0,0,canvas.clientWidth, canvas.clientHeight);
      // spawn some
      if(Math.random()<0.6) spawn();
      // draw particles
      particles.forEach(p=>{
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size*1.6);
        g.addColorStop(0, `hsla(${p.hue},85%,70%,${Math.max(0, p.life/80)})`);
        g.addColorStop(0.6, `hsla(${p.hue},65%,50%,${Math.max(0, p.life/110)})`);
        g.addColorStop(1, `rgba(10,8,20,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
        p.x += p.vx; p.y += p.vy; p.vy -= 0.02; p.life--;
      });
      // remove dead
      for(let i=particles.length-1;i>=0;i--) if(particles[i].life<=0) particles.splice(i,1);
      kFlameAnim = requestAnimationFrame(step);
    }
    resetKFlame();
    kFlameAnim = requestAnimationFrame(step);
  }
  function resetKFlame(){ const c = $('#canvasKFlame'); if(!c) return; if(kFlameAnim) cancelAnimationFrame(kFlameAnim); const ctx = c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height); ctx.fillStyle='#071226'; ctx.fillRect(0,0,c.clientWidth,c.clientHeight); ctx.fillStyle='rgba(200,200,255,0.08)'; ctx.fillText('Click Play for lilac flame', 220, 60); }

  /* ---------- Na + Cl2 (SVG + GSAP sparks + salt appear) ---------- */
  function playNaCl2(){
    const wrap = $('#na-cl2-wrap');
    if(!wrap || !window.gsap) return;
    const cl2 = wrap.querySelector('#cl2s');
    const sparks = wrap.querySelector('#sparks');
    const saltGroup = wrap.querySelector('#salt');

    // populate chlorine molecules
    cl2.innerHTML = '';
    for(let i=0;i<5;i++){
      const x = 560 + (i*20);
      const circle = document.createElementNS('http://www.w3.org/2000/svg','g');
      circle.innerHTML = `<circle cx="${x}" cy="${40 + Math.random()*40}" r="7" fill="#9fe3ff" opacity="0.95"></circle><circle cx="${x+12}" cy="${40 + Math.random()*40}" r="7" fill="#9fe3ff" opacity="0.95"></circle>`;
      cl2.appendChild(circle);
    }

    // sparks: generate small lines
    sparks.innerHTML = '';
    for(let i=0;i<30;i++){
      const sx = 200 + Math.random()*240;
      const sy = 100 + Math.random()*40;
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', sx); line.setAttribute('y1', sy);
      line.setAttribute('x2', sx+ (Math.random()*40-20)); line.setAttribute('y2', sy+ (Math.random()*20-10));
      line.setAttribute('stroke', 'rgba(255,220,130,0.85)');
      line.setAttribute('stroke-width', 1 + Math.random()*1.6);
      line.setAttribute('opacity', 0);
      sparks.appendChild(line);
    }

    // salt crystal create
    saltGroup.innerHTML = `<rect x="0" y="0" width="36" height="18" rx="3" fill="#ffffff"/>`;

    const tl = gsap.timeline();
    tl.to('#cl2s g', {x:-160, duration:1.2, stagger: 0.12});
    tl.to('#na-chunk rect', {x:260, duration:1.1}, 0);
    tl.to('#sparks line', {opacity:1, y:-6, duration:0.25, stagger:0.02, repeat:3, yoyo:true}, 0.6);
    tl.to('#salt', {scale:1, opacity:1, transformOrigin:'center center', duration:0.6, ease:'back.out(1.2)'}, 1.4);
  }
  function resetNaCl2(){
    const wrap = $('#na-cl2-wrap');
    if(!wrap) return;
    wrap.querySelector('#cl2s').innerHTML = '';
    wrap.querySelector('#sparks').innerHTML = '';
    const salt = wrap.querySelector('#salt');
    if (salt) salt.innerHTML = '';
    gsap.set('#na-chunk rect', {x:100, clearProps:'all'});
    gsap.set('#salt', {scale:0.001, opacity:0});
  }

  /* Initialize resets on load */
  document.addEventListener('DOMContentLoaded', () => {
    resetNaWater(); resetLiO2(); resetKFlame(); resetNaCl2();
  });
})();

