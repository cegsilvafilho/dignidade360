(() => {
  const storageKey = "dignidade360:enterprise-teste";

  const roleConfig = {
    patient: {
      label: "Paciente",
      nav: [
        ["overview", "Painel", "layout-dashboard"],
        ["checkin", "Check-in", "activity"],
        ["consent", "Consentimento", "shield-check"],
      ],
    },
    caregiver: {
      label: "Cuidador",
      nav: [
        ["overview", "Painel", "layout-dashboard"],
        ["checkin", "Check-in assistido", "heart-handshake"],
        ["consent", "Permissões", "shield-check"],
      ],
    },
    professional: {
      label: "Profissional",
      nav: [
        ["overview", "Paciente 360", "user-round"],
        ["queue", "Fila", "list-checks"],
        ["consent", "Governança", "shield-check"],
      ],
    },
    manager: {
      label: "Gestor",
      nav: [
        ["manager", "Gestão", "chart-column"],
        ["queue", "Fila", "list-checks"],
        ["overview", "Paciente 360", "user-round"],
      ],
    },
    admin: {
      label: "Admin",
      nav: [
        ["manager", "Operação", "settings"],
        ["consent", "Governança", "shield-check"],
        ["queue", "Alertas", "bell-ring"],
      ],
    },
  };

  const initialState = {
    role: null,
    activeAlertId: "a1",
    patient: {
      id: "p1",
      name: "Helena Duarte",
      age: 78,
      condition: "Doença pulmonar avançada",
      unit: "Atenção domiciliar",
      careLine: "Doença pulmonar avançada",
      caregiver: "Maria Lopes",
      professional: "Dra. Ana Rocha",
      goal: "Conforto em casa, com reavaliação ativa e plano de crise acessível.",
      preference: "Evitar internação prolongada quando houver alternativa segura.",
    },
    checkins: [
      makeCheckin(-3, 4, 3, 5, 6, 5, 4, "Interrompido", "Precisa de ajuda", false, "Dor controlada pela manhã."),
      makeCheckin(-2, 5, 4, 6, 7, 4, 5, "Interrompido", "Precisa de ajuda", false, "Falta de ar ao caminhar até o banheiro."),
      makeCheckin(-1, 6, 5, 6, 8, 3, 6, "Ruim", "Precisa de ajuda", false, "Cuidadora relata cansaço e preocupação."),
    ],
    alerts: [
      {
        id: "a1",
        patientId: "p1",
        title: "Falta de ar em piora",
        severity: "high",
        status: "in_progress",
        responsible: "Dra. Ana Rocha",
        slaMinutes: 120,
        dueIn: 38,
        source: "Check-in",
        description: "Falta de ar 5/10, fadiga 8/10 e sono ruim. Revisar plano de crise.",
        outcome: "",
        createdAt: new Date(Date.now() - 82 * 60000).toISOString(),
      },
      {
        id: "a2",
        patientId: "p2",
        title: "Confusão súbita informada",
        severity: "critical",
        status: "new",
        responsible: "Equipe hospitalar",
        slaMinutes: 30,
        dueIn: -12,
        source: "Cuidador",
        description: "Paciente com confusão súbita e dor intensa. Requer contato prioritário.",
        outcome: "",
        createdAt: new Date(Date.now() - 42 * 60000).toISOString(),
      },
      {
        id: "a3",
        patientId: "p3",
        title: "Cuidador com sobrecarga",
        severity: "moderate",
        status: "new",
        responsible: "Serviço social",
        slaMinutes: 1440,
        dueIn: 690,
        source: "Check-in",
        description: "Sobrecarga 8/10 e rede de apoio parcial. Avaliar suporte familiar.",
        outcome: "",
        createdAt: new Date(Date.now() - 750 * 60000).toISOString(),
      },
    ],
    actions: [
      {
        id: "c1",
        alertId: "a1",
        type: "Orientação",
        description: "Revisado posicionamento e sinais de alerta com cuidadora. Reavaliar às 16h.",
        author: "Dra. Ana Rocha",
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      },
    ],
    timeline: [
      makeEvent("Plano de crise revisado", "Plano", "Equipe confirmou sinais de alerta e contato prioritário.", -4),
      makeEvent("Check-in enviado", "Check-in", "Dor 5/10, falta de ar 4/10, ansiedade 6/10.", -2),
      makeEvent("Alerta criado", "Alerta", "Falta de ar em piora entrou na fila assistencial.", -1),
      makeEvent("Conduta registrada", "Conduta", "Orientação por telefone e reavaliação programada.", 0),
    ],
    consents: {
      care: true,
      caregiver: true,
      analytics: false,
      research: false,
    },
    audit: [
      makeAudit("Sistema", "Criou alerta", "alertas", "Falta de ar em piora"),
      makeAudit("Dra. Ana Rocha", "Registrou conduta", "condutas", "Orientação por telefone"),
      makeAudit("Helena Duarte", "Atualizou consentimento", "consentimentos", "Acesso do cuidador autorizado"),
    ],
    units: [
      { name: "Atenção domiciliar", patients: 48, openAlerts: 7, sla: 91, capacity: 86 },
      { name: "Unidade Norte", patients: 62, openAlerts: 11, sla: 84, capacity: 78 },
      { name: "Ambulatório paliativo", patients: 74, openAlerts: 9, sla: 89, capacity: 65 },
    ],
    lines: [
      { id: "l1", name: "Doença pulmonar avançada", criteria: "Dispneia persistente, reinternações ou dependência funcional.", sla: 2, team: "Atenção domiciliar" },
      { id: "l2", name: "Alta hospitalar responsável", criteria: "Paciente frágil com necessidade de seguimento pós-alta.", sla: 4, team: "Equipe hospitalar" },
      { id: "l3", name: "Demência avançada", criteria: "Declínio funcional, disfagia, infecções recorrentes ou sobrecarga familiar.", sla: 8, team: "Ambulatório paliativo" },
    ],
  };

  let state = loadState();
  let activeView = "overview";
  let activeTab = "indicators";

  const $ = (selector) => document.querySelector(selector);
  const els = {
    login: $("#login"),
    shell: $("#shell"),
    nav: $("#nav"),
    currentRole: $("#currentRole"),
    viewTitle: $("#viewTitle"),
    viewKicker: $("#viewKicker"),
    overviewMetrics: $("#overviewMetrics"),
    managerMetrics: $("#managerMetrics"),
    timeline: $("#timeline"),
    timelineCount: $("#timelineCount"),
    carePlan: $("#carePlan"),
    checkinForm: $("#checkinForm"),
    riskPreview: $("#riskPreview"),
    alertList: $("#alertList"),
    selectedAlertTitle: $("#selectedAlertTitle"),
    selectedAlertStatus: $("#selectedAlertStatus"),
    selectedAlertDetail: $("#selectedAlertDetail"),
    actionForm: $("#actionForm"),
    queueFilter: $("#queueFilter"),
    riskBars: $("#riskBars"),
    slaRows: $("#slaRows"),
    unitCards: $("#unitCards"),
    lineCards: $("#lineCards"),
    lineForm: $("#lineForm"),
    auditRows: $("#auditRows"),
    consentForm: $("#consentForm"),
  };

  function makeCheckin(offset, pain, breath, anxiety, fatigue, appetite, burden, sleep, mobility, crisis, note) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    date.setHours(9, 0, 0, 0);
    return {
      id: id("chk"),
      date: date.toISOString(),
      pain,
      breath,
      anxiety,
      fatigue,
      appetite,
      burden,
      sleep,
      mobility,
      crisis,
      note,
    };
  }

  function makeEvent(title, type, description, offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return {
      id: id("evt"),
      title,
      type,
      description,
      author: "Dignidade 360",
      createdAt: date.toISOString(),
    };
  }

  function makeAudit(user, action, entity, detail) {
    return {
      id: id("aud"),
      user,
      action,
      entity,
      detail,
      createdAt: new Date().toISOString(),
    };
  }

  function id(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? { ...clone(initialState), ...JSON.parse(stored) } : clone(initialState);
    } catch {
      return clone(initialState);
    }
  }

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
      return map[char];
    });
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  function roleLabel() {
    return roleConfig[state.role]?.label || "Perfil";
  }

  function priorityFromCheckin(checkin) {
    const appetitePenalty = Math.max(0, 10 - Number(checkin.appetite || 0)) * 2;
    const sleepPenalty = checkin.sleep === "Ruim" ? 10 : checkin.sleep === "Interrompido" ? 5 : 0;
    const mobilityPenalty = checkin.mobility === "Restrito ao leito" ? 12 : checkin.mobility === "Precisa de ajuda" ? 5 : 0;
    const crisisPenalty = checkin.crisis ? 32 : 0;
    const score = Math.min(
      100,
      Math.round(
        Number(checkin.pain || 0) * 5.7 +
          Number(checkin.breath || 0) * 6.5 +
          Number(checkin.anxiety || 0) * 3.4 +
          Number(checkin.fatigue || 0) * 3.2 +
          Number(checkin.burden || 0) * 3.1 +
          appetitePenalty +
          sleepPenalty +
          mobilityPenalty +
          crisisPenalty,
      ),
    );
    if (score >= 80 || checkin.crisis) return { level: "critical", label: "Crítica", score, className: "critical" };
    if (score >= 60) return { level: "high", label: "Alta", score, className: "critical" };
    if (score >= 35) return { level: "moderate", label: "Moderada", score, className: "warning" };
    return { level: "low", label: "Baixa", score, className: "ok" };
  }

  function severityInfo(level) {
    const map = {
      critical: ["Crítica", "critical"],
      high: ["Alta", "critical"],
      moderate: ["Moderada", "warning"],
      low: ["Baixa", "ok"],
    };
    return map[level] || ["Baixa", "ok"];
  }

  function statusLabel(status) {
    const map = {
      new: "Novo",
      in_progress: "Em atendimento",
      escalated: "Escalonado",
      resolved: "Resolvido",
    };
    return map[status] || status;
  }

  function login(role) {
    state.role = role;
    save();
    boot();
  }

  function logout() {
    state.role = null;
    save();
    els.login.classList.remove("hidden");
    els.shell.classList.add("hidden");
  }

  function boot() {
    if (!state.role) {
      els.login.classList.remove("hidden");
      els.shell.classList.add("hidden");
      refreshIcons();
      return;
    }
    els.login.classList.add("hidden");
    els.shell.classList.remove("hidden");
    els.currentRole.textContent = roleLabel();
    renderNav();
    setView(roleConfig[state.role].nav[0][0]);
    renderAll();
  }

  function renderNav() {
    els.nav.innerHTML = roleConfig[state.role].nav
      .map(([view, label, icon]) => `<button data-view="${view}"><i data-lucide="${icon}"></i>${label}</button>`)
      .join("");
  }

  function setView(viewId) {
    activeView = viewId;
    document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
    document.querySelectorAll("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
    const view = $(`#${viewId}`);
    els.viewTitle.textContent = view?.dataset.title || "Dignidade 360";
    els.viewKicker.textContent = view?.dataset.kicker || "Programa de teste";
    refreshIcons();
  }

  function renderAll() {
    renderOverview();
    renderCheckinPreview();
    renderQueue();
    renderManager();
    renderConsent();
    refreshIcons();
  }

  function latestCheckin() {
    return [...state.checkins].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }

  function openAlerts() {
    return state.alerts.filter((alert) => alert.status !== "resolved");
  }

  function renderOverview() {
    const latest = latestCheckin();
    const risk = priorityFromCheckin(latest);
    const metrics = [
      ["Paciente", state.patient.name, `${state.patient.condition} · ${state.patient.unit}`],
      ["Prioridade atual", risk.label, `Escore ${risk.score}/100`],
      ["Alertas abertos", String(openAlerts().length), `${state.alerts.filter((a) => a.severity === "critical" && a.status !== "resolved").length} críticos`],
      ["Plano de crise", "Ativo", "Versão demonstrativa revisada"],
    ];
    els.overviewMetrics.innerHTML = metrics.map(metricCard).join("");
    els.timelineCount.textContent = `${state.timeline.length} eventos`;
    els.timeline.innerHTML = [...state.timeline]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8)
      .map(
        (event) => `
          <article>
            <div><strong>${event.title}</strong><span>${event.type} · ${escapeHtml(event.description)}</span></div>
            <span class="pill">${formatDate(event.createdAt)}</span>
          </article>
        `,
      )
      .join("");
    els.carePlan.innerHTML = `
      <article><span>Objetivo</span><strong>${state.patient.goal}</strong></article>
      <article><span>Preferência</span><strong>${state.patient.preference}</strong></article>
      <article><span>Cuidador autorizado</span><strong>${state.patient.caregiver}</strong></article>
      <article><span>Profissional responsável</span><strong>${state.patient.professional}</strong></article>
    `;
  }

  function metricCard([label, value, note]) {
    return `<article class="metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`;
  }

  function renderCheckinPreview() {
    const formData = new FormData(els.checkinForm);
    const checkin = Object.fromEntries(formData.entries());
    checkin.crisis = formData.get("crisis") === "on";
    const risk = priorityFromCheckin(checkin);
    els.riskPreview.textContent = `${risk.label} · ${risk.score}/100`;
    els.riskPreview.className = `pill ${risk.className}`;
  }

  function renderQueue() {
    const filter = els.queueFilter.value;
    let alerts = [...state.alerts];
    if (filter === "open") alerts = alerts.filter((alert) => alert.status !== "resolved");
    if (filter === "critical") alerts = alerts.filter((alert) => alert.severity === "critical");
    if (filter === "late") alerts = alerts.filter((alert) => alert.dueIn < 0 && alert.status !== "resolved");
    alerts.sort((a, b) => {
      const weight = { critical: 4, high: 3, moderate: 2, low: 1 };
      return weight[b.severity] - weight[a.severity] || a.dueIn - b.dueIn;
    });

    els.alertList.innerHTML = alerts
      .map((alert) => {
        const [label, className] = severityInfo(alert.severity);
        const due = alert.dueIn < 0 ? `SLA vencido há ${Math.abs(alert.dueIn)} min` : `${alert.dueIn} min restantes`;
        return `
          <article data-alert="${alert.id}" role="button" tabindex="0">
            <div>
              <strong>${alert.title}</strong>
              <span>${label} · ${statusLabel(alert.status)} · ${due}</span>
            </div>
            <span class="pill ${className}">${label}</span>
          </article>
        `;
      })
      .join("");
    renderSelectedAlert();
  }

  function selectedAlert() {
    return state.alerts.find((alert) => alert.id === state.activeAlertId) || state.alerts[0];
  }

  function renderSelectedAlert() {
    const alert = selectedAlert();
    if (!alert) return;
    const [label, className] = severityInfo(alert.severity);
    els.selectedAlertTitle.textContent = alert.title;
    els.selectedAlertStatus.textContent = statusLabel(alert.status);
    els.selectedAlertStatus.className = `pill ${alert.status === "resolved" ? "ok" : className}`;
    els.selectedAlertDetail.innerHTML = `
      <article><span>Gravidade</span><strong>${label}</strong></article>
      <article><span>Responsável</span><strong>${alert.responsible}</strong></article>
      <article><span>Origem</span><strong>${alert.source}</strong></article>
      <article><span>Descrição</span><strong>${alert.description}</strong></article>
    `;
  }

  function renderManager() {
    const total = 184;
    const opened = openAlerts().length;
    const late = state.alerts.filter((alert) => alert.dueIn < 0 && alert.status !== "resolved").length;
    const plans = 73;
    els.managerMetrics.innerHTML = [
      ["Pacientes ativos", total, "+12 este mês"],
      ["Alertas abertos", opened, `${late} com SLA vencido`],
      ["SLA cumprido", "88%", "Meta institucional: 90%"],
      ["Planos de crise", `${plans}%`, "Pacientes elegíveis com plano"],
    ]
      .map(metricCard)
      .join("");

    els.riskBars.innerHTML = [
      ["Crítica", 7, "var(--red)"],
      ["Alta", 19, "var(--amber)"],
      ["Moderada", 42, "var(--blue)"],
      ["Baixa", 32, "var(--green)"],
    ]
      .map(
        ([label, value, color]) => `
          <div class="bar-row">
            <div class="bar-label"><span>${label}</span><strong>${value}%</strong></div>
            <div class="bar-track"><div class="bar-fill" style="--value:${value}%; background:${color}"></div></div>
          </div>
        `,
      )
      .join("");

    els.slaRows.innerHTML = [
      ["Crítico", "30 min", "92%", "critical"],
      ["Alto", "2h", "86%", "warning"],
      ["Moderado", "24h", "91%", ""],
      ["Baixo", "72h", "95%", "ok"],
    ]
      .map(([level, target, reached, cls]) => `<article><div><strong>${level}</strong><span>Meta: ${target}</span></div><span class="pill ${cls}">${reached}</span></article>`)
      .join("");

    els.unitCards.innerHTML = state.units
      .map(
        (unit) => `
          <article>
            <strong>${unit.name}</strong>
            <span>${unit.patients} pacientes · ${unit.openAlerts} alertas abertos</span>
            <span>SLA ${unit.sla}% · capacidade ${unit.capacity}%</span>
          </article>
        `,
      )
      .join("");

    els.lineCards.innerHTML = state.lines
      .map(
        (line) => `
          <article>
            <div><strong>${line.name}</strong><span>${line.criteria}</span></div>
            <span class="pill">SLA ${line.sla}h</span>
          </article>
        `,
      )
      .join("");

    els.auditRows.innerHTML = [...state.audit]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 12)
      .map((entry) => `<article><div><strong>${entry.action}</strong><span>${entry.user} · ${entry.entity} · ${entry.detail}</span></div><span class="pill">${formatDate(entry.createdAt)}</span></article>`)
      .join("");
  }

  function renderConsent() {
    Object.entries(state.consents).forEach(([key, value]) => {
      const input = els.consentForm.elements[key];
      if (input) input.checked = value;
    });
  }

  function addTimeline(type, title, description, author = roleLabel()) {
    state.timeline.push({
      id: id("evt"),
      type,
      title,
      description,
      author,
      createdAt: new Date().toISOString(),
    });
  }

  function addAudit(action, entity, detail, user = roleLabel()) {
    state.audit.push({
      id: id("aud"),
      user,
      action,
      entity,
      detail,
      createdAt: new Date().toISOString(),
    });
  }

  function createAlertFromCheckin(checkin, risk) {
    if (risk.level === "low") return;
    const sla = risk.level === "critical" ? 30 : risk.level === "high" ? 120 : 1440;
    const alert = {
      id: id("alt"),
      patientId: state.patient.id,
      title: risk.level === "critical" ? "Crise ou sofrimento intenso" : "Check-in requer acompanhamento",
      severity: risk.level,
      status: "new",
      responsible: risk.level === "critical" ? "Equipe prioritária" : state.patient.professional,
      slaMinutes: sla,
      dueIn: sla,
      source: "Check-in",
      description: `Dor ${checkin.pain}/10, falta de ar ${checkin.breath}/10, ansiedade ${checkin.anxiety}/10, fadiga ${checkin.fatigue}/10.`,
      outcome: "",
      createdAt: new Date().toISOString(),
    };
    state.alerts.push(alert);
    state.activeAlertId = alert.id;
    addTimeline("Alerta", alert.title, alert.description, "Sistema");
    addAudit("Criou alerta", "alertas", alert.title, "Sistema");
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  document.querySelectorAll("[data-login]").forEach((button) => {
    button.addEventListener("click", () => login(button.dataset.login));
  });

  $("#logout").addEventListener("click", logout);

  els.nav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view]");
    if (button) setView(button.dataset.view);
  });

  els.checkinForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      const out = els.checkinForm.querySelector(`[data-out="${field.name}"]`);
      if (out) out.textContent = field.value;
      renderCheckinPreview();
    });
  });

  els.checkinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(els.checkinForm);
    const checkin = {
      id: id("chk"),
      date: new Date().toISOString(),
      pain: Number(data.get("pain")),
      breath: Number(data.get("breath")),
      anxiety: Number(data.get("anxiety")),
      fatigue: Number(data.get("fatigue")),
      appetite: Number(data.get("appetite")),
      burden: Number(data.get("burden")),
      sleep: data.get("sleep"),
      mobility: data.get("mobility"),
      crisis: data.get("crisis") === "on",
      note: data.get("note").trim(),
    };
    const risk = priorityFromCheckin(checkin);
    state.checkins.push(checkin);
    addTimeline("Check-in", `Check-in ${risk.label}`, checkin.note || `Escore ${risk.score}/100`, roleLabel());
    addAudit("Registrou check-in", "checkins", `Prioridade ${risk.label}`);
    createAlertFromCheckin(checkin, risk);
    save();
    renderAll();
    setView(risk.level === "low" ? "overview" : "queue");
  });

  els.alertList.addEventListener("click", (event) => {
    const article = event.target.closest("[data-alert]");
    if (!article) return;
    state.activeAlertId = article.dataset.alert;
    save();
    renderQueue();
  });

  els.actionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const alert = selectedAlert();
    if (!alert) return;
    const data = new FormData(els.actionForm);
    const description = data.get("description").trim();
    if (!description) return;
    state.actions.push({
      id: id("act"),
      alertId: alert.id,
      type: data.get("type"),
      description,
      author: roleLabel(),
      createdAt: new Date().toISOString(),
    });
    state.alerts = state.alerts.map((item) => (item.id === alert.id ? { ...item, status: "resolved", outcome: description, dueIn: Math.max(item.dueIn, 0) } : item));
    addTimeline("Conduta", `${data.get("type")} registrada`, description, roleLabel());
    addAudit("Resolveu alerta", "alertas", alert.title);
    els.actionForm.reset();
    save();
    renderAll();
  });

  $("#escalateAlert").addEventListener("click", () => {
    const alert = selectedAlert();
    if (!alert) return;
    state.alerts = state.alerts.map((item) => (item.id === alert.id ? { ...item, status: "escalated", responsible: "Coordenação de cuidado" } : item));
    addTimeline("Escalonamento", alert.title, "Alerta escalonado para coordenação de cuidado.", roleLabel());
    addAudit("Escalonou alerta", "alertas", alert.title);
    save();
    renderAll();
  });

  els.queueFilter.addEventListener("change", renderQueue);

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.tab;
      document.querySelectorAll("[data-tab]").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === activeTab));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${activeTab}`));
      renderManager();
    });
  });

  els.lineForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(els.lineForm);
    const line = {
      id: id("line"),
      name: data.get("name").trim(),
      criteria: data.get("criteria").trim(),
      sla: Number(data.get("sla")),
      team: data.get("team"),
    };
    state.lines.unshift(line);
    addAudit("Criou linha de cuidado", "linhas", line.name);
    els.lineForm.reset();
    save();
    renderManager();
  });

  els.consentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(els.consentForm);
    state.consents = {
      care: data.get("care") === "on",
      caregiver: data.get("caregiver") === "on",
      analytics: data.get("analytics") === "on",
      research: data.get("research") === "on",
    };
    addTimeline("Consentimento", "Consentimentos atualizados", "Paciente revisou permissões de dados.", roleLabel());
    addAudit("Atualizou consentimento", "consentimentos", "Permissões do paciente");
    save();
    renderAll();
  });

  document.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => {
      $(`#${button.dataset.open}`).classList.remove("hidden");
      refreshIcons();
    });
  });

  document.querySelectorAll("[data-close], .modal").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target.matches(".modal") || event.target.closest("[data-close]")) {
        document.querySelectorAll(".modal").forEach((modal) => modal.classList.add("hidden"));
      }
    });
  });

  $("#seedDay").addEventListener("click", () => {
    state.alerts = state.alerts.map((alert) => ({ ...alert, dueIn: alert.status === "resolved" ? alert.dueIn : alert.dueIn - 15 }));
    const latest = latestCheckin();
    const checkin = {
      ...latest,
      id: id("chk"),
      date: new Date().toISOString(),
      pain: Math.min(10, Math.max(0, latest.pain + Math.round(Math.random() * 2 - 1))),
      breath: Math.min(10, Math.max(0, latest.breath + Math.round(Math.random() * 2 - 1))),
      fatigue: Math.min(10, Math.max(0, latest.fatigue + Math.round(Math.random() * 2 - 1))),
      note: "Dia simulado pelo programa de teste.",
    };
    state.checkins.push(checkin);
    addTimeline("Simulação", "Novo dia simulado", "SLA reduziu e um novo check-in foi adicionado.", "Sistema");
    addAudit("Simulou dia", "sistema", "Atualização de teste", "Sistema");
    save();
    renderAll();
  });

  $("#export").addEventListener("click", () => {
    const latest = latestCheckin();
    const risk = priorityFromCheckin(latest);
    const summary = [
      "Resumo Dignidade 360 Enterprise",
      `Perfil: ${roleLabel()}`,
      `Paciente: ${state.patient.name}`,
      `Condição: ${state.patient.condition}`,
      `Prioridade: ${risk.label} (${risk.score}/100)`,
      `Alertas abertos: ${openAlerts().length}`,
      `Plano: ${state.patient.goal}`,
    ].join("\n");
    if (!navigator.clipboard?.writeText) {
      alert(summary);
      return;
    }
    navigator.clipboard.writeText(summary).catch(() => alert(summary));
  });

  boot();
})();
