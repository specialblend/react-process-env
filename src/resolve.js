import * as R from 'ramda';

/**
 * Resolve property from `process.env` (`react-scripts`/development), or `window.env` (`express`/production)
 * @param {string} prop name of property to resolve
 * @return {*} value of the resolved property
 */
export const resolveEnv = prop =>
    R.either(
        R.path(['process', 'env', prop]),
        R.path(['window', 'env', prop]),
    )({ process, window: global });
