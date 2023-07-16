import { stringify } from "querystring";
import { hash, hashValidado } from "./helpers";

export interface Bloco {
    header: {
        nonce: number;
        hashBloco: string;
    },
    payload: {
        sequencia: number;
        timestamp: number;
        dados: any;
        hashAnterior: string;
    }
};

export class Blockchain {
    #chain: Bloco[] = [];
    private prefixoPow = '0';

    constructor(private readonly dificuldade: number = 4) {
        this.#chain.push(this.criarBlocoGenesis());
    }

    private criarBlocoGenesis(): Bloco {
        const payload: Bloco['payload'] = {
            sequencia: 0,
            timestamp: +new Date(),
            dados: 'Bloco inicial',
            hashAnterior: ''
        };

        return {
            header: {
                nonce: 0,
                hashBloco: hash(JSON.stringify(payload))
            },
            payload
        }; 
    }

    get chain():Bloco[] {
        return this.#chain;
    }

    private get ultimoBloco(): Bloco {
        return this.#chain.at(-1) as Bloco;
    }

    private hashUltimoBloco(): string {
        return this.ultimoBloco.header.hashBloco;
    }
    
    criarBloco(dados: any): Bloco['payload'] {
        const novoBloco: Bloco['payload'] = {
            sequencia: this.ultimoBloco.payload.sequencia + 1,
            timestamp: +new Date(),
            dados,
            hashAnterior: this.hashUltimoBloco()
        };

        console.log(`Bloco #${novoBloco.sequencia} criado: ${JSON.stringify(novoBloco)}`);
        return novoBloco;
    }

    minerarBloco(bloco: Bloco['payload']) {
        let nonce: number = 0;
        let inicio: number = +new Date();

        while(true) {
            const hashBloco: string = hash(JSON.stringify(bloco));
            const hashPow: string = hash(hashBloco + nonce);

            if (hashValidado({hash: hashPow, dificuldade: this.dificuldade, prefixo: this.prefixoPow})) {
                const final: number = +new Date();
                const hashReduzido: string = hashBloco.slice(0, 12);
                const tempoMineracao: number = (final - inicio) / 1000;

                console.log(`Bloco #${bloco.sequencia} minerado em ${tempoMineracao}s. Hash ${hashReduzido} (${nonce} tentativas)`);

                return {
                    blocoMinerado: {
                        payload: {...bloco},
                        header: {
                            nonce,
                            hashBloco
                        }
                    }
                };
            }

            nonce++;
        }
    }
        
    enviarBloco(bloco: Bloco): Bloco[] {
        if(this.verificarBloco(bloco)) {
            this.#chain.push(bloco);
            console.log(`Bloco #${bloco.payload.sequencia} foi adicionado a blockchain: ${JSON.stringify(bloco, null, 2)}`);
        }
        return this.#chain;
    }

    verificarBloco(bloco: Bloco): boolean {
        if(bloco.payload.hashAnterior !== this.hashUltimoBloco()) {
            console.error(`Bloco #${bloco.payload.sequencia} invalido: O hash anterior é ${this.hashUltimoBloco().slice(0, 12)} e não ${bloco.payload.hashAnterior.slice(0, 12)}`);
            return false;
        }

        const hashTeste: string = hash(hash(JSON.stringify(bloco.payload)) + bloco.header.nonce);
        if(!hashValidado({hash: hashTeste, dificuldade: this.dificuldade, prefixo: this.prefixoPow})) {
            console.error(`Bloco #${bloco.payload.sequencia} invalido: Nonce ${bloco.header.nonce} é invalido e não pode ser verificado`);
            return false;
        }
        return true;
    }
}