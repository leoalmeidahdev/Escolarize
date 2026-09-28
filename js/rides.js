/**
 * Escolarize — fluxo de corridas: revisão, solicitação, acompanhamento (mock),
 * conclusão e histórico. Preço/tempo/motorista são inteiramente simulados.
 *
 * Funções separadas (createRide, findDriver via timers, updateStatus, completeRide)
 * para que, no futuro, cada uma possa ser trocada por uma chamada de API real.
 */

const RidesView = (function () {
  const ORIGIN_COORDS = { x: 40, y: 82 };
  const DRIVER_START_COORDS = { x: 92, y: 90 };

  const STATUS_FLOW = [
    "SEARCHING",
    "DRIVER_FOUND",
    "DRIVER_ON_WAY",
    "DRIVER_ARRIVED",
    "RIDE_STARTED",
    "RIDE_IN_PROGRESS",
    "ARRIVED",
    "COMPLETED"
  ];

  const AUTO_DURATIONS = {
    SEARCHING: 2500,
    DRIVER_FOUND: 2000,
    DRIVER_ON_WAY: 4000,
    RIDE_STARTED: 800,
    RIDE_IN_PROGRESS: 6000
  };

  let timers = [];
  let rafId = null;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // ---------- Preço mock ----------
  function computePrice(distanceKm) {
    const base = 5.9;
    const perKm = 1.9;
    const fee = 2.1;
    const raw = base + distanceKm * perKm + fee;
    return Math.round(raw * 10) / 10;
  }

  // ---------- Revisão da corrida ----------
  function renderReview() {
    const school = appState.selectedSchool;
    const address = appState.selectedAddress;

    if (!school || !address) {
      return (
        '<div class="view review-view">' +
        Components.renderTopBar({ title: "Revise sua corrida", back: true }) +
        Components.renderEmptyState({
          icon: "school",
          title: "Selecione uma escola para continuar.",
          text: "Volte e escolha a escola e o endereço de embarque.",
          actionLabel: "Escolher escola",
          actionId: "goto-schools-btn"
        }) +
        "</div>"
      );
    }

    const price = computePrice(school.distanceKm);

    return (
      '<div class="view review-view">' +
      Components.renderTopBar({ title: "Revise sua corrida", subtitle: school.name, back: true }) +

      '<div class="review-card">' +
      Components.renderMap({
        variant: "route",
        originCoords: ORIGIN_COORDS,
        destCoords: school.coords,
        destLabel: school.name,
        showLabels: true
      }) +

      '<div class="route-points">' +
      '<div class="route-point">' + icon("mapPin", "route-point-icon route-point-origin") +
      '<span><strong>Origem</strong><span>' + Components.escapeHtml(address) + "</span></span></div>" +
      '<div class="route-point-connector"></div>' +
      '<div class="route-point">' + icon("school", "route-point-icon route-point-dest") +
      '<span><strong>Destino</strong><span>' + Components.escapeHtml(school.name) + " — " + Components.escapeHtml(school.address) + "</span></span></div>" +
      "</div>" +

      '<div class="review-details">' +
      '<div class="review-row"><span>Distância</span><span>' + school.distanceKm.toFixed(1).replace(".", ",") + " km</span></div>" +
      '<div class="review-row"><span>Tempo estimado</span><span>' + school.etaMin + " min</span></div>" +
      '<div class="review-row"><span>Motorista</span><span>Será encontrado após solicitar</span></div>' +
      '<div class="review-row review-row-price"><span>Valor estimado</span><span>' + Components.formatBRL(price) + "</span></div>" +
      "</div>" +
      "</div>" +

      '<p class="mock-disclaimer">Distância, tempo e motorista são simulados neste protótipo.</p>' +

      '<div class="sticky-action sticky-action-double">' +
      '<button type="button" class="btn btn-outline" id="review-back-btn">Voltar</button>' +
      '<button type="button" class="btn btn-primary" id="request-ride-btn">Solicitar corrida</button>' +
      "</div>" +
      "</div>"
    );
  }

  function mountReview() {
    const backBtn = document.getElementById("topbar-back-btn");
    if (backBtn) backBtn.addEventListener("click", () => AppNav.back());

    const gotoSchools = document.getElementById("goto-schools-btn");
    if (gotoSchools) gotoSchools.addEventListener("click", () => AppNav.switchView("schools"));

    const reviewBack = document.getElementById("review-back-btn");
    if (reviewBack) reviewBack.addEventListener("click", () => AppNav.back());

    const requestBtn = document.getElementById("request-ride-btn");
    if (requestBtn) requestBtn.addEventListener("click", requestRide);
  }

  // ---------- Solicitar corrida ----------
  function requestRide() {
    const school = appState.selectedSchool;
    const address = appState.selectedAddress;
    if (!school || !address) {
      Components.showToast("Selecione uma escola para continuar.", "error");
      AppNav.switchView("schools");
      return;
    }

    const ride = {
      id: "ride_" + Date.now(),
      school: {
        id: school.id,
        name: school.name,
        address: school.address,
        neighborhood: school.neighborhood
      },
      origin: address,
      distanceKm: school.distanceKm,
      etaMin: school.etaMin,
      price: computePrice(school.distanceKm),
      status: "SEARCHING",
      createdAt: new Date().toISOString(),
      driver: MockData.driver,
      rating: null
    };

    appState.currentRide = ride;
    appState.rideStatus = ride.status;
    Components.showToast("Corrida solicitada.", "success");
    AppNav.switchView("tracking");
  }

  // ---------- Acompanhamento (tracking) ----------
  function renderTracking() {
    const ride = appState.currentRide;
    if (!ride) {
      return (
        '<div class="view tracking-view">' +
        Components.renderEmptyState({
          icon: "ride",
          title: "Nenhuma corrida em andamento.",
          text: "Solicite uma corrida para acompanhar aqui.",
          actionLabel: "Escolher escola",
          actionId: "goto-schools-btn"
        }) +
        "</div>"
      );
    }

    const school = SCHOOLS.find((s) => s.id === ride.school.id) || { coords: { x: 60, y: 40 } };

    return (
      '<div class="view tracking-view">' +
      '<div class="topbar topbar-tracking">' +
      '<span class="topbar-spacer"></span>' +
      '<div class="topbar-titles"><h1>Sua corrida</h1></div>' +
      '<span class="topbar-spacer"></span>' +
      "</div>" +
      '<div class="tracking-map-wrap">' +
      Components.renderMap({
        variant: "tracking",
        originCoords: ORIGIN_COORDS,
        destCoords: school.coords,
        destLabel: ride.school.name,
        showLabels: true
      }) +
      "</div>" +
      '<div class="tracking-sheet" id="tracking-panel"></div>' +
      "</div>"
    );
  }

  function renderTrackingPanel(ride) {
    switch (ride.status) {
      case "SEARCHING":
        return (
          '<div class="tracking-status">' +
          '<div class="spinner" aria-hidden="true"></div>' +
          "<h2>Procurando motorista…</h2>" +
          "<p>Estamos localizando o motorista mais próximo para sua corrida.</p>" +
          renderDevSkip() +
          "</div>"
        );

      case "DRIVER_FOUND":
        return (
          '<div class="tracking-status tracking-status-success">' +
          '<div class="status-icon status-icon-success">' + icon("check") + "</div>" +
          "<h2>Motorista encontrado!</h2>" +
          Components.renderDriverCard(ride.driver) +
          renderDevSkip() +
          "</div>"
        );

      case "DRIVER_ON_WAY":
        return (
          '<div class="tracking-status">' +
          "<h2>" + Components.escapeHtml(ride.driver.name) + " está a caminho</h2>" +
          Components.renderDriverCard(ride.driver, { showContact: true }) +
          '<p class="tracking-eta">' + icon("clock") + " Chegada estimada: " + ride.driver.etaMin + " min</p>" +
          renderDevSkip() +
          "</div>"
        );

      case "DRIVER_ARRIVED":
        return (
          '<div class="tracking-status">' +
          "<h2>O motorista chegou</h2>" +
          Components.renderDriverCard(ride.driver, { showContact: true }) +
          "<p>" + Components.escapeHtml(ride.driver.name) + " está aguardando no endereço informado.</p>" +
          '<button type="button" class="btn btn-primary btn-block" id="start-ride-btn">Iniciar corrida</button>' +
          renderDevSkip() +
          "</div>"
        );

      case "RIDE_STARTED":
        return (
          '<div class="tracking-status">' +
          '<div class="spinner" aria-hidden="true"></div>' +
          "<h2>Corrida iniciada</h2>" +
          "<p>Seguindo para " + Components.escapeHtml(ride.school.name) + "…</p>" +
          "</div>"
        );

      case "RIDE_IN_PROGRESS":
        return (
          '<div class="tracking-status">' +
          "<h2>Corrida em andamento</h2>" +
          '<div class="progress-track"><div class="progress-fill" id="ride-progress-bar"></div></div>' +
          '<div class="route-points">' +
          '<div class="route-point">' + icon("mapPin", "route-point-icon route-point-origin") +
          '<span><strong>Origem</strong><span>' + Components.escapeHtml(ride.origin) + "</span></span></div>" +
          '<div class="route-point-connector"></div>' +
          '<div class="route-point">' + icon("school", "route-point-icon route-point-dest") +
          '<span><strong>Destino</strong><span>' + Components.escapeHtml(ride.school.name) + "</span></span></div>" +
          "</div>" +
          Components.renderDriverCard(ride.driver) +
          renderDevSkip() +
          "</div>"
        );

      case "ARRIVED":
        return (
          '<div class="tracking-status tracking-status-success">' +
          '<div class="status-icon status-icon-success">' + icon("check") + "</div>" +
          "<h2>Você chegou à escola!</h2>" +
          "<p>" + Components.escapeHtml(ride.school.name) + " • " + Components.formatTimeBR(new Date().toISOString()) + "</p>" +
          '<button type="button" class="btn btn-primary btn-block" id="finish-ride-btn">Finalizar corrida</button>' +
          "</div>"
        );

      default:
        return "";
    }
  }

  function renderDevSkip() {
    return '<button type="button" class="dev-skip-btn" id="dev-skip-btn">Pular etapa (demo)</button>';
  }

  function bindPanelEvents() {
    const startBtn = document.getElementById("start-ride-btn");
    if (startBtn) startBtn.addEventListener("click", startRide);

    const finishBtn = document.getElementById("finish-ride-btn");
    if (finishBtn) finishBtn.addEventListener("click", finishRide);

    const contactBtn = document.getElementById("contact-driver-btn");
    if (contactBtn) {
      contactBtn.addEventListener("click", () => {
        Components.openModal({
          title: "Entrar em contato",
          bodyHtml: "<p>Esta função será integrada futuramente.</p>",
          actions: [{ label: "Ok", variant: "primary" }]
        });
      });
    }

    const skipBtn = document.getElementById("dev-skip-btn");
    if (skipBtn) skipBtn.addEventListener("click", devSkip);
  }

  function setStatus(status) {
    const ride = appState.currentRide;
    if (!ride) return;
    ride.status = status;
    appState.rideStatus = status;

    const panel = document.getElementById("tracking-panel");
    if (panel) {
      panel.innerHTML = renderTrackingPanel(ride);
      bindPanelEvents();
    }

    const toastMessages = {
      DRIVER_FOUND: "Motorista encontrado!",
      DRIVER_ON_WAY: "Seu motorista está a caminho.",
      DRIVER_ARRIVED: "Seu motorista chegou.",
      ARRIVED: "Você chegou à escola!"
    };
    if (toastMessages[status]) Components.showToast(toastMessages[status], "success");

    handleStatusSideEffects(status);
    scheduleAuto(status);
  }

  function handleStatusSideEffects(status) {
    const school = SCHOOLS.find((s) => s.id === appState.currentRide.school.id) || { coords: { x: 60, y: 40 } };
    if (status === "DRIVER_ON_WAY") {
      animateCar(DRIVER_START_COORDS, ORIGIN_COORDS, AUTO_DURATIONS.DRIVER_ON_WAY);
    } else if (status === "RIDE_IN_PROGRESS") {
      animateCar(ORIGIN_COORDS, school.coords, AUTO_DURATIONS.RIDE_IN_PROGRESS);
      requestAnimationFrame(() => {
        const bar = document.getElementById("ride-progress-bar");
        if (bar) {
          bar.style.transitionDuration = AUTO_DURATIONS.RIDE_IN_PROGRESS + "ms";
          requestAnimationFrame(() => (bar.style.width = "100%"));
        }
      });
    }
  }

  function animateCar(from, to, duration) {
    const school = SCHOOLS.find((s) => s.id === appState.currentRide.school.id) || { coords: to };
    const start = performance.now();
    function step(now) {
      const ratio = Math.min(1, (now - start) / duration);
      Components.updateCarPosition(ratio, from, to);
      if (ratio < 1) {
        rafId = requestAnimationFrame(step);
      }
    }
    rafId = requestAnimationFrame(step);
  }

  function scheduleAuto(status) {
    const duration = AUTO_DURATIONS[status];
    if (!duration) return; // aguarda ação do usuário (DRIVER_ARRIVED, ARRIVED) ou é terminal
    const idx = STATUS_FLOW.indexOf(status);
    const next = STATUS_FLOW[idx + 1];
    const t = setTimeout(() => setStatus(next), duration);
    timers.push(t);
  }

  function startRide() {
    clearTimers();
    setStatus("RIDE_STARTED");
  }

  function finishRide() {
    clearTimers();
    const ride = appState.currentRide;
    ride.status = "COMPLETED";
    ride.completedAt = new Date().toISOString();
    Storage.addRideToHistory(ride);
    Components.showToast("Corrida finalizada.", "success");
    AppNav.switchView("completed");
  }

  function devSkip() {
    clearTimers();
    const status = appState.currentRide.status;
    if (status === "DRIVER_ARRIVED") startRide();
    else if (status === "ARRIVED") finishRide();
    else {
      const idx = STATUS_FLOW.indexOf(status);
      setStatus(STATUS_FLOW[idx + 1]);
    }
  }

  function mountTracking() {
    const gotoSchools = document.getElementById("goto-schools-btn");
    if (gotoSchools) {
      gotoSchools.addEventListener("click", () => AppNav.switchView("schools"));
      return;
    }
    const ride = appState.currentRide;
    const panel = document.getElementById("tracking-panel");
    panel.innerHTML = renderTrackingPanel(ride);
    bindPanelEvents();
    scheduleAuto(ride.status);
    AppNav.registerUnmount(clearTimers);
  }

  // ---------- Corrida concluída ----------
  function renderCompleted() {
    const ride = appState.currentRide;
    if (!ride) {
      return '<div class="view completed-view">' + Components.renderEmptyState({ icon: "check", title: "Nenhuma corrida concluída recentemente." }) + "</div>";
    }
    return (
      '<div class="view completed-view">' +
      '<div class="completed-hero">' +
      '<div class="status-icon status-icon-success status-icon-lg">' + icon("check") + "</div>" +
      "<h1>Corrida concluída</h1>" +
      "<p>" + Components.escapeHtml(ride.school.name) + "</p>" +
      "</div>" +

      '<div class="review-card">' +
      '<div class="review-row"><span>Escola</span><span>' + Components.escapeHtml(ride.school.name) + "</span></div>" +
      '<div class="review-row"><span>Endereço</span><span>' + Components.escapeHtml(ride.school.address) + "</span></div>" +
      '<div class="review-row"><span>Motorista</span><span>' + Components.escapeHtml(ride.driver.name) + "</span></div>" +
      '<div class="review-row"><span>Horário</span><span>' + Components.formatTimeBR(ride.completedAt || ride.createdAt) + "</span></div>" +
      '<div class="review-row review-row-price"><span>Valor</span><span>' + Components.formatBRL(ride.price) + "</span></div>" +
      "</div>" +

      '<div class="rating-card">' +
      "<h3>Avalie o motorista</h3>" +
      Components.renderStars(ride.rating || 0, { interactive: true }) +
      '<p id="rating-feedback" class="rating-feedback"></p>' +
      "</div>" +

      '<div class="sticky-action">' +
      '<button type="button" class="btn btn-primary btn-block" id="back-home-btn">Voltar para o início</button>' +
      "</div>" +
      "</div>"
    );
  }

  function mountCompleted() {
    const ride = appState.currentRide;
    if (!ride) return;

    document.querySelectorAll(".star-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = Number(btn.dataset.star);
        ride.rating = value;
        Storage.updateRideInHistory(ride.id, { rating: value });
        document.querySelectorAll(".star-btn").forEach((b, i) => {
          const filled = i < value;
          b.innerHTML = icon(filled ? "starFilled" : "star", "star-icon" + (filled ? " star-filled" : ""));
        });
        document.getElementById("rating-feedback").textContent = "Obrigado por avaliar " + ride.driver.name + "!";
      });
    });

    document.getElementById("back-home-btn").addEventListener("click", () => {
      appState.currentRide = null;
      appState.selectedSchool = null;
      appState.selectedAddress = null;
      AppNav.switchView("home");
    });
  }

  // ---------- Histórico ----------
  function renderHistory() {
    const rides = Storage.loadRideHistory();
    return (
      '<div class="view history-view">' +
      Components.renderTopBar({ title: "Minhas corridas" }) +
      '<div class="sticky-action sticky-action-inline">' +
      '<button type="button" class="btn btn-primary btn-block" id="new-ride-btn">Solicitar nova corrida</button>' +
      "</div>" +
      '<div class="ride-list">' +
      (rides.length
        ? rides.map((r) => Components.renderRideHistoryCard(r)).join("")
        : Components.renderEmptyState({
            icon: "clock",
            title: "Você ainda não realizou nenhuma corrida.",
            text: "Suas corridas concluídas aparecerão aqui."
          })) +
      "</div>" +
      "</div>"
    );
  }

  function mountHistory() {
    document.getElementById("new-ride-btn").addEventListener("click", () => AppNav.switchView("schools"));
  }

  return {
    computePrice,
    renderReview,
    mountReview,
    requestRide,
    renderTracking,
    mountTracking,
    renderCompleted,
    mountCompleted,
    renderHistory,
    mountHistory
  };
})();
