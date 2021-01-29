const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});

const WIDTH = 25;
const HEIGHT = 6;

function count(string, symbol) {
    const regex = new RegExp(symbol, 'g');
    return (string.match(regex) || []).length;
}

function findFewestZeroesLayer(layers){
    let minZeroesLayer = layers[0];
    let minZeroes = WIDTH * HEIGHT;
    for (let layer of layers){
        let zeroes = count(layer, '0');
        if (zeroes < minZeroes){
            minZeroes = zeroes;
            minZeroesLayer = layer;
        }
    }
    return minZeroesLayer;
}

function divideIntoLayers(data, layerLength){
    let layers = [];
    for (let i = 0; i < data.length / layerLength; i++) {
        layers.push(data.slice(i * layerLength, i * layerLength + layerLength))
    }
    return layers
}

function mergeLayers(front, back){
    let layer = '';
    for (let i = 0; i < front.length; i++){
        if (parseInt(front[i],10) === 2){
            layer += back[i];
        } else {
            layer += front[i];
        }
    }
    return layer;
}

function prettyPrint(layer, width, height){
    let modifiedLayer = layer.replace(/1/g, 'X');
    modifiedLayer = modifiedLayer.replace(/0/g, '.');
    for(let i = 0; i < height; i++){
        console.log(modifiedLayer.slice(i * width, i * width + width));
    }
}

function z1(data){
    let layers = divideIntoLayers(data, WIDTH * HEIGHT);
    let minZeroesLayer = findFewestZeroesLayer(layers);
    return count(minZeroesLayer, '1') * count(minZeroesLayer, '2')
}

function z2(data){
    let layers = divideIntoLayers(data, WIDTH * HEIGHT);
    let layer = layers[0];
    for (let i = 1; i < layers.length; i++){
        if (layer.search('2') !== -1){
            layer = mergeLayers(layer, layers[i]);
        } else {
            break;
        }
    }
    prettyPrint(layer, WIDTH, HEIGHT)
}

console.log(z1(data));
z2(data);