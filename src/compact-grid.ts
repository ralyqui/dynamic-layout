import {
  getGridElements,
  getGridId,
  putGridId,
  getData,
  setData,
  makeVisible,
} from "./helper";
import * as config from "./config";

interface CompactData {
  columnHeight: Map<number, number>;
  columnCnt: number;
}

export function renderCompact(grid: Element) {
  const id = getGridId(grid);
  const elements = getGridElements(grid);
  let columnAmount = calcColumns(grid);
  if (id == -1) {
    let new_id = putGridId(grid);
    fillColumns(grid, new_id, elements, columnAmount);
  } else {
    fillColumns(grid, id, elements, columnAmount);
  }
}

export function updateCompact(grid: Element) {
  const id = getGridId(grid);
  const elements = getGridElements(grid).filter((el) => !isMarked(el));
  let columnAmount = calcColumns(grid);
  if (id != -1) {
    updateColumns(grid, id, elements, columnAmount);
  }
}

function getElementHeight(el: Element) {
  let element = el as HTMLElement;
  let max = element.style.maxHeight ? parseInt(element.style.maxHeight) : NaN;
  let min = element.style.minHeight ? parseInt(element.style.minHeight) : NaN;
  if (!isNaN(max) && el.scrollHeight > max) return max;
  if (!isNaN(min) && el.scrollHeight < min) return min;
  return el.scrollHeight;
}

function getElementWidth(grid: Element) {
  let width = grid.className
    .split(" ")
    .filter((cl) =>
      new RegExp(`${config.COMPACT_GRID_SELECTOR}-*`).test(cl)
    )[0];
  const id = parseInt(width.substring(config.COMPACT_GRID_SELECTOR.length + 1));

  if (!isNaN(id)) return id;
  else return -1;
}

function calcColumns(grid: Element) {
  const elementWidth = getElementWidth(grid);
  return Math.floor((grid as HTMLElement).offsetWidth / elementWidth);
}

function getMinColumn(gridId: number): [number, number] {
  let minIdx = -1;
  let min = Infinity;

  (getData(gridId) as CompactData).columnHeight.forEach((v, k, m) => {
    if (v < min) {
      min = v;
      minIdx = k;
    }
  });

  return [minIdx, min];
}

function placeElement(e: Element, grid: Element, columnAmount: number) {
  const id = getGridId(grid);
  markProcessed(e);
  let [columnId, currentHeight] = getMinColumn(id);
  if (id == -1) return;
  (e as HTMLElement).style.top = `${currentHeight}px`;
  (e as HTMLElement).style.left = `${calcLeftOffset(
    columnId,
    getElementWidth(grid),
    getColumnWidth(grid, columnAmount)
  )}px`;
  (getData(id) as CompactData).columnHeight.set(
    columnId,
    currentHeight + getElementHeight(e)
  );
}

function markProcessed(el: Element) {
  if (isMarked(el)) return;
  el.classList.add(config.ELEMENT_ACTIVE);
  makeVisible(el);
}

function isMarked(el: Element): boolean {
  return el.className.split(" ").some((c) => c == config.ELEMENT_ACTIVE);
}

function emptyColumns(cnt: number) {
  const map = new Map<number, number>();
  for (let i = 0; i < cnt; i++) {
    map.set(i, 0);
  }
  return map;
}

function fillColumns(
  grid: Element,
  id: number,
  elements: Element[],
  columnAmount: number
) {
  const data: CompactData = {
    columnHeight: emptyColumns(columnAmount),
    columnCnt: columnAmount,
  };
  setData(id, data);
  for (let e of elements) {
    placeElement(e, grid, columnAmount);
  }
}

function updateColumns(
  grid: Element,
  id: number,
  elements: Element[],
  columnAmount: number
) {
  for (let e of elements) {
    placeElement(e, grid, columnAmount);
  }
}

function getColumnWidth(grid: Element, columnAmount: number) {
  return Math.floor((grid as HTMLElement).offsetWidth / columnAmount);
}

/*
  Center the element in their allocated column
 */
function calcLeftOffset(
  columnId: number,
  elemWidth: number,
  columnWidth: number
) {
  return columnId * (columnWidth - 1) + (columnWidth - elemWidth) / 2;
}
