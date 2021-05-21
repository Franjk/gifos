import Gifo from "./Gifo.js";

export default class LocalGifo {
  static FAVORITES_KEY = "favorites";
  static MY_GIFOS_KEY = "my-gifos";

  static getFavorites() {
    const strFavorites = localStorage.getItem(LocalGifo.FAVORITES_KEY);
    const parsedStr = JSON.parse(strFavorites) || [];
    return parsedStr.map((el) => Gifo.createGifo(el));
  }

  static saveFavorites(favoriteGifos) {
    localStorage.setItem(
      LocalGifo.FAVORITES_KEY,
      JSON.stringify(favoriteGifos)
    );
  }

  static clearFavorites() {
    const favorites = [];
    localStorage.setItem(LocalGifo.FAVORITES_KEY, JSON.stringify(favorites));
  }

  static getMyGifos() {
    const strMyGifos = localStorage.getItem(LocalGifo.MY_GIFOS_KEY);
    const parsedStr = JSON.parse(strMyGifos) || [];
    return parsedStr.map((el) => Gifo.createGifo(el));
  }

  static saveMyGifos(myGifos) {
    localStorage.setItem(LocalGifo.MY_GIFOS_KEY, JSON.stringify(myGifos));
  }

  static clearMyGifos() {
    const myGifos = [];
    localStorage.setItem(LocalGifo.MY_GIFOS_KEY, JSON.stringify(myGifos));
  }

  constructor() {}
}
