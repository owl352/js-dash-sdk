/// <reference types="node" />
import { Identifier, ExtendedDocument } from '@dashevo/wasm-dpp';
/**
 * @param {WhereCondition[]} [where] - where
 * @param {OrderByCondition[]} [orderBy] - order by
 * @param {number} [limit] - limit
 * @param {string|Buffer|ExtendedDocument|Identifier} [startAt] - start value (included)
 * @param {string|Buffer|ExtendedDocument|Identifier} [startAfter] - start value (not included)
 */
export declare type QueryOptions = {
    where?: WhereCondition[];
    orderBy?: OrderByCondition[];
    limit?: number;
    startAt?: string | Buffer | ExtendedDocument | Identifier;
    startAfter?: string | Buffer | ExtendedDocument | Identifier;
};
export declare type OrderByCondition = [string, 'asc' | 'desc'];
export declare type WhereCondition = [string, '<' | '<=' | '==' | '>' | '>=' | 'in' | 'startsWith' | 'elementMatch' | 'length' | 'contains', WhereCondition | any];
