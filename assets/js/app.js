/* ==========================================================================
   FitManager — Lógica do App (SPA)
   ========================================================================== */

DB.load();

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const fmtBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const initials = (name) => name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
const fmtDate = (iso) => iso ? new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR') : '—';
const monthName = (ym) => {
  const [y, m] = ym.split('-');
  return new Date(y, m - 1).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
};
const escapeHtml = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const CURRENT_MONTH = '2026-06';
const STATUS_LABEL = { paid: 'Pago', pending: 'Pendente', late: 'Atrasado' };

function toast(msg) {
  $('#toastMsg').textContent = msg;
  const t = $('#toast');
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Modal ---------- */
function openModal(html) {
  const root = $('#modalRoot');
  root.innerHTML = `<div class="modal-overlay" id="overlay">${html}</div>`;
  const overlay = $('#overlay');
  requestAnimationFrame(() => overlay.classList.add('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  $$('.modal-close', overlay).forEach(b => b.addEventListener('click', closeModal));
  return overlay;
}
function closeModal() {
  const overlay = $('#overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  setTimeout(() => $('#modalRoot').innerHTML = '', 200);
}

/* ==========================================================================
   LOGIN
   ========================================================================== */
$('#loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  $('#loginScreen').classList.add('hidden');
  $('#appShell').classList.remove('hidden');
  const t = DB.data.trainer;
  $('#trainerName').textContent = t.name;
  $('#trainerInitials').textContent = initials(t.name);
  navigate('dashboard');
});
$('#logoutBtn').addEventListener('click', () => {
  $('#appShell').classList.add('hidden');
  $('#loginScreen').classList.remove('hidden');
});

/* ==========================================================================
   NAVEGAÇÃO
   ========================================================================== */
const PAGES = {
  dashboard: { title: 'Painel', sub: 'Visão geral do seu negócio', render: renderDashboard },
  students:  { title: 'Alunos', sub: 'Gerencie sua carteira de alunos', render: renderStudents },
  workouts:  { title: 'Treinos', sub: 'Monte e atribua fichas de treino', render: renderWorkouts },
  library:   { title: 'Exercícios', sub: 'Biblioteca com vídeos demonstrativos', render: renderLibrary },
  payments:  { title: 'Pagamentos', sub: 'Controle de mensalidades e receita', render: renderPayments },
};

function navigate(page) {
  $$('.nav-item[data-page]').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  $$('.page').forEach(p => p.classList.add('hidden'));
  $(`#page-${page}`).classList.remove('hidden');
  $('#pageTitle').textContent = PAGES[page].title;
  $('#pageSub').textContent = PAGES[page].sub;
  $('#topbarActions').innerHTML = '';
  PAGES[page].render();
  // fecha sidebar no mobile
  $('#sidebar').classList.remove('open');
  $('#backdrop').classList.remove('show');
}

$$('.nav-item[data-page]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.page)));

// Sidebar mobile
$('#sidebarToggle').addEventListener('click', () => {
  $('#sidebar').classList.add('open');
  $('#backdrop').classList.add('show');
});
$('#backdrop').addEventListener('click', () => {
  $('#sidebar').classList.remove('open');
  $('#backdrop').classList.remove('show');
});

/* ==========================================================================
   DASHBOARD
   ========================================================================== */
function revenueByMonth() {
  // tendência histórica (base) + mês atual calculado ao vivo dos pagamentos
  const base = { '2026-01': 4200, '2026-02': 4800, '2026-03': 5100, '2026-04': 5600, '2026-05': 6100 };
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
  return months.map(m => {
    const paid = DB.data.payments
      .filter(p => p.month === m && p.status === 'paid')
      .reduce((s, p) => s + p.amount, 0);
    return { month: m, value: m === CURRENT_MONTH ? paid : (base[m] || paid) };
  });
}

function renderDashboard() {
  const students = DB.data.students;
  const activeCount = students.filter(s => s.status === 'ativo').length;
  const monthPayments = DB.data.payments.filter(p => p.month === CURRENT_MONTH);
  const revenue = monthPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingCount = monthPayments.filter(p => p.status === 'pending').length;
  const lateCount = monthPayments.filter(p => p.status === 'late').length;
  const expected = monthPayments.reduce((s, p) => s + p.amount, 0);
  const inadim = expected ? Math.round((monthPayments.filter(p => p.status === 'late').reduce((s, p) => s + p.amount, 0) / expected) * 100) : 0;

  const trend = revenueByMonth();
  const maxRev = Math.max(...trend.map(t => t.value), 1);

  const recent = [...DB.data.payments]
    .filter(p => p.month === CURRENT_MONTH)
    .sort((a, b) => (b.paidAt || '').localeCompare(a.paidAt || ''));

  const attention = monthPayments.filter(p => p.status !== 'paid');

  $('#page-dashboard').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="ic g">💰</div>
        <div class="label">Receita em junho</div>
        <div class="value">${fmtBRL(revenue)}</div>
        <div class="delta">↑ recebido este mês</div>
      </div>
      <div class="stat-card">
        <div class="ic b">👥</div>
        <div class="label">Alunos ativos</div>
        <div class="value">${activeCount}</div>
        <div class="delta">de ${students.length} no total</div>
      </div>
      <div class="stat-card">
        <div class="ic y">⏳</div>
        <div class="label">Pagamentos pendentes</div>
        <div class="value">${pendingCount}</div>
        <div class="delta text-warn">a vencer este mês</div>
      </div>
      <div class="stat-card">
        <div class="ic r">⚠️</div>
        <div class="label">Inadimplência</div>
        <div class="value">${inadim}%</div>
        <div class="delta text-danger">${lateCount} aluno(s) atrasado(s)</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="panel-head"><h2>Receita dos últimos 6 meses</h2></div>
        <div class="bars">
          ${trend.map(t => `
            <div class="bar-col">
              <div class="bar" style="height:${Math.max((t.value / maxRev) * 100, 4)}%" data-val="${fmtBRL(t.value)}"></div>
              <span class="lbl">${monthName(t.month)}</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h2>Precisam de atenção</h2>
          <a onclick="navigate('payments')">Ver tudo</a>
        </div>
        ${attention.length ? attention.map(p => {
          const s = DB.student(p.studentId);
          return `<div class="list-row">
            <span class="avatar">${initials(s.name)}</span>
            <div class="info"><div class="nm">${escapeHtml(s.name)}</div><div class="meta">Vence ${fmtDate(p.dueDate)}</div></div>
            <span class="badge ${p.status}">${STATUS_LABEL[p.status]}</span>
          </div>`;
        }).join('') : `<div class="empty"><div class="ic">🎉</div><p>Tudo em dia! Nenhuma pendência.</p></div>`}
      </div>
    </div>

    <div class="panel" style="margin-top:18px">
      <div class="panel-head">
        <h2>Movimentação de junho</h2>
        <a onclick="navigate('payments')">Gerenciar pagamentos</a>
      </div>
      ${recent.map(p => {
        const s = DB.student(p.studentId);
        return `<div class="list-row">
          <span class="avatar">${initials(s.name)}</span>
          <div class="info"><div class="nm">${escapeHtml(s.name)}</div><div class="meta">${s.plan} · venc. ${fmtDate(p.dueDate)}</div></div>
          <span class="amount">${fmtBRL(p.amount)}</span>
          <span class="badge ${p.status}">${STATUS_LABEL[p.status]}</span>
        </div>`;
      }).join('')}
    </div>
  `;
}

/* ==========================================================================
   ALUNOS
   ========================================================================== */
function renderStudents() {
  $('#topbarActions').innerHTML = `<button class="btn btn-primary" onclick="studentForm()">+ Novo aluno</button>`;
  drawStudents();
}

function drawStudents() {
  const term = (studentForm._term || '').toLowerCase();
  const filter = studentForm._filter || 'all';
  let list = DB.data.students;
  if (term) list = list.filter(s => s.name.toLowerCase().includes(term));
  if (filter !== 'all') list = list.filter(s => s.status === filter);

  $('#page-students').innerHTML = `
    <div class="toolbar">
      <div class="search-box">
        <span class="ic">🔍</span>
        <input type="text" id="stSearch" placeholder="Buscar aluno..." value="${escapeHtml(studentForm._term || '')}" />
      </div>
      <select class="filter-select" id="stFilter">
        <option value="all">Todos os status</option>
        <option value="ativo" ${filter === 'ativo' ? 'selected' : ''}>Ativos</option>
        <option value="inativo" ${filter === 'inativo' ? 'selected' : ''}>Inativos</option>
      </select>
    </div>
    ${list.length ? `<div class="card-grid">${list.map(studentCard).join('')}</div>`
      : `<div class="empty"><div class="ic">👤</div><h3>Nenhum aluno encontrado</h3><p>Cadastre seu primeiro aluno para começar.</p></div>`}
  `;

  $('#stSearch').addEventListener('input', (e) => { studentForm._term = e.target.value; drawStudents(); $('#stSearch').focus(); });
  $('#stFilter').addEventListener('change', (e) => { studentForm._filter = e.target.value; drawStudents(); });
}

function studentCard(s) {
  const pay = DB.data.payments.find(p => p.studentId === s.id && p.month === CURRENT_MONTH);
  const payStatus = pay ? pay.status : 'pending';
  const hasWorkout = !!DB.workoutByStudent(s.id);
  return `
    <div class="student-card" onclick="studentDetail('${s.id}')">
      <div class="top">
        <span class="avatar lg">${initials(s.name)}</span>
        <div>
          <div class="nm">${escapeHtml(s.name)}</div>
          <div class="goal">${escapeHtml(s.goal)}</div>
        </div>
      </div>
      <div class="rowline"><span>Plano</span><strong>${s.plan}</strong></div>
      <div class="rowline"><span>Status</span><span class="badge ${s.status === 'ativo' ? 'active' : 'inactive'}">${s.status}</span></div>
      <div class="rowline"><span>Mensalidade</span><span class="badge ${payStatus}">${STATUS_LABEL[payStatus]}</span></div>
      <div class="rowline"><span>Treino</span><strong>${hasWorkout ? '✅ Atribuído' : '— Sem treino'}</strong></div>
    </div>`;
}

function studentDetail(id) {
  const s = DB.student(id);
  const w = DB.workoutByStudent(id);
  const imc = (s.weight / ((s.height / 100) ** 2)).toFixed(1);
  const history = DB.data.payments.filter(p => p.studentId === id).sort((a, b) => b.month.localeCompare(a.month));

  openModal(`
    <div class="modal wide">
      <div class="modal-head">
        <h2>Ficha do aluno</h2>
        <button class="modal-close">✕</button>
      </div>
      <div class="modal-body">
        <div class="detail-head">
          <span class="avatar lg">${initials(s.name)}</span>
          <div>
            <div class="nm">${escapeHtml(s.name)}</div>
            <div class="meta">${escapeHtml(s.goal)} · ${s.plan} · ${escapeHtml(s.phone)}</div>
            <div class="meta">${escapeHtml(s.email)} · desde ${fmtDate(s.joinedAt)}</div>
          </div>
        </div>

        <div class="detail-stats">
          <div class="detail-stat"><div class="v">${s.weight}kg</div><div class="l">Peso</div></div>
          <div class="detail-stat"><div class="v">${imc}</div><div class="l">IMC</div></div>
          <div class="detail-stat"><div class="v">${s.bodyfat}%</div><div class="l">% Gordura</div></div>
        </div>

        <div class="section-label">Treino atribuído</div>
        ${w ? `
          <div style="margin-bottom:8px;color:var(--text-muted);font-size:.9rem">${escapeHtml(w.name)} — ${escapeHtml(w.focus)}</div>
          ${w.items.map(it => {
            const ex = DB.exercise(it.exId);
            return `<div class="workout-ex">
              <img class="thumb" src="${ex.img}" alt="" onerror="this.style.display='none'"/>
              <div class="info">
                <div class="nm">${escapeHtml(ex.name)}</div>
                <div class="det">${it.sets}x ${it.reps} · descanso ${it.rest}${it.note ? ' · ' + escapeHtml(it.note) : ''}</div>
              </div>
              <button class="btn btn-ghost btn-sm" onclick="playVideo('${ex.id}')">▶ Vídeo</button>
            </div>`;
          }).join('')}
        ` : `<div class="empty" style="padding:24px"><p>Nenhum treino atribuído ainda.</p><button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="closeModal();navigate('workouts');workoutForm(null,'${s.id}')">Montar treino</button></div>`}

        <div class="section-label" style="margin-top:22px">Histórico de pagamentos</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Mês</th><th>Valor</th><th>Vencimento</th><th>Status</th></tr></thead>
            <tbody>
              ${history.map(p => `<tr>
                <td>${monthName(p.month)}/${p.month.split('-')[0]}</td>
                <td>${fmtBRL(p.amount)}</td>
                <td>${fmtDate(p.dueDate)}</td>
                <td><span class="badge ${p.status}">${STATUS_LABEL[p.status]}</span></td>
              </tr>`).join('') || '<tr><td colspan="4" style="color:var(--text-dim)">Sem histórico.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-danger" onclick="deleteStudent('${s.id}')">Excluir</button>
        <button class="btn btn-ghost" onclick="studentForm('${s.id}')">Editar</button>
      </div>
    </div>
  `);
}

function studentForm(id = null) {
  const s = id ? DB.student(id) : { name: '', email: '', phone: '', goal: 'Hipertrofia', plan: 'Mensal', planValue: 130, status: 'ativo', weight: 70, height: 170, bodyfat: 20 };
  const goals = ['Hipertrofia', 'Emagrecimento', 'Condicionamento', 'Força', 'Reabilitação'];
  const plans = [['Mensal', 130], ['Trimestral', 110], ['Anual', 99]];

  openModal(`
    <div class="modal">
      <div class="modal-head"><h2>${id ? 'Editar aluno' : 'Novo aluno'}</h2><button class="modal-close">✕</button></div>
      <form id="stForm" class="modal-body">
        <div class="field"><label>Nome completo</label><input id="f_name" value="${escapeHtml(s.name)}" required /></div>
        <div class="form-row">
          <div class="field"><label>E-mail</label><input id="f_email" type="email" value="${escapeHtml(s.email)}" /></div>
          <div class="field"><label>Telefone</label><input id="f_phone" value="${escapeHtml(s.phone)}" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Objetivo</label><select id="f_goal">${goals.map(g => `<option ${g === s.goal ? 'selected' : ''}>${g}</option>`).join('')}</select></div>
          <div class="field"><label>Plano</label><select id="f_plan">${plans.map(([p, v]) => `<option value="${v}" ${p === s.plan ? 'selected' : ''}>${p} (${fmtBRL(v)}/mês)</option>`).join('')}</select></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Peso (kg)</label><input id="f_weight" type="number" value="${s.weight}" /></div>
          <div class="field"><label>Altura (cm)</label><input id="f_height" type="number" value="${s.height}" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label>% Gordura</label><input id="f_bf" type="number" value="${s.bodyfat}" /></div>
          <div class="field"><label>Status</label><select id="f_status"><option value="ativo" ${s.status === 'ativo' ? 'selected' : ''}>Ativo</option><option value="inativo" ${s.status === 'inativo' ? 'selected' : ''}>Inativo</option></select></div>
        </div>
      </form>
      <div class="modal-foot">
        <button class="btn btn-ghost modal-close">Cancelar</button>
        <button class="btn btn-primary" onclick="saveStudent('${id || ''}')">${id ? 'Salvar' : 'Cadastrar'}</button>
      </div>
    </div>
  `);
}

function saveStudent(id) {
  const name = $('#f_name').value.trim();
  if (!name) { toast('Informe o nome do aluno'); return; }
  const planSel = $('#f_plan');
  const obj = {
    name,
    email: $('#f_email').value.trim(),
    phone: $('#f_phone').value.trim(),
    goal: $('#f_goal').value,
    plan: planSel.options[planSel.selectedIndex].text.split(' ')[0],
    planValue: +planSel.value,
    weight: +$('#f_weight').value || 0,
    height: +$('#f_height').value || 0,
    bodyfat: +$('#f_bf').value || 0,
    status: $('#f_status').value,
  };
  if (id) {
    Object.assign(DB.student(id), obj);
    toast('Aluno atualizado');
  } else {
    obj.id = DB.uid('s');
    obj.joinedAt = new Date().toISOString().slice(0, 10);
    obj.workoutId = null;
    DB.data.students.push(obj);
    // cria mensalidade do mês atual
    DB.data.payments.push({ id: DB.uid('p'), studentId: obj.id, month: CURRENT_MONTH, amount: obj.planValue, status: 'pending', dueDate: CURRENT_MONTH + '-10', paidAt: null });
    toast('Aluno cadastrado com sucesso');
  }
  DB.save();
  closeModal();
  drawStudents();
}

function deleteStudent(id) {
  if (!confirm('Excluir este aluno? Esta ação não pode ser desfeita.')) return;
  DB.data.students = DB.data.students.filter(s => s.id !== id);
  DB.data.payments = DB.data.payments.filter(p => p.studentId !== id);
  DB.data.workouts = DB.data.workouts.filter(w => w.studentId !== id);
  DB.save();
  closeModal();
  drawStudents();
  toast('Aluno excluído');
}

/* ==========================================================================
   TREINOS
   ========================================================================== */
function renderWorkouts() {
  $('#topbarActions').innerHTML = `<button class="btn btn-primary" onclick="workoutForm()">+ Novo treino</button>`;
  const list = DB.data.workouts;
  $('#page-workouts').innerHTML = list.length ? `<div class="card-grid">${list.map(workoutCard).join('')}</div>`
    : `<div class="empty"><div class="ic">📋</div><h3>Nenhum treino criado</h3><p>Monte um treino e atribua a um aluno.</p></div>`;
}

function workoutCard(w) {
  const s = w.studentId ? DB.student(w.studentId) : null;
  return `
    <div class="student-card" onclick="workoutDetail('${w.id}')">
      <div class="top">
        <span class="avatar lg">📋</span>
        <div><div class="nm">${escapeHtml(w.name)}</div><div class="goal">${escapeHtml(w.focus)}</div></div>
      </div>
      <div class="rowline"><span>Exercícios</span><strong>${w.items.length}</strong></div>
      <div class="rowline"><span>Aluno</span><strong>${s ? escapeHtml(s.name) : '— Não atribuído'}</strong></div>
    </div>`;
}

function workoutDetail(id) {
  const w = DB.workout(id);
  const s = w.studentId ? DB.student(w.studentId) : null;
  openModal(`
    <div class="modal wide">
      <div class="modal-head"><h2>${escapeHtml(w.name)}</h2><button class="modal-close">✕</button></div>
      <div class="modal-body">
        <div style="color:var(--text-muted);margin-bottom:6px">${escapeHtml(w.focus)}</div>
        <div style="color:var(--text-dim);font-size:.88rem;margin-bottom:18px">Aluno: ${s ? escapeHtml(s.name) : 'Não atribuído'}</div>
        ${w.items.map(it => {
          const ex = DB.exercise(it.exId);
          return `<div class="workout-ex">
            <img class="thumb" src="${ex.img}" alt="" onerror="this.style.display='none'"/>
            <div class="info">
              <div class="nm">${escapeHtml(ex.name)}</div>
              <div class="det">${it.sets} séries x ${it.reps} · descanso ${it.rest}${it.note ? ' · ' + escapeHtml(it.note) : ''}</div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="playVideo('${ex.id}')">▶ Vídeo</button>
          </div>`;
        }).join('')}
      </div>
      <div class="modal-foot">
        <button class="btn btn-danger" onclick="deleteWorkout('${w.id}')">Excluir</button>
        <button class="btn btn-ghost" onclick="workoutForm('${w.id}')">Editar</button>
      </div>
    </div>
  `);
}

// Estado temporário da ficha sendo montada
let workoutDraft = [];

function workoutForm(id = null, presetStudent = null) {
  const w = id ? DB.workout(id) : null;
  workoutDraft = w ? structuredClone(w.items) : [];
  const students = DB.data.students;

  openModal(`
    <div class="modal wide">
      <div class="modal-head"><h2>${id ? 'Editar treino' : 'Novo treino'}</h2><button class="modal-close">✕</button></div>
      <div class="modal-body">
        <div class="form-row">
          <div class="field"><label>Nome do treino</label><input id="w_name" value="${w ? escapeHtml(w.name) : ''}" placeholder="Ex: Treino A — Superiores" /></div>
          <div class="field"><label>Foco</label><input id="w_focus" value="${w ? escapeHtml(w.focus) : ''}" placeholder="Ex: Peito e Costas" /></div>
        </div>
        <div class="field">
          <label>Aluno</label>
          <select id="w_student">
            <option value="">— Não atribuir agora —</option>
            ${students.map(s => `<option value="${s.id}" ${(w && w.studentId === s.id) || presetStudent === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}
          </select>
        </div>

        <div class="section-label">Exercícios da ficha</div>
        <div id="draftList"></div>

        <div class="field" style="margin-top:14px">
          <label>Adicionar exercício</label>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <select id="w_ex" class="filter-select" style="flex:1;min-width:180px">
              ${DB.data.exercises.map(e => `<option value="${e.id}">${escapeHtml(e.name)} — ${escapeHtml(e.muscle)}</option>`).join('')}
            </select>
            <button class="btn btn-ghost" onclick="addDraftEx()">+ Adicionar</button>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost modal-close">Cancelar</button>
        <button class="btn btn-primary" onclick="saveWorkout('${id || ''}')">${id ? 'Salvar treino' : 'Criar treino'}</button>
      </div>
    </div>
  `);
  drawDraft();
}

function drawDraft() {
  const el = $('#draftList');
  if (!el) return;
  if (!workoutDraft.length) {
    el.innerHTML = `<div style="color:var(--text-dim);font-size:.9rem;padding:8px 0">Nenhum exercício adicionado ainda.</div>`;
    return;
  }
  el.innerHTML = workoutDraft.map((it, i) => {
    const ex = DB.exercise(it.exId);
    return `<div class="workout-ex">
      <img class="thumb" src="${ex.img}" alt="" onerror="this.style.display='none'"/>
      <div class="info" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <strong style="width:100%">${escapeHtml(ex.name)}</strong>
        <input style="width:70px" class="dft" data-i="${i}" data-k="sets" type="number" value="${it.sets}" title="Séries"/>
        <span style="color:var(--text-dim)">x</span>
        <input style="width:90px" class="dft" data-i="${i}" data-k="reps" value="${escapeHtml(it.reps)}" title="Repetições"/>
        <input style="width:80px" class="dft" data-i="${i}" data-k="rest" value="${escapeHtml(it.rest)}" title="Descanso"/>
        <input style="flex:1;min-width:120px" class="dft" data-i="${i}" data-k="note" value="${escapeHtml(it.note || '')}" placeholder="Observação"/>
      </div>
      <button class="btn btn-danger btn-sm" onclick="rmDraftEx(${i})">✕</button>
    </div>`;
  }).join('');
  // estilizar inputs
  $$('.dft').forEach(inp => {
    inp.style.background = 'var(--surface)';
    inp.style.border = '1px solid var(--border)';
    inp.style.borderRadius = '7px';
    inp.style.padding = '6px 8px';
    inp.style.color = 'var(--text)';
    inp.style.fontSize = '0.82rem';
    inp.addEventListener('input', (e) => {
      const { i, k } = e.target.dataset;
      workoutDraft[i][k] = k === 'sets' ? +e.target.value : e.target.value;
    });
  });
}

function addDraftEx() {
  const exId = $('#w_ex').value;
  workoutDraft.push({ exId, sets: 3, reps: '12', rest: '60s', note: '' });
  drawDraft();
}
function rmDraftEx(i) { workoutDraft.splice(i, 1); drawDraft(); }

function saveWorkout(id) {
  const name = $('#w_name').value.trim();
  if (!name) { toast('Dê um nome ao treino'); return; }
  if (!workoutDraft.length) { toast('Adicione ao menos um exercício'); return; }
  const studentId = $('#w_student').value || null;
  const obj = { name, focus: $('#w_focus').value.trim(), studentId, items: structuredClone(workoutDraft) };

  if (id) {
    Object.assign(DB.workout(id), obj);
    toast('Treino atualizado');
  } else {
    obj.id = DB.uid('w');
    DB.data.workouts.push(obj);
    toast('Treino criado');
  }
  // sincroniza vínculo aluno -> treino
  if (studentId) {
    DB.data.workouts.forEach(w => { if (w.studentId === studentId && w.id !== (id || obj.id)) w.studentId = null; });
    const st = DB.student(studentId);
    if (st) st.workoutId = id || obj.id;
  }
  DB.save();
  closeModal();
  renderWorkouts();
}

function deleteWorkout(id) {
  if (!confirm('Excluir este treino?')) return;
  const w = DB.workout(id);
  if (w.studentId) { const st = DB.student(w.studentId); if (st) st.workoutId = null; }
  DB.data.workouts = DB.data.workouts.filter(x => x.id !== id);
  DB.save();
  closeModal();
  renderWorkouts();
  toast('Treino excluído');
}

/* ==========================================================================
   BIBLIOTECA DE EXERCÍCIOS
   ========================================================================== */
function renderLibrary() {
  drawLibrary();
}
function drawLibrary() {
  const term = (renderLibrary._term || '').toLowerCase();
  let list = DB.data.exercises;
  if (term) list = list.filter(e => e.name.toLowerCase().includes(term) || e.muscle.toLowerCase().includes(term));

  $('#page-library').innerHTML = `
    <div class="toolbar">
      <div class="search-box">
        <span class="ic">🔍</span>
        <input type="text" id="libSearch" placeholder="Buscar exercício ou músculo..." value="${escapeHtml(renderLibrary._term || '')}" />
      </div>
    </div>
    <div class="card-grid">
      ${list.map(e => `
        <div class="exercise-card" onclick="playVideo('${e.id}')">
          <div class="exercise-thumb">
            <img src="${e.img}" alt="${escapeHtml(e.name)}" onerror="this.parentElement.style.background='var(--surface-2)';this.remove()"/>
            <div class="play">▶</div>
          </div>
          <div class="exercise-body">
            <h3>${escapeHtml(e.name)}</h3>
            <div class="muscle">${escapeHtml(e.muscle)}</div>
            <span class="tag-chip">${escapeHtml(e.equipment)}</span>
          </div>
        </div>`).join('')}
    </div>
  `;
  $('#libSearch').addEventListener('input', (e) => { renderLibrary._term = e.target.value; drawLibrary(); $('#libSearch').focus(); });
}

function playVideo(exId) {
  const ex = DB.exercise(exId);
  const search = encodeURIComponent(ex.name + ' execução exercício');
  openModal(`
    <div class="modal wide">
      <div class="modal-head"><h2>${escapeHtml(ex.name)}</h2><button class="modal-close">✕</button></div>
      <div class="modal-body">
        <iframe class="video-frame" src="https://www.youtube.com/embed/${ex.yt}" title="${escapeHtml(ex.name)}" allowfullscreen></iframe>
        <div style="display:flex;justify-content:space-between;margin-top:14px;align-items:center;flex-wrap:wrap;gap:10px">
          <div><div class="muscle text-brand" style="font-weight:600">${escapeHtml(ex.muscle)}</div><div class="text-muted" style="font-size:.85rem">Equipamento: ${escapeHtml(ex.equipment)}</div></div>
          <a class="btn btn-ghost btn-sm" href="https://www.youtube.com/results?search_query=${search}" target="_blank" rel="noopener">Não carregou? Buscar no YouTube ↗</a>
        </div>
      </div>
    </div>
  `);
}

/* ==========================================================================
   PAGAMENTOS
   ========================================================================== */
function renderPayments() {
  $('#topbarActions').innerHTML = `<button class="btn btn-primary" onclick="paymentForm()">+ Registrar cobrança</button>`;
  renderPayments._month = renderPayments._month || CURRENT_MONTH;
  renderPayments._status = renderPayments._status || 'all';
  drawPayments();
}

function drawPayments() {
  const months = [...new Set(DB.data.payments.map(p => p.month))].sort().reverse();
  const month = renderPayments._month;
  const statusF = renderPayments._status;
  let list = DB.data.payments.filter(p => p.month === month);
  if (statusF !== 'all') list = list.filter(p => p.status === statusF);

  const all = DB.data.payments.filter(p => p.month === month);
  const received = all.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const toReceive = all.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);

  $('#page-payments').innerHTML = `
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card"><div class="ic g">✅</div><div class="label">Recebido no mês</div><div class="value">${fmtBRL(received)}</div></div>
      <div class="stat-card"><div class="ic y">⏳</div><div class="label">A receber</div><div class="value">${fmtBRL(toReceive)}</div></div>
      <div class="stat-card"><div class="ic b">📈</div><div class="label">Total previsto</div><div class="value">${fmtBRL(received + toReceive)}</div></div>
    </div>

    <div class="toolbar">
      <select class="filter-select" id="pMonth">
        ${months.map(m => `<option value="${m}" ${m === month ? 'selected' : ''}>${monthName(m)}/${m.split('-')[0]}</option>`).join('')}
      </select>
      <select class="filter-select" id="pStatus">
        <option value="all" ${statusF === 'all' ? 'selected' : ''}>Todos os status</option>
        <option value="paid" ${statusF === 'paid' ? 'selected' : ''}>Pagos</option>
        <option value="pending" ${statusF === 'pending' ? 'selected' : ''}>Pendentes</option>
        <option value="late" ${statusF === 'late' ? 'selected' : ''}>Atrasados</option>
      </select>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th>Aluno</th><th>Plano</th><th>Vencimento</th><th>Valor</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${list.length ? list.map(p => {
            const s = DB.student(p.studentId);
            if (!s) return '';
            return `<tr>
              <td><div class="td-student"><span class="avatar">${initials(s.name)}</span> ${escapeHtml(s.name)}</div></td>
              <td>${s.plan}</td>
              <td>${fmtDate(p.dueDate)}</td>
              <td><strong>${fmtBRL(p.amount)}</strong></td>
              <td><span class="badge ${p.status}">${STATUS_LABEL[p.status]}</span></td>
              <td>${p.status !== 'paid'
                ? `<button class="btn btn-primary btn-sm" onclick="markPaid('${p.id}')">Marcar pago</button>`
                : `<button class="btn btn-ghost btn-sm" onclick="markUnpaid('${p.id}')">Estornar</button>`}</td>
            </tr>`;
          }).join('') : `<tr><td colspan="6"><div class="empty" style="padding:30px"><p>Nenhuma cobrança neste filtro.</p></div></td></tr>`}
        </tbody>
      </table>
    </div>
  `;
  $('#pMonth').addEventListener('change', e => { renderPayments._month = e.target.value; drawPayments(); });
  $('#pStatus').addEventListener('change', e => { renderPayments._status = e.target.value; drawPayments(); });
}

function markPaid(id) {
  const p = DB.data.payments.find(x => x.id === id);
  p.status = 'paid';
  p.paidAt = new Date().toISOString().slice(0, 10);
  DB.save();
  drawPayments();
  toast('Pagamento confirmado ✓');
}
function markUnpaid(id) {
  const p = DB.data.payments.find(x => x.id === id);
  p.status = 'pending';
  p.paidAt = null;
  DB.save();
  drawPayments();
  toast('Pagamento estornado');
}

function paymentForm() {
  const students = DB.data.students;
  openModal(`
    <div class="modal">
      <div class="modal-head"><h2>Registrar cobrança</h2><button class="modal-close">✕</button></div>
      <div class="modal-body">
        <div class="field"><label>Aluno</label><select id="pf_student">${students.map(s => `<option value="${s.id}" data-v="${s.planValue}">${escapeHtml(s.name)} — ${s.plan}</option>`).join('')}</select></div>
        <div class="form-row">
          <div class="field"><label>Mês de referência</label><input id="pf_month" type="month" value="${CURRENT_MONTH}" /></div>
          <div class="field"><label>Valor (R$)</label><input id="pf_amount" type="number" value="${students[0] ? students[0].planValue : 130}" /></div>
        </div>
        <div class="field"><label>Vencimento</label><input id="pf_due" type="date" value="${CURRENT_MONTH}-10" /></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost modal-close">Cancelar</button>
        <button class="btn btn-primary" onclick="savePayment()">Registrar</button>
      </div>
    </div>
  `);
  $('#pf_student').addEventListener('change', e => {
    const v = e.target.options[e.target.selectedIndex].dataset.v;
    $('#pf_amount').value = v;
  });
}

function savePayment() {
  const studentId = $('#pf_student').value;
  const month = $('#pf_month').value;
  if (!month) { toast('Informe o mês'); return; }
  DB.data.payments.push({
    id: DB.uid('p'),
    studentId,
    month,
    amount: +$('#pf_amount').value || 0,
    status: 'pending',
    dueDate: $('#pf_due').value,
    paidAt: null,
  });
  DB.save();
  closeModal();
  renderPayments._month = month;
  drawPayments();
  toast('Cobrança registrada');
}
