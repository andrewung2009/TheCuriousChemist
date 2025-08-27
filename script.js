/* script.js
   - Generates full periodic table (data array below)
   - Click Group navigation -> group1.html
   - Group 1 interactive demos (naWater, liO2, kFlame)
   - Feedback form submission uses HTML form action (Formspree) - this file just adds client-side UX
*/

/* ========== Periodic table data ========== */
/* Minimal concise elements array: each item: [Z, symbol, name, group] */
/* For clarity we include all 118 entries (symbol and name). Group numbers are approximate for main groups; transition metals are group 3-12 (set 0 for simplicity). */
const ELEMENTS = [
  [1,"H","Hydrogen",1],[2,"He","Helium",18],
  [3,"Li","Lithium",1],[4,"Be","Beryllium",2],[5,"B","Boron",13],[6,"C","Carbon",14],[7,"N","Nitrogen",15],[8,"O","Oxygen",16],[9,"F","Fluorine",17],[10,"Ne","Neon",18],
  [11,"Na","Sodium",1],[12,"Mg","Magnesium",2],[13,"Al","Aluminium",13],[14,"Si","Silicon",14],[15,"P","Phosphorus",15],[16,"S","Sulfur",16],[17,"Cl","Chlorine",17],[18,"Ar","Argon",18],
  [19,"K","Potassium",1],[20,"Ca","Calcium",2],[21,"Sc","Scandium",3],[22,"Ti","Titanium",4],[23,"V","Vanadium",5],[24,"Cr","Chromium",6],[25,"Mn","Manganese",7],[26,"Fe","Iron",8],[27,"Co","Cobalt",9],[28,"Ni","Nickel",10],[29,"Cu","Copper",11],[30,"Zn","Zinc",12],[31,"Ga","Gallium",13],[32,"Ge","Germanium",14],[33,"As","Arsenic",15],[34,"Se","Selenium",16],[35,"Br","Bromine",17],[36,"Kr","Krypton",18],
  [37,"Rb","Rubidium",1],[38,"Sr","Strontium",2],[39,"Y","Yttrium",3],[40,"Zr","Zirconium",4],[41,"Nb","Niobium",5],[42,"Mo","Molybdenum",6],[43,"Tc","Technetium",7],[44,"Ru","Ruthenium",8],[45,"Rh","Rhodium",9],[46,"Pd","Palladium",10],[47,"Ag","Silver",11],[48,"Cd","Cadmium",12],[49,"In","Indium",13],[50,"Sn","Tin",14],[51,"Sb","Antimony",15],[52,"Te","Tellurium",16],[53,"I","Iodine",17],[54,"Xe","Xenon",18],
  [55,"Cs","Caesium",1],[56,"Ba","Barium",2],[57,"La","Lanthanum",3],[58,"Ce","Cerium",0],[59,"Pr","Praseodymium",0],[60,"Nd","Neodymium",0],[61,"Pm","Promethium",0],[62,"Sm","Samarium",0],[63,"Eu","Europium",0],[64,"Gd","Gadolinium",0],[65,"Tb","Terbium",0],[66,"Dy","Dysprosium",0],[67,"Ho","Holmium",0],[68,"Er","Erbium",0],[69,"Tm","Thulium",0],[70,"Yb","Ytterbium",0],[71,"Lu","Lutetium",0),
  [72,"Hf","Hafnium",4],[73,"Ta","Tantalum",5],[74,"W","Tungsten",6],[75,"Re","Rhenium",7],[76,"Os","Osmium",8],[77,"Ir","Iridium",9],[78,"Pt","Platinum",10],[79,"Au","Gold",11],[80,"Hg","Mercury",12],[81,"Tl","Thallium",13],[82,"Pb","Lead",14],[83,"Bi","Bismuth",15],[84,"Po","Polonium",16],[85,"At","Astatine",17],[86,"Rn","Radon",18],
  [87,"Fr","Francium",1],[88,"Ra","Radium",2],[89,"Ac","Actinium",3],[90,"Th","Thorium",0],[91,"Pa","Protactinium",0],[92,"U","Uranium",0],[93,"Np","Neptunium",0],[94,"Pu","Plutonium",0],[95,"Am","Americium",0],[96,"Cm","Curium",0],[97,"Bk","Berkelium",0],[98,"Cf","Californium",0],[99,"Es","Einsteinium",0],[100,"Fm","Fermium",0],[101,"Md","Mendelevium",0],[102,"No","Nobelium",0],[103,"Lr","Lawrencium",0),
  [104,"Rf","Rutherfordium",0],[105,"Db","Dubnium",0],[106,"Sg","Seaborgium",0],[107,"Bh","Bohrium",0],[108,"Hs","Hassium",0],[109,"Mt","Meitnerium",0],[110,"Ds","Darmstadtium",0],[111,"Rg","Roentgenium",0],[112,"Cn","Copernicium",0],[113,"Nh","Nihonium",0],[114,"Fl","Flerovium",0],[115,"Mc","Moscovium",0],[116,"Lv","Livermorium",0],[117,"Ts","Tennessine",17],[118,"Og","Oganesson",18]
];

