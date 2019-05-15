import interceptor from 'express-interceptor';
import { renderPage } from './common';

export default payload => interceptor(
    (request, response) => ({
        // Only intercept HTML files
        isInterceptable() {
            return /text\/html/.test(response.get('Content-Type'));
        },
        // Inject <script> tag
        intercept(body, send) {
            send(renderPage(payload, body));
        },
    })
);
