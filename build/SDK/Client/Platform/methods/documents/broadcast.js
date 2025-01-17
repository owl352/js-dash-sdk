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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var broadcastStateTransition_1 = __importDefault(require("../../broadcastStateTransition"));
var signStateTransition_1 = require("../../signStateTransition");
/**
 * Broadcast document onto the platform
 *
 * @param {Platform} this - bound instance class
 * @param {Object} documents
 * @param {ExtendedDocument[]} [documents.create]
 * @param {ExtendedDocument[]} [documents.replace]
 * @param {ExtendedDocument[]} [documents.delete]
 * @param identity - identity
 */
function broadcast(documents, identity) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function () {
        var dpp, identityId, dataContractId, identityContractNonce, documentsBatchTransition;
        var _h, _j;
        var _this = this;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    this.logger.debug('[Document#broadcast] Broadcast documents', {
                        create: ((_a = documents.create) === null || _a === void 0 ? void 0 : _a.length) || 0,
                        replace: ((_b = documents.replace) === null || _b === void 0 ? void 0 : _b.length) || 0,
                        delete: ((_c = documents.delete) === null || _c === void 0 ? void 0 : _c.length) || 0,
                    });
                    return [4 /*yield*/, this.initialize()];
                case 1:
                    _k.sent();
                    dpp = this.dpp;
                    identityId = identity.getId();
                    dataContractId = (_d = __spreadArrays((documents.create || []), (documents.replace || []), (documents.delete || []))[0]) === null || _d === void 0 ? void 0 : _d.getDataContractId();
                    if (!dataContractId) {
                        throw new Error('Data contract ID is not found');
                    }
                    return [4 /*yield*/, this.nonceManager
                            .bumpIdentityContractNonce(identityId, dataContractId)];
                case 2:
                    identityContractNonce = _k.sent();
                    documentsBatchTransition = dpp.document.createStateTransition(documents, (_h = {},
                        _h[identityId.toString()] = (_j = {},
                            _j[dataContractId.toString()] = identityContractNonce,
                            _j),
                        _h));
                    this.logger.silly('[Document#broadcast] Created documents batch transition');
                    return [4 /*yield*/, signStateTransition_1.signStateTransition(this, documentsBatchTransition, identity, 1)];
                case 3:
                    _k.sent();
                    // Broadcast state transition also wait for the result to be obtained
                    return [4 /*yield*/, broadcastStateTransition_1.default(this, documentsBatchTransition)];
                case 4:
                    // Broadcast state transition also wait for the result to be obtained
                    _k.sent();
                    // Acknowledge documents identifiers to handle retry attempts to mitigate
                    // state transition propagation lag
                    if (documents.create) {
                        documents.create.forEach(function (document) {
                            var documentLocator = document.getDataContractId().toString() + "/" + document.getType();
                            _this.fetcher.acknowledgeKey(documentLocator);
                        });
                    }
                    // Forget documents identifiers to not retry on them anymore
                    if (documents.delete) {
                        documents.delete.forEach(function (document) {
                            var documentLocator = document.getDataContractId().toString() + "/" + document.getType();
                            _this.fetcher.forgetKey(documentLocator);
                        });
                    }
                    this.logger.debug('[Document#broadcast] Broadcasted documents', {
                        create: ((_e = documents.create) === null || _e === void 0 ? void 0 : _e.length) || 0,
                        replace: ((_f = documents.replace) === null || _f === void 0 ? void 0 : _f.length) || 0,
                        delete: ((_g = documents.delete) === null || _g === void 0 ? void 0 : _g.length) || 0,
                    });
                    return [2 /*return*/, documentsBatchTransition];
            }
        });
    });
}
exports.default = broadcast;
//# sourceMappingURL=broadcast.js.map