/* global rangeSlider */

import BaseWidget from './BaseWidget.js';
import {utils} from '../utils.js';
import {settings, select} from '../settings.js';

class HourPicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.intitPlugin();

    thisWidget.value = thisWidget.dom.input;
  }

  intitPlugin(){
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input;
    });
  }

  parseValue() {
    const thisWidget = this;

    utils.numberToHour(thisWidget.value);
  }

  inValue() {
    return true;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.output = thisWidget.value;
  }
}
export default HourPicker;
