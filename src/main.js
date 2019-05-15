import { renderPage } from './common';

export default (payload, resolver = null) =>
    async(req, res, next) => {
        if (resolver) {
            const body = await resolver();
            res.send(renderPage(payload, body));
            return;
        }
        if (res.body) {
            res.body = renderPage(payload, res.body);
        }
        next();
    };
