import Shade from './shade';

export default [
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
    ],
    ...(JSON.parse(localStorage.getItem('custom_templates')) || []).map(shades => {
        return shades.map(Shade.fromJSON)
    })
];