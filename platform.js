(function () {
  let installPrompt = null;

  function installButtons() {
    return document.querySelectorAll("[data-install-platform]");
  }

  function updateInstallButtons() {
    installButtons().forEach((button) => {
      button.hidden = !installPrompt;
    });
  }

  function updateConnectionStatus() {
    const status = document.getElementById("connection-status");
    if (!status) {
      return;
    }

    const offline = navigator.onLine === false;
    status.hidden = !offline;
    status.textContent = offline
      ? "Você está offline. Leituras e registros salvos continuam disponíveis."
      : "";
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    updateInstallButtons();
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    updateInstallButtons();
  });

  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);

  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-install-platform]");
    if (!button || !installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    updateInstallButtons();
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // The web app remains usable without offline installation support.
      });
    });
  }

  const observer = new MutationObserver(updateInstallButtons);
  observer.observe(document.getElementById("app"), { childList: true, subtree: true });
  updateConnectionStatus();
  updateInstallButtons();
})();
