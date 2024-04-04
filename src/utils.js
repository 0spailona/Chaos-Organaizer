export function proxyEvent(from, to, event) {
  from.on(event, (...args) => to.emit(event, ...args));
}

export function replaceURLWithHTMLLinks(text) {
  if (!text) {
    return text;
  }

  // regex is taken from auto-link package
  text = text.replace(
    /((https?:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-/]))?/gi,
    url => {
      let full_url = url;
      if (!full_url.match(/^https?:\/\//)) {
        full_url = "http://" + full_url;
      }

      const link = document.createElement("a");
      link.href = full_url;
      link.innerText = url;
      link.setAttribute("target", "_blank");
      return link.outerHTML;
    }
  );
  return text;
}


