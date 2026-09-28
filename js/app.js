/**
 * Escolarize — inicialização do app (estado global, tema, service worker,
 * navegação inferior).
 */

const appState = {
  currentView: "home",
  viewParams: {},
  selectedSchool: null,
  selectedAddress: null,
  currentRide: null,
  rideStatus: null,
  notifications: MockData.notifications.slice()
};

const App = (function () {
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  }

  function bindBottomNav() {
    const nav = document.getElementById("bottom-nav");
    if (!nav) return;
    nav.querySelectorAll(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        AppNav.switchView(btn.dataset.view);
      });
    });
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch((err) => {
          console.warn("Escolarize: falha ao registrar o service worker.", err);
        });
      });
    }
  }

  function init() {
    const prefs = Storage.loadPreferences();
    applyTheme(prefs.theme);

    bindBottomNav();
    AppNav.init();
    registerServiceWorker();
  }

  return { applyTheme, init };
})();

document.addEventListener("DOMContentLoaded", App.init);
