import * as config from "./config";
import { renderCompact, updateCompact } from "./compact-grid";

let grids;

/* TODO: Add additional layout types */
enum GridType {
  CompactGrid,
  Unknown,
}
/* Sets up every grid on the page in accordance to the selected type
 * Ordering of selected elements will not be considered for the grid construction
 * TODO: Provide a way to specify element priority on init
 */
export function initGrids() {
  grids = getGrids();
  grids.forEach((g) => resizeObserver.observe(g));
  grids.forEach((g) => render(g));
}

/*
  Detect any new unmarked elements in the grids and process if needed
 */
export function updateGrids() {
  grids = getGrids();
  grids.forEach((g) => update(g));
}

function getGrids(): NodeListOf<Element> {
  return document.querySelectorAll(`.${config.GRID_SELECTOR}`);
}

function render(grid: Element) {
  switch (getType(grid)) {
    case GridType.CompactGrid:
      renderCompact(grid);
      break;
    case GridType.Unknown:
      console.error("Couldn't detect grid type");
      break;
  }
}

function update(grid: Element) {
  switch (getType(grid)) {
    case GridType.CompactGrid:
      updateCompact(grid);
      break;
    case GridType.Unknown:
      console.error("Couldn't detect grid type");
      break;
  }
}

function getType(grid: Element): GridType {
  if (
    grid.className
      .split(" ")
      .some((cl) => new RegExp(`${config.COMPACT_GRID_SELECTOR}-*`).test(cl))
  )
    return GridType.CompactGrid;
  return GridType.Unknown;
}

const resizeObserver = new ResizeObserver((_) => {
  grids = getGrids();
  grids.forEach((g) => render(g));
});
