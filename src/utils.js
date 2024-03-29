
export function proxyEvent(from, to, event) {
  from.on(event, (...args) => to.emit(event, ...args));
}
