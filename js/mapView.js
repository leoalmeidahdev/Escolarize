/**
 * Escolarize — tela de mapa completo.
 *
 * Dois modos: escolher a escola de destino (clicando nos marcadores) ou
 * definir o ponto de embarque (clicando em qualquer lugar do mapa).
 */

const MapView = (function () {
  let mode = "school"; // "school" | "pickup"

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

      // mira central: no celular basta arrastar o mapa e confirmar
      '<div class="map-center-pin" id="map-center-pin" hidden aria-hidden="true">' +
      icon("mapPin") +
      "</div>" +

      '<button type="button" class="map-fit-btn" id="map-fit-btn" aria-label="Enquadrar todas as escolas">' +
      icon("compass") + "</button>" +

      // barra de confirmação sobre o mapa — sempre visível, sem precisar rolar
      '<div class="map-pickup-bar" id="map-pickup-bar" hidden>' +
      '<p id="map-pickup-hint">Arraste o mapa ou toque para escolher o embarque</p>' +
      '<button type="button" class="btn btn-primary btn-block" id="confirm-point-btn">Confirmar ponto de embarque</button>' +
      "</div>" +
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

  /** Confirma o ponto sob a mira (centro do mapa). */
  function confirmPickupPoint() {
    const point = MapService.getCenter();
    if (!point) return;

    const btn = document.getElementById("confirm-point-btn");
    const hint = document.getElementById("map-pickup-hint");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Buscando endereço...";
    }

    MapService.setPickupMarker(point);
    MapService.reverseGeocode(point).then((address) => {
      appState.selectedAddress = address;
      Components.showToast("Embarque: " + address, "success");
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Confirmar ponto de embarque";
      }
      if (hint) hint.textContent = address;
      updateSelection();
    });
  }

  function bindSelectionEvents() {
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

    const pickup = next === "pickup";
    const hint = document.getElementById("map-hint");
    if (hint) {
      hint.textContent = pickup
        ? "Arraste o mapa até o local de embarque (ou toque no ponto) e confirme."
        : "Toque em uma escola para ver os detalhes e escolhê-la como destino.";
    }

    const centerPin = document.getElementById("map-center-pin");
    if (centerPin) centerPin.hidden = !pickup;
    const bar = document.getElementById("map-pickup-bar");
    if (bar) bar.hidden = !pickup;

    // sem isso o toque "gruda" no marcador de escola mais próximo
    MapService.setSchoolMarkersInteractive(!pickup);
  }

  function mount() {
    document.getElementById("topbar-back-btn").addEventListener("click", () => AppNav.back());

    document.querySelectorAll(".map-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => setMode(btn.dataset.mode));
    });

    document.getElementById("confirm-point-btn").addEventListener("click", confirmPickupPoint);

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
        // tocar no mapa move a mira; a confirmação sempre usa o centro,
        // então existe um único ponto de referência na tela
        onPickPoint: (point) => {
          if (mode !== "pickup") return;
          MapService.panTo(point);
          const hint = document.getElementById("map-pickup-hint");
          if (hint) hint.textContent = "Confirme para usar este ponto como embarque";
        }
      });

      // o modo pode ter sido definido antes do mapa existir
      setMode(mode);

      if (appState.selectedSchool && appState.selectedSchool.lat) {
        MapService.focusSchool(appState.selectedSchool);
      }

      const fitBtn = document.getElementById("map-fit-btn");
      if (fitBtn) fitBtn.addEventListener("click", () => MapService.fitAllSchools());
    });

    AppNav.registerUnmount(() => {
      MapService.destroy();
    });
  }

  return { render, mount };
})();
