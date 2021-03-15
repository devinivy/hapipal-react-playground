'use strict';

const ReactDOM = require('react-dom');
const { html } = require('htm/react');
const Home = require('./Home');

module.exports = Home;

if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-undef
    ReactDOM.hydrate(html`<${Home} ...${window.__INITIAL_DATA__} />`, document.getElementById('app'));
}
