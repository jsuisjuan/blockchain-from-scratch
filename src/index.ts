/*
* NAME: Blockchain from scratch
*
* AUTHOR   : Juan Carvalho Silva de Lima
* DATE     : 07/16/2023
* See https: https://www.youtube.com/watch?v=ztQEaQ06GYs&list=WL&index=1
*/

import { Blockchain, Bloco } from "./blockchain";          // importing Blockchain class from ./blockchain

const difficulty = Number(process.argv[2]) || 4;           // difficulty to mine a block
const blockchain = new Blockchain(difficulty);

const numberBlocks = Number(process.argv[3]) || 10;        // number of block to be created inside the blockchain
let chain: Bloco[] = blockchain.chain                      // pushing the chain of blocks

for (let i: number = 1; i <= numberBlocks; i++) {
    const bloco = blockchain.criarBloco(`Bloco ${i}`);      // creating the block pushing the data that ll be stored
    const mineInfo = blockchain.minerarBloco(bloco);
    chain = blockchain.enviarBloco(mineInfo.blocoMinerado);
}

console.log('--- BLOCKCHAIN ---');
console.log(chain);