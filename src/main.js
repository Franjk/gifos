import ElementBuilder from "./classes/ElementBuilder.js";
import Gifo from "./classes/Gifo.js";
import GifoGallery from "./classes/GifoGallery.js";
import Giphy from "./classes/Giphy.js";

const API_KEY = "w5DZnpvGHBZdjQuJDW8TfKjyAtngoYnt";
const DESKTOP_MIN_WIDTH = 768;

const giphy = new Giphy(API_KEY);
const favoriteGifos = new GifoGallery();
const searchedGifos = new GifoGallery();
const trendingGifos = new GifoGallery();

const testGifo = Gifo.createGifo({
  id: "4Fh44tu3DiaJkmv6Ou",
  title: "May Chinese GIF by INTO ACTION",
  username: "IntoAction",
  imgUrl:
    "https://media4.giphy.com/media/fvf8V5uS0Ooywojrm0/giphy-preview.mp4?cid=e9eef115bfcw9158acwgnkpirxfu1m8f1fo5v0uma0hr96z9&rid=giphy-preview.mp4&ct=g",
  imgUrlFull:
    "https://media4.giphy.com/media/fvf8V5uS0Ooywojrm0/giphy.mp4?cid=e9eef115bfcw9158acwgnkpirxfu1m8f1fo5v0uma0hr96z9&rid=giphy.mp4&ct=g",
});

const searchbar = document.querySelector("#searchbar");
const searchbarInput = document.querySelector("#searchbar-input");
const searchbarForm = document.querySelector("#searchbar-form");
const searchbarButtonClose = document.querySelector("#searchbar-button-close");
const searchbarResultGroup = document.querySelector("#searchbar-result-group");
const trendingTopicsList = document.querySelector("#trending-topics-list");
const gifosGallery = document.querySelector("#gifos-gallery");
const searchTermTitle = document.querySelector("#search-term-title");
const viewMoreButton = document.querySelector("#view-more-button");
const noContent = document.querySelector("#no-content");
const trendingGifosGallery = document.querySelector("#trending-gifos-gallery");

// DOM MANIPULATION FUNCTIONS

const displayTrendingSearchTerms = async function () {
  const trendingSearchTerms = await giphy.getTrendingSearchTerms(5);
  trendingTopicsList.innerHTML =
    ElementBuilder.buildTrendingTopicsList(trendingSearchTerms);
  document
    .querySelectorAll(".trending-topic")
    .forEach((el) => el.addEventListener("click", handleTrendingTopicClick));
};

const displayTrendingGifos = async function () {
  const gifos = await giphy.getTrendingGifs();

  trendingGifos.addGifos(gifos);
  console.log(trendingGifos);

  for (let gifo of gifos) {
    gifo.gallery = trendingGifos;

    const classList = "gifo trending-gifo";
    const gifoEl = ElementBuilder.buildGifo(gifo, classList);

    gifoEl.addEventListener("click", buildHandlerGifoTouchEnd(gifo));

    gifoEl
      .querySelector(".button-fav")
      .addEventListener("click", buildHandlerGifoFavButtonClick(gifo));

    gifoEl
      .querySelector(".button-max")
      .addEventListener("click", buildHandlerGifoMaxButtonClick(gifo));

    trendingGifosGallery.appendChild(gifoEl);
  }
};

const displaySearchedGifos = async function (searchTerm) {
  const gifos = await giphy.searchGifs(searchTerm);

  searchedGifos.clear();
  searchedGifos.addGifos(gifos);

  if (gifos.length > 0) {
    for (let gifo of gifos) {
      gifo.gallery = searchedGifos;

      const classList = "gifo searched-gifo";
      const gifoEl = ElementBuilder.buildGifo(gifo, classList);

      gifoEl.addEventListener("click", buildHandlerGifoTouchEnd(gifo));

      gifoEl
        .querySelector(".button-fav")
        .addEventListener("click", buildHandlerGifoFavButtonClick(gifo));

      gifoEl
        .querySelector(".button-max")
        .addEventListener("click", buildHandlerGifoMaxButtonClick(gifo));

      gifosGallery.appendChild(gifoEl);
    }

    if (!giphy.hasMoreResults()) hideViewMoreButtonElement();
  } else {
    hideViewMoreButtonElement();
    showNoContentElement();
  }
};

// TODO ocultar el boton de view more !!

