import {T,stage,initReveal,initMenu,initQuote,addLights,reduced,clamp,lerp,$,$$} from './common.js';
initMenu();initQuote();initReveal();
setTimeout(()=>document.documentElement.classList.add('job-skip'),3800);addEventListener('keydown',()=>document.documentElement.classList.add('job-skip'),{once:true});
// tabs
$$('.tabs button').forEach(b=>b.addEventListener('click',()=>{$$('.tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));const f=b.dataset.f;$$('#grid .s').forEach(s=>s.classList.toggle('hide',f!=='all'&&s.dataset.c!==f))}));
// open now (Europe/London): Mon-Thu 8-18, Fri 7-14, Sat 9-16:15
const pp=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());const wd=pp.find(p=>p.type==='weekday').value.slice(0,3),mins=(+pp.find(p=>p.type==='hour').value%24)*60+ +pp.find(p=>p.type==='minute').value;
const win={Mon:[480,1080],Tue:[480,1080],Wed:[480,1080],Thu:[480,1080],Fri:[420,840],Sat:[540,975]}[wd];$('#opennow').textContent=win&&mins>=win[0]&&mins<win[1]?'Open now (UK time).':'Closed right now (UK time).';
const host=$('#bolt'),sl=$('#tighten'),out=$('#tout');let manual=0;
const ctx=stage(host,ctx=>{
 const {scene,cam}=ctx;addLights(ctx,{fill:0xa9c8ff,ground:0x0c1a33,ki:2.8,hi:1.2});
 const g=new T.Group();scene.add(g);
 const steel=new T.MeshStandardMaterial({color:0xaebdd0,metalness:.55,roughness:.3}),dark=new T.MeshStandardMaterial({color:0x5c6f8b,metalness:.6,roughness:.4}),blue=new T.MeshStandardMaterial({color:0x2457f5,metalness:.35,roughness:.35});
 const bolt=new T.Group();g.add(bolt);bolt.rotation.x=0;
 const head=new T.Mesh(new T.CylinderGeometry(1.1,1.1,.6,6),steel);head.position.y=-2.2;bolt.add(head);
 const shaft=new T.Mesh(new T.CylinderGeometry(.55,.55,4.6,32),dark);shaft.position.y=0;bolt.add(shaft);
 for(let i=0;i<14;i++){const r=new T.Mesh(new T.TorusGeometry(.56,.05,8,32),steel);r.rotation.x=Math.PI/2;r.position.y=-1.7+i*.3;bolt.add(r)}
 const nutG=new T.Group();g.add(nutG);const nut=new T.Mesh(new T.CylinderGeometry(1,1,.7,6),blue);nutG.add(nut);const hole=new T.Mesh(new T.CylinderGeometry(.5,.5,.72,24),new T.MeshBasicMaterial({color:0x0c1a33}));nutG.add(hole);hole.visible=false;
 // spanner
 const sh=new T.Shape();sh.absarc(0,0,1.75,0,Math.PI*2,false);const hp=new T.Path();for(let i=0;i<6;i++){const a=i*Math.PI/3,x=Math.cos(a)*1.02,y=Math.sin(a)*1.02;i?hp.lineTo(x,y):hp.moveTo(x,y)}hp.closePath();sh.holes.push(hp);
 const sp=new T.Group();const headG=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.35,bevelEnabled:true,bevelSize:.05,bevelThickness:.05,bevelSegments:2,curveSegments:32}),steel);headG.rotation.x=Math.PI/2;headG.position.y=.17;sp.add(headG);
 const handle=new T.Mesh(new T.BoxGeometry(5.2,.35,.9),steel);handle.position.set(3.9,0,0);sp.add(handle);const end=new T.Mesh(new T.CylinderGeometry(.6,.6,.35,24),steel);end.position.set(6.5,0,0);sp.add(end);const eh=new T.Mesh(new T.CylinderGeometry(.3,.3,.4,24),new T.MeshBasicMaterial({color:0x0c1a33}));eh.position.set(6.5,0,0);sp.add(eh);
 nutG.add(sp);sp.position.y=0;
 let v=0;g.scale.setScalar(.72);
 const tick=(c)=>{const S=c.state;const tgt=reduced?manual:Math.max(manual,clamp(S.sp*1.25-.12));v=lerp(v,tgt,reduced?1:.1);
  nutG.position.y=lerp(1.6,-1.6,v);nutG.rotation.y=v*Math.PI*8;
  out.textContent=Math.round(v*100)+'%';if(document.activeElement!==sl)sl.value=Math.round(v*100);
  g.rotation.y=.5+S.ry+(reduced?0:S.px*.3);g.rotation.x=.35+S.rx*.5+(reduced?0:S.py*.1);g.rotation.z=-.25;g.position.y=-.1;
  if(reduced&&Math.abs(v-tgt)>.005)c.invalidate()};
 return{tick}},{fov:34,cam:[0,0,14]});
sl.addEventListener('input',()=>{manual=+sl.value/100;if(ctx)ctx.invalidate()});
