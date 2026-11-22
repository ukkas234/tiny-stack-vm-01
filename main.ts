import{readdirSync as R,readFileSync as F,writeFileSync as W,mkdirSync as M}from"node:fs";
const P=process.env,I=P.MAKEFUN_INPUT_DIR||"/input",O=P.MAKEFUN_OUTPUT_DIR||"/output",E=new TextEncoder,T="#4d')-.2        ,,,,,,,(,,,(,,, ,,,             CGGC#           (+              ''$'";
for(const d of R(I).sort()){
 const p=F(I+"/"+d+"/program.bin"),u=F(I+"/"+d+"/input.bin"),n=p.length,b=new Uint8Array(65536);
 let j=0;
 function V(){
  const D=new Int32Array(256),S=new Int32Array(64),G=new Int32Array(256);
  let s=0,g=0,pc=0,ip=0,t=0,v=0,a=0,w=0,i=0;
  for(;;){
   if(t==1e6|pc<0|pc>=n)return t==1e6?10:9;
   const o=p[pc],k=T.charCodeAt(o)-35;
   if(!(k>=0))return 5;
   const m=k>>4,f=k>>2&3,h=k&3;
   if(pc+m>=n)return 9;
   t++;
   if(s<f|s-f+h>256)return s<f?2:3;
   pc+=1+m;w=(p[pc-2]|p[pc-1]<<8)<<16>>16;
   switch(o){
    case 0:return 0;
    case 1:D[s++]=(p[pc-1]<<24)>>24;break;
    case 2:for(a=i=0;i<4;)a|=p[pc-4+i]<<8*i++;D[s++]=a;break;
    case 3:s--;break;
    case 4:case 6:D[s]=D[s-h+1];s++;break;
    case 5:case 7:a=D[s-h];for(i=s-h;i<s-1;i++)D[i]=D[i+1];D[s-1]=a;break;
    case 23:D[s-1]=-D[s-1]|0;break;
    case 27:D[s-1]=~D[s-1];break;
    case 48:pc+=w;break;
    case 49:case 50:v=D[--s],pc+=(o==49)^(v==0)?0:w;break;
    case 51:if(g>63)return 7;S[g++]=pc,pc=w&65535;break;
    case 52:if(g<1)return 8;pc=S[--g];break;
    case 64:a=D[s-1];if(a>>>8)return 6;D[s-1]=G[a];break;
    case 65:a=D[s-1];if(a>>>8)return 6;G[a]=D[s-2];s-=2;break;
    case 80:v=E.encode(D[s-1]);if(j+v.length>65536)return 11;b.set(v,j),j+=v.length,s--;break;
    case 81:if(j>65535)return 11;b[j++]=D[--s]&255;break;
    case 82:D[s++]=ip<u.length?u[ip++]:-1;break;
    case 83:return D[--s]&255;
    default:
     let y=D[--s],x=D[s-1],X=x>>>0,Y=y>>>0,r;
     if(o<19)r=o==16?x+y|0:o==17?x-y|0:Math.imul(x,y);
     else if(o<23){if(!y)return 4;r=o==19?x/y|0:o==20?x%y|0:o==21?X/Y|0:X%Y|0}
     else if(o<27)r=o==24?x&y:o==25?x|y:x^y;
     else if(o<31)r=o==28?x<<(y&31):o==29?x>>(y&31):x>>>(y&31)|0;
     else r=o==32?x==y?1:0:o==33?x<y?1:0:X<Y?1:0;
     D[s-1]=r;break;
   }
  }
 }
 const e=V();
 M(O+"/"+d,{recursive:true});
 W(O+"/"+d+"/stdout.bin",b.slice(0,j));
 W(O+"/"+d+"/exit.txt",e+"\n");
}
