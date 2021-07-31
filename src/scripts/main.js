import Filters from './components/range-filters.js';
import List from './components/flats-list.js';
import './components/up.js';
import { MIN_AREA, MIN_PRICE, MAX_AREA, MAX_PRICE } from './constants.js';
import * as data from '../data/data.json';

const apartments = data.apartments;
const box = document.querySelector('.flats-list-body');
const more = document.querySelector('.more-button');
const radios = document.querySelectorAll('.filter-rooms-input');
const form = document.querySelector('.filters-form');
const wrapperPrice = document.querySelector('.drawer-wrapper-price');
const wrapperArea = document.querySelector('.drawer-wrapper-area');
const sliderPrice = document.querySelector('.slider-price');
const trackPrice = document.querySelector('.track-price');
const thumbsPrice = document.querySelectorAll('.thumb-price');
const outputsPrice = document.querySelectorAll('.output-price');
const sliderArea = document.querySelector('.slider-area');
const trackArea = document.querySelector('.track-area');
const thumbsArea = document.querySelectorAll('.thumb-area');
const outputsArea = document.querySelectorAll('.output-area');

const roomsRadios = [...radios];

const areaSortControl = {
  elem: document.querySelector('#sort-area'),
  up: document.querySelector('#sort-area-up'),
  down: document.querySelector('#sort-area-down')
};

const priceSortControl = {
  elem: document.querySelector('#sort-price'),
  up: document.querySelector('#sort-price-up'),
  down: document.querySelector('#sort-price-down')
};

const floorSortControl = {
  elem: document.querySelector('#sort-floor'),
  up: document.querySelector('#sort-floor-up'),
  down: document.querySelector('#sort-floor-down')
};

const list = new List(apartments, box, more, areaSortControl, priceSortControl, floorSortControl);
list.rerender();
list.setHandlers();

const filtersPrice = new Filters(wrapperPrice, sliderPrice, trackPrice, outputsPrice, thumbsPrice, MIN_PRICE, MAX_PRICE);
const filtersArea = new Filters(wrapperArea, sliderArea, trackArea, outputsArea, thumbsArea, MIN_AREA, MAX_AREA);

filtersPrice.setStartValues();
filtersArea.setStartValues();

filtersPrice.setHandlers();
filtersArea.setHandlers();

roomsRadios.map((item) => {
  item.addEventListener('click', (evt) => {
    if (item.disabled) return;
    const value = item.value;
    list.filterDataByRooms(value);
    list.rerender();
    list.setHandlers();
  })
});

form.addEventListener('reset', (evt) => {
  filtersPrice.setStartValues();
  filtersArea.setStartValues();
  list.filterDataByRooms(null);
  list.filterDataByPrice([]);
  list.filterDataByArea([]);
  list.rerender();
  list.setHandlers();
});

wrapperPrice.addEventListener('mouseout', (evt) => {
  const thumbs = [...outputsPrice];
  const values = thumbs.map((item) => item.value);
  list.filterDataByPrice(values);
  list.rerender();
  list.setHandlers();
});

wrapperArea.addEventListener('mouseout', (evt) => {
  const thumbs = [...outputsArea];
  const values = thumbs.map((item) => item.value);
  list.filterDataByArea(values);
  list.rerender();
  list.setHandlers();
});