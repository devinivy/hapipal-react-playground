'use strict';

const ReactDOM = require('react-dom');
const { html } = require('htm/react');
const App = require('./App');

module.exports = App;

if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-undef
    ReactDOM.hydrate(html`<${App} ...${window.__INITIAL_DATA__} />`, document.getElementById('app'));
}