/* =========== Helpers =========== */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/* =========== Build periodic table DOM =========== */
function buildTable(showNames = false) {
  const container = $('#periodicTable');
  if(!container) return;
  container.innerHTML = ''; // clear

  // The table is 7 rows (periods) conceptually, but display as 18 columns per standard periodic layout.
  // We'll build a simple grid of 18 cols x 7 rows + lanthanides/actinides rows simulated after.
  // For simplicity, create 7 * 18 slots and fill with known positions by atomic number approximate mapping.
  // We'll use a simple placement algorithm: position by known period/column map.
  // But to keep this robust and simple for Year 10, we will place elements sequentially with CSS grid and mark groups.
  // Each element cell:
  ELEMENTS.forEach(el => {
    const [Z, sym, name, group] = el;
    const cell = document.createElement('button');
    cell.className = 'pt-cell';
    if(group === 1) cell.classList.add('alkali');
    // small semantic attributes for JS
    cell.setAttribute('data-z', Z);
    cell.setAttribute('data-symbol', sym);
    cell.setAttribute('data-name', name);
    cell.setAttribute('data-group', group);
    // inner HTML: number and symbol
    cell.innerHTML = `<div class="num">${Z}</div><div class="sym">${sym}</div>`;
    // show name on toggle
    if(showNames) {
      const nm = document.createElement('div');
      nm.className = 'el-name';
      nm.textContent = name;
      nm.style.fontSize = '0.6rem';
      nm.style.color = '#6b7280';
      cell.appendChild(nm);
    }
    // click behavior: if group 1, open group1.html; otherwise show quick info
    cell.addEventListener('click', () => {
      const grp = Number(cell.getAttribute('data-group'));
      if(grp === 1) {
        window.location.href = 'group1.html';
        return;
      }
      // quick info popup (simple alert for clarity; teachers can replace with modal)
      const s = cell.getAttribute('data-symbol');
      const n = cell.getAttribute('data-name');
      const z = cell.getAttribute('data-z');
      alert(`${n} (${s}) — Atomic number ${z}\nGroup: ${grp === 0 ? 'Transition/Inner/Unknown' : grp}`);
    });
    container.appendChild(cell);
  });
}

/* =========== UI wiring =========== */
document.addEventListener('DOMContentLoaded', function(){
  buildTable(false);

  // go to group 1
  const go1 = $('#goGroup1');
  if(go1) go1.addEventListener('click', ()=> window.location.href = 'group1.html');

  // toggle labels
  const toggle = $('#toggleLabels');
  if(toggle) {
    let show = false;
    toggle.addEventListener('click', () => {
      show = !show;
      buildTable(show);
      toggle.textContent = show ? 'Hide Names' : 'Toggle Names';
    });
  }

  // Feedback form simple UX
  const fb = $('#feedbackForm');
  if(fb) {
    fb.addEventListener('submit', (e) => {
      // Allow default submit to Formspree; show immediate UX
      const sendBtn = fb.querySelector('button[type="submit"]');
      sendBtn.textContent = 'Sending...';
      setTimeout(()=> sendBtn.textContent = 'Sent — thank you', 1000);
    });
  }
});

