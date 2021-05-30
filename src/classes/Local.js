import Gifo from "./Gifo.js";

export default class Local {
  static FAVORITES_KEY = "favorites";
  static MY_GIFOS_KEY = "my-gifos";
  static DARK_MODE_KEY = "dark-mode";
  static DEFAULT_LIMIT = 12;
  static DEFAULT_OFFSET = 0;

  /**
   * Gets the favorite Gifos stored in the local storage.
   * @returns {Array<Gifo>} An array of `Gifo`
   */
  static getFavorites() {
    const strFavorites = localStorage.getItem(Local.FAVORITES_KEY);
    const parsedStr = JSON.parse(strFavorites) || [];
    return parsedStr.map((el) => Gifo.createGifo(el));
  }

  /**
   * Saves the given array of gifos to the favorite gifos section in the local storage.
   * @param {Array<Gifo>} favoriteGifos
   */
  static saveFavorites(favoriteGifos) {
    localStorage.setItem(Local.FAVORITES_KEY, JSON.stringify(favoriteGifos));
  }

  /**
   * Deletes all favorite gifos in the local storage.
   */
  static clearFavorites() {
    const favorites = [];
    localStorage.setItem(Local.FAVORITES_KEY, JSON.stringify(favorites));
  }

  /**
   * Gets the my-gifos Gifos stored in the local storage.
   * @returns {Array<Gifo>} An array of `Gifo`
   */
  static getMyGifos() {
    const strMyGifos = localStorage.getItem(Local.MY_GIFOS_KEY);
    const parsedStr = JSON.parse(strMyGifos) || [];
    return parsedStr.map((el) => Gifo.createGifo(el));
  }

  /**
   * Saves the given array of gifos to the my-gifos section in the local storage.
   * @param {Array<Gifo>} myGifos
   */
  static saveMyGifos(myGifos) {
    localStorage.setItem(Local.MY_GIFOS_KEY, JSON.stringify(myGifos));
  }

  /**
   * Deletes all my-gifos gifos in the local storage.
   */
  static clearMyGifos() {
    const myGifos = [];
    localStorage.setItem(Local.MY_GIFOS_KEY, JSON.stringify(myGifos));
  }

  /**
   * Consults if the dark-mode theme is stored in the local storage.
   * @returns {boolean} `true` if dark mode is activated.
   */
  static isDarkMode() {
    const data = JSON.parse(localStorage.getItem(Local.DARK_MODE_KEY));
    return data || false;
  }

  /**
   * Saves the dark-mode theme state in the local storage.
   * @param {boolean} darkMode
   */
  static setDarkMode(darkMode) {
    if (darkMode !== true) darkMode = false;

    const data = darkMode;
    localStorage.setItem(Local.DARK_MODE_KEY, JSON.stringify(data));
  }

  /**
   * Changes the state of the dark-mode in the local storage.
   * If the current value is `true` then is set to `false` and
   * viceversa.
   */
  static toggleDarkMode() {
    Local.setDarkMode(!Local.isDarkMode());
  }
}
