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

const searchBarEl = document.querySelector("#search-bar");
const searchBarInputEl = document.querySelector("#search-bar-input");
const searchBarFormEl = document.querySelector("#search-bar-form");
const searchBarBtnCloseEl = document.querySelector("#search-bar-btn-close");
const searchBarResultGroupEl = document.querySelector(
  "#search-bar-result-group"
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

  trendingTopicsListEl.appendChild(
    ElementBuilder.buildTrendingTopicsList(trendingSearchTerms)
  );

  document
    .querySelectorAll(".trending-topic")
    .forEach((el) => el.addEventListener("click", handleTrendingTopicClick));
};

const displayTrendingGifos = async function () {
  const gifos = await giphy.getTrendingGifs();

  trendingGifos.addGifos(gifos);

  for (let gifo of gifos) {
    const gifoEl = ElementBuilder.buildGifo(gifo, GIFO_FORMAT.TRENDING);
    addListenersToGifo(gifoEl, gifo);
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
      addListenersToGifo(gifoEl, gifo);
      gifosGalleryEl.appendChild(gifoEl);
    }

    if (!giphy.hasMoreResults()) hideElement(viewMoreButtonEl);
  } else {
    hideElement(viewMoreButtonEl);
    showElement(noContentEl);
  }
};

const displayMoreSearchedGifos = async function () {
  const gifos = await giphy.nextSearchResults();

  if (gifos.length > 0) {
    searchedGifos.addGifos(gifos);

    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, GIFO_FORMAT.SEARCHED);
      addListenersToGifo(gifoEl, gifo);
      gifosGalleryEl.appendChild(gifoEl);
    }
    if (!giphy.hasMoreResults()) hideElement(viewMoreButtonEl);
  } else {
    hideElement(viewMoreButtonEl);
  }
};

const displayMoreFavoriteGifos = function () {
  const gifos = favoriteGifos.nextN(DEFAULT_GIFOS_DISPLAYED);

  if (gifos.length > 0) {
    favoriteGifosOnDisplay.addGifos(gifos);

    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, GIFO_FORMAT.SEARCHED);
      addListenersToGifo(gifoEl, gifo);
      gifosGalleryEl.appendChild(gifoEl);
    }
    if (favoriteGifos.hasNext()) {
      showElement(viewMoreButtonEl);
    } else {
      hideElement(viewMoreButtonEl);
    }
  } else {
    hideElement(viewMoreButtonEl);
    showElement(noContentEl);
  }
};

const displayMoreMyGifos = function () {
  const gifos = myGifos.nextN(DEFAULT_GIFOS_DISPLAYED);

  if (gifos.length > 0) {
    myGifosOnDisplay.addGifos(gifos);

    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, GIFO_FORMAT.MY_GIFOS);

      addListenersToGifo(gifoEl, gifo);
      gifosGalleryEl.appendChild(gifoEl);
    }
    if (myGifos.hasNext()) {
      showElement(viewMoreButtonEl);
    } else {
      hideElement(viewMoreButtonEl);
    }
  } else {
    hideElement(viewMoreButtonEl);
    showElement(noContentEl);
  }
};

const displaySearchAutocompletionResults = async function (searchTerm) {
  const autocompletionResults = await giphy.autocompleteSearch(searchTerm);

  let innerHtmlTemp = "";
  for (let result of autocompletionResults) {
    innerHtmlTemp += ElementBuilder.buildAutocompletionSearchElement(result);
  }

  searchBarResultGroupEl.innerHTML = innerHtmlTemp;
  document
    .querySelectorAll(".search-bar-result")
    .forEach((el) =>
      el.addEventListener(
        "click",
        buildHandlersearchBarResultClick(el.dataset.searchterm)
      )
    );
};

/**
 *
 * @param {HTMLElement} gifoEl
 * @param {Gifo} gifo
 * @returns
 */