const displayMoreSearchedGifos = async function () {
  const gifos = await giphy.nextSearchResults();

  searchedGifos.addGifos(gifos);

  if (gifos.length > 0) {
    for (let gifo of gifos) {
      gifo.gallery = searchedGifos;

      const classList = "gifo searched-gifo";
      const gifoEl = ElementBuilder.buildGifo(gifo, classList);

      gifoEl.addEventListener("click", buildHandlerGifoTouchEnd(gifo));

      gifoEl
        .querySelector(".button-fav")
        .addEventListener("click", buildHandlerGifoFavButtonClick(gifo));

      gifoEl
        .querySelector(".button-max")
        .addEventListener("click", buildHandlerGifoMaxButtonClick(gifo));

      gifosGallery.appendChild(gifoEl);
    }
    if (!giphy.hasMoreResults()) hideViewMoreButtonElement();
  } else {
    hideViewMoreButtonElement();
  }
};

const displaySearchAutocompletionResults = async function (searchTerm) {
  const autocompletionResults = await giphy.autocompleteSearch(searchTerm);

  let innerHtmlTemp = "";
  for (let result of autocompletionResults) {
    innerHtmlTemp += ElementBuilder.buildAutocompletionSearchElement(result);
  }

  searchbarResultGroup.innerHTML = innerHtmlTemp;
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
  searchTermTitle.innerText = newSearchTerm;
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

  searchbar.classList.add("searchbar-expanded");
};

const hideActiveSearchbarElements = function () {
  document
    .querySelectorAll(".active-search-show")
    .forEach((el) => el.classList.add("display-none"));

  document
    .querySelectorAll(".active-search-hide")
    .forEach((el) => el.classList.remove("display-none"));

  searchbar.classList.remove("searchbar-expanded");
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
  noContent.classList.remove("display-none");
};

const hideNoContentElement = function () {
  noContent.classList.add("display-none");
};

const showViewMoreButtonElement = function () {
  viewMoreButton.classList.remove("display-none");
};

const hideViewMoreButtonElement = function () {
  viewMoreButton.classList.add("display-none");
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

// GENERAL FUNCTIONS

const executeNewSearch = function (searchTerm) {
  searchbarInput.value = searchTerm;
  searchbarInput.blur();

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
  document.querySelector("#modal-video").setAttribute("src", gifo.imgUrlFull);
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
  gifo.gallery.setCurrentGifo(gifo);

  const modalButtonNext = resetListeners(
    document.querySelector("#modal-button-next")
  );

  const modalButtonPrevious = resetListeners(
    document.querySelector("#modal-button-previous")
  );

  if (gifo.gallery.hasNext()) {
    modalButtonNext.classList.remove("display-none");
    modalButtonNext.addEventListener("click", (e) => {
      setUpModal(gifo.gallery.next());
    });
  } else {
    modalButtonNext.classList.add("display-none");
  }

  if (gifo.gallery.hasPrevious()) {
    modalButtonPrevious.classList.remove("display-none");
    modalButtonPrevious.addEventListener("click", (e) => {
      setUpModal(gifo.gallery.previous());
    });
  } else {
    modalButtonPrevious.classList.add("display-none");
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
  executeNewSearch(searchbarInput.value);
};

const handleSearchbarButtonCloseClick = function (e) {
  e.preventDefault();
  searchbarInput.value = "";
  hideActiveSearchbarElements();
  removeSearchbarResults();
};

const handleTrendingTopicClick = function (e) {
  e.preventDefault();
  executeNewSearch(e.target.innerText);
};

const handleViewMoreButtonClick = function (e) {
  e.preventDefault();
  displayMoreSearchedGifos();
};

const buildHandlerSearchbarResultClick = function (searchTerm) {
  const handleSearchbarResultClick = function (e) {
    e.preventDefault();
    executeNewSearch(searchTerm);
  };

  return handleSearchbarResultClick;
};

const buildHandlerDownloadGifo = function (gifo) {};

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
    if (gifo.gallery.hasNext()) {
      const nextGifo = gifo.gallery.next();
      setUpModal(nextGifo);
    }
  };
  return handleModalButtonNextClick;
};

const main = function () {
  searchbarInput.addEventListener("input", handleSearchbarInput);
  searchbarForm.addEventListener("submit", handleSearchbarSubmit);
  searchbarButtonClose.addEventListener(
    "click",
    handleSearchbarButtonCloseClick
  );
  viewMoreButton.addEventListener("click", handleViewMoreButtonClick);

  // modal config
  document
    .querySelector("#modal-button-close")
    .addEventListener("click", hideModal);

  displayTrendingSearchTerms();
  displayTrendingGifos();

  // setUpModal(testGifo);
  // showModal();
};

main();
