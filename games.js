// Retos de cada día (se juegan antes de abrir la carta). Ninguno repite los juegos del PIN.
(()=>{
const sh=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const shake=e=>e.animate([{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'none'}],200);
const el=(tag,cls,html,par,fn)=>{const e=document.createElement(tag);e.className=cls||'';e.innerHTML=html??'';if(fn)e.onclick=()=>fn(e);if(par)par.append(e);return e};
// pregunta con opciones: la primera de la lista es la correcta; se barajan al mostrarlas
const choice=(b,q,opts,c,next)=>{b.innerHTML=`<p>${q}</p>`;sh(opts.map((o,i)=>[o,i==0])).forEach(([o,r])=>el('button','gbtn',o,b,x=>{if(r)next();else{shake(x);c.fail()}}))};
const TRIVIA=[
 [['¿De qué color es el traje de Papá Noel?',['Rojo','Verde','Azul']],['¿Qué se pone en lo alto del árbol?',['Una estrella','Un zapato','Un queso']],['¿Qué cae del cielo en invierno?',['Nieve','Arena','Confeti']]],
 [['¿Cuántos Reyes Magos hay?',['3','2','5']],['¿Qué día es Nochebuena?',['24 de diciembre','1 de enero','6 de enero']],['¿Qué dulce típico se come en Navidad en España?',['Turrón','Helado de limón','Chicle']]],
 [['¿Cómo se llama el reno de la nariz roja?',['Rodolfo','Manolo','Pepito']],['¿Qué se canta en Navidad?',['Villancicos','Rock duro','Ópera']],['¿Cuántas uvas se comen en Nochevieja?',['12','7','24']]]];
const G={
scratch(b,v,c){const e=['🎁','⭐','🎄'][v];
  b.innerHTML=`<p>Rasca la tarjeta con el dedo</p><div class="gcv"><span>${e}</span><canvas></canvas></div>`;
  const cv=b.querySelector('canvas'),w=cv.width=600,h=cv.height=300,x=cv.getContext('2d');
  const gr=x.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#b9bec4');gr.addColorStop(1,'#8d949b');x.fillStyle=gr;x.fillRect(0,0,w,h);
  x.fillStyle='#fff8';x.font='700 56px Georgia';x.textAlign='center';x.fillText('¡RASCA!',w/2,h/2+18);
  x.globalCompositeOperation='destination-out';let d=false;
  const sc=ev=>{if(!d)return;const r=cv.getBoundingClientRect();x.beginPath();x.arc((ev.clientX-r.left)*w/r.width,(ev.clientY-r.top)*h/r.height,32,0,7);x.fill()};
  const chk=()=>{const a=x.getImageData(0,0,w,h).data;let z=0;for(let i=3;i<a.length;i+=16)if(a[i]==0)z++;if(z/(a.length/16)>.5)c.ok()};
  cv.onpointerdown=ev=>{d=true;cv.setPointerCapture(ev.pointerId);sc(ev)};cv.onpointermove=sc;cv.onpointerup=cv.onpointercancel=()=>{d=false;chk()}},
trivia(b,v,c){const Q=TRIVIA[v];let i=0;const go=()=>{if(i==Q.length)return c.ok();const [q,o]=Q[i++];choice(b,q,o,c,go)};go()},
anagram(b,v,c){const w=['NAVIDAD','TURRON'][v];let i=0,L=[...w];do L=sh(L);while(L.join('')==w);
  b.innerHTML='<p>Toca las letras en orden para formar la palabra de Navidad</p><div class="gs"></div><div class="gl"></div>';
  const sl=b.querySelector('.gs'),gl=b.querySelector('.gl');[...w].forEach(()=>el('span','gslot','',sl));
  L.forEach(ch=>el('button','gbtn row',ch,gl,x=>{if(ch==w[i]){sl.children[i].textContent=ch;x.disabled=true;x.style.opacity=.3;if(++i==w.length)c.ok()}else{shake(x);c.fail()}}))},
count(b,v,c){const [t,d]=[['⭐','🎄'],['🎁','🔔']][v],n=ri(5,9),pos=sh([...Array(40).keys()]);
  b.innerHTML=`<p>¿Cuántos ${t} hay?</p><div class="gcnt"></div><div class="gl"></div>`;const g=b.querySelector('.gcnt');
  for(let i=0;i<40;i++){const k=pos.indexOf(i);el('span','',k<n?t:k<n+14?d:'&nbsp;',g)}
  sh([n,n-1,n+1,n+2]).forEach(x=>el('button','gbtn row',x,b.querySelector('.gl'),y=>{x==n?c.ok():(shake(y),c.fail())}))},
drag(b,v,c){const [z,it]=[['🎄',['🔔','⭐','🎁','🍬']],['🛷',['🎁','🎁','🎁','🎁','🎁']]][v];let n=0;
  b.innerHTML=`<p>Arrastra todo hasta ${z}</p><div class="gz">${z}</div><div class="gitems"></div>`;
  const zone=b.querySelector('.gz'),box=b.querySelector('.gitems');
  it.forEach(e=>{const s=el('span','gi',e,box);let sx,sy;
    s.onpointerdown=ev=>{s.setPointerCapture(ev.pointerId);sx=ev.clientX;sy=ev.clientY;s.style.zIndex=5};
    s.onpointermove=ev=>{if(s.hasPointerCapture(ev.pointerId))s.style.transform=`translate(${ev.clientX-sx}px,${ev.clientY-sy}px)`};
    s.onpointerup=()=>{const r=zone.getBoundingClientRect(),q=s.getBoundingClientRect(),cx=q.left+q.width/2,cy=q.top+q.height/2;
      if(cx>r.left&&cx<r.right&&cy>r.top&&cy<r.bottom){s.remove();if(++n==it.length)c.ok()}else{s.style.transform='';s.style.zIndex=1}}})},
math(b,v,c){let n=0;const go=()=>{if(n++==3)return c.ok();let x,y,t,r;
  if(v==0){x=ri(2,9);y=ri(2,9);t=`${x} + ${y}`;r=x+y}
  else{const k=ri(0,2);if(k==0){x=ri(3,9);y=ri(2,5);t=`${x+y} − ${y}`;r=x}else if(k==1){x=ri(3,9);y=ri(2,5);t=`${x} × ${y}`;r=x*y}else{x=ri(10,30);y=ri(5,9);t=`${x} + ${y}`;r=x+y}}
  const bad=[r+1,r-1,r+2,r+10,r-2].filter(z=>z>0);choice(b,`¿Cuánto es ${t}? (${n}/3)`,[r,...bad.slice(0,3)].map(String),c,go)};go()},
slider(b,v,c){const N=[3,4][v],T=Array.from({length:N},()=>ri(1,9)),R=[];
  b.innerHTML=`<p>Abre el candado 🔓: pon los controles en <b>${T.join(' · ')}</b></p>`;
  T.forEach(()=>{const r=el('div','gsl','',b),sp=el('b','','0',r),i=document.createElement('input');i.type='range';i.min=0;i.max=9;i.value=0;
    i.oninput=()=>{sp.textContent=i.value;if(R.every((x,j)=>+x.value==T[j]))setTimeout(c.ok,300)};r.append(i);R.push(i)})},
tap(b,v,c){const [N,S]=[[20,6],[30,7]][v];let n=0,t0=0,iv;
  b.innerHTML=`<p>Toca el botón ${N} veces en ${S} segundos</p><div class="gbar"><i></i></div><button class="gtap"></button>`;
  const bt=b.querySelector('.gtap'),bar=b.querySelector('i');
  const rs=()=>{clearInterval(iv);n=0;t0=0;bt.textContent='¡Empieza a tocar!';bar.style.width=0};rs();
  bt.onclick=()=>{if(!t0){t0=Date.now();iv=setInterval(()=>{if(Date.now()-t0>S*1000){rs();c.fail()}},100)}
    n++;bt.textContent=n+' / '+N;bar.style.width=n/N*100+'%';if(n>=N){clearInterval(iv);c.ok()}}},
stroop(b,v,c){const C=[['ROJO','#e53935'],['VERDE','#43a047'],['AZUL','#1e88e5'],['AMARILLO','#f9a825']],T=[5,7][v];let n=0;
  const go=()=>{if(n++==T)return c.ok();const w=C[ri(0,3)];let k=C[ri(0,3)];while(k==w)k=C[ri(0,3)];
    b.innerHTML=`<p>¿De qué <b>color</b> está escrita la palabra? (${n}/${T})</p><div class="gwrd" style="color:${k[1]}">${w[0]}</div>`;
    C.forEach(o=>el('button','gbtn row',o[0],b,x=>{if(o==k)go();else{shake(x);c.fail()}}))};go()},
swap(b,v,c){const N=[6,8][v];let a;do a=sh([...Array(N).keys()].map(i=>i+1));while(a.every((x,i)=>x==i+1));let s=-1;
  b.innerHTML=`<p>Toca dos piezas para intercambiarlas y ordénalas del 1 al ${N}</p><div class="gg ${N==6?'gg3':'gg4'}"></div>`;const g=b.querySelector('.gg');
  const draw=()=>{g.innerHTML='';a.forEach((x,i)=>el('button','gtile'+(i==s?' sel':''),x,g,()=>{if(s<0)s=i;else{[a[s],a[i]]=[a[i],a[s]];s=-1}draw();if(a.every((y,j)=>y==j+1))c.ok()}))};draw()},
hold(b,v,c){const T=[2500,4000][v];let t0=0,raf=0;
  b.innerHTML='<p>Mantén pulsado hasta que se llene la barra</p><div class="gbar"><i></i></div><button class="gtap">Mantén pulsado 👇</button>';
  const bt=b.querySelector('.gtap'),bar=b.querySelector('i');
  const step=()=>{const p=Math.min(1,(performance.now()-t0)/T);bar.style.width=p*100+'%';if(p>=1)c.ok();else raf=requestAnimationFrame(step)};
  const stop=()=>{if(!t0)return;cancelAnimationFrame(raf);const ok=bar.style.width=='100%';t0=0;if(!ok){bar.style.width=0;c.fail()}};
  bt.onpointerdown=e=>{bt.setPointerCapture(e.pointerId);t0=performance.now();step()};bt.onpointerup=bt.onpointercancel=stop;bt.oncontextmenu=e=>e.preventDefault()}
};
// Reto de cada día (1..24): [juego, variante]
const SPEC=[['scratch',0],['trivia',0],['anagram',0],['count',0],['drag',0],['math',0],['slider',0],['tap',0],['stroop',0],['swap',0],['hold',0],['scratch',1],
 ['trivia',1],['anagram',1],['count',1],['drag',1],['math',1],['slider',1],['tap',1],['stroop',1],['swap',1],['hold',1],['trivia',2],['scratch',2]];
// preview=true: el botón de saltar sale desde el principio (modo prueba / vista previa)
window.playGame=(day,box,done,preview)=>{
  const [k,v]=SPEC[day-1];let fails=0,fin=false,t;
  box.innerHTML='<p class="gt">Antes de abrir el sobre, un pequeño reto…</p><div class="gb"></div><button class="gskip" hidden>Saltar reto →</button>';
  const area=box.querySelector('.gb'),sk=box.querySelector('.gskip');
  const end=msg=>{if(fin)return;fin=true;clearTimeout(t);if(msg){box.innerHTML='<p class="gt">✨ ¡Superado!</p>';setTimeout(done,700)}else done()};
  const ctx={ok:()=>end(true),fail:()=>{if(++fails>=3)sk.hidden=false}};
  sk.onclick=()=>end(false);t=setTimeout(()=>sk.hidden=false,25000);if(preview)sk.hidden=false;
  G[k](area,v,ctx)};
})();
