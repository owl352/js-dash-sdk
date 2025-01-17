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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NONCE_FETCH_INTERVAL = void 0;
// 20 min
exports.NONCE_FETCH_INTERVAL = 1200 * 1000;
var NonceManager = /** @class */ (function () {
    function NonceManager(dapiClient) {
        this.dapiClient = dapiClient;
        this.identityNonce = new Map();
        this.identityContractNonce = new Map();
    }
    NonceManager.prototype.setIdentityNonce = function (identityId, nonce) {
        var identityIdStr = identityId.toString();
        var nonceState = this.identityNonce.get(identityIdStr);
        if (!nonceState) {
            this.identityNonce.set(identityIdStr, {
                value: nonce,
                lastFetchedAt: Date.now(),
            });
        }
        else {
            nonceState.value = nonce;
        }
    };
    NonceManager.prototype.getIdentityNonce = function (identityId) {
        return __awaiter(this, void 0, void 0, function () {
            var identityIdStr, nonceState, identityNonce, now, identityNonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        identityIdStr = identityId.toString();
                        nonceState = this.identityNonce.get(identityIdStr);
                        if (!(typeof nonceState === 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dapiClient.platform.getIdentityNonce(identityId)];
                    case 1:
                        identityNonce = (_a.sent()).identityNonce;
                        if (typeof identityNonce === 'undefined') {
                            throw new Error('Identity nonce is not found');
                        }
                        nonceState = {
                            value: identityNonce,
                            lastFetchedAt: Date.now(),
                        };
                        this.identityNonce.set(identityIdStr, nonceState);
                        return [3 /*break*/, 4];
                    case 2:
                        now = Date.now();
                        if (!(now - nonceState.lastFetchedAt > exports.NONCE_FETCH_INTERVAL)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.dapiClient.platform.getIdentityNonce(identityId)];
                    case 3:
                        identityNonce = (_a.sent()).identityNonce;
                        if (typeof identityNonce === 'undefined') {
                            throw new Error('Identity nonce is not found');
                        }
                        nonceState.value = identityNonce;
                        nonceState.lastFetchedAt = now;
                        _a.label = 4;
                    case 4: return [2 /*return*/, nonceState.value];
                }
            });
        });
    };
    NonceManager.prototype.bumpIdentityNonce = function (identityId) {
        return __awaiter(this, void 0, void 0, function () {
            var nextIdentityNonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getIdentityNonce(identityId)];
                    case 1:
                        nextIdentityNonce = (_a.sent());
                        this.setIdentityNonce(identityId, nextIdentityNonce);
                        return [2 /*return*/, nextIdentityNonce];
                }
            });
        });
    };
    NonceManager.prototype.setIdentityContractNonce = function (identityId, contractId, nonce) {
        var identityIdStr = identityId.toString();
        var contractIdStr = contractId.toString();
        var contractNonce = this.identityContractNonce.get(identityIdStr);
        if (!contractNonce) {
            contractNonce = new Map();
            this.identityContractNonce.set(identityIdStr, contractNonce);
        }
        var nonceState = contractNonce.get(contractIdStr);
        if (!nonceState) {
            contractNonce.set(contractIdStr, {
                value: nonce,
                lastFetchedAt: Date.now(),
            });
        }
        else {
            nonceState.value = nonce;
        }
    };
    NonceManager.prototype.getIdentityContractNonce = function (identityId, contractId) {
        return __awaiter(this, void 0, void 0, function () {
            var identityIdStr, contractIdStr, contractNonce, nonceState, identityContractNonce, now, identityContractNonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        identityIdStr = identityId.toString();
                        contractIdStr = contractId.toString();
                        contractNonce = this.identityContractNonce.get(identityIdStr);
                        if (!contractNonce) {
                            contractNonce = new Map();
                            this.identityContractNonce.set(identityIdStr, contractNonce);
                        }
                        nonceState = contractNonce.get(contractIdStr);
                        if (!(typeof nonceState === 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dapiClient.platform
                                .getIdentityContractNonce(identityId, contractId)];
                    case 1:
                        identityContractNonce = (_a.sent()).identityContractNonce;
                        if (typeof identityContractNonce === 'undefined') {
                            throw new Error('Identity contract nonce is not found');
                        }
                        nonceState = {
                            value: identityContractNonce,
                            lastFetchedAt: Date.now(),
                        };
                        contractNonce.set(contractIdStr, nonceState);
                        return [3 /*break*/, 4];
                    case 2:
                        now = Date.now();
                        if (!(now - nonceState.lastFetchedAt > exports.NONCE_FETCH_INTERVAL)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.dapiClient.platform
                                .getIdentityContractNonce(identityId, contractId)];
                    case 3:
                        identityContractNonce = (_a.sent()).identityContractNonce;
                        if (typeof identityContractNonce === 'undefined') {
                            throw new Error('Identity nonce is not found');
                        }
                        nonceState.value = identityContractNonce;
                        nonceState.lastFetchedAt = now;
                        _a.label = 4;
                    case 4: return [2 /*return*/, nonceState.value];
                }
            });
        });
    };
    NonceManager.prototype.bumpIdentityContractNonce = function (identityId, contractId) {
        return __awaiter(this, void 0, void 0, function () {
            var identityContractNonce, nextIdentityContractNonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getIdentityContractNonce(identityId, contractId)];
                    case 1:
                        identityContractNonce = _a.sent();
                        nextIdentityContractNonce = identityContractNonce + 1n;
                        this.setIdentityContractNonce(identityId, contractId, nextIdentityContractNonce);
                        return [2 /*return*/, nextIdentityContractNonce];
                }
            });
        });
    };
    return NonceManager;
}());
exports.default = NonceManager;
//# sourceMappingURL=NonceManager.js.map