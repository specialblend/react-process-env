import * as R from 'ramda';

/**
 * Resolve property from `process.env` (`react-scripts`/development), or `window.env` (`express`/production)
 * @param {string} prop name of property to resolve
 * @param {object} processEnv process.env
 * @param {object} window global/window
 * @return {*} value of the resolved property
 */
export const resolveEnv = (prop, processEnv = process.env, window = global) =>
    R.prop(prop, processEnv) || R.path(['env', prop], window) || null;
