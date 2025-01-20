"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NONCE_FETCH_INTERVAL = void 0;
// 20 min
exports.NONCE_FETCH_INTERVAL = 1200 * 1000;
class NonceManager {
    constructor(dapiClient) {
        this.dapiClient = dapiClient;
        this.identityNonce = new Map();
        this.identityContractNonce = new Map();
    }
    setIdentityNonce(identityId, nonce) {
        const identityIdStr = identityId.toString();
        const nonceState = this.identityNonce.get(identityIdStr);
        if (!nonceState) {
            this.identityNonce.set(identityIdStr, {
                value: nonce,
                lastFetchedAt: Date.now(),
            });
        }
        else {
            nonceState.value = nonce;
        }
    }
    async getIdentityNonce(identityId) {
        const identityIdStr = identityId.toString();
        let nonceState = this.identityNonce.get(identityIdStr);
        if (typeof nonceState === 'undefined') {
            const { identityNonce } = await this.dapiClient.platform.getIdentityNonce(identityId);
            if (typeof identityNonce === 'undefined') {
                throw new Error('Identity nonce is not found');
            }
            nonceState = {
                value: identityNonce,
                lastFetchedAt: Date.now(),
            };
            this.identityNonce.set(identityIdStr, nonceState);
        }
        else {
            const now = Date.now();
            if (now - nonceState.lastFetchedAt > exports.NONCE_FETCH_INTERVAL) {
                const { identityNonce } = await this.dapiClient.platform.getIdentityNonce(identityId);
                if (typeof identityNonce === 'undefined') {
                    throw new Error('Identity nonce is not found');
                }
                nonceState.value = identityNonce;
                nonceState.lastFetchedAt = now;
            }
        }
        return nonceState.value;
    }
    async bumpIdentityNonce(identityId) {
        const nextIdentityNonce = (await this.getIdentityNonce(identityId));
        this.setIdentityNonce(identityId, nextIdentityNonce);
        return nextIdentityNonce;
    }
    setIdentityContractNonce(identityId, contractId, nonce) {
        const identityIdStr = identityId.toString();
        const contractIdStr = contractId.toString();
        let contractNonce = this.identityContractNonce.get(identityIdStr);
        if (!contractNonce) {
            contractNonce = new Map();
            this.identityContractNonce.set(identityIdStr, contractNonce);
        }
        const nonceState = contractNonce.get(contractIdStr);
        if (!nonceState) {
            contractNonce.set(contractIdStr, {
                value: nonce,
                lastFetchedAt: Date.now(),
            });
        }
        else {
            nonceState.value = nonce;
        }
    }
    async getIdentityContractNonce(identityId, contractId) {
        const identityIdStr = identityId.toString();
        const contractIdStr = contractId.toString();
        let contractNonce = this.identityContractNonce.get(identityIdStr);
        if (!contractNonce) {
            contractNonce = new Map();
            this.identityContractNonce.set(identityIdStr, contractNonce);
        }
        let nonceState = contractNonce.get(contractIdStr);
        if (typeof nonceState === 'undefined') {
            const { identityContractNonce } = await this.dapiClient.platform
                .getIdentityContractNonce(identityId, contractId);
            if (typeof identityContractNonce === 'undefined') {
                throw new Error('Identity contract nonce is not found');
            }
            nonceState = {
                value: identityContractNonce,
                lastFetchedAt: Date.now(),
            };
            contractNonce.set(contractIdStr, nonceState);
        }
        else {
            const now = Date.now();
            if (now - nonceState.lastFetchedAt > exports.NONCE_FETCH_INTERVAL) {
                const { identityContractNonce } = await this.dapiClient.platform
                    .getIdentityContractNonce(identityId, contractId);
                if (typeof identityContractNonce === 'undefined') {
                    throw new Error('Identity nonce is not found');
                }
                nonceState.value = identityContractNonce;
                nonceState.lastFetchedAt = now;
            }
        }
        return nonceState.value;
    }
    async bumpIdentityContractNonce(identityId, contractId) {
        const identityContractNonce = await this.getIdentityContractNonce(identityId, contractId);
        // @ts-ignore
        const nextIdentityContractNonce = identityContractNonce + 1n;
        this.setIdentityContractNonce(identityId, contractId, nextIdentityContractNonce);
        return nextIdentityContractNonce;
    }
}
exports.default = NonceManager;
//# sourceMappingURL=NonceManager.js.map