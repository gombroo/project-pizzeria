import {select, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import {utils} from '../utils.js';


class Booking {
  constructor(bookingElem) {
    const thisBooking = this;
    thisBooking.render(bookingElem);
    thisBooking.initWidgets();
  }

  render() {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = thisBooking.bookingElem;
    thisBooking.bookingElem = utils.createDOMFromHTML(generatedHTML);
    thisBooking.bookingElem.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hourseAmount);
  }

  initWidgets() {
    const thisBooking = this;

   thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
   thisBooking.hoursAmount = new AmountWidget(select.booking.hoursAmount);
  }
}
export default Booking;
