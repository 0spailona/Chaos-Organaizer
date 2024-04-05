import Controller from "./controller";
import Api from "./api";
import MainView from "./mainView";

//const url = "http://http://localhost:7070/api";
const url = "https://chaos-organizer-server.onrender.com/api";
const container = document.querySelector("#root");
const mainView = new MainView(container);
const api = new Api(url);

new Controller(mainView, api);

