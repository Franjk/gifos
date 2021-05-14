import Giphy from "./Giphy.js";

const API_KEY = "w5DZnpvGHBZdjQuJDW8TfKjyAtngoYnt";

const giphy = new Giphy(API_KEY);

const trendingGifosGallery = document.querySelector("#trending-gifos-gallery");
const trendingTopicsList = document.querySelector("#trending-topics-list");

const displayTrendingSearchTerms = async function () {
  const trendingSearchTerms = await giphy.getTrendingSearchTerms(5);
  trendingTopicsList.textContent = trendingSearchTerms.join(", ");
};

const displayTrendingGifos = async function () {
  const gifos = await giphy.getTrendingGifs(1);

  for (let gifo of gifos) {
    const classList = ["trending-gifo"];
    const htmlElement = gifo.getVideoElement(classList);
    trendingGifosGallery.appendChild(htmlElement);
  }
};

displayTrendingSearchTerms();
displayTrendingGifos();
