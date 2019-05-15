import { renderPage } from './common';

export default (payload, resolver) =>
    async(req, res) => {
        const body = await resolver();
        return res.send(renderPage(payload, body));
    };
