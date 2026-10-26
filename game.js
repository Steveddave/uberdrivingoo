const MAP=22,EDGE=MAP*80-10,HWL=[400,1200,1680],HWI=[5,15,21];let bigMap=false,MK=1,LWS=1,edgeT=0,wetT=0,camYaw=0,camY=0,camInit=false;const FLY=[],ug={on:false,g:null,t:0,cool:0},UGX=40,UGZ=40,UG_Y=-60;
const smt=t=>t*t*(3-2*t),RIV=[{a:'z',c:-280,w0:-480,w1:480},{a:'x',c:520,w0:-160,w1:640},{a:'z',c:360,w0:-300,w1:400},{a:'x',c:-440,w0:-160,w1:640}];
function rivDepth(x,z){let m=0;for(const r of RIV){const u=r.a==='z'?z:x,w=r.a==='z'?x:z,rv=cl(1-(Math.abs(u-r.c)-18)/14,0,1);if(!rv)continue;const e=cl(Math.max(r.w0-w,w-r.w1,0)/140,0,1);m=Math.max(m,smt(rv)*(1-smt(e)))}return m}
const inRiver=(x,z,m=36)=>RIV.some(r=>{const u=r.a==='z'?z:x,w=r.a==='z'?x:z;return Math.abs(u-r.c)<m&&w>r.w0-160&&w<r.w1+160});
function bridgeInfo(x,z){for(const r of RIV){const u=r.a==='z'?z:x,w=r.a==='z'?x:z;if(Math.abs(u-r.c)>=37)continue;const bi=Math.round(w/P),wc=bi*P;if(Math.max(r.w0-wc,wc-r.w1,0)>80)continue;const wide=onHw(r.a==='z'?wc:r.c,r.a==='z'?r.c:wc);return{r,bi,wc,ba:w-wc,hw:wide?14.6:7.3,dw:wide?15:8}}return null}
const bridgeDeck=(x,z)=>{const b=bridgeInfo(x,z);return b&&Math.abs(b.ba)<b.dw?.12:null};const nearHw=(x,z,r=14)=>HWL.some(L=>Math.abs(Math.abs(x)-L)<r&&Math.abs(z)<=L+r||Math.abs(Math.abs(z)-L)<r&&Math.abs(x)<=L+r);
function elevation(x,z){const t=cl((Math.abs(x)-560)/480,0,1);let h=24*t*t*(3-2*t)*(1+Math.sin(z/180)*.45);const u=cl((Math.abs(z)-900)/520,0,1);h+=20*u*u*(3-2*u)*(1+Math.sin(x/210)*.4);return h-6.2*rivDepth(x,z)}
function slopeAt(x,z,yaw){if(ug.on)return 0;const fx=-Math.sin(yaw),fz=-Math.cos(yaw),height=(a,b)=>(typeof pl!=='undefined'&&pl&&deckNear(a,b,pl.surfaceY)!==null?deckNear(a,b,pl.surfaceY):elevation(a,b))+(typeof pl!=='undefined'&&pl&&scenicDistance(x,z)<10&&Math.abs((pl.surfaceY??0)-roadY(x,z))<2?bridgeRise(b):0);return (height(x+fx,z+fz)-height(x-fx,z-fz))/2}
const P=80,R=Math.random,el=id=>document.getElementById(id),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const renderer=new THREE.WebGLRenderer({canvas:el('c'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.background=new THREE.Color(0xd9ecf8);scene.fog=new THREE.Fog(0xd9ecf8,120,720);
const sk=document.createElement('canvas');sk.width=4;sk.height=256;const sk2=sk.getContext('2d'),skg=sk2.createLinearGradient(0,0,0,256);skg.addColorStop(0,'#3b78c8');skg.addColorStop(.5,'#86bbe8');skg.addColorStop(1,'#d9ecf8');sk2.fillStyle=skg;sk2.fillRect(0,0,4,256);
const dome=new THREE.Mesh(new THREE.SphereGeometry(1000,16,16),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sk),side:THREE.BackSide,fog:false,depthWrite:false}));scene.add(dome);
const cam=new THREE.PerspectiveCamera(72,1,.1,1300);cam.rotation.order='YXZ';
scene.add(new THREE.HemisphereLight(0xdfeeff,0x6a6f66,.75));const sun=new THREE.DirectionalLight(0xfff0d0,1.05);sun.position.set(100,200,60);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-130,right:130,top:130,bottom:-130,near:10,far:600});sun.shadow.bias=-.0006;scene.add(sun,sun.target);
function rs(){const cb=el('cab'),D=Math.min(devicePixelRatio,2);cb.width=innerWidth*D;cb.height=innerHeight*D;renderer.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',rs);rs();
// ground tile
const tc=document.createElement('canvas');tc.width=tc.height=1024;const g=tc.getContext('2d'),S=1024/P;
g.fillStyle='#5f6b5a';g.fillRect(0,0,1024,1024);
function strips(w,c){g.fillStyle=c;for(const[x,y,a,b]of[[0,0,w*S,1024],[1024-w*S,0,w*S,1024],[0,0,1024,w*S],[0,1024-w*S,1024,w*S]])g.fillRect(x,y,a,b)}
strips(11,'#b4b2aa');strips(8,'#2b2d31');
g.strokeStyle='#e8e4c8';g.lineWidth=3;g.setLineDash([30,30]);g.beginPath();for(const v of[0,1024]){g.moveTo(v,0);g.lineTo(v,1024);g.moveTo(0,v);g.lineTo(1024,v)}g.stroke();
g.fillStyle='#2b2d31';for(const[x,y]of[[0,0],[1024-8*S,0],[0,1024-8*S],[1024-8*S,1024-8*S]])g.fillRect(x,y,8*S,8*S);g.fillStyle='#f2f2f2';for(const[x,y,w,h]of[[947,107,46,11],[31,906,46,11],[906,947,11,46],[107,31,11,46]])g.fillRect(x,y,w,h);
// Painted approach arrows: straight / left / right, aligned with left-hand traffic.
function paintArrow(x,y,angle,turn){g.save();g.translate(x*S,y*S);g.rotate(angle);g.strokeStyle='#e8e4c8';g.fillStyle='#e8e4c8';g.lineWidth=.34*S;g.setLineDash([]);g.beginPath();g.moveTo(0,3*S);g.lineTo(0,-2*S);g.stroke();g.beginPath();g.moveTo(0,-3*S);g.lineTo(-.85*S,-1.6*S);g.lineTo(.85*S,-1.6*S);g.closePath();g.fill();g.beginPath();g.moveTo(0,0);g.lineTo(turn*1.7*S,0);g.stroke();g.beginPath();g.moveTo(turn*2.4*S,0);g.lineTo(turn*1.2*S,-.8*S);g.lineTo(turn*1.2*S,.8*S);g.closePath();g.fill();g.restore()}
paintArrow(4,23,0,-1);paintArrow(76,57,Math.PI,-1);paintArrow(23,76,Math.PI/2,1);paintArrow(57,4,-Math.PI/2,1);
// Zebra crossings sit beyond the junction box.
g.fillStyle="#eee9d7";for(let n=-7;n<8;n+=2)for(const a of [12,68]){g.fillRect((n+80)%80*S,(a-1)*S,S,2*S);g.fillRect((a-1)*S,(n+80)%80*S,2*S,S)}
const tex=new THREE.CanvasTexture(tc);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(MAP*2,MAP*2);tex.anisotropy=8;
const gm=new THREE.Mesh(new THREE.PlaneGeometry(MAP*2*P,MAP*2*P,400,400),new THREE.MeshLambertMaterial({map:tex}));gm.rotation.x=-Math.PI/2;const groundPositions=gm.geometry.attributes.position;for(let n=0;n<groundPositions.count;n++)groundPositions.setZ(n,elevation(groundPositions.getX(n),-groundPositions.getY(n)));gm.geometry.computeVertexNormals();gm.receiveShadow=true;scene.add(gm);
// Curving eastern arterial, with two raised crossings and ground-level approaches.
const BIG_RB=[{x:0,z:800},{x:-800,z:-800}];
const scenicX=z=>880+100*Math.sin(z/180);
const bridgeRise=z=>Math.max(...[-480,480].map(c=>{const d=Math.abs(z-c);return d<28?9:d<128?9*(1+Math.cos((d-28)/100*Math.PI))/2:0}));
const scenicDistance=(x,z)=>Math.abs(z)<=960?Math.abs(x-scenicX(z))/Math.sqrt(1+Math.pow(100/180*Math.cos(z/180),2)):9999;
const reserved=(x,z)=>scenicDistance(x,z)<23||inRiver(x,z,40)||BIG_RB.some(c=>Math.hypot(x-c.x,z-c.z)<67);
function surfaceAt(o){if(o.ug)return UG_Y;const ground=elevation(o.x,o.z);if(scenicDistance(o.x,o.z)<10){const deck=ground+bridgeRise(o.z),previous=o.surfaceY??ground;if(Math.abs(previous-deck)<2)return deck}const dk=deckNear(o.x,o.z,o.surfaceY??ground);if(dk!==null)return dk;return ground}
function roadY(x,z){return elevation(x,z)+bridgeRise(z)}
// buildings
const bg=new THREE.BoxGeometry(1,1,1),bm=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial(),4200);bm.castShadow=bm.receiveShadow=true;
bm.material.onBeforeCompile=s=>{s.vertexShader='varying vec3 vW;varying vec3 vN;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvW=(instanceMatrix*vec4(transformed,1.)).xyz;vN=mat3(instanceMatrix)*normal;');
s.fragmentShader='varying vec3 vW;varying vec3 vN;\n'+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nvec2 uv=abs(vN.x)>.5?vec2(vW.z,vW.y):vec2(vW.x,vW.y);vec2 q=uv/vec2(3.4,3.8);vec2 f=fract(q);float h=fract(sin(dot(floor(q),vec2(12.9898,78.233)))*43758.5453);float w=step(.18,f.x)*step(f.x,.82)*step(.22,f.y)*step(f.y,.8)*step(abs(vN.y),.5)*step(5.,vW.y);vec3 gl=mix(vec3(.16,.24,.34),vec3(.55,.72,.88),h);diffuseColor.rgb=mix(diffuseColor.rgb,gl,w*.9);')};
const FOOD=new Set(['1,0','-2,-1','3,2','-5,4','8,-3','-11,2']),POLICE=new Set(['2,-2','-4,2','9,7','-10,-8']);
const ST=new Set(['-1,0']);for(let i=-MAP;i<MAP;i++)for(let j=-MAP;j<MAP;j++)if((((i*7+j*13)%61)+61)%61==0)ST.add(i+','+j);for(const k of [...FOOD,...POLICE])ST.delete(k);const GA=new Set(['0,0']);for(let i=-MAP;i<MAP;i++)for(let j=-MAP;j<MAP;j++)if((((i*11+j*5)%47)+47)%47==3&&!ST.has(i+','+j))GA.add(i+','+j);for(const k of [...FOOD,...POLICE])GA.delete(k);const PK=new Set(),PR=new Set();for(let i=-MAP;i<MAP;i++)for(let j=-MAP;j<MAP;j++){const k=i+','+j;if(ST.has(k)||GA.has(k)||FOOD.has(k)||POLICE.has(k))continue;if((((i*5+j*17)%17)+17)%17==5)PK.add(k);else if((((i*3+j*7)%19)+19)%19==7)PR.add(k)}const RB=new Set();for(let i=-9;i<=9;i++)for(let j=-9;j<=9;j++)if((((i*7+j*11)%13)+13)%13==2)RB.add(i+','+j);for(const k of [...RB]){const[i,j]=k.split(',').map(Number);if(HWI.some(h=>Math.abs(i)==h||Math.abs(j)==h))RB.delete(k)}
const HOUSES=[];{let k=0,m=new THREE.Matrix4(),c=new THREE.Color();for(let i=-MAP;i<MAP;i++)for(let j=-MAP;j<MAP;j++)for(const[ax,az]of[[-1,-1],[1,-1],[-1,1],[1,1]]){if([ST,GA,PK,PR,FOOD,POLICE].some(a=>a.has(i+','+j))||reserved((i+.5)*P+ax*14.5,(j+.5)*P+az*14.5)||nearHw((i+.5)*P+ax*14.5,(j+.5)*P+az*14.5,32))continue;
const x=(i+.5)*P+ax*14.5,z=(j+.5)*P+az*14.5,d=Math.hypot(x,z);if(d>620){HOUSES.push([x,z,az]);continue}const h=8+Math.pow(R(),2)*Math.max(25,125-d*.08);
m.makeScale(27,h,27).setPosition(x,h/2,z);bm.setMatrixAt(k,m);c.setHSL(.55+R()*.1,.08+R()*.18,.42+R()*.32);bm.setColorAt(k++,c)}bm.count=k;scene.add(bm)}
const mk=(w,h,d,c,x,y,z,p,basic)=>{const m=new THREE.Mesh(bg,new(basic?THREE.MeshBasicMaterial:THREE.MeshLambertMaterial)({color:c}));m.scale.set(w,h,d);m.castShadow=!basic;m.receiveShadow=true;m.position.set(x,y,z);p&&p.add(m);return m};
// vehicles
function carMesh(col,pol){const g=new THREE.Group();mk(1.9,.7,4.3,col,0,.6,0,g);mk(1.7,.6,2.2,pol?0x111820:0x2a3440,0,1.2,.2,g);
for(const x of[-1,1])for(const z of[-1.4,1.4])mk(.3,.7,.7,0x111111,x*.95,.35,z,g);g.bl=[[-1,-2.15],[1,-2.15],[-1,2.15],[1,2.15]].map(([x,z])=>{const b=mk(.35,.2,.12,0xff9500,x*.78,.72,z,g,1);b.visible=false;return b});
if(pol){mk(1.92,.25,4.32,0x1648b8,0,.55,0,g);g.l1=mk(.8,.2,.4,0xff0000,-.45,1.55,.2,g,1);g.l2=mk(.8,.2,.4,0x0044ff,.45,1.55,.2,g,1)}return g}
function bikeMesh(){const g=new THREE.Group();mk(.4,.5,1.9,0x111111,0,.5,0,g);mk(.5,.9,.5,0x1648b8,0,1.1,0,g);mk(.3,.3,.3,0xffffff,0,1.7,0,g);g.l1=mk(.3,.15,.3,0xff0000,-.1,1.35,.6,g,1);g.l2=mk(.3,.15,.3,0x0044ff,.1,1.35,.6,g,1);return g}
function heliMesh(){const g=new THREE.Group();mk(2.2,2,6,0x1d2a44,0,0,0,g);mk(.4,.5,5,0x1d2a44,0,.3,5,g);g.rot=mk(14,.1,.5,0x111111,0,1.2,0,g);
const c=new THREE.Mesh(new THREE.ConeGeometry(9,45,16,1,true),new THREE.MeshBasicMaterial({color:0xfff2a0,transparent:true,opacity:.13,depthWrite:false}));c.position.y=-22.5;g.add(c);return g}
// petrol stations
const SP=[],FM=55;let fuel=38,lowFuel=false;
ST.forEach(k=>{const[i,j]=k.split(',').map(Number),x=(i+.5)*P,z=(j+.5)*P;SP.push({x,z});
mk(58,.1,58,0x8d9096,x,.03,z,scene);mk(30,.7,16,0xe8e8e8,x,5.9,z,scene);mk(30.2,.35,16.2,0xd02020,x,5.45,z,scene);
for(const sx of[-1,1])for(const sz of[-1,1])mk(.7,5.6,.7,0xcccccc,x+sx*14,2.8,z+sz*7,scene);
for(const px of[-9,-3,3,9])for(const pz of[-3,3]){mk(.8,1.5,.6,0xd02020,x+px,.75,z+pz,scene);mk(.6,.4,.62,0x111111,x+px,1.2,z+pz,scene)}
mk(22,4.5,9,0xd8d2c0,x,2.25,z+22,scene);mk(22.4,.8,9.4,0xd02020,x,4.9,z+22,scene);mk(14,2,.3,0x9fd4ff,x,2.2,z+17.4,scene);
mk(.6,14,.6,0x666666,x+20,7,z+8,scene);mk(5,3.4,.6,0xffcc00,x+20,14.5,z+8,scene,1);mk(3.6,1.4,.7,0xd02020,x+20,14.5,z+8,scene,1)});
function fuelTick(dt,th,c){if(!on||fueling)return;fuel=Math.max(0,fuel-dt*2.4*(.008+.12*th*(.4+rpm/6000)*(c.m/1200)+Math.abs(pl.v)*.0015));if(fuel<FM*.2&&!lowFuel){lowFuel=true;msg('LOW FUEL · find a green petrol station on the map','#ffb020')}if(fuel<=0){on=false;rpm=0;msg('OUT OF FUEL · press H for a $65 roadside fuel delivery','#ff6b6b')}}
// cockpit
const cab=el('cab'),cc=cab.getContext('2d');
function gauge(x,y,r,v,mx,step,lab,red){cc.save();cc.translate(x,y);cc.fillStyle='#07090b';cc.beginPath();cc.arc(0,0,r,0,7);cc.fill();cc.strokeStyle='#3a3f47';cc.lineWidth=r*.05;cc.stroke();
const a=u=>2.356+u*4.712;cc.font=r*.2+'px system-ui';cc.textAlign='center';cc.textBaseline='middle';
for(let n=0;n<=mx;n+=step){const u=n/mx,c=Math.cos(a(u)),s=Math.sin(a(u));cc.strokeStyle=red&&n>=red?'#f44':'#ddd';cc.lineWidth=r*.04;cc.beginPath();cc.moveTo(c*r*.82,s*r*.82);cc.lineTo(c*r*.93,s*r*.93);cc.stroke();cc.fillStyle=cc.strokeStyle;cc.fillText(n,c*r*.66,s*r*.66)}
const u=cl(v/mx,0,1.03);cc.strokeStyle='#ff5a1f';cc.lineWidth=r*.05;cc.beginPath();cc.moveTo(0,0);cc.lineTo(Math.cos(a(u))*r*.85,Math.sin(a(u))*r*.85);cc.stroke();
cc.fillStyle='#ff5a1f';cc.beginPath();cc.arc(0,0,r*.07,0,7);cc.fill();cc.fillStyle='#fff';cc.font='bold '+r*.26+'px system-ui';cc.fillText(lab,0,r*.5);cc.restore()}
function cockpit(r){const W=cab.width,H=cab.height;cc.clearRect(0,0,W,H);if(chase||role==='ped'||role==='bike')return;if(role==='cop'){const f=Math.floor(time*6)%2==0;cc.fillStyle=f?'rgba(255,40,40,.17)':'rgba(40,110,255,.17)';cc.fillRect(0,0,W,H*.62)}
const gd=cc.createLinearGradient(0,H*.7,0,H);gd.addColorStop(0,'#2a2d33');gd.addColorStop(1,'#0d0e10');cc.fillStyle=gd;cc.beginPath();cc.moveTo(0,H*.8);cc.quadraticCurveTo(W/2,H*.68,W,H*.8);cc.lineTo(W,H);cc.lineTo(0,H);cc.fill();
cc.strokeStyle='#4a4f58';cc.lineWidth=3;cc.beginPath();cc.moveTo(0,H*.8);cc.quadraticCurveTo(W/2,H*.68,W,H*.8);cc.stroke();
cc.fillStyle='#0b0c0e';cc.beginPath();cc.moveTo(0,0);cc.lineTo(W*.09,0);cc.lineTo(W*.025,H*.78);cc.lineTo(0,H*.8);cc.fill();cc.beginPath();cc.moveTo(W,0);cc.lineTo(W*.91,0);cc.lineTo(W*.975,H*.78);cc.lineTo(W,H*.8);cc.fill();cc.fillRect(0,0,W,H*.05);
cc.strokeStyle='#14181d';cc.lineWidth=H*.014;for(const[a,b,w,h]of[[.46,.115,.2,.07],[.115,.57,.1,.12],[.885,.57,.1,.12]])cc.strokeRect((a-w/2)*W,(b-h/2)*H,w*W,h*H);cc.fillStyle='#14181d';cc.fillRect(W*.455,0,W*.01,H*.08);

const R2=H*.31,wx=W/2,wy=H;cc.fillStyle='#0d1013';cc.beginPath();cc.arc(wx,wy,R2*.86,0,7);cc.fill();
{const bl=Math.floor(time*2.8)%2==0;for(const d of[-1,1]){const x=wx+d*H*.37,y=H*.85,s=H*.032;cc.fillStyle=(sig==2||sig==d)&&bl?'#3dff6a':'#17301f';cc.beginPath();cc.moveTo(x+d*s,y);cc.lineTo(x-d*s,y-s);cc.lineTo(x-d*s,y+s);cc.fill()}}gauge(wx-H*.115,wy-H*.115,H*.1,r.kmh,240,40,Math.round(r.kmh)+'');gauge(wx+H*.115,wy-H*.115,H*.1,rpm/1000,6,1,'rpm',5.5);
cc.textAlign='center';cc.fillStyle='#fff';cc.font='bold '+H*.075+'px system-ui';cc.fillText(gear<0?'R':gear==0?'N':gear,wx,wy-H*.125);
const fw=H*.13,fr=fuel/FM;cc.fillStyle='#222';cc.fillRect(wx-fw/2,wy-H*.07,fw,H*.014);cc.fillStyle=fr>.2?'#4ade80':'#f44';cc.fillRect(wx-fw/2,wy-H*.07,fw*fr,H*.014);
cc.fillStyle='#ffb020';cc.fillRect(wx-fw/2,wy-H*.045,fw*clutch,H*.01);cc.fillStyle='#889';cc.font=H*.016+'px system-ui';cc.fillText('FUEL / CLUTCH',wx,wy-H*.08);
cc.save();cc.translate(wx,wy);cc.rotate(-steerS*2.4);cc.strokeStyle='#16181c';cc.lineWidth=R2*.16;cc.beginPath();cc.arc(0,0,R2,0,7);cc.stroke();cc.strokeStyle='#30343b';cc.lineWidth=R2*.03;cc.beginPath();cc.arc(0,0,R2*1.05,0,7);cc.stroke();
cc.fillStyle='#e33';cc.fillRect(-R2*.025,-R2*1.09,R2*.05,R2*.18);cc.fillStyle='#16181c';cc.fillRect(-R2,-R2*.06,R2*.2,R2*.12);cc.fillRect(R2*.8,-R2*.06,R2*.2,R2*.12);cc.restore()}
// trees
{const n=18500,cr=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),new THREE.MeshLambertMaterial(),n),tk=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({color:0x5a4030}),n),m=new THREE.Matrix4(),c=new THREE.Color();let k=0;
for(let ax=0;ax<2;ax++)for(let r=-MAP;r<=MAP;r++)for(let s=-MAP-1;s<MAP;s++)for(const u of[18,62])for(const sd of[-9.6,9.6]){if(k>=n)break;const a=s*P+u,b=r*P+sd,x=ax?a:b,z=ax?b:a,h=3.5+R()*2,rr=1.8+R()*1.2;if(nearHw(x,z))continue;
const bk=Math.floor(x/P)+','+Math.floor(z/P),entrance=([ST,GA,PK,FOOD,POLICE].some(a=>a.has(bk)))&&Math.abs(x-(Math.floor(x/P)+.5)*P)<7&&z-Math.floor(z/P)*P<12;if(entrance)continue;
m.makeScale(.3,h,.3).setPosition(x,h/2,z);tk.setMatrixAt(k,m);m.makeScale(rr,rr*1.1,rr).setPosition(x,h+rr*.6,z);cr.setMatrixAt(k,m);c.setHSL(.27+R()*.08,.45,.26+R()*.12);cr.setColorAt(k,c);k++}
cr.count=tk.count=k;cr.castShadow=true;scene.add(cr,tk)}
// safe houses
const GAR=[],WALLS=[];let cpt=null,hideT=0;
GA.forEach(k=>{const[i,j]=k.split(',').map(Number),x=(i+.5)*P,z=(j+.5)*P,gz=z-21;GAR.push({x,z:gz});
mk(58,.1,58,0x7b8087,x,.03,z,scene);mk(14,.12,16,0x23272d,x,.08,gz,scene);
mk(1,5,16,0x59606b,x-7.5,2.5,gz,scene);mk(1,5,16,0x59606b,x+7.5,2.5,gz,scene);mk(16,5,1,0x59606b,x,2.5,gz+8.5,scene);mk(16.5,.7,17.5,0x2b3038,x,5.3,gz,scene);
mk(7,1.3,.4,0x18b6ff,x,6.4,gz-8.6,scene,1);mk(.8,.1,12,0x18b6ff,x-4.5,.12,gz,scene,1);mk(.8,.1,12,0x18b6ff,x+4.5,.12,gz,scene,1);
WALLS.push({x0:x-8,x1:x-7,z0:gz-8,z1:gz+8},{x0:x+7,x1:x+8,z0:gz-8,z1:gz+8},{x0:x-8,x1:x+8,z0:gz+8,z1:gz+9})});
// Driveway aprons join the street asphalt to each forecourt through the footpath.
const DRIVES=[];
for(const set of [ST,GA,PK,FOOD,POLICE])for(const k of set){const[i,j]=k.split(',').map(Number),x=(i+.5)*P,z=j*P;DRIVES.push({x,z0:z+7,z1:z+23});mk(12,.16,16,0x676b70,x,.09,z+15,scene);for(const side of[-1,1])mk(.2,.02,13,0xe1dcc5,x+side*5.5,.18,z+15,scene);for(const side of[-1,1])mk(.45,.6,.45,0xe5c44a,x+side*6.5,.3,z+11,scene)}
function accessSurface(x,z){const k=Math.floor(x/P)+','+Math.floor(z/P),cx=(Math.floor(x/P)+.5)*P,cz=(Math.floor(z/P)+.5)*P;return (([ST,GA,PK,FOOD,POLICE].some(a=>a.has(k)))&&Math.abs(x-cx)<29&&Math.abs(z-cz)<29)||DRIVES.some(d=>Math.abs(x-d.x)<5.5&&z>d.z0&&z<d.z1)}
// parking lots, parks, street lamps
const PKC=new Map(),ICO=new THREE.IcosahedronGeometry(1,0);
function bump(o,w){if(!(o.x>w.x0-.9&&o.x<w.x1+.9&&o.z>w.z0-.9&&o.z<w.z1+.9))return 0;const d=[o.x-(w.x0-.9),w.x1+.9-o.x,o.z-(w.z0-.9),w.z1+.9-o.z],q=d.indexOf(Math.min(...d));if(q==0)o.x=w.x0-.9;else if(q==1)o.x=w.x1+.9;else if(q==2)o.z=w.z0-.9;else o.z=w.z1+.9;return 1}
function setBl(m,s,on){if(!m.bl)return;m.bl[0].visible=m.bl[2].visible=on&&(s==-1||s==2);m.bl[1].visible=m.bl[3].visible=on&&(s==1||s==2)}
{const ln=[],cr=[];
PK.forEach(k=>{const[i,j]=k.split(',').map(Number),x=(i+.5)*P,z=(j+.5)*P,L=[];mk(58,.1,58,0x3b3e44,x,.03,z,scene);
for(const[zc,fl]of[[-22.5,0],[-17,1],[17,0],[22.5,1]])for(let n=0;n<19;n++){const bx=x-25.2+n*2.8;ln.push([bx,z+zc]);if(n<18&&!(zc<0&&n>=7&&n<=10)&&R()<.6){cr.push([bx+1.4,z+zc,R(),fl]);L.push({x0:bx+.4,x1:bx+2.4,z0:z+zc-2.2,z1:z+zc+2.2})}}
for(const[sx,sz]of[[-1,-1],[1,-1],[-1,1],[1,1]]){mk(.25,7,.25,0x555a60,x+sx*27,3.5,z+sz*27,scene);mk(1.4,.25,.5,0xfff2c0,x+sx*27,7.1,z+sz*27,scene,1)}
mk(.3,6,.3,0x666666,x+27,3,z-27.5,scene);mk(2.2,2.2,.3,0x1d5fd0,x+27,6,z-27.5,scene,1);PKC.set(k,L)});
const n=Math.max(1,cr.length),LI=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({color:0xf2f2f2}),ln.length||1),B=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial(),n),C=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({color:0x2a3440}),n),m=new THREE.Matrix4(),c=new THREE.Color();
ln.forEach((p,q)=>{m.makeScale(.14,.03,5.5).setPosition(p[0],.07,p[1]);LI.setMatrixAt(q,m)});
cr.forEach((p,q)=>{m.makeScale(1.9,.7,4.3).setPosition(p[0],.6,p[1]);B.setMatrixAt(q,m);c.setHSL(R(),.5,.25+R()*.35);B.setColorAt(q,c);m.makeScale(1.7,.6,2.2).setPosition(p[0],1.2,p[1]+(p[3]?-.2:.2));C.setMatrixAt(q,m)});
LI.count=ln.length;B.count=C.count=cr.length;for(const o of[LI,B,C]){o.castShadow=true;scene.add(o)}}
PR.forEach(k=>{const[i,j]=k.split(',').map(Number),x=(i+.5)*P,z=(j+.5)*P,L=[];mk(58,.12,58,0x4f8a3a,x,.05,z,scene);mk(3,.14,58,0xcdbf9a,x,.08,z,scene);mk(58,.14,3,0xcdbf9a,x,.08,z,scene);
mk(7,.8,7,0x9aa4ad,x,.4,z,scene);mk(5.8,.2,5.8,0x3b82c4,x,.85,z,scene,1);mk(.6,2.4,.6,0xb0b8c0,x,1.6,z,scene);
for(const[sx,sz]of[[-1,-1],[1,-1],[-1,1],[1,1]])mk(2.4,.5,.7,0x6b4a2a,x+sx*7,.5,z+sz*2.2,scene);
for(let t=0;t<9;t++){const tx=x+(R()*2-1)*24,tz=z+(R()*2-1)*24;if(Math.abs(tx-x)<5&&Math.abs(tz-z)<5||Math.abs(tx-x)<2.5||Math.abs(tz-z)<2.5)continue;const h=3+R()*2,rr=2+R()*1.3;mk(.5,h,.5,0x5a4030,tx,h/2,tz,scene);
const cm=new THREE.Mesh(ICO,new THREE.MeshLambertMaterial({color:new THREE.Color().setHSL(.27+R()*.08,.5,.3)}));cm.scale.set(rr,rr,rr);cm.position.set(tx,h+rr*.6,tz);cm.castShadow=true;scene.add(cm);L.push({x0:tx-.4,x1:tx+.4,z0:tz-.4,z1:tz+.4})}
L.push({x0:x-3.5,x1:x+3.5,z0:z-3.5,z1:z+3.5});PKC.set(k,L)});
{const n=8200,po=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({color:0x555a60}),n),hd=new THREE.InstancedMesh(bg,new THREE.MeshBasicMaterial({color:0xfff2c0}),n),m=new THREE.Matrix4();let k=0;
for(let ax=0;ax<2;ax++)for(let r=-MAP;r<=MAP;r++)for(let s=-MAP-1;s<MAP;s++)for(const[u,sd]of[[29,10.2],[51,-10.2]]){if(k>=n)break;const a=s*P+u,b=r*P+sd,x=ax?a:b,z=ax?b:a;if(nearHw(x,z))continue;m.makeScale(.2,7,.2).setPosition(x,3.5,z);po.setMatrixAt(k,m);m.makeScale(.5,.25,1.6).setPosition(x,7.1,z);hd.setMatrixAt(k,m);k++}
po.count=hd.count=k;scene.add(po,hd)}
// mirrors
scene.add(cam);const MIR=[[.46,.115,.2,.07,640,128,0],[.115,.57,.1,.12,256,192,1],[.885,.57,.1,.12,256,192,-1]].map(([a,b,w,h,rw,rh,s])=>{const rt=new THREE.WebGLRenderTarget(rw,rh),t=rt.texture;t.wrapS=THREE.RepeatWrapping;t.repeat.x=-1;t.offset.x=1;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:t,fog:false,depthTest:false}));mesh.renderOrder=50;mesh.frustumCulled=false;mesh.visible=false;cam.add(mesh);const mc=new THREE.PerspectiveCamera(s?38:26,rw/rh,.4,700);mc.rotation.order='YXZ';return{rt,mesh,f:[a,b,w,h],s,cam:mc}});
function renderMirrors(){renderer.shadowMap.needsUpdate=true;MIR.forEach(m=>m.mesh.visible=false);if(state!=='play'||chase||role==='ped'||role==='bike')return;
for(const m of MIR){m.cam.position.set(pl.x+(m.s?-Math.cos(pl.yaw)*m.s*.9:0)-Math.sin(pl.yaw)*.3,1.25+surfaceAt(pl),pl.z+(m.s?Math.sin(pl.yaw)*m.s*.9:0)-Math.cos(pl.yaw)*.3);m.cam.rotation.set(0,pl.yaw+Math.PI-.2*m.s,0);renderer.setRenderTarget(m.rt);renderer.render(scene,m.cam)}renderer.setRenderTarget(null);
const hh=.6*Math.tan(cam.fov*Math.PI/360),asp=cam.aspect;for(const m of MIR){const[a,b,w,h]=m.f;m.mesh.position.set((2*a-1)*asp*hh,(1-2*b)*hh,-.6);m.mesh.scale.set(w*2*asp*hh,h*2*hh,1);m.mesh.visible=true}}
// smarter traffic
function tcLimit(a){let lim=99;a.hold=false;
if(a.pi!==-99&&!noLt(a.ni,a.nj)&&!a.sus){const dn=Math.hypot(a.ni*P-a.x,a.nj*P-a.z),mn=lsx(a.ni,a.nj,a.nj!=a.pj?0:1)[0];if((mn=='r'||(mn=='y'&&dn>20))&&dn>10.5){lim=Math.max(0,(dn-12.5)*1.1);a.hold=dn<40}}
const fx=-Math.sin(a.yaw),fz=-Math.cos(a.yaw),chk=o=>{const rx=o.x-a.x,rz=o.z-a.z,f=rx*fx+rz*fz,l=Math.abs(-rx*Math.cos(a.yaw)+rz*Math.sin(a.yaw));if(f>0&&f<20&&l<2.6)lim=Math.min(lim,Math.max(0,(f-6.5)*1.4))};
for(const w of crossers)if(w.active)chk(w);for(const o of ag)if(o!==a&&o.k!=='heli')chk(o);chk(pl);return lim}
// Pedestrians and paid driving jobs. All earnings belong to this play session.
function personMesh(color){const g=new THREE.Group();mk(.45,.65,.3,color,0,1.05,0,g);mk(.32,.36,.32,0xc99773,0,1.57,0,g);g.legs=[-.13,.13].map(x=>mk(.16,.65,.19,0x263548,x,.38,0,g));for(const x of[-.32,.32])mk(.14,.6,.16,color,x,1.05,0,g);return g}
const walkers=Array.from({length:90},()=>{const mesh=personMesh(new THREE.Color().setHSL(R(),.4,.45));scene.add(mesh);return{mesh,x:9999,z:9999,dir:R()<.5?-1:1,speed:.7+R()*.6,phase:R()*6.28}});
function pedestrianTick(dt){for(const w of walkers){if(Math.hypot(w.x-pl.x,w.z-pl.z)>270){w.axis=R()<.5;const line=cl(Math.round((w.axis?pl.z:pl.x)/P)+Math.floor(R()*5)-2,-MAP+2,MAP-2)*P;w.base=cl(Math.floor((w.axis?pl.x:pl.z)/P)+Math.floor(R()*5)-2,-MAP+1,MAP-2)*P;w.u=14+R()*52;w.line=line+(R()<.5?-9:9)}w.u+=w.dir*w.speed*dt;if(w.u<13||w.u>67){w.u=cl(w.u,13,67);w.dir*=-1}w.x=w.axis?w.base+w.u:w.line;w.z=w.axis?w.line:w.base+w.u;w.mesh.position.set(w.x,elevation(w.x,w.z),w.z);w.mesh.rotation.y=w.axis?-w.dir*Math.PI/2:w.dir>0?Math.PI:0;w.phase+=dt*6;w.mesh.legs.forEach((l,i)=>l.rotation.x=Math.sin(w.phase+i*Math.PI)*.35);}}
let job=null,phoneOpen=false,phoneReported=false;
function parked(){return Math.abs(pl.v)<.5&&(gear===0||keys.Space)}
function setPhone(open){phoneOpen=open;el('dispatch').hidden=!open;el('phoneToggle').setAttribute('aria-expanded',String(open));if(!open)phoneReported=false}
function phoneTick(){if(phoneOpen&&Math.abs(pl.v)>=.5&&!phoneReported){phoneReported=true;offence('Using a phone while driving',1.5)}el('phoneSafety').textContent=parked()?'Parked · tap an order to accept.':'Park and select neutral or hold the handbrake to accept orders.'}
el('phoneToggle').onclick=()=>{if(state==='play')setPhone(!phoneOpen)};el('closePhone').onclick=()=>setPhone(false);
const JOBS={ride:{name:'Passenger ride',base:65,rate:.28,pick:'Collect your passenger',carry:'Passenger on board',done:'Passenger dropped off'},food:{name:'Food delivery',base:45,rate:.22,pick:'Collect food from the restaurant pickup bay',carry:'Food collected',done:'Food delivered'},parcel:{name:'Parcel run',base:55,rate:.24,pick:'Collect the parcel at the blue depot stand',carry:'Parcel loaded',done:'Parcel delivered'}};
const bcn=new THREE.Mesh(new THREE.CylinderGeometry(4,4,70,16,1,true),new THREE.MeshBasicMaterial({color:0xffd400,transparent:true,opacity:.25,side:THREE.DoubleSide,depthWrite:false,fog:false}));bcn.visible=false;scene.add(bcn);
const customer=personMesh(0xffbd45);scene.add(customer);customer.visible=false;
const jobStand=new THREE.Group();mk(1.6,1,1,0xe68b3c,0,.5,0,jobStand);mk(2,.25,1.4,0xffd9a6,0,2,0,jobStand);mk(.12,1.5,.12,0xd3d9de,-.7,1.1,0,jobStand);mk(.12,1.5,.12,0xd3d9de,.7,1.1,0,jobStand);scene.add(jobStand);jobStand.visible=false;
function clearJob(){job=null;bcn.visible=customer.visible=jobStand.visible=false;el('cancelJob').hidden=true;el('stopProgress').hidden=true;el('jobChoices').querySelectorAll('button').forEach(b=>b.disabled=false)}
function parcelPoint(){const near=SP.slice().sort((a,b)=>Math.hypot(a.x-pl.x,a.z-pl.z)-Math.hypot(b.x-pl.x,b.z-pl.z));const depot=near[Math.floor(R()*Math.min(3,near.length))];return{x:depot.x,z:depot.z-13,side:1}}
function curbPoint(i,j){const side=R()<.5?-1:1;return{x:i*P+side*6,z:j*P+24+R()*30,side}}
function newJob(kind){if(job||!phoneOpen||!parked()){msg('Park in neutral or hold the handbrake before accepting an order','#ffb020');return;}kind=kind||['ride','food','parcel'][Math.floor(R()*3)];const spec=JOBS[kind];if(!spec)return;
const i=cl(Math.round(pl.x/P)+(R()<.5?-1:1),-MAP+2,MAP-2),j=cl(Math.floor(pl.z/P),-MAP+2,MAP-2),p=kind==='parcel'?parcelPoint():kind==='food'?foodPoint():curbPoint(i,j),di=cl(i+(i>5?-1:i<-5?1:R()<.5?-1:1)*(2+Math.floor(R()*3)),-MAP+2,MAP-2),dj=cl(j+Math.floor(R()*5)-2,-MAP+2,MAP-2),d=curbPoint(di,dj),dist=Math.abs(p.x-d.x)+Math.abs(p.z-d.z);
job={restaurant:p.name,kind,st:1,px:p.x,pz:p.z,dx:d.x,dz:d.z,ps:p.side,ds:d.side,off:0,t:dist/5+100,dist,stop:0,fare:Math.round(spec.base+dist*spec.rate)};
customer.visible=kind==='ride';customer.position.set(p.x+p.side*3,elevation(p.x,p.z),p.z);jobStand.visible=kind!=='ride';jobStand.position.set(p.x+p.side*3,elevation(p.x,p.z),p.z);jobStand.children[0].material.color.setHex(kind==='food'?0xe68b3c:0x397aaa);jobStand.children[1].material.color.setHex(kind==='parcel'?0xb98b55:0xffd9a6);
el('jobChoices').querySelectorAll('button').forEach(b=>b.disabled=true);el('cancelJob').hidden=false;msg(spec.name+': '+spec.pick+' at the yellow beacon','#ffd400')}
function jobTick(dt){if(role==='cop')return;const jb=el('job'),status=el('dispatchStatus');if(!job){bcn.visible=false;jb.textContent='T · open phone for orders';status.textContent='Choose a job to start earning.';return}
const spec=JOBS[job.kind],pickup=job.st===1,tx=pickup?job.px:job.dx,tz=pickup?job.pz:job.dz,d=Math.hypot(tx-pl.x,tz-pl.z);bcn.visible=true;bcn.position.set(tx,35+elevation(tx,tz),tz);bcn.material.color.setHex(pickup?0xffd400:0x4ade80);
if(!pickup){job.t-=dt;if(job.t<=0){msg('Delivery timed out. Choose another job.','#ff6b6b');clearJob();return}}
const atStop=d<7;job.stop=atStop&&Math.abs(pl.v)<.5?job.stop+dt:0;
el('stopProgress').hidden=!atStop;el('stopProgress').value=job.stop;
jb.textContent=(job.restaurant||spec.name)+' · '+(pickup?'Pickup':'Drop-off')+' '+Math.round(d)+' m'+(atStop?' · '+(Math.abs(pl.v)>=.5?'Stop to collect / deliver':Math.max(0,2.5-job.stop).toFixed(1)+'s remaining'):'');status.textContent=(pickup?spec.pick:spec.carry)+' · Fare $'+job.fare+(pickup?'':' · '+Math.ceil(job.t)+'s remaining')+'. '+(atStop?(Math.abs(pl.v)>=.5?'Brake to a complete stop.':'Hold still… '+Math.max(0,2.5-job.stop).toFixed(1)+'s'):'Follow the '+(pickup?'yellow':'green')+' beacon.')+' Safe-driving bonus: $'+Math.max(0,40-job.off*10);
if(job.stop>=2.5){if(pickup){job.st=2;job.stop=0;jobStand.visible=false;customer.visible=job.kind!=='ride';customer.position.set(job.dx+job.ds*3,elevation(job.dx,job.dz),job.dz);msg(spec.carry+'. Follow the green drop-off beacon.','#4ade80')}else{const pay=job.fare+Math.max(0,40-job.off*10);bal+=pay;msg(spec.done+'! Earned $'+pay,'#4ade80');clearJob()}}}
el('jobChoices').onclick=e=>{if(state==='play'&&e.target.dataset.job)newJob(e.target.dataset.job)};
el('cancelJob').onclick=()=>{if(state==='play'){clearJob();msg('Job cancelled')}};
// roundabouts
RB.forEach(k=>{const[i,j]=k.split(',').map(Number),x=i*P,z=j*P,isl=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.6,.5,24),new THREE.MeshLambertMaterial({color:0x4f8a3a}));isl.position.set(x,.25,z);isl.castShadow=isl.receiveShadow=true;scene.add(isl);
const rg=new THREE.Mesh(new THREE.RingGeometry(3.7,4,32),new THREE.MeshBasicMaterial({color:0xf2f2f2}));rg.rotation.x=-Math.PI/2;rg.position.set(x,.06,z);scene.add(rg);mk(.35,2.4,.35,0x5a4030,x,1.7,z,scene);
const cm=new THREE.Mesh(ICO,new THREE.MeshLambertMaterial({color:0x2f7a35}));cm.scale.set(1.8,1.6,1.8);cm.position.set(x,3.6,z);cm.castShadow=true;scene.add(cm)});
// Signed businesses and pickup bays.
function sign(text,x,y,z,color=0x173f62){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#'+color.toString(16).padStart(6,'0');ctx.fillRect(0,0,512,128);ctx.fillStyle='#fff5d9';ctx.font='bold 40px sans-serif';ctx.textAlign='center';ctx.fillText(text,256,80);const m=new THREE.Mesh(new THREE.PlaneGeometry(15,3.75),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=Math.PI;scene.add(m);return m}
const restaurants=[],precincts=[];
for(const [idx,k] of [...FOOD].entries()){GA.delete(k);const [i,j]=k.split(',').map(Number),x=(i+.5)*P,z=(j+.5)*P,name=['Clutch Burgers','Red Rooster Grill','Hilltop Pizza'][idx%3];restaurants.push({x,z:z-14,side:1,name});mk(58,.15,58,0x777e80,x,.08,z,scene);mk(34,6,20,0xe9d3a7,x,3,z+9,scene);mk(36,1,22,0xb34e32,x,6.4,z+9,scene);mk(24,2,.2,0x364e59,x,3,z-1.2,scene);sign(name,x,7,z-2,0xa8402e);sign('DELIVERY PICKUP',x,3,z-22,0x806125);for(const dx of [-5,5])mk(.2,.05,9,0xf4c951,x+dx,.2,z-14,scene);WALLS.push({x0:x-17,x1:x+17,z0:z-1,z1:z+19})}
for(const k of POLICE){GA.delete(k);const [i,j]=k.split(',').map(Number),x=(i+.5)*P,z=(j+.5)*P;precincts.push({x,z});mk(58,.15,58,0x7e8891,x,.08,z,scene);mk(38,10,22,0xc5cbd1,x,5,z+10,scene);mk(39,1,23,0x254f80,x,10.5,z+10,scene);sign('POLICE STATION',x,8,z-1.2);mk(8,3,.3,0x245e97,x,1.5,z-1.3,scene);for(const dx of [-19,19]){const car=carMesh(0xffffff,1);car.position.set(x+dx,0,z-12);scene.add(car)}WALLS.push({x0:x-19,x1:x+19,z0:z-1,z1:z+21})}
function foodPoint(){const near=restaurants.slice().sort((a,b)=>Math.hypot(a.x-pl.x,a.z-pl.z)-Math.hypot(b.x-pl.x,b.z-pl.z));return near[Math.floor(R()*Math.min(3,near.length))]}
// Alternating north/south one-way corridors in the inner city.
function oneWay(i,j){return Math.abs(j)<6&&Math.abs(i)<=6&&Math.abs(i)%3===1?(i%2===0?1:-1):0}
for(let i=-6;i<=6;i++)for(let j=-5;j<6;j++){const dir=oneWay(i,j);if(!dir)continue;const x=i*P,z=j*P+40;mk(15.8,.025,40,0x2b2d31,x,.07,z,scene);sign(dir<0?'ONE WAY ↑':'ONE WAY ↓',x+10,3,z,0x235a8a);for(const lane of [-4,4]){const arrow=new THREE.Mesh(new THREE.PlaneGeometry(2.4,5),new THREE.MeshBasicMaterial({map:(()=>{const c=document.createElement("canvas");c.width=c.height=128;const q=c.getContext("2d");q.fillStyle="#f0eadb";q.font="100px sans-serif";q.fillText("→",8,100);return new THREE.CanvasTexture(c)})(),transparent:true}));arrow.rotation.x=-Math.PI/2;arrow.rotation.z=dir<0?Math.PI/2:-Math.PI/2;arrow.position.set(x+lane,.09,z);scene.add(arrow)}}
// Crossing pedestrians wait for an all-red walking phase.
const crossers=Array.from({length:24},(_,n)=>{const mesh=personMesh(n%2?0xd6ac51:0x6a9f95);scene.add(mesh);return {mesh,x:9999,z:9999,u:0,active:false,axis:n%2}});
function segmentDistance(px,pz,ax,az,bx,bz){const dx=bx-ax,dz=bz-az,t=cl(((px-ax)*dx+(pz-az)*dz)/(dx*dx+dz*dz||1),0,1);return Math.hypot(px-ax-t*dx,pz-az-t*dz)}
function crossingTick(dt,oldX,oldZ){for(const w of crossers){if(Math.hypot(w.x-pl.x,w.z-pl.z)>260){w.i=cl(Math.round(pl.x/P)+Math.floor(R()*5)-2,-MAP+2,MAP-2);w.j=cl(Math.round(pl.z/P)+Math.floor(R()*5)-2,-MAP+2,MAP-2);w.u=-10;w.active=false;w.crossed=false}const walk=walkPhase(w.i,w.j);if(walk&&!w.crossed&&!noLt(w.i,w.j))w.active=true;if(w.active){w.u+=dt*2;if(w.u>=10){w.u=10;w.active=false;w.crossed=true}}else if(!walk){w.u=-10;w.crossed=false;}w.x=w.i*P+(w.axis?12:w.u);w.z=w.j*P+(w.axis?w.u:12);w.mesh.visible=!noLt(w.i,w.j);w.mesh.position.set(w.x,elevation(w.x,w.z),w.z);w.mesh.rotation.y=w.axis?Math.PI: -Math.PI/2;w.mesh.legs.forEach((l,i)=>l.rotation.x=w.active?Math.sin(time*9+i*Math.PI)*.4:0);if(w.mesh.visible&&Math.abs(surfaceAt(pl)-elevation(w.x,w.z))<2&&Math.abs(pl.v)>.2&&segmentDistance(w.x,w.z,oldX,oldZ,pl.x,pl.z)<1.3){losePedestrian();return}}}
function losePedestrian(){state='lost';on=false;pl.v=0;fueling=false;setPhone(false);clearJob();if(ac){eg.gain.value=0;sg.gain.value=0}el('ov').innerHTML='<div><h1>RUN ENDED</h1><p>You hit a pedestrian. Slow down at intersections and give way at zebra crossings.</p><button class="go" onclick="reset()">Try again · R</button><button onclick="showMenu()">Controls</button></div>';el('ov').style.display='flex'}
// ring motorway: median barrier + gantries
for(const s of[-1,1])for(let q=-15;q<15;q++){const c=q*P+P/2;mk(.7,1,64,0x9a9a9a,s*1200,.5,c,scene);WALLS.push({x0:s*1200-.3,x1:s*1200+.3,z0:c-32,z1:c+32});mk(64,1,.7,0x9a9a9a,c,.5,s*1200,scene);WALLS.push({x0:c-32,x1:c+32,z0:s*1200-.3,z1:s*1200+.3});
if(q%2==0){for(const o of[-9.5,9.5]){mk(.5,6.6,.5,0x777777,s*1200+o,3.3,c,scene);mk(.5,6.6,.5,0x777777,c,3.3,s*1200+o,scene)}mk(19.5,.5,.5,0x777777,s*1200,6.6,c,scene);mk(8,2.2,.3,0x0a6b3a,s*1200,5.2,c,scene);mk(.5,.5,19.5,0x777777,c,6.6,s*1200,scene);mk(.3,2.2,8,0x0a6b3a,c,5.2,s*1200,scene)}}
for(const side of [-1,1])for(let n=-15;n<15;n++){const c=n*P+40;for(const axis of [0,1]){mk(axis?80:30,.035,axis?30:80,0x30363c,axis?c:side*1200,.025,axis?side*1200:c,scene);for(const lane of [-8,8])for(const off of [-24,0,24])mk(axis?9:.15,.025,axis?.15:9,0xe6e1ca,axis?c+off:side*1200+lane,.06,axis?side*1200+lane:c+off,scene)}if(n%4===0)sign('M1 · 100   CITY EXIT',c,8,side*1200,0x19613f)}
const CARS=[{n:'Hatch',T:190,m:1100,col:0xd23b2e,gr:[3.6,2.1,1.45,1.1,.9,.75]},{n:'Ute',T:380,m:2000,col:0xd8cfa0,gr:[4.2,2.3,1.5,1.05,.8,.65]},{n:'Sports',T:420,m:1300,col:0x2a6fd8,gr:[3.3,2.2,1.6,1.25,1,.82]}];
let carIdx=0;el('cars').innerHTML=CARS.map((c,i)=>`<button data-i="${i}" class="${i?'':'on'}">${c.n}</button>`).join('');
el('cars').onclick=e=>{if(e.target.dataset.i!=null){carIdx=+e.target.dataset.i;[...el('cars').children].forEach((b,i)=>b.className=i==carIdx?'on':'')}};
// street names (Brisbane CBD flavour)
const NSn=['Eagle St','Creek St','Edward St','Albert St','George St','William St','Wharf St','Boundary St','Gregory Tce','Petrie Tce'],EWn=['Margaret St','Alice St','Elizabeth St','Charlotte St','Mary St','Queen St','Adelaide St','Ann St','Turbot St','Wickham Tce'];
const sname=(x,z)=>scenicDistance(x,z)<12?'Eastern Scenic Drive':BIG_RB.some(c=>Math.hypot(x-c.x,z-c.z)<66)?'Grand Roundabout · give way':onHw(x,z)?'M1 · Outer Ring Highway':elevation(x,z)>8?'Scenic Hills · '+NSn[(Math.round(x/P)+50)%10]:oneWay(Math.round(x/P),Math.floor(z/P))?'ONE WAY · '+NSn[(Math.round(x/P)+50)%10]:Math.abs(x-Math.round(x/P)*P)<Math.abs(z-Math.round(z/P)*P)?NSn[(Math.round(x/P)+50)%10]:EWn[(Math.round(z/P)+50)%10];
const onHw=(x,z)=>HWL.some(L=>Math.abs(Math.abs(x)-L)<15&&Math.abs(z)<=L+15||Math.abs(Math.abs(z)-L)<15&&Math.abs(x)<=L+15),noLt=(i,j)=>HWI.some(h=>Math.abs(i)==h&&Math.abs(j)<=h||Math.abs(j)==h&&Math.abs(i)<=h)||RB.has(i+','+j),limitAt=(x,z)=>{const r=Math.max(Math.abs(x),Math.abs(z));return onHw(x,z)?100:r<400?50:r<640?60:80};
const rdX=x=>Math.abs(x-Math.round(x/P)*P)<8,rdZ=z=>Math.abs(z-Math.round(z/P)*P)<8;
function push(o){if(o.ug)return ugPush(o);{const b=bridgeInfo(o.x,o.z);if(b&&(o.surfaceY??0)>-1){const u=b.r.a==='z'?o.z:o.x;if(Math.abs(u-b.r.c)<36&&Math.abs(b.ba)>b.hw&&Math.abs(b.ba)<b.hw+6){const t=b.wc+Math.sign(b.ba)*b.hw;if(b.r.a==='z')o.x=t;else o.z=t;return 1}}}for(const f of FLY)if(Math.abs(o.x-f.x)<f.len&&Math.abs(o.z-f.z)<14){const g=elevation(o.x,o.z);if((o.surfaceY??g)-g>2.5){const dz=o.z-f.z;if(Math.abs(dz)>7.3){o.z=f.z+Math.sign(dz)*7.3;return 1}}}if(scenicDistance(o.x,o.z)<15&&bridgeRise(o.z)>1&&Math.abs((o.surfaceY??elevation(o.x,o.z))-roadY(o.x,o.z))<2&&scenicDistance(o.x,o.z)>9.5){o.x=scenicX(o.z)+Math.sign(o.x-scenicX(o.z))*9.4*Math.sqrt(1+Math.pow(100/180*Math.cos(o.z/180),2));return 1}if(scenicDistance(o.x,o.z)<10&&(bridgeRise(o.z)<1||surfaceAt(o)>elevation(o.x,o.z)+1))return 0;for(const w of WALLS)if(o.x>w.x0-.9&&o.x<w.x1+.9&&o.z>w.z0-.9&&o.z<w.z1+.9){const d=[o.x-(w.x0-.9),w.x1+.9-o.x,o.z-(w.z0-.9),w.z1+.9-o.z],mn=Math.min(...d),q=d.indexOf(mn);if(q==0)o.x=w.x0-.9;else if(q==1)o.x=w.x1+.9;else if(q==2)o.z=w.z0-.9;else o.z=w.z1+.9;return 1}
if(onHw(o.x,o.z))return 0;
for(const c of BIG_RB){const dx=o.x-c.x,dz=o.z-c.z,d=Math.hypot(dx,dz);if(d<66){if(d<31){o.x=c.x+(d<.01?1:dx/d)*31;o.z=c.z+(d<.01?0:dz/d)*31;return 1}return 0}}
if(scenicDistance(o.x,o.z)<10&&(bridgeRise(o.z)<1||surfaceAt(o)>elevation(o.x,o.z)+1))return 0;
{const ri=Math.round(o.x/P),rj=Math.round(o.z/P);if(RB.has(ri+','+rj)){const dx=o.x-ri*P,dz=o.z-rj*P,d=Math.hypot(dx,dz);if(d<4.3){o.x=ri*P+(d<.01?1:dx/d)*4.3;o.z=rj*P+(d<.01?0:dz/d)*4.3;return 1}}}const bk=Math.floor(o.x/P)+','+Math.floor(o.z/P);const L=PKC.get(bk);if(L)for(const w of L)if(bump(o,w))return 1;if([ST,GA,PK,PR,FOOD,POLICE].some(a=>a.has(bk)))return 0;const W=onHw(o.x,o.z)?15:10.2,rx=Math.round(o.x/P)*P,rz=Math.round(o.z/P)*P,dx=o.x-rx,dz=o.z-rz,ax=Math.abs(dx),az=Math.abs(dz);if(ax>=W&&az>=W){if(ax<az)o.x=rx+Math.sign(dx)*W;else o.z=rz+Math.sign(dz)*W;return 1}return 0}
// traffic lights (pooled around player)
let time=0;const COL={g:0x22dd55,y:0xffc400,r:0xff2222};
const signalPlan=(i,j)=>{const h=((i*31+j*17)%97+97)%97;return{green:8+h%8,turn:3+h%4,offset:(h*11)%79}};
function signalClock(i,j){const p=signalPlan(i,j);return ((time+p.offset)%64+64)%64}
function walkPhase(i,j){return signalClock(i,j)>=47&&signalClock(i,j)<58}
const lsx=(i,j,ax)=>{const q=signalClock(i,j),start=ax?24:0,t=q-start;return [t>=0&&t<15?'g':t>=15&&t<18?'y':'r',t>=18&&t<21?'g':t>=21&&t<23?'y':'r']},ls=(i,j,ax)=>lsx(i,j,ax)[0];
const arrowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#fff';x.beginPath();x.moveTo(14,52);x.lineTo(70,52);x.lineTo(70,24);x.lineTo(116,64);x.lineTo(70,104);x.lineTo(70,76);x.lineTo(14,76);x.fill();return new THREE.CanvasTexture(c)})();
const LG=new THREE.CircleGeometry(.29,20),AG=new THREE.PlaneGeometry(.5,.5),HB=new THREE.BoxGeometry(.8,2.4,.45),VB=new THREE.BoxGeometry(.62,.07,.3),HM=new THREE.MeshLambertMaterial({color:0x14161a}),DK=new THREE.MeshBasicMaterial({color:0x0a0a0a}),COLS=[0xff2a2a,0xffb800,0x2dff6a],DIMS=[0x3a0a0a,0x3a2a00,0x0a3a1a];
function makeHead(arrow){const g=new THREE.Group(),ms=[];g.add(new THREE.Mesh(HB,HM));for(let k=0;k<3;k++){const y=.8-k*.8,d=new THREE.Mesh(LG,DK);d.position.set(0,y,.23);g.add(d);let m;
if(arrow){m=new THREE.MeshBasicMaterial({map:arrowTex,transparent:true,color:DIMS[k]});const a=new THREE.Mesh(AG,m);a.position.set(0,y,.235);g.add(a)}else{m=new THREE.MeshBasicMaterial({color:DIMS[k]});const l=new THREE.Mesh(LG,m);l.position.set(0,y,.235);g.add(l)}
ms.push(m);const v=new THREE.Mesh(VB,HM);v.position.set(0,y+.34,.33);g.add(v)}scene.add(g);return{g,ms}}
const lamps=[];for(let a=0;a<9;a++)for(const[sx,sz]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const th=sx>0&&sz>0?Math.PI:sx<0&&sz<0?0:sx>0?-Math.PI/2:Math.PI/2;
lamps.push({pole:mk(.35,6.5,.35,0x6b7078,0,3.25,0,scene),arm:mk(1,.25,.25,0x6b7078,0,6.4,0,scene),hm:makeHead(0),ha:makeHead(1),a,sx,sz,ax:sx*sz>0?0:1,th})}
// state
const keys={};let role='car',state='menu',pl,gear,on,rpm,free,clutch,heat,over,wrongT,sideT,wasInt,hitCd,clearT,bustT,escapes=0,chase=false,ag=[],pmesh,pi=0,pj=0,steerS=0,msgT=0;
function msg(s,c){const m=el('msg');m.textContent=s;m.style.color=c||'#fff';m.style.opacity=1;msgT=2.6}
function offence(s,h){if(role==='cop'||ug.on)return;heat+=h*.65;if(job)job.off++;msg('⚠ '+s,'#ffb020')}
function reset(){ag.forEach(a=>scene.remove(a.mesh));ag=[];if(pmesh)scene.remove(pmesh);pmesh=avatar(role,CARS[carIdx].col);scene.add(pmesh);chase=role==='bike';applyRoleUI();
pl=cpt?{x:cpt.x,z:cpt.z,yaw:cpt.yaw,v:0}:{x:-4,z:24,yaw:0,v:0};fuel=38;lowFuel=false;clearSpikes();fueling=false;due=0;ug.on=false;ug.cool=3;camInit=false;setPhone(false);gear=0;sig=0;clearJob();on=true;rpm=free=900;clutch=1;heat=0;over=-2;wrongT=sideT=0;wasInt=false;hitCd=0;clearT=0;bustT=0;state='play';shiftWait=0;integrity=100;pl.surfaceY=elevation(pl.x,pl.z);lastA=lastB=wasInt=false;el('ov').style.display='none'}
const NB=[[1,0],[-1,0],[0,1],[0,-1]];
function pick(a){const cop=a.k!=='tr';let best=null,bd=1e9;const opts=NB.filter(([x,z])=>{const i=a.ni+x,j=a.nj+z;return Math.abs(i)<MAP&&Math.abs(j)<MAP&&hwOk(a.ni,a.nj,i,j)&&(x!==0||!oneWay(a.ni,Math.min(a.nj,j))||z===oneWay(a.ni,Math.min(a.nj,j)))&&!(i==a.pi&&j==a.pj)});if(!opts.length){a.pi=-99;return pick(a)}
for(const[x,z]of opts){const d=a.sus?-Math.hypot((a.ni+x)*P-pl.x,(a.nj+z)*P-pl.z)+R()*40:cop?Math.hypot((a.ni+x)*P-tgtX(a),(a.nj+z)*P-tgtZ(a))+R()*(a.k==='bike'?50:15):R();if(d<bd){bd=d;best=[x,z]}}
{const ox=a.ni-a.pi,oz=a.nj-a.pj;a.sig=a.pi==-99?0:Math.sign(ox*best[1]-oz*best[0]);a.sigT=2.2}a.pi=a.ni;a.pj=a.nj;a.ni+=best[0];a.nj+=best[1];a.lx=best[1]*4.2;a.lz=-best[0]*4.2}
function spawn(k){let i,j,t=0;const mn=k==='tr'?2:3;do{i=pi+Math.round((R()*2-1)*6);j=pj+Math.round((R()*2-1)*6);t++}while((Math.abs(i)>=MAP||Math.abs(j)>=MAP||Math.abs(i-pi)+Math.abs(j-pj)<mn)&&t<40);i=cl(i,-MAP+1,MAP-1);j=cl(j,-MAP+1,MAP-1);{const hs=(k==='tr'?R()<.3:onHw(pl.x,pl.z))?hwSpawnNode():null;if(hs){i=hs[0];j=hs[1]}}
const mesh=k==='tr'?carMesh(new THREE.Color().setHSL(R(),.5,.45)):k==='car'?carMesh(0xf4f4f4,1):k==='bike'?bikeMesh():heliMesh();scene.add(mesh);
const a={k,mesh,x:i*P,z:j*P,yaw:R()*6.28,v:0,ni:i,nj:j,pi:-99,pj:-99,lx:0,lz:0,role:R()<.45?'cut':'chase'};if(k==='heli'){a.x+=R()*200-100}pick(a);ag.push(a)}
function wrap(a){while(a>Math.PI)a-=6.283;while(a<-Math.PI)a+=6.283;return a}
function updAgent(a,dt){const stars=Math.min(5,Math.floor(heat)),d0=Math.hypot(pl.x-a.x,pl.z-a.z)+(ug.on?999:0);a.d=d0;if(a.wrecked){a.life-=dt;a.v*=Math.max(0,1-dt*1.8);a.yaw+=a.spin*dt*Math.min(1,a.v/8);a.x+=-Math.sin(a.yaw)*a.v*dt;a.z+=-Math.cos(a.yaw)*a.v*dt;push(a);a.mesh.position.set(a.x,elevation(a.x,a.z),a.z);a.mesh.rotation.y=a.yaw;const q=(time*3)%1;a.smoke.scale.setScalar(.8+q*1.6);a.smoke.position.y=1.4+q*2.5;if(a.life<=0)a.dead=1;return}if(a.k==='blk'){a.life-=dt;if(a.life<=0)a.dead=1;a.mesh.position.set(a.x,elevation(a.x,a.z),a.z);a.mesh.rotation.y=a.yaw;a.mesh.l1.visible=Math.floor(time*8)%2==0;a.mesh.l2.visible=!a.mesh.l1.visible;return}
if(a.k==='heli'){const tv=Math.min(21+stars,d0*.9);const ang=Math.atan2(pl.x-a.x,pl.z-a.z);a.v+=(tv-a.v)*dt;a.x+=Math.sin(ang)*a.v*dt;a.z+=Math.cos(ang)*a.v*dt;a.yaw=ang+Math.PI;a.mesh.position.set(a.x,45,a.z);a.mesh.rotation.y=a.yaw;a.mesh.rot.rotation.y+=dt*30;return}
let tx=a.ni*P+a.lx,tz=a.nj*P+a.lz,direct=a.k!=='tr'&&d0<45&&(Math.abs(a.x-pl.x)<9||Math.abs(a.z-pl.z)<9);
if(direct){const lt=Math.min(1.5,d0/30);tx=pl.x-Math.sin(pl.yaw)*pl.v*lt;tz=pl.z-Math.cos(pl.yaw)*pl.v*lt}let dx=tx-a.x,dz=tz-a.z;
if(!direct&&Math.hypot(dx,dz)<14&&!a.hold)pick(a);
const des=Math.atan2(-dx,-dz),tr=a.k==='bike'?3.6:2.6;a.yaw+=cl(wrap(des-a.yaw),-tr*dt,tr*dt);
const turn=Math.abs(wrap(des-a.yaw)),sp0=a.k==='tr'?(a.sus?(onHw(a.x,a.z)?30:22):onHw(a.x,a.z)?24:13):a.k==='car'?17+stars*1.3:19+stars*1.4,sp1=sp0*(a.k==='tr'?1:1-Math.min(.55,turn*.6)),sp=a.k!=='tr'&&d0<18&&Math.abs(pl.v)<8?Math.min(sp1,Math.max(5,d0*.8)):(a.k==='tr'?Math.min(sp1,tcLimit(a)):sp1);a.v+=(sp-a.v)*dt*(sp<a.v?3:1.2);
a.x+=-Math.sin(a.yaw)*a.v*dt;a.z+=-Math.cos(a.yaw)*a.v*dt;if(push(a))a.v*=.9;
if(a.k==='tr'){a.sigT=(a.sigT||0)-dt;setBl(a.mesh,a.sigT>0?a.sig:0,Math.floor(time*2.8)%2==0)}a.mesh.position.set(a.x,a.surfaceY=ySurf(a.x,a.z),a.z);a.mesh.rotation.y=a.yaw;if(a.mesh.l1){const f=Math.floor(time*8)%2;a.mesh.l1.visible=f==0;a.mesh.l2.visible=f==1}}
const lead=a=>a.role==='cut'?5:1.5,tgtX=a=>pl.x-Math.sin(pl.yaw)*pl.v*lead(a),tgtZ=a=>pl.z-Math.cos(pl.yaw)*pl.v*lead(a);let rbT=12;
let fueling=false,due=0,bal=800,inPump=false;const PRICE=2.1;
function tap(){const c=el('card');c.style.opacity=1;setTimeout(()=>c.style.opacity=0,900);if(!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=1500;g.gain.value=.08;o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.18)}
function pumpTick(dt){inPump=SP.some(s=>Math.abs(pl.x-s.x)<15&&Math.abs(pl.z-s.z)<8);const slow=Math.abs(pl.v)<1.5;let h='';
if(fueling){if(!inPump||!slow){fueling=false;msg('Hose pulled out!','#ff6b6b')}else{const add=Math.min(FM-fuel,dt*9);fuel+=add;due+=add*PRICE;if(fuel>FM*.2)lowFuel=false;if(fuel>=FM-.01){fueling=false;msg('Tank full','#4ade80')}else h='\u26fd Fuelling '+Math.round(fuel)+' L \u00b7 due $'+due.toFixed(2)+' (F to stop)'}}
else if(inPump&&slow){h=due>0?'Due $'+due.toFixed(2)+' \u2014 press P to tap your card':fuel<FM-.1?'Press F to fuel · $2.10/L · engine switches off':'Tank full · clutch + I to restart'}
if(due>0&&!inPump&&Math.abs(pl.v)>3){offence('Petrol drive-off! $'+due.toFixed(2)+' unpaid',1);due=0;fueling=false}
el('hint').textContent=h;el('cash').textContent='\ud83d\udcb3 $'+bal.toFixed(2)+'  \u00b7  \u26fd '+Math.round(fuel)+' L'+(due>0?'  \u00b7  due $'+due.toFixed(2):'')}
function garageTick(dt){if(heat>0&&precincts.some(s=>Math.hypot(s.x-pl.x,s.z-pl.z)<55))clearT=0;ug.cool-=dt;if(ug.on){ug.t+=dt;if(pl.x<UGX-27&&ug.t>1.5)exitUG()}const gHit=ug.on?null:GAR.find(g=>Math.abs(pl.x-g.x)<5.5&&pl.z>g.z-5&&pl.z<g.z+7);if(gHit&&ug.cool<=0)enterUG(gHit);const inG=ug.on||!!gHit;
if(inG&&Math.abs(pl.v)<2){hideT+=dt;if(heat>=1){msg('Hiding\u2026 '+Math.max(0,Math.ceil(4-hideT))+'s','#6cf');if(hideT>=4){heat=0;clearT=0;escapes++;bal+=150;ag.forEach(a=>{if(a.k!=='tr')a.dead=1});cpt=ugCpt();msg('\ud83c\udfe0 Safe! Police lost you. Checkpoint saved.','#4ade80')}}
else if(hideT>1.5&&(!cpt||Math.hypot(cpt.x-pl.x,cpt.z-pl.z)>5)){cpt=ugCpt();msg('Checkpoint saved \u2714','#4ade80')}}else hideT=0}
function wreck(o){o.wrecked=1;o.life=7;o.spin=(R()-.5)*8;o.mesh.traverse(m=>{if(m.material)m.material.color.multiplyScalar(.2)});if(o.mesh.l1)o.mesh.l1.visible=o.mesh.l2.visible=false;o.smoke=mk(1,1,1,0x444444,0,2,0,o.mesh)}
function roadblock(){const fx=-Math.sin(pl.yaw),fz=-Math.cos(pl.yaw),ax=Math.abs(fx)>Math.abs(fz);const ni=cl(Math.round((pl.x+fx*230)/P),-10,10),nj=cl(Math.round((pl.z+fz*230)/P),-10,10);if(Math.hypot(ni*P-pl.x,nj*P-pl.z)<120)return;
for(const s of[-6.45,-2.15,2.15,6.45]){const x=ax?ni*P-Math.sign(fx)*28:ni*P+s,z=ax?nj*P+s:nj*P-Math.sign(fz)*28,mesh=carMesh(0xf4f4f4,1);scene.add(mesh);ag.push({k:'blk',mesh,x,z,yaw:ax?0:Math.PI/2,v:0,d:999,life:18,ni:0,nj:0})}msg('📻 Police have set up a roadblock ahead!','#6cf')}
// audio
let ac,eo,eg,so,sg;function audio(){if(ac)return;ac=new(window.AudioContext||window.webkitAudioContext)();eo=ac.createOscillator();eg=ac.createGain();eo.type='sawtooth';eo.connect(eg).connect(ac.destination);eo.start();eg.gain.value=0;
so=ac.createOscillator();sg=ac.createGain();so.type='square';so.connect(sg).connect(ac.destination);so.start();sg.gain.value=0}
// Keep the original menu and its button handlers when the busted screen replaces it.
const mainMenu=el('ov').firstElementChild;
function showMenu(){setPhone(false);state='menu';for(const k in keys)keys[k]=0;fueling=false;if(ac){eg.gain.value=0;sg.gain.value=0}el('ov').replaceChildren(mainMenu);el('ov').style.display='flex'}
// input
addEventListener('keydown',e=>{if(e.code==='Escape'){e.preventDefault();if(!e.repeat)showMenu();return}keys[e.code]=1;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.repeat||state!=='play'&&e.code!=='KeyR')return;
if(e.code=='KeyE')shift(1);if(e.code=='KeyQ')shift(-1);if(e.code=='KeyV')chase=!chase;if(e.code=='KeyJ')sig=sig==-1?0:-1;if(e.code=='KeyL')sig=sig==1?0:1;if(e.code=='KeyK')sig=sig==2?0:2;if(e.code=='KeyM'){bigMap=!bigMap;MK=bigMap?4:1;LWS=bigMap?.38:1;const c=el('mm');c.width=c.height=150*MK;c.classList.toggle('big',bigMap)}if(e.code=='KeyT')setPhone(!phoneOpen);if(e.code=='KeyF'&&inPump&&Math.abs(pl.v)<1.5&&fuel<FM-.1){fueling=!fueling;if(fueling){on=false;rpm=0;msg('Engine off · filling at $2.10/L. P to pay; clutch + I to restart')}}
if(e.code==='KeyH'&&fuel<1&&Math.abs(pl.v)<.5){if(bal>=65){bal-=65;fuel+=8;lowFuel=false;msg('Roadside fuel delivered: 8 L. Hold clutch + I to restart','#4ade80')}else msg('Roadside delivery costs $65. Press R to restart.','#ffb020')}
if(e.code=='KeyP'){fueling=false;if(due>0&&inPump){if(bal>=due){bal-=due;msg('Paid $'+due.toFixed(2)+' \u2714','#4ade80');due=0;tap()}else msg('Card declined: insufficient funds','#ff6b6b')}}if(e.code=='KeyR')reset();
if(e.code=='KeyI'&&!on){if(fuel<=0)msg('No fuel! Coast to a servo','#ff6b6b');else if(clutch>.5){on=true;rpm=free=900;msg('Engine started')}else msg('Hold the clutch then press I')}});
addEventListener('keyup',e=>keys[e.code]=0);addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
let shiftWait=0;
function shift(d){if(shiftWait>0)return;if(clutch<.5){msg('Hold the clutch (Shift or Z) to change gear!','#ff6b6b');return}const n=cl(gear+d,-1,6);if(n<0&&Math.abs(pl.v)>2){msg('Too fast for reverse','#ff6b6b');return}gear=n;shiftWait=.45}
el('go').onclick=()=>{audio();reset()};
// Impact severity uses relative velocity, so head-on and police impacts count too.
let integrity=100;
function crash(impact){if(state!=='play'||impact<2)return;integrity=Math.max(0,integrity-Math.pow(impact*3.6/8,2));shake=.8;if(impact*3.6>=50||integrity<=0){state='lost';on=false;rpm=0;pl.v=0;fueling=false;setPhone(false);clearJob();if(ac){eg.gain.value=sg.gain.value=0}el('kmh').textContent='0';el('ov').innerHTML='<div><h1>FATAL CRASH</h1><p>You died in the collision. Brake earlier and slow down before tight turns.</p><button class="go" onclick="reset()">Try again · R</button><button onclick="showMenu()">Controls</button></div>';el('ov').style.display='flex'}else msg('Crash · vehicle integrity '+Math.ceil(integrity)+'%','#ff6b6b')}
// physics
function drive(dt){return role==='ped'?footTick(dt):driveCar(dt)}
function driveCar(dt){const oldX=pl.x,oldZ=pl.z;const c=roleCar(),th=(keys.KeyW||keys.ArrowUp)&&on?1:0,br=keys.KeyS||keys.ArrowDown,hb=keys.Space,st=(keys.KeyA||keys.ArrowLeft?1:0)-(keys.KeyD||keys.ArrowRight?1:0);
const drift0=hb&&Math.abs(pl.v)>12&&Math.abs(steerS)>.15;const ct=(keys.ShiftLeft||keys.ShiftRight||keys.KeyZ)?1:0;clutch+=(ct-clutch)*Math.min(1,dt*(ct?12:2.2));const t=cl((1-clutch-.15)/.55,0,1);
shiftWait=Math.max(0,shiftWait-dt);
const gearSpeeds=[30,55,85,120,160,205],ratio=gear==0?0:6000*.32/(9.549*((gear<0?24:gearSpeeds[gear-1])/3.6)),wr=Math.abs(pl.v)/.32*9.549*ratio;
if(!on)rpm=0;else{free+=(900+th*5100-free)*Math.min(1,dt*(th?2:2.5));rpm=Math.min(6000,gear==0||t<.02?free:free+(wr-free)*t);
if(gear!=0&&t>.85&&rpm<(th?120:380)){on=false;rpm=0;msg('STALLED! Clutch in + press I','#ff6b6b')}}
let F=0;if(on&&gear!=0){const tq=wr>=6000||shiftWait>0?0:c.T*Math.max(.35,1-Math.pow((rpm-4300)/4300,2));F=(gear<0?-1:1)*(tq*th*ratio/.32)*t;
const eb=(rpm/6000)*.25*c.T*ratio/.32*t*(th?0:1);F-=Math.sign(pl.v)*Math.min(eb,Math.abs(pl.v)*c.m/dt*.5)}
const drag=.92*pl.v*Math.abs(pl.v)+150*Math.sign(pl.v);let a=(F-drag)/c.m-9.81*slopeAt(pl.x,pl.z,pl.yaw);
if(br)a-=Math.sign(pl.v||a)*Math.min(10,Math.abs(pl.v)/dt+Math.abs(a));if(hb)a-=Math.sign(pl.v||a)*Math.min(drift0?3:12,Math.abs(pl.v)/dt+Math.abs(a));
const v0=pl.v;pl.v+=a*dt;if(gear!==0&&t>.95&&th&&Math.abs(pl.v)>(gear<0?24:gearSpeeds[gear-1])/3.6)pl.v=Math.sign(pl.v)*(gear<0?24:gearSpeeds[gear-1])/3.6;if((br||hb)&&v0*pl.v<0)pl.v=0;if(!F&&Math.abs(pl.v)<.05)pl.v=0;
steerS+=(st-steerS)*Math.min(1,dt*7);const sa=steerS*.55/(1+Math.abs(pl.v)*.04);pl.yaw+=pl.v*Math.tan(sa)/2.7*dt*(drift0?2.4:hb?1.6:1);if(drift0){pl.slip=(pl.slip||0)-steerS*Math.abs(pl.v)*.3*dt;pl.driftT=(pl.driftT||0)+dt;shake=Math.max(shake,.12)}else if((pl.driftT||0)>0&&Math.abs(pl.slip||0)<1.5){if(pl.driftT>1.2){const pts=Math.round(pl.driftT*Math.abs(pl.v)*.9);bal+=pts;msg('\ud83c\udfce Drift! +$'+pts,'#4ade80')}pl.driftT=0}pl.slip=(pl.slip||0)*Math.pow(drift0?.55:.04,dt);if(pl.slip)pl.v-=Math.sign(pl.v)*Math.abs(pl.slip)*.15*dt;if(pl.flat){const cap=45*(1-.2*pl.flat);if(Math.abs(pl.v)>cap)pl.v=Math.sign(pl.v)*cap;pl.yaw+=pl.flat*.06*(pl.flatSide||1)*Math.min(1,Math.abs(pl.v)/12)*dt*Math.sign(pl.v||1)}
pl.x+=(-Math.sin(pl.yaw)*pl.v-Math.cos(pl.yaw)*(pl.slip||0))*dt;pl.z+=(-Math.cos(pl.yaw)*pl.v+Math.sin(pl.yaw)*(pl.slip||0))*dt;pl.x=cl(pl.x,-EDGE,EDGE);pl.z=cl(pl.z,-EDGE,EDGE);{const ed=Math.max(Math.abs(pl.x),Math.abs(pl.z));if(ed>EDGE-150){edgeT-=dt;if(edgeT<=0){edgeT=3;msg('\u26a0 WORLD EDGE ahead \u2014 turn back','#ff6b6b')}}if(ed>=EDGE-.5)pl.v*=Math.pow(.1,dt)}
const sv=Math.abs(pl.v);fuelTick(dt,th,c);pumpTick(dt);garageTick(dt);copTick(dt);pedestrianTick(dt);crossingTick(dt,oldX,oldZ);for(const w of walkers)if(Math.abs(surfaceAt(pl)-elevation(w.x,w.z))<2&&Math.abs(pl.v)>.2&&segmentDistance(w.x,w.z,oldX,oldZ,pl.x,pl.z)<1.3){losePedestrian();break}if(state!=="play")return {kmh:0,lim:50,th:0};jobTick(dt);phoneTick();if(push(pl)){crash(sv);if(state!=="play")return {kmh:0,lim:50,th:0};if(sv>10)offence('Crash',.3);pl.v*=-.25;hitCd=.5}
// rules
pl.surfaceY=surfaceAt(pl);if(pl.surfaceY<-1.8&&!ug.on&&inRiver(pl.x,pl.z)){wetT+=dt;pl.v*=Math.pow(.12,dt);if(wetT>2.2){wetT=0;crash(20)}else if(wetT<dt*2)msg('\u26a0 In the river! Get out!','#ff6b6b')}else wetT=0;const fx=-Math.sin(pl.yaw),fz=-Math.cos(pl.yaw),kmh=sv*3.6,lim=limitAt(pl.x,pl.z),A=rdX(pl.x),B=rdZ(pl.z),inter=A&&B&&surfaceAt(pl)-elevation(pl.x,pl.z)<2&&!reserved(pl.x,pl.z);
if(kmh>lim+8){over+=dt;if(over>1.2){offence(`Speeding ${Math.round(kmh)} in a ${lim} zone`,.5);over=-4}}else over=Math.min(0,over+dt*.2);
if(inter&&!wasInt){const ax=lastA&&!lastB?0:lastB&&!lastA?1:-1;if(ax>=0&&!noLt(Math.round(pl.x/P),Math.round(pl.z/P))){const[mn,ar]=lsx(Math.round(pl.x/P),Math.round(pl.z/P),ax);entryArrow=mn=='r'&&ar!='r';entryYaw=pl.yaw;if(sv>3&&mn=='r'&&ar=='r')offence('Ran a red light',1)}}
if(wasInt&&!inter&&entryArrow){entryArrow=false;if(wrap(pl.yaw-entryYaw)>-.7)offence('Drove straight on the turn arrow',1)}if(wasInt&&!inter){const tn=wrap(pl.yaw-entryYaw);if(Math.abs(tn)>.7){const dir=tn>0?-1:1;if(lastSig!==dir&&lastSig!==2)offence('Failed to indicate',.25);if(sig===dir)sig=0}}{const ri=Math.round(pl.x/P),rj=Math.round(pl.z/P);if(RB.has(ri+','+rj)&&sv>4){const rx=pl.x-ri*P,rz=pl.z-rj*P,vx=-Math.sin(pl.yaw)*pl.v,vz=-Math.cos(pl.yaw)*pl.v,cr=rx*vz-rz*vx;if(Math.hypot(rx,rz)<9&&cr<-sv*3){rbW+=dt;if(rbW>1.2){offence('Wrong way around the roundabout',.5);rbW=-4}}else rbW=Math.min(0,rbW+dt)}}if(!inter)lastSig=sig;wasInt=inter;lastA=A;lastB=B;
const ow=A&&!inter&&!reserved(pl.x,pl.z)?oneWay(Math.round(pl.x/P),Math.floor(pl.z/P)):0;if(ow&&sv>2&&Math.sign(fz*pl.v)!==ow){wrongT+=dt;if(wrongT>1.5){offence('Wrong way on a one-way street',1);wrongT=-3}}
if(!ow&&!inter&&!reserved(pl.x,pl.z)&&sv>6){let side=0;if(A){const sg=Math.sign(fz*pl.v)||1;side=(pl.x-Math.round(pl.x/P)*P)*sg*-1*-1}else if(B){const sg=Math.sign(fx*pl.v)||1;side=-(pl.z-Math.round(pl.z/P)*P)*sg}
// A: heading +z => left is +x ; heading -z => left is -x
if(A){const dirz=Math.sign(fz*pl.v);side=(pl.x-Math.round(pl.x/P)*P)*dirz}
if(side<-1.2){wrongT+=dt;if(wrongT>2){offence('Driving on the wrong side',.5);wrongT=-3}}else wrongT=Math.max(0,wrongT-dt)}
const sidewalk=!reserved(pl.x,pl.z)&&!onHw(pl.x,pl.z)&&!A&&!B&&!accessSurface(pl.x,pl.z);if(sidewalk&&sv>5){sideT+=dt;if(sideT>1){offence('Driving on the footpath',.5);sideT=-3}}else sideT=Math.min(0,sideT+dt);
hitCd-=dt;for(const o of ag){if(o.k==='heli'||Math.abs(surfaceAt(o)-surfaceAt(pl))>3)continue;const d=Math.hypot(o.x-pl.x,o.z-pl.z);
if(d<3.4&&hitCd<=0){const relativeImpact=Math.hypot(-Math.sin(pl.yaw)*pl.v+Math.sin(o.yaw)*(o.v||0),-Math.cos(pl.yaw)*pl.v+Math.cos(o.yaw)*(o.v||0));crash(relativeImpact);if(state!=='play')return {kmh:0,lim:50,th:0}}
if(o.k!=='tr'&&!o.wrecked&&d<3.4&&hitCd<=0){const impact=Math.hypot(-Math.sin(pl.yaw)*pl.v+Math.sin(o.yaw)*(o.v||0),-Math.cos(pl.yaw)*pl.v+Math.cos(o.yaw)*(o.v||0));if(impact>5){o.hp=(o.hp??100)-impact*6;hitCd=.8;pl.v*=.7;shake=.8;if(o.hp<=0){wreck(o);offence('Police vehicle destroyed',.6);continue}else msg('Police vehicle damaged · '+Math.ceil(o.hp)+'% integrity','#ffb020')}}
if(o.k==='blk'&&!o.wrecked&&d<3.4&&d>.1){pl.x+=(pl.x-o.x)/d*(3.4-d);pl.z+=(pl.z-o.z)/d*(3.4-d);pl.v*=.5}if(d<3.2&&hitCd<=0){hitCd=.8;pl.v*=.45;shake=.6;if(o.k==='tr'){if(sv>3)offence('Collision',.7);else msg('Hit by another driver','#ffb020')}else if(!o.wrecked)msg('Rammed by police!','#ff6b6b')}
if(o.k!=='tr'&&!o.wrecked&&d<7&&sv<3)bustT+=dt/ag.length*0+dt/Math.max(1,ag.filter(q=>q.k!=='tr'&&!q.wrecked&&q.d<7).length)}
return{kmh,lim,th}}
let lastA=false,lastB=false,shake=0,entryArrow=false,entryYaw=0,sig=0,lastSig=0,lastBl=false,rbW=0;
function frame(ts){requestAnimationFrame(frame);const dt=Math.min(.05,(ts-(frame.l||ts))/1000);frame.l=ts;time+=dt;
if(msgT>0){msgT-=dt;if(msgT<=0)el('msg').style.opacity=0}
if(state==='play'){const r=drive(dt);if(state!=='play')return;pi=Math.round(pl.x/P);pj=Math.round(pl.z/P);
const stars=Math.min(5,Math.floor(heat)),need={car:stars?stars+1:0,bike:Math.max(0,stars-1),heli:Math.max(0,stars-2)},cnt={tr:0,car:0,bike:0,heli:0};ag.forEach(a=>{if(!a.wrecked)cnt[a.k]++});
for(const k of['car','bike','heli'])if(cnt[k]<need[k]&&R()<dt*1.5)spawn(k);if(cnt.tr<70&&R()<dt*6)spawn('tr');if(stars>=3&&(rbT-=dt)<=0){rbT=22;roadblock()}if(!stars)rbT=12;
let seen=false,near=1e9;for(const a of ag){updAgent(a,dt);if(a.k!=='tr'&&!a.wrecked){near=Math.min(near,a.d);if(a.k!=='blk'&&a.d<(a.k==='heli'?350:250))seen=true}}
ag=ag.filter(a=>{const far=Math.hypot(a.x-pl.x,a.z-pl.z)>(a.k==='tr'?500:750),ex=(a.k!=='tr'&&heat==0)||(a.k==='car'&&cnt.car>need.car+1);if(far||ex||a.dead){scene.remove(a.mesh);return false}return true});
if(stars<1)heat=Math.max(0,heat-dt*.04);if(stars>0){if(!seen){clearT+=dt;if(clearT>10){heat=0;escapes++;bal+=150;clearT=0;msg('🏁 You escaped! Total escapes: '+escapes,'#4ade80')}else if(!msgT&&Math.floor(clearT)>0)msg(`Evading… ${10-Math.floor(clearT)}s`,'#9fd')}else clearT=Math.max(0,clearT-dt*2)}else clearT=0;
if(bustT>2.5&&state==='play'){state='busted';setPhone(false);clearJob();bal=Math.max(0,bal-200);el('ov').style.display='flex';el('ov').innerHTML='<div><h1>BUSTED 🚓</h1><p>You stopped with police on you. Fined $200. Escapes: '+escapes+'</p><button class="go" onclick="reset()">Drive again (R)</button></div>'}
if(!ag.some(a=>a.k!=='tr'&&!a.wrecked&&a.d<7&&Math.abs(pl.v)<3))bustT=Math.max(0,bustT-dt);
// hud
el('kmh').textContent=Math.round(r.kmh);el('gr').textContent=gear<0?'R':gear==0?'N':gear;el('rp').style.width=cl(rpm/6000*100,0,100)+'%';el('rp').style.background=rpm>5600?'#f55':'#4ade80';el('rpmt').textContent=(on?Math.round(rpm/50)*50+' rpm':'ENGINE OFF')+' · '+Math.round(fuel)+' L · '+Math.ceil(integrity)+'% integrity';el('cp').style.width=Math.round(clutch*100)+'%';
{const b=!!sig&&Math.floor(time*2.8)%2==0;if(b!==lastBl){lastBl=b;if(sig&&ac){const o=ac.createOscillator(),g2=ac.createGain();o.type='square';o.frequency.value=b?1100:800;g2.gain.value=.025;o.connect(g2).connect(ac.destination);o.start();o.stop(ac.currentTime+.03)}}}el('lim').textContent=r.lim;el('st').textContent='★'.repeat(stars)+'☆'.repeat(5-stars);el('street').textContent=sname(pl.x,pl.z)+(clearT>0?'  · evading':'');
cockpit(r);el('spd').style.display=chase?'block':'none';
// camera
dome.position.set(pl.x,0,pl.z);sun.position.set(pl.x+100,200,pl.z+60);sun.target.position.set(pl.x,0,pl.z);pmesh.position.set(pl.x,surfaceAt(pl),pl.z);pmesh.rotation.order='YXZ';pmesh.rotation.x=role==='ped'?0:-slopeAt(pl.x,pl.z,pl.yaw);pmesh.rotation.y=pl.yaw+(pl.slip||0)*.03;pmesh.rotation.z=role==='ped'?0:-steerS*Math.min(.07,Math.abs(pl.v)*.0025);pmesh.visible=chase;setBl(pmesh,sig,Math.floor(time*2.8)%2==0);const fx=-Math.sin(pl.yaw),fz=-Math.cos(pl.yaw);shake=Math.max(0,shake-dt*2);const sh=(R()-.5)*shake*.3;
if(chase){const sy=surfaceAt(pl);if(!camInit){camYaw=pl.yaw;camY=sy;camInit=true}camYaw+=wrap(pl.yaw-camYaw)*Math.min(1,dt*(role==='ped'?10:4.5));camY+=(sy-camY)*Math.min(1,dt*6);const cf=-Math.sin(camYaw),cz2=-Math.cos(camYaw),back=role==='ped'?4:role==='bike'?6.5:8.5,hgt=role==='ped'?2:3.1;cam.position.set(pl.x-cf*back,camY+hgt+sh,pl.z-cz2*back);cam.lookAt(pl.x+cf*5,camY+1.3,pl.z+cz2*5)}else{cam.position.set(pl.x+Math.cos(pl.yaw)*.45+fx*.2,1.2+sh+surfaceAt(pl),pl.z-Math.sin(pl.yaw)*.45+fz*.2);cam.rotation.set(-.04+sh*.2-slopeAt(pl.x,pl.z,pl.yaw),pl.yaw-steerS*.05,0)}
// lamps
lamps.forEach(o=>{const ci=pi+(o.a%3)-1,cj=pj+Math.floor(o.a/3)-1,px=ci*P+o.sx*9.6,pz=cj*P+o.sz*9.6,ns=o.ax==0,vis=!noLt(ci,cj)&&!reserved(ci*P,cj*P);
const mx=ns?ci*P+o.sx*4.2:px,mz=ns?pz:cj*P+o.sz*4.2,ax2=ns?ci*P+o.sx*2.2:px,az2=ns?pz:cj*P+o.sz*2.2;
o.pole.position.set(px,3.25,pz);o.arm.position.set(ns?(px+ax2)/2:px,6.4,ns?pz:(pz+az2)/2);o.arm.scale.set(ns?Math.abs(px-ax2):.25,.25,ns?.25:Math.abs(pz-az2));
o.pole.position.y+=elevation(px,pz);o.arm.position.y+=elevation(px,pz);o.hm.g.position.set(mx,5+elevation(mx,mz),mz);o.ha.g.position.set(ax2,5+elevation(ax2,az2),az2);o.hm.g.rotation.y=o.ha.g.rotation.y=o.th;for(const v of[o.pole,o.arm,o.hm.g,o.ha.g])v.visible=vis;
const[mn,ar]=lsx(ci,cj,o.ax),set=(h,s)=>{const q={r:0,y:1,g:2}[s];h.ms.forEach((m,k)=>m.color.setHex(k==q?COLS[k]:DIMS[k]))};set(o.hm,mn);set(o.ha,ar)});
// audio
if(ac){eo.frequency.value=22+rpm/28;eg.gain.value=on?.03+r.th*.03:0;const sr=near<400?Math.min(.05,.05*(1-near/400)):0;sg.gain.value=sr;so.frequency.value=800+Math.sin(time*6)*300}
// minimap
const m=el('mm').getContext('2d');m.setTransform(MK,0,0,MK,0,0);m.clearRect(0,0,150,150);m.fillStyle='#10161d';m.fillRect(0,0,150,150);const sc=75/(bigMap?1500:320);m.strokeStyle='#3b4a5a';m.lineWidth=3;
for(let i=-5;i<=5;i++){const x=75+(( (pi+i)*P-pl.x)*sc),z=75+(((pj+i)*P-pl.z)*sc);m.beginPath();m.moveTo(x,0);m.lineTo(x,150);m.moveTo(0,z);m.lineTo(150,z);m.stroke()}
m.strokeStyle='#91b9aa';m.lineWidth=4;m.beginPath();scenicPoints.forEach((p,i)=>{const x=75+(p.x-pl.x)*sc,z=75+(p.z-pl.z)*sc;i?m.lineTo(x,z):m.moveTo(x,z)});m.stroke();for(const c of BIG_RB){m.beginPath();m.arc(75+(c.x-pl.x)*sc,75+(c.z-pl.z)*sc,42*sc,0,Math.PI*2);m.stroke()}
for(const a of ag){if(a.k==='tr'||a.wrecked)continue;const x=75+(a.x-pl.x)*sc,z=75+(a.z-pl.z)*sc;if(x<0||z<0||x>150||z>150)continue;m.fillStyle=a.k==='heli'?'#fff':Math.floor(time*6)%2?'#f33':'#38f';m.fillRect(x-3,z-3,6,6)}
m.strokeStyle='#d5ab55';m.lineWidth=6;for(const v of HWL.flatMap(L=>[-L,L])){const a=75+(v-pl.x)*sc,b=75+(v-pl.z)*sc;m.beginPath();m.moveTo(a,0);m.lineTo(a,150);m.moveTo(0,b);m.lineTo(150,b);m.stroke()}m.fillStyle='#2b6cb0';for(const r of RIV){const L=r.w1-r.w0+160;if(r.a==='z')m.fillRect(75+(r.w0-80-pl.x)*sc,75+(r.c-32-pl.z)*sc,L*sc,64*sc);else m.fillRect(75+(r.c-32-pl.x)*sc,75+(r.w0-80-pl.z)*sc,64*sc,L*sc)}m.strokeStyle='#ff3b3b';m.lineWidth=5;for(const v of [-EDGE,EDGE]){const a=75+(v-pl.x)*sc,b=75+(v-pl.z)*sc;m.beginPath();m.moveTo(a,0);m.lineTo(a,150);m.moveTo(0,b);m.lineTo(150,b);m.stroke()}for(const [places,color,label] of [[restaurants,'#ef9957','F'],[precincts,'#c7d9fa','P']]){m.fillStyle=color;m.font='bold 11px sans-serif';for(const point of places){const x=75+(point.x-pl.x)*sc,z=75+(point.z-pl.z)*sc;if(x>4&&x<140&&z>10&&z<145)m.fillText(label,x,z)}}m.fillStyle='#4ade80';for(const s of SP){m.fillRect(cl(75+(s.x-pl.x)*sc,5,145)-3,cl(75+(s.z-pl.z)*sc,5,145)-3,6,6)}if(job){const t=job.st==1?[job.px,job.pz]:[job.dx,job.dz];m.fillStyle=job.st==1?'#ffd400':'#a3ff4a';m.beginPath();m.arc(cl(75+(t[0]-pl.x)*sc,6,144),cl(75+(t[1]-pl.z)*sc,6,144),5,0,7);m.fill()}m.fillStyle='#ffd400';for(const b of banks){m.fillRect(cl(75+(b.x-pl.x)*sc,5,145)-3,cl(75+(b.z-pl.z)*sc,5,145)-3,6,6)}for(const r of remotes.values()){m.fillStyle=r.role==='cop'?'#4aa3ff':r.heat>=1?'#ff3b3b':'#ffffff';m.beginPath();m.arc(cl(75+(r.x-pl.x)*sc,4,146),cl(75+(r.z-pl.z)*sc,4,146),3.5,0,7);m.fill()}m.fillStyle='#38bdf8';for(const s of GAR){m.fillRect(cl(75+(s.x-pl.x)*sc,5,145)-3,cl(75+(s.z-pl.z)*sc,5,145)-3,6,6)}m.save();m.translate(75,75);m.rotate(-pl.yaw);m.fillStyle='#ffb020';m.beginPath();m.moveTo(0,-7);m.lineTo(5,6);m.lineTo(-5,6);m.fill();m.restore()}
roleCam(dt);renderMirrors();renderer.render(scene,cam)}
{const mc=el('mm').getContext('2d'),lw=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'lineWidth');Object.defineProperty(mc,'lineWidth',{set(v){lw.set.call(mc,v*LWS)},get(){return lw.get.call(mc)},configurable:true})}
// ===== world edge, river bridges, more highways, suburban houses =====
const FIX=[],fx=(...a)=>{const m=mk(...a);FIX.push(m);return m};
const ySurf=(x,z)=>bridgeDeck(x,z)??elevation(x,z);

