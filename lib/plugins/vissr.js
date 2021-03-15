'use strict';

const ReactDOM = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');

module.exports = {
    plugins: [{
        plugin: require('../../vissr'),
        options: {
            watch: false,
            entryPoints: ['Home.entry.js', 'About.entry.js'],
            renderToNodeStream: (el) => {

                const sheet = new ServerStyleSheet();

                return sheet.interleaveWithNodeStream(
                    ReactDOM.renderToNodeStream(sheet.collectStyles(el))
                );
            }
        }
    }]
};
