/* eslint-disable consistent-return */

/**
 * Resolve property from `process.env` (`react-scripts`/development), or `window.env` (`express`/production)
 * @param {string} prop name of property to resolve
 * @param {object} context an object containing process and window globals
 * @return {*} value of the resolved property
 */
export const resolveEnv = (prop, context = { process, window: global }) => {
    if (context.process) {
        const processValue = context.process.env[prop];
        if (processValue) {
            return processValue;
        }
    }
    if (context.window) {
        if (context.window.env) {
            const windowValue = context.window.env[prop];
            if (windowValue) {
                return windowValue;
            }
        }
    }
};
