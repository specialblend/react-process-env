import * as R from 'ramda';

/**
 * Resolve property from `process.env` (`react-scripts`/development), or `window.env` (`express`/production)
 * @param {string} prop name of property to resolve
 * @param {object} context an object containing process and window globals
 * @return {*} value of the resolved property
 */
export const resolveEnv = (prop, context = { process, window: global }) =>
    R.either(
        R.path(['process', 'env', prop]),
        R.path(['window', 'env', prop]),
    )(context);
