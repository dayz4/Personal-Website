// Random terrain generation functions
// Perlin noise generation adapted from code provided at http://flafla2.github.io/2014/08/09/perlinnoise.html
function genP() {
    var p = [];

    for (var i=0; i<256; i++) {
        p.push(i);
    }

    for (var j=255; j>=0; j--) {
        var val = Math.floor(Math.random()*j + 1);
        var temp = p[j];
        p[j] = p[val];
        p[val] = temp
    }

    return p;
}

function noise(x, y, repeat, p) {
    x = x % repeat;
    y = y % repeat;

    var xi = Math.floor(x & 255);
    var yi = Math.floor(y & 255);

    var xf = x - Math.floor(x);
    var yf = y - Math.floor(y);

    var u = fade(xf);
    var v = fade(yf);

    var a = p[p[    xi         ] +     yi         ];
    var b = p[p[    xi         ] + inc(yi, repeat)];
    var c = p[p[inc(xi, repeat)] +     yi         ];
    var d = p[p[inc(xi, repeat)] + inc(yi, repeat)];

    var x1 = lerp(grad(a, xf, yf),     grad(c, xf - 1, yf    ), u);
    var x2 = lerp(grad(b, xf, yf - 1), grad(d, xf - 1, yf - 1), u);

    return (lerp(x1, x2, v) + 1) / 2;
}

function inc(num, repeat) {
    num++;
    num %= repeat;
    return num;
}

function grad(hash, x, y) {
    switch (hash & 0xF) {
        case 0x0:
            return x + y;
        case 0x1:
            return -x + y;
        case 0x2:
            return x - y;
        case 0x3:
            return -x - y;
        case 0x4:
            return y + x;
        case 0x5:
            return -y + x;
        case 0x6:
            return y - x;
        case 0x7:
            return -y - x;
        case 0x8:
            return x + y;
        case 0x9:
            return -x + y;
        case 0xA:
            return x - y;
        case 0xB:
            return -x - y;
        case 0xC:
            return y + x;
        case 0xD:
            return -y + x;
        case 0xE:
            return y - x;
        case 0xF:
            return -y - x;
        default:
            return 0; // never happens
    }
}

function fade(t) {
    return 6 * Math.pow(t, 5) - 15 * Math.pow(t, 4) + 10 * Math.pow(t, 3);  // 6t^5 - 15t^4 + 10t^3
}

function lerp(a, b, x) {
    return a + x * (b - a);
}

function perlin(x, y, repeat, p, nOctaves) {
    var total = 0;
    var frequency = 1;
    var amplitude = 1;
    var maxVal = 0;
    var persistence = .6;

    for(var i=0; i<nOctaves; i++) {
        total += noise(x * frequency, y * frequency, repeat, p) * amplitude;
        maxVal += amplitude;

        amplitude *= persistence;
        frequency *= 2;
    }

    return total/maxVal;
}
