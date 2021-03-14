'use strict';

const { useState } = require('react');
const { html } = require('htm/react');

module.exports = ({ by = 'devin' }) => {

    const [count, setCount] = useState(0);
    const addOne = (x) => x + 1;

    return html`
        <h1>Welcome to the webpage by ${by}</h1>
        <p>
            you could be in a <button onClick=${() => setCount(addOne)}>worse</button> place
            <br />
            ${count}
        </p>
    `;
};
