/* Interações simples do AprendiZap.
   O HTML e o CSS montam as páginas. Este arquivo controla apenas
   o menu, os filtros e a revisão dos formulários demonstrativos. */
'use strict';

document.documentElement.classList.add('js');

// 1. Abrir e fechar o menu em telas pequenas.
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu-principal');
if (menuButton && menu) {
  function closeMenu() {
    menu.classList.remove('aberta');
    menuButton.setAttribute('aria-expanded', 'false');
  }
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('aberta');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('aberta')) {
      closeMenu();
      menuButton.focus();
    }
  });
}

// 2. A busca ignora letras maiúsculas e acentos.
function normalizeText(text) {
  return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

const filterForm = document.querySelector('[data-filter-form]');
const parameters = new URLSearchParams(window.location.search);
if (filterForm) {
  const search = filterForm.querySelector('[data-filter-search]');
  const selects = [...filterForm.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-filter-card]')];
  const counter = document.querySelector('[data-filter-count]');
  const empty = document.querySelector('[data-filter-empty]');

  function applyFilters() {
    const words = normalizeText(search.value).split(/\s+/).filter(Boolean);
    const visible = cards.filter((card) => {
      const text = normalizeText(card.dataset.search);
      const matchesText = words.every((word) => text.includes(word));
      const matchesSelects = selects.every((select) => {
        const values = (card.dataset[select.dataset.filter] || '').split('|');
        return !select.value || values.includes(select.value);
      });
      card.hidden = !(matchesText && matchesSelects);
      return !card.hidden;
    });
    counter.textContent = `${visible.length} de ${cards.length} ${counter.dataset.unit}`;
    empty.hidden = visible.length > 0;
    return visible.map((card) => ({ id: card.id, titulo: card.querySelector('h3').textContent }));
  }

  filterForm.addEventListener('input', applyFilters);
  filterForm.addEventListener('change', applyFilters);
  filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });
  filterForm.addEventListener('reset', () => window.setTimeout(applyFilters, 0));

  const subjectSelect = selects.find((select) => select.dataset.filter === 'subject');
  if (subjectSelect && [...subjectSelect.options].some((option) => option.value === parameters.get('disciplina'))) {
    subjectSelect.value = parameters.get('disciplina');
  }
  applyFilters();

  // Integração opcional: reutiliza exatamente os mesmos filtros da tela.
  // Navegadores sem WebMCP continuam funcionando normalmente.
  if (document.modelContext?.registerTool) {
    const lifecycle = new AbortController();
    const properties = { query: { type: 'string', maxLength: 160, description: 'Texto a buscar nos cartões.' } };
    selects.forEach((select) => {
      properties[select.dataset.filter] = { type: 'string', enum: [...select.options].map((option) => option.value) };
    });
    const tool = {
      name: 'filter_aprendizap_content',
      title: 'Filtrar conteúdo do AprendiZap',
      description: 'Atualiza a busca e os filtros visíveis nesta página de professores, disciplinas ou artigos. Não envia formulários.',
      inputSchema: { type: 'object', properties, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Informe um objeto com os filtros.');
        for (const [key, value] of Object.entries(input)) {
          if (!Object.hasOwn(properties, key) || typeof value !== 'string') throw new Error('Filtro inválido.');
          if (key === 'query' && value.length > 160) throw new Error('A busca deve ter até 160 caracteres.');
          if (key !== 'query' && !properties[key].enum.includes(value)) throw new Error('Opção de filtro inválida.');
        }
        search.value = input.query || '';
        selects.forEach((select) => { select.value = input[select.dataset.filter] || ''; });
        const items = applyFilters();
        return { count: items.length, items };
      }
    };
    try {
      Promise.resolve(document.modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
      window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
    } catch (_) { /* A integração opcional não interfere na página. */ }
  }
}

// 3. Abrir o perfil ou artigo quando o visitante chega por um link direto.
function revealHash() {
  let id;
  try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return; }
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  const details = target.querySelector('details');
  if (details) details.open = true;
}
revealHash();
window.addEventListener('hashchange', revealHash);

// 4. Validar e revisar o formulário. Nenhum dado é enviado ou armazenado.
const demoForm = document.querySelector('[data-demo-form]');
if (demoForm) {
  const result = document.querySelector('#resultado');
  const summary = result.querySelector('[data-form-summary]');
  const submit = demoForm.querySelector('[type="submit"]');
  const subject = demoForm.querySelector('#disciplina');
  const teacher = demoForm.querySelector('#professor');
  const specialties = {
    ana: ['matematica'], mariana: ['portugues'],
    lucas: ['fisica', 'quimica'], rafael: ['ciencias', 'biologia']
  };

  function updateTeachers() {
    if (!teacher) return;
    [...teacher.options].forEach((option) => {
      option.disabled = Boolean(option.value && subject.value && !specialties[option.value]?.includes(subject.value));
    });
    if (teacher.selectedOptions[0]?.disabled) teacher.value = '';
  }

  for (const key of ['disciplina', 'professor']) {
    const select = demoForm.querySelector(`#${key}`);
    const value = parameters.get(key);
    if (select && value && [...select.options].some((option) => option.value === value)) select.value = value;
  }
  if (subject) subject.addEventListener('change', updateTeachers);
  updateTeachers();

  const labels = {
    nome: 'Nome', email: 'E-mail', telefone: 'Telefone', cidade: 'Cidade',
    nivel: 'Nível de ensino', disciplina: 'Disciplina', modalidade: 'Modalidade',
    professor: 'Professor', formacao: 'Formação', horario: 'Horários',
    dificuldade: 'Dificuldade', experiencia: 'Experiência', motivacao: 'Motivação'
  };
  function addSummary(label, value) {
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    summary.append(term, description);
  }

  demoForm.addEventListener('input', (event) => {
    if (event.target.setCustomValidity) event.target.setCustomValidity('');
  });
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    demoForm.querySelectorAll('input[required], textarea[required]').forEach((field) => {
      field.setCustomValidity(field.value.trim() ? '' : 'Preencha este campo.');
    });
    if (!demoForm.reportValidity()) return;
    summary.replaceChildren();
    for (const [key, label] of Object.entries(labels)) {
      const field = demoForm.elements.namedItem(key);
      if (!field) continue;
      const value = field.tagName === 'SELECT' ? field.selectedOptions[0].textContent : field.value.trim();
      if (value) addSummary(label, value);
    }
    const days = [...demoForm.querySelectorAll('[name="dias"]:checked')].map((field) => field.value);
    if (days.length) addSummary('Dias disponíveis', days.join(', '));
    result.hidden = false;
    result.focus();
    result.scrollIntoView({ block: 'center' });
  });
  result.querySelector('[data-edit-form]').addEventListener('click', () => {
    result.hidden = true;
    demoForm.querySelector('input').focus();
  });
  // Só habilitar após instalar o tratamento que impede qualquer envio.
  submit.disabled = false;
}
