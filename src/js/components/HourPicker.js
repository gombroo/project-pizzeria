/* global rangeSlider */

import BaseWidget from './BaseWidget.js';
import {
  utils
} from '../utils.js';
import {
  settings,
  select
} from '../settings.js';

export default class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.intitPlugin();

    thisWidget.value = thisWidget.dom.input.value;
  }

  intitPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });

    rangeSlider.create(thisWidget.dom.input, {
      onSlide: function (value) {
        thisWidget.value = value;
      },
    });
  }

  parseValue(value) {
    return utils.numberToHour(value);
  }

  isValid() {
    return true;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}
