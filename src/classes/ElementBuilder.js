import Gifo from "./Gifo.js";

export default class ElementBuilder {
  /**
   * Builds the inner html of a search term.
   * @param {string} term The searched term
   * @returns A `string` representing the inner html of an element.
   */
  static buildAutocompletionSearchElement = function (term) {
    return `
      <div class="search-bar-result" data-searchterm="${term}">
        <div
          class="icon-search-result icon-search icon-search-dark-filter"
          ></div>
        <p class="search-bar-result-text">${term}</p>
      </div>
    `;
  };

  /**
   * Build an HTMLElement containing all the given trending topics
   * @param {Array<string>} trendingTopics
   * @returns {HTMLElement} `trendingListEl`
   */
  static buildTrendingTopicsList = function (trendingTopics) {
    let innerHtmlTemp = "";

    for (let i = 0; i < trendingTopics.length; i++) {
      const topic = trendingTopics[i];
      innerHtmlTemp += `<span class="trending-topic">${topic}</span>`;

      // at the last element of the list we do not add the comma
      if (i < trendingTopics.length - 1) {
        innerHtmlTemp += `<span>, </span>`;
      }
    }

    const trendingListEl = document.createElement("span");
    trendingListEl.innerHTML = innerHtmlTemp;

    return trendingListEl;
  };

  /**
   * Build a HTMLElement of a given Gifo according to its type.
   * @param {Gifo} gifo
   * @param {Gifo.TYPE} type
   * @returns {HTMLElement} `gifoEl`
   */
  static buildGifo(gifo, type) {
    const gifoEl = document.createElement("div");
    const src = gifo.getGifPreview();
    gifoEl.dataset.gifoId = gifo.getId();

    gifoEl.classList.add("gifo");
    if (type === Gifo.TYPE.TRENDING) {
      gifoEl.classList.add("trending-gifo");
    } else {
      gifoEl.classList.add("searched-gifo");
    }

    gifoEl.innerHTML = `
      <img
        class="gifo-gif"
        src="${src}"
      >
      <div class="gifo-overlay"></div>
      <div class="button-group">
        ${type === Gifo.TYPE.MY_GIFOS ? ElementBuilder.buttonDelete : ElementBuilder.buttonFavorite}
        ${ElementBuilder.buttonDownload}
        ${ElementBuilder.buttonExpand}
      </div>
      <div class="gifo-description">
        <p class="gifo-username">${gifo.username}</p>
        <p class="gifo-title">${gifo.title}</p>
      </div>
      `;

    if (gifo.isFavorite()) {
      gifoEl.querySelector(".button-fav")?.classList.add("favorite");
    }

    return gifoEl;
  }

  static buttonDelete = `
    <button class="gifo-button button-delete icon-delete"></button>
  `;

  static buttonDownload = `
    <button class="gifo-button button-download icon-download"></button>
    `;

  static buttonExpand = `
    <button class="gifo-button button-max icon-max"></button>
    `;

  static buttonFavorite = `
    <button class="gifo-button button-fav icon-fav"></button>
  `;
}
