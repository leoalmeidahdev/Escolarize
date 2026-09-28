/**
 * Escolarize — camada central de persistência (localStorage).
 * Toda leitura/escrita de dados persistentes do protótipo passa por aqui.
 */

const Storage = (function () {
  const KEYS = {
    FAVORITES: "escolarize_favoriteSchools",
    HISTORY: "escolarize_rideHistory",
    SCHEDULED: "escolarize_scheduledRides",
    PREFERENCES: "escolarize_preferences",
    LAST_SCHOOL: "escolarize_lastSelectedSchool"
  };

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (err) {
      console.warn("Storage: falha ao ler " + key, err);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn("Storage: falha ao salvar " + key, err);
      return false;
    }
  }

  // ---- Favoritos ----
  function loadFavorites() {
    return readJSON(KEYS.FAVORITES, []);
  }

  function saveFavorites(ids) {
    return writeJSON(KEYS.FAVORITES, ids);
  }

  function isFavorite(schoolId) {
    return loadFavorites().includes(schoolId);
  }

  function toggleFavorite(schoolId) {
    const favorites = loadFavorites();
    const idx = favorites.indexOf(schoolId);
    if (idx >= 0) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(schoolId);
    }
    saveFavorites(favorites);
    return favorites.includes(schoolId);
  }

  // ---- Histórico de corridas ----
  function loadRideHistory() {
    return readJSON(KEYS.HISTORY, []);
  }

  function saveRideHistory(rides) {
    return writeJSON(KEYS.HISTORY, rides);
  }

  function addRideToHistory(ride) {
    const rides = loadRideHistory();
    rides.unshift(ride);
    saveRideHistory(rides);
    return rides;
  }

  function updateRideInHistory(rideId, patch) {
    const rides = loadRideHistory();
    const idx = rides.findIndex((r) => r.id === rideId);
    if (idx >= 0) {
      rides[idx] = Object.assign({}, rides[idx], patch);
      saveRideHistory(rides);
    }
    return rides;
  }

  // ---- Agendamentos ----
  function loadScheduledRides() {
    return readJSON(KEYS.SCHEDULED, []);
  }

  function saveScheduledRides(items) {
    return writeJSON(KEYS.SCHEDULED, items);
  }

  function addScheduledRide(item) {
    const items = loadScheduledRides();
    items.push(item);
    saveScheduledRides(items);
    return items;
  }

  function removeScheduledRide(id) {
    const items = loadScheduledRides().filter((i) => i.id !== id);
    saveScheduledRides(items);
    return items;
  }

  // ---- Preferências ----
  function loadPreferences() {
    return readJSON(KEYS.PREFERENCES, { theme: "light", notifications: true });
  }

  function savePreferences(prefs) {
    return writeJSON(KEYS.PREFERENCES, prefs);
  }

  // ---- Última escola selecionada ----
  function loadLastSchool() {
    return readJSON(KEYS.LAST_SCHOOL, null);
  }

  function saveLastSchool(schoolId) {
    return writeJSON(KEYS.LAST_SCHOOL, schoolId);
  }

  return {
    KEYS,
    loadFavorites,
    saveFavorites,
    isFavorite,
    toggleFavorite,
    loadRideHistory,
    saveRideHistory,
    addRideToHistory,
    updateRideInHistory,
    loadScheduledRides,
    saveScheduledRides,
    addScheduledRide,
    removeScheduledRide,
    loadPreferences,
    savePreferences,
    loadLastSchool,
    saveLastSchool
  };
})();
