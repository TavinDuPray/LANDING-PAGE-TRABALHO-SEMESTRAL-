/* ==========================================================================
   FitManager — Camada de dados (localStorage) + dados de exemplo (seed)
   ========================================================================== */

const DB_KEY = 'fitmanager_db_v1';

/* ----- Dados de exemplo (carregados na 1ª vez) ----- */
const SEED = {
  trainer: { name: 'Camila Andrade', email: 'personal@fitmanager.com', role: 'Personal Trainer' },

  // Biblioteca de exercícios — imagem (Unsplash) + vídeo (YouTube)
  exercises: [
    { id: 'e1', name: 'Agachamento Livre', muscle: 'Pernas / Glúteos', equipment: 'Barra', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&q=70', yt: 'gcNh17Ckjgg' },
    { id: 'e2', name: 'Supino Reto', muscle: 'Peito', equipment: 'Barra', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=70', yt: 'rT7DgCr-3pg' },
    { id: 'e3', name: 'Levantamento Terra', muscle: 'Costas / Posterior', equipment: 'Barra', img: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=500&q=70', yt: 'op9kVnSso6Q' },
    { id: 'e4', name: 'Puxada na Polia', muscle: 'Costas', equipment: 'Polia', img: 'https://images.unsplash.com/photo-1597076545399-91a3ff0e71b3?w=500&q=70', yt: 'CAwf7n6Luuc' },
    { id: 'e5', name: 'Desenvolvimento de Ombro', muscle: 'Ombros', equipment: 'Halteres', img: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=500&q=70', yt: 'qEwKCR5JCog' },
    { id: 'e6', name: 'Rosca Direta', muscle: 'Bíceps', equipment: 'Barra', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=70', yt: 'kwG2ipFRgfo' },
    { id: 'e7', name: 'Tríceps na Corda', muscle: 'Tríceps', equipment: 'Polia', img: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=500&q=70', yt: 'kiuVA0gs3RI' },
    { id: 'e8', name: 'Leg Press 45°', muscle: 'Pernas', equipment: 'Máquina', img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&q=70', yt: 'IZxyjW7MPJQ' },
    { id: 'e9', name: 'Prancha Abdominal', muscle: 'Core / Abdômen', equipment: 'Peso corporal', img: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&q=70', yt: 'pSHjTRCQxIw' },
    { id: 'e10', name: 'Afundo (Avanço)', muscle: 'Pernas / Glúteos', equipment: 'Halteres', img: 'https://images.unsplash.com/photo-1434596922112-19c563067271?w=500&q=70', yt: 'QOVaHwm-Q6U' },
    { id: 'e11', name: 'Remada Curvada', muscle: 'Costas', equipment: 'Barra', img: 'https://images.unsplash.com/photo-1598971639058-fab3c3623e16?w=500&q=70', yt: 'kBWAon7ItDw' },
    { id: 'e12', name: 'Elevação Lateral', muscle: 'Ombros', equipment: 'Halteres', img: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=500&q=70', yt: '3VcKaXpzqRo' },
  ],

  students: [
    { id: 's1', name: 'Marina Alves', email: 'marina@email.com', phone: '(41) 99812-3344', goal: 'Hipertrofia', plan: 'Trimestral', planValue: 110, status: 'ativo', joinedAt: '2026-01-10', weight: 62, height: 165, bodyfat: 24, workoutId: 'w1' },
    { id: 's2', name: 'Rafael Costa', email: 'rafael@email.com', phone: '(41) 99744-1122', goal: 'Emagrecimento', plan: 'Mensal', planValue: 130, status: 'ativo', joinedAt: '2026-03-02', weight: 88, height: 178, bodyfat: 28, workoutId: 'w2' },
    { id: 's3', name: 'Júlia Souza', email: 'julia@email.com', phone: '(41) 99655-7788', goal: 'Condicionamento', plan: 'Mensal', planValue: 130, status: 'ativo', joinedAt: '2026-04-15', weight: 58, height: 160, bodyfat: 22, workoutId: null },
    { id: 's4', name: 'Bruno Lima', email: 'bruno@email.com', phone: '(41) 99588-9900', goal: 'Hipertrofia', plan: 'Anual', planValue: 99, status: 'ativo', joinedAt: '2025-11-20', weight: 75, height: 180, bodyfat: 18, workoutId: 'w1' },
    { id: 's5', name: 'Fernanda Dias', email: 'fernanda@email.com', phone: '(41) 99477-6655', goal: 'Reabilitação', plan: 'Mensal', planValue: 130, status: 'inativo', joinedAt: '2025-09-05', weight: 70, height: 168, bodyfat: 30, workoutId: null },
    { id: 's6', name: 'Thiago Nunes', email: 'thiago@email.com', phone: '(41) 99366-4433', goal: 'Força', plan: 'Trimestral', planValue: 110, status: 'ativo', joinedAt: '2026-02-18', weight: 82, height: 175, bodyfat: 20, workoutId: 'w2' },
  ],

  workouts: [
    { id: 'w1', name: 'Treino A — Superiores', focus: 'Peito, Costas e Ombros', studentId: 's1', items: [
      { exId: 'e2', sets: 4, reps: '10-12', rest: '90s', note: 'Foco na fase excêntrica' },
      { exId: 'e4', sets: 4, reps: '12', rest: '60s', note: 'Pegada aberta' },
      { exId: 'e5', sets: 3, reps: '12', rest: '60s', note: '' },
      { exId: 'e6', sets: 3, reps: '15', rest: '45s', note: 'Sem balançar o corpo' },
    ]},
    { id: 'w2', name: 'Treino B — Inferiores', focus: 'Pernas e Glúteos', studentId: 's2', items: [
      { exId: 'e1', sets: 4, reps: '10', rest: '120s', note: 'Descer até 90°' },
      { exId: 'e8', sets: 4, reps: '12', rest: '90s', note: '' },
      { exId: 'e10', sets: 3, reps: '12 (cada perna)', rest: '60s', note: '' },
      { exId: 'e9', sets: 3, reps: '40s', rest: '45s', note: 'Manter abdômen contraído' },
    ]},
  ],

  // Pagamentos (mês de referência atual = junho/2026)
  payments: [
    { id: 'p1', studentId: 's1', month: '2026-06', amount: 330, status: 'paid', dueDate: '2026-06-05', paidAt: '2026-06-03' },
    { id: 'p2', studentId: 's2', month: '2026-06', amount: 130, status: 'late', dueDate: '2026-06-05', paidAt: null },
    { id: 'p3', studentId: 's3', month: '2026-06', amount: 130, status: 'paid', dueDate: '2026-06-10', paidAt: '2026-06-09' },
    { id: 'p4', studentId: 's4', month: '2026-06', amount: 1188, status: 'paid', dueDate: '2026-06-01', paidAt: '2026-05-30' },
    { id: 'p5', studentId: 's6', month: '2026-06', amount: 330, status: 'pending', dueDate: '2026-06-18', paidAt: null },
    { id: 'p6', studentId: 's1', month: '2026-05', amount: 330, status: 'paid', dueDate: '2026-05-05', paidAt: '2026-05-04' },
    { id: 'p7', studentId: 's2', month: '2026-05', amount: 130, status: 'paid', dueDate: '2026-05-05', paidAt: '2026-05-06' },
  ],
};

/* ----- API simples de dados ----- */
const DB = {
  load() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      this.data = structuredClone(SEED);
      this.save();
    } else {
      try { this.data = JSON.parse(raw); }
      catch { this.data = structuredClone(SEED); this.save(); }
    }
    return this.data;
  },
  save() { localStorage.setItem(DB_KEY, JSON.stringify(this.data)); },
  reset() { localStorage.removeItem(DB_KEY); this.load(); },

  // Helpers
  uid(prefix) { return prefix + Date.now() + Math.floor(Math.random() * 999); },
  student(id) { return this.data.students.find(s => s.id === id); },
  exercise(id) { return this.data.exercises.find(e => e.id === id); },
  workout(id) { return this.data.workouts.find(w => w.id === id); },
  workoutByStudent(id) { return this.data.workouts.find(w => w.studentId === id); },
};
