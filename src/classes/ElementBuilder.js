import Gifo from "./Gifo.js";

export default class ElementBuilder {
  static buildAutocompletionSearchElement = function (term) {
    return `
      <div class="searchbar-result" data-searchterm="${term}">
        <img
          class="icon-search-result dark-theme-hide"
          src="./assets/icon-search.svg"
          alt="icon-search"
          />
        
          <img
          class="icon-search-result dark-theme-show"
          src="./assets/icon-search-modo-noct.svg"
          alt="icon-search"
          />
  
        <p class="searchbar-result-text">${term}</p>
      </div>
    `;
  };

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

    return innerHtmlTemp;
  };

  static buildGifo(gifo, format) {
    const favoriteClass = gifo.isFavorite() ? "favorite" : "";
    const downloadLink = gifo.getLink();
    const gifoEl = document.createElement("div");
    const uriType = "original_mp4";

    gifoEl.classList.add("gifo");
    if (format === "TRENDING") gifoEl.classList.add("trending-gifo");
    if (format === "SEARCHED") gifoEl.classList.add("searched-gifo");
    if (format === "MY_GIFOS") gifoEl.classList.add("searched-gifo");

    const buttonFavorites = `
      <button class="gifo-button button-fav ${favoriteClass}">
        <img
          class="icon-fav"
          src="./assets/icon-fav-hover.svg"
          alt="icon fav"
          />
        <img
          class="icon-fav-active"
          src="./assets/icon-fav-active.svg"
          alt="icon fav active"
          />
      </button>
    `;

    const buttonDelete = `
      <button class="gifo-button button-delete">
        <img
          class="icon-fav"
          src="./assets/icon-trash-hover.svg"
          alt="icon fav"
          />
      </button>
    `;

    const buttonDownload = `
      <button
      class="gifo-button button-download"
      >
        <img
          src="./assets/icon-download-hover.svg"
          alt="icon download hover"
          />
      
      </button>
    `;

    const buttonExpand = `
      <button class="gifo-button button-max">
        <img
          src="./assets/icon-max-hover.svg"
          alt="icon max hover"
          />
      </button>
    `;

    gifoEl.innerHTML = `
      <video
        src="${gifo.getGifURI(uriType)}"
        autoplay
        loop
      ></video>
      <div class="gifo-overlay"></div>
      <div class="button-group">
        ${format === "MY_GIFOS" ? buttonDelete : buttonFavorites}
        ${buttonDownload}
        ${buttonExpand}
      </div>
      <div class="gifo-description">
        <p class="gifo-username">${gifo.username}</p>
        <p class="gifo-title">${gifo.title}</p>
      </div>
      `;

    return gifoEl;
  }
}
