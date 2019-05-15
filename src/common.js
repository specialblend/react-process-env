import * as R from 'ramda';

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

