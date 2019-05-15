import * as R from 'ramda';

/**
 * Resolve property from `window.env` (`express`/production), or fallback to `process.env` (`react-scripts`/development)
 * @param {string} prop name of property to resolve
 * @return {*} value of the resolved property
 */
export const resolveEnv = prop =>
    R.either(
        R.path(['window', 'env', prop]),
        R.path(['process', 'env', prop]),
    )({ process, window: global });
