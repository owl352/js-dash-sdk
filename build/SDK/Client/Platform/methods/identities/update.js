"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
var signStateTransition_1 = require("../../signStateTransition");
var broadcastStateTransition_1 = __importDefault(require("../../broadcastStateTransition"));
/**
 * Update platform identities
 *
 * @param {Platform} this - bound instance class
 * @param {Identity} identity - identity to update
 * @param {{add: IdentityPublicKey[]; disable: IdentityPublicKey[]}} publicKeys - public keys to add
 * @param {Object<string, any>} privateKeys - public keys to add
 *
 * @returns {boolean}
 */
function update(identity, publicKeys, privateKeys) {
    return __awaiter(this, void 0, void 0, function () {
        var dpp, identityNonce, identityUpdateTransition, signerKeyIndex, signerKey_1, starterPromise, updatedPublicKeys_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.logger.debug("[Identity#update] Update identity " + identity.getId().toString(), {
                        addKeys: publicKeys.add ? publicKeys.add.length : 0,
                        disableKeys: publicKeys.disable ? publicKeys.disable.map(function (key) { return key.getId(); }).join(', ') : 'none',
                    });
                    return [4 /*yield*/, this.initialize()];
                case 1:
                    _a.sent();
                    dpp = this.dpp;
                    return [4 /*yield*/, this.nonceManager.bumpIdentityNonce(identity.getId())];
                case 2:
                    identityNonce = _a.sent();
                    identityUpdateTransition = dpp.identity.createIdentityUpdateTransition(identity, BigInt(identityNonce), publicKeys);
                    this.logger.silly('[Identity#update] Created IdentityUpdateTransition');
                    signerKeyIndex = 0;
                    if (!identityUpdateTransition.getPublicKeysToAdd()) return [3 /*break*/, 4];
                    signerKey_1 = identity.getPublicKeys()[signerKeyIndex];
                    starterPromise = Promise.resolve(null);
                    updatedPublicKeys_1 = [];
                    return [4 /*yield*/, identityUpdateTransition.getPublicKeysToAdd().reduce(function (previousPromise, publicKey) { return previousPromise.then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var privateKey;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        privateKey = privateKeys[publicKey.getId()];
                                        if (!privateKey) {
                                            throw new Error("Private key for key " + publicKey.getId() + " not found");
                                        }
                                        identityUpdateTransition.setSignaturePublicKeyId(signerKey_1.getId());
                                        return [4 /*yield*/, identityUpdateTransition.signByPrivateKey(privateKey.toBuffer(), publicKey.getType())];
                                    case 1:
                                        _a.sent();
                                        publicKey.setSignature(identityUpdateTransition.getSignature());
                                        updatedPublicKeys_1.push(publicKey);
                                        identityUpdateTransition.setSignature(undefined);
                                        identityUpdateTransition.setSignaturePublicKeyId(undefined);
                                        return [2 /*return*/];
                                }
                            });
                        }); }); }, starterPromise)];
                case 3:
                    _a.sent();
                    // Update public keys in transition to include signatures
                    identityUpdateTransition.setPublicKeysToAdd(updatedPublicKeys_1);
                    _a.label = 4;
                case 4: return [4 /*yield*/, signStateTransition_1.signStateTransition(this, identityUpdateTransition, identity, signerKeyIndex)];
                case 5:
                    _a.sent();
                    this.logger.silly('[Identity#update] Signed IdentityUpdateTransition');
                    // TODO(versioning): restore
                    // @ts-ignore
                    // const result = await dpp.stateTransition.validateBasic(
                    //   identityUpdateTransition,
                    //   // TODO(v0.24-backport): get rid of this once decided
                    //   //  whether we need execution context in wasm bindings
                    //   new StateTransitionExecutionContext(),
                    // );
                    // if (!result.isValid()) {
                    //   const messages = result.getErrors().map((error) => error.message);
                    //   throw new Error(`StateTransition is invalid - ${JSON.stringify(messages)}`);
                    // }
                    this.logger.silly('[Identity#update] Validated IdentityUpdateTransition');
                    // Skipping validation because it's already done above
                    return [4 /*yield*/, broadcastStateTransition_1.default(this, identityUpdateTransition, {
                            skipValidation: true,
                        })];
                case 6:
                    // Skipping validation because it's already done above
                    _a.sent();
                    this.logger.silly('[Identity#update] Broadcasted IdentityUpdateTransition');
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.update = update;
exports.default = update;
//# sourceMappingURL=update.js.map