{const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.fillStyle='#ff5a1f';x.fillRect(0,0,256,64);x.fillStyle='#14161a';for(let i=-64;i<300;i+=34){x.beginPath();x.moveTo(i,64);x.lineTo(i+17,64);x.lineTo(i+51,0);x.lineTo(i+34,0);x.fill()}
x.fillStyle='#fff';x.strokeStyle='#000';x.lineWidth=5;x.font='bold 27px system-ui';x.textAlign='center';x.strokeText('END OF THE WORLD',128,41);x.fillText('END OF THE WORLD',128,41);
for(const[ax,s]of[[0,-1],[0,1],[1,-1],[1,1]]){const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(7,1);const w=new THREE.Mesh(new THREE.PlaneGeometry(EDGE*2+60,115),new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:.6,side:THREE.DoubleSide,fog:false,depthWrite:false}));
if(ax){w.rotation.y=Math.PI/2;w.position.set(s*(EDGE+14),42,0)}else w.position.set(0,42,s*(EDGE+14));scene.add(w);FIX.push(w)}}
function hwy(L,N,tag){for(const s of[-1,1])for(let q=-N;q<N;q++){const c=q*P+P/2;mk(.7,1,64,0x9a9a9a,s*L,.5,c,scene);WALLS.push({x0:s*L-.3,x1:s*L+.3,z0:c-32,z1:c+32});mk(64,1,.7,0x9a9a9a,c,.5,s*L,scene);WALLS.push({x0:c-32,x1:c+32,z0:s*L-.3,z1:s*L+.3});
if(q%2==0){for(const o of[-9.5,9.5]){mk(.5,6.6,.5,0x777777,s*L+o,3.3,c,scene);mk(.5,6.6,.5,0x777777,c,3.3,s*L+o,scene)}mk(19.5,.5,.5,0x777777,s*L,6.6,c,scene);mk(8,2.2,.3,0x0a6b3a,s*L,5.2,c,scene);mk(.5,.5,19.5,0x777777,c,6.6,s*L,scene);mk(.3,2.2,8,0x0a6b3a,c,5.2,s*L,scene)}}
for(const side of [-1,1])for(let n=-N;n<N;n++){const c=n*P+40;for(const axis of [0,1]){mk(axis?80:30,.035,axis?30:80,0x30363c,axis?c:side*L,.025,axis?side*L:c,scene);for(const lane of [-8,8])for(const off of [-24,0,24])mk(axis?9:.15,.025,axis?.15:9,0xe6e1ca,axis?c+off:side*L+lane,.06,axis?side*L+lane:c+off,scene)}if(n%4===0)sign(tag,c,8,side*L,0x19613f)}}
hwy(400,5,'M3 · 100   INNER RING');hwy(1680,21,'M2 · 100   OUTER RING');
{const pal=[0xe8dcc4,0xd9c7a6,0xb5543c,0x9c4a36,0xf2efe6,0xc9d3d9,0xb9c9a8,0xd7b99a],rfc=[0x6b3a2e,0x4a4f55,0x7a2f2a,0x3e4a40],n=Math.max(1,HOUSES.length*2);
const geo=new THREE.BufferGeometry(),V=[[-.5,0,-.5],[.5,0,-.5],[.5,0,.5],[-.5,0,.5],[-.5,1,0],[.5,1,0]],T=[[3,2,5],[3,5,4],[1,0,4],[1,4,5],[0,3,4],[2,1,5]],pos=[];T.forEach(t=>t.forEach(i=>pos.push(...V[i])));geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.computeVertexNormals();
const mt=c=>new THREE.MeshLambertMaterial({color:c}),W=new THREE.InstancedMesh(bg,mt(0xffffff),n),Rf=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({side:THREE.DoubleSide}),n),G=new THREE.InstancedMesh(bg,mt(0xcfd3d6),n),D=new THREE.InstancedMesh(bg,mt(0x4a2c1e),n),Wn=new THREE.InstancedMesh(bg,mt(0x6f98b5),n*2),Ch=new THREE.InstancedMesh(bg,mt(0x8a4a3a),n);
const d=new THREE.Object3D(),col=new THREE.Color();let k=0,kw=0;
const put=(M,i,x,z,yaw,lx,ly,lz,sx,sy,sz)=>{const c=Math.cos(yaw),s=Math.sin(yaw);d.position.set(x+lx*c+lz*s,ly,z-lx*s+lz*c);d.rotation.y=yaw;d.scale.set(sx,sy,sz);d.updateMatrix();M.setMatrixAt(i,d.matrix)};
for(const[qx,qz,az]of HOUSES)for(const ox of[-6.5,6.5]){if(R()<.08)continue;const yaw=az>0?0:Math.PI,hx=qx+ox,hz=qz+az*6.5;
put(W,k,hx,hz,yaw,0,1.6,0,9,3.2,8);W.setColorAt(k,col.setHex(pal[Math.floor(R()*pal.length)]));put(Rf,k,hx,hz,yaw,0,3.2,0,10.4,2.6,9.6);Rf.setColorAt(k,col.setHex(rfc[Math.floor(R()*rfc.length)]));
put(G,k,hx,hz,yaw,-2.6,1.1,4.05,3,2.2,.15);put(D,k,hx,hz,yaw,1.4,1.05,4.05,1,2.1,.15);put(Ch,k,hx,hz,yaw,2.8,5.2,-1.2,.9,2.2,.9);
put(Wn,kw,hx,hz,yaw,-.1,1.8,4.05,1.3,1.1,.12);put(Wn,kw+1,hx,hz,yaw,3.2,1.8,4.05,1.3,1.1,.12);k++;kw+=2}
for(const o of[W,Rf,G,D,Ch]){o.count=k;o.castShadow=o===W||o===Rf;o.receiveShadow=true;scene.add(o)}Wn.count=kw;scene.add(Wn)}

