export default class ElementBuilder {
  static buildAutocompletionSearchElement = function (term) {
    return `
      <div class="searchbar-result" data-searchterm="${term}">
        <svg
        class="icon-search-result"
        width="20px"
        height="20px"
        viewBox="0 0 20 20"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <title>icon-search</title>
        <desc>Created with Sketch.</desc>
        <defs>
          <path
            d="M8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,10.4865245 16.3185332,12.3138839 15.1766205,13.7610573 L19.7071068,18.2928932 C20.0976311,18.6834175 20.0976311,19.3165825 19.7071068,19.7071068 C19.3165825,20.0976311 18.6834175,20.0976311 18.2928932,19.7071068 L18.2928932,19.7071068 L13.7610573,15.1766205 C12.3138839,16.3185332 10.4865245,17 8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 Z M8.5,2 C4.91014913,2 2,4.91014913 2,8.5 C2,12.0898509 4.91014913,15 8.5,15 C10.2704128,15 11.8755097,14.2921984 13.0477521,13.1441339 L13.0928932,13.0928932 C13.1090201,13.0767663 13.1255608,13.0613054 13.1424811,13.0465104 C14.2921984,11.8755097 15,10.2704128 15,8.5 C15,4.91014913 12.0898509,2 8.5,2 Z"
            id="icon-search-${term}-path-1"
          ></path>
        </defs>
        <g
          id="GIFOS"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
        >
          <g
            id="00-UI-Kit"
            transform="translate(-637.000000, -518.000000)"
          >
            <g
              id="-Nav-Desktop-Sticky"
              transform="translate(0.000000, 479.000000)"
            >
              <g
                id="icon-search"
                transform="translate(637.000000, 39.000000)"
              >
                <mask id="mask-2" fill="white">
                  <use xlink:href="#icon-search-${term}-path-1"></use>
                </mask>
                <use
                  class="svg-fill"
                  fill="#9cafc3"
                  fill-rule="nonzero"
                  xlink:href="#icon-search-${term}-path-1"
                ></use>
              </g>
            </g>
          </g>
        </g>
      </svg>
  
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
}
