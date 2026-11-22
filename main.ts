import{readFileSync,readdirSync,mkdirSync,writeFileSync}from"node:fs";
function R(p,g){
let Q=new Int32Array(576),u=new Uint8Array(65536),s=0,k=0,j=0,z=0,l=0,y=0;
let E=c=>[c,u.slice(0,l)];
try{for(;;){
if(z==1e6)throw 10;
if(j<0|j>=p.length)throw 9;
let o=p[j],i=o==1?1:o==2?4:o>47&&o<52?2:0;
if(j+i>=p.length)throw 9;
z++;
let a=o==7?3:[5,6,65].includes(o)||o>15&&o<35&&o!=23&&o!=27?2:[3,4,23,27,49,50,64,80,81,83].includes(o)?1:0;
let b=o==6||o==7?3:o==4?2:[1,2,64,82].includes(o)||o>15&&o<35?1:0;
if(s<a)throw 2;
if(s-a+b>256)throw 3;
j+=1+i;
if(o==0)return E(0);
if(o==1)Q[s++]=p.readInt8(j-1);
else if(o==2)Q[s++]=p.readInt32LE(j-4);
else if(o==3)s--;
else if(o==4){Q[s]=Q[s-1];s++}
else if(o==5){let t=Q[s-1];Q[s-1]=Q[s-2];Q[s-2]=t}
else if(o==6){Q[s]=Q[s-2];s++}
else if(o==7){let t=Q[s-3];Q[s-3]=Q[s-2];Q[s-2]=Q[s-1];Q[s-1]=t}
else if(o==23)Q[s-1]=-Q[s-1];
else if(o==27)Q[s-1]=~Q[s-1];
else if(o>15&&o<35){
let B=Q[--s],A=Q[s-1],r;
if(o>18&&o<23){if(!B)throw 4;r=o==19?A/B:o==20?A%B:o==21?(A>>>0)/(B>>>0):(A>>>0)%(B>>>0)}
else if(o>23&&o<27)r=o==24?A&B:o==25?A|B:A^B;
else if(o>27&&o<31)r=o==28?A<<(B&31):o==29?A>>(B&31):A>>>(B&31);
else if(o>31)r=o==32?(A==B?1:0):o==33?(A<B?1:0):(A>>>0)<(B>>>0)?1:0;
else if(o<19)r=o==16?A+B:o==17?A-B:Math.imul(A,B);
else throw 5;
Q[s-1]=r;
}
else if(o>47&&o<51){let r=p.readInt16LE(j-2);if(o==48||(o==49)==(Q[--s]==0))j+=r}
else if(o==51){if(k==64)throw 7;Q[512+k++]=j;j=p[j-2]|p[j-1]<<8}
else if(o==52){if(!k)throw 8;j=Q[512+--k]}
else if(o==64){let A=Q[s-1];if(A<0|A>255)throw 6;Q[s-1]=Q[256+A]}
else if(o==65){let A=Q[s-1],v=Q[s-2];if(A<0|A>255)throw 6;s-=2;Q[256+A]=v}
else if(o==80){let v=Q[--s]+"";if(l+v.length>65536)throw 11;l+=Buffer.from(v).copy(u,l)}
else if(o==81){if(l>65535)throw 11;u[l++]=Q[--s]&255}
else if(o==82)Q[s++]=y<g.length?g[y++]:-1;
else if(o==83)return E(Q[--s]&255);
else throw 5;
}}catch(e){return E(e)}
}
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
for(const d of readdirSync(I).sort()){
let[c,o]=R(readFileSync(I+"/"+d+"/program.bin"),readFileSync(I+"/"+d+"/input.bin"));
mkdirSync(O+"/"+d,{recursive:true});
writeFileSync(O+"/"+d+"/stdout.bin",o);
writeFileSync(O+"/"+d+"/exit.txt",c+"\n");
}