// ===== highway ramps (side barriers + merge gaps), police guns and spike spikes =====
const hwNode=(i,j)=>HWI.some(h=>Math.abs(i)==h&&Math.abs(j)<=h||Math.abs(j)==h&&Math.abs(i)<=h),
isRamp=(i,j)=>HWI.some(h=>{if(Math.abs(i)==h&&Math.abs(j)<=h)return j%3===0||Math.abs(j)==h;if(Math.abs(j)==h&&Math.abs(i)<=h)return i%3===0||Math.abs(i)==h;return false}),
hwEdge=(i,j,i2,j2)=>HWI.some(h=>i==i2&&Math.abs(i)==h&&Math.abs(j)<=h&&Math.abs(j2)<=h||j==j2&&Math.abs(j)==h&&Math.abs(i)<=h&&Math.abs(i2)<=h),
hwOk=(i,j,i2,j2)=>hwEdge(i,j,i2,j2)||(!hwNode(i,j)&&!hwNode(i2,j2));
for(const h of HWI){const L=h*P,cuts=[];for(let q=-h+1;q<h;q++)if(q%5===0)cuts.push([q*P-120,q*P-24],[q*P+24,q*P+120]);cuts.sort((a,b)=>a[0]-b[0]);
for(const s of[-1,1])for(const ax of[0,1])for(const o of[-14.6,14.6]){const inside=Math.sign(o)!==s,A=-h*P+(inside?15:-15),B=h*P+(inside?-15:15),c0=s*L+o,segs=[];let cur=A;for(const[c1,c2]of cuts){if(c1>cur)segs.push([cur,c1]);cur=Math.max(cur,c2)}if(B>cur)segs.push([cur,B]);
for(const[sa,sb]of segs)for(let u=sa;u<sb-1;u+=80){const e=Math.min(sb,u+80),mid=(u+e)/2,len=e-u;mk(ax?len:.7,1.1,ax?.7:len,0xc3c6c9,ax?mid:c0,.55,ax?c0:mid,scene);WALLS.push(ax?{x0:u,x1:e,z0:c0-.35,z1:c0+.35}:{x0:c0-.35,x1:c0+.35,z0:u,z1:e})}}}
const lanes=[];for(const h of HWI)for(let q=-h+1;q<h;q++)if(q%5===0)for(const s of[-1,1])for(const ax of[0,1])for(const sd of[-1,1])for(let u=-120;u<120;u+=20)lanes.push([ax,q*P+u+10,s*h*P+sd*19.5]);
{const LN=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({color:0x30363c}),Math.max(1,lanes.length)),m4=new THREE.Matrix4();lanes.forEach(([ax,t,lat],i)=>{m4.makeScale(ax?20.2:8,.04,ax?8:20.2).setPosition(ax?t:lat,.03,ax?lat:t);LN.setMatrixAt(i,m4)});LN.count=lanes.length;LN.receiveShadow=true;scene.add(LN)}
const spikes=[],trc=mk(.09,.09,1,0xffe066,0,0,0,scene,1);trc.visible=false;trc.frustumCulled=false;FIX.push(trc);let trcT=0,spT=20;
function clearSpikes(){for(const s of spikes)scene.remove(s.m);spikes.length=0;spT=20}
function gunshot(){if(!ac)return;const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(50,t+.12);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.14);o.connect(g).connect(ac.destination);o.start();o.stop(t+.15)}
function spikeStrip(){const fx=-Math.sin(pl.yaw),fz=-Math.cos(pl.yaw),alongZ=Math.abs(fz)>=Math.abs(fx);let x,z;if(alongZ){x=Math.round(pl.x/P)*P;z=pl.z+fz*230}else{z=Math.round(pl.z/P)*P;x=pl.x+fx*230}
x=cl(x,-EDGE+20,EDGE-20);z=cl(z,-EDGE+20,EDGE-20);if(inRiver(x,z,45))return;
const w=onHw(x,z)?24:11,m=new THREE.Group();mk(w,.07,1.1,0x1a1a1a,0,.04,0,m);for(let i=-w/2+.5;i<=w/2;i+=1)mk(.12,.22,.9,0xd5d9dd,i,.14,0,m);m.position.set(x,elevation(x,z)+.02,z);if(!alongZ)m.rotation.y=Math.PI/2;scene.add(m);spikes.push({m,x,z,alongZ,w,life:45});msg('\ud83d\udcfb Police have laid a spike strip ahead!','#6cf')}
function copTick(dt){const stars=Math.min(5,Math.floor(heat)),sv=Math.abs(pl.v);trcT-=dt;if(trcT<=0)trc.visible=false;
if(stars>=2){if((spT-=dt)<=0){spT=26;spikeStrip()}
for(const o of ag){if(o.wrecked||o.k==='tr'||o.k==='blk'||o.d>(o.k==='heli'?75:40))continue;o.gun=(o.gun??R()*2)-dt;if(o.gun>0)continue;o.gun=2.4+R()*2.2;gunshot();
let ph=.3+stars*.04;if(sv>30)ph*=.6;if((pl.driftT||0)>0)ph*=.5;if(o.k==='heli')ph*=.8;const sy=pl.surfaceY||0,y0=o.k==='heli'?45:1.3;
trc.position.set((o.x+pl.x)/2,sy+(y0+1)/2,(o.z+pl.z)/2);trc.lookAt(pl.x,sy+1,pl.z);trc.scale.set(1,1,Math.hypot(pl.x-o.x,pl.z-o.z,y0-1));trc.visible=true;trcT=.12;
if(R()<ph){pl.flat=Math.min(4,(pl.flat||0)+1);pl.flatSide=R()<.5?1:-1;shake=.9;msg('\ud83d\udca5 Tyre shot out! ('+pl.flat+'/4 flat)','#ff6b6b')}else msg('Shots fired!','#ffb020')}}
for(let i=spikes.length-1;i>=0;i--){const s=spikes[i];s.life-=dt;const dx=pl.x-s.x,dz=pl.z-s.z,across=s.alongZ?dx:dz,along=s.alongZ?dz:dx;
if(s.life>0&&Math.abs(along)<1.1+sv*dt&&Math.abs(across)<s.w/2&&Math.abs((pl.surfaceY??0)-elevation(s.x,s.z))<2.5){pl.flat=Math.min(4,(pl.flat||0)+3);pl.flatSide=R()<.5?1:-1;shake=1;msg('\ud83d\udca5 Spike strip! Tyres shredded ('+pl.flat+'/4 flat)','#ff6b6b');s.life=0}
if(s.life<=0||Math.hypot(dx,dz)>800){scene.remove(s.m);spikes.splice(i,1)}}
const fl=pl.flat||0;el('tyre').textContent=fl?'\ud83d\udee0 Tyres flat: '+fl+'/4 \u2014 repair at a petrol station or safe house':'';
const atG=ug.on||GAR.some(g=>Math.abs(pl.x-g.x)<5.5&&pl.z>g.z-5&&pl.z<g.z+7);if(fl&&sv<1.5&&(inPump||atG)){const cost=inPump&&!atG?fl*40:0;if(bal>=cost){bal-=cost;pl.flat=0;msg('Tyres replaced'+(cost?' -$'+cost:''),'#4ade80')}else msg('Not enough money for tyres','#ff6b6b')}}

