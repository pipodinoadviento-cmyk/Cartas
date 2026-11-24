const ORDER=[16,15,2,9,23,11,3,14,13,1,17,5,18,12,24,21,19,6,22,4,8,20,10,7];
// Forma de cada sobre (mismo orden): B=grande (el 24), a*=siempre doble, b*=doble solo en horizontal, s=normal. Verificado: rellena 6x6 y 4x8 sin huecos.
const SHAPES=['s','s','bt','s','s','s','aw','s','aw','s','bw','s','at','at','B','bw','bt','at','s','s','s','s','s','s'];
const media=p=>`${CFG.url}/storage/v1/object/public/media/${p}`;
const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// data = {s: ajustes, l: [cartas visibles]}. Los días sin carta visible aparecen bloqueados.
function renderCalendar(root,{s,l},opt={}){
  let tok=0,read24=false;
  const L=Object.fromEntries(l.map(x=>[x.day,x]));
  root.className=`cal ${s.style||'noche'} ${s.color||'rojo'}`;
  root.innerHTML=`<h1>${esc(s.welcome||'Tus 24 cartas')}</h1><p class="sub">Para ${esc(s.recipient||'ti')}, de ${esc(s.sender||'')}</p><div class="grid"></div><dialog><div class="cap"><h2></h2><button class="x" aria-label="Cerrar">×</button></div><div class="b"></div></dialog>`;
  const dlg=root.querySelector('dialog'),grid=root.querySelector('.grid');
  const pdfBtn=par=>{ // botón para descargar todas las cartas en PDF (solo cuando ya está abierta la 24)
    if(!L[24]||!window.makePDF)return;
    const w=document.createElement('div');w.className='pdfbar';w.innerHTML='<button class="pdfbtn">📄 Descargar mis cartas en PDF</button><p class="pdfst"></p>';par.append(w);
    const bt=w.querySelector('button'),st=w.querySelector('.pdfst');
    bt.onclick=async()=>{bt.disabled=true;st.textContent='Preparando…';
      try{await makePDF(s,l,(i,n)=>st.textContent=`Preparando carta ${i} de ${n}…`);st.textContent='¡Listo! Si no se descarga, mira en la pestaña nueva o en Descargas.'}
      catch(e){st.textContent='No se pudo crear el PDF: '+e.message}bt.disabled=false}};
  pdfBtn(root);
  // Pantalla de celebración al cerrar la carta 24 (una sola vez; en vista previa siempre)
  const sparks=o=>{
    const mk=(x,y,burst)=>{const e=document.createElement('i');e.className='sp'+(burst?' burst':'');e.textContent=['✦','✧','★','✨'][Math.random()*4|0];
      e.style.left=x+'%';e.style.top=y+'%';e.style.fontSize=(14+Math.random()*30)+'px';e.style.color=['#ffe27a','#fff','#ffb3c1','#9ad0ff'][Math.random()*4|0];
      if(burst){const a=Math.random()*6.28,r=120+Math.random()*320;e.style.setProperty('--dx',Math.cos(a)*r+'px');e.style.setProperty('--dy',Math.sin(a)*r+'px')}
      o.append(e);setTimeout(()=>e.remove(),2600)};
    for(let i=0;i<50;i++)setTimeout(()=>{if(o.isConnected)mk(50,42,true)},i*15);
    const iv=setInterval(()=>{if(!o.isConnected)return clearInterval(iv);mk(Math.random()*100,100,false)},120)};
  const celebrate=()=>{
    if(!read24||!L[24]||!window.makePDF)return;
    let seen=false;try{seen=localStorage.getItem('jg-fin')}catch(e){}
    if(seen&&!opt.preview)return;
    try{if(!opt.preview)localStorage.setItem('jg-fin',1)}catch(e){}
    const o=document.createElement('div');o.className='fin';
    o.innerHTML='<div class="fin-in"><div class="fin-t">✨ ¡Has abierto los 24 sobres! ✨</div><div class="fin-m">Ahora puedes descargar todas las cartas, con sus fotos y audios, para leerlas cuando quieras</div><div class="fin-b"></div><button class="fin-x">Más tarde</button></div>';
    root.append(o);sparks(o);pdfBtn(o.querySelector('.fin-b'));
    o.querySelector('.fin-x').onclick=()=>o.remove()};
  dlg.addEventListener('close',()=>{tok++;if(dlg.dataset.d=='24')celebrate()}); // tok++: si se cierra durante la animación del sobre, no arranca el reto en segundo plano
  dlg.onclick=e=>{if(e.target===dlg)dlg.close()};
  dlg.querySelector('.x').onclick=()=>dlg.close();
  ORDER.forEach((d,i)=>{
    const b=document.createElement('button');
    const sh=SHAPES[i];b.className=`env ${sh}${sh=='B'?' '+(s.card24||'lazo'):''}${L[d]?'':' lock'}`;
    b.innerHTML=`<span>${d}</span>`;
    b.setAttribute('aria-label',`Sobre ${d} de diciembre`);
    b.onclick=()=>{
      if(!L[d])return b.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],220);
      const r=L[d];
      dlg.dataset.d=d;dlg.classList.toggle('gold',d==24);dlg.querySelector('h2').textContent=`${d} de diciembre`;
      const body=dlg.querySelector('.b'),my=++tok,key='jg-'+d;
      const showLetter=()=>{if(my!=tok)return;body.innerHTML=`<div class="txt">${esc(r.body)}</div>`+(r.photo?`<img src="${media(r.photo)}" alt="">`:'')+(r.audio?`<audio controls preload="metadata" src="${media(r.audio)}"></audio>`:'');if(d==24)read24=true};
      let seen=false;try{seen=localStorage.getItem(key)}catch(e){}
      const go=()=>{if(my!=tok)return;
        if(seen||!window.playGame)showLetter();
        else playGame(d,body,()=>{try{if(!opt.preview)localStorage.setItem(key,1)}catch(e){}showLetter()},opt.preview)};
      body.innerHTML='<div class="envanim"><div class="eb"></div><div class="ep"></div><div class="efr"></div><div class="ef"></div></div>'; // el sobre se abre
      const calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(go,calm?0:1300);
      dlg.showModal();dlg.scrollTop=0;
    };
    grid.append(b);
  });
}
