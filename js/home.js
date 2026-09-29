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

  function render() {
    const lastSchoolId = Storage.loadLastSchool();
    const lastSchool = lastSchoolId ? SCHOOLS.find((s) => s.id === lastSchoolId) : null;
    const unread = unreadCount();

    return (
      '<div class="view home-view">' +
      '<header class="home-header">' +
      '<div class="home-header-user">' +
      '<span class="avatar avatar-md">' + Components.escapeHtml(App.getUserInitials()) + "</span>" +
      '<div>' +
      '<p class="home-header-greeting">' + greeting() + ", " + Components.escapeHtml(App.getUserName()) + "</p>" +
      '<p class="home-header-sub">Para onde vamos hoje?</p>' +
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
      '<span class="home-map-cta">' + icon("compass") + "Ver mapa completo</span>" +
      "</button>" +
      "</div>" +

      '<button type="button" class="safety-banner" id="safety-info-btn">' +
      '<span class="safety-banner-icon">' + icon("shield") + "</span>" +
      '<span class="safety-banner-text">' +
      "<strong>Segurança em primeiro lugar</strong>" +
      '<span>Motoristas verificados • Monitoramento em tempo real</span>' +
      "</span>" +
      '<span class="safety-banner-link">Saiba mais</span>' +
      "</button>" +
      "</aside>" +

      '<div class="home-main">' +
      '<section class="main-card" aria-label="Solicitar corrida">' +
      '<h2>Para onde vamos?</h2>' +
      '<button type="button" class="school-select-row" id="choose-school-btn">' +
      '<span class="school-select-icon">' + icon("school") + "</span>" +
      '<span class="school-select-text">' +
      "<strong>Escolha sua escola</strong>" +
      "<span>" + (lastSchool ? "Última: " + Components.escapeHtml(lastSchool.name) : "Nenhuma escola selecionada ainda") + "</span>" +
      "</span>" +
      icon("chevronRight") +
      "</button>" +
      "</section>" +

      '<section class="promo-banner">' +
      '<div class="promo-banner-text">' +
      "<h3>Corridas escolares mais tranquilas</h3>" +
      "<p>Mais praticidade para sua rotina.</p>" +
      "</div>" +
      '<div class="promo-banner-illustration">' + icon("car") + "</div>" +
      "</section>" +

      '<section class="home-section">' +
      "<h3>Serviços</h3>" +
      '<div class="services-grid">' +
      '<button type="button" class="service-card" data-action="schools">' +
      '<span class="service-card-icon">' + icon("ride") + "</span><span>Corrida escolar</span>" +
      "</button>" +
      '<button type="button" class="service-card" data-action="schedule">' +
      '<span class="service-card-icon">' + icon("calendar") + "</span><span>Agendar corrida</span>" +
      "</button>" +
      '<button type="button" class="service-card" data-action="favorites">' +
      '<span class="service-card-icon">' + icon("heartFilled") + "</span><span>Escolas favoritas</span>" +
      "</button>" +
      '<button type="button" class="service-card" data-action="history">' +
      '<span class="service-card-icon">' + icon("clock") + "</span><span>Histórico</span>" +
      "</button>" +
      "</div>" +
      "</section>" +

      '<section class="home-section home-section-routes">' +
      "<h3>Rotas populares</h3>" +
      '<div class="route-list">' +
      MockData.popularRoutes
        .map(
          (r) =>
            '<button type="button" class="route-item" data-route-id="' + r.id + '">' +
            '<span class="route-item-icon">' + icon("compass") + "</span>" +
            '<span class="route-item-text">' +
            "<strong>" + Components.escapeHtml(r.originLabel) + " → " + Components.escapeHtml(r.destinationLabel) + "</strong>" +
            "<span>" + r.time + " • " + r.price + "</span>" +
            "</span>" +
            icon("chevronRight") +
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

    document.getElementById("open-map-btn").addEventListener("click", () => {
      AppNav.switchView("map", { mode: "school" });
    });

    document.getElementById("safety-info-btn").addEventListener("click", openSecurityModal);
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
