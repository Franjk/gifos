export default class GifoGallery {
  /**
   *
   * @param {Array<Gifo>} gifos
   */
  constructor(gifos = []) {
    this.gifos = gifos;
    this.index = 0;
  }

  addGifo(gifo) {
    this.gifos.push(gifo);
  }

  addGifos(gifos) {
    this.gifos = this.gifos.concat(gifos);
  }

  getCurrentGifo() {
    return this.gifos[this.index];
  }

  getGifo(index) {
    if (index > this.gifos.length - 1) index = this.gifos.length - 1;
    if (index < 0) index = 0;
    return this.gifos[index];
  }

  getLength() {
    return this.gifos.length;
  }

  clear() {
    this.gifos = [];
    this.index = 0;
  }

  setIndex(index) {
    let newIndex = index;
    if (index > this.gifos.length - 1) newIndex = this.gifos.length - 1;
    if (index < 0) newIndex = 0;

    this.index = newIndex;
  }

  setCurrentGifo(gifo) {
    this.index = this.gifos.map((el) => el.id).indexOf(gifo.id);
  }

  hasNext() {
    return this.index < this.gifos.length - 1;
  }

  hasPrevious() {
    return this.index > 0;
  }

  next() {
    if (this.index < this.gifos.length - 1) this.index += 1;
    return this.gifos[this.index];
  }

  previous() {
    if (this.index > 0) this.index -= 1;
    return this.gifos[this.index];
  }
}
