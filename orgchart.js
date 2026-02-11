// ============================================
// ORGANIGRAMA SDSGE
// Datos desde window.ORG_DATA (definido en datos.js)
// ============================================

// ---- Utilidad: escape seguro para texto en DOM ----
// Toda salida de datos del CSV al DOM usa esta función o textContent.
// NUNCA se interpola directamente en innerHTML.
function esc(str) {
    const d = document.createElement('div');
    d.textContent = String(str ?? '');
    return d.innerHTML;
}

// ---- Helper: crear elemento con clase y texto opcional ----
function el(tag, className, text) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
}

// ---- Parse CSV ----
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).filter(l => l.trim()).map(line => {
        // Parseo robusto: respeta valores entre comillas que contengan comas
        const values = parseCSVLine(line);
        const obj = {};
        headers.forEach((h, i) => { obj[h] = (values[i] ?? '').trim(); });
        obj.id        = parseInt(obj.id);
        obj.jerarquia = parseInt(obj.jerarquia);
        obj.cambio    = parseInt(obj.cambio);
        obj.parent_id = obj.parent_id ? parseInt(obj.parent_id) : null;
        return obj;
    });
}

function parseCSVLine(line) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
            else inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            result.push(cur); cur = '';
        } else {
            cur += ch;
        }
    }
    result.push(cur);
    return result;
}

// ---- Build Children Map ----
// Usa parent_id del CSV cuando está disponible.
// Fallback: lógica por jerarquia+pertenecia para compatibilidad con CSV sin parent_id.
function buildChildrenMap(data) {
    const map = {};

    const hasParentId = data.some(d => d.parent_id !== null && !isNaN(d.parent_id));

    if (hasParentId) {
        // Modo explícito: parent_id en el CSV — sin lógica hardcodeada
        data.forEach(node => {
            if (node.parent_id) {
                if (!map[node.parent_id]) map[node.parent_id] = [];
                map[node.parent_id].push(node);
            }
        });
        return map;
    }

    // Modo fallback (CSV sin parent_id): lógica inferida
    const root = data.find(d => d.jerarquia === 1);
    const j2   = data.filter(d => d.jerarquia === 2);
    const j3   = data.filter(d => d.jerarquia === 3);
    const j4   = data.filter(d => d.jerarquia === 4);

    // Root → j2
    map[root.id] = [...j2];

    // j2 → j3: parent por pertenecia
    // Construir mapa pertenecia → id del nodo j2 correspondiente
    // Busca el nodo j2 cuya pertenecia coincide; si no hay, cae al root
    const deptToJ2Id = {};
    // Agrupar j3 por pertenecia y asignar al j2 del mismo dept
    // j2 ids: 2=DDHG, 3=DAGG (según el CSV actual)
    // En lugar de hardcodear nombres, usamos el índice posicional de los j2
    // para los departamentos presentes en j3
    const depts = [...new Set(j3.map(n => n.pertenecia))];
    depts.forEach((dept, i) => {
        const parentJ2 = j2[i] ?? j2[0];
        deptToJ2Id[dept] = parentJ2.id;
    });
    j3.forEach(node => {
        const parentId = deptToJ2Id[node.pertenecia] ?? root.id;
        if (!map[parentId]) map[parentId] = [];
        map[parentId].push(node);
    });

    // j3 → j4: agrupar j4 por jefe_directo, distribuir en j3 ordenados
    const j4ByJefe = {};
    j4.forEach(node => {
        const k = node.jefe_directo.toLowerCase().trim();
        if (!j4ByJefe[k]) j4ByJefe[k] = [];
        j4ByJefe[k].push(node);
    });
    const ddhgJ3 = j3.filter(n => n.pertenecia === j3[0]?.pertenecia).sort((a, b) => a.id - b.id);
    Object.entries(j4ByJefe).sort(([a], [b]) => a.localeCompare(b))
        .forEach(([, nodes], idx) => {
            const coord = ddhgJ3[idx % Math.max(ddhgJ3.length, 1)];
            if (coord) {
                if (!map[coord.id]) map[coord.id] = [];
                map[coord.id].push(...nodes);
            }
        });

    return map;
}

