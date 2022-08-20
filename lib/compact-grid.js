"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompact = exports.renderCompact = void 0;
var helper_1 = require("./helper");
var config = require("./config");
function renderCompact(grid) {
    var id = (0, helper_1.getGridId)(grid);
    var elements = (0, helper_1.getGridElements)(grid);
    var columnAmount = calcColumns(grid);
    if (id == -1) {
        var new_id = (0, helper_1.putGridId)(grid);
        fillColumns(grid, new_id, elements, columnAmount);
    }
    else {
        fillColumns(grid, id, elements, columnAmount);
    }
}
exports.renderCompact = renderCompact;
function updateCompact(grid) {
    var id = (0, helper_1.getGridId)(grid);
    var elements = (0, helper_1.getGridElements)(grid).filter(function (el) { return !isMarked(el); });
    var columnAmount = calcColumns(grid);
    if (id != -1) {
        updateColumns(grid, id, elements, columnAmount);
    }
}
exports.updateCompact = updateCompact;
function getElementHeight(el) {
    var element = el;
    var max = element.style.maxHeight ? parseInt(element.style.maxHeight) : NaN;
    var min = element.style.minHeight ? parseInt(element.style.minHeight) : NaN;
    if (!isNaN(max) && el.scrollHeight > max)
        return max;
    if (!isNaN(min) && el.scrollHeight < min)
        return min;
    return el.scrollHeight;
}
function getElementWidth(grid) {
    var width = grid.className
        .split(" ")
        .filter(function (cl) {
        return new RegExp("".concat(config.COMPACT_GRID_SELECTOR, "-*")).test(cl);
    })[0];
    var id = parseInt(width.substring(config.COMPACT_GRID_SELECTOR.length + 1));
    if (!isNaN(id))
        return id;
    else
        return -1;
}
function calcColumns(grid) {
    var elementWidth = getElementWidth(grid);
    return Math.floor(grid.offsetWidth / elementWidth);
}
function getMinColumn(gridId) {
    var minIdx = -1;
    var min = Infinity;
    (0, helper_1.getData)(gridId).columnHeight.forEach(function (v, k, m) {
        if (v < min) {
            min = v;
            minIdx = k;
        }
    });
    return [minIdx, min];
}
function placeElement(e, grid, columnAmount) {
    var id = (0, helper_1.getGridId)(grid);
    markProcessed(e);
    var _a = getMinColumn(id), columnId = _a[0], currentHeight = _a[1];
    if (id == -1)
        return;
    e.style.top = "".concat(currentHeight, "px");
    e.style.left = "".concat(calcLeftOffset(columnId, getElementWidth(grid), getColumnWidth(grid, columnAmount)), "px");
    (0, helper_1.getData)(id).columnHeight.set(columnId, currentHeight + getElementHeight(e));
}
function markProcessed(el) {
    if (isMarked(el))
        return;
    el.classList.add(config.ELEMENT_ACTIVE);
    (0, helper_1.makeVisible)(el);
}
function isMarked(el) {
    return el.className.split(" ").some(function (c) { return c == config.ELEMENT_ACTIVE; });
}
function emptyColumns(cnt) {
    var map = new Map();
    for (var i = 0; i < cnt; i++) {
        map.set(i, 0);
    }
    return map;
}
function fillColumns(grid, id, elements, columnAmount) {
    var data = {
        columnHeight: emptyColumns(columnAmount),
        columnCnt: columnAmount,
    };
    (0, helper_1.setData)(id, data);
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var e = elements_1[_i];
        placeElement(e, grid, columnAmount);
    }
}
function updateColumns(grid, id, elements, columnAmount) {
    for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
        var e = elements_2[_i];
        placeElement(e, grid, columnAmount);
    }
}
function getColumnWidth(grid, columnAmount) {
    return Math.floor(grid.offsetWidth / columnAmount);
}
/*
  Center the element in their allocated column
 */
function calcLeftOffset(columnId, elemWidth, columnWidth) {
    return columnId * (columnWidth - 1) + (columnWidth - elemWidth) / 2;
}
