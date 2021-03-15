'use strict';

const { default: styled } = require('styled-components');
const { useState } = require('react');
const { html } = require('htm/react');

const internals = {};

module.exports = ({ by = 'pal' }) => {

    const [count, setCount] = useState(1);
    const addOne = (x) => x + 1;

    const { Header } = internals;

    return html`
        <div>
            <a href="/">Back Home</a>
            <${Header} odd=${!!(count % 2)}>About<//>
            <p>
                you could be in a <button onClick=${() => setCount(addOne)}>worse</button> place
                <br />
                ${count}
                <br />
                <sub>by ${by}</sub>
            </p>
        </div>
    `;
};

internals.Header = styled.h1`
    background-color: ${({ odd }) => (odd && 'pink') || 'green'};
`;
