import{readdirSync as l,readFileSync as f,mkdirSync as m,writeFileSync as w}from"node:fs";
import{join as j}from"node:path";
let{MAKEFUN_INPUT_DIR:I="/input",MAKEFUN_OUTPUT_DIR:O="/output"}=process.env,K="8L|5=:>;~~~~~~~~666666696669666~666~~~~~~~~~~~~~XUUX8~~~~~~~~~~~92~~~~~~~~~~~~~~55<5";
let R=(p,q)=>{
let D=new Int32Array(256),C=D.slice(0,64),M=D.slice(),o=[],s=0,k=0,g=0,t=0,y=0,a,b,x,B=[()=>a+b|0,()=>a-b|0,()=>Math.imul(a,b),()=>(a/b)|0,()=>a%b|0,()=>(a>>>0)/(b>>>0)|0,()=>(a>>>0)%(b>>>0)|0,0,()=>a&b,()=>a|b,()=>a^b,0,()=>a<<b,()=>a>>b,()=>a>>>b,0,()=>a==b?1:0,()=>a<b?1:0,()=>a>>>0<b>>>0?1:0];
for(;;){
if(t++==1e6)return[10,o];
if(p[g]==null)return[9,o];
let op=p[g],v=K.charCodeAt(op)-48;
if(v>76|op>83)return[5,o];
if(g+(v>>4)>=p.length)return[9,o];
g+=1+(v>>4);
if(s<(v&3))return[2,o];
if(s+(v>>2&3)>258)return[3,o];
if(op<8){
if(op<3){if(!op)return[0,o];D[s++]=op==1?p.readInt8(g-1):p.readInt32LE(g-4)}
else if(op==3)s--;
else if(op==4|op==6){D[s]=D[s-1-(op==6)];s++}
else if(op==5){a=D[s-1];D[s-1]=D[s-2];D[s-2]=a}
else{a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a}
}else if(op<35){
if(op==23|op==27)D[s-1]=op==23?-D[s-1]|0:~D[s-1];
else{b=D[s-1];a=D[s-2];if(op>18&op<23&!b)return[4,o];D[s-2]=B[op-16]();s--}
}else if(op<53){
if(op<51){if(op==48||(op==49)==(D[--s]==0))g+=p.readInt16LE(g-2)}
else if(op==51){if(k==64)return[7,o];C[k++]=g;g=p[g-2]|p[g-1]<<8}
else{if(!k)return[8,o];g=C[--k]}
}else if(op<66){
a=D[s-1];if(a>>>0>255)return[6,o];
if(op==64)D[s-1]=M[a];else{b=D[s-2];s-=2;M[a]=b}
}else{
if(op<82){x=op==80?Buffer.from(""+D[--s]):[D[--s]&255];if(o.length+x.length>65536)return[11,o];o.push(...x)}
else if(op==82)D[s++]=y<q.length?q[y++]:-1;
else return[D[--s]&255,o];
}
}
};
for(let d of l(I)){
let r=R(f(j(I,d,"program.bin")),f(j(I,d,"input.bin")));
m(j(O,d),{recursive:true});
w(j(O,d,"stdout.bin"),Buffer.from(r[1]));
w(j(O,d,"exit.txt"),r[0]+"\n");
}
