/**
 * Escolarize — componentes reutilizáveis, ícones, mapa simulado, toasts e modais.
 */

const ICONS = {
  home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9"/>',
  ride: '<rect x="3" y="10" width="18" height="7" rx="2"/><path d="M5 10l1.6-4.2A2 2 0 0 1 8.5 4.5h7a2 2 0 0 1 1.9 1.3L19 10"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>',
  heart: '<path d="M12 20s-7.2-4.5-9.5-9C.8 7.3 2.7 4 6.2 4c2 0 3.6 1.1 4.6 2.6C11.9 5.1 13.5 4 15.5 4 19 4 20.9 7.3 19.4 11c-2.3 4.5-9.4 9-9.4 9z"/>',
  heartFilled: '<path d="M12 20s-7.2-4.5-9.5-9C.8 7.3 2.7 4 6.2 4c2 0 3.6 1.1 4.6 2.6C11.9 5.1 13.5 4 15.5 4 19 4 20.9 7.3 19.4 11c-2.3 4.5-9.4 9-9.4 9z" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3.5 5 6v5.2c0 4.6 3 7.9 7 9.3 4-1.4 7-4.7 7-9.3V6l-7-2.5z"/><path d="M9 12l2 2 4-4.2"/>',
  bell: '<path d="M6 10a6 6 0 1 1 12 0c0 4 1.4 5.2 1.4 5.2H4.6S6 14 6 10z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  chevronRight: '<path d="M9 5l7 7-7 7"/>',
  chevronLeft: '<path d="M15 5l-7 7 7 7"/>',
  arrowLeft: '<path d="M19 12H5M11 5l-7 7 7 7"/>',
  mapPin: '<path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 17l-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z"/>',
  starFilled: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 17l-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" fill="currentColor" stroke="none"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.6 2.6L16.2 9"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  phone: '<path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C11.9 18.6 5.4 12.1 5 5.6A1.5 1.5 0 0 1 6.5 4z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 12.5A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5L19 7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/>',
  school: '<path d="M12 4 2.5 9 12 14l9.5-5L12 4z"/><path d="M6 11.5v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5"/><path d="M21.5 9v6"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  car: '<rect x="2.5" y="12" width="15" height="6" rx="2"/><path d="M4 12l1.4-3.6A2 2 0 0 1 7.2 7h5.6a2 2 0 0 1 1.9 1.3L16 12"/><circle cx="6.5" cy="18" r="1.3"/><circle cx="13.5" cy="18" r="1.3"/>',
  logo: '<path d="M12 4 2.5 9 12 14l9.5-5L12 4z"/><path d="M6 11.5v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5"/>'
};

function icon(name, cls) {
  const path = ICONS[name] || "";
  return (
    '<svg class="icon ' +
    (cls || "") +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    path +
    "</svg>"
  );
}

