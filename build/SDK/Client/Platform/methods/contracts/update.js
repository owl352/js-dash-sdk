"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const broadcastStateTransition_1 = __importDefault(require("../../broadcastStateTransition"));
const signStateTransition_1 = require("../../signStateTransition");
/**
 * Publish contract onto the platform
 *
 * @param {Platform} this - bound instance class
 * @param {DataContract} dataContract - contract
 * @param identity - identity
 * @return {DataContractUpdateTransition}
 */
async function update(dataContract, identity) {
    this.logger.debug(`[DataContract#update] Update data contract ${dataContract.getId()}`);
    await this.initialize();
    const { dpp } = this;
    // Clone contract
    const updatedDataContract = dataContract.clone();
    updatedDataContract.incrementVersion();
    const identityId = identity.getId();
    const dataContractId = dataContract.getId();
    const identityContractNonce = await this.nonceManager
        .bumpIdentityContractNonce(identityId, dataContractId);
    const dataContractUpdateTransition = dpp.dataContract
        .createDataContractUpdateTransition(updatedDataContract, BigInt(identityContractNonce));
    this.logger.silly(`[DataContract#update] Created data contract update transition ${dataContract.getId()}`);
    await signStateTransition_1.signStateTransition(this, dataContractUpdateTransition, identity, 2);
    // Broadcast state transition also wait for the result to be obtained
    await broadcastStateTransition_1.default(this, dataContractUpdateTransition);
    this.logger.silly(`[DataContract#update] Broadcasted data contract update transition ${dataContract.getId()}`);
    // Update app with updated data contract if available
    // eslint-disable-next-line
    for (const appName of this.client.getApps().getNames()) {
        const appDefinition = this.client.getApps().get(appName);
        if (appDefinition.contractId.equals(updatedDataContract.getId()) && appDefinition.contract) {
            appDefinition.contract = updatedDataContract;
        }
    }
    this.logger.debug(`[DataContract#updated] Update data contract ${dataContract.getId()}`);
    return dataContractUpdateTransition;
}
exports.default = update;
//# sourceMappingURL=update.js.map