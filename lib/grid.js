"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGrids = exports.initGrids = void 0;
var config = require("./config");
var compact_grid_1 = require("./compact-grid");
var grids;
/* TODO: Add additional layout types */
var GridType;
(function (GridType) {
    GridType[GridType["CompactGrid"] = 0] = "CompactGrid";
    GridType[GridType["Unknown"] = 1] = "Unknown";
})(GridType || (GridType = {}));
/* Sets up every grid on the page in accordance to the selected type
 * Ordering of selected elements will not be considered for the grid construction
 * TODO: Provide a way to specify element priority on init
 */
function initGrids() {
    grids = getGrids();
    grids.forEach(function (g) { return resizeObserver.observe(g); });
    grids.forEach(function (g) { return render(g); });
}
exports.initGrids = initGrids;
/*
  Detect any new unmarked elements in the grids and process if needed
 */
function updateGrids() {
    grids = getGrids();
    grids.forEach(function (g) { return update(g); });
}
exports.updateGrids = updateGrids;
function getGrids() {
    return document.querySelectorAll(".".concat(config.GRID_SELECTOR));
}
function render(grid) {
    switch (getType(grid)) {
        case GridType.CompactGrid:
            (0, compact_grid_1.renderCompact)(grid);
            break;
        case GridType.Unknown:
            console.error("Couldn't detect grid type");
            break;
    }
}
function update(grid) {
    switch (getType(grid)) {
        case GridType.CompactGrid:
            (0, compact_grid_1.updateCompact)(grid);
            break;
        case GridType.Unknown:
            console.error("Couldn't detect grid type");
            break;
    }
}
function getType(grid) {
    if (grid.className
        .split(" ")
        .some(function (cl) { return new RegExp("".concat(config.COMPACT_GRID_SELECTOR, "-*")).test(cl); }))
        return GridType.CompactGrid;
    return GridType.Unknown;
}
var resizeObserver = new ResizeObserver(function (_) {
    grids = getGrids();
    grids.forEach(function (g) { return render(g); });
});
