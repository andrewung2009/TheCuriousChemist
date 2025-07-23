/* ---------- MINI QUIZ ---------- */
function answer(btn, isCorrect){
  [...btn.parentNode.querySelectorAll('button')].forEach(b=>b.disabled=true);
  btn.classList.add(isCorrect ? 'correct' : 'wrong');
  document.getElementById('quizMsg').textContent =
    isCorrect ? 'Correct!' : 'Try again!';
}

/* ---------- SKETCHER ---------- */
// initialise ChemDoodle
const sketcher = new ChemDoodle.SketcherCanvas('sketcher', 420, 300);
sketcher.specs.bonds_width_2D = 1.4;
sketcher.specs.atoms_font_size_2D = 14;

function checkButane(){
  const mol = sketcher.getMolecule();
  if(!mol) {
    document.getElementById('sketchMsg').textContent = 'Draw something first!';
    return;
  }
  const cCount = mol.atoms.filter(a=>a.label==='C').length;
  const hCount = mol.atoms.filter(a=>a.label==='H').length;
  if(cCount===4 && hCount===10){
    document.getElementById('sketchMsg').textContent = '✨ Perfect! You drew butane.';
  }else{
    document.getElementById('sketchMsg').textContent =
      `You have ${cCount} C and ${hCount} H – not butane (C₄H₁₀).`;
  }
}

/* ---------- smooth scroll ---------- */
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:'smooth'});
}
