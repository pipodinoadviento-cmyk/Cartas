// Genera en el navegador un PDF con todas las cartas abiertas (portada + una página por carta, con foto y enlace al audio)
(()=>{
const W=1240,H=1754,M=110,COL={rojo:'#b3262b',verde:'#1f6b4f',azul:'#27509a'},SER='Fraunces, Georgia, serif',HAND='Caveat, cursive';
const loadLib=()=>window.jspdf?Promise.resolve():new Promise((ok,ko)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=ok;s.onerror=()=>ko(new Error('no se pudo cargar la librería de PDF (¿sin conexión?)'));document.head.append(s)});
const loadImg=u=>new Promise(r=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>r(i);i.onerror=()=>r(null);i.src=u});
const rr=(x,a,b,w,h,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()};
const wrap=(x,text,mw)=>{const out=[];for(const p of String(text).split('\n')){if(!p.trim()){out.push('');continue}let l='';for(const w of p.split(/\s+/)){const t=l?l+' '+w:w;if(x.measureText(t).width>mw&&l){out.push(l);l=w}else l=t}out.push(l)}return out};

window.makePDF=async(s,letters,prog=()=>{})=>{
  await loadLib();
  try{await Promise.all(['700 60px Fraunces','600 40px Fraunces','600 46px Caveat'].map(f=>document.fonts.load(f)))}catch(e){}
  const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4'}),col=COL[s.color]||COL.rojo,mm=210/W;
  let cv=null,x,links=[],first=true;
  const flush=()=>{if(!cv)return;if(!first)doc.addPage();first=false;
    doc.addImage(cv.toDataURL('image/jpeg',.85),'JPEG',0,0,210,297,undefined,'FAST');
    links.forEach(l=>doc.link(l.x*mm,l.y*mm,l.w*mm,l.h*mm,{url:l.url}));cv=null};
  const blank=()=>{flush();cv=document.createElement('canvas');cv.width=W;cv.height=H;x=cv.getContext('2d');links=[];x.fillStyle='#fdf8ee';x.fillRect(0,0,W,H);x.strokeStyle=col;x.lineWidth=10;x.strokeRect(40,40,W-80,H-80)};
  const page=(head,size)=>{blank();x.textAlign='left';x.fillStyle=col;x.font=`700 ${size}px ${SER}`;x.fillText(head,M,M+80);x.fillRect(M,M+110,W-2*M,5);return M+190};

  // portada
  blank();x.lineWidth=4;x.strokeRect(80,80,W-160,H-160);x.textAlign='center';
  x.fillStyle=col;x.font=`700 170px ${SER}`;x.fillText('24 cartas',W/2,520);
  const ex=W/2-260,ey=640;x.fillStyle=col;rr(x,ex,ey,520,340,22);x.fill();
  x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.moveTo(ex,ey);x.lineTo(ex+520,ey);x.lineTo(ex+260,ey+190);x.closePath();x.fill();
  x.fillStyle='#2a2018';x.font=`600 80px ${SER}`;x.fillText('Para '+(s.recipient||''),W/2,1240);
  x.font=`600 72px ${HAND}`;x.fillText('de '+(s.sender||''),W/2,1345);
  x.fillStyle=col;x.font=`600 48px ${SER}`;x.fillText('Diciembre',W/2,1500);

  const list=[...letters].filter(r=>r&&(r.body||r.photo||r.audio)).sort((a,b)=>a.day-b.day);let n=0;
  for(const r of list){
    prog(++n,list.length);
    const head=`${r.day} de diciembre`,cont=head+' · cont.';
    let y=page(head,84);
    x.font=`600 46px ${HAND}`;const LH=78,lines=wrap(x,r.body||'',W-2*M);
    for(const ln of lines){
      if(y+LH>H-M-30)y=page(cont,56);
      x.textAlign='left';x.font=`600 46px ${HAND}`;x.fillStyle='#2a2018';x.fillText(ln,M,y+52);
      x.strokeStyle='rgba(0,0,0,.14)';x.lineWidth=2;x.beginPath();x.moveTo(M,y+LH-12);x.lineTo(W-M,y+LH-12);x.stroke();y+=LH}
    if(r.photo){
      const im=await loadImg(media(r.photo));
      if(im){const k=Math.min((W-2*M-40)/im.width,900/im.height),w=im.width*k,h=im.height*k;
        y+=30;if(y+h+60>H-M-(r.audio?230:0))y=page(cont,56);
        const px=(W-w)/2;x.save();x.shadowColor='rgba(0,0,0,.25)';x.shadowBlur=24;x.shadowOffsetY=8;x.fillStyle='#fff';rr(x,px-20,y,w+40,h+40,14);x.fill();x.restore();
        x.save();rr(x,px,y+20,w,h,6);x.clip();x.drawImage(im,px,y+20,w,h);x.restore();y+=h+80}
      else{x.textAlign='left';x.fillStyle='#6b5d4d';x.font=`600 34px ${SER}`;x.fillText('(no se pudo cargar la foto)',M,y+60);y+=90}}
    if(r.audio){
      const u=new URL('escuchar.html',location.href);u.search='f='+encodeURIComponent(r.audio)+'&d='+r.day;
      if(y+230>H-M)y=page(cont,56);
      y+=20;const pw=760,ph=120,px=(W-pw)/2;
      x.fillStyle=col;rr(x,px,y,pw,ph,60);x.fill();
      x.fillStyle='#fff';x.beginPath();x.moveTo(px+64,y+36);x.lineTo(px+64,y+84);x.lineTo(px+106,y+60);x.closePath();x.fill();
      x.textAlign='left';x.font=`700 44px ${SER}`;x.fillText('Escuchar mi nota de voz',px+140,y+76);
      x.textAlign='center';x.fillStyle='#6b5d4d';x.font=`600 32px ${SER}`;x.fillText('Toca el botón para oírla',W/2,y+ph+50);
      links.push({x:px,y,w:pw,h:ph,url:u.href});y+=ph+90}
    await new Promise(r=>setTimeout(r,0)); // deja respirar al navegador
  }
  flush();
  doc.save('Mis-24-cartas'+((s.recipient||'').replace(/[^A-Za-z0-9]+/g,'')?'-'+(s.recipient||'').replace(/[^A-Za-z0-9]+/g,''):'')+'.pdf');
};
})();
