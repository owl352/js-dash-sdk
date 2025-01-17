import DAPIClient from '@dashevo/dapi-client';
import { Identifier } from '@dashevo/wasm-dpp';
export declare const NONCE_FETCH_INTERVAL: number;
declare class NonceManager {
    dapiClient: DAPIClient;
    private identityNonce;
    private identityContractNonce;
    constructor(dapiClient: DAPIClient);
    setIdentityNonce(identityId: Identifier, nonce: BigInt): void;
    getIdentityNonce(identityId: Identifier): Promise<BigInt>;
    bumpIdentityNonce(identityId: Identifier): Promise<BigInt>;
    setIdentityContractNonce(identityId: Identifier, contractId: Identifier, nonce: BigInt): void;
    getIdentityContractNonce(identityId: Identifier, contractId: Identifier): Promise<BigInt>;
    bumpIdentityContractNonce(identityId: Identifier, contractId: Identifier): Promise<BigInt>;
}
export default NonceManager;
