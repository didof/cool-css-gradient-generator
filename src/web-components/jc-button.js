customElements.define('jc-button',
    class extends HTMLElement {
        constructor() {
            super();
            let template = document.getElementById('jc-button').content;

            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(template.cloneNode(true));
        }

        connectedCallback() {
            const { front } = this.dataset;
            if(front) {
                const el = this.shadowRoot.querySelector('.front')
                el.classList.add(...front.split(' '))
            }
        }
    }
);
