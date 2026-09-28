/**
 * Escolarize — seleção de escola e endereço de embarque.
 */

const SchoolsView = (function () {
  function filterSchools(query) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return SCHOOLS;
    return SCHOOLS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.neighborhood.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }

  function renderSchoolList(list) {
    if (!list.length) {
      return Components.renderEmptyState({
        icon: "search",
        title: "Nenhuma escola encontrada",
        text: "Tente pesquisar por outro nome ou bairro."
      });
    }
    const popular = list.filter((s) => s.popular);
    const others = list.filter((s) => !s.popular);
    let html = "";
    if (popular.length) {
      html += '<p class="list-subheading">Escolas populares</p>' + popular.map((s) => Components.renderSchoolCard(s)).join("");
    }
    if (others.length) {
      html += '<p class="list-subheading">Outras escolas</p>' + others.map((s) => Components.renderSchoolCard(s)).join("");
    }
    return html;
  }

  function renderSelectSchool() {
    return (
      '<div class="view schools-view">' +
      Components.renderTopBar({ title: "Para qual escola vamos?", subtitle: "Escolha o destino da corrida", back: true }) +
      // label envolve o campo: toda a área da pílula foca o input
      '<label class="search-field" for="school-search-input">' +
      icon("search", "search-field-icon") +
      '<input type="search" id="school-search-input" placeholder="Pesquisar escola" aria-label="Pesquisar escola">' +
      "</label>" +
      '<div id="school-list" class="school-list">' + renderSchoolList(SCHOOLS) + "</div>" +
      "</div>"
    );
  }

  function mountSelectSchool() {
    document.getElementById("topbar-back-btn").addEventListener("click", () => AppNav.back());

    const input = document.getElementById("school-search-input");
    const list = document.getElementById("school-list");

    input.addEventListener("input", () => {
      list.innerHTML = renderSchoolList(filterSchools(input.value));
      bindListEvents();
    });

    function bindListEvents() {
      list.querySelectorAll(".fav-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = Number(btn.dataset.favId);
          const nowFav = Storage.toggleFavorite(id);
          btn.classList.toggle("fav-active", nowFav);
          btn.setAttribute("aria-pressed", String(nowFav));
          btn.innerHTML = icon(nowFav ? "heartFilled" : "heart");
          Components.showToast(
            nowFav ? "Escola adicionada aos favoritos." : "Escola removida dos favoritos.",
            "success"
          );
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

    bindListEvents();
  }

  // ---------- Endereço de embarque ----------

  function renderSelectAddress() {
    const school = appState.selectedSchool;
    const defaultAddress = MockData.user.defaultAddress;

    return (
      '<div class="view address-view">' +
      Components.renderTopBar({ title: "De onde você vai sair?", subtitle: school ? "Indo para " + school.name : "", back: true }) +
      '<div class="address-field">' +
      '<label for="address-input">Endereço de embarque</label>' +
      '<div class="address-input-wrap">' +
      icon("mapPin", "address-input-icon") +
      '<input type="text" id="address-input" value="' + Components.escapeHtml(defaultAddress) + '" placeholder="Digite seu endereço" aria-describedby="address-error">' +
      "</div>" +
      '<p id="address-error" class="field-error" hidden>Informe um endereço para continuar.</p>' +
      "</div>" +

      '<button type="button" class="use-location-btn" id="use-location-btn">' +
      icon("compass") +
      '<span>Usar localização atual</span>' +
      "</button>" +

      '<p class="list-subheading">Endereços salvos</p>' +
      '<div class="saved-address-list">' +
      MockData.savedAddresses
        .map(
          (a) =>
            '<button type="button" class="saved-address-item" data-address="' + Components.escapeHtml(a.address) + '">' +
            icon("mapPin") +
            '<span><strong>' + Components.escapeHtml(a.label) + "</strong><span>" + Components.escapeHtml(a.address) + "</span></span>" +
            "</button>"
        )
        .join("") +
      "</div>" +

      '<div class="sticky-action">' +
      '<button type="button" class="btn btn-primary btn-block" id="continue-btn" disabled>Continuar</button>' +
      "</div>" +
      "</div>"
    );
  }

  function mountSelectAddress() {
    document.getElementById("topbar-back-btn").addEventListener("click", () => AppNav.back());

    const input = document.getElementById("address-input");
    const continueBtn = document.getElementById("continue-btn");
    const errorEl = document.getElementById("address-error");

    function validate() {
      const valid = input.value.trim().length > 4 && !!appState.selectedSchool;
      continueBtn.disabled = !valid;
      return valid;
    }

    input.addEventListener("input", () => {
      errorEl.hidden = true;
      validate();
    });

    document.getElementById("use-location-btn").addEventListener("click", () => {
      const btn = document.getElementById("use-location-btn");
      btn.classList.add("loading");
      btn.querySelector("span").textContent = "Localizando...";
      setTimeout(() => {
        input.value = "Av. Dr. Nelson D'Ávila, 400 - São José dos Campos - SP";
        btn.classList.remove("loading");
        btn.querySelector("span").textContent = "Usar localização atual";
        validate();
        Components.showToast("Localização atual simulada aplicada.", "success");
      }, 900);
    });

    document.querySelectorAll(".saved-address-item").forEach((item) => {
      item.addEventListener("click", () => {
        input.value = item.dataset.address;
        validate();
      });
    });

    continueBtn.addEventListener("click", () => {
      if (!validate()) {
        errorEl.hidden = false;
        return;
      }
      appState.selectedAddress = input.value.trim();
      AppNav.switchView("review");
    });

    validate();
  }

  return { renderSelectSchool, mountSelectSchool, renderSelectAddress, mountSelectAddress, filterSchools };
})();
