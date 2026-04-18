document.addEventListener("DOMContentLoaded", () => {

  // ===== ELEMENTOS =====
  const panels = document.querySelectorAll(".panel");
  const links = document.querySelectorAll(".nav-links a");

  const btn = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");

  const chatContainer = document.querySelector(".chatbot-container");
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");


  // ===== SECCIONES =====
  function showSection(id) {
    panels.forEach(p => p.classList.remove("active"));

    const target = document.querySelector(id);
    if (target) {
      target.classList.add("active");

      // 🔥 ANIMACIÓN HEADER CORREGIDA
      if (id === "#home") {
        const header = document.querySelector(".header-panel");
        if (header) {
          header.classList.remove("animate");

          // reset REAL de animación
          setTimeout(() => {
            header.classList.add("animate");
          }, 50);
        }
      }
    }
  }

  // links sidebar
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.getAttribute("href");
      if (target) showSection(target);
    });
  });

  // sección inicial
  showSection("#home");


  // ===== SIDEBAR =====
  if (btn && sidebar) {
    btn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      btn.textContent = sidebar.classList.contains("collapsed") ? "›" : "‹";
    });
  }


  // ===== CHAT (ARREGLADO BIEN) =====
  let chatOpen = false;

  window.toggleChat = function (e) {
    if (!chatContainer) return;

    e?.stopPropagation(); // 🔥 evita cierre inmediato

    chatOpen = !chatOpen;

    chatContainer.classList.toggle("open", chatOpen);

    if (chatOpen) {
      setTimeout(() => chatInput?.focus(), 200);
    }
  };

  // evitar cierre al hacer click dentro
  chatContainer?.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // cerrar afuera correctamente
  document.addEventListener("click", (e) => {
    if (!chatContainer) return;

    const inside = chatContainer.contains(e.target);

    if (chatOpen && !inside) {
      chatContainer.classList.remove("open");
      chatOpen = false;
    }
  });


  // ===== BOT =====
  function getBotResponse(msg) {
    msg = msg.toLowerCase();

    if (msg.includes("hola") || msg.includes("hello"))
      return "Hola 👋 ¿Quieres ver mis proyectos o habilidades?";

    if (msg.includes("proyecto"))
      return "Ve a la sección Projects.";

    if (msg.includes("contacto"))
      return "Puedes encontrarme en Contact.";

    if (msg.includes("skills") || msg.includes("habilidades"))
      return "HTML, CSS, JavaScript, GitHub y Firebase.";

    return "No entendí, intenta algo sobre el portfolio.";
  }

  function addMessage(text, type) {
    if (!chatBody) return;

    const div = document.createElement("div");
    div.className = `chat-message ${type}`;
    div.textContent = text;

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function typingEffect(callback) {
    if (!chatBody) return;

    const typing = document.createElement("div");
    typing.className = "chat-message bot typing";
    typing.textContent = "...";

    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      typing.remove();
      callback();
    }, 800);
  }

  window.sendMessage = function () {
    if (!chatInput || !chatBody) return;

    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");

    typingEffect(() => {
      addMessage(getBotResponse(text), "bot");
      localStorage.setItem("chat", chatBody.innerHTML);
    });

    chatInput.value = "";
  };

  chatInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      window.sendMessage();
    }
  });

  // cargar chat
  if (chatBody) {
    const saved = localStorage.getItem("chat");
    if (saved) chatBody.innerHTML = saved;
  }


  // ===== TRADUCTOR =====
  window.setLanguage = function (lang) {
    document.querySelectorAll("[data-en]").forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) el.textContent = text;
    });

    localStorage.setItem("lang", lang);
  };

  setLanguage(localStorage.getItem("lang") || "en");

});