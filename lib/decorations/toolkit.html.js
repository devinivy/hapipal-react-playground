'use strict';

const React = require('react');
const Trumpet = require('trumpet');
const Stream = require('stream');
const ReactDOM = require('react-dom/server');
const { html } = require('htm/react');

module.exports = {
    method(...args) {

        const tr = Trumpet();
        const el = html(...args);
        const ignore = () => null;
        const passthrough = new Stream.PassThrough();

        // Render static page with <content /> placeholder
        const pageWithContent = Stream.pipeline(
            ReactDOM.renderToStaticNodeStream(
                React.cloneElement(el, {}, html`<content />`)
            ),
            tr,
            passthrough,
            ignore
        );


        // Replace <content /> placeholder with hydratable page contents
        Stream.pipeline(
            ReactDOM.renderToNodeStream(el.props.children),
            tr.createWriteStream('content', { outer: true }),
            ignore
        );

        passthrough.write('<!DOCTYPE html>');
        return this.response(pageWithContent).type('text/html');
    }
};
