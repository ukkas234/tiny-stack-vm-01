// Tiny stack VM: faithful interpreter of make.fun's tiny-stack ISA v1.
// Reads MAKEFUN_INPUT_DIR/<id>/{program,input}.bin, writes
// MAKEFUN_OUTPUT_DIR/<id>/{stdout.bin,exit.txt}. Node 22, erasable TS only.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Immediate length per opcode (255 = not an opcode).
const IMM = new Uint8Array(256).fill(255);
for (const o of [0, 3, 4, 5, 6, 7, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 52, 64, 65, 80, 81, 82, 83]) IMM[o] = 0;
IMM[1] = 1; IMM[2] = 4; IMM[48] = IMM[49] = IMM[50] = IMM[51] = 2;
// Stack pops / pushes per opcode.
const PO = new Uint8Array(256), PU = new Uint8Array(256);
for (const o of [1, 2, 82]) PU[o] = 1;
for (const o of [3, 23, 27, 49, 50, 64, 80, 81, 83]) PO[o] = 1;
PO[4] = 1; PU[4] = 2; PO[5] = 2; PU[5] = 2; PO[6] = 2; PU[6] = 3; PO[7] = 3; PU[7] = 3;
for (const o of [16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 28, 29, 30, 32, 33, 34]) { PO[o] = 2; PU[o] = 1; }
PO[65] = 2;

function run(p: Uint8Array, inp: Uint8Array): { out: Uint8Array; code: number } {
  const n = p.length, D = new Int32Array(256);
  let sp = 0;
  const C = new Int32Array(64);
  let cp = 0;
  const M = new Int32Array(256), out = new Uint8Array(65536);
  let olen = 0, ip = 0, pc = 0, steps = 0;
  const done = (code: number) => ({ out: out.subarray(0, olen), code });
  for (;;) {
    if (steps === 1e6) return done(10);
    if (pc < 0 || pc >= n) return done(9);
    const op = p[pc], imm = IMM[op];
    if (imm === 255) return done(5);
    if (pc + imm >= n) return done(9);
    steps++;
    const next = pc + 1 + imm;
    if (sp < PO[op]) return done(2);
    if (sp - PO[op] + PU[op] > 256) return done(3);
    pc = next;
    switch (op) {
      case 0x00: return done(0);
      case 0x01: D[sp++] = (p[next - 1] << 24) >> 24; break;
      case 0x02: D[sp++] = p[next - 4] | (p[next - 3] << 8) | (p[next - 2] << 16) | (p[next - 1] << 24); break;
      case 0x03: sp--; break;
      case 0x04: D[sp] = D[sp - 1]; sp++; break;
      case 0x05: { const t = D[sp - 1]; D[sp - 1] = D[sp - 2]; D[sp - 2] = t; break; }
      case 0x06: D[sp] = D[sp - 2]; sp++; break;
      case 0x07: { const a = D[sp - 3]; D[sp - 3] = D[sp - 2]; D[sp - 2] = D[sp - 1]; D[sp - 1] = a; break; }
      case 0x10: case 0x11: case 0x12: case 0x13: case 0x14: case 0x15: case 0x16:
      case 0x18: case 0x19: case 0x1a: case 0x1c: case 0x1d: case 0x1e:
      case 0x20: case 0x21: case 0x22: {
        const b = D[sp - 1], a = D[sp - 2];
        let r = 0;
        if (op === 0x10) r = (a + b) | 0;
        else if (op === 0x11) r = (a - b) | 0;
        else if (op === 0x12) r = Math.imul(a, b);
        else if (op === 0x13) { if (b === 0) return done(4); r = a === -2147483648 && b === -1 ? a : (a / b) | 0; }
        else if (op === 0x14) { if (b === 0) return done(4); r = b === -1 ? 0 : (a % b) | 0; }
        else if (op === 0x15) { if (b === 0) return done(4); r = Math.floor((a >>> 0) / (b >>> 0)) | 0; }
        else if (op === 0x16) { if (b === 0) return done(4); r = ((a >>> 0) % (b >>> 0)) | 0; }
        else if (op === 0x18) r = a & b;
        else if (op === 0x19) r = a | b;
        else if (op === 0x1a) r = a ^ b;
        else if (op === 0x1c) r = a << (b & 31);
        else if (op === 0x1d) r = a >> (b & 31);
        else if (op === 0x1e) r = (a >>> (b & 31)) | 0;
        else if (op === 0x20) r = a === b ? 1 : 0;
        else if (op === 0x21) r = a < b ? 1 : 0;
        else r = (a >>> 0) < (b >>> 0) ? 1 : 0;
        sp -= 2; D[sp++] = r; break;
      }
      case 0x17: D[sp - 1] = (-D[sp - 1]) | 0; break;
      case 0x1b: D[sp - 1] = ~D[sp - 1]; break;
      case 0x30: case 0x31: case 0x32: {
        const rel = ((p[next - 2] | (p[next - 1] << 8)) << 16) >> 16;
        let take = op === 0x30;
        if (op !== 0x30) { const v = D[--sp]; take = op === 0x31 ? v === 0 : v !== 0; }
        if (take) pc = next + rel;
        break;
      }
      case 0x33:
        if (cp === 64) return done(7);
        C[cp++] = next; pc = p[next - 2] | (p[next - 1] << 8); break;
      case 0x34:
        if (cp === 0) return done(8);
        pc = C[--cp]; break;
      case 0x40: {
        const addr = D[sp - 1];
        if (addr < 0 || addr >= 256) return done(6);
        D[sp - 1] = M[addr]; break;
      }
      case 0x41: {
        const addr = D[sp - 1], v = D[sp - 2];
        if (addr < 0 || addr >= 256) return done(6);
        sp -= 2; M[addr] = v; break;
      }
      case 0x50: {
        // Decimal output without allocating: count digits, check the
        // output limit, then write the digits backwards into the buffer.
        let v = D[sp - 1], u = v, neg = false, digits = 0;
        if (v < 0) { neg = true; u = -v; }
        let t = u;
        do { digits++; t = Math.floor(t / 10); } while (t > 0);
        const len = digits + (neg ? 1 : 0);
        if (olen + len > 65536) return done(11);
        sp--;
        let end = olen + len, w = u;
        do { out[--end] = 48 + (w % 10); w = Math.floor(w / 10); } while (w > 0);
        if (neg) out[--end] = 45;
        olen += len;
        break;
      }
      case 0x51:
        if (olen + 1 > 65536) return done(11);
        out[olen++] = D[--sp] & 255; break;
      case 0x52: D[sp++] = ip < inp.length ? inp[ip++] : -1; break;
      case 0x53: return done(D[--sp] & 255);
    }
  }
}

const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
for (const id of readdirSync(I).sort()) {
  const r = run(new Uint8Array(readFileSync(join(I, id, 'program.bin'))), new Uint8Array(readFileSync(join(I, id, 'input.bin'))));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), r.out);
  writeFileSync(join(O, id, 'exit.txt'), `${r.code}\n`);
}
