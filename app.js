'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const topbar = document.querySelector('.topbar');
  if ('ResizeObserver' in window) new ResizeObserver(() => document.documentElement.style.setProperty('--nav-height', `${topbar.offsetHeight}px`)).observe(topbar);
  const svgStart = (title, desc) => `<title>${title}</title><desc>${desc}</desc>`;
  const line = (x1,y1,x2,y2,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
  const phases = {
    isotropic: {title:'Isotropic: neither an axis preference nor a density wave.',text:'Exchanging x and y leaves the ideal state unchanged.',translation:'Translations: preserved',rotation:'Rotation: C₄ preserved in this drawing'},
    nematic: {title:'Nematic: a direction without a density wave.',text:'Exchanging x and y changes the axis preference. Translating the ideal state does not reveal a repeating charge pattern.',translation:'Translations: preserved',rotation:'Rotation: C₄ → C₂'},
    stripe: {title:'Smectic / stripe: orientation plus a density wave.',text:'The density repeats perpendicular to the stripes. Translation along them remains liquid-like in this idealized smectic.',translation:'Translations: broken perpendicular to stripes',rotation:'Rotation: C₄ → C₂'},
    checkerboard: {title:'Checkerboard: a repeating density pattern in two directions.',text:'This equal-amplitude square pattern breaks translations in both directions, while preserving 90° rotation symmetry.',translation:'Translations: broken along both axes',rotation:'Rotation: C₄ preserved in this example'}
  };
  function phaseDrawing(type,rotated){
    let s=svgStart(`${type} symmetry ${rotated?'after a 90-degree rotation':'before rotation'}`,'A schematic of density modulation or preferred correlation orientation.');
    s+='<rect x="78" y="12" width="184" height="184" rx="5" fill="var(--soft)"/>';
    s+=`<g transform="rotate(${rotated?90:0} 170 104)">`;
    if(type==='stripe'){
      for(let i=0;i<9;i++) s+=`<rect x="80" y="${18+20*i}" width="180" height="9" fill="var(--accent)" opacity=".34"/>`;
    }else if(type==='checkerboard'){
      for(let x=0;x<9;x++) for(let y=0;y<9;y++) s+=`<rect x="${80+20*x}" y="${14+20*y}" width="20" height="20" fill="var(--accent)" opacity="${(x+y)%2?.10:.42}"/>`;
    }else if(type==='isotropic'){
      s+='<circle cx="170" cy="104" r="62" fill="var(--accent)" fill-opacity=".08" stroke="var(--accent)" stroke-width="3"/>';
    }else{
      for(let i=0;i<5;i++) for(let j=0;j<5;j++){
        const x=98+36*i, y=32+36*j,theta=0;
        s+=line((x-10*Math.cos(theta)).toFixed(1),(y-10*Math.sin(theta)).toFixed(1),(x+10*Math.cos(theta)).toFixed(1),(y+10*Math.sin(theta)).toFixed(1),'stroke="var(--accent)" stroke-width="4" stroke-linecap="round"');
      }
    }
    s+='</g>'+line(78,209,263,209,'class="grid-line"')+line(65,196,65,12,'class="grid-line"')+'<text x="272" y="214">x</text><text x="58" y="10">y</text>';
    return s;
  }
  function setPhase(type){
    const p=phases[type]; $('phase-original').innerHTML=phaseDrawing(type,false);$('phase-rotated').innerHTML=phaseDrawing(type,true);
    $('phase-result').innerHTML=`<strong>${p.title}</strong><p>${p.text}</p>`;$('translation-fact').textContent=p.translation;$('rotation-fact').textContent=p.rotation;
    document.querySelectorAll('[data-phase]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.phase===type)));
  }
  document.querySelectorAll('[data-phase]').forEach(b=>b.addEventListener('click',()=>setPhase(b.dataset.phase)));
  setPhase('nematic');

  let route=svgStart('Stripe melting route','Continuous parallel stripes become separated but similarly oriented stripe segments.');
  for(let i=0;i<5;i++) route+=`<path d="M${38+i*27} 25 Q${24+i*27} 80 ${39+i*27} 145" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>`;
  route+='<text x="211" y="88">→</text>';
  [[291,32,60],[326,51,99],[363,25,65],[393,48,80],[283,105,145],[320,122,154],[360,101,134],[395,122,151]].forEach(([x,y,z])=>{route+=`<path d="M${x} ${y} Q${x-8} ${(y+z)/2} ${x} ${z}" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>`;});
  route+='<text x="47" y="192">Stripe / smectic</text><text x="303" y="192">Nematic</text>';$('stripe-route').innerHTML=route;
  function updateFermi(){
    const v=Number($('distortion').value)/100,deg=Number($('angle').value),a=88*Math.exp(.52*v),b=88*Math.exp(-.52*v);
    $('fermi-ellipse').setAttribute('rx',a.toFixed(5));$('fermi-ellipse').setAttribute('ry',b.toFixed(5));$('fermi-ellipse').setAttribute('transform',`rotate(${-deg} 224 165)`);
    const rad=-deg*Math.PI/180;$('fermi-director').setAttribute('x1',(224-a*Math.cos(rad)).toFixed(5));$('fermi-director').setAttribute('x2',(224+a*Math.cos(rad)).toFixed(5));$('fermi-director').setAttribute('y1',(165-a*Math.sin(rad)).toFixed(5));$('fermi-director').setAttribute('y2',(165+a*Math.sin(rad)).toFixed(5));
    $('fermi-director').style.opacity=v===0?'0':'1';$('distortion-value').textContent=v.toFixed(2);$('angle-value').textContent=`${deg}°`;
    $('fermi-result').textContent=v===0?'Circular reference: no preferred director. Area ratio = 1.000.':`Elliptical: director ${deg}° is equivalent to ${deg+180}°. Area ratio = 1.000.`;
  }
  $('distortion').addEventListener('input',updateFermi);$('angle').addEventListener('input',updateFermi);updateFermi();

  function setOxygen(axis){
    let s=svgStart('Uniform nematic oxygen occupation',`All horizontal oxygen sites ${axis==='x'?'occupied':'empty'} and all vertical oxygen sites ${axis==='y'?'occupied':'empty'}. Copper sites are occupied. This is the model x equals one insulating endpoint.`);
    for(let j=0;j<4;j++) s+=line(66,48+74*j,366,48+74*j,'class="grid-line"');
    for(let i=0;i<4;i++) s+=line(66+100*i,48,66+100*i,270,'class="grid-line"');
    for(let j=0;j<4;j++)for(let i=0;i<4;i++){
      const x=66+100*i,y=48+74*j;s+=`<circle cx="${x}" cy="${y}" r="9" class="cu-site"/>`;
      if(i<3)s+=`<circle cx="${x+50}" cy="${y}" r="7" class="oxygen-${axis==='x'?'filled':'empty'}"/>`;
      if(j<3)s+=`<circle cx="${x}" cy="${y+37}" r="7" class="oxygen-${axis==='y'?'filled':'empty'}"/>`;
    }
    s+='<text x="128" y="322" class="svg-small">Equivalent unit cells · inequivalent axes</text>';$('emery-svg').innerHTML=s;
    $('oxygen-result').textContent=`O${axis==='x'?'ₓ':'ᵧ'} is occupied; O${axis==='x'?'ᵧ':'ₓ'} is empty. This is a uniform nematic insulator in the model.`;
    $('emery-svg').setAttribute('aria-label',`Cu–O lattice: O${axis} occupied, the other oxygen orientation empty`);
    document.querySelectorAll('[data-oxygen]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.oxygen===axis)));
  }
  document.querySelectorAll('[data-oxygen]').forEach(b=>b.addEventListener('click',()=>setOxygen(b.dataset.oxygen)));setOxygen('x');

  let regime='weak',geometry='layered';
  function updateDisorder(){
    let s=svgStart('Disorder regime cartoon','Density-wave fragments with phase offsets and different preferred orientations. This is an illustration, not a disorder simulation.');
    s+='<rect x="23" y="22" width="410" height="260" rx="5" fill="var(--bg)"/>';
    for(let j=0;j<5;j++)for(let i=0;i<8;i++){
      const x=27+50*i,y=26+50*j,seed=(i*13+j*7+5)%17;
      const vertical=regime==='clean'?false:(regime==='weak'&&geometry==='layered'?seed<3:(regime==='weak'?i>=4:((i+j)%2===0)));
      const phase=regime==='clean'?0:(seed*3)%14;
      s+=`<g transform="translate(${x} ${y})"><rect width="46" height="46" fill="${vertical?'var(--orange-soft)':'var(--soft)'}"/>`;
      for(let k=0;k<4;k++){
        const pos=4+k*10+phase/4;s+=vertical?line(pos,3,pos,43,'stroke="var(--orange)" stroke-width="3" opacity=".72"'):line(3,pos,43,pos,'stroke="var(--accent)" stroke-width="3" opacity=".72"');
      }s+='</g>';
    }
    s+='<text x="29" y="315" class="svg-small">Phase offsets and local axis choice · schematic</text>';$('disorder-svg').innerHTML=s;
    let title,status,text,formula;
    if(regime==='clean'){
      status='Clean stripe reference';title='Position and direction are ordered.';text='At low enough temperature, the clean model can have a stripe phase. An isolated incommensurate 2D layer at nonzero temperature has only quasi-long-range positional order; lattice commensurability changes this.';
      formula='<span>One CDW orientation dominates</span><strong>Stripe position + axis preference</strong>';
    }else if(regime==='weak'&&geometry==='layered'){
      status='Vestigial nematic is possible';title='Position is scrambled; direction survives.';text='With nonzero layer coupling, weak disorder can remove conventional long-range stripe order while a discrete nematic preference survives below a critical disorder strength.';
      formula='<span>⟨ψₓ⟩ = ⟨ψᵧ⟩ = 0</span><strong>N ∝ ⟨|ψₓ|²⟩ − ⟨|ψᵧ|²⟩ ≠ 0</strong>';
    }else if(regime==='weak'){
      status='Local domains; no macroscopic long-range order';title='An isolated 2D layer is a different limit.';text='Any nonzero random field prevents macroscopic Ising nematic long-range order in strict 2D. Finite regions can still show a preferred local axis; their size is not computed here.';
      formula='<span>Oriented local correlations can remain</span><strong>Macroscopic nematic LRO is forbidden</strong>';
    }else{
      status='Disorder beyond the ordering regime';title='Local fragments; no global preference.';text='Beyond the layered model’s critical disorder, nematic long-range order is lost. This balanced cartoon illustrates axis cancellation, without calculating the critical value or the local correlation length.';
      formula='<span>⟨ψₓ⟩ = ⟨ψᵧ⟩ = 0</span><strong>Macroscopic N = 0 · schematic</strong>';
    }
    $('disorder-status').textContent=status;$('disorder-title').textContent=title;$('disorder-text').textContent=text;document.querySelector('.disorder-lab .formula').innerHTML=formula;
    document.querySelectorAll('[data-disorder]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.disorder===regime)));document.querySelectorAll('[data-geometry]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.geometry===geometry)));
  }
  document.querySelectorAll('[data-disorder]').forEach(b=>b.addEventListener('click',()=>{regime=b.dataset.disorder;updateDisorder();}));document.querySelectorAll('[data-geometry]').forEach(b=>b.addEventListener('click',()=>{geometry=b.dataset.geometry;updateDisorder();}));updateDisorder();

  const domains=Array.from({length:36},(_,i)=>i%6<3?1:-1);
  function updateDomains(){
    const m=domains.reduce((a,b)=>a+b,0)/36;$('domain-m').textContent=`m = ${m.toFixed(2)}`;$('balance-fill').style.width=`${50*(1+m)}%`;
    $('domain-description').textContent=m===0?'Equal orientation populations cancel.':`${Math.round(domains.filter(v=>v===1).length/36*100)}% vertical; ${m>0?'vertical':'horizontal'} orientation is more common.`;
    Array.from($('domain-grid').children).forEach((b,i)=>{const orientation=domains[i]===1?'vertical':'horizontal';b.dataset.orientation=orientation;b.setAttribute('aria-label',`Patch row ${Math.floor(i/6)+1}, column ${i%6+1}: ${orientation}. Activate to rotate.`);});
  }
  domains.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.addEventListener('click',()=>{domains[i]*=-1;updateDomains();});$('domain-grid').appendChild(b);});
  document.querySelectorAll('[data-domain]').forEach(b=>b.addEventListener('click',()=>{domains.forEach((_,i)=>domains[i]=b.dataset.domain==='balanced'?(i%6<3?1:-1):(b.dataset.domain==='vertical'?1:-1));updateDomains();}));updateDomains();

  const cards=Array.from(document.querySelectorAll('.paper-card'));
  function filterPapers(){
    const q=$('paper-search').value.toLocaleLowerCase().trim(),type=$('paper-type').value;let n=0;
    cards.forEach(c=>{const show=c.textContent.toLocaleLowerCase().includes(q)&&(type==='all'||c.dataset.type.startsWith(type));c.hidden=!show;if(show)n++;});
    $('paper-count').textContent=`Showing ${n} of 6 papers.`;$('no-papers').hidden=n!==0;
  }
  $('paper-search').addEventListener('input',filterPapers);$('paper-type').addEventListener('change',filterPapers);$('clear-search').addEventListener('click',()=>{$('paper-search').value='';$('paper-type').value='all';filterPapers();});
  function revealPaper(){if(/^#paper-\d+$/.test(location.hash)){const c=document.querySelector(location.hash);if(c){$('paper-search').value='';$('paper-type').value='all';filterPapers();c.hidden=false;requestAnimationFrame(()=>c.scrollIntoView());}}}
  window.addEventListener('hashchange',revealPaper);revealPaper();
  $('theme').addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';$('theme').setAttribute('aria-pressed',String(dark));$('theme').textContent=dark?'Light view':'Dark view';});
})();
