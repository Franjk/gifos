import ElementBuilder from "../classes/ElementBuilder.js";
import Gifo from "../classes/Gifo.js";
import Gallery from "../classes/Gallery.js";
import Giphy from "../classes/Giphy.js";
import Local from "../classes/Local.js";

const API_KEY = "w5DZnpvGHBZdjQuJDW8TfKjyAtngoYnt";
const DESKTOP_MIN_WIDTH = 768;
const DEFAULT_GIFOS_DISPLAYED = 12;
const GIFO_FORMAT = {
  TRENDING: "TRENDING",
  SEARCHED: "SEARCHED",
  MY_GIFOS: "MY_GIFOS",
};

const giphy = new Giphy(API_KEY);

const searchedGifos = new Gallery();
const trendingGifos = new Gallery();
const favoriteGifos = new Gallery();
const favoriteGifosOnDisplay = new Gallery();
const myGifos = new Gallery();
const myGifosOnDisplay = new Gallery();

const testGifo = Gifo.createGifo({
  id: "4Fh44tu3DiaJkmv6Ou",
  title: "May Chinese GIF by INTO ACTION",
  username: "IntoAction",
});

trendingGifos.addGifo(testGifo);

const searchbarEl = document.querySelector("#searchbar");
const searchbarInputEl = document.querySelector("#searchbar-input");
const searchbarFormEl = document.querySelector("#searchbar-form");
const searchbarButtonCloseEl = document.querySelector(
  "#searchbar-button-close"
);
const searchbarResultGroupEl = document.querySelector(
  "#searchbar-result-group"
);
const trendingTopicsListEl = document.querySelector("#trending-topics-list");
const gifosGalleryEl = document.querySelector("#gifos-gallery");
const searchTermTitleEl = document.querySelector("#search-term-title");
const viewMoreButtonEl = document.querySelector("#view-more-button");
const noContentEl = document.querySelector("#no-content");
const modalButtonCloseEl = document.querySelector("#modal-button-close");
const trendingGifosGalleryEl = document.querySelector(
  "#trending-gifos-gallery"
);
const trendingGalleryButtonPreviousEl = document.querySelector(
  "#trending-gallery-button-previous"
);
const trendingGalleryButtonNextEl = document.querySelector(
  "#trending-gallery-button-next"
);

// DOM MANIPULATION FUNCTIONS

const displayTrendingSearchTerms = async function () {
  const trendingSearchTerms = await giphy.getTrendingSearchTerms(5);
  trendingTopicsListEl.innerHTML =
    ElementBuilder.buildTrendingTopicsList(trendingSearchTerms);
  document
    .querySelectorAll(".trending-topic")
    .forEach((el) => el.addEventListener("click", handleTrendingTopicClick));
};

const displayTrendingGifos = async function () {
  const gifos = await giphy.getTrendingGifs();

  trendingGifos.addGifos(gifos);

  for (let gifo of gifos) {
    const gifoEl = ElementBuilder.buildGifo(gifo, GIFO_FORMAT.TRENDING);

    gifoEl.addEventListener("click", buildHandlerGifoTouchEnd(gifo));

    gifoEl
      .querySelector(".button-fav")
      .addEventListener("click", buildHandlerGifoFavButtonClick(gifo));

    gifoEl
      .querySelector(".button-download")
      .addEventListener("click", buildHandlerDownloadGifo(gifo));

    gifoEl
      .querySelector(".button-max")
      .addEventListener("click", buildHandlerGifoMaxButtonClick(gifo));

    trendingGifosGalleryEl.appendChild(gifoEl);
  }
};