const Components = (function () {
  // ---------- Formatação ----------
  function formatBRL(value) {
    return "R$ " + value.toFixed(2).replace(".", ",");
  }

  function formatDateBR(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("pt-BR");
  }

  function formatTimeBR(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  // ---------- Toasts ----------
  function showToast(message, type) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast toast-" + (type || "info");
    toast.setAttribute("role", "status");
    toast.innerHTML =
      icon(type === "success" ? "check" : type === "error" ? "x" : "info", "toast-icon") +
      '<span>' + escapeHtml(message) + "</span>";
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("toast-show"));
    setTimeout(() => {
      toast.classList.remove("toast-show");
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  // ---------- Modal ----------
  let lastFocusedEl = null;

  function openModal(opts) {
    const root = document.getElementById("modal-root");
    if (!root) return null;
    lastFocusedEl = document.activeElement;

    const actionsHtml = (opts.actions || [])
      .map(
        (a, i) =>
          '<button type="button" class="btn ' +
          (a.variant === "primary" ? "btn-primary" : a.variant === "danger" ? "btn-danger" : "btn-outline") +
          '" data-action-index="' +
          i +
          '">' +
          escapeHtml(a.label) +
          "</button>"
      )
      .join("");

    root.innerHTML =
      '<div class="modal-backdrop" id="modal-backdrop"></div>' +
      '<div class="modal-dialog" role="dialog" aria-modal="true" aria-label="' +
      escapeHtml(opts.title || "") +
      '" tabindex="-1">' +
      '<div class="modal-header">' +
      "<h2>" + escapeHtml(opts.title || "") + "</h2>" +
      '<button type="button" class="modal-close" aria-label="Fechar">' +
      icon("x") +
      "</button>" +
      "</div>" +
      '<div class="modal-body">' + (opts.bodyHtml || "") + "</div>" +
      (actionsHtml ? '<div class="modal-actions">' + actionsHtml + "</div>" : "") +
      "</div>";

    root.classList.add("modal-open");

    function close() {
      root.classList.remove("modal-open");
      root.innerHTML = "";
      document.removeEventListener("keydown", onKeyDown);
      if (lastFocusedEl && lastFocusedEl.focus) lastFocusedEl.focus();
      if (opts.onClose) opts.onClose();
    }

    function onKeyDown(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);

    root.querySelector("#modal-backdrop").addEventListener("click", close);
    root.querySelector(".modal-close").addEventListener("click", close);
    (opts.actions || []).forEach((a, i) => {
      const btn = root.querySelector('[data-action-index="' + i + '"]');
      if (btn) {
        btn.addEventListener("click", () => {
          if (a.onClick) a.onClick();
          if (a.closeOnClick !== false) close();
        });
      }
    });

    const dialog = root.querySelector(".modal-dialog");
    if (dialog) dialog.focus();

    return close;
  }

  function closeModal() {
    const root = document.getElementById("modal-root");
    if (root) {
      root.classList.remove("modal-open");
      root.innerHTML = "";
    }
  }

  // ---------- Estados vazios ----------
  function renderEmptyState(opts) {
    return (
      '<div class="empty-state">' +
      '<div class="empty-state-icon">' + icon(opts.icon || "info") + "</div>" +
      "<h3>" + escapeHtml(opts.title) + "</h3>" +
      (opts.text ? "<p>" + escapeHtml(opts.text) + "</p>" : "") +
      (opts.actionLabel
        ? '<button type="button" class="btn btn-primary" id="' + (opts.actionId || "empty-state-action") + '">' +
          escapeHtml(opts.actionLabel) +
          "</button>"
        : "") +
      "</div>"
    );
  }

  // ---------- Estrelas ----------
  function renderStars(rating, opts) {
    opts = opts || {};
    let html = '<div class="star-row' + (opts.interactive ? " star-row-interactive" : "") + '" ' + (opts.interactive ? 'role="radiogroup" aria-label="Avaliação"' : "") + ">";
    for (let i = 1; i <= 5; i++) {
      const filled = i <= Math.round(rating);
      html +=
        '<button type="button" class="star-btn" data-star="' + i + '" ' +
        (opts.interactive ? "" : "tabindex=\"-1\" disabled") +
        ' aria-label="' + i + ' estrela' + (i > 1 ? "s" : "") + '">' +
        icon(filled ? "starFilled" : "star", "star-icon" + (filled ? " star-filled" : "")) +
        "</button>";
    }
    html += "</div>";
    return html;
  }

  // ---------- Mapa simulado ----------
  // As vias e a rota ficam no SVG (com vector-effect para o traço não deformar);
  // pinos e carro são elementos HTML posicionados em %, assim continuam
  // perfeitamente redondos em qualquer proporção de tela.
  function dot(cls, coords, extraAttr) {
    return (
      '<span class="map-dot ' + cls + '" style="left:' + coords.x + "%;top:" + coords.y + '%"' +
      (extraAttr || "") + "></span>"
    );
  }

  function renderMap(opts) {
    opts = opts || {};
    const variant = opts.variant || "home";
    const destCoords = opts.destCoords || null;
    const destLabel = opts.destLabel || "";
    const originCoords = opts.originCoords || { x: 40, y: 82 };

    const roads =
      '<path class="map-road" d="M0,70 C 20,60 35,75 55,55 S 85,40 100,45" />' +
      '<path class="map-road" d="M10,0 C 25,20 15,40 35,50 S 70,60 65,100" />' +
      '<path class="map-road" d="M0,30 C 30,25 40,15 70,20 S 95,10 100,5" />';

    let overlay = "";
    let route = "";

    if (variant === "home") {
      overlay += '<span class="map-zone" style="left:' + originCoords.x + "%;top:" + originCoords.y + '%"></span>';
      SCHOOLS.filter((s) => s.popular)
        .slice(0, 4)
        .forEach((s) => {
          overlay += dot("map-dot-school", s.coords);
        });
      overlay += dot("map-dot-user", originCoords);
    }

    if ((variant === "route" || variant === "tracking") && destCoords) {
      route =
        '<line class="map-route-line" x1="' + originCoords.x + '" y1="' + originCoords.y +
        '" x2="' + destCoords.x + '" y2="' + destCoords.y + '" />';
      overlay += dot("map-dot-user", originCoords);
      overlay += dot("map-dot-dest", destCoords);
      if (variant === "tracking") {
        overlay += dot("map-dot-car", originCoords, ' id="tracking-car"');
      }
    }

    return (
      '<div class="fake-map fake-map-' + variant + '" role="img" aria-label="Mapa simulado' +
      (destLabel ? " mostrando trajeto até " + escapeHtml(destLabel) : "") + '">' +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      roads + route +
      "</svg>" +
      overlay +
      (opts.showLabels && destLabel
        ? '<div class="map-label map-label-dest">' + icon("mapPin", "map-label-icon") + escapeHtml(destLabel) + "</div>"
        : "") +
      "</div>"
    );
  }

  function updateCarPosition(ratio, originCoords, destCoords) {
    const carEl = document.getElementById("tracking-car");
    if (!carEl) return;
    carEl.style.left = originCoords.x + (destCoords.x - originCoords.x) * ratio + "%";
    carEl.style.top = originCoords.y + (destCoords.y - originCoords.y) * ratio + "%";
  }

  // ---------- Cards ----------
  // O card é um container com dois botões irmãos (selecionar / favoritar).
  // Botões aninhados são HTML inválido — o parser move o botão interno para
  // fora do card, quebrando o layout.
  function renderSchoolCard(school, opts) {
    opts = opts || {};
    const fav = Storage.isFavorite(school.id);
    return (
      '<div class="school-card">' +
      '<button type="button" class="school-card-main" data-school-id="' + school.id + '">' +
      '<span class="school-card-icon">' + icon("school") + "</span>" +
      '<span class="school-card-info">' +
      '<span class="school-card-name">' +
      escapeHtml(school.name) +
      (school.popular ? '<span class="badge badge-yellow">Popular</span>' : "") +
      "</span>" +
      '<span class="school-card-address">' + escapeHtml(school.address) + ", " + escapeHtml(school.neighborhood) + "</span>" +
      '<span class="school-card-city">' + escapeHtml(school.city) + " - " + escapeHtml(school.state) + "</span>" +
      "</span>" +
      "</button>" +
      '<button type="button" class="icon-btn fav-btn ' + (fav ? "fav-active" : "") + '" data-fav-id="' + school.id + '" aria-label="' +
      (fav ? "Remover dos favoritos" : "Adicionar aos favoritos") + '" aria-pressed="' + fav + '">' +
      icon(fav ? "heartFilled" : "heart") +
      "</button>" +
      icon("chevronRight", "school-card-chevron") +
      "</div>"
    );
  }

  function renderRideHistoryCard(ride) {
    const statusLabel = {
      COMPLETED: "Concluída",
      CANCELLED: "Cancelada"
    }[ride.status] || "Concluída";
    return (
      '<div class="ride-card">' +
      '<div class="ride-card-top">' +
      '<span class="ride-card-school">' + icon("school") + escapeHtml(ride.school.name) + "</span>" +
      '<span class="badge badge-success">' + statusLabel + "</span>" +
      "</div>" +
      '<div class="ride-card-address">' + escapeHtml(ride.school.address) + ", " + escapeHtml(ride.school.neighborhood) + "</div>" +
      '<div class="ride-card-meta">' +
      "<span>" + formatDateBR(ride.createdAt) + " às " + formatTimeBR(ride.createdAt) + "</span>" +
      "<span>" + formatBRL(ride.price) + "</span>" +
      "</div>" +
      '<div class="ride-card-driver">' +
      '<span class="avatar avatar-sm">' + escapeHtml(ride.driver.initials) + "</span>" +
      "<span>" + escapeHtml(ride.driver.name) +
      (ride.driver.role ? '<span class="ride-card-driver-role">' + escapeHtml(ride.driver.role) + "</span>" : "") +
      "</span>" +
      (ride.rating
        ? '<span class="ride-card-rating">' + icon("starFilled", "star-filled") + ride.rating + "</span>"
        : '<span class="ride-card-rating ride-card-rating-empty">Não avaliada</span>') +
      "</div>" +
      "</div>"
    );
  }

  function renderDriverCard(driver, opts) {
    opts = opts || {};
    return (
      '<div class="driver-card">' +
      '<span class="avatar avatar-lg avatar-driver">' + escapeHtml(driver.initials) + "</span>" +
      '<div class="driver-card-info">' +
      '<div class="driver-card-name">' + escapeHtml(driver.name) +
      (driver.role
        ? '<span class="badge badge-role badge-role-' + (driver.roleType || "responsavel") + '">' +
          escapeHtml(driver.role) + "</span>"
        : "") +
      "</div>" +
      '<div class="driver-card-rating">' + icon("starFilled", "star-filled") + driver.rating + " • " + driver.trips + " corridas</div>" +
      (driver.roleDetail ? '<div class="driver-card-role-detail">' + escapeHtml(driver.roleDetail) + "</div>" : "") +
      '<div class="driver-card-vehicle">' + escapeHtml(driver.vehicle) + " " + escapeHtml(driver.color) + " • <strong>" + escapeHtml(driver.plate) + "</strong></div>" +
      "</div>" +
      (opts.showContact
        ? '<button type="button" class="icon-btn driver-contact-btn" id="contact-driver-btn" aria-label="Entrar em contato com o motorista">' + icon("phone") + "</button>"
        : "") +
      "</div>"
    );
  }

  function renderTopBar(opts) {
    opts = opts || {};
    return (
      '<div class="topbar">' +
      (opts.back
        ? '<button type="button" class="icon-btn topbar-back" id="topbar-back-btn" aria-label="Voltar">' + icon("arrowLeft") + "</button>"
        : '<span class="topbar-spacer"></span>') +
      '<div class="topbar-titles">' +
      "<h1>" + escapeHtml(opts.title || "") + "</h1>" +
      (opts.subtitle ? '<p>' + escapeHtml(opts.subtitle) + "</p>" : "") +
      "</div>" +
      '<span class="topbar-spacer"></span>' +
      "</div>"
    );
  }

  return {
    formatBRL,
    formatDateBR,
    formatTimeBR,
    escapeHtml,
    showToast,
    openModal,
    closeModal,
    renderEmptyState,
    renderStars,
    renderMap,
    updateCarPosition,
    renderTopBar,
    renderSchoolCard,
    renderRideHistoryCard,
    renderDriverCard
  };
})();
