'use strict';

const Page = require('../public/Page');
const Hydrate = require('../public/Hydrate');

module.exports = {
    method: 'get',
    path: '/',
    options: {
        handler({ query }, h) {

            return h.html`
                <${Page} title=${`One app by ${query.by || 'devin'}`}>
                    <${Hydrate} src="./App.entry" by=${query.by || 'devin'} />
                <//>
            `;
        }
    }
};
