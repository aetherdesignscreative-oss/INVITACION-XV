document.addEventListener("DOMContentLoaded", () => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const cfg = window.XV;
  const audio = $("#audio");
  let selectedSong = 0;
  let currentScreen = "cover";
  let countdownTimer;

  const text = (selector, value) => {
    const element = $(selector);
    if (element && value != null) element.textContent = value;
  };

  const safe = value => String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[c]);

  const show = element => element?.classList.remove("hidden");
  const hide = element => element?.classList.add("hidden");

  function applyDetails() {
    $$("[data-field]").forEach(element => {
      const key = element.dataset.field;
      if (cfg[key] !== undefined) element.textContent = cfg[key];
    });

    text("#welcomeInitials", cfg.initials);
    text("#loaderInitials", cfg.initials);
    text("#miniInitials", cfg.initials);

    const date = new Date(cfg.date);
    text("#weekday", new Intl.DateTimeFormat("es", {
      weekday: "long"
    }).format(date).toUpperCase());

    text("#day", String(date.getDate()).padStart(2, "0"));
    text("#monthYear", new Intl.DateTimeFormat("es", {
      month: "long", year: "numeric"
    }).format(date).toUpperCase());

    document.title = "INVITACION DE XV AÑOS";
  }

  function renderSongs() {
    const root = $("#songs");
    root.replaceChildren();

    cfg.songs.forEach((song, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "song-option";
      button.innerHTML =
        '<span class="song-number">' +
        String(index + 1).padStart(2, "0") +
        '</span><span class="song-label"><strong>' +
        safe(song.title) +
        '</strong><br><small>' +
        safe(song.artist) +
        '</small></span><span class="song-check">○</span>';

      button.addEventListener("click", () => selectSong(index, true));
      root.append(button);
    });

    const remembered = Number(localStorage.getItem("xv-song") || 0);
    selectSong(Number.isInteger(remembered) &&
      remembered >= 0 && remembered < cfg.songs.length ? remembered : 0, false);
  }

  function selectSong(index, play) {
    selectedSong = index;
    const song = cfg.songs[index];
    if (!song) return;

    $$(".song-option").forEach((button, i) => {
      button.classList.toggle("selected", i === index);
      const check = button.querySelector(".song-check");
      if (check) check.textContent = i === index ? "◉" : "○";
    });

    try {
      localStorage.setItem("xv-song", String(index));
    } catch {}

    if (audio.dataset.file !== song.file) {
      audio.pause();
      audio.src = song.file;
      audio.dataset.file = song.file;
      audio.load();
    }

    if (play) audio.play().catch(() => {});
    updateMusicButton();
  }

  function updateMusicButton() {
    const button = $("#musicToggle");
    if (!button) return;
    button.textContent = audio.paused ? "♫" : "Ⅱ";
    button.setAttribute("aria-label",
      audio.paused ? "Reproducir música" : "Pausar música");
  }

  async function openInvitation() {
    hide($("#welcome"));
    show($("#loader"));
    text("#loaderInitials", cfg.initials);

    await new Promise(resolve => setTimeout(resolve, 1800));

    hide($("#loader"));
    show($("#invitation"));
    navigate("cover");

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!audio.src) {
      audio.src = cfg.songs[selectedSong].file;
      audio.dataset.file = cfg.songs[selectedSong].file;
    }

    audio.play().catch(() => {});
    updateMusicButton();
  }

  function navigate(id) {
    const target = $("#" + id);
    if (!target) return;

    ["cover", "ceremony", "itinerary", "gallery", "details"].forEach(name => {
      const section = $("#" + name);
      if (section) hide(section);
    });

    show(target);
    currentScreen = id;

    $$("#nav button").forEach(button => {
      button.classList.toggle("active", button.dataset.screen === id);
    });

    window.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto" : "smooth"
    });
  }

  function renderTimeline() {
    const root = $("#timeline");
    root.replaceChildren();

    cfg.itinerary.forEach(item => {
      const article = document.createElement("article");
      article.className = "timeline-item";
      article.innerHTML =
        '<div class="timeline-icon">' + safe(item.icon) +
        '</div><div><p>' + safe(item.time) +
        '</p><h3>' + safe(item.title) +
        '</h3><p>' + safe(item.description) + '</p></div>';
      root.append(article);
    });
  }

  function renderGallery() {
    const root = $("#galleryGrid");
    root.replaceChildren();

    for (let i = 1; i <= 10; i++) {
      const path = `assets/img/fotos/XV ${i}.png`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-photo";

      const img = document.createElement("img");
      img.src = path;
      img.alt = `Fotografía ${i} de ${cfg.name}`;
      img.loading = "lazy";

      img.addEventListener("error", () => button.remove());

      button.append(img);
      button.addEventListener("click", () => {
        openModal("Un recuerdo especial",
          `<img src="${path}" alt="Fotografía ampliada" style="width:100%;max-height:60vh;object-fit:contain">`);
      });

      root.append(button);
    }
  }

  function updateCountdown() {
    const target = new Date(cfg.date).getTime();
    let remaining = Math.max(0, target - Date.now());

    const values = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor(remaining % 86400000 / 3600000),
      minutes: Math.floor(remaining % 3600000 / 60000),
      seconds: Math.floor(remaining % 60000 / 1000)
    };

    Object.entries(values).forEach(([id, value]) => {
      text("#" + id, String(value).padStart(2, "0"));
    });
  }

  function openModal(title, content) {
    text("#modalTitle", title);
    $("#modalContent").innerHTML = content;
    show($("#modal"));
  }

  function closeModal() {
    hide($("#modal"));
    $("#modalContent").replaceChildren();
  }

  function setupMaps() {}

  function setupCalendar() {
    $("#calendar").addEventListener("click", () => {
      const start = new Date(cfg.date);
      const end = new Date(start.getTime() + 5 * 3600000);
      const fmt = date => date.toISOString().replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");

      const content = [
        "BEGIN:VCALENDAR", "VERSION:2.0",
        "BEGIN:VEVENT", `DTSTART:${fmt(start)}`,
        `DTEND:${fmt(end)}`,
        `SUMMARY:XV años de ${cfg.name}`,
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");

      const url = URL.createObjectURL(
        new Blob([content], { type: "text/calendar;charset=utf-8" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "invitacion-xv.ics";
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  function setupRSVP() {
    $("#rsvp").addEventListener("click", () => {
      openModal("Confirma tu asistencia",
        '<form id="rsvpForm">' +
        '<label for="guestName">Tu nombre</label>' +
        '<input id="guestName" required maxlength="100" placeholder="Escribe tu nombre">' +
        '<label for="guestCount">Número de asistentes</label>' +
        '<select id="guestCount"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>' +
        '<label for="guestNote">Mensaje opcional</label>' +
        '<textarea id="guestNote" maxlength="300" placeholder="Tu mensaje"></textarea>' +
        '<button class="gold-button" type="submit">Enviar confirmación</button></form>'
      );

      $("#rsvpForm").addEventListener("submit", event => {
        event.preventDefault();

        const guest = $("#guestName").value.trim();
        const count = $("#guestCount").value;
        const note = $("#guestNote").value.trim();

        const message =
          `Hola, confirmo mi asistencia a los XV años de ${cfg.name}. ` +
          `Nombre: ${guest}. Personas: ${count}. ${note}`;

        if (cfg.rsvpPhone.trim()) {
          const phone = cfg.rsvpPhone.replace(/\D/g, "");
          window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
            "_blank", "noopener,noreferrer"
          );
          closeModal();
        } else {
          openModal("Tu confirmación",
            '<p>Configura tu número de WhatsApp en js/config.js para recibir confirmaciones.</p>' +
            '<textarea id="copyMessage" readonly>' + safe(message) + '</textarea>' +
            '<button class="gold-button" id="copyButton">Copiar mensaje</button>');

          $("#copyButton").addEventListener("click", async () => {
            try {
              await navigator.clipboard.writeText($("#copyMessage").value);
              $("#copyButton").textContent = "Mensaje copiado";
            } catch {
              $("#copyMessage").focus();
              $("#copyMessage").select();
            }
          });
        }
      });
    });
  }

  $("#open").addEventListener("click", openInvitation);

  $$("#nav button").forEach(button => {
    button.addEventListener("click", () => navigate(button.dataset.screen));
  });

  $("#musicToggle").addEventListener("click", async () => {
    if (audio.paused) {
      if (!audio.src) selectSong(selectedSong, false);
      try { await audio.play(); } catch {}
    } else {
      audio.pause();
    }
    updateMusicButton();
  });

  audio.addEventListener("play", updateMusicButton);
  audio.addEventListener("pause", updateMusicButton);

  $("#modalClose").addEventListener("click", closeModal);

  $("#modal").addEventListener("click", event => {
    if (event.target === $("#modal")) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });

  $("#backTop").addEventListener("click", () => navigate("cover"));

  applyDetails();
  renderSongs();
  renderTimeline();
  renderGallery();
  setupMaps();
  setupCalendar();
  setupRSVP();
  updateCountdown();

  countdownTimer = window.setInterval(updateCountdown, 1000);
});

