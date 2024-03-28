import MessageView from "../message/messageView";
import dateFormat from "dateformat";
import DateMessageView from "../changeDateMessage/changeDateMessage";

export default class ContentView {
  constructor(container, eventHandlers) {
    this.container = container;
    this.eventHandlers = eventHandlers
    this.today = dateFormat(new Date, 'dd.mm.yy');
    this.lastDate = this.today;
    //console.log('now',this.lastDate)
  }

  async addListeners() {
    this.scrollDown()
    //console.log('scrollHeight',this.container.scrollHeight)
    this.container.addEventListener('scroll', (e) => {
      if (e.target.scrollTop !== 0) return
      this.eventHandlers.scrollContainer.call(this, e.target)
    })
  }

  scrollDown() {
    this.container.scrollTop = this.container.scrollHeight
  }

  async drawMessageList(list) {
    //console.log('drawMessageList', list)
    for (const message of list) {
      const dateMsg = dateFormat(message.created, 'dd.mm.yy');
      if (this.checkLastMsgDate(dateMsg)) {

        console.log('this.lastDate', this.lastDate)
        this.drawDateMessage(this.lastDate);
        this.scrollDown()
        this.lastDate = dateMsg;

      }
      this.drawOneMessage(message, true)
      this.scrollDown(this.container)
    }
    if (this.container.scrollHeight === 0) {
      const newList = await this.eventHandlers.needMoreMessages.call(this);
      if (newList) {
        await this.drawMessageList(newList)
        this.scrollDown()
      }
    }
    this.drawDateMessage(this.lastDate)
    this.scrollDown()
  }

  drawDateMessage(date) {
    const msg = new DateMessageView(this.container);
    msg.drawDateMessage(date)
    this.scrollDown()
  }

  drawOneMessage(msg, revers) {
    MessageView.changeDateAndTypeFormat(msg)
    const msgView = new MessageView(this.container);
    msgView.drawMessage(msg, revers)
    this.scrollDown()
  }

  checkLastMsgDate(dateMsg) {
    return this.lastDate > dateMsg;
  }

}