const displaySearchedGifos = async function (searchTerm) {
  const gifos = await giphy.searchGifs(searchTerm);

  searchedGifos.clear();

  if (gifos.length > 0) {
    searchedGifos.addGifos(gifos);
    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, GIFO_FORMAT.SEARCHED);

      gifoEl.addEventListener("click", buildHandlerGifoTouchEnd(gifo));

      gifoEl
        .querySelector(".button-fav")
        .addEventListener("click", buildHandlerGifoFavButtonClick(gifo));

      gifoEl
        .querySelector(".button-download")
        .addEventListener("click", buildHandlerDownloadGifo(gifo));

      gifoEl
        .querySelector(".button-max")
        .addEventListener("click", buildHandlerGifoMaxButtonClick(gifo));

      gifosGalleryEl.appendChild(gifoEl);
    }

    if (!giphy.hasMoreResults()) hideViewMoreButtonElement();
  } else {
    hideViewMoreButtonElement();
    showNoContentElement();
  }
};

const displayMoreSearchedGifos = async function () {
  const gifos = await giphy.nextSearchResults();

  if (gifos.length > 0) {
    searchedGifos.addGifos(gifos);

    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, GIFO_FORMAT.SEARCHED);

      gifoEl.addEventListener("click", buildHandlerGifoTouchEnd(gifo));

      gifoEl
        .querySelector(".button-fav")
        .addEventListener("click", buildHandlerGifoFavButtonClick(gifo));

      gifoEl
        .querySelector(".button-download")
        .addEventListener("click", buildHandlerDownloadGifo(gifo));

      gifoEl
        .querySelector(".button-max")
        .addEventListener("click", buildHandlerGifoMaxButtonClick(gifo));

      gifosGalleryEl.appendChild(gifoEl);
    }
    if (!giphy.hasMoreResults()) hideViewMoreButtonElement();
  } else {
    hideViewMoreButtonElement();
  }
};

const displayMoreFavoriteGifos = function () {
  const gifos = favoriteGifos.nextN(DEFAULT_GIFOS_DISPLAYED);

  if (gifos.length > 0) {
    favoriteGifosOnDisplay.addGifos(gifos);

    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, GIFO_FORMAT.SEARCHED);

      gifoEl.addEventListener("click", buildHandlerGifoTouchEnd(gifo));

      gifoEl
        .querySelector(".button-fav")
        .addEventListener("click", buildHandlerGifoFavButtonClick(gifo));

      gifoEl
        .querySelector(".button-download")
        .addEventListener("click", buildHandlerDownloadGifo(gifo));

      gifoEl
        .querySelector(".button-max")
        .addEventListener("click", buildHandlerGifoMaxButtonClick(gifo));

      gifosGalleryEl.appendChild(gifoEl);

      if (favoriteGifos.hasNext()) {
        showViewMoreButtonElement();
      } else {
        hideViewMoreButtonElement();
      }
    }
  } else {
    hideViewMoreButtonElement();
    showNoContentElement();
  }
};

const displayMoreMyGifos = function () {
  const gifos = myGifos.nextN(DEFAULT_GIFOS_DISPLAYED);

  if (gifos.length > 0) {
    myGifosOnDisplay.addGifos(gifos);

    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, GIFO_FORMAT.MY_GIFOS);

      gifoEl.addEventListener("click", buildHandlerGifoTouchEnd(gifo));

      gifoEl
        .querySelector(".button-delete")
        .addEventListener("click", buildHandlerGifoDeleteButtonClick(gifo));

      gifoEl
        .querySelector(".button-download")
        .addEventListener("click", buildHandlerDownloadGifo(gifo));

      gifoEl
        .querySelector(".button-max")
        .addEventListener("click", buildHandlerGifoMaxButtonClick(gifo));

      gifosGalleryEl.appendChild(gifoEl);

      if (myGifos.hasNext()) {
        showViewMoreButtonElement();
      } else {
        hideViewMoreButtonElement();
      }
    }
  } else {
    hideViewMoreButtonElement();
    showNoContentElement();
  }
};

