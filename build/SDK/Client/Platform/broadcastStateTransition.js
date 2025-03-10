"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const StateTransitionBroadcastError_1 = require("../../../errors/StateTransitionBroadcastError");
const ResponseError = require('@dashevo/dapi-client/lib/transport/errors/response/ResponseError');
const InvalidRequestDPPError = require('@dashevo/dapi-client/lib/transport/errors/response/InvalidRequestDPPError');
const createGrpcTransportError = require('@dashevo/dapi-client/lib/transport/GrpcTransport/createGrpcTransportError');
const GrpcError = require('@dashevo/grpc-common/lib/server/error/GrpcError');
/**
 * @param {Platform} platform
 * @param {Object} [options]
 * @param {boolean} [options.skipValidation=false]
 *
 * @param stateTransition
 */
async function broadcastStateTransition(platform, stateTransition, 
// TODO: restore once validation is done?
// eslint-disable-next-line
options = {}) {
    const { client } = platform;
    // TODO(versioning): restore
    // @ts-ignore
    // if (!options.skipValidation) {
    //   const result = await dpp.stateTransition.validateBasic(
    //     stateTransition,
    //     // TODO(v0.24-backport): get rid of this once decided
    //     //  whether we need execution context in wasm bindings
    //     new StateTransitionExecutionContext(),
    //   );
    //
    //   if (!result.isValid()) {
    //     const consensusError = result.getFirstError();
    //
    //     throw new StateTransitionBroadcastError(
    //       consensusError.getCode(),
    //       consensusError.message,
    //       consensusError,
    //     );
    //   }
    // }
    // Subscribing to future result
    const hash = crypto_1.default.createHash('sha256')
        .update(stateTransition.toBuffer())
        .digest();
    const serializedStateTransition = stateTransition.toBuffer();
    try {
        await client.getDAPIClient().platform.broadcastStateTransition(serializedStateTransition);
    }
    catch (error) {
        if (error instanceof ResponseError) {
            let cause = error;
            // Pass DPP consensus error directly to avoid
            // additional wrappers
            if (cause instanceof InvalidRequestDPPError) {
                cause = cause.getConsensusError();
            }
            throw new StateTransitionBroadcastError_1.StateTransitionBroadcastError(cause.getCode(), cause.message, cause);
        }
        throw error;
    }
    // Waiting for result to return
    const stateTransitionResult = await client
        .getDAPIClient().platform.waitForStateTransitionResult(hash, { prove: true });
    const { error } = stateTransitionResult;
    if (error) {
        // Create DAPI response error from gRPC error passed as gRPC response
        const grpcError = new GrpcError(error.code, error.message);
        // It is important to assign metadata to the error object
        // instead of passing it as GrpcError constructor argument
        // Otherwise it will be converted to grpc-js metadata
        // Which is not compatible with web
        grpcError.metadata = error.data;
        let cause = await createGrpcTransportError(grpcError);
        // Pass DPP consensus error directly to avoid
        // additional wrappers
        if (cause instanceof InvalidRequestDPPError) {
            cause = cause.getConsensusError();
        }
        throw new StateTransitionBroadcastError_1.StateTransitionBroadcastError(cause.getCode(), cause.message, cause);
    }
    return stateTransitionResult;
}
exports.default = broadcastStateTransition;
//# sourceMappingURL=broadcastStateTransition.js.map