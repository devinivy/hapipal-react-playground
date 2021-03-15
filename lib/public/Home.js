'use strict';

const { default: styled } = require('styled-components');
const { html } = require('htm/react');

const internals = {};

module.exports = () => {

    return html`
        <div>
            <h1>Welcome!</h1>
            <a href="/about">About</a>
        </div>
    `;
};