const displaySearchAutocompletionResults = async function (searchTerm) {
  const autocompletionResults = await giphy.autocompleteSearch(searchTerm);

  let innerHtmlTemp = "";
  for (let result of autocompletionResults) {
    innerHtmlTemp += ElementBuilder.buildAutocompletionSearchElement(result);
  }

  searchbarResultGroupEl.innerHTML = innerHtmlTemp;
  document
    .querySelectorAll(".searchbar-result")
    .forEach((el) =>
      el.addEventListener(
        "click",
        buildHandlerSearchbarResultClick(el.dataset.searchterm)
      )
    );
};

const updateSearchTerm = function (newSearchTerm) {
  searchTermTitleEl.innerText = newSearchTerm;
};

const removeSearchbarResults = function () {
  document.querySelectorAll(".searchbar-result").forEach((el) => el.remove());
};

const removePreviouslyDisplayedGifos = function () {
  document.querySelectorAll(".searched-gifo").forEach((el) => el.remove());
};

const showActiveSearchbarElements = function () {
  document
    .querySelectorAll(".active-search-show")
    .forEach((el) => el.classList.remove("display-none"));

  document
    .querySelectorAll(".active-search-hide")
    .forEach((el) => el.classList.add("display-none"));

  searchbarEl.classList.add("searchbar-expanded");
};

const hideActiveSearchbarElements = function () {
  document
    .querySelectorAll(".active-search-show")
    .forEach((el) => el.classList.add("display-none"));

  document
    .querySelectorAll(".active-search-hide")
    .forEach((el) => el.classList.remove("display-none"));

  searchbarEl.classList.remove("searchbar-expanded");
};

const showOnSearchElements = function () {
  document
    .querySelectorAll(".onsearch-show")
    .forEach((el) => el.classList.remove("display-none"));
};

const hideOnSearchElements = function () {
  document
    .querySelectorAll(".onsearch-show")
    .forEach((el) => el.classList.add("display-none"));
};

const showNoContentElement = function () {
  noContentEl.classList.remove("display-none");
};

const hideNoContentElement = function () {
  noContentEl.classList.add("display-none");
};

const showViewMoreButtonElement = function () {
  viewMoreButtonEl.classList.remove("display-none");
};

const hideViewMoreButtonElement = function () {
  viewMoreButtonEl.classList.add("display-none");
};

const showModal = function () {
  document.querySelector("#modal").classList.remove("display-none");
  document.querySelector("#modal-overlay").classList.remove("display-none");
  document.body.classList.add("overflow-hidden");
};

const hideModal = function () {
  document.querySelector("#modal").classList.add("display-none");
  document.querySelector("#modal-overlay").classList.add("display-none");
  document.body.classList.remove("overflow-hidden");
};

const showElement = function (htmlElement) {
  htmlElement.classList.remove("display-none");
};

const hideElement = function (htmlElement) {
  htmlElement.classList.add("display-none");
};

// GENERAL FUNCTIONS

const executeNewSearch = function (searchTerm) {
  searchbarInputEl.value = searchTerm;
  searchbarInputEl.blur();

  removePreviouslyDisplayedGifos();
  hideActiveSearchbarElements();
  removeSearchbarResults();
  displaySearchedGifos(searchTerm);
  updateSearchTerm(searchTerm);
  showOnSearchElements();
  showViewMoreButtonElement();
  hideNoContentElement();
};

