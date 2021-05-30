import Gallery from "./Gallery.js";
import Local from "./Local.js";

export default class Gifo {
  static createGifo(gifoObject) {
    return new Gifo(gifoObject.id, gifoObject.title, gifoObject.username);
  }

  static URI_TYPE = {
    ORIGINAL: "original",
    ORIGINAL_MP4: "original_mp4", //mp4
    DOWNSIZED: "downsized",
    DOWNSIZED_SMALL: "downsized_small", //mp4
    PREVIEW: "preview", // mp4
    PREVIEW_GIF: "preview_gif",
    PREVIEW_WEBP: "preview_webp",
  };

  static TYPE = {
    SEARCHED: "SEARCHED",
    TRENDING: "TRENDING",
    FAVORITE: "FAVORITE",
    MY_GIFOS: "MY-GIFOS",
  };

  /**
   * Construct an instance of the Gifo object
   * @param {string} id
   * @param {string} title
   * @param {string} username
   * @param {string} gifOriginal The url of the gif original format
   * @param {string} gifPreview The url of the gif preview format
   * @param {string} mp4Original The url of the mp4 original format
   */
  constructor(
    id = "",
    title = "",
    username = "",
    gifOriginal = "",
    gifPreview = "",
    mp4Original = ""
  ) {
    this.id = id;
    this.title = title;
    this.username = username;
    this.gifOriginal = gifOriginal;
    this.gifPreview = gifPreview;
    this.mp4Original = mp4Original;

    this.gallery = null;
  }

  getGifOriginal() {
    return this.gifOriginal || this.getURI(Gifo.URI_TYPE.ORIGINAL);
  }

  getMp4Original() {
    return this.mp4Original || this.getURI(Gifo.URI_TYPE.ORIGINAL_MP4);
  }

  getGifPreview() {
    return this.gifPreview || this.getURI(Gifo.URI_TYPE.ORIGINAL);
  }

  getTitle() {
    return this.title;
  }

  /**
   * Gets the link of the gifo to share.
   * @returns {string} The url to share
   */
  getLink() {
    return this.getURI(Gifo.URI_TYPE.ORIGINAL);
  }

  /**
   * Sets the title of the gifo.
   * @param {string} title
   */
  setTitle(title) {
    this.title = title;
  }

  getId() {
    return this.id;
  }

  /**
   * Takes the URI_TYPE definition and build a link to the page where the
   * media is located. To be used when the gifo does not have an assigned link.
   * @param {(Gifo.URI_TYPE)} uriType
   * @returns The url of the media.
   */
  getURI(uriType) {
    switch (uriType) {
      case Gifo.URI_TYPE.ORIGINAL:
        return `https://media.giphy.com/media/${this.id}/giphy.gif`;
      case Gifo.URI_TYPE.ORIGINAL_MP4:
        return `https://media.giphy.com/media/${this.id}/giphy.mp4`;
      case Gifo.URI_TYPE.DOWNSIZED:
        return `https://media.giphy.com/media/${this.id}/giphy-downsized.gif`;
      case Gifo.URI_TYPE.DOWNSIZED_SMALL:
        return `https://media.giphy.com/media/${this.id}/giphy-downsized-small.mp4`;
      case Gifo.URI_TYPE.PREVIEW_GIF:
        return `https://media.giphy.com/media/${this.id}/giphy-preview.gif`;
      case Gifo.URI_TYPE.PREVIEW:
        return `https://media.giphy.com/media/${this.id}/giphy-preview.mp4`;
      default:
        return `https://media.giphy.com/media/${this.id}/giphy.gif`;
    }
  }

  /**
   * Sets the gallery reference of the gifo.
   * @param {Gallery} gifoGallery
   */
  setGallery(gallery) {
    this.gallery = gallery;
  }

  /**
   * Sets the gallery reference of the gifo.
   * @returns {Gallery} GifoGallery
   */
  getGallery() {
    return this.gallery;
  }

  /**
   * Consults if the gifo is saved as a favorite.
   * @returns {boolean} `true` if the gifos is currently in favorites.
   */
  isFavorite() {
    const favorites = Local.getFavorites();

    return favorites.map((fav) => fav.id).includes(this.id);
  }

  /**
   * Add the gifo to favorites in the local storage.
   * @returns `this`
   */
  addToFavorites() {
    const favorites = Local.getFavorites();
    favorites.push({
      id: this.id,
      username: this.username,
      title: this.title,
    });
    Local.saveFavorites(favorites);
    return this;
  }

  /**
   * Remove the gifo from favorites in the local storage.
   * @returns `this`
   */
  removeFromFavorites() {
    const favorites = Local.getFavorites();
    const filteredFavorites = favorites.filter((fav) => fav.id !== this.id);
    Local.saveFavorites(filteredFavorites);
    return this;
  }

  /**
   * Consults if the gifo is in the my-gifos section in the local storage.
   * @returns {boolean} `true` if the gifo is in my-gifos.
   */
  isMyGifo() {
    const myGifos = Local.getMyGifos();

    return myGifos.map((myGifo) => myGifo.id).includes(this.id);
  }

  /**
   * Add the gifo to the my-gifos sectino in the local storage.
   * @returns `this`
   */
  addToMyGifos() {
    const myGifos = Local.getMyGifos();
    myGifos.push({
      id: this.id,
      username: this.username,
      title: this.title,
    });
    Local.saveMyGifos(myGifos);
    return this;
  }

  /**
   * Removes the gifo from the my-gifos sectino in the local storage.
   * @returns `this`
   */
  removeFromMyGifos() {
    const myGifos = Local.getMyGifos();
    const filteredMyGifos = myGifos.filter((myGifo) => myGifo.id !== this.id);
    Local.saveMyGifos(filteredMyGifos);
    return this;
  }

  toString() {
    return `[Gifo] {id: ${this.id}, title: ${this.title}, username: ${this.username}}`;
  }
}
