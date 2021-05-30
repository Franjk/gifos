import Local from "../classes/Local.js";

/**
 * Initializes the dark-mode functionality.
 *
 * The dark-mode works by adding the `.dark-theme` class to the body of the document.
 * It also changes the dark-mode button toggler text to display the name of the
 * changed state.
 *
 * The dark-mode state is stored in the local storage and it is retrieved everytime
 * a page is loaded.
 */
export const initializeDarkMode = function () {
  if (Local.isDarkMode()) document.body.classList.add("dark-theme");

  document.querySelectorAll(".dark-mode-toggler").forEach((el) => {
    el.textContent = Local.isDarkMode() ? "Modo Diurno" : "Modo Nocturno";

    el.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      Local.toggleDarkMode();
      el.textContent = Local.isDarkMode() ? "Modo Diurno" : "Modo Nocturno";
    });
  });
};