// ---- Build Tree ----
// Calcula _depth (profundidad real en el árbol) independientemente del campo jerarquia.
// Esto permite que el CSS use la posición real aunque jerarquia del CSV sea incorrecta.
function buildTree(data, childrenMap) {
    const root = data.find(d => d.jerarquia === 1);
    if (!root) return null;

    function attach(node, visited, depth) {
        visited.add(node.id);
        node._depth = depth; // profundidad real: 1=raíz, 2=hijo directo, etc.
        node.children = (childrenMap[node.id] || []).filter(n => !visited.has(n.id));
        node.children.forEach(k => attach(k, new Set(visited), depth + 1));
        return node;
    }
    return attach({ ...root }, new Set(), 1);
}

// ---- Type helpers ----
const TYPE_CONFIG = {
    DESPEN: { cardClass: 'type-despen', badgeClass: 'badge-despen' },
    RA:     { cardClass: 'type-ra',     badgeClass: 'badge-ra'     },
    HE:     { cardClass: 'type-he',     badgeClass: 'badge-he'     },
};
function getTypeCfg(node) {
    return TYPE_CONFIG[node.tipo?.toUpperCase()] ?? TYPE_CONFIG.DESPEN;
}
function getChangeLabel(node) {
    if (node.cambio === 1 && node.donde && node.donde.toUpperCase() !== 'N/A')
        return `${node.tipo.toUpperCase()} → ${node.donde.toUpperCase()}`;
    return null;
}
function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
}
function isSentinel(val) {
    // Valores centinela que significan "sin dato"
    const SENTINELS = new Set(['xxx', 'n/a', '', 'sin cambio']);
    return SENTINELS.has((val ?? '').toLowerCase().trim());
}

// ============================================================
// RENDERIZADO — todo vía createElement/textContent, sin innerHTML
// con datos del usuario para prevenir XSS.
// innerHTML solo se usa para SVG estático (no datos del CSV).
// ============================================================

function renderNode(node) {
    const hasChildren = node.children && node.children.length > 0;
    const wrap = document.createElement('div');
    wrap.className = 'oc-node-wrap';
    wrap.dataset.id = node.id;

    wrap.appendChild(buildCard(node));
    if (!hasChildren) return wrap;

    const lineDown = el('div', 'oc-line-down');
    wrap.appendChild(lineDown);

    const row = el('div', 'oc-children-row');
    node.children.forEach(child => {
        const col = el('div', 'oc-child-col');
        col.appendChild(el('div', 'oc-line-up'));
        col.appendChild(renderNode(child));
        row.appendChild(col);
    });

    const collapseWrap = el('div', 'oc-collapse-wrap expanded');
    collapseWrap.appendChild(row);

    const toggleBtn = el('button', 'oc-toggle');
    // SVG estático (no datos de usuario) — innerHTML es seguro aquí
    toggleBtn.innerHTML = `<span class="oc-toggle-icon">▼</span>`;
    toggleBtn.setAttribute('aria-label', 'Expandir/Colapsar');
    toggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        const isExp = collapseWrap.classList.contains('expanded');
        collapseWrap.classList.toggle('expanded', !isExp);
        collapseWrap.classList.toggle('collapsed', isExp);
        toggleBtn.classList.toggle('rotated', isExp);
        lineDown.style.opacity = isExp ? '0' : '1';
    });

    wrap.appendChild(toggleBtn);
    wrap.appendChild(collapseWrap);
    return wrap;
}

