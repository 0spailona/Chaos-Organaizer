import MessageView from "../message/messageView";
import dateFormat from "dateformat";
import DateMessageView from "../changeDateMessage/changeDateMessage";
import emitter from "component-emitter";

export default class ContentView extends emitter {
  constructor(container) {
    super();
    this.container = container;
    this.today = dateFormat(new Date, 'dd.mm.yy');
    this.lastDate = this.today;
    this.messages = [];
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
    console.log('scroll')
    this.container.scrollTop = this.container.scrollHeight
  }

  drawMessageList(list) {
    if(list.length === 0) return
    //console.log('drawMessageList list',list)
    //if(list.length === 0) return
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
    this.messages.push(msgView);
    msgView.on('toFavoriteById', (id) => this.emit('toFavorite', id))
    msgView.on('setToPinData', (data) => this.emit('setToPin', data))
    msgView.on('showOptions', (msgWithOptions) => {
      for (const msg of this.messages) {
        if (msg !== msgWithOptions) {
          msg.hideOptions()
        }
      }
    })
    msgView.on('toFavorite', (msg) => this.emit('toFavorite', this))
    msgView.drawMessage(msg, revers)
    this.scrollDown()
  }

  checkLastMsgDate(dateMsg) {
    return this.lastDate > dateMsg;
  }

  cleanContentContainer() {
    console.log('scrollTop', this.container.scrollTop)
    if (this.container.scrollTop === 0) this.emit('needMoreMessages')
    this.container.innerHTML = '';

    console.log('contentView cleanContentContainer')
  }


}
