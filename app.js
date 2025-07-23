function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:'smooth'});
}

function check(btn,correct){
  [...btn.parentNode.querySelectorAll('.opt')].forEach(b=>{
    b.disabled=true;
    if(b.textContent.includes(correct)) b.classList.add('correct');
  });
  if(btn.textContent.includes(correct)){
    document.getElementById('feedback').textContent='Correct!';
  }else{
    btn.classList.add('wrong');
    document.getElementById('feedback').textContent='Try again!';
  }
}

function markPractice(){
  let score=0;
  [...document.querySelectorAll('input[data-ans]')].forEach(inp=>{
    if(inp.value.trim().toLowerCase()===inp.dataset.ans.toLowerCase()){
      inp.style.background='#c8e6c9'; score++;
    }else{
      inp.style.background='#ffcdd2';
    }
  });
  document.getElementById('practiceResult').textContent=`You scored ${score}/3`;
}
