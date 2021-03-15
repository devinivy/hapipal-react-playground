'use strict';

const ReactDOM = require('react-dom');
const { html } = require('htm/react');
const About = require('./About');

module.exports = About;

if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-undef
    ReactDOM.hydrate(html`<${About} ...${window.__INITIAL_DATA__} />`, document.getElementById('app'));
}
