import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import Shade from './shade';
import templates from './templates';
import './web-components/layout-sidebar-main';
import './web-components/jc-button';

Alpine.plugin(collapse);

window.Alpine = Alpine;

const mainRect = document.querySelector('main').getBoundingClientRect();

const search = new URLSearchParams(new URL(window.location).search)
const d_width = search.get('w') || (mainRect.width / 3);
const d_height = search.get('h') || (mainRect.width / 3);
const d_blur = search.get('b') || 0;
const d_backgroundColor = search.get('bg') || '#ffffff';
const s = search.get('s');
let d_shades = [];
let d_backgroundImage = '';
if (s != null) {
    d_shades = s.split(';').slice(0, 10).map(encoded => encoded.split('|')).map(data => new Shade(data[0], data[1].split(':'), data[2]))
    d_backgroundImage = toBackgroundImage(d_shades);
}

Alpine.store('demo', {
    width: d_width,
    height: d_height,
    blur: d_blur,
    backgroundColor: d_backgroundColor,
    backgroundImage: d_backgroundImage,
    shades: d_shades,

    templates,

    setBackgroundTransparent() {
        this.backgroundColor = 'transparent';
        this.update();
    },

    addShade() {
        this.shades.push(Shade.buildRandom())
        this.update();
    },

    removeShade(index) {
        this.shades.splice(index, 1);
        this.update();
    },

    inputColorShade(event, index) {
        const { value } = event.target;
        this.shades[index].hex = value;
        this.update();
    },

    inputColorShadeManual(event, index) {
        const { value } = event.target;

        if (/^#[0-9A-F]{6}$/i.test(value)) {
            this.shades[index].hex = value;
            this.update();
        }
    },

    inputBlurShade(event, index) {
        const { value } = event.target;
        this.shades[index].blur = Number(value);
        this.update();
    },

    inputPositionShade(event, index, x) {
        const { value } = event.target;
        this.shades[index].positions[x] = Number(value);
        this.update();
    },

    update() {
        this.backgroundImage = this.toBackgroundImage(this.shades);
    },

    toBackgroundImage,

    selectTemplate(index) {
        this.shades = this.templates[index];
        this.update();
    },

    removeTemplate(index) {
        this.templates.splice(index, 1);
        console.log(index)
    },

    reset() {
        this.width = d_width;
        this.height = d_height;
        this.blur = d_blur;
        this.backgroundColor = d_backgroundColor;
        this.backgroundImage = d_backgroundImage;
        this.shades = [];
        this.update();
        window.location.search = new URLSearchParams();
    },

    save() {
        const previousSaves = JSON.parse(localStorage.getItem('custom_templates')) || [];
        const copy = [...this.shades];
        const updated = previousSaves.concat([copy]);
        this.templates = [...this.templates, copy];
        localStorage.setItem('custom_templates', JSON.stringify(updated));
    },

    copyCSS() {
        let css = `width: ${this.width}px;\nheight: ${this.height}px;\nbackground-color: ${this.backgroundColor};\n`;
        if (this.shades.length > 0) {
            css += `background-image: ${this.backgroundImage};\n`
        }
        if (this.blur > 0) {
            css += `filter: blur(${this.blur}px)\n`;
        }

        this._copy(css, `CSS copied to clipboard:\n\n${css}`);
    },

    getLink() {
        const search = new URLSearchParams()
        search.set('w', this.width);
        search.set('h', this.height);
        search.set('b', this.blur);
        search.set('bg', this.backgroundColor);
        if (this.shades.length > 0) {
            const encodedShades = this.shades.map(shade => `${shade.hex}|${shade.positions[0]}:${shade.positions[1]}|${shade.blur}`).join(';');
            search.set('s', encodedShades);
        }

        const url = new URL(window.location);
        url.search = search;

        this._copy(url.toString(), `URL copied to clipboard:\n\n${url}`);
    },

    _copy(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            confirm(message);
        }, (err) => {
            alert(`Couldn't copy to clipboard. Please proceede manually:\n\n${text}`);
            console.error(err);
        });
    }
});

function toBackgroundImage(shades) {
    let backgroundImage = '';

    shades.forEach(addRadialGradient);
    return backgroundImage.slice(0, -2);

    function addRadialGradient(shade) {
        backgroundImage += `radial-gradient(at ${shade.positions[0]}% ${shade.positions[1]}%, rgb(${shade.getRgb().join(', ')}) 0px, transparent ${shade.blur}%), `
    }
}

Alpine.start();

/**
 * add claymorphism
 * add modal
 * add og
 * add favicon
 * pagina noscript con meme
 * make exportable as svg too https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Gradients
 * create export and save in the query_params a representation of the state, so if you click it the js assembles the state on page load
 * twitta josh comeau
 */