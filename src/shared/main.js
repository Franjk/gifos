import ElementBuilder from "../classes/ElementBuilder.js";
import Gifo from "../classes/Gifo.js";
import Gallery from "../classes/Gallery.js";
import Giphy from "../classes/Giphy.js";
import Local from "../classes/Local.js";

const API_KEY = "w5DZnpvGHBZdjQuJDW8TfKjyAtngoYnt";
const DESKTOP_MIN_WIDTH = 768;
const DEFAULT_GIFOS_DISPLAYED = 12;
const PAGES = {
  INDEX: "INDEX",
  FAVORITES: "FAVORITES",
  MY_GIFOS: "MY_GIFOS",
};

const giphy = new Giphy(API_KEY);
const gallery = new Gallery();
const trendingGifos = new Gallery();
const localGifos = new Gallery();

// since the index, favorites and myGifos pages share this same script, the
// page variable stores the page where this script is executed to perform
// page-specific functionality.
let page;

// section-main
const searchBarEl = document.querySelector("#search-bar");
const searchBarInputEl = document.querySelector("#search-bar-input");
const searchBarFormEl = document.querySelector("#search-bar-form");
const searchBarBtnCloseEl = document.querySelector("#search-bar-btn-close");
const searchBarResultGroupEl = document.querySelector("#search-bar-result-group");
const searchTermTitleEl = document.querySelector("#search-term-title");
const trendingTopicsListEl = document.querySelector("#trending-topics-list");

// section-gallery
const sectionGalleryEl = document.querySelector("#section-gallery");
const gifosGalleryEl = document.querySelector("#gifos-gallery");
const noContentEl = document.querySelector("#no-content");
const viewMoreButtonEl = document.querySelector("#view-more-button");

// modal
const modalEl = document.querySelector("#modal");
const modalButtonCloseEl = document.querySelector("#modal-button-close");
const modalGifEl = document.querySelector("#modal-gif");
const modalOverlayEl = document.querySelector("#modal-overlay");
const modalUsernameEl = document.querySelector("#modal-username");
const modalTitleEl = document.querySelector("#modal-title");

// trending-section
const trendingGalleryEl = document.querySelector("#trending-gallery");
const trendingGalleryBtnPreviousEl = document.querySelector("#trending-gallery-btn-previous");
const trendingGalleryBtnNextEl = document.querySelector("#trending-gallery-btn-next");

// DOM MANIPULATION FUNCTIONS

const displayTrendingSearchTerms = async function () {
  const trendingSearchTerms = await giphy.getTrendingSearchTerms(5);

  trendingTopicsListEl.appendChild(ElementBuilder.buildTrendingTopicsList(trendingSearchTerms));

  document
    .querySelectorAll(".trending-topic")
    .forEach((el) => el.addEventListener("click", handleTrendingTopicClick));
};

const displayTrendingGifos = async function () {
  const gifos = await giphy.getTrendingGifs();

  trendingGifos.addGifos(gifos);

  for (let gifo of gifos) {
    const gifoEl = ElementBuilder.buildGifo(gifo, Gifo.TYPE.TRENDING);
    addListenersToGifo(gifoEl, gifo);
    trendingGalleryEl.appendChild(gifoEl);
  }
};

const displaySearchedGifos = async function (searchTerm) {
  const gifos = await giphy.searchGifs(searchTerm);

  gallery.clear();

  if (gifos.length > 0) {
    gallery.addGifos(gifos);
    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, Gifo.TYPE.SEARCHED);
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
    gallery.addGifos(gifos);

    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, Gifo.TYPE.SEARCHED);
      addListenersToGifo(gifoEl, gifo);
      gifosGalleryEl.appendChild(gifoEl);
    }
    if (!giphy.hasMoreResults()) hideElement(viewMoreButtonEl);
  } else {
    hideElement(viewMoreButtonEl);
  }
};

const displayMoreFavoriteGifos = function (n = DEFAULT_GIFOS_DISPLAYED) {
  const gifos = localGifos.nextN(n);

  if (gifos.length > 0) {
    gallery.addGifos(gifos);

    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, Gifo.TYPE.FAVORITE);
      addListenersToGifo(gifoEl, gifo);
      gifosGalleryEl.appendChild(gifoEl);
    }

    if (localGifos.hasNext()) {
      showElement(viewMoreButtonEl);
    } else {
      hideElement(viewMoreButtonEl);
    }

    hideElement(noContentEl);
  } else {
    hideElement(viewMoreButtonEl);
    showElement(noContentEl);
  }
};

