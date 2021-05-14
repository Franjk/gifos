export default class Gifo {
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
    (this.id = id),
      (this.title = title),
      (this.username = username),
      (this.imgUrl = imgUrl),
      (this.imgUrlFull = imgUrlFull);
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
}