function buildCard(node) {
    const cfg       = getTypeCfg(node);
    const changeLabel = getChangeLabel(node);
    const hasChange = node.cambio === 1;
    const isNewPuesto = !isSentinel(node.nuevo_puesto);
    // Usar _depth (calculado del árbol real) para estilos, no jerarquia del CSV
    const level     = node._depth ?? node.jerarquia;
    const titleCls  = level === 1 ? 'oc-title lg' : level === 2 ? 'oc-title md' : 'oc-title sm';

    const card = el('div', `oc-card ${cfg.cardClass} ${hasChange ? 'has-change' : ''} level-${level}`);

    // -- Top row: título + badges --
    const top = el('div', 'oc-card-top');

    const titleEl = el('p', titleCls);
    titleEl.textContent = node.puesto_actual;  // textContent — seguro
    top.appendChild(titleEl);

    const badgesWrap = el('div', 'oc-badges');

    const typeBadge = el('span', `type-badge ${cfg.badgeClass}`);
    typeBadge.textContent = node.tipo.toUpperCase();
    badgesWrap.appendChild(typeBadge);

    top.appendChild(badgesWrap);
    card.appendChild(top);

    // -- Meta row: jefe, dept, nivel_tabular, cambio, nuevo puesto --
    const meta = el('div', 'oc-card-meta');

    const jefe = el('span', 'jefe-tag');
    // SVG estático — innerHTML seguro; texto del nodo via textContent en nodo separado
    jefe.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    const jefeText = document.createTextNode(' Jefe: ' + capitalize(node.jefe_directo));
    jefe.appendChild(jefeText);
    meta.appendChild(jefe);

    const dept = el('span', 'dept-tag');
    dept.textContent = node.pertenecia;
    meta.appendChild(dept);

    if (!isSentinel(node.nivel_tabular)) {
        const nivelBadge = el('span', 'nivel-badge');
        nivelBadge.textContent = node.nivel_tabular;
        meta.appendChild(nivelBadge);
    }

    if (changeLabel) {
        const chg = el('span', 'change-badge');
        chg.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        const chgText = document.createTextNode(' ' + changeLabel);
        chg.appendChild(chgText);
        meta.appendChild(chg);
    }

    if (isNewPuesto) {
        const np = el('span', 'nuevo-puesto-tag');
        np.textContent = '✦ ' + node.nuevo_puesto;
        meta.appendChild(np);
    }

    card.appendChild(meta);
    card.addEventListener('click', e => { e.stopPropagation(); showModal(node); });
    return card;
}

// ---- Expand / Collapse All ----
function expandAll() {
    document.querySelectorAll('.oc-collapse-wrap.collapsed')
        .forEach(e => e.classList.replace('collapsed', 'expanded'));
    document.querySelectorAll('.oc-toggle.rotated')
        .forEach(b => b.classList.remove('rotated'));
    document.querySelectorAll('.oc-line-down')
        .forEach(l => l.style.opacity = '1');
}
function collapseAll() {
    document.querySelectorAll('.oc-collapse-wrap.expanded')
        .forEach(e => e.classList.replace('expanded', 'collapsed'));
    document.querySelectorAll('.oc-toggle')
        .forEach(b => b.classList.add('rotated'));
    document.querySelectorAll('.oc-line-down')
        .forEach(l => l.style.opacity = '0');
}

