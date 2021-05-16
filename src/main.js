import ElementBuilder from "./ElementBuilder.js";
import Giphy from "./Giphy.js";

const API_KEY = "w5DZnpvGHBZdjQuJDW8TfKjyAtngoYnt";

const giphy = new Giphy(API_KEY);
const gifosArray = [];

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

  for (let gifo of gifos) {
    const classList = ["gifo", "trending-gifo"];
    const htmlElement = gifo.getVideoElement(classList);
    trendingGifosGallery.appendChild(htmlElement);
  }
};

const displaySearchedGifos = async function (searchTerm) {
  const gifos = await giphy.searchGifs(searchTerm);

  console.log(giphy.searchMetadata);
  if (gifos.length > 0) {
    for (let gifo of gifos) {
      const classList = ["gifo", "searched-gifo"];
      const htmlElement = gifo.getVideoElement(classList);
      gifosGallery.appendChild(htmlElement);
    }

    if (!giphy.hasMoreResults()) hideViewMoreButtonElement();
  } else {
    showNoContentElement();
  }
};

// TODO ocultar el boton de view more !!

const displayMoreSearchedGifos = async function () {
  const gifos = await giphy.nextSearchResults();
  console.log(giphy.searchMetadata);
  if (gifos.length > 0) {
    for (let gifo of gifos) {
      const classList = ["gifo", "searched-gifo"];
      const htmlElement = gifo.getVideoElement(classList);
      gifosGallery.appendChild(htmlElement);
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

const executeNewSearch = function (searchTerm) {
  searchbarInput.value = searchTerm;
  searchbarInput.blur();

  removePreviouslyDisplayedGifos();
  hideActiveSearchbarElements();
  removeSearchbarResults();
  displaySearchedGifos(searchTerm);
  updateSearchTerm(searchTerm);
  showOnSearchElements();
  // showViewMoreButtonElement();
  hideNoContentElement();
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

const main = function () {
  searchbarInput.addEventListener("input", handleSearchbarInput);
  searchbarForm.addEventListener("submit", handleSearchbarSubmit);
  searchbarButtonClose.addEventListener(
    "click",
    handleSearchbarButtonCloseClick
  );
  viewMoreButton.addEventListener("click", handleViewMoreButtonClick);

  displayTrendingSearchTerms();
  // displayTrendingGifos();
};

main();
