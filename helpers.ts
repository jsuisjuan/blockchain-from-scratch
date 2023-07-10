import { BinaryLike, createHash } from "crypto";

export function hash(dado: BinaryLike): string {
    return createHash('sha256').update(JSON.stringify(dado)).digest('hex');
}