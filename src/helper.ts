import * as config from "./config";

const gridData = new Map<number, any>();
let gridCounter = 0;

export function getGridId(grid: Element) {
  let ids = grid.className
    .split(" ")
    .filter((cl) => new RegExp(`${config.GRID_SELECTOR_ID}-*`).test(cl));
  if (ids.length == 0 || ids.length > 1) return -1;
  else return parseId(ids[0]);
}

function parseId(gridId: string): number {
  const id = parseInt(gridId.substring(config.GRID_SELECTOR_ID.length + 1));
  if (!isNaN(id)) return id;
  else return -1;
}

export function putGridId(grid: Element): number {
  gridData.set(gridCounter, {});
  grid.classList.add(`${config.GRID_SELECTOR_ID}-${gridCounter}`);
  return gridCounter++;
}

export function getGridElements(grid: Element) {
  return Array.from(grid.children).filter((c) => isGridElement(c));
}

export function getData(gridId: number) {
  return gridData.get(gridId);
}

export function setData(gridId: number, data: any) {
  gridData.set(gridId, data);
}

function isGridElement(e: Element) {
  return e.className
    .split(" ")
    .some((cl) => new RegExp(`${config.GRID_ELEMENT}*`).test(cl));
}

export function makeVisible(el: Element) {
  el.classList.remove(config.GRID_ELEMENT);
  el.classList.add(config.GRID_ELEMENT_VISIBLE);
}
