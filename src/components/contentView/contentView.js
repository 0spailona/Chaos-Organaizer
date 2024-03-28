import MessageView from "../message/messageView";
import dateFormat from "dateformat";
import DateMessageView from "../changeDateMessage/changeDateMessage";
import emitter from "component-emitter";

export default class ContentView extends emitter{
  constructor(container) {
    super();
    this.container = container;
    this.today = dateFormat(new Date, 'dd.mm.yy');
    this.lastDate = this.today;
    this.addListeners()
  }

   addListeners() {
    this.scrollDown()
    this.container.addEventListener('scroll', e => {
        if (e.target.scrollTop === 0) this.emit('needMoreMessages')
      }
    )
  }

  scrollDown() {
    this.container.scrollTop = this.container.scrollHeight
  }

  drawMessageList(list) {
    for (const message of list) {
      const dateMsg = dateFormat(message.created, 'dd.mm.yy');
      if (this.checkLastMsgDate(dateMsg)) {

        console.log('this.lastDate', this.lastDate)
        this.drawDateMessage(this.lastDate);
        this.lastDate = dateMsg;

      }
      this.drawOneMessage(message, true)
    }

    this.drawDateMessage(this.lastDate)
    this.scrollDown()
  }

  drawDateMessage(date) {
    const msg = new DateMessageView(this.container);
    msg.drawDateMessage(date)
    //this.scrollDown()
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
