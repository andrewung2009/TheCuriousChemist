// Replace the next line with your Web-app URL from Step 2-7
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwopWZMZkweJBr5Tq9D00VnWm7IJusNCIYJje6E1ztRADYsD4yYIb-CKQJN8R8wxZp-mQ/exec';

const form   = document.getElementById('guestForm');
const msgBox = document.getElementById('msg');
const table  = document.getElementById('entries');

// ---------- WRITE ----------
form.addEventListener('submit', async e => {
  e.preventDefault();
  msgBox.textContent = 'Sending…';
  try {
    const res = await fetch(SCRIPT_URL, {
      method:'POST',
      body: new FormData(form)
    }).then(r => r.json());
    msgBox.textContent = res.result==='ok' ? 'Saved ✓' : 'Error ✗';
    if(res.result==='ok'){ form.reset(); loadEntries(); }
  } catch {
    msgBox.textContent = 'Network error';
  }
});

// ---------- READ ----------
async function loadEntries() {
  const { rows } = await fetch(SCRIPT_URL).then(r => r.json());
  const [headers,...data] = rows;
  table.querySelector('thead tr').innerHTML = headers.map(h=>`<th>${h}</th>`).join('');
  table.querySelector('tbody').innerHTML = data.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
}

loadEntries();