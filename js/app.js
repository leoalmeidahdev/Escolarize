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
  /** Nome escolhido pelo usuário; cai no mock enquanto nada foi definido. */
  function getUserName() {
    return Storage.loadUserName() || MockData.user.name;
  }

  function getUserInitials() {
    const name = getUserName().trim();
    return name ? name.charAt(0).toUpperCase() : MockData.user.initials;
  }

  /**
   * E-mail fictício derivado do nome escolhido: "Ana Clara" → ana.clara@email.com.
   * Acentos são removidos e só letras/números sobram no endereço.
   */
  function getUserEmail() {
    const slug = getUserName()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .join(".");
    return (slug || "usuario") + "@email.com";
  }

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

  return { applyTheme, init, getUserName, getUserInitials, getUserEmail };
})();

document.addEventListener("DOMContentLoaded", App.init);
