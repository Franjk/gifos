export default class LocalGifo {
  static FAVORITES_KEY = "favorites";

  static getFavorites() {
    const strFavorites = localStorage.getItem(LocalGifo.FAVORITES_KEY);
    return JSON.parse(strFavorites) || [];
  }

  static saveFavorites(favoriteGifos) {
    localStorage.setItem(
      LocalGifo.FAVORITES_KEY,
      JSON.stringify(favoriteGifos)
    );
  }

  static clearFavorites() {
    const favorites = [];
    localStorage.setItem(LocalGifo.FAVORITES_KEY, JSON.stringify(favorites));
  }
}
