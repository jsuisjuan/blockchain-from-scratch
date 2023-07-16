"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashValidado = exports.hash = void 0;
var crypto_1 = require("crypto");
function hash(dado) {
    return (0, crypto_1.createHash)('sha256').update(JSON.stringify(dado)).digest('hex');
}
exports.hash = hash;
function hashValidado(_a) {
    var hash = _a.hash, _b = _a.dificuldade, dificuldade = _b === void 0 ? 4 : _b, _c = _a.prefixo, prefixo = _c === void 0 ? '0' : _c;
    var check = prefixo.repeat(dificuldade);
    return hash.startsWith(check);
}
exports.hashValidado = hashValidado;