// ===== roles (driver / biker / police officer / pedestrian), bank robberies, online play =====
const ICON={car:'\ud83d\ude97',bike:'\ud83c\udfcd',cop:'\ud83d\ude93',ped:'\ud83d\udeb6'},BIKEP={n:'Bike',T:200,m:420,col:0x222222,gr:[2.4,1.7,1.3,1.05,.9,.78]},COPP={n:'Patrol',T:380,m:1500,col:0xf4f4f4,gr:[3.3,2.2,1.6,1.25,1,.82]};
const roleCar=()=>role==='bike'?BIKEP:role==='cop'?COPP:CARS[carIdx];
function pedMesh(col){const g=new THREE.Group();mk(.5,.8,.3,0x2b3a55,0,.4,0,g);mk(.6,.7,.35,col,0,1.15,0,g);mk(.32,.32,.32,0xe0b48a,0,1.7,0,g);return g}
function motoMesh(col){const g=new THREE.Group();mk(.4,.5,1.9,0x222222,0,.55,0,g);mk(.25,.7,.7,0x111111,0,.35,-.75,g);mk(.25,.7,.7,0x111111,0,.35,.75,g);mk(.5,.9,.5,col,0,1.15,0,g);mk(.3,.3,.3,0xffffff,0,1.7,0,g);return g}
function avatar(r,col){return r==='ped'?pedMesh(col):r==='bike'?motoMesh(0xd23b2e):r==='cop'?carMesh(0xf4f4f4,1):carMesh(col)}
function endRun(title,text){if(state!=='play')return;state='busted';pl.v=0;if(ac){eg.gain.value=0;sg.gain.value=0}el('ov').style.display='flex';el('ov').innerHTML='<div><h1>'+title+'</h1><p>'+text+'</p><button class="go" onclick="reset()">Play again (R)</button></div>'}
function footTick(dt){el('hint').textContent='';const run=keys.ShiftLeft||keys.ShiftRight,fw=((keys.KeyW||keys.ArrowUp)?1:0)-((keys.KeyS||keys.ArrowDown)?1:0),st=((keys.KeyA||keys.ArrowLeft)?1:0)-((keys.KeyD||keys.ArrowRight)?1:0);
pl.yaw+=st*2.3*dt;pl.v=fw*(run?6.5:2.8)*(fw<0?.5:1);pl.slip=0;on=true;gear=0;rpm=900;pl.x+=-Math.sin(pl.yaw)*pl.v*dt;pl.z+=-Math.cos(pl.yaw)*pl.v*dt;pl.x=cl(pl.x,-EDGE,EDGE);pl.z=cl(pl.z,-EDGE,EDGE);push(pl);pl.surfaceY=surfaceAt(pl);
if(pl.surfaceY<-1.8&&!ug.on&&inRiver(pl.x,pl.z))endRun('SWEPT AWAY','You fell in the river.');
for(const o of ag){if(o.k==='heli'||o.wrecked||o.k==='blk'||Math.hypot(o.x-pl.x,o.z-pl.z)>2.4||Math.abs((o.surfaceY??0)-(pl.surfaceY||0))>3)continue;if(o.k!=='tr'&&heat>=1){endRun('BUSTED \ud83d\ude93','The police caught you on foot.');break}if(o.k==='tr'&&o.v>3.5){endRun('RUN OVER','A vehicle hit you.');break}}
let nc=0;for(const o of ag)if(o.k!=='tr'&&o.k!=='heli'&&o.k!=='blk'&&!o.wrecked&&o.d<7)nc++;if(nc&&heat>=1&&Math.abs(pl.v)<1.2)bustT+=dt;else bustT=Math.max(0,bustT-dt);
garageTick(dt);pedestrianTick(dt);return{kmh:Math.abs(pl.v)*3.6,lim:limitAt(pl.x,pl.z),th:0}}
// banks
const banks=[],robT0=7;let robT=0,hintBank='';
function labelMesh(txt,w,h,bg,fg){const c=document.createElement('canvas');c.width=256;c.height=Math.round(256*h/w);const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);x.fillStyle=fg;x.font='bold '+c.height*.62+'px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,c.width/2,c.height/2+2);return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),fog:false}))}
[...PK].filter(k=>{const[i,j]=k.split(',').map(Number);return !reserved((i+.5)*P,(j+.5)*P)}).sort((a,b)=>Math.hypot(...a.split(',').map(Number))-Math.hypot(...b.split(',').map(Number))).slice(0,7).forEach(k=>{const[i,j]=k.split(',').map(Number),x=(i+.5)*P,z=(j+.5)*P;banks.push({x,z,cool:0,k:banks.length});
mk(22,6,12,0xd7d2c4,x,3,z,scene);mk(23.5,.8,13.5,0x6e747b,x,6.4,z,scene);for(const cx of[-8,-3,3,8])mk(1,5.2,1,0xf2efe6,x+cx,2.6,z-6.6,scene);mk(3,3.4,.3,0x3a3f45,x,1.7,z-6.2,scene);
const sg2=labelMesh('BANK',9,2,'#c9a227','#1b1b1b');sg2.rotation.y=Math.PI;sg2.position.set(x,8,z-6.9);scene.add(sg2);{const bm2=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,60,10,1,true),new THREE.MeshBasicMaterial({color:0xffd400,transparent:true,opacity:.35,fog:false,depthWrite:false}));bm2.position.set(x,30,z);scene.add(bm2)}mk(.4,12,.4,0xc9a227,x+12,6,z-11,scene);PKC.get(k).push({x0:x-11,x1:x+11,z0:z-6,z1:z+6})});
function bankTick(dt){let near=null;for(const b of banks){b.cool=Math.max(0,b.cool-dt);if(Math.abs(pl.x-b.x)<9&&pl.z>b.z-13&&pl.z<b.z-7)near=b}
if(!near){robT=0;return}const h=el('hint');if(role==='cop'){h.textContent='Bank \u2014 keep an eye out for robbers';return}
if(near.cool>0){h.textContent='Bank closed (alarm) for '+Math.ceil(near.cool)+'s';robT=0;return}
if(Math.abs(pl.v)>(role==='ped'?1:2)){h.textContent='Stop at the bank doors, then hold B to rob it';robT=0;return}
if(keys.KeyB){if(robT===0){heat=Math.max(heat,1);msg('\ud83d\udea8 Alarm triggered! Hold on...','#ff6b6b')}robT+=dt;h.textContent='Robbing\u2026 '+Math.round(robT/robT0*100)+'%';
if(robT>=robT0){const loot=Math.round((500+R()*1000)*(role==='ped'?.7:1));bal+=loot;heat=Math.max(heat,2.2);near.cool=150;robT=0;msg('\ud83d\udcb0 Bank robbed! +$'+loot+' \u2014 now escape!','#ffd400');netSend({t:'rob',k:near.k,cool:150})}}else{robT=0;h.textContent='Hold B to rob the bank'}}
// police officer role: chase and arrest
let susA=null,susT=15,arrT=0,arrH={};const susB=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.5,70,12,1,true),new THREE.MeshBasicMaterial({color:0xff3b3b,transparent:true,opacity:.4,side:THREE.DoubleSide,depthWrite:false,fog:false}));susB.visible=false;scene.add(susB);
function getArrested(by){endRun('ARRESTED \ud83d\ude93','Officer '+by+' arrested you. You lose $200.');bal=Math.max(0,bal-200);heat=0}
// online play (PeerJS, works when the page is hosted on your own site)
let peer=null,conns=[],isHost=false,myId='me',netT=0;const remotes=new Map(),myName='Player'+Math.floor(100+R()*900);
const netMsg=t=>{el('netStatus').textContent=t},netSend=o=>{for(const c of conns)if(c.open)c.send(o)},relay=(d,c)=>{if(isHost)for(const x of conns)if(x!==c&&x.open)x.send(d)};
function netOk(){if(typeof Peer==='undefined'){netMsg('Online play is not available here (PeerJS could not load). Host the game on your own site.');return false}return true}
function onNet(d,c){if(!d||!d.t)return;if(d.t==='s'){remotes.set(d.id,Object.assign(remotes.get(d.id)||{},d,{seen:time}));relay(d,c)}
else if(d.t==='rob'){if(banks[d.k])banks[d.k].cool=d.cool;relay(d,c)}else if(d.t==='arrest'){if(d.to===myId)getArrested(d.name);else relay(d,c)}}
function hostGame(){if(!netOk())return;const code=Math.random().toString(36).slice(2,6).toUpperCase();peer=new Peer('bclutch-'+code);
peer.on('open',id=>{isHost=true;myId=id;netMsg('Room code: '+code+' \u2014 friends type it and press Join, then everyone presses Start driving.')});
peer.on('connection',c=>{if(c.open)conns.push(c);else c.on('open',()=>conns.push(c));c.on('data',d=>onNet(d,c));c.on('close',()=>{conns=conns.filter(x=>x!==c)})});peer.on('error',e=>netMsg('Network error: '+e.type+(e.type==='unavailable-id'?' (press Host again)':'')))}
function joinGame(code){if(!netOk())return;if(!code){netMsg('Type the room code first');return}peer=new Peer();peer.on('open',id=>{myId=id;const c=peer.connect('bclutch-'+code.toUpperCase());
c.on('open',()=>{conns=[c];netMsg('Connected to room '+code.toUpperCase()+'. Press Start driving.')});c.on('data',d=>onNet(d,c));c.on('close',()=>{conns=[];netMsg('Disconnected from the host')})});peer.on('error',e=>netMsg('Could not join: '+e.type))}
function netTick(dt){netT-=dt;if(netT<=0&&conns.length){netT=.1;netSend({t:'s',id:myId,name:myName,role,ci:carIdx,x:pl.x,z:pl.z,y:pl.surfaceY||0,yaw:pl.yaw,heat,bal:Math.round(bal)})}
let txt='';for(const[id,r]of remotes){if(time-r.seen>3){if(r.mesh)scene.remove(r.mesh);remotes.delete(id);continue}txt+=(ICON[r.role]||'')+' '+r.name+' $'+r.bal+(r.heat>=1?' \u2605'+Math.floor(r.heat):'')+'\n'}el('players').textContent=txt}
function roleCam(dt){if(state==='play'){bankTick(dt);if(role==='cop')copRoleTick(dt);if(role!=='cop'||true)netTick(dt)}
for(const r of remotes.values()){if(!r.mesh){r.mesh=avatar(r.role,CARS[r.ci||0].col);scene.add(r.mesh);r.sx=r.x;r.sz=r.z;r.sy=r.y;r.sa=r.yaw}const k=Math.min(1,dt*10);r.sx+=(r.x-r.sx)*k;r.sz+=(r.z-r.sz)*k;r.sy+=(r.y-r.sy)*k;r.sa+=wrap(r.yaw-r.sa)*k;r.mesh.position.set(r.sx,r.sy,r.sz);r.mesh.rotation.y=r.sa;
if(r.mesh.l1){const f=Math.floor(time*8)%2==0;r.mesh.l1.visible=f;r.mesh.l2.visible=!f}}
if(role==='ped'&&!chase&&state==='play'){cam.position.set(pl.x,(pl.surfaceY||0)+1.7,pl.z);cam.rotation.set(-.03,pl.yaw,0)}}
let role2=0;
(()=>{el('roles').innerHTML=[['car','\ud83d\ude97 Driver'],['bike','\ud83c\udfcd Biker'],['cop','\ud83d\ude93 Police officer'],['ped','\ud83d\udeb6 Pedestrian']].map(([r,t],i)=>'<button data-r="'+r+'" class="'+(i?'':'on')+'">'+t+'</button>').join('');
el('roles').onclick=e=>{const r=e.target.dataset&&e.target.dataset.r;if(r){role=r;[...el('roles').children].forEach(b=>b.className=b.dataset.r===role?'on':'')}};el('hostBtn').onclick=hostGame;el('joinBtn').onclick=()=>joinGame(el('joinCode').value.trim())})();

