import { DashPlatformProtocol } from '@dashevo/wasm-dpp';
import type { DPPModule } from '@dashevo/wasm-dpp';
import Client from '../Client';
import { IStateTransitionResult } from './IStateTransitionResult';
import { ConfigurableLogger } from '../../../logger';
import Fetcher from './Fetcher';
import NonceManager from './NonceManager/NonceManager';
/**
 * Interface for PlatformOpts
 *
 * @remarks
 * required parameters include { client, apps }
 */
export interface PlatformOpts {
    client: Client;
    network: string;
    driveProtocolVersion?: number;
}
/**
 * @param {Function} broadcast - broadcast records onto the platform
 * @param {Function} create - create records which can be broadcasted
 * @param {Function} get - get records from the platform
 */
interface Records {
    broadcast: Function;
    create: Function;
    get: Function;
}
/**
 * @param {Function} register - register a domain
 * @param {Function} resolve - resolve domain by a name
 * @param {Function} resolveByRecord - resolve domain by it's record
 * @param {Function} search - search domain
 */
interface DomainNames {
    register: Function;
    resolve: Function;
    resolveByRecord: Function;
    search: Function;
}
interface Identities {
    get: Function;
    register: Function;
    topUp: Function;
    creditTransfer: Function;
    withdrawCredits: Function;
    update: Function;
    utils: {
        createAssetLockTransaction: Function;
        createAssetLockProof: Function;
        createIdentityCreateTransition: Function;
        createIdentityTopUpTransition: Function;
        waitForCoreChainLockedHeight: Function;
    };
}
interface DataContracts {
    update: Function;
    publish: Function;
    create: Function;
    get: Function;
    history: Function;
}
/**
 * Class for Dash Platform
 *
 * @param documents - documents
 * @param identities - identities
 * @param names - names
 * @param contracts - contracts
 */
export declare class Platform {
    dpp: DashPlatformProtocol;
    protocolVersion?: number;
    documents: Records;
    /**
       * @param {Function} get - get identities from the platform
       * @param {Function} register - register identities on the platform
       */
    identities: Identities;
    /**
       * @param {Function} get - get names from the platform
       * @param {Function} register - register names on the platform
       */
    names: DomainNames;
    /**
       * @param {Function} get - get contracts from the platform
       * @param {Function} create - create contracts which can be broadcasted
       * @param {Function} register - register contracts on the platform
       */
    contracts: DataContracts;
    logger: ConfigurableLogger;
    /**
       * Broadcasts state transition
       * @param {Object} stateTransition
       */
    broadcastStateTransition(stateTransition: any): Promise<IStateTransitionResult | void>;
    client: Client;
    private static readonly networkToProtocolVersion;
    protected fetcher: Fetcher;
    nonceManager: NonceManager;
    /**
       * Construct some instance of Platform
       *
       * @param {PlatformOpts} options - options for Platform
       */
    constructor(options: PlatformOpts);
    initialize(): Promise<void>;
    static initializeDppModule(): Promise<DPPModule>;
}
export {};
