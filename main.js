class Shade {
    constructor(hue, positions, blur) {
        if (Array.isArray(hue)) {
            this.hex = Shade.rgbToHex(...hue);
        } else {
            this.hex = hue;
        }
        this.positions = positions;
        this.blur = blur;
    }

    static buildRandom() {
        const hex = Shade.randomHex();
        const positions = [Shade.randomInt(5, 95), Shade.randomInt(5, 95)]
        const blur = Shade.randomInt(40, 60);
        return new this(hex, positions, blur);
    }

    static randomHex() {
        // <https://stackoverflow.com/questions/5092808/how-do-i-randomly-generate-html-hex-color-codes-using-javascript>
        return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    }

    static randomInt(min = 0, max = 100) {
        // https://www.codegrepper.com/code-examples/javascript/how+to+generate+a+random+number+between+0+and+100+in+javascript
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static rgbToHex(r, g, b) {
        // <https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb>
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
    }

    getRgb() {
        // <https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb>
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.hex);
        if (result == null) {
            throw new Error(`${this.hex} resulted null after the regEx`);
        }
        return [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
        ];
    }

    print() {
        console.info(JSON.stringify(this, null, 4));
    }
}

const colorpicker = document.getElementById('background-color-colorpicker');
const shades = document.getElementById('shades');
const demo = document.getElementById('demo');
const addColorButton = document.getElementById('add-color-button');
const copyCssButton = document.getElementById('copy-css-button');
const allTemplates = Array.from(document.querySelectorAll('template'));
const shadeTemplatesSelect = document.getElementById('shade-templates');
const templates = {
    colorField: getTemplate("color-field")
}

function getTemplate(id) {
    return allTemplates.find(t => t.id === id).content.firstElementChild
}

const shadeTemplates = [
    [],
    [
        new Shade([52, 136, 207], [16, 32], 40),
        new Shade([122, 109, 232], [34, 99], 44),
        new Shade([227, 153, 145], [93, 56], 57),
        new Shade([246, 229, 131], [43, 8], 58),
        new Shade([104, 227, 211], [60, 66], 40),
        new Shade([219, 233, 109], [28, 0], 40),
    ],
    [
        new Shade([255, 184, 122], [40, 20], 50),
        new Shade([31, 221, 255], [80, 0], 50),
        new Shade([252, 222, 225], [0, 50], 50),
        new Shade([255, 133, 173], [80, 50], 50),
        new Shade([255, 181, 138], [0, 100], 50),
        new Shade([107, 102, 255], [80, 100], 50),
        new Shade([255, 133, 167], [0, 0], 50),
    ],
    [
        new Shade([222, 107, 245], [99, 82], 48),
        new Shade([120, 206, 252], [29, 4], 54),
        new Shade([234, 72, 78], [50, 90], 52),
        new Shade([160, 85, 226], [37, 65], 56),
        new Shade([237, 146, 215], [12, 89], 47),
        new Shade([253, 191, 83], [70, 74], 42),
        new Shade([165, 207, 233], [96, 61], 47),
    ]
];

const state = {
    permissions: {
        askBeforeChangeTemplate: true
    },
    backgroundColor: '#ffffff',
    shades: [],
    computed: ''
}

window.shades = state.shades;

