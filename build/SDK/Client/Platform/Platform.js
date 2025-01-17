"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Platform = void 0;
var wasm_dpp_1 = __importStar(require("@dashevo/wasm-dpp"));
var crypto_1 = __importDefault(require("crypto"));
var createAssetLockTransaction_1 = __importDefault(require("./createAssetLockTransaction"));
var broadcast_1 = __importDefault(require("./methods/documents/broadcast"));
var create_1 = __importDefault(require("./methods/documents/create"));
var get_1 = __importDefault(require("./methods/documents/get"));
var publish_1 = __importDefault(require("./methods/contracts/publish"));
var update_1 = __importDefault(require("./methods/contracts/update"));
var create_2 = __importDefault(require("./methods/contracts/create"));
var get_2 = __importDefault(require("./methods/contracts/get"));
var history_1 = __importDefault(require("./methods/contracts/history"));
var get_3 = __importDefault(require("./methods/identities/get"));
var register_1 = __importDefault(require("./methods/identities/register"));
var topUp_1 = __importDefault(require("./methods/identities/topUp"));
var creditTransfer_1 = __importDefault(require("./methods/identities/creditTransfer"));
var creditWithdrawal_1 = __importDefault(require("./methods/identities/creditWithdrawal"));
var update_2 = __importDefault(require("./methods/identities/update"));
var createIdentityCreateTransition_1 = __importDefault(require("./methods/identities/internal/createIdentityCreateTransition"));
var createIdentityTopUpTransition_1 = __importDefault(require("./methods/identities/internal/createIdentityTopUpTransition"));
var createAssetLockProof_1 = __importDefault(require("./methods/identities/internal/createAssetLockProof"));
var waitForCoreChainLockedHeight_1 = __importDefault(require("./methods/identities/internal/waitForCoreChainLockedHeight"));
var register_2 = __importDefault(require("./methods/names/register"));
var resolve_1 = __importDefault(require("./methods/names/resolve"));
var resolveByRecord_1 = __importDefault(require("./methods/names/resolveByRecord"));
var search_1 = __importDefault(require("./methods/names/search"));
var broadcastStateTransition_1 = __importDefault(require("./broadcastStateTransition"));
var logger_1 = __importDefault(require("../../../logger"));
var Fetcher_1 = __importDefault(require("./Fetcher"));
var NonceManager_1 = __importDefault(require("./NonceManager/NonceManager"));
/**
 * Class for Dash Platform
 *
 * @param documents - documents
 * @param identities - identities
 * @param names - names
 * @param contracts - contracts
 */
var Platform = /** @class */ (function () {
    /**
       * Construct some instance of Platform
       *
       * @param {PlatformOpts} options - options for Platform
       */
    function Platform(options) {
        this.documents = {
            broadcast: broadcast_1.default.bind(this),
            create: create_1.default.bind(this),
            get: get_1.default.bind(this),
        };
        this.contracts = {
            publish: publish_1.default.bind(this),
            update: update_1.default.bind(this),
            create: create_2.default.bind(this),
            get: get_2.default.bind(this),
            history: history_1.default.bind(this),
        };
        this.names = {
            register: register_2.default.bind(this),
            resolve: resolve_1.default.bind(this),
            resolveByRecord: resolveByRecord_1.default.bind(this),
            search: search_1.default.bind(this),
        };
        this.identities = {
            register: register_1.default.bind(this),
            get: get_3.default.bind(this),
            topUp: topUp_1.default.bind(this),
            creditTransfer: creditTransfer_1.default.bind(this),
            update: update_2.default.bind(this),
            withdrawCredits: creditWithdrawal_1.default.bind(this),
            utils: {
                createAssetLockProof: createAssetLockProof_1.default.bind(this),
                createAssetLockTransaction: createAssetLockTransaction_1.default.bind(this),
                createIdentityCreateTransition: createIdentityCreateTransition_1.default.bind(this),
                createIdentityTopUpTransition: createIdentityTopUpTransition_1.default.bind(this),
                waitForCoreChainLockedHeight: waitForCoreChainLockedHeight_1.default.bind(this),
            },
        };
        this.client = options.client;
        var walletId = this.client.wallet ? this.client.wallet.walletId : 'noid';
        this.logger = logger_1.default.getForId(walletId);
        // use protocol version from options if set
        if (options.driveProtocolVersion !== undefined) {
            this.protocolVersion = options.driveProtocolVersion;
        }
        this.fetcher = new Fetcher_1.default(this.client.getDAPIClient());
        this.nonceManager = new NonceManager_1.default(this.client.getDAPIClient());
    }
    /**
       * Broadcasts state transition
       * @param {Object} stateTransition
       */
    Platform.prototype.broadcastStateTransition = function (stateTransition) {
        return broadcastStateTransition_1.default(this, stateTransition);
    };
    Platform.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mappedProtocolVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.dpp) return [3 /*break*/, 2];
                        return [4 /*yield*/, Platform.initializeDppModule()];
                    case 1:
                        _a.sent();
                        if (this.protocolVersion === undefined) {
                            mappedProtocolVersion = Platform.networkToProtocolVersion.get(this.client.network);
                            this.protocolVersion = mappedProtocolVersion !== undefined
                                ? mappedProtocolVersion : wasm_dpp_1.getLatestProtocolVersion();
                        }
                        // eslint-disable-next-line
                        this.dpp = new wasm_dpp_1.DashPlatformProtocol({
                            generate: function () { return crypto_1.default.randomBytes(32); },
                        }, this.protocolVersion);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // Explicitly provide DPPModule as return type.
    // If we don't do it, typescript behaves weird and in compiled Platform.d.ts
    // this code looks like this.
    //
    // ```
    // static initializeDppModule(): Promise<typeof import("@dashevo/wasm-dppdist/dpp")>;
    // ```
    //
    // Slash is missing before `dist` and TS compilation in consumers is breaking
    Platform.initializeDppModule = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, wasm_dpp_1.default()];
            });
        });
    };
    Platform.networkToProtocolVersion = new Map([
        ['testnet', 1],
    ]);
    return Platform;
}());
exports.Platform = Platform;
//# sourceMappingURL=Platform.js.map