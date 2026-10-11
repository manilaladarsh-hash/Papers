'use strict';
(() => {
  const bar=document.querySelector('.bar'),themeButton=document.querySelector('.theme');
  const sizeBar=()=>document.documentElement.style.setProperty('--nav-height',`${Math.ceil(bar.getBoundingClientRect().height)}px`);sizeBar();new ResizeObserver(sizeBar).observe(bar);
  let dark=false;try{dark=localStorage.getItem(document.body.dataset.themeKey)==='dark';}catch{}
  function theme(){document.body.classList.toggle('dark',dark);themeButton.setAttribute('aria-pressed',String(dark));themeButton.textContent=dark?'Light theme':'Dark theme';}
  themeButton.addEventListener('click',()=>{dark=!dark;theme();try{localStorage.setItem(document.body.dataset.themeKey,dark?'dark':'light');}catch{}});theme();
  const search=document.getElementById('catalog-search'),queue=document.getElementById('catalog-unchecked'),cards=[...document.querySelectorAll('.paper-preview')];let checked=[];
  function filter(){let n=0;const q=search?.value.toLowerCase().trim()||'';cards.forEach(c=>{const show=(!q||q.split(/\s+/).every(w=>c.dataset.search.includes(w)))&&(!queue?.checked||!checked.includes(c.dataset.progressId));c.hidden=!show;n+=show;});const count=document.querySelector('.catalog-count');if(count)count.textContent=n?`${n} overview / chapter lesson${n===1?'':'s'} shown`:'No matching lessons. Clear the filters to return to the room.';}
  window.materialsFilter=ids=>{checked=ids;filter();};search?.addEventListener('input',filter);queue?.addEventListener('change',filter);document.getElementById('catalog-reset')?.addEventListener('click',()=>{search.value='';queue.checked=false;filter();});filter();
  function reveal(){let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}if(target?.matches('details'))target.open=true;if(target)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));}
  addEventListener('hashchange',reveal);reveal();
  const dose=document.getElementById('dose-explorer');
  if(dose){const range=document.getElementById('dose-frames');function update(){const n=Number(range.value),d=n*1.2e-6;document.getElementById('dose-value').textContent=n;document.getElementById('dose-bar').style.setProperty('--fraction',`${Math.min(100,d/1.4e-5*100)}%`);dose.querySelector('.explorer-result').textContent=`${n} frames → ${(d*1e5).toFixed(2)} × 10⁻⁵ C/cm², ${(d/1.4e-5*100).toFixed(1)}% of the source’s reported reference. ${d>1.4e-5?'The arithmetic total exceeds that reference.':'The arithmetic total is below that reference.'} This count does not measure RNCC or establish damage absence.`;}range.addEventListener('input',update);update();}
  const mix=document.getElementById('mixture-explorer');
  if(mix){const w=document.getElementById('mix-weight'),s=document.getElementById('mix-slow'),f=document.getElementById('mix-fast'),canvas=mix.querySelector('canvas'),ctx=canvas.getContext('2d');
    function draw(){const ww=Number(w.value),ss=Number(s.value),ff=Number(f.value),styles=getComputedStyle(document.body),color=name=>styles.getPropertyValue(name).trim();document.getElementById('mix-w-value').textContent=ww.toFixed(2);document.getElementById('mix-s-value').textContent=ss;document.getElementById('mix-f-value').textContent=ff;
      ctx.clearRect(0,0,720,360);ctx.fillStyle=color('--soft');ctx.fillRect(0,0,720,360);ctx.strokeStyle=color('--line');ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(65,50);ctx.lineTo(65,285);ctx.lineTo(675,285);ctx.stroke();ctx.fillStyle=color('--ink');ctx.font='17px system-ui';ctx.fillText('Normalized magnetization M(t)',65,29);ctx.fillText('0',40,291);ctx.fillText('1',40,70);['0.1','1','10','100'].forEach((v,i)=>ctx.fillText(v,57+605*i/3,310));ctx.fillText('Time (ms), logarithmic',260,343);
      function plot(fn,name,dash=[]){ctx.strokeStyle=color(name);ctx.lineWidth=3;ctx.setLineDash(dash);ctx.beginPath();for(let i=0;i<=240;i++){const t=10**(-4+3*i/240),x=65+605*i/240,y=285-220*fn(t);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);}
      plot(t=>1-Math.exp(-ss*t),'--accent');plot(t=>1-Math.exp(-ff*t),'--warm',[7,5]);plot(t=>1-ww*Math.exp(-ss*t)-(1-ww)*Math.exp(-ff*t),'--v-purple');
      mix.querySelector('.explorer-result').textContent=`At t = 1 ms, M = ${(1-ww*Math.exp(-ss*.001)-(1-ww)*Math.exp(-ff*.001)).toFixed(3)}. Geometric log-rate center = ${Math.exp(ww*Math.log(ss)+(1-ww)*Math.log(ff)).toFixed(1)} s⁻¹; arithmetic mean = ${(ww*ss+(1-ww)*ff).toFixed(1)} s⁻¹. A smooth sum does not prove a unique underlying distribution.`;
    }[w,s,f].forEach(el=>el.addEventListener('input',draw));new MutationObserver(draw).observe(document.body,{attributes:true,attributeFilter:['class']});draw();
  }
})();
