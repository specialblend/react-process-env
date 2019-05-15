import { renderPage } from './common';

export default payload =>
    (req, res) => {
        res.send(renderPage(payload, res.body));
    };
