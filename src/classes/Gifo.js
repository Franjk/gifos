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
  };

  /**
   *
   * @param {string} title
   * @param {string} username
   */
  constructor(id = "", title = "", username = "") {
    this.id = id;
    this.title = title;
    this.username = username;

    this.gallery = null;
  }

  getDownloadLink() {
    return `https://i.giphy.com/media/${this.id}/giphy.mp4`;
  }

  getLink() {
    return `https://media.giphy.com/media/${this.id}/giphy.gif`;
  }

  getGifURI(uriType) {
    switch (uriType) {
      case Gifo.URI_TYPE.ORIGINAL:
        return `https://media2.giphy.com/media/${this.id}/giphy.gif`;
      case Gifo.URI_TYPE.ORIGINAL_MP4:
        return `https://media2.giphy.com/media/${this.id}/giphy.mp4`;
      case Gifo.URI_TYPE.DOWNSIZED:
        return `https://media2.giphy.com/media/${this.id}/giphy-downsized.gif`;
      case Gifo.URI_TYPE.DOWNSIZED_SMALL:
        return `https://media2.giphy.com/media/${this.id}/giphy-downsized-small.mp4`;
      case Gifo.URI_TYPE.PREVIEW_GIF:
        return `https://media2.giphy.com/media/${this.id}/giphy-preview.gif`;
      case Gifo.URI_TYPE.PREVIEW:
        return `https://media2.giphy.com/media/${this.id}/giphy-preview.mp4`;
      default:
        return `https://media2.giphy.com/media/${this.id}/giphy.gif`;
    }
  }

  /**
   *src="https://media2.giphy.com/media/Rlxfht52POeHMUrner/giphy-downsized.gif"
   * @param {Gallery} gifoGallery
   */
  setGallery(gallery) {
    this.gallery = gallery;
  }

  /**
   *
   * @returns {Gallery} GifoGallery
   */
  getGallery() {
    return this.gallery;
  }

  isFavorite() {
    const favorites = Local.getFavorites();

    return favorites.map((fav) => fav.id).includes(this.id);
  }

  addToFavorites() {
    const favorites = Local.getFavorites();
    favorites.push({
      id: this.id,
      username: this.username,
      title: this.title,
    });
    Local.saveFavorites(favorites);
  }

  removeFromFavorites() {
    const favorites = Local.getFavorites();
    const filteredFavorites = favorites.filter((fav) => fav.id !== this.id);
    Local.saveFavorites(filteredFavorites);
  }

  isMyGifo() {
    const myGifos = Local.getMyGifos();

    return myGifos.map((myGifo) => myGifo.id).includes(this.id);
  }

  addToMyGifos() {
    const myGifos = Local.getMyGifos();
    myGifos.push({
      id: this.id,
      username: this.username,
      title: this.title,
    });
    Local.saveMyGifos(myGifos);
  }

  removeFromMyGifos() {
    const myGifos = Local.getMyGifos();
    const filteredMyGifos = myGifos.filter((myGifo) => myGifo.id !== this.id);
    Local.saveMyGifos(filteredMyGifos);
  }
}
