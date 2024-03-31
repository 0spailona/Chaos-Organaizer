import MessageView from "../message/messageView";
import dateFormat from "dateformat";
import DateMessageView from "../changeDateMessage/changeDateMessage";
import MessageContentView from "../contentMessage/messageContentView";
import emitter from "component-emitter";

export default class ContentView extends emitter {
  constructor(container) {
    super();
    this.container = container;
    this.today = dateFormat(new Date, 'dd.mm.yy');
    this.lastDate = this.today;
    this.messages = [];
    this.addListeners();
    this.whole = 0;
  }

  addListeners() {
    this.scrollDown()
    this.container.addEventListener('scroll', e => {
        if (e.target.scrollTop === 0) {
          this.emit('needMoreMessages')
          this.scrollTop()
        }
      }
    )
  }

  isWholeContainer() {
    if (this.container.clientHeight < this.container.scrollHeight) {
      this.whole++;
    }
  }


  scrollDown() {
    this.container.scrollTop = this.container.scrollHeight
  }

  scrollTop() {
    this.container.scrollTop = '10hv'
  }

  drawMessageList(list,filter) {
    console.log('drawMessageList',filter)
    for (const message of list) {
      const dateMsg = dateFormat(message.created, 'dd.mm.yy');
      if (this.checkLastMsgDate(dateMsg)) {
        //console.log('this.lastDate', this.lastDate)
        this.drawDateMessage(this.lastDate);
        this.lastDate = dateMsg;
      }
      if(!filter || filter === 'Messages' || filter === 'Favorites') this.drawOneMessage(message, true)
      else {
        console.log('drawMessageList else',filter)
        this.drawContentMessage(message, filter)
      }
    }
    if(!filter || filter === 'Messages'|| filter === 'Favorites' ) this.drawDateMessage(this.lastDate)

  }

  drawDateMessage(date) {
    const msg = new DateMessageView(this.container);
    msg.drawDateMessage(date)
  }

  drawContentMessage(message,filter){
    console.log('drawContentMessage',filter)
    MessageView.changeDateAndTypeFormat(message)
    const messageContentView = new MessageContentView(this.container,filter)
    messageContentView.drawContentMessage(message)
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
    if (!revers) this.scrollDown()
    this.isWholeContainer()
    if (revers && this.whole <= 1) this.scrollDown()
  }

  checkLastMsgDate(dateMsg) {
    return this.lastDate > dateMsg;
  }

  cleanContentContainer() {
    //console.log('scrollTop', this.container.scrollTop)
    if (this.container.scrollTop === 0) this.emit('needMoreMessages')
    this.container.innerHTML = '';
    this.whole = 0;

    //console.log('contentView cleanContentContainer')
  }

}
