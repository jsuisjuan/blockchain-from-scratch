"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Blockchain_chain;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
var helpers_1 = require("./helpers");
;
var Blockchain = /** @class */ (function () {
    function Blockchain(dificuldade) {
        if (dificuldade === void 0) { dificuldade = 4; }
        this.dificuldade = dificuldade;
        _Blockchain_chain.set(this, []);
        this.prefixoPow = '0';
        __classPrivateFieldGet(this, _Blockchain_chain, "f").push(this.criarBlocoGenesis());
    }
    Blockchain.prototype.criarBlocoGenesis = function () {
        var payload = {
            sequencia: 0,
            timestamp: +new Date(),
            dados: 'Bloco inicial',
            hashAnterior: ''
        };
        return {
            header: {
                nonce: 0,
                hashBloco: (0, helpers_1.hash)(JSON.stringify(payload))
            },
            payload: payload
        };
    };
    Object.defineProperty(Blockchain.prototype, "chain", {
        get: function () {
            return __classPrivateFieldGet(this, _Blockchain_chain, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Blockchain.prototype, "ultimoBloco", {
        get: function () {
            return __classPrivateFieldGet(this, _Blockchain_chain, "f").at(-1);
        },
        enumerable: false,
        configurable: true
    });
    Blockchain.prototype.hashUltimoBloco = function () {
        return this.ultimoBloco.header.hashBloco;
    };
    Blockchain.prototype.criarBloco = function (dados) {
        var novoBloco = {
            sequencia: this.ultimoBloco.payload.sequencia + 1,
            timestamp: +new Date(),
            dados: dados,
            hashAnterior: this.hashUltimoBloco()
        };
        console.log("Bloco #".concat(novoBloco.sequencia, " criado: ").concat(JSON.stringify(novoBloco)));
        return novoBloco;
    };
    Blockchain.prototype.minerarBloco = function (bloco) {
        var nonce = 0;
        var inicio = +new Date();
        while (true) {
            var hashBloco = (0, helpers_1.hash)(JSON.stringify(bloco));
            var hashPow = (0, helpers_1.hash)(hashBloco + nonce);
            if ((0, helpers_1.hashValidado)({ hash: hashPow, dificuldade: this.dificuldade, prefixo: this.prefixoPow })) {
                var final = +new Date();
                var hashReduzido = hashBloco.slice(0, 12);
                var tempoMineracao = (final - inicio) / 1000;
                console.log("Bloco #".concat(bloco.sequencia, " minerado em ").concat(tempoMineracao, "s. Hash ").concat(hashReduzido, " (").concat(nonce, " tentativas)"));
                return {
                    blocoMinerado: {
                        payload: __assign({}, bloco),
                        header: {
                            nonce: nonce,
                            hashBloco: hashBloco
                        }
                    }
                };
            }
            nonce++;
        }
    };
    Blockchain.prototype.enviarBloco = function (bloco) {
        if (this.verificarBloco(bloco)) {
            __classPrivateFieldGet(this, _Blockchain_chain, "f").push(bloco);
            console.log("Bloco #".concat(bloco.payload.sequencia, " foi adicionado a blockchain: ").concat(JSON.stringify(bloco, null, 2)));
        }
        return __classPrivateFieldGet(this, _Blockchain_chain, "f");
    };
    Blockchain.prototype.verificarBloco = function (bloco) {
        if (bloco.payload.hashAnterior !== this.hashUltimoBloco()) {
            console.error("Bloco #".concat(bloco.payload.sequencia, " invalido: O hash anterior \u00E9 ").concat(this.hashUltimoBloco().slice(0, 12), " e n\u00E3o ").concat(bloco.payload.hashAnterior.slice(0, 12)));
            return false;
        }
        var hashTeste = (0, helpers_1.hash)((0, helpers_1.hash)(JSON.stringify(bloco.payload)) + bloco.header.nonce);
        if (!(0, helpers_1.hashValidado)({ hash: hashTeste, dificuldade: this.dificuldade, prefixo: this.prefixoPow })) {
            console.error("Bloco #".concat(bloco.payload.sequencia, " invalido: Nonce ").concat(bloco.header.nonce, " \u00E9 invalido e n\u00E3o pode ser verificado"));
            return false;
        }
        return true;
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
_Blockchain_chain = new WeakMap();
