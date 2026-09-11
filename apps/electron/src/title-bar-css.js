const MAC_TRAFFIC_LIGHTS_CLEARANCE_PX = 88;

const TITLE_BAR_PADDING_CSS = `
  /* Only push the left sidebar nav down by 38px to clear macOS traffic lights.
     The right column (topbar + content) stays at its natural position. */
  .shell-nav {
    padding-top: 38px !important;
  }
  /* Mobile: .shell-nav becomes position: fixed — use top offset instead. */
  @media (max-width: 1100px) {
    .shell-nav {
      top: 38px !important;
      padding-top: 0 !important;
    }
    /* The drawer breakpoint moves the topbar to the window's left edge.
       Keep its hamburger and breadcrumb clear of the native traffic lights. */
    .topbar {
      padding-left: ${MAC_TRAFFIC_LIGHTS_CLEARANCE_PX}px !important;
    }
  }
  /* .shell-nav is already positioned by the Control UI shell at every breakpoint. */
  .shell-nav::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 38px;
    -webkit-app-region: drag;
    z-index: 100;
    pointer-events: auto;
  }
  /* Let the main top bar move the frameless window while its controls remain interactive. */
  .topbar {
    -webkit-app-region: drag;
  }
  .topbar button,
  .topbar a,
  .topbar input,
  .topbar select,
  .topbar textarea,
  .topbar [role="button"],
  .topbar [contenteditable="true"] {
    -webkit-app-region: no-drag;
  }
`;

// The Control UI does not render Electron window controls. On Windows the
// BrowserWindow is frameless (titleBarStyle: "hidden"), so the minimize,
// maximize, and close buttons plus the window drag region are injected here.
const WIN_TITLE_BAR_CSS = `
  .win-title-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 38px;
    -webkit-app-region: drag;
    z-index: 9999;
    display: flex;
    align-items: center;
    pointer-events: auto;
  }
  .win-title-bar__buttons {
    display: flex;
    align-items: center;
    padding-left: 12px;
    -webkit-app-region: no-drag;
  }
  .win-title-btn {
    width: 46px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-app-region: no-drag;
    transition: background 0.1s;
    color: #e0e0e0;
  }
  .win-title-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  .win-title-btn:active {
    background: rgba(255, 255, 255, 0.12);
  }
  .win-title-btn.close:hover {
    background: #e81123;
  }
  .win-title-btn svg {
    width: 12px;
    height: 12px;
  }
`;

const WIN_TITLE_BAR_JS = `
(function () {
  if (document.getElementById("win-title-bar")) return;
  var api = window.electronAPI;
  if (!api) return;

  var icons = {
    minimize: '<svg viewBox="0 0 12 12"><path d="M2 6h8" stroke="currentColor" stroke-width="1" fill="none"/></svg>',
    maximize: '<svg viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>',
    restore: '<svg viewBox="0 0 12 12"><rect x="2" y="0.5" width="7.5" height="7.5" rx="0.5" fill="none" stroke="currentColor" stroke-width="0.8"/><rect x="0.5" y="2" width="7.5" height="7.5" rx="0.5" fill="none" stroke="currentColor" stroke-width="0.8"/></svg>',
    close: '<svg viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>'
  };

  var bar = document.createElement("div");
  bar.id = "win-title-bar";
  bar.className = "win-title-bar";
  var buttons = document.createElement("div");
  buttons.className = "win-title-bar__buttons";

  var maximizeBtn = document.createElement("button");
  maximizeBtn.className = "win-title-btn maximize";
  function renderMaximizeIcon() {
    maximizeBtn.innerHTML = window.__electronMaximized ? icons.restore : icons.maximize;
  }
  renderMaximizeIcon();

  var minimizeBtn = document.createElement("button");
  minimizeBtn.className = "win-title-btn minimize";
  minimizeBtn.innerHTML = icons.minimize;
  minimizeBtn.addEventListener("click", function () {
    api.minimizeWindow();
  });

  maximizeBtn.addEventListener("click", function () {
    Promise.resolve(api.maximizeWindow()).then(function (maximized) {
      window.__electronMaximized = maximized;
      renderMaximizeIcon();
    });
  });

  var closeBtn = document.createElement("button");
  closeBtn.className = "win-title-btn close";
  closeBtn.innerHTML = icons.close;
  closeBtn.addEventListener("click", function () {
    api.closeWindow();
  });

  buttons.appendChild(minimizeBtn);
  buttons.appendChild(maximizeBtn);
  buttons.appendChild(closeBtn);
  bar.appendChild(buttons);
  document.body.appendChild(bar);

  if (api.onMaximizeChange) {
    api.onMaximizeChange(function (maximized) {
      window.__electronMaximized = maximized;
      renderMaximizeIcon();
    });
  }
})();
`;

module.exports = {
  MAC_TRAFFIC_LIGHTS_CLEARANCE_PX,
  TITLE_BAR_PADDING_CSS,
  WIN_TITLE_BAR_CSS,
  WIN_TITLE_BAR_JS,
};
