customElements.define('jc-button',
    class extends HTMLElement {
        constructor() {
            super();
            let template = document.getElementById('jc-button').content;

            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(template.cloneNode(true));
        }
    }
);
