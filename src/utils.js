
export function proxyEvent(from, to, event) {
  from.on(event, (...args) => to.emit(event, ...args));
}

export function isCyrillicSymbols(string){
  return !!string.search(/[А-яЁё]/);

}