const addListenersToGifo = function (gifoEl, gifo) {
  gifoEl.addEventListener("click", buildHandlerGifoClick(gifo));

  gifoEl
    .querySelector(".button-fav")
    ?.addEventListener("click", buildHandlerGifoFavButtonClick(gifo));

  gifoEl
    .querySelector(".button-delete")
    ?.addEventListener("click", buildHandlerGifoDeleteButtonClick(gifo));

  gifoEl
    .querySelector(".button-download")
    ?.addEventListener("click", buildHandlerDownloadGifo(gifo));

  gifoEl
    .querySelector(".button-max")
    ?.addEventListener("click", buildHandlerGifoMaxButtonClick(gifo));

  return gifoEl;
};

const updateSearchTerm = function (newSearchTerm) {
  searchTermTitleEl.innerText = newSearchTerm;
};

const removesearchBarResults = function () {
  document.querySelectorAll(".search-bar-result").forEach((el) => el.remove());
};

const removePreviouslyDisplayedGifos = function () {
  document.querySelectorAll(".searched-gifo").forEach((el) => el.remove());
};

const showActivesearchBarElements = function () {
  document
    .querySelectorAll(".active-search-show")
    .forEach((el) => el.classList.remove("display-none"));

  document
    .querySelectorAll(".active-search-hide")
    .forEach((el) => el.classList.add("display-none"));

  searchBarEl.classList.add("search-bar-expanded");
};

