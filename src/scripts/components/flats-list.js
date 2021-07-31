import { sortData, findMinPrice, findMaxPrice, findMinArea, findMaxArea } from '../utils.js';
import { FIRST_PORTION, PORTION } from '../constants.js';

const makeItemMarkup = (data) => {
  let price = parseFloat(data.price);
  price = price.toLocaleString('ru');
  const altText = 'Квартира № ' + data.id;
  const picture = data.id > 112 ? '' : `<img class="flat-plan" alt=${altText} src="assets/img/flat${data.id}.svg">`;

  return (`<div class="flat-list-body__row">
    <div class="flats-list-body__cell plan-cell">${picture}</div>
    <div class="flats-list-body__cell title-cell">${data.rooms}-комнатная № ${data.id}</div>
    <div class="flats-list-body__cell area-cell">${data.area}</div>
    <div class="flats-list-body__cell floor-cell">${data.floor} <span class="max">из ${data.max} <span class="fl">этаж</span></span> </div>
    <div class="flats-list-body__cell price-cell">${price} <span class="ruble"></span></div>
    </div>`);
};
export default class List {

  constructor(data, container, more, areaSort, priceSort, floorSort) {
    this.data = data;
    this.filteredData = [...this.data];
    this.container = container;
    this.itemsShown = 0;
    this.buttonMore = more;
    this.areaSort = areaSort;
    this.priceSort = priceSort;
    this.floorSort = floorSort;
  }

  filterDataByRooms(value) {
    const copy = [...this.data];
    const result = copy.filter((item) => parseFloat(item.rooms) === parseFloat(value));
    this.filteredData = result;
  }

  filterDataByPrice(array) {
    const [min, max] = array;
    let newMin = !min ? findMinPrice(this.data) : min;
    let newMax = !max ? findMaxPrice(this.data) : max;
    const copy = [...this.data];
    const result = copy.filter((item) => {
      let value = parseFloat(item.price);
      if (value > newMin && value < newMax) return item;
    });
    this.filteredData = result;
    console.log(this.data, newMin, newMax, this.filteredData);
  }

  filterDataByArea(array) {
    const [min, max] = array;
    let newMin = !min ? findMinArea(this.data) : min;
    let newMax = !max ? findMaxArea(this.data) : max;
    const copy = [...this.data];
    const result = copy.filter((item) => {
      let value = parseFloat(item.area);
      if (value > newMin && value < newMax) return item;
    });
    this.filteredData = result;
    console.log(this.data, newMin, newMax, this.filteredData);
  }

  render() {
    
    const copy = [...this.filteredData];

    if (this.itemsShown === 0) {
      this.itemsShown = FIRST_PORTION;
    }

    let markup = '';

    if (copy.length === 0) {
      markup = `<p>Не нашлось ни одной квартиры, удовлетворяющей заданным условиям</p>`;
    } else {
      const dataToRender = this.getPortion(copy);
      markup = dataToRender.map((item) => makeItemMarkup(item));
      markup = markup.join('');
    }
    
    this.container.innerHTML += markup;
    
    if (this.itemsShown < copy.length && copy.length > FIRST_PORTION) {
      this.showButtonMore();
    } else {
      this.hideButtonMore();
    }
  }

  clean() {
    this.container.innerHTML = '';
  }

  rerender() {
    this.clean();
    this.render();
  }

  getPortion(array) {
    return array.slice(0, this.itemsShown);
  }

  showMore() {
    this.itemsShown += PORTION;
    this.rerender();
  }

  showButtonMore() {
    if (this.buttonMore.classList.contains('invisible')) {
      this.buttonMore.classList.remove('invisible');
    }
  }

  hideButtonMore() {
    if (!this.buttonMore.classList.contains('invisible')) {
    this.buttonMore.classList.add('invisible');
    }
  }

  cancelSorting(elem, up, down) {
    elem.classList.remove('cell-chosen');
    if (up.classList.contains('sort-chosen')) {
      up.classList.remove('sort-chosen');
    }
    if (down.classList.contains('sort-chosen')) {
      down.classList.remove('sort-chosen');
    }
  }

  cancelAllSortings() {
    let sortControls = [this.areaSort, this.priceSort, this.floorSort];
    sortControls.map((item) => this.cancelSorting(item.elem, item.up, item.down));
  }

  setHandlers() {

    this.areaSort.elem.addEventListener('click', (evt) => {
      evt.preventDefault();
      const target = evt.target;

      if (target.classList.contains('sort-link-up')) {
        this.filteredData = sortData(this.filteredData, 'area', 'up');
        this.rerender();
        this.cancelAllSortings();
        this.areaSort.elem.classList.add('cell-chosen'); 
        this.areaSort.up.classList.add('sort-chosen');
      }

      if (target.classList.contains('sort-link-down')) {
        this.filteredData = sortData(this.filteredData, 'area', 'down');
        this.rerender();
        this.cancelAllSortings();
        this.areaSort.elem.classList.add('cell-chosen'); 
        this.areaSort.down.classList.add('sort-chosen');
      }
    });

    this.priceSort.elem.addEventListener('click', (evt) => {
      evt.preventDefault();
      const target = evt.target;

      if (target.classList.contains('sort-link-up')) {
        this.filteredData = sortData(this.filteredData, 'price', 'up');
        this.rerender();
        this.cancelAllSortings();
        this.priceSort.elem.classList.add('cell-chosen'); 
        this.priceSort.up.classList.add('sort-chosen');
      }

      if (target.classList.contains('sort-link-down')) {
        this.filteredData = sortData(this.filteredData, 'price', 'down');
        this.rerender();
        this.cancelAllSortings();
        this.priceSort.elem.classList.add('cell-chosen'); 
        this.priceSort.down.classList.add('sort-chosen');
      }
    });

    this.floorSort.elem.addEventListener('click', (evt) => {
      evt.preventDefault();
      const target = evt.target;

      if (target.classList.contains('sort-link-up')) {
        this.filteredData = sortData(this.filteredData, 'floor', 'up');
        this.rerender();
        this.cancelAllSortings();
        this.floorSort.elem.classList.add('cell-chosen'); 
        this.floorSort.up.classList.add('sort-chosen');
      }

      if (target.classList.contains('sort-link-down')) {
        this.filteredData = sortData(this.filteredData, 'floor', 'down');
        this.rerender();
        this.cancelAllSortings();
        this.floorSort.elem.classList.add('cell-chosen'); 
        this.floorSort.down.classList.add('sort-chosen');
      }
    });

    this.buttonMore.addEventListener('click', (evt) => {
      evt.preventDefault();
      if (this.itemsShown < this.filteredData.length) {
        this.showMore();
      }
    });
  }

}
