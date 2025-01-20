"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const wasm_dpp_1 = require("@dashevo/wasm-dpp");
const NotFoundError = require('@dashevo/dapi-client/lib/transport/GrpcTransport/errors/NotFoundError');
/**
 * Get contracts from the platform
 *
 * @param {Platform} this - bound instance class
 * @param {ContractIdentifier} identifier - identifier of the contract to fetch
 * @returns contracts
 */
async function get(identifier) {
    this.logger.debug(`[Contracts#get] Get Data Contract "${identifier}"`);
    await this.initialize();
    const contractId = wasm_dpp_1.Identifier.from(identifier);
    // Try to get contract from the cache
    // eslint-disable-next-line
    for (const appName of this.client.getApps().getNames()) {
        const appDefinition = this.client.getApps().get(appName);
        if (appDefinition.contractId.equals(contractId) && appDefinition.contract) {
            return appDefinition.contract;
        }
    }
    // Fetch contract otherwise
    let dataContractResponse;
    try {
        dataContractResponse = await this.fetcher.fetchDataContract(contractId);
        this.logger.silly(`[Contracts#get] Fetched Data Contract "${identifier}"`);
    }
    catch (e) {
        if (e instanceof NotFoundError) {
            return null;
        }
        throw e;
    }
    const contract = await this.dpp.dataContract
        .createFromBuffer(dataContractResponse.getDataContract());
    let metadata;
    const responseMetadata = dataContractResponse.getMetadata();
    if (responseMetadata) {
        metadata = new wasm_dpp_1.Metadata({
            blockHeight: responseMetadata.getHeight(),
            coreChainLockedHeight: responseMetadata.getCoreChainLockedHeight(),
            timeMs: responseMetadata.getTimeMs(),
            protocolVersion: responseMetadata.getProtocolVersion(),
        });
    }
    contract.setMetadata(metadata);
    // Store contract to the cache
    // eslint-disable-next-line
    for (const appName of this.client.getApps().getNames()) {
        const appDefinition = this.client.getApps().get(appName);
        if (appDefinition.contractId.equals(contractId)) {
            appDefinition.contract = contract;
        }
    }
    this.logger.debug(`[Contracts#get] Obtained Data Contract "${identifier}"`);
    return contract;
}
exports.get = get;
exports.default = get;
//# sourceMappingURL=get.js.map