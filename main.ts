import{readdirSync as R,readFileSync as F,mkdirSync as K,writeFileSync as W}from"node:fs";
const T="01146abfgggggggg999999959995999g999ggggggggggggg04400ggggggggggg58gggggggggggggg4414";
function r(p:Uint8Array,g:Uint8Array):[number[],number]{
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),O:number[]=[];
 let s=0,k=0,pc=0,n=0,j=0;
 for(;;){
  if(n==1e6)return[O,10];
  if(pc<0||pc>=p.length)return[O,9];
  let o=p[pc],q=T.charCodeAt(o);
  if(o>83||q==103)return[O,5];
  let v=q-(q<58?48:87),P=v>>2,U=v&3,I=o==1?1:o==2?4:o>47&&o<52?2:0;
  if(pc+I>=p.length)return[O,9];
  n++;let t=pc+1+I;
  if(s<P)return[O,2];
  if(s-P+U>256)return[O,3];
  pc=t;
  if(o<8){
   if(o==1)D[s++]=(p[t-1]<<24)>>24;
   else if(o==2)D[s++]=p[t-4]|p[t-3]<<8|p[t-2]<<16|p[t-1]<<24;
   else if(o==3)s--;
   else if(o==4){D[s]=D[s-1];s++}
   else if(o==5){let a=D[s-1];D[s-1]=D[s-2];D[s-2]=a}
   else if(o==6){D[s]=D[s-2];s++}
   else if(o==7){let a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a}
   else return[O,0];
  }else if(o<35){
   if(o==23)D[s-1]=-D[s-1]|0;
   else if(o==27)D[s-1]=~D[s-1];
   else{
    let b=D[s-1],a=D[s-2],y=0;
    if(o<23){
     if(o<19)y=o==16?a+b|0:o==17?a-b|0:Math.imul(a,b);
     else{if(!b)return[O,4];y=o==19?(a/b)|0:o==20?a%b|0:o==21?(a>>>0)/(b>>>0)|0:(a>>>0)%(b>>>0)|0}
    }else if(o<28)y=o==24?a&b:o==25?a|b:a^b;
    else if(o<31)y=o==28?a<<b:o==29?a>>b:(a>>>b)|0;
    else y=o==32?a==b?1:0:o==33?a<b?1:0:(a>>>0)<(b>>>0)?1:0;
    s-=2;D[s++]=y;
   }
  }else if(o<53){
   if(o<51){
    let z=(p[t-2]|p[t-1]<<8)<<16>>16,v=1;
    if(o>48)v=D[--s];
    if(o==48||(o==49)==(v==0))pc=t+z;
   }else if(o==51){
    if(k==64)return[O,7];
    C[k++]=t;pc=p[t-2]|p[t-1]<<8;
   }else{
    if(!k)return[O,8];
    pc=C[--k];
   }
  }else if(o==64){
   let a=D[s-1];if(a<0||a>255)return[O,6];D[s-1]=M[a];
  }else if(o==65){
   let a=D[s-1];if(a<0||a>255)return[O,6];s-=2;M[a]=D[s];
  }else if(o==80){
   let g=String(D[--s]);if(O.length+g.length>65536)return[O,11];for(let c of g)O.push(c.charCodeAt(0));
  }else if(o==81){
   if(O.length>65535)return[O,11];O.push(D[--s]&255);
  }else if(o==82)D[s++]=j<g.length?g[j++]:-1;
  else return[O,D[--s]&255];
 }
}
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
for(const d of R(I).sort()){
 let g=r(F(I+"/"+d+"/program.bin"),F(I+"/"+d+"/input.bin"));
 K(O+"/"+d,{recursive:true});
 W(O+"/"+d+"/stdout.bin",Uint8Array.from(g[0]));
 W(O+"/"+d+"/exit.txt",g[1]+"\n");
}