// ---- Modal — todo textContent, sin innerHTML con datos ----
function showModal(node) {
    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-title').textContent = node.puesto_actual;

    const body = document.getElementById('modal-body');
    body.innerHTML = ''; // limpiar contenido previo (seguro — sin datos)

    const changeLabel = getChangeLabel(node);
    const isNew = !isSentinel(node.nuevo_puesto);

    const rows = [
        ['Pertenencia',   node.pertenecia],
        ['Jefe Directo',  capitalize(node.jefe_directo)],
        ['Cambio',        node.cambio === 1 ? 'Sí' : 'No'],
    ];
    if (changeLabel) rows.push(['Transición', changeLabel]);
    if (isNew)       rows.push(['Nuevo Puesto', node.nuevo_puesto]);
    rows.push(['Nivel Tabular Propuesto', node.nivel_tabular]);

    rows.forEach(([label, value]) => {
        const row = el('div', 'modal-row');
        const lbl = el('span', 'modal-label');
        lbl.textContent = label;

        const val = el('span', 'modal-value');

        // Para Tipo mostramos el badge (solo clase CSS + textContent — seguro)
        if (label === 'Tipo') {
            const badge = el('span', `type-badge ${getTypeCfg(node).badgeClass}`);
            badge.textContent = node.tipo.toUpperCase();
            val.appendChild(badge);
        } else if (label === 'Transición') {
            const badge = el('span', 'change-badge');
            badge.textContent = value;
            val.appendChild(badge);
        } else if (label === 'Nuevo Puesto') {
            val.textContent = value;
            val.style.color = '#f9a8d4';
        } else if (label === 'Nivel Tabular Propuesto') {
            const badge = el('span', 'nivel-badge');
            badge.textContent = value;
            val.appendChild(badge);
        } else {
            val.textContent = value;
        }

        row.appendChild(lbl);
        row.appendChild(val);
        body.appendChild(row);
    });

    // Añadir fila Tipo manualmente antes de Cambio
    const tipoRow = el('div', 'modal-row');
    const tipoLbl = el('span', 'modal-label'); tipoLbl.textContent = 'Tipo';
    const tipoVal = el('span', 'modal-value');
    const tipoBadge = el('span', `type-badge ${getTypeCfg(node).badgeClass}`);
    tipoBadge.textContent = node.tipo.toUpperCase();
    tipoVal.appendChild(tipoBadge);
    tipoRow.appendChild(tipoLbl);
    tipoRow.appendChild(tipoVal);
    // Insertar después de Jefe Directo (índice 1: Pertenencia, Jefe Directo)
    body.insertBefore(tipoRow, body.children[2]);

    overlay.classList.add('active');
}

function hideModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// ---- Error display — mensaje interno no expuesto al usuario ----
function showError(userMsg, internalErr) {
    if (internalErr) console.error('[Organigrama]', internalErr);
    const container = document.getElementById('orgchart');
    container.innerHTML = ''; // limpiar
    const wrap = el('div', 'error-wrap');
    const msg  = el('p',   'error-msg');
    msg.textContent = userMsg; // textContent — seguro
    wrap.appendChild(msg);
    container.appendChild(wrap);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    // Los datos vienen del módulo datos.js en una propiedad no global
    // window.__ORG__ es un objeto encapsulado, no directamente CSV_RAW
    const raw = window.__ORG__?.csv;
    if (!raw) {
        showError('No se encontraron datos del organigrama.');
        return;
    }

    try {
        const data       = parseCSV(raw);
        const childMap   = buildChildrenMap(data);
        const tree       = buildTree(data, childMap);
        const container  = document.getElementById('orgchart');
        container.innerHTML = '';
        if (tree) {
            container.appendChild(renderNode(tree));
            // Centrar el scroll horizontal para que la raíz quede visible
            requestAnimationFrame(() => {
                const main = document.querySelector('main');
                if (main) main.scrollLeft = (main.scrollWidth - main.clientWidth) / 2;
            });
        }
        else showError('Estructura inválida: no se encontró el nodo raíz.');
    } catch (e) {
        // Mensaje genérico al usuario, detalle técnico solo en consola
        showError('Error al procesar el organigrama. Verifica el archivo de datos.', e);
    }

    document.getElementById('btn-expand-all') .addEventListener('click', expandAll);
    document.getElementById('btn-collapse-all').addEventListener('click', collapseAll);
    document.getElementById('modal-close')     .addEventListener('click', hideModal);
    document.getElementById('modal-overlay')   .addEventListener('click', e => {
        if (e.target === e.currentTarget) hideModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });

    // ---- Theme toggle ----
    function syncThemeIcon(theme) {
        document.getElementById('theme-icon-dark') .style.display = theme === 'dark'  ? '' : 'none';
        document.getElementById('theme-icon-light').style.display = theme === 'light' ? '' : 'none';
    }

    // Sincronizar ícono con el tema que ya aplicó el snippet inline del <head>
    syncThemeIcon(document.documentElement.dataset.theme || 'dark');

    document.getElementById('btn-theme').addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('oc-theme', next);
        syncThemeIcon(next);
    });

    // Seguir al OS si el usuario no ha guardado preferencia manual
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        if (!localStorage.getItem('oc-theme')) {
            const next = e.matches ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            syncThemeIcon(next);
        }
    });
});
