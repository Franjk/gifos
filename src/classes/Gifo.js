import GifoGallery from "./GifoGallery.js";
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

  getLink() {
    return `https://media.giphy.com/media/${this.id}/giphy.gif`;
  }

  /**
   *
   * @param {GifoGallery} gifoGallery
   */
  setGallery(gifoGallery) {
    this.gallery = gifoGallery;
  }

  /**
   *
   * @returns {GifoGallery} GifoGallery
   */
  getGallery() {
    return this.gallery;
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
  }

  removeFromFavorites() {
    const favorites = LocalGifo.getFavorites();
    const filteredFavorites = favorites.filter((fav) => fav.id !== this.id);
    LocalGifo.saveFavorites(filteredFavorites);
  }

  isMyGifo() {
    const myGifos = LocalGifo.getMyGifos();

    return myGifos.map((myGifo) => myGifo.id).includes(this.id);
  }

  addToMyGifos() {
    const myGifos = LocalGifo.getMyGifos();
    myGifos.push({
      id: this.id,
      username: this.username,
      title: this.title,
      imgUrl: this.imgUrl,
      imgUrlFull: this.imgUrlFull,
    });
    LocalGifo.saveMyGifos(myGifos);
  }

  removeFromMyGifos() {
    const myGifos = LocalGifo.getMyGifos();
    const filteredMyGifos = myGifos.filter((myGifo) => myGifo.id !== this.id);
    LocalGifo.saveMyGifos(filteredMyGifos);
  }
}
