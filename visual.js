'use strict';
(() => {
  document.documentElement.classList.add('visual-ready');
  const KEY='cuprate-visual-learning-v1',ids=['28','0','9','206','2','35','1','3','22','25','296','340','342'];
  let checked=[];
  try {const data=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(data))checked=[...new Set(data.filter(id=>ids.includes(id)))];} catch {}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(checked));}catch{}}
  const topicSelect=document.getElementById('visual-topic'),uncheckedOnly=document.getElementById('visual-unchecked');
  function filterPath(){let count=0;document.querySelectorAll('[data-progress-id]').forEach(card=>{const show=(!topicSelect?.value||topicSelect.value===card.dataset.pathTopic)&&(!uncheckedOnly?.checked||!checked.includes(card.dataset.progressId));card.hidden=!show;count+=show;});const status=document.querySelector('.visual-path-count');if(status)status.textContent=count?`${count} visual lesson${count===1?'':'s'} shown`:'No unchecked lessons in this selection. Revisit any lesson by clearing the filter.';}
  topicSelect?.addEventListener('change',filterPath);uncheckedOnly?.addEventListener('change',filterPath);
  function progress(){
    document.querySelectorAll('.visual-progress').forEach(p=>p.textContent=`${checked.length} of 13 recall questions checked`);
    document.querySelectorAll('[data-progress-id]').forEach(card=>{const done=checked.includes(card.dataset.progressId);card.classList.toggle('is-checked',done);card.querySelector('.visual-path-status').textContent=done?'Recall checked ✓ · revisit any time':'4 pictures · 1 prediction';});
    document.querySelectorAll('[data-lesson]').forEach(lesson=>lesson.querySelector('.visual-mastered').hidden=!checked.includes(lesson.dataset.lesson));
    filterPath();
  }
  document.querySelector('.visual-reset-progress')?.addEventListener('click',()=>{checked=[];save();progress();});
  document.querySelectorAll('[data-lesson]').forEach(lesson=>{
    const tabs=[...lesson.querySelectorAll('.visual-tab')],frames=[...lesson.querySelectorAll('.visual-frame')];let current=0;
    function show(n){
      current=Math.max(0,Math.min(frames.length-1,n));frames.forEach((frame,i)=>{frame.classList.toggle('is-active',i===current);frame.setAttribute('aria-hidden',String(i!==current));});
      tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===current)));lesson.querySelector('[data-prev]').disabled=current===0;lesson.querySelector('[data-next]').disabled=current===frames.length-1;
      lesson.querySelector('.visual-step-status').textContent=`Picture ${current+1} of ${frames.length}`;
    }
    tabs.forEach((tab,i)=>tab.addEventListener('click',()=>show(i)));
    lesson.querySelector('[data-prev]').addEventListener('click',()=>show(current-1));lesson.querySelector('[data-next]').addEventListener('click',()=>show(current+1));
    lesson.querySelector('.visual-tabs').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?frames.length-1:current+(e.key==='ArrowRight'?1:-1);show(n);tabs[current].focus();}});
    const quiz=lesson.querySelector('.visual-prediction'),feedback=quiz.querySelector('.visual-feedback'),rationale=quiz.querySelector('.visual-rationale'),retry=quiz.querySelector('.visual-retry'),options=[...quiz.querySelectorAll('.visual-option')];
    options.forEach((button,i)=>button.addEventListener('click',()=>{
      const correct=i===Number(quiz.dataset.answer);options.forEach(o=>{o.classList.remove('is-correct','is-incorrect');o.setAttribute('aria-pressed',String(o===button));});button.classList.add(correct?'is-correct':'is-incorrect');
      feedback.textContent=correct?'Yes. Now explain why in your own words.':'Compare the missing assumption, then try another answer.';rationale.hidden=false;retry.hidden=false;
      if(correct&&!checked.includes(lesson.dataset.lesson)){checked.push(lesson.dataset.lesson);save();progress();}
    }));
    retry.addEventListener('click',()=>{options.forEach(o=>{o.classList.remove('is-correct','is-incorrect');o.setAttribute('aria-pressed','false');});rationale.hidden=true;retry.hidden=true;feedback.textContent='Choose an answer, then compare the reasoning.';checked=checked.filter(id=>id!==lesson.dataset.lesson);save();progress();options[0].focus();});
    show(0);
  });
  progress();
  function revealLesson(){
    if(!location.hash.startsWith('#lesson-'))return;
    const target=document.getElementById(location.hash.slice(1)),card=target?.closest('.paper-card');
    if(card?.hidden){const search=document.getElementById('paper-search'),filter=document.getElementById('paper-type');if(search)search.value='';if(filter)filter.value='all';search?.dispatchEvent(new Event('input',{bubbles:true}));target.scrollIntoView();}
  }
  addEventListener('hashchange',revealLesson);revealLesson();
  addEventListener('storage',e=>{if(e.key===KEY){try{const v=JSON.parse(e.newValue||'[]');checked=Array.isArray(v)?[...new Set(v.filter(id=>ids.includes(id)))]:[];progress();}catch{}}});
  const dialog=document.createElement('dialog');dialog.className='visual-zoom-dialog';dialog.setAttribute('aria-label','Enlarged teaching diagram');dialog.innerHTML='<button type="button">Close diagram ×</button><div class="visual-zoom-slot"></div>';document.body.append(dialog);
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  document.querySelectorAll('.visual-zoom').forEach(button=>button.addEventListener('click',()=>{
    const copy=button.closest('figure').querySelector('svg').cloneNode(true),slot=dialog.querySelector('.visual-zoom-slot');copy.querySelectorAll('[id]').forEach(e=>e.id='zoom-'+e.id);copy.setAttribute('aria-labelledby',copy.getAttribute('aria-labelledby').split(' ').map(id=>'zoom-'+id).join(' '));slot.replaceChildren(copy);dialog.showModal();
  }));
  const probe=document.querySelector('.visual-probe');
  if(probe){
    const canvas=probe.querySelector('canvas'),ctx=canvas.getContext('2d'),select=probe.querySelector('select'),range=probe.querySelector('input'),status=probe.querySelector('.visual-probe-result');
    function draw(){
      const styles=getComputedStyle(probe),color=name=>styles.getPropertyValue(name).trim(),q0=Number(range.value)*Math.PI,two=select.value==='two';probe.querySelector('output').textContent=Number(range.value).toFixed(2);
      ctx.clearRect(0,0,720,360);ctx.fillStyle=color('--v-soft');ctx.fillRect(0,0,720,360);ctx.strokeStyle=color('--v-line');ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(65,45);ctx.lineTo(65,285);ctx.lineTo(685,285);ctx.stroke();ctx.fillStyle=color('--v-ink');ctx.font='18px system-ui';ctx.fillText('Normalized teaching spectrum / weight',65,25);ctx.fillText('0',62,314);ctx.fillText('π',370,314);ctx.fillText('2π',660,314);ctx.fillText('Momentum cut qa',285,345);
      const host=q=>1/(1+((q-q0)/.38)**2),filter=q=>two?Math.cos(q/2)**2:1;
      function plot(fn,name,dash=[]){ctx.strokeStyle=color(name);ctx.lineWidth=3;ctx.setLineDash(dash);ctx.beginPath();for(let i=0;i<=240;i++){const q=2*Math.PI*i/240,x=65+620*i/240,y=285-220*fn(q);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);}
      plot(host,'--v-accent');plot(filter,'--v-warm',[7,5]);plot(q=>host(q)*filter(q),'--v-purple');
      let sum=0,weighted=0;for(let i=0;i<=600;i++){const q=2*Math.PI*i/600,w=(i===0||i===600)?0.5:1;sum+=w*host(q);weighted+=w*host(q)*filter(q);}
      status.textContent=`Toy weighted area / host area = ${(weighted/sum*100).toFixed(1)}%. ${two?(Math.abs(q0-Math.PI)<.02?'The equal two-site filter is zero at the central peak, but finite-width weight away from π still contributes.':'Moving Q away from π weakens cancellation at the peak. The full weighted area also depends on peak width.'):'A constant coupling retains the whole normalized teaching spectrum.'} This area ratio is not a measured relaxation rate.`;
    }
    select.addEventListener('change',draw);range.addEventListener('input',draw);draw();
    new MutationObserver(draw).observe(document.body,{attributes:true,attributeFilter:['class']});new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  }
})();