/* ========== Group 1 Animations & Demos =========
   Functions used by group1.html controls. Lightweight implementations.
   - naWaterDemo(): simple canvas bubbles + sodium chunk movement
   - liO2Demo(): svg round-moving O2 toward Li + flame reveal
   - kFlameDemo(): canvas particle lilac flame
   Each provides play() and reset() behavior by demo id.
*/
(function setupGroup1Demos(){
  // Na + Water demo (canvas)
  function naWaterPlay(canvas) {
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let raf = null;
    const chunk = {x:120, y:80, w:80, h:28, vx:0.9};
    const bubbles = [];
    function draw(){
      ctx.clearRect(0,0,W,H);
      // water
      ctx.fillStyle = '#dff3ff'; ctx.fillRect(0,H*0.55,W,H*0.45);
      // chunk
      ctx.fillStyle = '#fff6c8'; ctx.fillRect(chunk.x, chunk.y, chunk.w, chunk.h);
      // spawn bubbles
      if(Math.random() < 0.6) {
        bubbles.push({x:chunk.x + Math.random()*chunk.w, y: H*0.55 - 6, r:2 + Math.random()*2, vy:1 + Math.random()*0.8, alpha:1});
      }
      // update chunk position
      chunk.x += chunk.vx;
      if(chunk.x < 20 || chunk.x > W - chunk.w - 20) chunk.vx *= -1;
      // draw bubbles
      for(let i=0;i<bubbles.length;i++){
        const b = bubbles[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${b.alpha})`;
        ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
        ctx.fill();
        b.y -= b.vy; b.alpha -= 0.006;
      }
      // remove faded
      while(bubbles.length && bubbles[0].alpha <= 0.02) bubbles.shift();
      raf = requestAnimationFrame(draw);
    }
    // start
    if(canvas._raf) cancelAnimationFrame(canvas._raf);
    canvas._raf = requestAnimationFrame(draw);
    canvas._stop = () => { cancelAnimationFrame(canvas._raf); canvas._raf = null; ctx.clearRect(0,0,W,H); ctx.fillStyle='#f7fcff'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#022a42'; ctx.fillRect(0,H*0.55,W,H*0.45); ctx.fillStyle='#fff6c8'; ctx.fillRect(120,80,80,28); };
  }

  // Li + O2 demo (svg)
  function liO2Play(svg) {
    if(!svg) return;
    svg.innerHTML = '';
    // base
    const xmlns = "http://www.w3.org/2000/svg";
    const base = document.createElementNS(xmlns,'rect'); base.setAttribute('x',0); base.setAttribute('y',120); base.setAttribute('width',760); base.setAttribute('height',60); base.setAttribute('fill','#e9f7ff'); svg.appendChild(base);
    // lithium chunk
    const li = document.createElementNS(xmlns,'rect'); li.setAttribute('x',120); li.setAttribute('y',86); li.setAttribute('width',80); li.setAttribute('height',28); li.setAttribute('rx',6); li.setAttribute('fill','#f7e3e3'); li.setAttribute('id','liChunk'); svg.appendChild(li);
    // O2 molecules to right
    for(let i=0;i<6;i++){
      const g = document.createElementNS(xmlns,'g');
      g.setAttribute('transform', `translate(${520 + i*20}, ${20 + (i%2)*12})`);
      g.innerHTML = `<circle cx="0" cy="0" r="7" fill="#a6d6ff"></circle><circle cx="12" cy="0" r="7" fill="#a6d6ff"></circle>`;
      svg.appendChild(g);
    }
    // animate by JS interval
    let t=0;
    const iv = setInterval(()=>{
      t++;
      // move each O2 slightly left by changing transform
      const gs = svg.querySelectorAll('g');
      gs.forEach((g, idx) => {
        const tr = g.getAttribute('transform');
        const match = tr.match(/translate\(([-.\d]+),\s*([-\d.]+)\)/);
        if(match){
          let x = parseFloat(match[1]) - (0.8 + idx*0.02);
          let y = parseFloat(match[2]);
          g.setAttribute('transform', `translate(${x}, ${y})`);
        }
      });
      if(t === 30) {
        // reveal a simple flame indicator using a circle
        const flame = document.createElementNS(xmlns,'ellipse');
        flame.setAttribute('cx', 170); flame.setAttribute('cy', 100); flame.setAttribute('rx', 6); flame.setAttribute('ry', 12);
        flame.setAttribute('fill', '#ff6b6b'); flame.setAttribute('opacity', '0.95'); flame.setAttribute('id','liFlame');
        svg.appendChild(flame);
      }
      if(t > 70) {
        clearInterval(iv);
      }
    }, 40);
    // store reset handle
    svg._cleanup = () => { clearInterval(iv); svg.innerHTML = ''; };
  }

  // K flame demo (canvas) — lilac particles
  function kFlamePlay(canvas){
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let particles = [];
    let raf = null;
    function spawn(){
      const x = W/2 + (Math.random()-0.5)*30;
      particles.push({x, y:H-20, vx:(Math.random()-0.5)*0.8, vy:- (1.5 + Math.random()*2), life:40+Math.random()*40, size:6+Math.random()*6, hue:270 + Math.random()*18});
      if(particles.length>200) particles.shift();
    }
    function frame(){
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#f6fbff'; ctx.fillRect(0,0,W,H);
      if(Math.random() < 0.7) spawn();
      particles.forEach(p => {
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*1.6);
        g.addColorStop(0, `hsla(${p.hue},80%,70%,${Math.max(0,p.life/60)})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
        p.x += p.vx; p.y += p.vy; p.vy -= 0.02; p.life--;
      });
      particles = particles.filter(p => p.life > 0);
      raf = requestAnimationFrame(frame);
    }
    if(canvas._raf) cancelAnimationFrame(canvas._raf);
    canvas._raf = requestAnimationFrame(frame);
    canvas._stop = () => { if(canvas._raf) cancelAnimationFrame(canvas._raf); ctx.clearRect(0,0,W,H); ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#e9eef6'; ctx.fillRect(0,H-40,W,40); };
  }

  /* Hook up play/reset buttons on group1 page when DOMReady */
  document.addEventListener('DOMContentLoaded', () => {
    // NA water
    const naCanvas = document.getElementById('naWaterCanvas');
    if(naCanvas){
      const playBtns = document.querySelectorAll('[data-demo="naWater"]');
      playBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          if(e.currentTarget.hasAttribute('data-reset')) {
            if(naCanvas._stop) naCanvas._stop();
          } else {
            naWaterPlay(naCanvas);
          }
        });
      });
    }

    // LI + O2
    const liSvg = document.getElementById('liO2svg');
    if(liSvg){
      const playBtns = document.querySelectorAll('[data-demo="liO2"]');
      playBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          if(e.currentTarget.hasAttribute('data-reset')) {
            if(liSvg._cleanup) liSvg._cleanup();
            liSvg.innerHTML = '';
          } else {
            liO2Play(liSvg);
          }
        });
      });
    }

    // K flame
    const kCanvas = document.getElementById('kFlameCanvas');
    if(kCanvas){
      const playBtns = document.querySelectorAll('[data-demo="kFlame"]');
      playBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          if(e.currentTarget.hasAttribute('data-reset')) {
            if(kCanvas._stop) kCanvas._stop();
          } else {
            kFlamePlay(kCanvas);
          }
        });
      });
    }

    // Basic UX: mark group1 link active when on group page (minor)
    if(window.location.pathname.endsWith('group1.html')){
      // nothing required here; just keep for expansion
    }

    // Basic safety: intercept feedback forms to show a quick message
    const fbs = document.querySelectorAll('form[action^="https://formspree.io"]');
    fbs.forEach(form => {
      form.addEventListener('submit', () => {
        // small UX: show sending text (server handles actual send)
        const btn = form.querySelector('button[type="submit"]');
        if(btn) { btn.disabled = true; btn.textContent = 'Sending...'; setTimeout(()=> { btn.textContent='Sent — thanks'; }, 1100); }
      });
    });
  });
})();
