'use strict';

const { html } = require('htm/react');

module.exports = ({ title, children }) => {

    return html`
        <html>
            <head>
                <title>${title}</title>
            </head>
            <body>
                ${children}
            </body>
        </html>
    `;
};
