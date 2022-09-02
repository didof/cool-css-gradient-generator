import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import Shade from './shade';
import templates from './templates';
import './components/layout-sidebar-main';

Alpine.plugin(collapse);

window.Alpine = Alpine;

const d_width = 300;
const d_height = 300;
const d_blur = 0;
const d_backgroundColor = '#ffffff';
const d_backgroundImage = '';

Alpine.store('demo', {
    width: d_width,
    height: d_height,
    blur: d_blur,
    backgroundColor: d_backgroundColor,
    backgroundImage: d_backgroundImage,
    shades: [],

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

    toBackgroundImage(shades) {
        let backgroundImage = '';

        shades.forEach(addRadialGradient);
        return backgroundImage.slice(0, -2);

        function addRadialGradient(shade) {
            backgroundImage += `radial-gradient(at ${shade.positions[0]}% ${shade.positions[1]}%, rgb(${shade.getRgb().join(', ')}) 0px, transparent ${shade.blur}%), `
        }
    },

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

        navigator.clipboard.writeText(css).then(() => {
            confirm(`CSS copied to clipboard:\n\n${css}`)
        }, (err) => {
            alert(`Couldn't copy to clipboard. Please proceede manually:\n\n${css}`);
            console.error(err);
        });
    }
});

Alpine.start();

/**
 * add animation
 * add claymorphism
 */