(() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);

  function getConfig() {
    return window.cfg || window.config || {};
  }

  function getName() {
    const c = getConfig();
    return c.name || c.quinceanera || "Mis XV años";
  }

  function getDate() {
    const c = getConfig();
    const value = c.date || c.eventDate || "";
    if (!value) return "Una fecha muy especial";
    const d = new Date(value + (String(value).length === 10 ? "T12:00:00" : ""));
    return Number.isNaN(d.getTime())
      ? String(value)
      : new Intl.DateTimeFormat("es", {
          day: "numeric", month: "long", year: "numeric"
        }).format(d);
  }

  function openForm() {
    document.getElementById("rsvpFixModal")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "rsvpFixModal";
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:99999;overflow:auto;
      display:flex;align-items:center;justify-content:center;
      padding:16px;background:#392c2c99;
    `;

    overlay.innerHTML = `
      <section style="box-sizing:border-box;width:min(100%,440px);max-height:94vh;overflow:auto;padding:25px;background:#fffaf4;border:1px solid #c2a568;box-shadow:0 15px 60px #0003;color:#594a40;font-family:Georgia,serif">
        <button id="rsvpFixClose" type="button" aria-label="Cerrar" style="float:right;border:0;background:none;font-size:25px;color:#927747;cursor:pointer">×</button>
        <div style="text-align:center;color:#b49a65;font-size:28px">❦ ♡ ❦</div>
        <h2 style="text-align:center;font-weight:normal;font-style:italic;font-size:32px;margin:8px 0 20px">Confirma tu asistencia</h2>
        <form id="rsvpFixForm">
          <label for="rsvpFixName">Tu nombre</label>
          <input id="rsvpFixName" maxlength="100" required placeholder="Nombre y apellido">
          <label for="rsvpFixCount">¿Cuántas personas asistirán?</label>
          <select id="rsvpFixCount">
            <option value="1">1 persona</option>
            <option value="2">2 personas</option>
            <option value="3">3 personas</option>
            <option value="4">4 personas</option>
            <option value="5">5 personas</option>
            <option value="6">6 personas</option>
            <option value="7">7 personas</option>
            <option value="8">8 personas</option>
          </select>
          <label for="rsvpFixMessage">Mensaje para la quinceañera (opcional)</label>
          <textarea id="rsvpFixMessage" maxlength="240" rows="3" placeholder="¡Muchas felicidades!"></textarea>
          <button type="submit" style="width:100%;margin-top:18px;padding:13px;background:#b49a65;color:white;border:0;cursor:pointer;font-family:Georgia,serif;font-size:16px">Crear mi tarjeta ♡</button>
        </form>
        <div id="rsvpFixResult"></div>
      </section>`;

    const style = document.createElement("style");
    style.id = "rsvpFixStyles";
    style.textContent = `
      #rsvpFixModal label{display:block;margin:12px 0 5px;font-size:15px}
      #rsvpFixModal input,#rsvpFixModal select,#rsvpFixModal textarea{box-sizing:border-box;width:100%;padding:11px;border:1px solid #d5c5a3;background:#fffdf9;color:#594a40;font:16px Georgia,serif;border-radius:2px}
      #rsvpFixModal button{border-radius:2px}
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    $("#rsvpFixClose", overlay).onclick = () => overlay.remove();
    overlay.addEventListener("click", e => {
      if (e.target === overlay) overlay.remove();
    });

    $("#rsvpFixForm", overlay).addEventListener("submit", async e => {
      e.preventDefault();

      const guest = $("#rsvpFixName", overlay).value.trim();
      const count = $("#rsvpFixCount", overlay).value;
      const message = $("#rsvpFixMessage", overlay).value.trim();
      const result = $("#rsvpFixResult", overlay);

      if (!guest) {
        $("#rsvpFixName", overlay).focus();
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext("2d");

      const bg = ctx.createLinearGradient(0, 0, 1080, 1350);
      bg.addColorStop(0, "#fffdf8");
      bg.addColorStop(.5, "#f5e4dd");
      bg.addColorStop(1, "#fffaf0");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1080, 1350);

      ctx.strokeStyle = "#b99a5e";
      ctx.lineWidth = 4;
      ctx.strokeRect(32, 32, 1016, 1286);
      ctx.lineWidth = 2;
      ctx.strokeRect(49, 49, 982, 1252);

      for (let i = 0; i < 130; i++) {
        const x = 65 + Math.random() * 950;
        const y = 65 + Math.random() * 1220;
        ctx.globalAlpha = .2 + Math.random() * .65;
        ctx.fillStyle = i % 2 ? "#c3a15c" : "#fff0b8";
        ctx.beginPath();
        ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.textAlign = "center";
      ctx.fillStyle = "#b49a65";
      ctx.font = "58px Georgia";
      ctx.fillText("❦   ♡   ❦", 540, 150);

      ctx.fillStyle = "#927747";
      ctx.font = "30px Georgia";
      ctx.fillText("INVITACIÓN DE XV AÑOS", 540, 225);

      ctx.fillStyle = "#b18d54";
      ctx.font = "italic 76px Georgia";
      ctx.fillText("Confirmación", 540, 350);

      ctx.strokeStyle = "#c5a568";
      ctx.beginPath();
      ctx.moveTo(240, 400);
      ctx.lineTo(840, 400);
      ctx.stroke();

      ctx.fillStyle = "#6b5547";
      ctx.font = "36px Georgia";
      ctx.fillText("¡Con mucha alegría,", 540, 485);
      ctx.fillText("confirmo mi asistencia!", 540, 535);

      let fontSize = 58;
      do {
        ctx.font = `italic ${fontSize}px Georgia`;
        if (ctx.measureText(guest).width <= 850) break;
        fontSize -= 2;
      } while (fontSize > 30);

      ctx.fillStyle = "#a3834c";
      ctx.fillText(guest, 540, 660);

      ctx.fillStyle = "#6b5547";
      ctx.font = "34px Georgia";
      ctx.fillText(`Personas que asistirán: ${count}`, 540, 740);

      if (message) {
        ctx.font = "italic 28px Georgia";
        const words = message.split(/\s+/);
        const lines = [];
        let line = "";

        for (const word of words) {
          const test = line ? line + " " + word : word;
          if (ctx.measureText(test).width > 780 && line) {
            lines.push(line);
            line = word;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);

        lines.slice(0, 4).forEach((text, i) => {
          ctx.fillText(text, 540, 820 + i * 42);
        });
      }

      ctx.fillStyle = "#b18d54";
      ctx.font = "56px Georgia";
      ctx.fillText("♡", 540, 1040);

      ctx.fillStyle = "#927747";
      ctx.font = "italic 48px Georgia";
      ctx.fillText(getName(), 540, 1110);

      ctx.fillStyle = "#806d5d";
      ctx.font = "30px Georgia";
      ctx.fillText(getDate(), 540, 1170);

      ctx.fillStyle = "#b18d54";
      ctx.font = "48px Georgia";
      ctx.fillText("❦", 540, 1250);

      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      if (!blob) {
        result.textContent = "No se pudo crear la imagen. Inténtalo de nuevo.";
        return;
      }

      const safeName = guest.replace(/[^a-z0-9_-]/gi, "-");
      const file = new File([blob], `confirmacion-xv-${safeName}.png`, {type:"image/png"});
      const url = URL.createObjectURL(blob);
      const oldUrl = overlay.dataset.imageUrl;
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      overlay.dataset.imageUrl = url;

      result.innerHTML = `
        <p style="text-align:center;margin:18px 0 8px">Tu tarjeta personalizada está lista ♡</p>
        <img id="rsvpFixPreview" alt="Tarjeta personalizada de confirmación" style="display:block;width:100%;height:auto;border:1px solid #c5a568;margin:10px auto">
        <button id="rsvpFixDownload" type="button" style="width:100%;padding:12px;background:#b49a65;color:white;border:0;cursor:pointer">Descargar tarjeta PNG</button>
        <button id="rsvpFixShare" type="button" style="width:100%;padding:12px;margin-top:8px;background:#fffdf8;color:#806d5d;border:1px solid #b49a65;cursor:pointer">Compartir por WhatsApp</button>
        <p style="font-size:13px;line-height:1.5">Si no se puede adjuntar automáticamente, descarga la tarjeta y adjúntala en WhatsApp.</p>`;

      $("#rsvpFixPreview", overlay).src = url;

      $("#rsvpFixDownload", overlay).onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
      };

      $("#rsvpFixShare", overlay).onclick = async () => {
        const text = `Confirmo mi asistencia a los XV años de ${getName()}. Invitado: ${guest}. Personas: ${count}.` +
          (message ? ` Mensaje: ${message}` : "");

        if (navigator.share && navigator.canShare) {
          try {
            if (navigator.canShare({files:[file]})) {
              await navigator.share({
                title: "Confirmación de XV años",
                text,
                files: [file]
              });
              return;
            }
          } catch (err) {
            if (err.name === "AbortError") return;
          }
        }

        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();

        const phone = String(getConfig().rsvpPhone || "").replace(/\D/g, "");
        const wa = "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);
        window.open(wa, "_blank", "noopener,noreferrer");
      };
    });
  }

  // Captura el clic antes que los controladores anteriores.
  document.addEventListener("click", event => {
    const button = event.target.closest("#rsvp");
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    openForm();
  }, true);

  // También funciona si el botón aparece después de cargar la página.
})();
