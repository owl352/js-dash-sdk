"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const events_1 = require("events");
const wallet_lib_1 = require("@dashevo/wallet-lib");
const DAPIClientTransport_1 = __importDefault(require("@dashevo/wallet-lib/src/transport/DAPIClientTransport/DAPIClientTransport"));
const dapi_client_1 = __importDefault(require("@dashevo/dapi-client"));
const systemIds_1 = require("@dashevo/dpns-contract/lib/systemIds");
const systemIds_2 = require("@dashevo/dashpay-contract/lib/systemIds");
const systemIds_3 = require("@dashevo/masternode-reward-shares-contract/lib/systemIds");
const systemIds_4 = require("@dashevo/withdrawals-contract/lib/systemIds");
const Platform_1 = require("./Platform");
const ClientApps_1 = require("./ClientApps");
/**
 * Client class that wraps all components together
 * to allow integrated payments on both the Dash Network (layer 1)
 * and the Dash Platform (layer 2).
 */
class Client extends events_1.EventEmitter {
    /**
       * Construct some instance of SDK Client
       *
       * @param {ClientOpts} [options] - options for SDK Client
       */
    constructor(options = {}) {
        super();
        this.network = 'mainnet';
        this.defaultAccountIndex = 0;
        this.options = options;
        this.network = this.options.network ? this.options.network.toString() : 'mainnet';
        // Initialize DAPI Client
        const dapiClientOptions = {
            network: this.network,
            loggerOptions: {
                identifier: '',
            },
        };
        [
            'dapiAddressProvider',
            'dapiAddresses',
            'seeds',
            'timeout',
            'retries',
            'baseBanTime',
            'blockHeadersProviderOptions',
            'blockHeadersProvider',
        ].forEach((optionName) => {
            // eslint-disable-next-line
            if (this.options.hasOwnProperty(optionName)) {
                dapiClientOptions[optionName] = this.options[optionName];
            }
        });
        // Initialize a wallet if `wallet` option is preset
        if (this.options.wallet !== undefined) {
            if (this.options.wallet.network !== undefined
                && this.options.wallet.network !== this.network) {
                throw new Error('Wallet and Client networks are different');
            }
            this.wallet = new wallet_lib_1.Wallet({
                transport: null,
                network: this.network,
                ...this.options.wallet,
            });
            // @ts-ignore
            this.wallet.on('error', (error, context) => (this.emit('error', error, { wallet: context })));
        }
        dapiClientOptions.loggerOptions.identifier = this.wallet ? this.wallet.walletId : 'noid';
        this.dapiClient = new dapi_client_1.default(dapiClientOptions);
        if (this.wallet) {
            this.wallet.transport = new DAPIClientTransport_1.default(this.dapiClient);
        }
        this.defaultAccountIndex = this.options.wallet?.defaultAccountIndex || 0;
        this.apps = new ClientApps_1.ClientApps({
            dpns: {
                contractId: systemIds_1.contractId,
            },
            dashpay: {
                contractId: systemIds_2.contractId,
            },
            masternodeRewardShares: {
                contractId: systemIds_3.contractId,
            },
            withdrawals: {
                contractId: systemIds_4.contractId,
            },
            ...this.options.apps,
        });
        this.platform = new Platform_1.Platform({
            client: this,
            network: this.network,
            driveProtocolVersion: this.options.driveProtocolVersion,
        });
    }
    /**
       * Get Wallet account
       *
       * @param {Account.Options} [options]
       * @returns {Promise<Account>}
       */
    async getWalletAccount(options = {}) {
        if (!this.wallet) {
            throw new Error('Wallet is not initialized, pass `wallet` option to Client');
        }
        options = {
            index: this.defaultAccountIndex,
            synchronize: true,
            ...options,
        };
        return this.wallet.getAccount(options);
    }
    /**
       * disconnect wallet from Dapi
       * @returns {void}
       */
    async disconnect() {
        if (this.wallet) {
            await this.wallet.disconnect();
        }
        await this.dapiClient.disconnect();
    }
    /**
       * Get DAPI Client instance
       *
       * @returns {DAPIClient}
       */
    getDAPIClient() {
        return this.dapiClient;
    }
    /**
       * fetch list of applications
       *
       * @remarks
       * check if returned value can be null on devnet
       *
       * @returns {ClientApps} applications list
       */
    getApps() {
        return this.apps;
    }
}
exports.Client = Client;
exports.default = Client;
//# sourceMappingURL=Client.js.map