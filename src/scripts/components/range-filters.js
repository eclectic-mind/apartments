import { onMousePos } from '../utils.js';

export default class Filters {

  constructor(wrapper, slider, track, outputs, thumbs, minValue, maxValue) {

    this.wrapper = wrapper;
    this.slider = slider;
    this.track = track;
    this.outputs = outputs;
    this.thumbs = thumbs;

    this.inputsRy = {
      sliderWidth:this.wrapper.offsetWidth,
      minRange: minValue,
      maxRange: maxValue, 
      thumbWidth: 14,
      thumbBorderWidth: 0,
      theValue: [minValue, maxValue]
    };

    this.isDragging0 = false;
    this.isDragging1 = false;
    this.range = this.inputsRy.maxRange - this.inputsRy.minRange;
    this.coefficient = this.inputsRy.sliderWidth / this.range;
  }

  setStartValues() {

    this.slider.style.width = this.inputsRy.sliderWidth + 'px';
    this.slider.style.paddingLeft = 0;
    this.slider.style.paddingRight = 0;
    this.track.style.width = this.inputsRy.sliderWidth + 'px';

    this.thumbs[0].style.left = 0 + 'px';
    this.thumbs[1].style.left = this.slider.style.width + 'px';
    //this.thumbs[1].style.left = (this.inputsRy.theValue[1] - this.inputsRy.minRange) * this.coefficient - (this.inputsRy.thumbWidth / 2) + 'px';

    for (let i = 0; i < this.outputs.length; i++) {
      this.outputs[i].value = this.inputsRy.theValue[i];
      this.outputs[i].innerHTML = this.inputsRy.theValue[i].toLocaleString('ru');
    }
  }

  setHandlers() {

    this.thumbs[0].addEventListener('mousedown', (evt) => {
      this.isDragging0 = true;
    }, false);

    this.thumbs[1].addEventListener('mousedown', (evt) => {
      this.isDragging1 = true;
    }, false);

    this.wrapper.addEventListener('mouseup', (evt) => {
      this.isDragging0 = false;
      this.isDragging1 = false;
    }, false);

    this.wrapper.addEventListener('mouseout', (evt) => {
      this.isDragging0 = false;
      this.isDragging1 = false;
    }, false);
    
    this.wrapper.addEventListener('mousemove', (evt) => {
      let mousePos = onMousePos(this.wrapper, evt);
      let theValue0 = (this.isDragging0) ? Math.round(mousePos.x / this.coefficient) + this.inputsRy.minRange : this.inputsRy.theValue[0];
      let theValue1 = (this.isDragging1) ? Math.round(mousePos.x / this.coefficient) + this.inputsRy.minRange : this.inputsRy.theValue[1];

      if (this.isDragging0) {

        if (theValue0 < theValue1 && theValue0 >= this.inputsRy.minRange) {
          this.inputsRy.theValue[0] = theValue0;
          this.thumbs[0].style.left = (theValue0 - this.inputsRy.minRange) * this.coefficient + 'px';
          this.outputs[0].value = theValue0;
          this.outputs[0].innerHTML = theValue0.toLocaleString('ru');
          this.slider.style.paddingLeft = (theValue0 - this.inputsRy.minRange) * this.coefficient + 'px';
          this.track.style.width = (theValue1 - theValue0) * this.coefficient + 'px';
        }

      } else if (this.isDragging1) {

        if (theValue1 > theValue0 && theValue1 <= this.inputsRy.maxRange) {
          this.inputsRy.theValue[1] = theValue1;
          this.thumbs[1].style.left = (theValue1 - this.inputsRy.minRange) * this.coefficient - (this.inputsRy.thumbWidth / 2) + 'px';
          this.outputs[1].value = theValue1;
          this.outputs[1].innerHTML = theValue1.toLocaleString('ru');
          this.slider.style.paddingRight = (this.inputsRy.maxRange - theValue1) * this.coefficient + 'px';
          this.track.style.width = (theValue1 - theValue0) * this.coefficient + 'px';
        }
      }
    }, false);
  }

}