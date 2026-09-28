/**
 * Escolarize — agendamento de corridas.
 */

const ScheduleView = (function () {
  function sortedScheduled() {
    return Storage.loadScheduledRides()
      .slice()
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }

  function renderScheduleCard(item) {
    return (
      '<div class="schedule-card">' +
      '<div class="schedule-card-top">' +
      '<span class="schedule-card-school">' + icon("school") + Components.escapeHtml(item.schoolName) + "</span>" +
      '<span class="badge badge-blue">' + Components.escapeHtml(item.status) + "</span>" +
      "</div>" +
      '<div class="schedule-card-address">' + icon("mapPin") + Components.escapeHtml(item.address) + "</div>" +
      '<div class="schedule-card-meta">' +
      "<span>" + icon("calendar") + formatDateInput(item.date) + "</span>" +
      "<span>" + icon("clock") + item.time + "</span>" +
      "</div>" +
      '<button type="button" class="icon-btn schedule-cancel-btn" data-schedule-id="' + item.id + '" aria-label="Cancelar agendamento">' +
      icon("trash") +
      "</button>" +
      "</div>"
    );
  }

  function formatDateInput(dateStr) {
    const parts = (dateStr || "").split("-");
    if (parts.length !== 3) return dateStr;
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }

  function renderList() {
    const items = sortedScheduled();
    return (
      '<div class="view schedule-view">' +
      Components.renderTopBar({ title: "Agendamentos", subtitle: "Suas próximas corridas" }) +
      '<div class="sticky-action sticky-action-inline">' +
      '<button type="button" class="btn btn-primary btn-block" id="add-schedule-btn">' + icon("plus") + " Agendar corrida</button>" +
      "</div>" +
      '<div id="schedule-list" class="schedule-list">' +
      (items.length
        ? items.map(renderScheduleCard).join("")
        : Components.renderEmptyState({
            icon: "calendar",
            title: "Você não possui corridas agendadas.",
            text: "Agende uma corrida escolar com antecedência."
          })) +
      "</div>" +
      "</div>"
    );
  }

  function mountList() {
    document.getElementById("add-schedule-btn").addEventListener("click", () => AppNav.switchView("newSchedule"));
    bindCancelButtons();
  }

  function bindCancelButtons() {
    document.querySelectorAll(".schedule-cancel-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.scheduleId;
        Components.openModal({
          title: "Cancelar agendamento",
          bodyHtml: "<p>Deseja cancelar este agendamento?</p>",
          actions: [
            { label: "Cancelar", variant: "outline" },
            {
              label: "Continuar",
              variant: "danger",
              onClick: () => {
                Storage.removeScheduledRide(id);
                Components.showToast("Agendamento cancelado.", "success");
                const list = document.getElementById("schedule-list");
                const items = sortedScheduled();
                list.innerHTML = items.length
                  ? items.map(renderScheduleCard).join("")
                  : Components.renderEmptyState({
                      icon: "calendar",
                      title: "Você não possui corridas agendadas.",
                      text: "Agende uma corrida escolar com antecedência."
                    });
                bindCancelButtons();
              }
            }
          ]
        });
      });
    });
  }

  // ---------- Novo agendamento ----------
  function renderForm() {
    const today = new Date().toISOString().slice(0, 10);
    return (
      '<div class="view schedule-form-view">' +
      Components.renderTopBar({ title: "Agendar corrida", back: true }) +
      '<form id="schedule-form" novalidate>' +

      '<div class="form-field">' +
      '<label for="schedule-school">Escola</label>' +
      '<select id="schedule-school" required>' +
      '<option value="" disabled selected>Selecione uma escola</option>' +
      SCHOOLS.map((s) => '<option value="' + s.id + '">' + Components.escapeHtml(s.name) + "</option>").join("") +
      "</select>" +
      '<p class="field-error" id="error-school" hidden>Selecione uma escola.</p>' +
      "</div>" +

      '<div class="form-field">' +
      '<label for="schedule-address">Endereço de embarque</label>' +
      '<input type="text" id="schedule-address" value="' + Components.escapeHtml(MockData.user.defaultAddress) + '" required>' +
      '<p class="field-error" id="error-address" hidden>Informe o endereço de embarque.</p>' +
      "</div>" +

      '<div class="form-row">' +
      '<div class="form-field">' +
      '<label for="schedule-date">Data</label>' +
      '<input type="date" id="schedule-date" min="' + today + '" required>' +
      '<p class="field-error" id="error-date" hidden>Escolha uma data válida.</p>' +
      "</div>" +
      '<div class="form-field">' +
      '<label for="schedule-time">Horário</label>' +
      '<input type="time" id="schedule-time" required>' +
      '<p class="field-error" id="error-time" hidden>Escolha um horário.</p>' +
      "</div>" +
      "</div>" +

      '<div class="sticky-action">' +
      '<button type="submit" class="btn btn-primary btn-block">Agendar corrida</button>' +
      "</div>" +
      "</form>" +
      "</div>"
    );
  }

  function mountForm() {
    document.getElementById("topbar-back-btn").addEventListener("click", () => AppNav.back());

    const form = document.getElementById("schedule-form");
    const today = new Date().toISOString().slice(0, 10);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const schoolSelect = document.getElementById("schedule-school");
      const addressInput = document.getElementById("schedule-address");
      const dateInput = document.getElementById("schedule-date");
      const timeInput = document.getElementById("schedule-time");

      let valid = true;
      toggleError("error-school", !schoolSelect.value);
      if (!schoolSelect.value) valid = false;

      toggleError("error-address", !addressInput.value.trim());
      if (!addressInput.value.trim()) valid = false;

      const dateValid = !!dateInput.value && dateInput.value >= today;
      toggleError("error-date", !dateValid);
      if (!dateValid) valid = false;

      toggleError("error-time", !timeInput.value);
      if (!timeInput.value) valid = false;

      if (!valid) return;

      const school = SCHOOLS.find((s) => s.id === Number(schoolSelect.value));
      Storage.addScheduledRide({
        id: "sch_" + Date.now(),
        schoolId: school.id,
        schoolName: school.name,
        address: addressInput.value.trim(),
        date: dateInput.value,
        time: timeInput.value,
        status: "Agendado",
        createdAt: new Date().toISOString()
      });

      Components.showToast("Agendamento criado.", "success");
      AppNav.switchView("schedule");
    });
  }

  function toggleError(id, show) {
    const el = document.getElementById(id);
    if (el) el.hidden = !show;
  }

  return { renderList, mountList, renderForm, mountForm };
})();
