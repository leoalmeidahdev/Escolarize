/**
 * Escolarize — mapa real interativo.
 *
 * Provider atual: Leaflet + OpenStreetMap (sem chave de API, arquivos locais
 * em assets/vendor/leaflet). A camada de acesso é isolada em MapService para
 * que outro provedor (Google Maps, Mapbox) possa ser plugado no futuro:
 * basta implementar a mesma interface pública (load, createMap, destroy...).
 *
 * O mapa ilustrativo da Home continua existindo como prévia leve/offline;
 * este módulo é carregado sob demanda, ao abrir a tela de mapa.
 */

const MapService = (function () {
  const PROVIDER = "osm"; // "osm" | (futuro) "google" | "mapbox"

  const CITY_CENTER = { lat: -23.1965, lng: -45.8895 };
  const CITY_ZOOM = 13;

  const VENDOR_CSS = "assets/vendor/leaflet/leaflet.css";
  const VENDOR_JS = "assets/vendor/leaflet/leaflet.js";

  const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const TILE_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

  let loadPromise = null;
  let map = null;
  let pickupMarker = null;
  let schoolLayer = null;

  function isLoaded() {
    return typeof window.L !== "undefined";
  }

  /** Carrega CSS+JS do provedor sob demanda. Resolve false se falhar. */
  function load() {
    if (isLoaded()) return Promise.resolve(true);
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve) => {
      if (!document.querySelector('link[data-map-css]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = VENDOR_CSS;
        link.setAttribute("data-map-css", "true");
        document.head.appendChild(link);
      }

      const script = document.createElement("script");
      script.src = VENDOR_JS;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        loadPromise = null;
        resolve(false);
      };
      document.head.appendChild(script);
    });

    return loadPromise;
  }

  function schoolIconHtml(school) {
    return (
      '<span class="map-marker map-marker-school' + (school.popular ? " map-marker-popular" : "") + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 4 2.5 9 12 14l9.5-5L12 4z"/><path d="M6 11.5v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5"/>' +
      "</svg></span>"
    );
  }

  function googleMapsUrl(lat, lng, label) {
    const query = encodeURIComponent(label ? label : lat + "," + lng);
    return "https://www.google.com/maps/search/?api=1&query=" + query;
  }

  function schoolPopupHtml(school) {
    return (
      '<div class="map-popup">' +
      '<strong class="map-popup-title">' + Components.escapeHtml(school.name) + "</strong>" +
      '<span class="map-popup-address">' +
      Components.escapeHtml(school.address) + " — " + Components.escapeHtml(school.neighborhood) +
      "</span>" +
      '<button type="button" class="btn btn-primary btn-sm map-popup-btn" data-pick-school="' + school.id + '">' +
      "Escolher como destino</button>" +
      '<a class="map-popup-link" href="' + googleMapsUrl(school.lat, school.lng, school.name + " " + school.address + " São José dos Campos") +
      '" target="_blank" rel="noopener">Abrir no Google Maps</a>' +
      "</div>"
    );
  }

  /**
   * Cria o mapa no container informado.
   * onPickSchool(school) e onPickPoint({lat,lng}) são callbacks da view.
   */
  function createMap(containerId, opts) {
    opts = opts || {};
    const el = document.getElementById(containerId);
    if (!el || !isLoaded()) return null;

    destroy();

    map = L.map(el, { zoomControl: true, attributionControl: true }).setView(
      [CITY_CENTER.lat, CITY_CENTER.lng],
      CITY_ZOOM
    );

    L.tileLayer(TILE_URL, {
      maxZoom: 19,
      attribution: TILE_ATTRIBUTION
    }).addTo(map);

    schoolLayer = L.layerGroup().addTo(map);

    SCHOOLS.forEach((school) => {
      const marker = L.marker([school.lat, school.lng], {
        icon: L.divIcon({
          className: "map-marker-wrap",
          html: schoolIconHtml(school),
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -16]
        }),
        title: school.name,
        alt: school.name,
        keyboard: true
      });
      marker.bindPopup(schoolPopupHtml(school));
      marker.on("popupopen", (e) => {
        const btn = e.popup.getElement().querySelector("[data-pick-school]");
        if (btn && opts.onPickSchool) {
          btn.addEventListener("click", () => opts.onPickSchool(school));
        }
      });
      marker.addTo(schoolLayer);
    });

    if (opts.onPickPoint) {
      map.on("click", (e) => {
        opts.onPickPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    // o container costuma ser medido antes de estar visível
    setTimeout(() => map && map.invalidateSize(), 150);

    return map;
  }

  function setPickupMarker(point) {
    if (!map || !isLoaded()) return;
    if (pickupMarker) {
      pickupMarker.setLatLng([point.lat, point.lng]);
      return;
    }
    pickupMarker = L.marker([point.lat, point.lng], {
      icon: L.divIcon({
        className: "map-marker-wrap",
        html:
          '<span class="map-marker map-marker-pickup">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>' +
          "</svg></span>",
        iconSize: [34, 34],
        iconAnchor: [17, 30]
      }),
      title: "Ponto de embarque"
    }).addTo(map);
  }

  function focusSchool(school) {
    if (!map) return;
    map.setView([school.lat, school.lng], 16, { animate: true });
  }

  function getCenter() {
    if (!map) return null;
    const c = map.getCenter();
    return { lat: c.lat, lng: c.lng };
  }

  function panTo(point) {
    if (!map) return;
    map.panTo([point.lat, point.lng], { animate: true });
  }

  /**
   * No modo de embarque os marcadores de escola ficam inertes ao toque.
   * Sem isso o navegador "gruda" o toque no marcador mais próximo (touch
   * adjustment) e o ponto de embarque nunca é marcado.
   */
  function setSchoolMarkersInteractive(enabled) {
    if (!schoolLayer) return;
    schoolLayer.eachLayer((marker) => {
      const el = marker.getElement();
      if (el) el.style.pointerEvents = enabled ? "" : "none";
      if (!enabled) marker.closePopup();
    });
  }

  function fitAllSchools() {
    if (!map || !isLoaded()) return;
    const bounds = L.latLngBounds(SCHOOLS.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }

  function destroy() {
    if (map) {
      map.remove();
      map = null;
    }
    pickupMarker = null;
    schoolLayer = null;
  }

  /**
   * Endereço a partir de coordenadas (Nominatim/OSM, sem chave).
   * Falha graciosamente: devolve as coordenadas formatadas.
   */
  function reverseGeocode(point) {
    const fallback = "Ponto no mapa (" + point.lat.toFixed(5) + ", " + point.lng.toFixed(5) + ")";
    const url =
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&accept-language=pt-BR&lat=" +
      encodeURIComponent(point.lat) +
      "&lon=" +
      encodeURIComponent(point.lng);

    return fetch(url, { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !data.address) return fallback;
        const a = data.address;
        const street = a.road || a.pedestrian || a.suburb || a.neighbourhood;
        const number = a.house_number ? ", " + a.house_number : "";
        const city = a.city || a.town || a.municipality || "São José dos Campos";
        const state = a.state_code || "SP";
        if (!street) return fallback;
        return street + number + " - " + city + " - " + state;
      })
      .catch(() => fallback);
  }

  return {
    PROVIDER,
    CITY_CENTER,
    load,
    isLoaded,
    createMap,
    setPickupMarker,
    focusSchool,
    getCenter,
    panTo,
    setSchoolMarkersInteractive,
    fitAllSchools,
    reverseGeocode,
    googleMapsUrl,
    destroy
  };
})();
