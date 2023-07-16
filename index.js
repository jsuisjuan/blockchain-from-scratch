"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blockchain_1 = require("./blockchain");
var dificuldade = Number(process.argv[2]) || 4;
var blockchain = new blockchain_1.Blockchain(dificuldade);
var numeroBlocos = Number(process.argv[3]) || 10;
var chain = blockchain.chain;
for (var i = 1; i <= numeroBlocos; i++) {
    var bloco = blockchain.criarBloco("Bloco ".concat(i));
    var mineInfo = blockchain.minerarBloco(bloco);
    chain = blockchain.enviarBloco(mineInfo.blocoMinerado);
}
console.log('--- BLOCKCHAIN ---');
console.log(chain);