const hideActivesearchBarElements = function () {
  document
    .querySelectorAll(".active-search-show")
    .forEach((el) => el.classList.add("display-none"));

  document
    .querySelectorAll(".active-search-hide")
    .forEach((el) => el.classList.remove("display-none"));

  searchBarEl.classList.remove("search-bar-expanded");
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

/**
 * Removes the `display-none` class to the given HTMLElement,
 * displaying the element on the DOM.
 * @param {HTMLElement} htmlElement
 */
const showElement = function (htmlElement) {
  htmlElement.classList.remove("display-none");
};

/**
 * Adds the `display-none` class to the given HTMLElement,
 * removing it from the DOM.
 * @param {HTMLElement} htmlElement
 */
const hideElement = function (htmlElement) {
  htmlElement.classList.add("display-none");
};

const showElements = function (nodeListOfHtmlElements) {
  nodeListOfHtmlElements.forEach((el) => el.classList.remove("display-none"));
};

const hideElements = function (nodeListOfHtmlElements) {
  nodeListOfHtmlElements.forEach((el) => el.classList.add("display-none"));
};

// GENERAL FUNCTIONS

const executeNewSearch = function (searchTerm) {
  searchBarInputEl.value = searchTerm;
  searchBarInputEl.blur();

  removePreviouslyDisplayedGifos();
  hideActivesearchBarElements();
  removesearchBarResults();
  displaySearchedGifos(searchTerm);
  updateSearchTerm(searchTerm);
  showOnSearchElements();
  showElement(viewMoreButtonEl);
  hideElement(noContentEl);
};

/**
 *
 * @param {Gifo} gifo
 */
const setUpModal = function (gifo) {
  // sets the values of the predefined elements
  document
    .querySelector("#modal-gif")
    .setAttribute("src", gifo.getMp4Original());
  document.querySelector("#modal-username").textContent = gifo.username;
  document.querySelector("#modal-title").textContent = gifo.title;

  // button download config
  let modalButtonDownload = document.querySelector("#modal-button-download");
  modalButtonDownload = resetListeners(modalButtonDownload);
  modalButtonDownload.addEventListener("click", buildHandlerDownloadGifo(gifo));

  let modalButtonDelete = document.querySelector("#modal-button-delete");
  let modalButtonFav = document.querySelector("#modal-button-fav");
  if (gifo.isMyGifo()) {
    showElement(modalButtonDelete);
    hideElement(modalButtonFav);
    modalButtonDelete = resetListeners(modalButtonDelete);
    modalButtonDelete.addEventListener(
      "click",
      buildHandlerGifoDeleteButtonClick(gifo)
    );
  } else {
    // button fav config
    showElement(modalButtonFav);
    hideElement(modalButtonDelete);
    modalButtonFav = resetListeners(modalButtonFav);

    if (gifo.isFavorite()) {
      modalButtonFav.classList.add("favorite");
    } else {
      modalButtonFav.classList.remove("favorite");
    }
    modalButtonFav.addEventListener(
      "click",
      buildHandlerGifoFavButtonClick(gifo)
    );
  }

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
 * Removes all listeners from a html element.
 * @param {HTMLElement} htmlElement
 * @returns {HTMLElement} The same `htmlElement` withouth the listeners.
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
 * @param {InputEvent} e
 */
const handleSearchBarInput = function (e) {
  const value = e.target.value;

  if (value.length > 0) {
    showActivesearchBarElements();
    displaySearchAutocompletionResults(value);
  } else {
    hideActivesearchBarElements();
    removesearchBarResults();
  }
};

const handleSearchBarSubmit = function (e) {
  e.preventDefault();
  executeNewSearch(searchBarInputEl.value);
};

const handleSearchBarButtonCloseClick = function (e) {
  e.preventDefault();
  searchBarInputEl.value = "";
  hideActivesearchBarElements();
  removesearchBarResults();
};

const handleTrendingTopicClick = function (e) {
  e.preventDefault();
  executeNewSearch(e.target.innerText);
};

const handlesearchBarClick = function (e) {
  searchBarInputEl.focus();
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

const buildHandlersearchBarResultClick = function (searchTerm) {
  const handlesearchBarResultClick = function (e) {
    e.preventDefault();
    executeNewSearch(searchTerm);
  };

  return handlesearchBarResultClick;
};

/**
 *
 * @param {Gifo} gifo
 * @returns
 */
const buildHandlerDownloadGifo = function (gifo) {
  const handleDownloadGifoButtonClick = async function (e) {
    e.preventDefault();
    console.log("handleDownloadGifoButtonClick", "Downloading Gifo: " + gifo);
    console.log("gifo.getGifOriginal()", gifo.getGifOriginal());
    const blob = await fetch(gifo.getGifPreview()).then((res) => res.blob());
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = gifo.getTitle();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      const el = document.querySelector(`[data-gifo-id="${gifo.getId()}"]`);
      console.log("el", el);
      el.remove();
    } else {
      // gifo is not favorite, thus we add it to favorites.
      gifo.addToFavorites();
      favoriteGifosOnDisplay.addGifo(gifo);
      console.log("favoriteGifosOnDisplay", favoriteGifosOnDisplay);
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

const buildHandlerGifoClick = function (gifo) {
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
const initializeMain = function () {
  modalButtonCloseEl.addEventListener("click", hideModal);
  trendingGalleryButtonNextEl.addEventListener(
    "click",
    handleTrendingGalleryButtonNextClick
  );

  trendingGalleryButtonPreviousEl.addEventListener(
    "click",
    handleTrendingGalleryButtonPreviousClick
  );
  displayTrendingGifos();
};

const initializeIndexPage = function () {
  searchBarEl.addEventListener("click", handlesearchBarClick);
  searchBarInputEl.addEventListener("input", handleSearchBarInput);
  searchBarFormEl.addEventListener("submit", handleSearchBarSubmit);
  searchBarBtnCloseEl.addEventListener(
    "click",
    handleSearchBarButtonCloseClick
  );
  viewMoreButtonEl.addEventListener("click", (e) => displayMoreSearchedGifos());
  initializeMain();
  displayTrendingSearchTerms();

  // setUpModal(testGifo);
  // showModal();
};

const initializeFavoritesPage = function () {
  viewMoreButtonEl.addEventListener("click", (e) => displayMoreFavoriteGifos());
  favoriteGifos.addGifos(Local.getFavorites());
  displayMoreFavoriteGifos();
  initializeMain();
};

const initializeMyGifosPage = function () {
  viewMoreButtonEl.addEventListener("click", (e) => displayMoreMyGifos());
  myGifos.addGifos(Local.getMyGifos());
  displayMoreMyGifos();
  initializeMain();
};

export { initializeIndexPage, initializeFavoritesPage, initializeMyGifosPage };
