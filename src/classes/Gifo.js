import LocalGifo from "./LocalGifo.js";

export default class Gifo {
  static createGifo(gifoObject) {
    return new Gifo(
      gifoObject.id,
      gifoObject.title,
      gifoObject.username,
      gifoObject.imgUrl,
      gifoObject.imgUrlFull
    );
  }

  /**
   *
   * @param {string} title
   * @param {string} username
   * @param {string} imgUrl
   * @param {string} imgUrlFull
   */
  constructor(
    id = "",
    title = "",
    username = "",
    imgUrl = "",
    imgUrlFull = ""
  ) {
    this.id = id;
    this.title = title;
    this.username = username;
    this.imgUrl = imgUrl;
    this.imgUrlFull = imgUrlFull;
    this.gallery = null;
  }

  /**
   *
   * @param {Array<string>} classList
   * @returns {HTMLElement} videoElement
   */
  getVideoElement(classList) {
    const videoEl = document.createElement("video");

    videoEl.src = this.imgUrl;
    videoEl.autoplay = true;
    videoEl.loop = true;
    if (classList) videoEl.classList = classList.join(" ");

    return videoEl;
  }

  getDownloadLink() {
    return `https://i.giphy.com/media/${this.id}/giphy.mp4`;
  }

  isFavorite() {
    const favorites = LocalGifo.getFavorites();

    return favorites.map((fav) => fav.id).includes(this.id);
  }

  addToFavorites() {
    const favorites = LocalGifo.getFavorites();
    favorites.push({
      id: this.id,
      username: this.username,
      title: this.title,
      imgUrl: this.imgUrl,
      imgUrlFull: this.imgUrlFull,
    });
    LocalGifo.saveFavorites(favorites);

    console.log(LocalGifo.getFavorites());
  }

  removeFromFavorites() {
    const favorites = LocalGifo.getFavorites();
    const filteredFavorites = favorites.filter((fav) => fav.id !== this.id);
    LocalGifo.saveFavorites(filteredFavorites);

    console.log(LocalGifo.getFavorites());
  }
}
