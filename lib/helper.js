"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeVisible = exports.setData = exports.getData = exports.getGridElements = exports.putGridId = exports.getGridId = void 0;
var config = require("./config");
var gridData = new Map();
var gridCounter = 0;
function getGridId(grid) {
    var ids = grid.className
        .split(" ")
        .filter(function (cl) { return new RegExp("".concat(config.GRID_SELECTOR_ID, "-*")).test(cl); });
    if (ids.length == 0 || ids.length > 1)
        return -1;
    else
        return parseId(ids[0]);
}
exports.getGridId = getGridId;
function parseId(gridId) {
    var id = parseInt(gridId.substring(config.GRID_SELECTOR_ID.length + 1));
    if (!isNaN(id))
        return id;
    else
        return -1;
}
function putGridId(grid) {
    gridData.set(gridCounter, {});
    grid.classList.add("".concat(config.GRID_SELECTOR_ID, "-").concat(gridCounter));
    return gridCounter++;
}
exports.putGridId = putGridId;
function getGridElements(grid) {
    return Array.from(grid.children).filter(function (c) { return isGridElement(c); });
}
exports.getGridElements = getGridElements;
function getData(gridId) {
    return gridData.get(gridId);
}
exports.getData = getData;
function setData(gridId, data) {
    gridData.set(gridId, data);
}
exports.setData = setData;
function isGridElement(e) {
    return e.className
        .split(" ")
        .some(function (cl) { return new RegExp("".concat(config.GRID_ELEMENT, "*")).test(cl); });
}
function makeVisible(el) {
    el.classList.remove(config.GRID_ELEMENT);
    el.classList.add(config.GRID_ELEMENT_VISIBLE);
}
exports.makeVisible = makeVisible;
