'use strict';
(() => {
  const header = document.querySelector('.library-bar');
  if (header && window.ResizeObserver) new ResizeObserver(() => document.documentElement.style.setProperty('--nav-height', header.offsetHeight + 'px')).observe(header);
  const theme = document.getElementById('library-theme');
  theme?.addEventListener('click', () => {const dark=document.body.classList.toggle('dark');theme.setAttribute('aria-pressed',String(dark));theme.textContent=dark?'Light view':'Dark view';});
  const search = document.getElementById('paper-search'), select = document.getElementById('topic-filter');
  function filter(){let n=0;document.querySelectorAll('.catalog-item').forEach(item=>{const show=(!select.value||item.dataset.topic===select.value)&&item.textContent.toLowerCase().includes(search.value.toLowerCase().trim());item.hidden=!show;n+=show;});document.getElementById('catalog-count').textContent=`${n} paper${n===1?'':'s'} shown`;}
  search?.addEventListener('input',filter);select?.addEventListener('change',filter);
  document.getElementById('reset-search')?.addEventListener('click',()=>{search.value='';select.value='';filter();search.focus();});
  document.getElementById('expand-study')?.addEventListener('click',()=>document.querySelectorAll('details.study-more').forEach(d=>d.open=true));
  document.getElementById('collapse-study')?.addEventListener('click',()=>document.querySelectorAll('details.study-more').forEach(d=>d.open=false));
  function openTarget(hash){const target=document.getElementById(hash.slice(1));if(target?.matches('details'))target.open=true;}
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>openTarget(a.getAttribute('href'))));
  addEventListener('hashchange',()=>openTarget(location.hash));openTarget(location.hash);
  const oldIDs = ['35','1','3','22','25','296'];
  if(document.body.dataset.page==='hub' && oldIDs.some(id=>location.hash===`#paper-${id}`))location.replace(`topics/nematicity/index.html${location.hash}`);
  document.querySelectorAll('[data-widget]').forEach(widget=>{
    const canvas=widget.querySelector('canvas'),ctx=canvas.getContext('2d');
    function axes(xlabel,ylabel){ctx.clearRect(0,0,600,330);ctx.fillStyle='#fff';ctx.fillRect(0,0,600,330);ctx.strokeStyle='#b4c2c0';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(55,25);ctx.lineTo(55,280);ctx.lineTo(580,280);ctx.stroke();ctx.fillStyle='#334f52';ctx.font='14px system-ui';ctx.fillText(xlabel,230,314);ctx.fillText(ylabel,60,17);}
    function plot(fn,color,ymax=1){ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=200;i++){const x=i/200,y=fn(x);i?ctx.lineTo(55+525*x,280-245*y/ymax):ctx.moveTo(55,280-245*y/ymax);}ctx.stroke();}
    function draw(){
      const kind=widget.dataset.widget,controls=[...widget.querySelectorAll('input')],values=controls.map(i=>Number(i.value));controls.forEach((c,i)=>widget.querySelector(`output[for="${c.id}"]`).textContent=values[i].toFixed(2));
      const status=widget.querySelector('.widget-status');
      if(kind==='pairing'){const theta=values[0],d=Math.cos(2*theta*Math.PI/180);axes('Angle around a circular teaching Fermi surface (0–360°)','Signed gap Δ/Δ₀');ctx.strokeStyle='#aebdb9';ctx.beginPath();ctx.moveTo(55,157);ctx.lineTo(580,157);ctx.stroke();plot(x=>(1+Math.cos(4*Math.PI*x))/2,'#077d76');ctx.fillStyle='#bc542a';ctx.beginPath();ctx.arc(55+525*theta/360,280-245*(1+d)/2,6,0,2*Math.PI);ctx.fill();ctx.fillStyle='#334f52';ctx.fillText('+1',22,40);ctx.fillText('0',35,162);ctx.fillText('−1',22,284);status.textContent=`At θ = ${theta.toFixed(0)}°, Δ/Δ₀ = ${d.toFixed(2)}. At θ + 90° it is ${(-d).toFixed(2)}. Diagonal nodes occur at 45°, 135°, 225° and 315°.`;}
      if(kind==='criticality'){const detuning=values[0],t=values[1],xi=1/Math.max(Math.abs(detuning),0.001),lt=1/t;axes('Detuning g − gc (−1 to +1)','Reduced temperature (0 to 1)');plot(x=>Math.abs(2*x-1),'#077d76');ctx.fillStyle='#bc542a';ctx.beginPath();ctx.arc(55+525*(detuning+1)/2,280-245*t,6,0,2*Math.PI);ctx.fill();status.textContent=`ξ/a ≈ ${Math.abs(detuning)<0.001?'∞':xi.toFixed(1)}, ℓT/a = ${lt.toFixed(1)}. ${lt<xi?'ℓT < ξ: critical side of the toy crossover.':'ℓT ≥ ξ: detuned side of the toy crossover.'} Model uses z = ν = 1 and arbitrary scale factors; no material boundary is fitted.`;}
      if(kind==='pseudogap'){const gap=values[0];axes('Energy E/Ewindow (−1 to +1)','Normalized density of states');plot(x=>gap===0?1:Math.min(Math.abs(2*x-1)/gap,1),'#077d76');status.textContent=`The triangular depletion has half-width ${gap.toFixed(2)} of the teaching energy window. Missing weight inside this window is not redistributed in this toy DOS. This is not a calculation or fit of Cel or the experimental entropy.`;}
      if(kind==='impurities'){const th=values[0];axes('Reduced temperature t (0.10 to 1)','Normalized susceptibility');plot(x=>0.1/(0.1+0.9*x),'#b6c6c2');plot(x=>0.1/(0.1+0.9*x+th),'#077d76');status.textContent=`χ/C = 1/(t + θ) with θ = ${th.toFixed(2)}; grey is θ = 0. Positive θ reduces the Curie upturn. Both axes use arbitrary dimensionless units, with no zero-temperature extrapolation or fit to data.`;}
      if(kind==='stripes'){const ay=values[0];ctx.clearRect(0,0,600,330);for(let x=0;x<600;x+=4)for(let y=0;y<300;y+=4){const z=(Math.cos(2*Math.PI*x/60)+ay*Math.cos(2*Math.PI*y/60))/(1+ay);ctx.fillStyle=`hsl(174 40% ${55+25*z}%)`;ctx.fillRect(x,y,4,4);}ctx.fillStyle='#334f52';ctx.font='14px system-ui';ctx.fillText('Uniform teaching amplitudes Ax = 1; Ay = slider',100,322);const eta=(1-ay*ay)**2/(1+ay*ay)**2;status.textContent=`Local amplitude imbalance = ${eta.toFixed(2)}. At Ay = 0 only one modulation is present; at Ay = 1 both amplitudes are equal. No disorder, Fourier filtering or inferred clean-limit classification is computed.`;}
    }
    widget.querySelectorAll('input').forEach(i=>i.addEventListener('input',draw));draw();
  });
})();