const setUpModal = function (gifo) {
  // sets the values of the predefined elements
  document
    .querySelector("#modal-video")
    .setAttribute("src", gifo.getGifURI(Gifo.URI_TYPE.ORIGINAL_MP4));
  document.querySelector("#modal-username").textContent = gifo.username;
  document.querySelector("#modal-title").textContent = gifo.title;

  // button download config
  const modalButtonDownload = document.querySelector("#modal-button-download");
  modalButtonDownload.setAttribute("href", gifo.getDownloadLink());
  modalButtonDownload.setAttribute("target", "_blank");
  modalButtonDownload.setAttribute("download", gifo.title + ".mp4");

  // button fav config
  const modalButtonFav = resetListeners(
    document.querySelector("#modal-button-fav")
  );

  if (gifo.isFavorite()) {
    modalButtonFav.classList.add("favorite");
  } else {
    modalButtonFav.classList.remove("favorite");
  }
  modalButtonFav.addEventListener(
    "click",
    buildHandlerGifoFavButtonClick(gifo)
  );

  // button next & previous config
  gifo.getGallery().setCurrentGifo(gifo);

  const modalButtonNext = resetListeners(
    document.querySelector("#modal-button-next")
  );

  const modalButtonPrevious = resetListeners(
    document.querySelector("#modal-button-previous")
  );

  if (gifo.getGallery().hasNext()) {
    showElement(modalButtonNext);
    modalButtonNext.addEventListener("click", (e) => {
      setUpModal(gifo.getGallery().next());
    });
  } else {
    hideElement(modalButtonNext);
  }

  if (gifo.getGallery().hasPrevious()) {
    showElement(modalButtonPrevious);
    modalButtonPrevious.addEventListener("click", (e) => {
      setUpModal(gifo.getGallery().previous());
    });
  } else {
    hideElement(modalButtonPrevious);
  }
};

/**
 *
 * @param {HTMLElement} htmlElement
 */
const resetListeners = function (htmlElement) {
  const parent = htmlElement.parentElement;
  const id = htmlElement.id;

  htmlElement.replaceWith(htmlElement.cloneNode(true));

  return parent.querySelector("#" + id);
};

// HANDLERS

/**
 *
 * @param {*} e
 */
const handleSearchbarInput = function (e) {
  const value = e.target.value;

  if (value.length > 0) {
    showActiveSearchbarElements();
    displaySearchAutocompletionResults(value);
  } else {
    hideActiveSearchbarElements();
    removeSearchbarResults();
  }
};

const handleSearchbarSubmit = function (e) {
  e.preventDefault();
  executeNewSearch(searchbarInputEl.value);
};

const handleSearchbarButtonCloseClick = function (e) {
  e.preventDefault();
  searchbarInputEl.value = "";
  hideActiveSearchbarElements();
  removeSearchbarResults();
};

const handleTrendingTopicClick = function (e) {
  e.preventDefault();
  executeNewSearch(e.target.innerText);
};

const handleIndexViewMoreButtonClick = function (e) {
  e.preventDefault();
  displayMoreSearchedGifos();
};

const handleFavoritesViewMoreButtonClick = function (e) {
  e.preventDefault();
  displayMoreFavoriteGifos();
};

const handleMyGifosViewMoreButtonClick = function (e) {
  e.preventDefault();
  displayMoreMyGifos();
};

const handleSearchbarClick = function (e) {
  searchbarInputEl.focus();
};

const handleTrendingGalleryButtonNextClick = function (e) {
  trendingGifosGalleryEl.scroll({
    left: trendingGifosGalleryEl.scrollLeft + window.innerWidth * 0.75,
    behavior: "smooth",
  });
};

const handleTrendingGalleryButtonPreviousClick = function (e) {
  trendingGifosGalleryEl.scroll({
    left: trendingGifosGalleryEl.scrollLeft - window.innerWidth * 0.75,
    behavior: "smooth",
  });
};

const buildHandlerSearchbarResultClick = function (searchTerm) {
  const handleSearchbarResultClick = function (e) {
    e.preventDefault();
    executeNewSearch(searchTerm);
  };

  return handleSearchbarResultClick;
};

const buildHandlerDownloadGifo = function (gifo) {
  const handleDownloadGifoButtonClick = function (e) {
    const a = document.createElement("a");

    a.href = gifo.getDownloadLink();
    a.target = "_blank";
    a.download = gifo.title + ".mp4";
    console.log("a click");
    a.click();
  };

  return handleDownloadGifoButtonClick;
};