// ===== more bridges + flyovers, underground safe house, police dispatch calls =====
for(let i=-7;i<=7;i++)for(let j=-8;j<=8;j++){if(((i*5+j*7)%3+3)%3!==0)continue;if([-2,-1,0,1,2].some(d=>RB.has((i+d)+','+j)))continue;const x=i*P,z=j*P;if(RIV.some(r=>r.a==='x'?(Math.abs(x-r.c)<235&&z>r.w0-160&&z<r.w1+160):(Math.abs(z-r.c)<70&&x>r.w0-230&&x<r.w1+230))||HWL.some(L=>Math.abs(Math.abs(x)-L)<215&&Math.abs(z)<=L+15)||FLY.some(f=>Math.abs(f.x-x)<420&&Math.abs(f.z-z)<260))continue;FLY.push({x,z,len:190})}
function flyH(s){return 8*smt(cl((190-s)/110,0,1))}
function deckNear(x,z,prev){const bd=bridgeDeck(x,z);if(bd!==null&&Math.abs(prev-bd)<3)return bd;for(const f of FLY)if(Math.abs(x-f.x)<f.len&&Math.abs(z-f.z)<8){const g=elevation(x,z),h=g+flyH(Math.abs(x-f.x));if(h-g>.15&&Math.abs(prev-h)<2.5)return h}return null}
const BR={deck:[],road:[],rail:[],pier:[]};
for(const r of RIV){const L=r.w1-r.w0+140,mid=(r.w0+r.w1)/2,Z=r.a==='z',wm=new THREE.Mesh(new THREE.PlaneGeometry(Z?L:64,Z?64:L),new THREE.MeshLambertMaterial({color:0x2f78b5,transparent:true,opacity:.72}));wm.rotation.x=-Math.PI/2;wm.position.set(Z?mid:r.c,-2.6,Z?r.c:mid);scene.add(wm);FIX.push(wm);
for(let bi=Math.ceil((r.w0-80)/P);bi<=Math.floor((r.w1+80)/P);bi++){const wc=bi*P;if(Math.max(r.w0-wc,wc-r.w1,0)>80)continue;const rx=Z?wc:r.c,rz=Z?r.c:wc,bw=onHw(rx,rz)?30:16;
const B=(part,w,h,d,ox,y,oz)=>BR[part].push([rx+(Z?ox:oz),y,rz+(Z?oz:ox),Z?w:d,h,Z?d:w]);
B('deck',bw,.5,76,0,-.14,0);B('road',bw-.8,.05,76,0,.13,0);for(const s of[-1,1]){B('rail',.4,1.1,76,s*(bw/2-.2),.75,0);for(const dz of[-20,20])B('pier',1.6,9,1.6,s*(bw/2-3),-4.5,dz)}}}
{const cols={deck:0x8c9096,road:0x2b2d31,rail:0x9da9b0,pier:0x7b8087},d=new THREE.Object3D();for(const k in BR){const arr=BR[k],M=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({color:cols[k]}),Math.max(1,arr.length));arr.forEach((a,i)=>{d.position.set(a[0],a[1],a[2]);d.scale.set(a[3],a[4],a[5]);d.updateMatrix();M.setMatrixAt(i,d.matrix)});M.count=arr.length;M.castShadow=M.receiveShadow=true;scene.add(M);FIX.push(M)}}
{const n=Math.max(1,FLY.length*38),dk=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({color:0x4a4e54}),n),pp=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({color:0xb8bcc0}),n*2),pr=new THREE.InstancedMesh(bg,new THREE.MeshLambertMaterial({color:0x8d9298}),Math.max(1,FLY.length*14)),d=new THREE.Object3D();let k=0,kp=0,kr=0;
for(const f of FLY){for(let s=-190;s<190;s+=10){const xa=f.x+s,xb=xa+10,y0=elevation(xa,f.z)+flyH(Math.abs(s)),y1=elevation(xb,f.z)+flyH(Math.abs(s+10)),hm=(y0+y1)/2,ang=Math.atan((y1-y0)/10),len=Math.hypot(10,y1-y0)+.2,xm=xa+5;
d.rotation.set(0,0,ang);d.scale.set(len,.6,16);d.position.set(xm,hm-.3,f.z);d.updateMatrix();dk.setMatrixAt(k++,d.matrix);
for(const sz of[-1,1]){d.scale.set(len,.9,.35);d.position.set(xm,hm+.45,f.z+sz*7.7);d.updateMatrix();pp.setMatrixAt(kp++,d.matrix)}
if(s%30===0&&hm-elevation(xm,f.z)>2){const g=elevation(xm,f.z);d.rotation.set(0,0,0);d.scale.set(1.6,hm-.6-g,1.6);d.position.set(xm,(hm-.6+g)/2,f.z);d.updateMatrix();pr.setMatrixAt(kr++,d.matrix)}}}
dk.count=k;pp.count=kp;pr.count=kr;for(const o of[dk,pp,pr]){o.castShadow=o.receiveShadow=true;scene.add(o);FIX.push(o)}}
// underground safe-house car park
const UGB=[],ugCpt=()=>ug.on?{x:ug.g.x,z:ug.g.z-2,yaw:0}:{x:pl.x,z:pl.z,yaw:pl.yaw};
fx(60,.3,44,0x3a3d42,UGX,UG_Y-.15,UGZ,scene);fx(62,.6,46,0x4a4d52,UGX,UG_Y+5.6,UGZ,scene);
for(const[sx,sz,w,d]of[[-30.5,0,1,46],[30.5,0,1,46],[0,-22.5,62,1],[0,22.5,62,1]])fx(w,6,d,0x5b6068,UGX+sx,UG_Y+2.7,UGZ+sz,scene);
for(const px of[-6,6,18])for(const pz of[-6,6]){fx(1.2,5.4,1.2,0x7b8087,UGX+px,UG_Y+2.7,UGZ+pz,scene);UGB.push({x0:UGX+px-.6,x1:UGX+px+.6,z0:UGZ+pz-.6,z1:UGZ+pz+.6})}
for(let i=0;i<7;i++)for(const sz of[-1,1]){const x=UGX-8+i*5.2,z=UGZ+sz*17;fx(.12,.02,5.5,0xffffff,x-2.6,UG_Y+.02,z,scene,1);if(R()<.7){const c=carMesh(new THREE.Color().setHSL(R(),.5,.4));c.position.set(x,UG_Y,z);c.rotation.y=sz>0?Math.PI:0;scene.add(c);FIX.push(c);UGB.push({x0:x-1,x1:x+1,z0:z-2.2,z1:z+2.2})}}
for(const x of[-20,-8,4,16,26])for(const z of[-10,10])fx(5,.1,.6,0xfff6d0,UGX+x,UG_Y+5.2,UGZ+z,scene,1);
{const pt=new THREE.PointLight(0xfff0d0,.9,70);pt.position.set(UGX,UG_Y+4,UGZ);scene.add(pt);FIX.push(pt);
const e1=labelMesh('EXIT \u25b2',6,1.6,'#0a6b3a','#ffffff');e1.rotation.y=Math.PI/2;e1.position.set(UGX-29.9,UG_Y+3.4,UGZ);scene.add(e1);FIX.push(e1);
const e2=labelMesh('SAFE HOUSE \u00b7 STOP TO HIDE',9,1.6,'#0b5c8a','#ffffff');e2.rotation.y=-Math.PI/2;e2.position.set(UGX+29.9,UG_Y+3.4,UGZ);scene.add(e2);FIX.push(e2)}
function fadeFlash(){const f=el('fade');f.style.transition='none';f.style.opacity=1;requestAnimationFrame(()=>{f.style.transition='opacity .6s';f.style.opacity=0})}
function enterUG(g){ug.on=true;pl.ug=true;ug.g=g;ug.t=0;pl.x=UGX-20;pl.z=UGZ;pl.yaw=-Math.PI/2;pl.v=Math.sign(pl.v||1)*Math.min(Math.abs(pl.v),7);pl.slip=0;pl.surfaceY=UG_Y;fadeFlash();msg('\u2b07 Underground car park \u2014 the police can\u2019t follow you here','#6cf')}
function exitUG(){ug.on=false;pl.ug=false;ug.cool=3;pl.x=ug.g.x;pl.z=ug.g.z-2;pl.yaw=0;pl.v=Math.min(Math.abs(pl.v)+3,8);pl.slip=0;fadeFlash();msg('\u2b06 Back on the surface')}
function ugPush(o){let hit=0;const hx=29.2,hz=21.2;if(o.x<UGX-hx){o.x=UGX-hx;hit=1}if(o.x>UGX+hx){o.x=UGX+hx;hit=1}if(o.z<UGZ-hz){o.z=UGZ-hz;hit=1}if(o.z>UGZ+hz){o.z=UGZ+hz;hit=1}for(const w of UGB)if(bump(o,w))hit=1;return hit}
// highway spawn helper
const HWN=[];for(let i=-MAP;i<=MAP;i++)for(let j=-MAP;j<=MAP;j++)if(hwNode(i,j))HWN.push([i,j]);
function hwSpawnNode(){const c=HWN.filter(n=>{const d=Math.abs(n[0]-pi)+Math.abs(n[1]-pj);return d>=3&&d<=9});return c.length?c[Math.floor(R()*c.length)]:null}
// police dispatch calls
const cd={st:0,t:12,kind:'',text:'',where:'',tx:0,tz:0,ring:0};
function ringTone(){if(!ac)return;const t=ac.currentTime;for(const[f,o]of[[880,0],[1040,.18]]){const os=ac.createOscillator(),g=ac.createGain();os.frequency.value=f;g.gain.setValueAtTime(.08,t+o);g.gain.exponentialRampToValueAtTime(.001,t+o+.15);os.connect(g).connect(ac.destination);os.start(t+o);os.stop(t+o+.16)}}
function showCall(){el('copCalls').innerHTML='<strong>\ud83d\udcde Incoming call \u2014 Dispatch</strong><p>'+cd.text+'</p><button id="callYes">Accept (Y)</button> <button id="callNo">Decline (N)</button>';el('callYes').onclick=acceptCall;el('callNo').onclick=declineCall;el('dispatchStatus').textContent='Dispatch is calling you.'}
function startSuspect(){const n=ag.length;spawn('tr');if(ag.length>n){susA=ag[ag.length-1];susA.sus=true;cd.st=3;arrT=0;susB.material.color.setHex(0xff3b3b);msg('\ud83d\udcfb Suspect fleeing \u2014 follow the red beacon, stay within 9 m for 4 s','#6cf')}else{cd.st=0;cd.t=10}}
function acceptCall(){if(cd.st!==1)return;cd.st=2;setPhone(false);el('copCalls').innerHTML='';el('dispatchStatus').textContent='On a call.';if(cd.kind==='pursuit')startSuspect();else msg('\ud83d\udcfb Responding \u2014 drive to the gold beacon','#6cf')}
function declineCall(){if(cd.st!==1)return;cd.st=0;cd.t=15;setPhone(false);el('copCalls').innerHTML='';msg('Call declined')}
addEventListener('keydown',e=>{if(e.repeat||state!=='play'||role!=='cop'||cd.st!==1)return;if(e.code==='KeyY')acceptCall();if(e.code==='KeyN')declineCall()});
function applyRoleUI(){cd.st=0;cd.t=12;susA=null;susB.visible=false;el('jobChoices').hidden=role==='cop';el('copCalls').hidden=role!=='cop';el('copCalls').innerHTML='';el('dispatch').querySelector('strong').textContent=role==='cop'?'POLICE DISPATCH':'CITY DISPATCH';el('dispatchStatus').textContent=role==='cop'?'Radio quiet. Dispatch will call you.':'Choose a job to start earning.'}
function copRoleTick(dt){const jb=el('job');if(pmesh.l1){const f=Math.floor(time*8)%2==0;pmesh.l1.visible=f;pmesh.l2.visible=!f}
if(cd.st===0){cd.t-=dt;jb.textContent='\ud83d\ude93 On patrol \u2014 radio quiet';if(cd.t<=0){if(banks.length&&R()<.5){const b=banks[Math.floor(R()*banks.length)];cd.kind='robbery';cd.tx=b.x;cd.tz=b.z-10;cd.where=sname(b.x,b.z-10);cd.text='Silent alarm \u2014 robbery in progress at the bank on '+cd.where+', '+Math.round(Math.hypot(b.x-pl.x,b.z-pl.z))+' m from you. Respond?'}else{cd.kind='pursuit';cd.text='A vehicle failed to stop near '+sname(pl.x,pl.z)+' and is fleeing. Respond?'}cd.st=1;cd.ring=0;cd.t=18;setPhone(true);showCall()}}
else if(cd.st===1){cd.t-=dt;cd.ring-=dt;if(cd.ring<=0){cd.ring=1.3;ringTone()}jb.textContent='\ud83d\udcde Dispatch calling \u2014 Y accept / N decline';if(cd.t<=0){cd.st=0;cd.t=15;setPhone(false);el('copCalls').innerHTML='';msg('Missed call from Dispatch','#ffb020')}}
else if(cd.st===2){const d=Math.hypot(cd.tx-pl.x,cd.tz-pl.z);susB.visible=true;susB.material.color.setHex(0xffd400);susB.position.set(cd.tx,35+elevation(cd.tx,cd.tz),cd.tz);jb.textContent='\ud83d\ude93 Responding: bank on '+cd.where+' \u00b7 '+Math.round(d)+' m';if(d<22){msg('\ud83d\udcfb On scene \u2014 the robbers are running!','#ff6b6b');startSuspect()}}
else{if(susA&&(susA.dead||!ag.includes(susA))){susA=null}if(!susA){cd.st=0;cd.t=15;susB.visible=false;msg('Suspect lost','#ffb020')}else{const d=Math.hypot(susA.x-pl.x,susA.z-pl.z);susB.visible=true;susB.position.set(susA.x,(susA.surfaceY||0)+35,susA.z);jb.textContent='\ud83d\ude93 Suspect '+Math.round(d)+' m \u00b7 arrest '+Math.round(arrT/4*100)+'%';
if(d<9)arrT+=dt;else arrT=Math.max(0,arrT-dt*.6);if(arrT>=4){const pay=cd.kind==='robbery'?600:400;bal+=pay;msg('\u2705 Suspect arrested +$'+pay,'#4ade80');susA.dead=1;susA=null;susB.visible=false;arrT=0;cd.st=0;cd.t=25+R()*20}}}
for(const r of remotes.values()){if(r.role==='cop'||!(r.heat>=1))continue;const d=Math.hypot(r.x-pl.x,r.z-pl.z),a=arrH[r.id]||0;arrH[r.id]=d<9?a+dt:Math.max(0,a-dt*.6);if(arrH[r.id]>=4){arrH[r.id]=0;bal+=300;msg('\u2705 You arrested '+r.name+' +$300','#4ade80');netSend({t:'arrest',to:r.id,name:myName})}}}

