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
exports.register = void 0;
var wasm_dpp_1 = require("@dashevo/wasm-dpp");
var convertToHomographSafeChars_1 = __importDefault(require("../../../../../utils/convertToHomographSafeChars"));
var crypto = require('crypto');
var hash = require('@dashevo/wasm-dpp/lib/utils/hash').hash;
/**
 * Register names to the platform
 *
 * @param {Platform} this - bound instance class
 * @param {string} name - name
 * @param {Object} records - records object having only one of the following items
 * @param {string} [records.identity]
 * @param identity - identity
 *
 * @returns registered domain document
 */
function register(name, records, identity) {
    return __awaiter(this, void 0, void 0, function () {
        var nameLabels, parentDomainName, normalizedParentDomainName, label, normalizedLabel, preorderSalt, isSecondLevelDomain, fullDomainName, saltedDomainHash, preorderDocument, domainDocument;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.initialize()];
                case 1:
                    _a.sent();
                    if (records.identity) {
                        records.identity = wasm_dpp_1.Identifier.from(records.identity);
                    }
                    nameLabels = name.split('.');
                    parentDomainName = nameLabels
                        .slice(1)
                        .join('.');
                    normalizedParentDomainName = convertToHomographSafeChars_1.default(parentDomainName);
                    label = nameLabels[0];
                    normalizedLabel = convertToHomographSafeChars_1.default(label);
                    preorderSalt = crypto.randomBytes(32);
                    isSecondLevelDomain = normalizedParentDomainName.length > 0;
                    fullDomainName = isSecondLevelDomain
                        ? normalizedLabel + "." + normalizedParentDomainName
                        : normalizedLabel;
                    saltedDomainHash = hash(Buffer.concat([
                        preorderSalt,
                        Buffer.from(fullDomainName),
                    ]));
                    if (!this.client.getApps().has('dpns')) {
                        throw new Error('DPNS is required to register a new name.');
                    }
                    return [4 /*yield*/, this.documents.create('dpns.preorder', identity, {
                            saltedDomainHash: saltedDomainHash,
                        })];
                case 2:
                    preorderDocument = _a.sent();
                    return [4 /*yield*/, this.documents.broadcast({
                            create: [preorderDocument],
                        }, identity)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.documents.create('dpns.domain', identity, {
                            label: label,
                            normalizedLabel: normalizedLabel,
                            parentDomainName: parentDomainName,
                            normalizedParentDomainName: normalizedParentDomainName,
                            preorderSalt: preorderSalt,
                            records: records,
                            subdomainRules: {
                                allowSubdomains: !isSecondLevelDomain,
                            },
                        })];
                case 4:
                    domainDocument = _a.sent();
                    // 4. Create and send domain state transition
                    return [4 /*yield*/, this.documents.broadcast({
                            create: [domainDocument],
                        }, identity)];
                case 5:
                    // 4. Create and send domain state transition
                    _a.sent();
                    return [2 /*return*/, domainDocument];
            }
        });
    });
}
exports.register = register;
exports.default = register;
//# sourceMappingURL=register.js.map