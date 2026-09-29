/**
 * Escolarize — tela de boas-vindas.
 * Aparece apenas na primeira vez, para o usuário escolher como quer ser
 * chamado. O nome fica no localStorage e pode ser alterado no Perfil.
 * Não é login: não há senha, conta ou validação de identidade.
 */

const WelcomeView = (function () {
  const MAX_LENGTH = 24;

  function render() {
    return (
      '<div class="view welcome-view">' +
      '<div class="welcome-content">' +
      '<div class="welcome-logo">' + icon("school") + "</div>" +
      "<h1>Bem-vindo ao Escolarize</h1>" +
      "<p class=\"welcome-subtitle\">Caronas escolares em São José dos Campos, com quem já faz o mesmo trajeto todo dia.</p>" +

      '<form id="welcome-form" class="welcome-form" novalidate>' +
      '<label for="welcome-name">Como podemos te chamar?</label>' +
      '<input type="text" id="welcome-name" maxlength="' + MAX_LENGTH + '" autocomplete="given-name" ' +
      'placeholder="Digite seu nome" aria-describedby="welcome-error">' +
      '<p class="field-error" id="welcome-error" hidden>Digite um nome com pelo menos 2 letras.</p>' +
      '<button type="submit" class="btn btn-primary btn-block">Começar</button>' +
      "</form>" +

      '<p class="prototype-notice">Protótipo demonstrativo — funcionalidades de transporte, pagamento e comunicação são simuladas.</p>' +
      "</div>" +
      "</div>"
    );
  }

  function mount() {
    const form = document.getElementById("welcome-form");
    const input = document.getElementById("welcome-name");
    const error = document.getElementById("welcome-error");

    input.addEventListener("input", () => {
      error.hidden = true;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (name.length < 2) {
        error.hidden = false;
        input.focus();
        return;
      }
      Storage.saveUserName(name);
      Components.showToast("Olá, " + name + "!", "success");
      AppNav.switchView(appState.pendingView || "home");
    });

    input.focus();
  }

  return { render, mount, MAX_LENGTH };
})();
