/*
* NAME: Represetation of a hash function used in blockchain
*
* AUTHOR   : Juan Carvalho Silva de Lima
* DATE     : 07/22/2023
* See https: https://blog.bitnovo.com/en/what-is-sha-256-algorithm-and-how-does-it-work/
*/

import crypto from 'crypto';    // crypto lib to import hash function

let algorithm: string = 'sha256';       // type of encryption: SHA-256
let data: string = 'some random data';  // data that will be stored inside the block

// create the hash by sending the current data, encrypting with SHA-256 and return hexdecimal
const hash: string | Buffer = crypto.createHash(algorithm).update(data).digest('hex');

console.log(hash);

/**
 * In this example the hash result is: 40b618dbb6ae1f6f0cf51a782b31f1e10cacd1745f4394fd6ea582260a0a8df5
 * This value is unique, and only represents in this same set of data; any single change will change the
 * entire hexadecimal value.
 */


/**
 * Implementation of a SHA-256 encryption type using generative AI (Chat-GPT).
 * Not something to care that much about, but its is interesting to know that this is how
 * its work on scratch.
 */

class SHA256 {
    private static readonly K: number[] = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];
  
    private static H: number[] = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
    ];
  
    private static ROTR(n: number, x: number): number {
      return (x >>> n) | (x << (32 - n));
    }
  
    private static CH(x: number, y: number, z: number): number {
      return (x & y) ^ (~x & z);
    }
  
    private static MAJ(x: number, y: number, z: number): number {
      return (x & y) ^ (x & z) ^ (y & z);
    }
  
    private static EP0(x: number): number {
      return SHA256.ROTR(2, x) ^ SHA256.ROTR(13, x) ^ SHA256.ROTR(22, x);
    }
  
    private static EP1(x: number): number {
      return SHA256.ROTR(6, x) ^ SHA256.ROTR(11, x) ^ SHA256.ROTR(25, x);
    }
  
    private static SIG0(x: number): number {
      return SHA256.ROTR(7, x) ^ SHA256.ROTR(18, x) ^ (x >>> 3);
    }
  
    private static SIG1(x: number): number {
      return SHA256.ROTR(17, x) ^ SHA256.ROTR(19, x) ^ (x >>> 10);
    }
  
    private static SHA256Block(w: number[], block: Uint8Array, offset: number): void {
      const words = new Array(64).fill(0);
  
      for (let i = 0; i < 16; i++) {
        words[i] = (block[offset + i * 4] << 24) | (block[offset + i * 4 + 1] << 16) | (block[offset + i * 4 + 2] << 8) | block[offset + i * 4 + 3];
      }
  
      for (let i = 16; i < 64; i++) {
        const s0 = SHA256.SIG0(words[i - 15]);
        const s1 = SHA256.SIG1(words[i - 2]);
        words[i] = words[i - 16] + s0 + words[i - 7] + s1;
      }
  
      let a = SHA256.H[0];
      let b = SHA256.H[1];
      let c = SHA256.H[2];
      let d = SHA256.H[3];
      let e = SHA256.H[4];
      let f = SHA256.H[5];
      let g = SHA256.H[6];
      let h = SHA256.H[7];
  
      for (let i = 0; i < 64; i++) {
        const S1 = SHA256.EP1(e);
        const ch = SHA256.CH(e, f, g);
        const temp1 = h + S1 + ch + SHA256.K[i] + words[i];
        const S0 = SHA256.EP0(a);
        const maj = SHA256.MAJ(a, b, c);
        const temp2 = S0 + maj;
  
        h = g;
        g = f;
        f = e;
        e = d + temp1;
        d = c;
        c = b;
        b = a;
        a = temp1 + temp2;
      }
  
      SHA256.H[0] += a;
      SHA256.H[1] += b;
      SHA256.H[2] += c;
      SHA256.H[3] += d;
      SHA256.H[4] += e;
      SHA256.H[5] += f;
      SHA256.H[6] += g;
      SHA256.H[7] += h;
    }
  
    public static hash(message: string): string {
      const block = new Uint8Array(64);
      const msgLength = message.length;
      const bitLength = msgLength * 8;
      const buffer = new TextEncoder().encode(message);
  
      SHA256.H = [...SHA256.H];
  
      let offset = 0;
      for (let i = 0; i < buffer.length; i++) {
        block[offset++] = buffer[i];
        if (offset === 64) {
          SHA256.SHA256Block([], block, 0);
          offset = 0;
        }
      }
  
      block[offset++] = 0x80;
      if (offset > 56) {
        while (offset < 64) {
          block[offset++] = 0;
        }
        SHA256.SHA256Block([], block, 0);
        offset = 0;
      }
  
      while (offset < 56) {
        block[offset++] = 0;
      }
  
      block[56] = (bitLength >>> 24) & 0xff;
      block[57] = (bitLength >>> 16) & 0xff;
      block[58] = (bitLength >>> 8) & 0xff;
      block[59] = bitLength & 0xff;
      SHA256.SHA256Block([], block, 0);
  
      const hashArray = SHA256.H.map((h) => {
        return ((h >>> 24) & 0xff).toString(16).padStart(2, "0") +
          ((h >>> 16) & 0xff).toString(16).padStart(2, "0") +
          ((h >>> 8) & 0xff).toString(16).padStart(2, "0") +
          (h & 0xff).toString(16).padStart(2, "0");
      });
  
      return hashArray.join("");
    }
}
  
const message = 'some random data';
const hashedMessage = SHA256.hash(message);
console.log("Message:", message);
console.log("SHA-256 hash:", hashedMessage);

/**
 * In this example the hash result is: 4103363ecd7fdbf3aa7a619bf58fe706acdb150e52a7825c59c6de52321898b5
 * As you see it is not the same as the above one, but this is happend because the chatGPT hash function
 * are not using the same algorithm as the crypto lib. This is just a representation.
 */

  