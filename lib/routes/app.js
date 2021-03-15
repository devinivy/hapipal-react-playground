'use strict';

const Page = require('../public/Page');

module.exports = [{
    method: 'get',
    path: '/',
    options: {
        handler(request, h) {

            const Home = h.hydrate('Home.entry');

            return h.html`
                <${Page} title="Home">
                    <${Home} />
                <//>
            `;
        }
    }
},
{
    method: 'get',
    path: '/about',
    options: {
        handler({ query: { by = 'pal' } }, h) {

            const About = h.hydrate('About.entry');

            return h.html`
                <${Page} title="About">
                    <${About} by=${by} />
                <//>
            `;
        }
    }
}];
