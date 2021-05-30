export default class Gallery {
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
    gifo.setGallery(this);
  }

  addGifos(gifos) {
    this.gifos = this.gifos.concat(gifos);
    gifos.forEach((gifo) => gifo.setGallery(this));
  }

  removeGifo(gifo) {
    if (this.getGifoIndex(gifo) >= this.gifos.length - 1) this.index -= 1;
    this.gifos = this.gifos.filter((g) => g.id !== gifo.id);
  }

  getCurrentGifo() {
    return this.gifos[this.index];
  }

  getGifoIndex(gifo) {
    return this.gifos.map((el) => el.id).indexOf(gifo.id);
  }

  getGifo(index) {
    if (index > this.gifos.length - 1) index = this.gifos.length - 1;
    if (index < 0) index = 0;
    return this.gifos[index];
  }

  getGifos(startIndex = 0, amount = 0) {
    if (amount === 0) return [];
    if (this.gifos.length === 0) return [];

    if (startIndex > this.gifos.length - 1) {
      startIndex = this.gifos.length - 1;
      amount = 1;
    }

    if (startIndex < 0) {
      startIndex = 0;
      amount = 1;
    }

    if (startIndex + amount > this.gifos.length) {
      amount = this.gifos.length - startIndex;
    }

    return this.gifos.slice(startIndex, startIndex + amount);
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

  nextN(n) {
    if (n <= 0) return [];
    const nextGifos = this.getGifos(this.index, n);
    this.index = this.index + nextGifos.length;
    return nextGifos;
  }

  previousN(n) {
    if (n <= 0) return [];
    const previousGifos = this.getGifos(this.index - n, n);
    this.index -= previousGifos.length;
    return previousGifos;
  }
}
