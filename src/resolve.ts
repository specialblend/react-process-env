import { path, prop } from 'ramda';

/**
 * Resolve property from `process.env` (`react-scripts`/development), or `window.env` (`express`/production)
 * @param {string} property name of property to resolve
 * @param {object} processEnv process.env
 * @param {object} window global/window
 * @return {*} value of the resolved property
 */
export default function resolve(property: string, processEnv = process.env, window = global): any {
    return prop(property, processEnv) || path(['env', property], window) || null;
}
