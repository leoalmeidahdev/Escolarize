/**
 * Escolarize — tela inicial (Home).
 */

const HomeView = (function () {
  function greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  function unreadCount() {
    return appState.notifications.filter((n) => !n.read).length;
  }

  /** Ilustração do banner: van escolar em frente à escola. */
  function busIllustration() {
    return (
      '<svg viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      // prédio da escola
      '<rect x="92" y="26" width="52" height="54" rx="4" fill="#E8551F" opacity=".92"/>' +
      '<path d="M88 30l30-14 30 14z" fill="#C7451A"/>' +
      '<rect x="100" y="38" width="12" height="12" rx="2" fill="#FFF3D6"/>' +
      '<rect x="120" y="38" width="12" height="12" rx="2" fill="#FFF3D6"/>' +
      '<rect x="112" y="60" width="14" height="20" rx="2" fill="#FFF3D6"/>' +
      // van amarela
      '<rect x="8" y="40" width="82" height="36" rx="9" fill="#FFC42E"/>' +
      '<path d="M8 58h82" stroke="#E5A800" stroke-width="2"/>' +
      '<rect x="16" y="46" width="20" height="13" rx="3" fill="#DCEEFF"/>' +
      '<rect x="42" y="46" width="20" height="13" rx="3" fill="#DCEEFF"/>' +
      '<rect x="68" y="46" width="16" height="13" rx="3" fill="#DCEEFF"/>' +
      '<rect x="24" y="63" width="42" height="7" rx="3.5" fill="#0B2A58" opacity=".85"/>' +
      '<circle cx="28" cy="78" r="8" fill="#20304A"/><circle cx="28" cy="78" r="3.4" fill="#C9D6E8"/>' +
      '<circle cx="72" cy="78" r="8" fill="#20304A"/><circle cx="72" cy="78" r="3.4" fill="#C9D6E8"/>' +
      // chão
      '<path d="M0 86h150" stroke="#ffffff" stroke-opacity=".45" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 9"/>' +
      "</svg>"
    );
  }

  function render() {
    const lastSchoolId = Storage.loadLastSchool();
    const lastSchool = lastSchoolId ? SCHOOLS.find((s) => s.id === lastSchoolId) : null;
    const selectedSchool = appState.selectedSchool;
    const unread = unreadCount();

    return (
      '<div class="view home-view">' +
      '<header class="home-header">' +
      '<div class="home-header-user">' +
      '<span class="avatar avatar-md avatar-ring">' + Components.escapeHtml(App.getUserInitials()) + "</span>" +
      '<div>' +
      '<p class="home-header-greeting">' + greeting() + ", " + Components.escapeHtml(App.getUserName()) + "!</p>" +
      '<p class="home-header-sub">Bora pra escola?</p>' +
      "</div>" +
      "</div>" +
      '<button type="button" class="icon-btn bell-btn" id="notifications-btn" aria-label="Notificações (' + unread + ' não lidas)">' +
      icon("bell") +
      (unread > 0 ? '<span class="badge-dot">' + unread + "</span>" : "") +
      "</button>" +
      "</header>" +

      '<div class="home-columns">' +
      '<aside class="home-aside" aria-label="Mapa e segurança">' +
      '<div class="home-map-wrap">' +
      '<button type="button" class="home-map-btn" id="open-map-btn" aria-label="Abrir mapa completo de São José dos Campos">' +
      Components.renderMap({ variant: "home" }) +
      '<span class="home-map-cta" aria-hidden="true">' + icon("compass") + "</span>" +
      "</button>" +
      "</div>" +

      '<button type="button" class="safety-banner" id="safety-info-btn">' +
      '<span class="safety-banner-icon">' + icon("shield") + "</span>" +
      '<span class="safety-banner-text">' +
      "<strong>Viagens seguras para estudantes</strong>" +
      '<span>Motoristas verificados • Monitoramento em tempo real</span>' +
      "</span>" +
      icon("chevronRight", "safety-banner-chevron") +
      "</button>" +
      "</aside>" +

      '<div class="home-main">' +
      '<section class="main-card" aria-label="Solicitar carona">' +
      '<div class="main-card-head">' +
      '<span class="main-card-search">' + icon("search") + "</span>" +
      "<div>" +
      "<h2>Para onde vamos?</h2>" +
      "<p>Escolha o destino da sua carona escolar</p>" +
      "</div>" +
      "</div>" +

      '<button type="button" class="pick-row" id="choose-school-btn">' +
      '<span class="pick-row-icon pick-row-icon-school">' + icon("school") + "</span>" +
      '<span class="pick-row-text">' +
      "<strong>Sua escola</strong>" +
      "<span>" +
      (selectedSchool
        ? Components.escapeHtml(selectedSchool.name)
        : lastSchool
        ? "Última: " + Components.escapeHtml(lastSchool.name)
        : "Ex.: Colégio Poliedro – Aquarius") +
      "</span>" +
      "</span>" +
      icon("chevronRight", "pick-row-chevron") +
      "</button>" +

      '<button type="button" class="pick-row" id="choose-address-btn">' +
      '<span class="pick-row-icon pick-row-icon-pin">' + icon("mapPin") + "</span>" +
      '<span class="pick-row-text">' +
      "<strong>Endereço de embarque</strong>" +
      "<span>" + Components.escapeHtml(appState.selectedAddress || MockData.user.defaultAddress) + "</span>" +
      "</span>" +
      icon("chevronRight", "pick-row-chevron") +
      "</button>" +
      "</section>" +

      '<button type="button" class="promo-banner" id="promo-banner-btn">' +
      '<div class="promo-banner-text">' +
      '<h3>Mais <span class="promo-highlight">segurança</span><br>para o seu filho!</h3>' +
      "<p>Carona escolar com motoristas da própria comunidade escolar.</p>" +
      '<span class="promo-banner-btn" aria-hidden="true">Saiba mais ' + icon("chevronRight") + "</span>" +
      "</div>" +
      '<div class="promo-banner-illustration" aria-hidden="true">' + busIllustration() + "</div>" +
      "</button>" +

      '<section class="home-section">' +
      '<div class="home-section-head"><h3>Serviços em destaque</h3></div>' +
      '<div class="services-grid">' +
      '<button type="button" class="service-card" data-action="schools">' +
      '<span class="service-card-icon service-icon-yellow">' + icon("ride") + "</span>" +
      "<strong>Solicitar carona</strong><span>Para a escola</span>" +
      icon("chevronRight", "service-card-chevron") +
      "</button>" +
      '<button type="button" class="service-card" data-action="schedule">' +
      '<span class="service-card-icon service-icon-green">' + icon("calendar") + "</span>" +
      "<strong>Agendamentos</strong><span>Rotina escolar</span>" +
      icon("chevronRight", "service-card-chevron") +
      "</button>" +
      '<button type="button" class="service-card" data-action="favorites">' +
      '<span class="service-card-icon service-icon-purple">' + icon("heartFilled") + "</span>" +
      "<strong>Escolas favoritas</strong><span>Suas preferidas</span>" +
      icon("chevronRight", "service-card-chevron") +
      "</button>" +
      '<button type="button" class="service-card" data-action="history">' +
      '<span class="service-card-icon service-icon-blue">' + icon("clock") + "</span>" +
      "<strong>Histórico</strong><span>Caronas feitas</span>" +
      icon("chevronRight", "service-card-chevron") +
      "</button>" +
      "</div>" +
      "</section>" +

      '<section class="home-section home-section-routes">' +
      '<div class="home-section-head">' +
      "<h3>Rotas populares</h3>" +
      '<button type="button" class="section-link" id="all-routes-btn">Ver todas ' + icon("chevronRight") + "</button>" +
      "</div>" +
      '<div class="route-list">' +
      MockData.popularRoutes
        .map(
          (r, i) =>
            '<button type="button" class="route-item route-item-' + (i % 3) + '" data-route-id="' + r.id + '">' +
            '<span class="route-item-icon">' + icon("mapPin") + "</span>" +
            '<span class="route-item-text">' +
            "<strong>" + Components.escapeHtml(r.originLabel) + " → " + Components.escapeHtml(r.destinationLabel) + "</strong>" +
            "<span>" + r.time + " • " + r.price + "</span>" +
            "</span>" +
            icon("chevronRight", "route-item-chevron") +
            "</button>"
        )
        .join("") +
      "</div>" +
      "</section>" +
      "</div>" + // .home-main
      "</div>" + // .home-columns
      "</div>"
    );
  }

  function openSecurityModal() {
    Components.openModal({
      title: "Segurança em primeiro lugar",
      bodyHtml:
        '<p>No Escolarize, segurança é o conceito central da plataforma: motoristas verificados e monitoramento em tempo real fazem parte da proposta do produto.</p>' +
        '<p><strong>Este é um protótipo demonstrativo.</strong> Nenhuma verificação de antecedentes ou monitoramento real está ativa — esses recursos são apresentados apenas conceitualmente.</p>',
      actions: [{ label: "Entendi", variant: "primary" }]
    });
  }

  function openNotificationsModal() {
    appState.notifications.forEach((n) => (n.read = true));
    const items = appState.notifications
      .map(
        (n) =>
          '<div class="notification-item">' +
          '<span class="notification-item-icon">' + icon("bell") + "</span>" +
          '<span><strong>' + Components.escapeHtml(n.title) + "</strong><br>" +
          Components.escapeHtml(n.body) +
          '<span class="notification-item-time">' + n.time + "</span></span>" +
          "</div>"
      )
      .join("");
    Components.openModal({
      title: "Notificações",
      bodyHtml: '<div class="notification-list">' + items + "</div>",
      actions: [{ label: "Fechar", variant: "primary" }]
    });
  }

  function mount() {
    document.getElementById("choose-school-btn").addEventListener("click", () => {
      AppNav.switchView("schools");
    });

    document.getElementById("choose-address-btn").addEventListener("click", () => {
      AppNav.switchView("address");
    });

    document.getElementById("all-routes-btn").addEventListener("click", () => {
      AppNav.switchView("map", { mode: "school" });
    });

    document.getElementById("open-map-btn").addEventListener("click", () => {
      AppNav.switchView("map", { mode: "school" });
    });

    document.getElementById("safety-info-btn").addEventListener("click", openSecurityModal);
    document.getElementById("promo-banner-btn").addEventListener("click", openSecurityModal);
    document.getElementById("notifications-btn").addEventListener("click", () => {
      openNotificationsModal();
      const dot = document.querySelector("#notifications-btn .badge-dot");
      if (dot) dot.remove();
    });

    document.querySelectorAll(".service-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        if (action === "schools") AppNav.switchView("schools");
        else if (action === "schedule") AppNav.switchView("newSchedule");
        else if (action === "favorites") AppNav.switchView("favorites");
        else if (action === "history") AppNav.switchView("history");
      });
    });

    document.querySelectorAll(".route-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const route = MockData.popularRoutes.find((r) => r.id === btn.dataset.routeId);
        if (!route) return;
        const school = SCHOOLS.find((s) => s.id === route.schoolId);
        if (!school) return;
        appState.selectedSchool = school;
        Storage.saveLastSchool(school.id);
        appState.selectedAddress = null;
        AppNav.switchView("address");
      });
    });
  }

  return { render, mount, unreadCount };
})();
