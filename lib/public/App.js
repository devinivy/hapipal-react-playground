'use strict';

const { default: styled } = require('styled-components');
const { useState } = require('react');
const { html } = require('htm/react');

const internals = {};

module.exports = ({ by = 'devin' }) => {

    const [count, setCount] = useState(1);
    const addOne = (x) => x + 1;

    const { Header } = internals;

    return html`
        <div>
            <${Header} odd=${!!(count % 2)}>Welcome to the webpage by ${by}<//>
            <p>
                you could be in a <button onClick=${() => setCount(addOne)}>worse</button> place
                <br />
                ${count}
            </p>
        </div>
    `;
};

internals.Header = styled.h1`
    background-color: ${({ odd }) => (odd && 'pink') || 'green'};
`;
