/**
 * Escolarize — tela de mapa completo.
 *
 * Dois modos: escolher a escola de destino (clicando nos marcadores) ou
 * definir o ponto de embarque (clicando em qualquer lugar do mapa).
 */

const MapView = (function () {
  let mode = "school"; // "school" | "pickup"
  let pendingPoint = null;

  function render() {
    return (
      '<div class="view map-view">' +
      Components.renderTopBar({ title: "Mapa", subtitle: "São José dos Campos - SP", back: true }) +

      '<div class="map-mode-switch" role="tablist" aria-label="Modo do mapa">' +
      '<button type="button" class="map-mode-btn" data-mode="school" role="tab">' +
      icon("school") + "<span>Escolher escola</span></button>" +
      '<button type="button" class="map-mode-btn" data-mode="pickup" role="tab">' +
      icon("mapPin") + "<span>Definir embarque</span></button>" +
      "</div>" +

      '<p class="map-hint" id="map-hint"></p>' +

      '<div class="map-canvas-wrap">' +
      '<div id="real-map" class="map-canvas" role="application" aria-label="Mapa de São José dos Campos com as escolas disponíveis"></div>' +
      '<button type="button" class="map-fit-btn" id="map-fit-btn" aria-label="Enquadrar todas as escolas">' +
      icon("compass") + "</button>" +
      "</div>" +

      '<div class="map-selection" id="map-selection"></div>' +
      "</div>"
    );
  }

  function renderSelection() {
    const school = appState.selectedSchool;
    const address = appState.selectedAddress;

    return (
      '<div class="map-selection-row">' +
      icon("school", "map-selection-icon") +
      "<span><strong>Destino</strong><span>" +
      (school ? Components.escapeHtml(school.name) : "Nenhuma escola selecionada") +
      "</span></span>" +
      "</div>" +
      '<div class="map-selection-row">' +
      icon("mapPin", "map-selection-icon") +
      "<span><strong>Embarque</strong><span>" +
      (address ? Components.escapeHtml(address) : Components.escapeHtml(MockData.user.defaultAddress) + " (padrão)") +
      "</span></span>" +
      "</div>" +
      (pendingPoint
        ? '<button type="button" class="btn btn-outline btn-block" id="use-point-btn">Usar este ponto como embarque</button>'
        : "") +
      '<button type="button" class="btn btn-primary btn-block" id="map-continue-btn"' +
      (school ? "" : " disabled") +
      ">Continuar</button>" +
      (school
        ? ""
        : '<p class="map-selection-note">Toque em uma escola no mapa para definir o destino.</p>')
    );
  }

  function updateSelection() {
    const box = document.getElementById("map-selection");
    if (!box) return;
    box.innerHTML = renderSelection();
    bindSelectionEvents();
  }

  function bindSelectionEvents() {
    const usePointBtn = document.getElementById("use-point-btn");
    if (usePointBtn) {
      usePointBtn.addEventListener("click", () => {
        if (!pendingPoint) return;
        usePointBtn.disabled = true;
        usePointBtn.textContent = "Buscando endereço...";
        MapService.reverseGeocode(pendingPoint).then((address) => {
          appState.selectedAddress = address;
          pendingPoint = null;
          Components.showToast("Ponto de embarque definido.", "success");
          updateSelection();
        });
      });
    }

    const continueBtn = document.getElementById("map-continue-btn");
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        if (!appState.selectedSchool) {
          Components.showToast("Selecione uma escola para continuar.", "error");
          return;
        }
        if (!appState.selectedAddress) {
          appState.selectedAddress = MockData.user.defaultAddress;
        }
        AppNav.switchView("review");
      });
    }
  }

  function setMode(next) {
    mode = next;
    document.querySelectorAll(".map-mode-btn").forEach((btn) => {
      const active = btn.dataset.mode === next;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    const hint = document.getElementById("map-hint");
    if (hint) {
      hint.textContent =
        next === "school"
          ? "Toque em uma escola para ver os detalhes e escolhê-la como destino."
          : "Toque em qualquer ponto do mapa para definir seu local de embarque.";
    }
  }

  function mount() {
    document.getElementById("topbar-back-btn").addEventListener("click", () => AppNav.back());

    document.querySelectorAll(".map-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => setMode(btn.dataset.mode));
    });

    setMode(appState.viewParams && appState.viewParams.mode === "pickup" ? "pickup" : "school");
    updateSelection();

    const canvas = document.getElementById("real-map");
    canvas.innerHTML = '<div class="map-loading"><div class="spinner"></div><p>Carregando mapa…</p></div>';

    MapService.load().then((ok) => {
      if (!ok) {
        canvas.innerHTML =
          '<div class="map-loading map-loading-error">' +
          icon("info") +
          "<p>Não foi possível carregar o mapa agora. Verifique sua conexão e tente novamente.</p>" +
          "</div>";
        Components.showToast("Mapa indisponível no momento.", "error");
        return;
      }

      canvas.innerHTML = "";
      MapService.createMap("real-map", {
        onPickSchool: (school) => {
          appState.selectedSchool = school;
          Storage.saveLastSchool(school.id);
          Components.showToast("Destino: " + school.name, "success");
          MapService.focusSchool(school);
          updateSelection();
        },
        onPickPoint: (point) => {
          if (mode !== "pickup") return;
          pendingPoint = point;
          MapService.setPickupMarker(point);
          updateSelection();
        }
      });

      if (appState.selectedSchool && appState.selectedSchool.lat) {
        MapService.focusSchool(appState.selectedSchool);
      }

      const fitBtn = document.getElementById("map-fit-btn");
      if (fitBtn) fitBtn.addEventListener("click", () => MapService.fitAllSchools());
    });

    AppNav.registerUnmount(() => {
      MapService.destroy();
      pendingPoint = null;
    });
  }

  return { render, mount };
})();
