/**
 * Escolarize — perfil do usuário, preferências, favoritos.
 */

const ProfileView = (function () {
  function render() {
    const prefs = Storage.loadPreferences();
    const historyCount = Storage.loadRideHistory().length;
    const favCount = Storage.loadFavorites().length;
    const scheduledCount = Storage.loadScheduledRides().length;

    return (
      '<div class="view profile-view">' +
      Components.renderTopBar({ title: "Perfil" }) +

      '<div class="profile-hero">' +
      '<span class="avatar avatar-xl">' + Components.escapeHtml(App.getUserInitials()) + "</span>" +
      "<h2>" + Components.escapeHtml(App.getUserName()) + "</h2>" +
      "<p>" + Components.escapeHtml(App.getUserEmail()) + "</p>" +
      "<p>" + Components.escapeHtml(MockData.user.phone) + "</p>" +
      "</div>" +

      '<div class="profile-stats">' +
      '<div class="profile-stat"><strong>' + historyCount + '</strong><span>Corridas</span></div>' +
      '<div class="profile-stat"><strong>' + favCount + '</strong><span>Favoritas</span></div>' +
      '<div class="profile-stat"><strong>' + scheduledCount + '</strong><span>Agendadas</span></div>' +
      "</div>" +

      '<nav class="profile-menu" aria-label="Menu do perfil">' +
      '<button type="button" class="profile-menu-item" data-action="history">' + icon("clock") + "<span>Minhas corridas</span>" + icon("chevronRight") + "</button>" +
      '<button type="button" class="profile-menu-item" data-action="favorites">' + icon("heartFilled") + "<span>Escolas favoritas</span>" + icon("chevronRight") + "</button>" +
      '<button type="button" class="profile-menu-item" data-action="schedule">' + icon("calendar") + "<span>Agendamentos</span>" + icon("chevronRight") + "</button>" +
      "</nav>" +

      '<div class="profile-preferences">' +
      "<h3>Preferências</h3>" +
      '<div class="preference-row">' +
      "<span>Nome</span>" +
      '<button type="button" class="preference-link" id="change-name-btn">' +
      Components.escapeHtml(App.getUserName()) + " · Alterar</button>" +
      "</div>" +
      '<div class="preference-row">' +
      "<span>Tema escuro</span>" +
      '<button type="button" class="switch ' + (prefs.theme === "dark" ? "switch-on" : "") + '" id="theme-switch" role="switch" aria-checked="' + (prefs.theme === "dark") + '" aria-label="Alternar tema escuro"><span class="switch-thumb"></span></button>' +
      "</div>" +
      '<div class="preference-row">' +
      "<span>Notificações</span>" +
      '<button type="button" class="switch ' + (prefs.notifications !== false ? "switch-on" : "") + '" id="notif-switch" role="switch" aria-checked="' + (prefs.notifications !== false) + '" aria-label="Alternar notificações"><span class="switch-thumb"></span></button>' +
      "</div>" +
      "</div>" +

      '<nav class="profile-menu" aria-label="Suporte">' +
      '<button type="button" class="profile-menu-item" id="help-btn">' + icon("info") + "<span>Ajuda</span>" + icon("chevronRight") + "</button>" +
      '<button type="button" class="profile-menu-item" id="about-btn">' + icon("shield") + "<span>Sobre o Escolarize</span>" + icon("chevronRight") + "</button>" +
      "</nav>" +

      '<p class="prototype-notice">Protótipo demonstrativo — funcionalidades de transporte, pagamento e comunicação são simuladas.</p>' +
      "</div>"
    );
  }

  function openHelpModal() {
    Components.openModal({
      title: "Ajuda",
      bodyHtml:
        "<p><strong>Como solicito uma corrida?</strong><br>Toque em “Escolha sua escola” na tela inicial, selecione o endereço de embarque e revise antes de solicitar.</p>" +
        "<p><strong>Como agendo uma corrida?</strong><br>Acesse a aba Agendamentos e toque em “Agendar corrida”.</p>" +
        "<p><strong>Como favorito uma escola?</strong><br>Toque no ícone de coração ao lado da escola desejada.</p>",
      actions: [{ label: "Fechar", variant: "primary" }]
    });
  }

  function openAboutModal() {
    Components.openModal({
      title: "Sobre o Escolarize",
      bodyHtml:
        "<p>Escolarize é uma plataforma de caronas escolares em São José dos Campos - SP. As corridas são oferecidas por pessoas da própria comunidade escolar — responsáveis que já levam os filhos e professores que vão para a mesma escola todo dia — que aproveitam o trajeto para levar outros estudantes e complementar a renda.</p>" +
        "<p><strong>Protótipo demonstrativo</strong> — funcionalidades de transporte, pagamento e comunicação são simuladas. Não há backend, banco de dados ou login real neste projeto.</p>",
      actions: [{ label: "Fechar", variant: "primary" }]
    });
  }

  function openNameModal() {
    Components.openModal({
      title: "Alterar nome",
      bodyHtml:
        '<label class="modal-label" for="profile-name-input">Como podemos te chamar?</label>' +
        '<input type="text" id="profile-name-input" class="modal-input" maxlength="24" value="' +
        Components.escapeHtml(App.getUserName()) + '">' +
        '<p class="field-error" id="profile-name-error" hidden>Digite um nome com pelo menos 2 letras.</p>',
      actions: [
        { label: "Cancelar", variant: "outline" },
        {
          label: "Salvar",
          variant: "primary",
          closeOnClick: false,
          onClick: () => {
            const input = document.getElementById("profile-name-input");
            const error = document.getElementById("profile-name-error");
            const name = input.value.trim();
            if (name.length < 2) {
              error.hidden = false;
              input.focus();
              return;
            }
            Storage.saveUserName(name);
            Components.closeModal();
            Components.showToast("Nome atualizado para " + name + ".", "success");
            AppNav.switchView("profile", {}, { silent: true });
          }
        }
      ]
    });
  }

  function mount() {
    document.querySelectorAll(".profile-menu-item[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => AppNav.switchView(btn.dataset.action));
    });

    document.getElementById("change-name-btn").addEventListener("click", openNameModal);

    document.getElementById("help-btn").addEventListener("click", openHelpModal);
    document.getElementById("about-btn").addEventListener("click", openAboutModal);

    document.getElementById("theme-switch").addEventListener("click", (e) => {
      const prefs = Storage.loadPreferences();
      const nextTheme = prefs.theme === "dark" ? "light" : "dark";
      prefs.theme = nextTheme;
      Storage.savePreferences(prefs);
      App.applyTheme(nextTheme);
      const btn = e.currentTarget;
      btn.classList.toggle("switch-on", nextTheme === "dark");
      btn.setAttribute("aria-checked", String(nextTheme === "dark"));
    });

    document.getElementById("notif-switch").addEventListener("click", (e) => {
      const prefs = Storage.loadPreferences();
      const next = prefs.notifications === false;
      prefs.notifications = next;
      Storage.savePreferences(prefs);
      const btn = e.currentTarget;
      btn.classList.toggle("switch-on", next);
      btn.setAttribute("aria-checked", String(next));
    });
  }

  // ---------- Favoritos ----------
  function renderFavorites() {
    const ids = Storage.loadFavorites();
    const schools = SCHOOLS.filter((s) => ids.includes(s.id));
    return (
      '<div class="view favorites-view">' +
      Components.renderTopBar({ title: "Escolas favoritas", back: true }) +
      '<div id="favorites-list" class="school-list">' +
      (schools.length
        ? schools.map((s) => Components.renderSchoolCard(s)).join("")
        : Components.renderEmptyState({
            icon: "heart",
            title: "Você ainda não favoritou nenhuma escola.",
            text: "Toque no coração de uma escola para adicioná-la aqui."
          })) +
      "</div>" +
      "</div>"
    );
  }

  function mountFavorites() {
    document.getElementById("topbar-back-btn").addEventListener("click", () => AppNav.back());
    bindFavoritesEvents();
  }

  function bindFavoritesEvents() {
    const list = document.getElementById("favorites-list");
    if (!list) return;

    list.querySelectorAll(".fav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = Number(btn.dataset.favId);
        Storage.toggleFavorite(id);
        Components.showToast("Escola removida dos favoritos.", "success");
        const ids = Storage.loadFavorites();
        const schools = SCHOOLS.filter((s) => ids.includes(s.id));
        list.innerHTML = schools.length
          ? schools.map((s) => Components.renderSchoolCard(s)).join("")
          : Components.renderEmptyState({
              icon: "heart",
              title: "Você ainda não favoritou nenhuma escola.",
              text: "Toque no coração de uma escola para adicioná-la aqui."
            });
        bindFavoritesEvents();
      });
    });

    list.querySelectorAll(".school-card-main").forEach((card) => {
      card.addEventListener("click", () => {
        const school = SCHOOLS.find((s) => s.id === Number(card.dataset.schoolId));
        if (!school) return;
        appState.selectedSchool = school;
        appState.selectedAddress = null;
        Storage.saveLastSchool(school.id);
        AppNav.switchView("address");
      });
    });
  }

  return { render, mount, renderFavorites, mountFavorites };
})();
