export const toBase64 = data => Buffer.from(data).toString('base64');
export const fromBase64 = data => Buffer.from(data, 'base64').toString('ascii');
export const encodeData = data => toBase64(JSON.stringify(data));
export const decodeData = data => JSON.parse(fromBase64(data));
