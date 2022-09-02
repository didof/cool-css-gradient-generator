import { isTouchDevice } from '../utils/touch';

customElements.define('layout-sidebar-main',
    class extends HTMLElement {
        constructor() {
            super();
            let template = document.getElementById('layout-sidebar-main').content;

            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(template.cloneNode(true));
        }

        connectedCallback() {
            const [aside, main] = this.children;
            const resizer = this.shadowRoot.getElementById('resizer');
            const sidebar = this.shadowRoot.getElementById('sidebar');
            let minWidth = 200;
            const minWidthPx = getComputedStyle(aside).minWidth || `${minWidth}px`;
            if (minWidthPx.endsWith('px')) {
                minWidth = Number(minWidthPx.slice(0, -2));
            }

            sidebar.style.flexBasis = minWidthPx;

            if (isTouchDevice()) {
                resizer.addEventListener("touchstart", () => {
                    document.addEventListener("touchmove", resize, false);
                    document.addEventListener("touchend", touchend, false);
                });

                function touchend() {
                    document.removeEventListener("touchmove", resize, false);
                    document.removeEventListener("touchend", touchend, false);

                }

                function resize(event) {
                    const x = event.touches[0].clientX;
                    console.log(x)
                    if (x > minWidth) {
                        const size = `${x}px`;
                        sidebar.style.flexBasis = size;
                    }
                }
            } else {
                resizer.addEventListener("mousedown", () => {
                    document.addEventListener("mousemove", resize, false);
                    document.addEventListener("mouseup", mouseup, false);
                });

                function mouseup() {
                    document.removeEventListener("mousemove", resize, false);
                    document.removeEventListener("mouseup", mouseup, false);
                }

                function resize({ x }) {
                    if (x > minWidth) {
                        const size = `${x}px`;
                        sidebar.style.flexBasis = size;
                    }
                }
            }
        }
    }
);
