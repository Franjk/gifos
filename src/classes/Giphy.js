import Gifo from "./Gifo.js";

export default class Giphy {
  static DEFAULT_LIMIT = 12;
  static DEFAULT_OFFSET = 0;
  static DEFAULT_RATING = "r";
  static DEFAULT_LANG = "en";

  static ENDPOINTS = {
    TRENDING: "api.giphy.com/v1/gifs/trending",
    SEARCH: "api.giphy.com/v1/gifs/search",
    TRANSLATE: "api.giphy.com/v1/gifs/translate",
    RANDOM: "api.giphy.com/v1/gifs/random",
    SEARCH_SUGGESTIONS: "api.giphy.com/v1/tags/related/", // api.giphy.com/v1/tags/related/{term}
    TRENDING_SEARCH_TERMS: "api.giphy.com/v1/trending/searches",
    AUTOCOMPLETE: "api.giphy.com/v1/gifs/search/tags",
    CATEGORIES: "api.giphy.com/v1/gifs/categories",
    UPLOAD: "upload.giphy.com/v1/gifs",
    GET_GIF_BY_ID: "api.giphy.com/v1/gifs", // {gif_id}
  };

  constructor(apiKey) {
    this.apiKey = apiKey;
    this.searchMetadata = {
      query: "",
      limit: Giphy.DEFAULT_LIMIT,
      offset: Giphy.DEFAULT_OFFSET,
      rating: Giphy.DEFAULT_RATING,
      lang: Giphy.DEFAULT_LANG,
      totalCount: 0,
    };
  }

  /**
   *
   * @param {String} partialSearchTerm
   * @return {Promise<Array<string>>} Completed search terms
   */
  autocompleteSearch(partialSearchTerm) {
    const url = `https://${Giphy.ENDPOINTS.AUTOCOMPLETE}?api_key=${this.apiKey}&q=${partialSearchTerm}`;

    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then(({ data, pagination, meta }) => {
          if (meta.status !== 200) throw new Error(meta.msg);
          const completedSearchTerms = data.map((el) => el.name);

          resolve(completedSearchTerms);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });
  }

  /**
   * Calls the Giphy API and returns an array of trending terms.
   * @param {number} limit - An Integer between 1 and 20. Default = 5.
   * @returns {Promise<Array<string>>} A `Promise` that resolves to an array of `String` with `numberOfTerms` trending terms.
   */
  getTrendingSearchTerms(limit = 5) {
    const url = `https://${Giphy.ENDPOINTS.TRENDING_SEARCH_TERMS}?api_key=${this.apiKey}`;

    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then(({ data, pagination, meta }) => {
          if (meta.status !== 200) throw new Error(meta.msg);
          const trendingSearchTerms = data.slice(0, limit);

          resolve(trendingSearchTerms);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });
  }

  /**
   *
   * @param {numner} limit
   * @param {number} offset
   * @param {string} rating
   * @returns {Promise<Array<Gifo>>}
   */
  getTrendingGifs(
    limit = Giphy.DEFAULT_LIMIT,
    offset = Giphy.DEFAULT_OFFSET,
    rating = Giphy.DEFAULT_RATING
  ) {
    const url = `https://${Giphy.ENDPOINTS.TRENDING}?api_key=${this.apiKey}&limit=${limit}&offset=${offset}&rating=${rating}`;

    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then(({ data, pagination, meta }) => {
          if (meta.status !== 200) throw new Error(meta.msg);

          const gifosArray = data.map((gifo) => {
            return new Gifo(
              gifo.id,
              gifo.title,
              gifo.username,
              gifo.images.preview.mp4,
              gifo.images.original_mp4.mp4
            );
          });

          // console.log("gifosArray", gifosArray);
          resolve(gifosArray);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });
  }

  getGifById(id) {
    const url = `https://${Giphy.ENDPOINTS.GET_GIF_BY_ID}/${id}?api_key=${this.apiKey}`;
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then(({ data, meta }) => {
          if (meta.status !== 200) throw new Error(meta.msg);
          const gifo = new Gifo(
            data.id,
            data.title,
            data.username,
            data.images.preview.mp4,
            data.images.original_mp4.mp4
          );
          resolve(gifo);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });
  }

  /**
   *
   * @param {string} query
   * @param {number} limit
   * @param {number} offset
   * @param {string} rating
   * @param {string} lang
   * @returns {Promise<Array<Gifo>>}
   */
  searchGifs(
    query = "",
    limit = Giphy.DEFAULT_LIMIT,
    offset = Giphy.DEFAULT_OFFSET,
    rating = Giphy.DEFAULT_RATING,
    lang = Giphy.DEFAULT_LANG
  ) {
    const url = `https://${Giphy.ENDPOINTS.SEARCH}?api_key=${this.apiKey}&q=${query}&limit=${limit}&offset=${offset}&rating=${rating}&lang=${lang}`;

    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then(({ data, pagination, meta }) => {
          if (meta.status !== 200) throw new Error(meta.msg);

          console.log(data);
          console.log(pagination);
          console.log(meta);
          this.searchMetadata = {
            query,
            limit,
            offset: limit,
            rating,
            lang,
            totalCount: pagination.total_count,
          };

          const gifosArray = data.map((gifo) => {
            return new Gifo(
              gifo.id,
              gifo.title,
              gifo.username,
              gifo.images.preview.mp4,
              gifo.images.original_mp4.mp4
            );
          });

          // console.log("gifosArray", gifosArray);
          resolve(gifosArray);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });
  }

  nextSearchResults() {
    const { query, limit, offset, rating, lang } = this.searchMetadata;
    const url = `https://${Giphy.ENDPOINTS.SEARCH}?api_key=${this.apiKey}&q=${query}&limit=${limit}&offset=${offset}&rating=${rating}&lang=${lang}`;

    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then(({ data, pagination, meta }) => {
          if (meta.status !== 200) throw new Error(meta.msg);

          this.searchMetadata.offset = offset + limit;

          const gifosArray = data.map((gifo) => {
            return new Gifo(
              gifo.id,
              gifo.title,
              gifo.username,
              gifo.images.preview.mp4,
              gifo.images.original_mp4.mp4
            );
          });

          // console.log("gifosArray", gifosArray);
          resolve(gifosArray);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });
  }

  getSearchMetadata() {
    return this.searchMetadata;
  }

  resetSearchMetadata() {
    this.searchMetadata = {
      query: "",
      limit: Giphy.DEFAULT_LIMIT,
      offset: Giphy.DEFAULT_OFFSET,
      rating: Giphy.DEFAULT_RATING,
      lang: Giphy.DEFAULT_LANG,
      totalCount: 0,
    };
  }

  hasMoreResults() {
    return this.searchMetadata.offset < this.searchMetadata.totalCount;
  }

  uploadGif(blob) {
    const url = `https://${Giphy.ENDPOINTS.UPLOAD}`;

    const form = new FormData();
    form.append("api_key", this.apiKey);
    form.append("file", blob, "myGif.gif");

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState == XMLHttpRequest.DONE) {
          const parsedResponse = JSON.parse(request.responseText);
          if (request.status === 200) {
            resolve(parsedResponse.data.id);
          } else {
            reject(parsedResponse.meta.msg);
          }
        }
      };
      request.open("POST", url);
      request.send(form);
    });
  }
}
