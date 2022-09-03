customElements.define('jc-button',
    class extends HTMLElement {
        constructor() {
            super();
            let template = document.getElementById('jc-button').content;

            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(template.cloneNode(true));

            this.shadowRoot.addEventListener('click', event => {
                if(this.shadowRoot.querySelector('.pushable').classList.contains('disabled')) {
                    event.stopPropagation();
                }
            })
        }

        static get observedAttributes() {
            return ["disabled"];
        }

        attributeChangedCallback(attribute, oldValue, newValue) {
            switch(attribute) {
                case "disabled":
                    this.shadowRoot.querySelector('.pushable').classList.toggle("disabled");
            }
        }

        // connectedCallback() {
        // }
    }
);
