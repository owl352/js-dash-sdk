"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundError_1 = __importDefault(require("@dashevo/dapi-client/lib/transport/GrpcTransport/errors/NotFoundError"));
const withRetry_1 = __importDefault(require("./withRetry"));
const DEFAULT_DELAY_MUL_MS = 1000;
const DEFAULT_MAX_ATTEMPTS = 7;
/**
 * Fetcher class that handles retry attempts for acknowledged identifiers
 * Primary goal of this class is to mitigate network propagation lag
 * where we query platform entities right after their creation
 *
 * Should be used until fully functioning state transition acknowledgement is implemented
 *
 * Note: possible collisions of acknowledged keys
 * should be resolved externally by user of this class
 */
class Fetcher {
    constructor(dapiClient, options = {}) {
        this.dapiClient = dapiClient;
        this.acknowledgedKeys = new Set();
        this.delayMulMs = typeof options.delayMulMs === 'number'
            ? options.delayMulMs : DEFAULT_DELAY_MUL_MS;
        this.maxAttempts = typeof options.maxAttempts === 'number'
            ? options.maxAttempts : DEFAULT_MAX_ATTEMPTS;
    }
    /**
     * Acknowledges DPP Identifier to retry on it in get methods
     * @param identifier
     */
    acknowledgeIdentifier(identifier) {
        this.acknowledgedKeys.add(identifier.toString());
    }
    /**
     * Acknowledges string key to retry on it in get methods
     * @param key
     */
    acknowledgeKey(key) {
        this.acknowledgedKeys.add(key);
    }
    /**
     * Forgets string key to stop retrying on it in get methods
     * @param key
     */
    forgetKey(key) {
        this.acknowledgedKeys.delete(key);
    }
    /**
     * Checks if identifier was acknowledged
     * @param identifier
     */
    hasIdentifier(identifier) {
        return this.acknowledgedKeys.has(identifier.toString());
    }
    hasKey(key) {
        return this.acknowledgedKeys.has(key);
    }
    /**
     * Fetches identity by it's ID
     * @param id
     */
    async fetchIdentity(id) {
        // Define query
        const query = async () => {
            const { platform } = this.dapiClient;
            return platform.getIdentity(id);
        };
        // Define retry attempts.
        // In case we acknowledged this identifier, we want to retry to mitigate
        // state transition propagation lag. Otherwise, we want to try only once.
        const retryAttempts = this.hasIdentifier(id) ? this.maxAttempts : 1;
        return withRetry_1.default(query, retryAttempts, this.delayMulMs);
    }
    /**
     * Fetches data contract by it's ID
     * @param id
     */
    async fetchDataContract(id) {
        // Define query
        const query = async () => {
            const { platform } = this.dapiClient;
            return platform.getDataContract(id);
        };
        // Define retry attempts.
        // In case we acknowledged this identifier, we want to retry to mitigate
        // state transition propagation lag. Otherwise, we want to try only once.
        const retryAttempts = this.hasIdentifier(id) ? this.maxAttempts : 1;
        return withRetry_1.default(query, retryAttempts, this.delayMulMs);
    }
    /**
     * Fetches data contract by it's ID
     * @param id
     * @param startAMs
     * @param limit
     * @param offset
     */
    async fetchDataContractHistory(id, startAMs, limit, offset) {
        // Define query
        const query = async () => await this
            .dapiClient.platform.getDataContractHistory(id, startAMs, limit, offset);
        // Define retry attempts.
        // In case we acknowledged this identifier, we want to retry to mitigate
        // state transition propagation lag. Otherwise, we want to try only once.
        const retryAttempts = this.hasIdentifier(id) ? this.maxAttempts : 1;
        return withRetry_1.default(query, retryAttempts, this.delayMulMs);
    }
    /**
     * Fetches documents by data contract id and type
     * @param {Identifier} contractId - data contract ID
     * @param {string} type - document name
     * @param {QueryOptions} opts - query
     */
    async fetchDocuments(contractId, type, opts) {
        // Define query
        const query = async () => {
            const result = await this.dapiClient.platform
                .getDocuments(contractId, type, opts);
            if (result.getDocuments().length === 0) {
                throw new NotFoundError_1.default(`Documents of type "${type}" not found for the data contract ${contractId}`);
            }
            return result;
        };
        // Define retry attempts.
        // In case we acknowledged this identifier, we want to retry to mitigate
        // state transition propagation lag. Otherwise, we want to try only once.
        const documentLocator = `${contractId.toString()}/${type}`;
        const retryAttempts = this.hasKey(documentLocator) ? this.maxAttempts : 1;
        return withRetry_1.default(query, retryAttempts, this.delayMulMs);
    }
}
exports.default = Fetcher;
//# sourceMappingURL=Fetcher.js.map