// Lift static scenery to the same terrain used by the driving physics.
const dynamicObjects=new Set([gm,dome,cam,sun,sun.target,bcn,customer,jobStand,pmesh,...walkers.map(w=>w.mesh),...crossers.map(w=>w.mesh),...lamps.flatMap(o=>[o.pole,o.arm,o.hm.g,o.ha.g])]);FIX.forEach(o=>dynamicObjects.add(o));
for(const object of scene.children){if(dynamicObjects.has(object)||object.isLight)continue;if(object.isInstancedMesh){const matrix=new THREE.Matrix4();for(let n=0;n<object.count;n++){object.getMatrixAt(n,matrix);matrix.elements[13]+=elevation(matrix.elements[12],matrix.elements[14]);object.setMatrixAt(n,matrix)}object.instanceMatrix.needsUpdate=true}else {const base=elevation(object.position.x,object.position.z);if(object.isMesh&&object.geometry===bg&&object.scale.y<.2){object.geometry=bg.clone();const pos=object.geometry.attributes.position;for(let n=0;n<pos.count;n++){const x=object.position.x+pos.getX(n)*object.scale.x,z=object.position.z+pos.getZ(n)*object.scale.z;pos.setY(n,pos.getY(n)+(elevation(x,z)-base)/object.scale.y)}object.geometry.computeVertexNormals()}object.position.y+=base}}
// Clear the new road reservations, then lay geometry over the terrain.
for(const object of [...scene.children]){
 if(dynamicObjects.has(object)||object.isLight||object===bm)continue;
 if(object.isInstancedMesh){const matrix=new THREE.Matrix4();let kept=0;for(let n=0;n<object.count;n++){object.getMatrixAt(n,matrix);if(reserved(matrix.elements[12],matrix.elements[14]))continue;object.setMatrixAt(kept,matrix);if(object.instanceColor){const color=new THREE.Color();object.getColorAt(n,color);object.setColorAt(kept,color)}kept++}object.count=kept;object.instanceMatrix.needsUpdate=true;if(object.instanceColor)object.instanceColor.needsUpdate=true}
 else if(reserved(object.position.x,object.position.z)&&(!(object.isMesh&&object.geometry===bg)||object.scale.y>.2))scene.remove(object);
}
for(let i=WALLS.length-1;i>=0;i--){const w=WALLS[i];if(reserved((w.x0+w.x1)/2,(w.z0+w.z1)/2))WALLS.splice(i,1)}
function ribbon(points,width,color,height=0){const vertices=[],indices=[];points.forEach((p,i)=>{const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz)||1;for(const side of[-1,1]){const x=p.x+dz/len*width/2*side,z=p.z-dx/len*width/2*side;vertices.push(x,(p.y??elevation(x,z))+height,z)}if(i){const n=i*2;indices.push(n-2,n-1,n,n-1,n+1,n)}});const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const mesh=new THREE.Mesh(geometry,new THREE.MeshLambertMaterial({color,side:THREE.DoubleSide}));mesh.receiveShadow=true;scene.add(mesh);return mesh}
const scenicPoints=Array.from({length:961},(_,i)=>{const z=-960+i*2,x=scenicX(z);return{x,z,y:roadY(x,z)}});
ribbon(scenicPoints,23,0xb9b4a5,.06);ribbon(scenicPoints,20,0x30363c,.1);
for(let i=0;i<scenicPoints.length-4;i+=8)ribbon(scenicPoints.slice(i,i+4),.16,0xeee7ce,.13);
for(const side of[-1,1]){const edge=scenicPoints.map(p=>{const nx=1/Math.sqrt(1+Math.pow(100/180*Math.cos(p.z/180),2));return{x:p.x+side*9.2*nx,z:p.z-side*9.2*nx*100/180*Math.cos(p.z/180),y:p.y}});ribbon(edge,.18,0xeee7ce,.14);for(const c of[-480,480]){const rail=edge.filter(p=>Math.abs(p.z-c)<38);ribbon(rail,.45,0x9da9b0,1);for(let i=0;i<rail.length;i+=6){const p=rail[i];mk(.3,1,.3,0x78828b,p.x,p.y+.5,p.z,scene)}}}
for(const z of[-480,480]){const x=scenicX(z);for(const dz of[-21,21])for(const dx of[-8,8]){const px=x+dx,pz=z+dz,base=elevation(px,pz);mk(1.2,7,1.2,0x8f9699,px,base+3.5,pz,scene)}sign('EASTERN SCENIC DRIVE · OVERPASS',x,roadY(x,z)+5,z,0x24614c)}
for(const c of BIG_RB){const disk=new THREE.Mesh(new THREE.CircleGeometry(66,96),new THREE.MeshLambertMaterial({color:0x5f6b5a,side:THREE.DoubleSide}));disk.rotation.x=-Math.PI/2;disk.position.set(c.x,elevation(c.x,c.z)+.11,c.z);scene.add(disk);
 for(const axis of[0,1])for(const side of[-1,1]){const points=Array.from({length:18},(_,i)=>({x:c.x+(axis?0:side*(38+i*2)),z:c.z+(axis?side*(38+i*2):0)}));ribbon(points,16,0x30363c,.16)}
 const ring=Array.from({length:193},(_,i)=>({x:c.x+42*Math.sin(i/192*Math.PI*2),z:c.z+42*Math.cos(i/192*Math.PI*2)}));ribbon(ring,26,0xb9b4a5,.18);ribbon(ring,24,0x30363c,.2);for(let i=0;i<ring.length-3;i+=6)ribbon(ring.slice(i,i+3),.18,0xeee7ce,.23);
 const island=new THREE.Mesh(new THREE.CylinderGeometry(29,30,.6,64),new THREE.MeshLambertMaterial({color:0x638247}));island.position.set(c.x,elevation(c.x,c.z)+.45,c.z);scene.add(island);for(const dx of[-58,58])sign('ROUNDABOUT · GIVE WAY · ↻',c.x+dx,elevation(c.x+dx,c.z)+3,c.z+10,0x255a67)
}
sign('EASTERN SCENIC DRIVE',scenicX(-960),elevation(scenicX(-960),-960)+4,-950,0x24614c);
sign('EASTERN SCENIC DRIVE',scenicX(960),elevation(scenicX(960),960)+4,950,0x24614c);
reset();state='menu';el('ov').style.display='flex';pmesh.visible=false;requestAnimationFrame(frame);
