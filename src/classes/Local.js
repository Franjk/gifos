import Gifo from "./Gifo.js";

export default class Local {
  static FAVORITES_KEY = "favorites";
  static MY_GIFOS_KEY = "my-gifos";
  static DARK_MODE = "dark-mode";

  static getFavorites() {
    const strFavorites = localStorage.getItem(Local.FAVORITES_KEY);
    const parsedStr = JSON.parse(strFavorites) || [];
    return parsedStr.map((el) => Gifo.createGifo(el));
  }

  static saveFavorites(favoriteGifos) {
    localStorage.setItem(Local.FAVORITES_KEY, JSON.stringify(favoriteGifos));
  }

  static clearFavorites() {
    const favorites = [];
    localStorage.setItem(Local.FAVORITES_KEY, JSON.stringify(favorites));
  }

  static getMyGifos() {
    const strMyGifos = localStorage.getItem(Local.MY_GIFOS_KEY);
    const parsedStr = JSON.parse(strMyGifos) || [];
    return parsedStr.map((el) => Gifo.createGifo(el));
  }

  static saveMyGifos(myGifos) {
    localStorage.setItem(Local.MY_GIFOS_KEY, JSON.stringify(myGifos));
  }

  static clearMyGifos() {
    const myGifos = [];
    localStorage.setItem(Local.MY_GIFOS_KEY, JSON.stringify(myGifos));
  }

  static getDarkMode() {
    const data = JSON.parse(localStorage.getItem(Local.DARK_MODE));
    return data || false;
  }

  static setDarkMode(darkMode) {
    if (darkMode !== true) darkMode = false;

    const data = darkMode;
    localStorage.setItem(Local.DARK_MODE, JSON.stringify(data));
  }

  static toggleDarkMode() {
    Local.setDarkMode(!Local.getDarkMode());
  }

  constructor() {}
}