function setup() {
    initBackground();
    generateShadeTemplatesOptions();
    listenCopyCssButton();

    function initBackground() {
        colorpicker.setAttribute('value', state.backgroundColor);
        demo.style.backgroundColor = state.backgroundColor;
    }

    function generateShadeTemplatesOptions() {
        const options = document.createDocumentFragment();
        shadeTemplates.slice(1).forEach((_, index) => {
            const option = document.createElement('option');
            option.setAttribute('value', index + 1);
            option.textContent = index + 1;
            options.appendChild(option);
        });
        shadeTemplatesSelect.appendChild(options);

        shadeTemplatesSelect.addEventListener('change', (event) => {
            if (state.permissions.askBeforeChangeTemplate && state.shades.length > 3) {
                if (!confirm("If you proceed with this operation you will lose the current state.")) {
                    return
                } else {
                    state.permissions.askBeforeChangeTemplate = false;
                }
            }

            const index = event.target.value;
            state.shades = [...shadeTemplates[index]];

            const fields = document.createDocumentFragment();
            state.shades.forEach(shade => {
                const field = document.importNode(templates.colorField, true);
                const label = field.querySelector('label');
                const colorpicker = field.querySelector('input');
                const removeShadeButton = field.querySelector('button#remove-shade');

                label.textContent += shade.hex;

                const id = `${label.getAttribute('for')}-${index + 1}`;
                label.setAttribute('for', id);
                colorpicker.setAttribute('id', id);
                colorpicker.setAttribute('value', shade.hex);

                onChange(colorpicker, label, index, draw);
                onRemoveShade(field, removeShadeButton, index);

                fields.appendChild(field);
            });

            // remove all fields
            Array.from(shades.children).forEach(child => {
                if (child.getAttribute('id') !== "add-color-button") {
                    shades.removeChild(child);
                }
            });

            // Add fields related to template
            shades.insertBefore(fields, addColorButton);

            draw();
        })
    }

    function listenCopyCssButton() {
        copyCssButton.addEventListener('click', () => {
            let copy = `background-color: ${state.backgroundColor};`;
            if(state.shades.length > 0) {
                copy += ` background-image: ${state.computed};`
            }
            navigator.clipboard.writeText(copy).then(() => {
                confirm(`CSS copied to clipboard:\n\n${copy}`)
            }, (err) => {
                alert(`Couldn't copy to clipboard. Please proceede manually:\n\n${copy}`);
                console.error(err);
            });
        });
    }
}

function run() {
    listenColorpickerChange();
    listenAddColorButton();

    function listenColorpickerChange() {
        colorpicker.addEventListener('change', function (event) {
            const { value } = event.target;
            this.setAttribute('value', value);
            demo.style.backgroundColor = value;
        });
    }

    function listenAddColorButton() {
        addColorButton.addEventListener('click', addColor)
    }

    function addColor() {
        const field = document.importNode(templates.colorField, true);
        const label = field.querySelector('label');
        const colorpicker = field.querySelector('input');
        const removeShadeButton = field.querySelector('button#remove-shade');
        const index = state.shades.length;

        const shade = Shade.buildRandom();
        state.shades.push(shade);

        label.textContent += shade.hex;

        const id = `${label.getAttribute('for')}-${index + 1}`;
        label.setAttribute('for', id);
        colorpicker.setAttribute('id', id);
        colorpicker.setAttribute('value', shade.hex);

        onChange(colorpicker, label, index, draw);
        onRemoveShade(field, removeShadeButton, index);

        shades.insertBefore(field, addColorButton);

        draw();
    }
}

function onChange(colorpicker, label, index, cb) {
    colorpicker.addEventListener('change', (event) => {
        const { value } = event.target;

        colorpicker.setAttribute('value', value);
        state.shades[index].hex = value;

        label.textContent = value;

        cb(value);
    })
}

function onRemoveShade(field, button, index) {
    button.addEventListener('click', () => {
        button.removeEventListener('click', onRemoveShade);

        state.shades.splice(index, 1);
        shades.removeChild(field);

        draw();
    })
}

function draw() {
    let backgroundImage = '';

    state.shades.forEach(addRadialGradient);
    backgroundImage = backgroundImage.slice(0, -2);

    state.computed = backgroundImage;

    demo.style.backgroundImage = backgroundImage;

    function addRadialGradient(shade) {
        backgroundImage += `radial-gradient(at ${shade.positions[0]}% ${shade.positions[1]}%, rgb(${shade.getRgb().join(', ')}) 0px, transparent ${shade.blur}%), `
    }
}

setup();
run();