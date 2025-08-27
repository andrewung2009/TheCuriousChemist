/* script.js — interactive periodic table + UI enhancements */

/* Minimal element data: atomic number, symbol, name, group (1..18 or 0). 
   For clarity we include the first 118 items; trimmed for brevity but you can extend easily. */
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

/* Utils */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* Build the table (simple row of 118 cells placed in a CSS grid with 18 columns) */
function buildPeriodicTable(showNames=false) {
  const container = $('#periodicTable');
  container.innerHTML = '';
  // create placeholders to ensure predictable grid sizing, but we will append sequential elements
  ELEMENTS.forEach(([z, sym, name, group]) => {
    const btn = document.createElement('button');
    btn.className = 'pt-cell';
    if (group === 1) btn.classList.add('alkali');
    else if (group >= 2 && group <= 12) btn.classList.add('metal');
    btn.setAttribute('data-symbol', sym);
    btn.setAttribute('data-name', name);
    btn.setAttribute('data-z', z);
    btn.setAttribute('data-group', group);
    btn.innerHTML = `<div class="num">${z}</div><div class="sym">${sym}</div>`;
    if (showNames) {
      const nm = document.createElement('div');
      nm.style.fontSize = '11px';
      nm.style.color = '#55606a';
      nm.textContent = name;
      btn.appendChild(nm);
    }
    // hover tooltip & click behavior
    btn.addEventListener('mouseenter', (e) => showTooltip(e, `${name} (${sym}) — Z=${z}`));
    btn.addEventListener('mousemove', moveTooltip);
    btn.addEventListener('mouseleave', hideTooltip);
    btn.addEventListener('click', () => {
      if (Number(group) === 1) {
        window.location.href = 'group1.html';
      } else {
        // simple info modal (alert for clarity)
        alert(`${name} (${sym}) — Atomic number ${z}\nGroup: ${group === 0 ? 'Other/Inner' : group}`);
      }
    });
    container.appendChild(btn);
  });
}

/* Tooltip functions */
const tooltip = document.getElementById('elementTooltip');
function showTooltip(e, text) {
  tooltip.textContent = text;
  tooltip.classList.add('show');
  tooltip.setAttribute('aria-hidden', 'false');
  moveTooltip(e);
}
function moveTooltip(e) {
  const pad = 12;
  const tw = tooltip.offsetWidth;
  const th = tooltip.offsetHeight;
  let left = e.clientX + pad;
  let top = e.clientY + pad;
  // keep in viewport
  if (left + tw + 10 > window.innerWidth) left = e.clientX - tw - pad;
  if (top + th + 10 > window.innerHeight) top = e.clientY - th - pad;
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}
function hideTooltip() {
  tooltip.classList.remove('show');
  tooltip.setAttribute('aria-hidden', 'true');
}

/* Search logic */
function highlightMatches(query) {
  const q = query.trim().toLowerCase();
  $$('.pt-cell').forEach(cell => {
    const sym = cell.getAttribute('data-symbol').toLowerCase();
    const name = cell.getAttribute('data-name').toLowerCase();
    if (!q) {
      cell.style.opacity = '';
      cell.style.transform = '';
    } else {
      if (sym.includes(q) || name.includes(q)) {
        cell.style.opacity = '1';
        cell.style.transform = 'translateY(-6px)';
      } else {
        cell.style.opacity = '0.28';
        cell.style.transform = 'none';
      }
    }
  });
}

/* Feedback form star rating */
function initRating() {
  const stars = $$('#ratingStars .star');
  const input = $('#ratingInput');
  stars.forEach(s => s.addEventListener('click', () => {
    const v = s.getAttribute('data-value');
    input.value = v;
    stars.forEach(x => x.classList.toggle('active', x.getAttribute('data-value') <= v));
  }));
}

/* Feedback form UX */
function initFeedbackForm() {
  const form = $('#feedbackForm');
  const message = $('#feedbackMessage');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    // Allow default submission to Formspree. Provide quick UX feedback and re-enable after a while.
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    message.textContent = 'Sending feedback...';
    // After short delay show success message (server handles actual sending)
    setTimeout(() => {
      btn.textContent = 'Send Feedback';
      btn.disabled = false;
      message.textContent = 'Thanks — feedback sent (Formspree).';
      form.reset();
      // clear star visuals
      $$('#ratingStars .star').forEach(s => s.classList.remove('active'));
      $('#ratingInput').value = '';
    }, 900);
  });
}

/* small UI wiring for toggle names + search + navToggle */
document.addEventListener('DOMContentLoaded', () => {
  buildPeriodicTable(false);
  initRating();
  initFeedbackForm();

  $('#showNamesBtn').addEventListener('click', (e) => {
    const show = e.currentTarget.getAttribute('data-show') !== 'true';
    buildPeriodicTable(show);
    e.currentTarget.setAttribute('data-show', show ? 'true' : 'false');
    e.currentTarget.textContent = show ? 'Hide Names' : 'Show Names';
  });

  $('#elementSearch').addEventListener('input', (e) => highlightMatches(e.target.value));
  $('#clearSearch').addEventListener('click', () => {
    $('#elementSearch').value = '';
    highlightMatches('');
    $('#elementSearch').focus();
  });

  // mobile nav toggle
  $('#navToggle').addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    nav.classList.toggle('open');
  });

  // small accessibility: keyboard focus for first cell
  const firstCell = document.querySelector('.pt-cell');
  if (firstCell) firstCell.setAttribute('tabindex', '0');
});
