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
exports.get = void 0;
var wasm_dpp_1 = require("@dashevo/wasm-dpp");
var NotFoundError_1 = __importDefault(require("@dashevo/dapi-client/lib/transport/GrpcTransport/errors/NotFoundError"));
/**
 * Prefetch contract
 *
 * @param {Platform} this bound instance class
 * @param {string} appName of the contract to fetch
 */
var ensureAppContractFetched = function (appName) {
    return __awaiter(this, void 0, void 0, function () {
        var appDefinition;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!this.client.getApps().has(appName)) return [3 /*break*/, 2];
                    appDefinition = this.client.getApps().get(appName);
                    if (!!appDefinition.contract) return [3 /*break*/, 2];
                    return [4 /*yield*/, this.contracts.get(appDefinition.contractId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
};
/**
 * Convert where condition identifier properties
 *
 * @param {WhereCondition} whereCondition
 * @param {Object} binaryProperties
 * @param {null|string} [parentProperty=null]
 *
 * @return {WhereCondition}
 */
function convertIdentifierProperties(whereCondition, binaryProperties, parentProperty) {
    if (parentProperty === void 0) { parentProperty = null; }
    var propertyName = whereCondition[0], operator = whereCondition[1], propertyValue = whereCondition[2];
    var fullPropertyName = parentProperty ? parentProperty + "." + propertyName : propertyName;
    if (operator === 'elementMatch') {
        return [
            propertyName,
            operator,
            convertIdentifierProperties(propertyValue, binaryProperties, fullPropertyName),
        ];
    }
    var convertedPropertyValue = propertyValue;
    var property = binaryProperties[fullPropertyName];
    var isPropertyIdentifier = property && property.contentMediaType === wasm_dpp_1.Identifier.MEDIA_TYPE;
    var isSystemIdentifier = ['$id', '$ownerId'].includes(propertyName);
    if (isSystemIdentifier || isPropertyIdentifier) {
        if (Array.isArray(propertyValue)) {
            convertedPropertyValue = propertyValue.map(function (id) { return wasm_dpp_1.Identifier.from(id); });
        }
        else if (typeof propertyValue === 'string') {
            convertedPropertyValue = wasm_dpp_1.Identifier.from(propertyValue);
        }
    }
    return [propertyName, operator, convertedPropertyValue];
}
/**
 * Get documents from the platform
 *
 * @param {Platform} this bound instance class
 * @param {string} typeLocator type locator
 * @param {QueryOptions} opts - MongoDB style query
 * @returns documents
 */
function get(typeLocator, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, appName, fieldType, appDefinition, binaryProperties_1, documentsResponse, e_1, rawDocuments, result;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    this.logger.debug("[Documents#get] Get document(s) for \"" + typeLocator + "\"");
                    if (!typeLocator.includes('.'))
                        throw new Error('Accessing to field is done using format: appName.fieldName');
                    return [4 /*yield*/, this.initialize()];
                case 1:
                    _b.sent();
                    _a = typeLocator.split('.'), appName = _a[0], fieldType = _a[1];
                    // FIXME: we may later want a hashmap of schemas and contract IDs
                    if (!this.client.getApps().has(appName)) {
                        throw new Error("No app named " + appName + " specified.");
                    }
                    appDefinition = this.client.getApps().get(appName);
                    if (!appDefinition.contractId) {
                        throw new Error("Missing contract ID for " + appName);
                    }
                    // If not present, will fetch contract based on appName and contractId store in this.apps.
                    return [4 /*yield*/, ensureAppContractFetched.call(this, appName)];
                case 2:
                    // If not present, will fetch contract based on appName and contractId store in this.apps.
                    _b.sent();
                    this.logger.silly("[Documents#get] Ensured app contract is fetched \"" + typeLocator + "\"");
                    if (opts.where) {
                        binaryProperties_1 = appDefinition.contract.getBinaryProperties(fieldType);
                        opts.where = opts.where
                            .map(function (whereCondition) { return convertIdentifierProperties(whereCondition, binaryProperties_1); });
                    }
                    if (opts.startAt instanceof wasm_dpp_1.ExtendedDocument) {
                        opts.startAt = opts.startAt.getId();
                    }
                    else if (typeof opts.startAt === 'string') {
                        opts.startAt = wasm_dpp_1.Identifier.from(opts.startAt);
                    }
                    if (opts.startAfter instanceof wasm_dpp_1.ExtendedDocument) {
                        opts.startAfter = opts.startAfter.getId();
                    }
                    else if (typeof opts.startAfter === 'string') {
                        opts.startAfter = wasm_dpp_1.Identifier.from(opts.startAfter);
                    }
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, this.client.getDAPIClient().platform.getDocuments(appDefinition.contractId, fieldType, opts)];
                case 4:
                    documentsResponse = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _b.sent();
                    // TODO: NotFoundError is returing only in case if contract or document type is not found?
                    //  If contract or document type is invalid we should throw an error
                    if (e_1 instanceof NotFoundError_1.default) {
                        this.logger.debug("[Documents#get] Obtained 0 documents for \"" + typeLocator + "\"");
                        return [2 /*return*/, []];
                    }
                    throw e_1;
                case 6:
                    rawDocuments = documentsResponse.getDocuments();
                    return [4 /*yield*/, Promise.all(rawDocuments.map(function (rawDocument) { return __awaiter(_this, void 0, void 0, function () {
                            var document, metadata, responseMetadata;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.dpp.document
                                            .createExtendedDocumentFromDocumentBuffer(rawDocument, fieldType, appDefinition.contract)];
                                    case 1:
                                        document = _a.sent();
                                        responseMetadata = documentsResponse.getMetadata();
                                        if (responseMetadata) {
                                            metadata = new wasm_dpp_1.Metadata({
                                                blockHeight: responseMetadata.getHeight(),
                                                coreChainLockedHeight: responseMetadata.getCoreChainLockedHeight(),
                                                timeMs: responseMetadata.getTimeMs(),
                                                protocolVersion: responseMetadata.getProtocolVersion(),
                                            });
                                        }
                                        document.setMetadata(metadata);
                                        return [2 /*return*/, document];
                                }
                            });
                        }); }))];
                case 7:
                    result = _b.sent();
                    this.logger.debug("[Documents#get] Obtained " + result.length + " document(s) for \"" + typeLocator + "\"");
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.get = get;
exports.default = get;
//# sourceMappingURL=get.js.map