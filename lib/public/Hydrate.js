'use strict';

const Path = require('path');
const Jsesc = require('jsesc');
const { html } = require('htm/react');

module.exports = ({ src, ...props }) => {

    const absolute = require.resolve(src, { paths: [__dirname] });
    const Component = require(absolute);

    return html`
        <div id="app"><${Component} ...${props} /></div>
        <script dangerouslySetInnerHTML=${{ __html: `window.__INITIAL_DATA__ = ${Jsesc(props, { json: true, isScriptContext: true })};` }}></script>
        <script src=${Path.join('/build', Path.relative(__dirname, absolute))}></script>
    `;
};
