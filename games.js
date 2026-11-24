// Retos de cada día (se juegan antes de abrir la carta). Ninguno repite los juegos del PIN.
(()=>{
const sh=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
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
  bt.onpointerdown=e=>{bt.setPointerCapture(e.pointerId);t0=performance.now();step()};bt.onpointerup=bt.onpointercancel=stop;bt.oncontextmenu=e=>e.preventDefault()},
// ---- los 6 juegos del PIN, simplificados ----
pairs(b,v,c){let open=[],found=0,lock=false;b.innerHTML='<p>Encuentra las 4 parejas</p><div class="gg gg4"></div>';const g=b.querySelector('.gg');
  sh(['🎄','⭐','🎁','🔔','🎄','⭐','🎁','🔔']).forEach(e=>el('button','gtile gcard','❔',g,x=>{
    if(lock||x.dataset.o)return;x.textContent=e;x.dataset.o=1;open.push(x);
    if(open.length==2){lock=true;const [p,q]=open;open=[];
      if(p.textContent==q.textContent){lock=false;if(++found==4)setTimeout(c.ok,400)}
      else setTimeout(()=>{[p,q].forEach(y=>{y.textContent='❔';delete y.dataset.o});lock=false},700)}}))},
flake(b,v,c){const N=5;let n=0;b.innerHTML=`<p id="gc">Atrapa los copos: 0 / ${N}</p><div class="gfield"></div>`;
  const fl=b.querySelector('.gfield'),p=b.querySelector('#gc');
  const f=el('button','gfl','❄️',fl,()=>{n++;p.textContent=`Atrapa los copos: ${n} / ${N}`;if(n>=N){clearInterval(iv);c.ok()}else mv()});
  const mv=()=>{f.style.left=Math.random()*75+'%';f.style.top=Math.random()*70+'%'};mv();
  const iv=setInterval(()=>{if(!f.isConnected)clearInterval(iv);else mv()},1100)},
gifts(b,v,c){const N=5;let n=1,ok=false;b.innerHTML='<p id="gm"></p><div class="gg gg3"></div>';const m=b.querySelector('#gm'),g=b.querySelector('.gg');
  const bs=Array.from({length:N},()=>el('button','gtile gcard','🎁<small></small>',g,x=>{if(!ok)return;
    if(x.v==n){x.classList.add('okk');x.disabled=true;if(++n>N)c.ok()}else{shake(x);c.fail();start()}}));
  const start=async()=>{ok=false;n=1;sh([...Array(N).keys()].map(i=>i+1)).forEach((q,i)=>{const x=bs[i];x.v=q;x.querySelector('small').textContent=q;x.classList.remove('okk');x.disabled=false;x.classList.add('show')});
    m.textContent='Memoriza los números…';await wait(2600);bs.forEach(x=>x.classList.remove('show'));ok=true;m.textContent=`Toca del 1 al ${N} en orden`};start()},
odd(b,v,c){const s=6,k=ri(0,s*s-1);b.innerHTML=`<p>Encuentra el distinto</p><div class="gg" style="--n:${s};grid-template-columns:repeat(${s},1fr)"></div>`;
  const g=b.querySelector('.gg'),cs=[];for(let i=0;i<s*s;i++)cs.push(el('button','gcell',i==k?'🌲':'🎄',g,x=>{if(i==k){clearInterval(iv);c.ok()}else{shake(x);c.fail()}}));
  const iv=setInterval(()=>{if(!g.isConnected)return clearInterval(iv);cs.forEach(x=>x.style.opacity=Math.random()<.15?0:1)},600)},
timing(b,v,c){const W=[22,15,10];let n=0,x=0,dir=1,zs=0,last=performance.now(),raf;
  b.innerHTML='<p id="gc">Nivel 1 / 3 · Pulsa ¡YA! con la barra en la zona verde</p><div class="gbarz"><div class="gzone"></div><div class="gmk"></div></div><button class="gtap">¡YA!</button>';
  const mk=b.querySelector('.gmk'),zone=b.querySelector('.gzone'),bt=b.querySelector('.gtap');
  const setZ=()=>{zs=4+Math.random()*(92-W[n]);zone.style.width=W[n]+'%';zone.style.left=zs+'%'};setZ();
  const loop=t=>{if(!mk.isConnected)return;x+=dir*(1+n*.3)*(t-last)/16.7;last=t;if(x>=100){x=100;dir=-1}if(x<=0){x=0;dir=1}mk.style.left=x+'%';raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  bt.onclick=()=>{if(x>=zs&&x<=zs+W[n]){if(++n==3){cancelAnimationFrame(raf);c.ok()}else{b.querySelector('#gc').textContent=`Nivel ${n+1} / 3 · Pulsa ¡YA! con la barra en la zona verde`;setZ()}}else{shake(b.querySelector('.gbarz'));c.fail()}}},
simon(b,v,c){const LEN=5,cols=['#e53935','#43a047','#1e88e5','#fdd835'],seq=Array.from({length:LEN},()=>ri(0,3));let i=0,ok=false; // directo al último nivel
  b.innerHTML='<p id="gm"></p><div class="gg gg2"></div>';const m=b.querySelector('#gm');
  const flash=async k=>{ps[k].classList.add('lit');await wait(380);ps[k].classList.remove('lit')};
  const play=async()=>{i=0;ok=false;m.textContent='Mira la secuencia…';await wait(900);for(const k of seq){if(!m.isConnected)return;await flash(k);await wait(220)}m.textContent='¡Tu turno! Repítela';ok=true};
  const ps=cols.map((col,k)=>{const p=el('button','gpad','',b.querySelector('.gg'),()=>{if(!ok)return;flash(k);
    if(k==seq[i]){if(++i==LEN){ok=false;setTimeout(c.ok,500)}}else{ok=false;shake(b);c.fail();setTimeout(play,700)}});p.style.background=col;return p});
  play()},
// ---- retos nuevos ----
react(b,v,c){let n=0,st=0,to,lock=false;b.innerHTML='<p>Espera a que se ponga en verde y toca lo más rápido que puedas (3 veces)</p><button class="gtap"></button>';const bt=b.querySelector('.gtap');
  const arm=()=>{lock=false;st=0;bt.style.background='#c62828';bt.textContent='Espera… 🔴';to=setTimeout(()=>{bt.style.background='#2e7d32';bt.textContent='¡YA! 🟢';st=Date.now()},ri(1200,3200))};
  bt.onclick=()=>{if(lock)return;lock=true;
    if(!st){clearTimeout(to);c.fail();bt.textContent='¡Demasiado pronto!';return void setTimeout(arm,900)}
    if(Date.now()-st>1000){c.fail();bt.textContent='¡Muy lento!';return void setTimeout(arm,900)}
    if(++n==3)return c.ok();bt.textContent=`¡Bien! ${n} / 3`;setTimeout(arm,800)};arm()},
guess(b,v,c){const t=ri(1,30);let tries=0;
  b.innerHTML='<p>Estoy pensando un número del 1 al 30. ¿Cuál es? Te diré si es más alto o más bajo.</p><div class="gwrd" id="gh" style="font-size:40px">?</div><input class="gin" type="number" inputmode="numeric" min="1" max="30"> <button class="gbtn row">Probar</button>';
  const inp=b.querySelector('input'),h=b.querySelector('#gh');
  b.querySelector('button').onclick=()=>{const n=+inp.value;if(!n)return;tries++;if(n==t)return c.ok();h.textContent=n<t?'⬆️ Más alto':'⬇️ Más bajo';inp.value='';if(tries>=6)c.fail()}},
shadow(b,v,c){const E=['🎅','🦌','⛄','🎄','🔔','🎁','⭐','🧦'];let n=0;
  const go=()=>{if(n++==3)return c.ok();const t=sh(E).slice(0,4),a=t[0];
    b.innerHTML=`<p>¿De quién es esta sombra? (${n}/3)</p><div class="gwrd" style="filter:brightness(0);font-size:110px">${a}</div><div class="gl"></div>`;
    sh(t).forEach(e=>el('button','gbtn row big',e,b.querySelector('.gl'),x=>{if(e==a)go();else{shake(x);c.fail()}}))};go()},
pattern(b,v,c){const Q=sh([[2,4,6,8],[5,10,15,20],[1,3,5,7],[3,6,9,12],[10,20,30,40],[1,2,4,8]]).slice(0,3);let n=0;
  const go=()=>{if(n==3)return c.ok();const s=Q[n++],a=s[3],bad=[a+1,a-1,a+2,a+5].filter(z=>z>0&&z!=a).slice(0,3);
    choice(b,`¿Qué número sigue? (${n}/3)<br><b style="font-size:34px">${s.slice(0,3).join(', ')}, ?</b>`,[a,...bad].map(String),c,go)};go()},
sort(b,v,c){const L=sh([['🎄','N'],['⛄','N'],['🎅','N'],['🎁','N'],['🌴','V'],['🍦','V'],['🕶️','V'],['🍉','V']]).slice(0,6);let n=0;
  const go=()=>{if(n==6)return c.ok();const [e,k]=L[n];b.innerHTML=`<p>¿Es de Navidad o de verano? (${n+1}/6)</p><div class="gwrd">${e}</div>`;
    [['🎄 Navidad','N'],['☀️ Verano','V']].forEach(([t,kk])=>el('button','gbtn row',t,b,x=>{if(kk==k){n++;go()}else{shake(x);c.fail()}}))};go()},
colors(b,v,c){const C=['#e53935','#43a047','#1e88e5','#fdd835'];let tg;do tg=[0,0,0,0].map(()=>ri(0,3));while(tg.every(x=>x==0));const cur=[0,0,0,0];
  b.innerHTML='<p>Modelo:</p><div class="gdots"></div><p>Toca tus círculos para cambiar el color hasta igualar el modelo:</p><div class="gdots"></div>';
  const [m,mi]=b.querySelectorAll('.gdots');tg.forEach(x=>{el('span','gdot','',m).style.background=C[x]});
  cur.forEach((_,i)=>{const d=el('button','gdot','',mi,()=>{cur[i]=(cur[i]+1)%4;d.style.background=C[cur[i]];if(cur.every((y,j)=>y==tg[j]))setTimeout(c.ok,300)});d.style.background=C[0]})},
ttt(b,v,c){let B=Array(9).fill(''),over=false;const W=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const win=p=>W.some(l=>l.every(i=>B[i]==p));
  b.innerHTML='<p>Tres en raya: tú eres ❌. Gana al móvil (⭕ juega al azar).</p><div class="gg gg3"></div>';const g=b.querySelector('.gg');
  const reset=()=>{B=Array(9).fill('');over=false;draw()};
  const draw=()=>{g.innerHTML='';B.forEach((x,i)=>el('button','gtile',x,g,()=>{if(over||B[i])return;B[i]='❌';
    if(win('❌'))return c.ok();
    const f=B.map((y,j)=>y?-1:j).filter(j=>j>=0);
    if(f.length)B[f[ri(0,f.length-1)]]='⭕';
    if(win('⭕')||!B.includes('')){over=true;c.fail();draw();return void setTimeout(reset,900)}
    draw()}))};draw()}
};
// Reto de cada día (1..24): [juego, variante]. 24 retos distintos, ninguno se repite
const SPEC=[['trivia',0],['pairs',0],['math',0],['flake',0],['anagram',0],['react',0],['count',0],['pattern',0],['drag',0],['gifts',0],['stroop',0],['shadow',0],
 ['slider',0],['odd',0],['swap',0],['guess',0],['tap',0],['sort',0],['timing',0],['hold',0],['colors',0],['simon',0],['ttt',0],['scratch',1]];
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
