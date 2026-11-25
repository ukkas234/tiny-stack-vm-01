import{readdirSync as R,readFileSync as F,writeFileSync as W,mkdirSync as K}from'node:fs'
let{MAKEFUN_INPUT_DIR:I='/input',MAKEFUN_OUTPUT_DIR:O='/output'}=process.env,S='0Aq46:;?!!!!!!!!999999959995999!999!!!!!!!!!!!!!PTTP0!!!!!!!!!!!58!!!!!!!!!!!!!!4414'
for(let d of R(I)){
let p=F(I+'/'+d+'/program.bin'),q=F(I+'/'+d+'/input.bin'),n=p.length,D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o='',s=0,t=0,c=0,pc=0,ip=0,e=0
for(;;){
if(s==1e6){e=10;break}
if(pc<0||pc>=n){e=9;break}
let a=p[pc],k=S.charCodeAt(a)-48
if(a>83||k<0){e=5;break}
if(pc+(k>>4)>=n){e=9;break}
s++
let x=pc+1+(k>>4),po=(k>>2)&3,pu=k&3
if(t<po||t-po+pu>256){e=t<po?2:3;break}
pc=x
if(!a){e=0;break}
else if(a==1)D[t++]=p.readInt8(x-1)
else if(a==2)D[t++]=p.readInt32LE(x-4)
else if(a==3)t--
else if(a==4||a==6){D[t]=D[t-(a==4?1:2)];t++}
else if(a==5)[D[t-1],D[t-2]]=[D[t-2],D[t-1]]
else if(a==7)[D[t-3],D[t-2],D[t-1]]=[D[t-2],D[t-1],D[t-3]]
else if(a==23||a==27)D[t-1]=a==23?-D[t-1]|0:~D[t-1]
else if(a>15&&a<35){let b=D[t-1],c=D[t-2];if(!b&&a>18&&a<23){e=4;break}let r=a==16?c+b:a==17?c-b:a==18?Math.imul(c,b):a==19?(c/b)|0:a==20?c%b:a==21?(c>>>0)/(b>>>0):a==22?(c>>>0)%(b>>>0):a==24?c&b:a==25?c|b:a==26?c^b:a==28?c<<b:a==29?c>>b:a==30?c>>>b:a==32?c==b?1:0:a==33?c<b?1:0:c>>>0<b>>>0?1:0;D[t-2]=r|0;t--}
else if(a>47&&a<51){let r=p.readInt16LE(x-2);if(a==48||(a==49)==(D[--t]==0))pc=x+r}
else if(a==51){if(c==64){e=7;break}C[c++]=x;pc=p[x-2]|p[x-1]<<8}
else if(a==52){if(!c){e=8;break}pc=C[--c]}
else if(a>63&&a<66){let v=D[t-1];if(v<0||v>255){e=6;break}if(a==64)D[t-1]=M[v];else{t-=2;M[v]=D[t]}}
else if(a==80){let g=''+D[t-1];if(o.length+g.length>65536){e=11;break}t--;o+=g}
else if(a==81){if(o.length>65535){e=11;break}o+=String.fromCharCode(D[--t]&255)}
else if(a==82)D[t++]=ip<q.length?q[ip++]:-1
else{e=D[--t]&255;break}
}
K(O+'/'+d,{recursive:true})
W(O+'/'+d+'/stdout.bin',o,'latin1')
W(O+'/'+d+'/exit.txt',e+'\n')
}
