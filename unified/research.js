'use strict';
(() => {
  const root=document.documentElement,theme=document.querySelector('.theme'),THEME='papers-unified-theme-v1';
  function applyTheme(dark){document.body.classList.toggle('dark',dark);theme?.setAttribute('aria-pressed',String(dark));if(theme)theme.textContent=dark?'Light theme':'Dark theme';}
  try{applyTheme(localStorage.getItem(THEME)==='dark');}catch{applyTheme(false);}
  theme?.addEventListener('click',()=>{const dark=!document.body.classList.contains('dark');applyTheme(dark);try{localStorage.setItem(THEME,dark?'dark':'light');}catch{}});
  const bar=document.querySelector('.bar');if(bar)new ResizeObserver(()=>root.style.setProperty('--nav-height',Math.ceil(bar.getBoundingClientRect().height)+'px')).observe(bar);
  document.querySelectorAll('.bar nav a').forEach(a=>{if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');});
  const search=document.getElementById('catalog-search'),section=document.getElementById('catalog-section'),sub=document.getElementById('catalog-subsection'),unchecked=document.getElementById('catalog-unchecked'),cards=[...document.querySelectorAll('#catalog [data-progress-id]')];let checked=[];
  function filter(){if(!search)return;const query=search.value.trim().toLocaleLowerCase(),terms=query.split(/\s+/).filter(Boolean);let visible=0,sources=0,units=0;cards.forEach(c=>{const match=terms.every(t=>c.dataset.search.includes(t))&&(!section.value||c.dataset.section===section.value)&&(!sub.value||c.dataset.subsection===sub.value)&&(!unchecked.checked||!checked.includes(c.dataset.progressId));c.hidden=!match;if(match){visible++;c.dataset.progressId.includes('-')?units++:sources++;}});document.querySelector('.catalog-count').textContent=`${visible} guides shown: ${sources} source guides and ${units} thesis units.`;}
  window.materialsFilter=values=>{checked=values;filter();};
  [search,section,sub,unchecked].forEach(el=>el?.addEventListener(el===search?'input':'change',filter));
  document.getElementById('catalog-reset')?.addEventListener('click',()=>{search.value='';section.value='';sub.value='';unchecked.checked=false;filter();search.focus();});filter();
  const termSearch=document.getElementById('concept-search');termSearch?.addEventListener('input',()=>{const q=termSearch.value.toLocaleLowerCase().trim();document.querySelectorAll('.concept').forEach(c=>c.hidden=!c.textContent.toLocaleLowerCase().includes(q));});
  const dialog=document.createElement('dialog');dialog.className='source-dialog';dialog.setAttribute('aria-label','Enlarged original source page');const close=document.createElement('button');close.type='button';close.textContent='Close original page ×';const caption=document.createElement('p'),slot=document.createElement('div');slot.className='source-page-scroll';slot.tabIndex=0;slot.setAttribute('role','region');slot.setAttribute('aria-label','Original source page; scroll to read');dialog.append(close,caption,slot);document.body.append(dialog);close.addEventListener('click',()=>dialog.close());
  document.querySelectorAll('.source-enlarge').forEach(b=>b.addEventListener('click',()=>{const figure=b.closest('figure'),img=figure.querySelector('img').cloneNode(true);img.loading='eager';caption.textContent=img.alt+'. Scroll horizontally on a small screen, or open the original PDF page link in the guide.';slot.replaceChildren(img);dialog.showModal();}));
})();

(() => {
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
