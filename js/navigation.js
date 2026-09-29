/**
 * RotaEdu — roteador de views (SPA). Controla troca de telas, navegação
 * inferior, transições e integração com o histórico do navegador (back/forward).
 */

const AppNav = (function () {
  const TABS = ["home", "history", "schedule", "profile"];
  let unmountCurrent = null;

  function root() {
    return document.getElementById("view-root");
  }

  function bottomNav() {
    return document.getElementById("bottom-nav");
  }

  function registerUnmount(fn) {
    unmountCurrent = fn;
  }

  function teardown() {
    if (unmountCurrent) {
      unmountCurrent();
      unmountCurrent = null;
    }
  }

  function renderView(view) {
    teardown();
    const container = root();
    switch (view) {
      case "home":
        container.innerHTML = HomeView.render();
        HomeView.mount();
        break;
      case "schools":
        container.innerHTML = SchoolsView.renderSelectSchool();
        SchoolsView.mountSelectSchool();
        break;
      case "address":
        container.innerHTML = SchoolsView.renderSelectAddress();
        SchoolsView.mountSelectAddress();
        break;
      case "review":
        container.innerHTML = RidesView.renderReview();
        RidesView.mountReview();
        break;
      case "tracking":
        container.innerHTML = RidesView.renderTracking();
        RidesView.mountTracking();
        break;
      case "completed":
        container.innerHTML = RidesView.renderCompleted();
        RidesView.mountCompleted();
        break;
      case "history":
        container.innerHTML = RidesView.renderHistory();
        RidesView.mountHistory();
        break;
      case "schedule":
        container.innerHTML = ScheduleView.renderList();
        ScheduleView.mountList();
        break;
      case "newSchedule":
        container.innerHTML = ScheduleView.renderForm();
        ScheduleView.mountForm();
        break;
      case "profile":
        container.innerHTML = ProfileView.render();
        ProfileView.mount();
        break;
      case "favorites":
        container.innerHTML = ProfileView.renderFavorites();
        ProfileView.mountFavorites();
        break;
      case "map":
        container.innerHTML = MapView.render();
        MapView.mount();
        break;
      case "welcome":
        container.innerHTML = WelcomeView.render();
        WelcomeView.mount();
        break;
      default:
        container.innerHTML = HomeView.render();
        HomeView.mount();
    }

    container.classList.remove("view-enter");
    // força reflow para reiniciar a animação de entrada a cada troca de tela
    void container.offsetWidth;
    container.classList.add("view-enter");
    container.scrollTop = 0;
    window.scrollTo(0, 0);
    updateBottomNav(view);
  }

  function updateBottomNav(view) {
    const nav = bottomNav();
    if (!nav) return;
    const showNav = TABS.includes(view);
    nav.classList.toggle("bottom-nav-hidden", !showNav);
    document.body.classList.toggle("has-bottom-nav", showNav);

    // na tela de boas-vindas a navegação some por completo (inclusive a
    // barra lateral do desktop, que normalmente continua visível)
    const isWelcome = view === "welcome";
    document.body.classList.toggle("is-welcome", isWelcome);
    const shell = document.getElementById("app");
    if (shell) shell.classList.toggle("is-welcome", isWelcome);
    nav.querySelectorAll(".nav-item").forEach((btn) => {
      const active = btn.dataset.view === view;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-current", active ? "page" : "false");
    });
  }

  function switchView(view, params, opts) {
    opts = opts || {};
    appState.currentView = view;
    appState.viewParams = params || {};
    renderView(view);
    if (!opts.silent) {
      history.pushState({ view: view }, "", "#" + view);
    }
  }

  function back() {
    history.back();
  }

  // Views que podem ser abertas diretamente pela URL (não dependem de estado
  // temporário como escola/endereço/corrida em andamento).
  const DEEP_LINKABLE = ["home", "history", "schedule", "newSchedule", "profile", "favorites", "schools", "map"];

  /** View pedida pela URL (independente de já haver nome definido). */
  function requestedView() {
    const hash = (location.hash || "").replace("#", "");
    return DEEP_LINKABLE.includes(hash) ? hash : "home";
  }

  function init() {
    window.addEventListener("popstate", (e) => {
      const view = (e.state && e.state.view) || "home";
      appState.currentView = view;
      renderView(view);
    });

    // Hash digitado/colado manualmente. pushState não dispara hashchange, mas
    // popstate dispara: por isso ignoramos quando o hash já corresponde à view
    // atual (mudança causada pelo próprio app) e quando o hash aponta para uma
    // view de fluxo, que depende de estado e não pode ser aberta direto.
    window.addEventListener("hashchange", () => {
      if (!Storage.loadUserName()) return; // ainda nas boas-vindas
      const hash = (location.hash || "").replace("#", "");
      if (hash === appState.currentView) return;
      if (!DEEP_LINKABLE.includes(hash)) return;
      appState.currentView = hash;
      renderView(hash);
    });

    // o destino pedido na URL é preservado durante as boas-vindas e aberto
    // assim que o nome é escolhido
    const target = requestedView();
    const needsName = !Storage.loadUserName();
    const view = needsName ? "welcome" : target;

    appState.pendingView = target;
    appState.currentView = view;
    history.replaceState({ view: view }, "", "#" + target);
    renderView(view);
  }

  return { switchView, back, init, registerUnmount, updateBottomNav };
})();
