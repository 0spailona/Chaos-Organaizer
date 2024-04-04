import messagesFilter from "./stringData";
import {slugify} from "transliteration";

export default class Api {
  constructor(url) {
    this.url = url;
  }

  createHeaders(coords, file) {
    const headers = {
      "Content-Type": file?.type ?? "text/plain",
    };

    if (file) {
        headers["X-File-Name"] = slugify(file.name);
        headers["X-File-describe"] = encodeURI(file.text);
    }

    if (coords) {
      headers["X-longitude"] = coords.longitude;
      headers["X-latitude"] = coords.latitude;
    }
    return headers;
  }

  async createNewFileMsg(file, coords) {
    const url = this.url + `/messages/file`;
    const headers = this.createHeaders(coords, file);
    const request = fetch(url, {
      method: "POST",
      credentials: "include",
      headers,
      body: file
    });
    const result = await request;
    if (!result.ok) {
      console.log(await result.text());
      return;
    }
    return await result.json();
  }

  async createNewTextMsg(text, coords) {
    //console.log('api text',text);
    const headers = this.createHeaders(coords, null);
    const url = this.url + `/messages/text`;
    const request = fetch(url, {
      method: "POST",
      credentials: "include",
      headers,
      body: text
    });
    const result = await request;
    if (!result.ok) {
      console.log(await result.text());
      return;
    }
    return await result.json();
  }

  async getLastMessagesList(options) {
    const {start, limit, filter, searchText} = options;
    let url;
    if (searchText) {
      url = this.url + `/messages?start=${start}&limit=${limit}&text=${searchText}`;
    }
    else if (filter && filter !== messagesFilter.messages && filter !== messagesFilter.search) {
      if (filter === messagesFilter.favorites) {
        url = this.url + `/messages?start=${start}&limit=${limit}&favorite=${true}`;
      }
      else {
        url = this.url + `/messages?start=${start}&limit=${limit}&type=${filter}`;
      }
    }
    else {
      url = this.url + `/messages?start=${start}&limit=${limit}`;
    }
    const request = fetch(url, {
      method: "GET",
      credentials: "include"
    });
    const result = await request;
    if (!result.ok) {
      console.log(await result.text());
      return;
    }
    return await result.json();
  }


  async toFavorite(id) {
    const url = this.url + `/messages/${id}`;
    const request = fetch(url, {
      method: "PATCH",
      credentials: "include",
      body: true
    });
    const result = await request;
    if (!result.ok) {
      console.log(await result.text());
      return false;
    }
    return true;
  }

  async setToPin(id) {
    const url = this.url + `/messages/pin`;
    const request = fetch(url, {
      method: "PUT",
      credentials: "include",
      body: id
    });
    const result = await request;
    if (!result.ok) {
      console.log(await result.text());
      return;
    }
    return await result.json();
  }

  async deletePinFromServer() {
    const url = this.url + `/messages/pin`;
    const request = fetch(url, {
      method: "DELETE",
      credentials: "include",
    });
    const result = await request;
    if (!result.ok) {
      console.log(await result.text());
    }
    return result;
  }

  async deleteMessage(id) {
    const url = this.url + `/messages/${id}`;
    const request = fetch(url, {
      method: "DELETE",
      credentials: "include",
    });
    const result = await request;
    if (!result.ok) {
      console.log(await result.text());
      return false;
    }
    return true;
  }

  async getPin() {
    const url = this.url + `/messages/pin`;
    const request = fetch(url, {
      method: "GET",
      credentials: "include",
    });
    const result = await request;
    if (result.status !== 200) {
      console.log(await result.text());
      return false;
    }
    return await result.json();
  }
}
