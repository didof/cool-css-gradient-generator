export default class Shade {
    constructor(hue, positions, blur) {
        if (Array.isArray(hue)) {
            this.hex = Shade.rgbToHex(...hue);
        } else {
            this.hex = hue;
        }
        this.positions = positions;
        this.blur = blur;
        this.id = Math.floor(Math.random() * 100);
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