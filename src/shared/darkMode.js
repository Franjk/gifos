import Local from "../classes/Local.js";

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
