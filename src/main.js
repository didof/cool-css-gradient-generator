import Alpine from 'alpinejs';
import Shade from './shade';

window.Alpine = Alpine

Alpine.store('demo', {
    backgroundColor: '#ffffff',
    backgroundImage: '',
    shades: [],

    templates: [
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
    ],

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
        console.log(this.shades)
        this.update();
    },

    reset() {
        this.backgroundColor = '#ffffff';
        this.shades = [];
        this.update();
    },

    copyCSS() {
        let copy = `background-color: ${this.backgroundColor};`;
        if (this.shades.length > 0) {
            copy += ` background-image: ${this.backgroundImage};`
        }
        navigator.clipboard.writeText(copy).then(() => {
            confirm(`CSS copied to clipboard:\n\n${copy}`)
        }, (err) => {
            alert(`Couldn't copy to clipboard. Please proceede manually:\n\n${copy}`);
            console.error(err);
        });
    }
});

Alpine.start();

/**
 * save current work on local storage
 * save templates in local storage
 * add animation
 * add claymorphism
 */