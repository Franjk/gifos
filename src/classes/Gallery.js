export default class Gallery {
  /**
   *
   * @param {Array<Gifo>} gifos
   */
  constructor(gifos = []) {
    this.gifos = gifos;
    this.index = 0;
  }

  /**
   * Adds a Gifo to the gallery.
   * @param {Gifo} gifo
   */
  addGifo(gifo) {
    this.gifos.push(gifo);
    gifo.setGallery(this);
  }

  /**
   * Adds an array of gifos to the gallery.
   * @param {Array<Gifo>} gifos
   */
  addGifos(gifos) {
    this.gifos = this.gifos.concat(gifos);
    gifos.forEach((gifo) => gifo.setGallery(this));
  }

  /**
   * Removes gifo from the gallery.
   * @param {Gifo} gifo
   */
  removeGifo(gifo) {
    if (this.getGifoIndex(gifo) >= this.gifos.length - 1) this.index -= 1;
    this.gifos = this.gifos.filter((g) => g.id !== gifo.id);
  }

  /**
   * Gets the gifo at the current index.
   * @returns {Gifo} gifo.
   */
  getCurrentGifo() {
    return this.gifos[this.index];
  }

  /**
   * Returns the index of the given `gifo` in the gallery or -1 if not found.
   * @param {Gifo} gifo
   * @returns {number}
   */
  getGifoIndex(gifo) {
    return this.gifos.map((el) => el.id).indexOf(gifo.id);
  }

  /**
   * Gets the `Gifo` at the given index.
   * @param {number} index
   * @returns {Gifo} gifo
   */
  getGifo(index) {
    if (index > this.gifos.length - 1) index = this.gifos.length - 1;
    if (index < 0) index = 0;
    return this.gifos[index];
  }

  /**
   * Gets an array of `Gifos` form starting index to n.
   * If none exists returns an empty array.
   * @param {number} startIndex
   * @param {number} amount
   * @returns {Array<Gifo>}
   */
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

  /**
   * Gets the length of the gallery.
   * @returns The length of the gallery
   */
  getLength() {
    return this.gifos.length;
  }

  /**
   * Empties the gallery.
   */
  clear() {
    this.gifos = [];
    this.index = 0;
  }

  /**
   * Sets the new index of the gallery.
   * If the new index is out of bounds then it is automatically
   * bound to the largest (or smallest) index in the gallery.
   * @param {number} index New index of the gallery.
   */
  setIndex(index) {
    let newIndex = index;
    if (index > this.gifos.length - 1) newIndex = this.gifos.length - 1;
    if (index < 0) newIndex = 0;

    this.index = newIndex;
  }

  /**
   * Sets the index of the gallery to the given `Gifo`. That `Gifo` must
   * already exist in the gallery.
   * @param {Gifo} gifo
   */
  setCurrentGifo(gifo) {
    this.index = this.gifos.map((el) => el.id).indexOf(gifo.id);
  }

  /**
   * Consults if the gallery has a next `Gifo` in the following index.
   * @returns `true` if there is a next valid index.
   */
  hasNext() {
    return this.index < this.gifos.length - 1;
  }

  /**
   * Consults if the gallery has a previous `Gifo` in the previous index.
   * @returns `true` if there is a previous valid index.
   */
  hasPrevious() {
    return this.index > 0;
  }

  /**
   * Moves the index forward one position and returns the `Gifo` at
   * that position.
   * @returns {Gifo} The next `Gifo`
   */
  next() {
    if (this.index < this.gifos.length - 1) this.index += 1;
    return this.gifos[this.index];
  }

  /**
   * Moves the index backwards one position and returns the `Gifo` at
   * that position.
   * @returns {Gifo} The previous `Gifo`
   */
  previous() {
    if (this.index > 0) this.index -= 1;
    return this.gifos[this.index];
  }

  /**
   * Moves the index forward `n` positions and returns an array with the next
   * `n` gifos.
   * @param {number} n An `Integer`
   * @returns {Array<Gifo>} An array of the next `n` `Gifos` or an empty array
   * `[]` if there isn't any.
   */
  nextN(n) {
    if (n <= 0) return [];
    const nextGifos = this.getGifos(this.index, n);
    this.index = this.index + nextGifos.length;
    return nextGifos;
  }

  /**
   * Moves the index backwards `n` positions and returns an array with the previous
   * `n` gifos.
   * @param {number} n An `Integer`
   * @returns {Array<Gifo>} An array of the previous `n` `Gifos` or an empty array
   * `[]` if there isn't any.
   */
  previousN(n) {
    if (n <= 0) return [];
    const previousGifos = this.getGifos(this.index - n, n);
    this.index -= previousGifos.length;
    return previousGifos;
  }
}