const displayMoreMyGifos = function () {
  const gifos = localGifos.nextN(DEFAULT_GIFOS_DISPLAYED);

  if (gifos.length > 0) {
    gallery.addGifos(gifos);

    for (let gifo of gifos) {
      const gifoEl = ElementBuilder.buildGifo(gifo, Gifo.TYPE.MY_GIFOS);

      addListenersToGifo(gifoEl, gifo);
      gifosGalleryEl.appendChild(gifoEl);
    }
    if (localGifos.hasNext()) {
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
      el.addEventListener("click", buildHandlersearchBarResultClick(el.dataset.searchterm))
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

const showModal = function () {
  modalEl.classList.remove("display-none");
  modalOverlayEl.classList.remove("display-none");
  document.body.classList.add("overflow-hidden");
};

const hideModal = function () {
  modalEl.classList.add("display-none");
  modalOverlayEl.classList.add("display-none");
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
  showElement(sectionGalleryEl);
  showElement(viewMoreButtonEl);
  hideElement(noContentEl);
};

/**
 *
 * @param {Gifo} gifo
 */
const setUpModal = function (gifo) {
  // sets the values of the predefined elements
  modalGifEl.setAttribute("src", gifo.getMp4Original());
  modalUsernameEl.textContent = gifo.username;
  modalTitleEl.textContent = gifo.title;

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
    modalButtonDelete.addEventListener("click", buildHandlerGifoDeleteButtonClick(gifo));
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
    modalButtonFav.addEventListener("click", buildHandlerGifoFavButtonClick(gifo));
  }

  // button next & previous config
  gifo.getGallery().setCurrentGifo(gifo);

  const modalButtonNext = resetListeners(document.querySelector("#modal-button-next"));

  const modalButtonPrevious = resetListeners(document.querySelector("#modal-button-previous"));

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
  searchBarInputEl.select();
};

const handleTrendingGalleryButtonNextClick = function (e) {
  trendingGalleryEl.scroll({
    left: trendingGalleryEl.scrollLeft + window.innerWidth * 0.75,
    behavior: "smooth",
  });
};

const handleTrendingGalleryButtonPreviousClick = function (e) {
  trendingGalleryEl.scroll({
    left: trendingGalleryEl.scrollLeft - window.innerWidth * 0.75,
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

    if (gifo.isFavorite()) {
      gifo.removeFromFavorites();
      e.currentTarget.classList.remove("favorite");

      // changes the favorite button of all elemements with the same id as
      // the gifo removed, to display the unfilled heart.
      document.querySelectorAll(`[data-gifo-id="${gifo.getId()}"]`).forEach((el) => {
        el.querySelector(".button-fav").classList.remove("favorite");
      });

      if (page === PAGES.FAVORITES) {
        // removes the element from the DOM
        sectionGalleryEl.querySelector(`[data-gifo-id="${gifo.getId()}"]`).remove();
        gallery.removeGifo(gifo);
        if (gallery.getLength() === 0) {
          hideElement(viewMoreButtonEl);
          showElement(noContentEl);
        }
      }
    } else {
      // changes the favorite button of all elemements with the same id as
      // the gifo removed, to display the filled heart.
      e.currentTarget.classList.add("favorite");
      document.querySelectorAll(`[data-gifo-id="${gifo.getId()}"]`).forEach((el) => {
        el.querySelector(".button-fav").classList.add("favorite");
      });
      gifo.addToFavorites();

      if (page === PAGES.FAVORITES) {
        localGifos.addGifo(gifo);
        displayMoreFavoriteGifos(1);
      }
    }
  };

  return handleFavGifoButtonClick;
};

const buildHandlerGifoDeleteButtonClick = function (gifo) {
  const handleGifoDeleteButtonClick = function (e) {
    e.preventDefault();

    document.querySelector(`[data-gifo-id="${gifo.getId()}"]`).remove();

    gifo.removeFromMyGifos();

    gallery.removeGifo(gifo);

    if (gallery.getLength() === 0) {
      hideElement(viewMoreButtonEl);
      showElement(noContentEl);
    }
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
  trendingGalleryBtnNextEl.addEventListener("click", handleTrendingGalleryButtonNextClick);

  trendingGalleryBtnPreviousEl.addEventListener("click", handleTrendingGalleryButtonPreviousClick);
  displayTrendingGifos();
};

const initializeIndexPage = function () {
  page = PAGES.INDEX;

  searchBarEl.addEventListener("click", handlesearchBarClick);
  searchBarInputEl.addEventListener("input", handleSearchBarInput);
  searchBarFormEl.addEventListener("submit", handleSearchBarSubmit);
  searchBarBtnCloseEl.addEventListener("click", handleSearchBarButtonCloseClick);
  viewMoreButtonEl.addEventListener("click", (e) => displayMoreSearchedGifos());
  initializeMain();
  displayTrendingSearchTerms();

  // setUpModal(testGifo);
  // showModal();
};

const initializeFavoritesPage = function () {
  page = PAGES.FAVORITES;

  viewMoreButtonEl.addEventListener("click", (e) => displayMoreFavoriteGifos());
  localGifos.addGifos(Local.getFavorites());
  displayMoreFavoriteGifos();
  initializeMain();
};

const initializeMyGifosPage = function () {
  page = PAGES.MY_GIFOS;

  viewMoreButtonEl.addEventListener("click", (e) => displayMoreMyGifos());
  localGifos.addGifos(Local.getMyGifos());
  displayMoreMyGifos();
  initializeMain();
};

export { initializeIndexPage, initializeFavoritesPage, initializeMyGifosPage };