const buildHandlerGifoFavButtonClick = function (gifo) {
  const handleFavGifoButtonClick = function (e) {
    e.preventDefault();

    console.log("handleFavGifoButtonClick", gifo, e.target, e.currentTarget);
    if (gifo.isFavorite()) {
      gifo.removeFromFavorites();
      e.currentTarget.classList.remove("favorite");
      // 'currentTarget' is used instead of 'target' to select the button instead
      // of its children elements
    } else {
      gifo.addToFavorites();
      e.currentTarget.classList.add("favorite");
    }
  };

  return handleFavGifoButtonClick;
};

const buildHandlerGifoDeleteButtonClick = function (gifo) {
  const handleGifoDeleteButtonClick = function (e) {
    gifo.removeFromMyGifos();
    location.reload();
  };

  return handleGifoDeleteButtonClick;
};

const buildHandlerGifoTouchEnd = function (gifo) {
  const handleGifoTouchEnd = function (e) {
    e.preventDefault();
    // when in full screen does not open the modal when
    // clicking the gifo
    if (window.screen.width > DESKTOP_MIN_WIDTH) return;
    setUpModal(gifo);
    showModal();
  };

  return handleGifoTouchEnd;
};

const buildHandlerGifoMaxButtonClick = function (gifo) {
  const handleGifoMaxButtonClick = function (e) {
    e.preventDefault();
    setUpModal(gifo);
    showModal();
  };

  return handleGifoMaxButtonClick;
};

const buildHandlerModalButtonNextClick = function (gifo) {
  const handleModalButtonNextClick = function (e) {
    if (gifo.getGallery().hasNext()) {
      const nextGifo = gifo.getGallery().next();
      setUpModal(nextGifo);
    }
  };
  return handleModalButtonNextClick;
};

// MAIN
const initializeIndexPage = function () {
  searchbarEl.addEventListener("click", handleSearchbarClick);
  searchbarInputEl.addEventListener("input", handleSearchbarInput);
  searchbarFormEl.addEventListener("submit", handleSearchbarSubmit);
  searchbarButtonCloseEl.addEventListener(
    "click",
    handleSearchbarButtonCloseClick
  );
  viewMoreButtonEl.addEventListener("click", handleIndexViewMoreButtonClick);
  modalButtonCloseEl.addEventListener("click", hideModal);
  trendingGalleryButtonNextEl.addEventListener(
    "click",
    handleTrendingGalleryButtonNextClick
  );

  trendingGalleryButtonPreviousEl.addEventListener(
    "click",
    handleTrendingGalleryButtonPreviousClick
  );

  displayTrendingSearchTerms();
  displayTrendingGifos();

  // setUpModal(testGifo);
  // showModal();
};

const initializeFavoritesPage = function () {
  viewMoreButtonEl.addEventListener(
    "click",
    handleFavoritesViewMoreButtonClick
  );
  modalButtonCloseEl.addEventListener("click", hideModal);
  trendingGalleryButtonNextEl.addEventListener(
    "click",
    handleTrendingGalleryButtonNextClick
  );

  trendingGalleryButtonPreviousEl.addEventListener(
    "click",
    handleTrendingGalleryButtonPreviousClick
  );

  favoriteGifos.addGifos(Local.getFavorites());
  displayMoreFavoriteGifos();
  displayTrendingGifos();
};

const initializeMyGifosPage = function () {
  viewMoreButtonEl.addEventListener("click", (e) => displayMoreMyGifos());
  modalButtonCloseEl.addEventListener("click", hideModal);
  trendingGalleryButtonNextEl.addEventListener(
    "click",
    handleTrendingGalleryButtonNextClick
  );

  trendingGalleryButtonPreviousEl.addEventListener(
    "click",
    handleTrendingGalleryButtonPreviousClick
  );

  myGifos.addGifos(Local.getMyGifos());
  displayMoreMyGifos();
  displayTrendingGifos();
};

export { initializeIndexPage, initializeFavoritesPage, initializeMyGifosPage };
