import * as R from 'ramda';

export const prependString = R.flip(R.concat);

/**
 * Encode payload into base64
 * @param {Object} payload: payload
 * @return {string}: base64 payload
 */
export const toBase64 = payload => Buffer.from(payload).toString('base64');

/**
 * Decode payload from base64 to ascii
 * @param {Object} payload: payload
 * @return {string}: ascii payload
 */
export const fromBase64 = payload => Buffer.from(payload, 'base64').toString('ascii');

/**
 * Stringify and encode payload into base64
 * @param {Object} payload: payload
 * @return {string}: encoded payload
 */
export const encodeData = payload => toBase64(JSON.stringify(payload));

/**
 * Decode and parse payload from base64
 * @param {Object} payload: payload
 * @return {string}: decoded payload
 */
export const decodeData = payload => JSON.parse(fromBase64(payload));

/**
 * Returns true is payload is process.env
 * @param {Object} payload: payload
 * @return {boolean}: check
 */
export const isProcessEnv = payload => payload === process.env;

/**
 * Returns true if object has non-string values
 */
export const hasNonScalarValues = R.complement(R.compose(R.all(R.is(String)), R.valuesIn));
