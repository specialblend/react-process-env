import * as R from 'ramda';

/**
 * Resolve property from `process.env` (`react-scripts`/development), or `window.env` (`express`/production)
 * @param {string} prop name of property to resolve
 * @param {object} window global/window
 * @param {object} processEnv process.env
 * @return {*} value of the resolved property
 */
export const resolveEnv = (prop, window = global, processEnv = process.env) =>
    R.prop(prop, processEnv) || R.path(['env', prop], window) || null;
