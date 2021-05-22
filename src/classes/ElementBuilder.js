export default class ElementBuilder {
  static buildAutocompletionSearchElement = function (term) {
    return `
      <div class="searchbar-result" data-searchterm="${term}">
        <img
          class="icon-search-result"
          src="./assets/icon-search.svg"
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

  static buildGifo(gifo, classList) {
    const favoriteClass = gifo.isFavorite() ? "favorite" : "";
    const downloadLink = gifo.getDownloadLink();
    const gifoEl = document.createElement("div");
    gifoEl.classList = classList;
    gifoEl.innerHTML = `
      <video
        src="${gifo.imgUrl}"
        autoplay
        loop
      ></video>
      <div class="gifo-overlay"></div>
      <div class="button-group">
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
        <a 
          class="gifo-button button-download"
          href="${downloadLink}"
          target="_blank"
          download="${gifo.title}.mp4"
          >
          <img
            src="./assets/icon-download-hover.svg"
            alt="icon download hover"
            />
          
        </a>
        <button class="gifo-button button-max">
          <img
            src="./assets/icon-max-hover.svg"
            alt="icon max hover"
            />
        </button>
      </div>
      <div class="gifo-description">
        <p class="gifo-username">${gifo.username}</p>
        <p class="gifo-title">${gifo.title}</p>
      </div>
      `;

    return gifoEl;
  }
}
