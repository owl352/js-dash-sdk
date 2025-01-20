"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.history = void 0;
// @ts-ignore
const wasm_dpp_1 = require("@dashevo/wasm-dpp");
const NotFoundError = require('@dashevo/dapi-client/lib/transport/GrpcTransport/errors/NotFoundError');
/**
 * Get contracts from the platform
 *
 * @param {ContractIdentifier} identifier - identifier of the contract to fetch
 * @param startAtMs
 * @param limit
 * @param offset
 * @returns contracts
 */
async function history(identifier, startAtMs, limit, offset) {
    this.logger.debug(`[Contracts#history] Get Data Contract History for "${identifier}"`);
    await this.initialize();
    const contractId = wasm_dpp_1.Identifier.from(identifier);
    let dataContractHistoryResponse;
    try {
        dataContractHistoryResponse = await this.fetcher
            .fetchDataContractHistory(contractId, startAtMs, limit, offset);
        this.logger.silly(`[Contracts#history] Fetched Data Contract History for "${identifier}"`);
    }
    catch (e) {
        if (e instanceof NotFoundError) {
            return null;
        }
        throw e;
    }
    const rawContractHistory = dataContractHistoryResponse.getDataContractHistory();
    const contractHistory = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [date, contractBytes] of Object.entries(rawContractHistory)) {
        contractHistory[date] = await this.dpp.dataContract
            .createFromBuffer(contractBytes);
    }
    this.logger.debug(`[Contracts#history] Obtained Data Contract history for "${identifier}"`);
    return contractHistory;
}
exports.history = history;
exports.default = history;
//# sourceMappingURL=history.js.map