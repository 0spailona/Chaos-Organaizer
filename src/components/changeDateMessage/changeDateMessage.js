export default class DateMessageView {
  constructor(container, eventHandlers) {
    this.container = container;
  }

  drawDateMessage(date) {
    console.log('drawDateMessage',date)
    this.data = date;
    const dateMsg = document.createElement('div');
    dateMsg.classList.add('dateMsgWrp')
    dateMsg.textContent = date;
    this.container.insertAdjacentElement("afterbegin", dateMsg)
    //this.container.appendChild(dateMsg)
  }
}
