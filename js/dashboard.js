/* ============================================================
   NBFC DSA APP — Dashboard Logic & Charts
   ============================================================ */

'use strict';

// ── Mock Data ─────────────────────────────────────────────
const DASHBOARD_DATA = {
  kpi: {
    totalLeads:     { value: 2847, trend: '+18.2%', up: true },
    disbursed:      { value: '₹184Cr', trend: '+12.4%', up: true },
    pendingKYC:     { value: 143, trend: '-5.1%', up: false },
    activeDSAs:     { value: 386, trend: '+8.7%', up: true },
  },
  monthlyDisbursement: [
    { month: 'Jan', disbursed: 42, sanctioned: 58 },
    { month: 'Feb', disbursed: 55, sanctioned: 70 },
    { month: 'Mar', disbursed: 48, sanctioned: 65 },
    { month: 'Apr', disbursed: 72, sanctioned: 88 },
    { month: 'May', disbursed: 65, sanctioned: 80 },
    { month: 'Jun', disbursed: 90, sanctioned: 108 },
    { month: 'Jul', disbursed: 78, sanctioned: 95 },
    { month: 'Aug', disbursed: 95, sanctioned: 115 },
    { month: 'Sep', disbursed: 110, sanctioned: 130 },
    { month: 'Oct', disbursed: 88, sanctioned: 105 },
    { month: 'Nov', disbursed: 124, sanctioned: 145 },
    { month: 'Dec', disbursed: 140, sanctioned: 165 },
  ],
  productMix: [
    { name: 'Home Loan',   pct: 42, color: '#DE1F26', amount: '₹77Cr'  },
    { name: 'LAP',         pct: 28, color: '#EF6C00', amount: '₹51Cr'  },
    { name: 'MSME Loan',   pct: 15, color: '#8E24AA', amount: '₹28Cr'  },
    { name: 'Personal Loan', pct: 9, color: '#FBC02D', amount: '₹17Cr' },
    { name: 'Others',      pct: 6,  color: '#721C24', amount: '₹11Cr'  },
  ],
  funnel: [
    { label: 'Leads Received',   count: 2847, pct: 100 },
    { label: 'Login Done',       count: 2104, pct: 74  },
    { label: 'KYC Verified',     count: 1632, pct: 57  },
    { label: 'Sanctioned',       count: 987,  pct: 35  },
    { label: 'Disbursed',        count: 642,  pct: 23  },
  ],
  leads: [
    { id:'L-2847', name:'Rohit Menon',    product:'Home Loan', amount:'₹52L', dsa:'Kavita Shah',   status:'Processing', date:'10 Jun',    priority:'high'   },
    { id:'L-2846', name:'Ananya Singh',   product:'LAP',       amount:'₹35L', dsa:'Raj Patel',     status:'Sanctioned', date:'9 Jun',     priority:'medium' },
    { id:'L-2845', name:'Deepak Sharma',  product:'MSME',      amount:'₹18L', dsa:'Meera Joshi',   status:'KYC Pending', date:'9 Jun',    priority:'low'    },
    { id:'L-2844', name:'Pooja Iyer',     product:'Home Loan', amount:'₹68L', dsa:'Sanjay Mehta',  status:'Disbursed',  date:'8 Jun',     priority:'high'   },
    { id:'L-2843', name:'Amit Kumar',     product:'PL',        amount:'₹8L',  dsa:'Kavita Shah',   status:'Rejected',   date:'8 Jun',     priority:'low'    },
    { id:'L-2842', name:'Nisha Gupta',    product:'LAP',       amount:'₹42L', dsa:'Raj Patel',     status:'Login',      date:'7 Jun',     priority:'medium' },
    { id:'L-2841', name:'Varun Khanna',   product:'Home Loan', amount:'₹75L', dsa:'Arjun Das',     status:'Sanctioned', date:'7 Jun',     priority:'high'   },
    { id:'L-2840', name:'Smita Reddy',    product:'MSME',      amount:'₹22L', dsa:'Meera Joshi',   status:'Processing', date:'6 Jun',     priority:'medium' },
  ],
  kycQueue: [
    { name:'Rohit Menon',    type:'DSA Partner',  submitted:'10 Jun 09:45', pan:'✅', aadhaar:'✅', selfie:'✅', bank:'⏳', status:'Pending' },
    { name:'Kavya Reddy',    type:'Connector',    submitted:'10 Jun 08:12', pan:'✅', aadhaar:'✅', selfie:'✅', bank:'✅', status:'Review'  },
    { name:'Mohan Das',      type:'DSA Partner',  submitted:'9 Jun 18:30',  pan:'✅', aadhaar:'❌', selfie:'✅', bank:'✅', status:'Rejected'},
    { name:'Anjali Shah',    type:'Co-lender',    submitted:'9 Jun 14:00',  pan:'✅', aadhaar:'✅', selfie:'✅', bank:'✅', status:'Approved'},
    { name:'Pradeep Kumar',  type:'DSA Partner',  submitted:'9 Jun 10:20',  pan:'✅', aadhaar:'✅', selfie:'⏳', bank:'⏳', status:'Pending' },
    { name:'Sunita Rao',     type:'Connector',    submitted:'8 Jun 16:45',  pan:'✅', aadhaar:'✅', selfie:'✅', bank:'✅', status:'Approved'},
  ],
  partners: [
    { name:'Kavita Shah',   code:'DSA-0042', type:'DSA',        leads:128, disbursed:'₹42Cr', rating:4.8, status:'Active'    },
    { name:'Raj Patel',     code:'DSA-0091', type:'DSA',        leads:96,  disbursed:'₹38Cr', rating:4.5, status:'Active'    },
    { name:'Meera Joshi',   code:'CNT-0018', type:'Connector',  leads:74,  disbursed:'₹22Cr', rating:4.2, status:'Active'    },
    { name:'Sanjay Mehta',  code:'DSA-0033', type:'DSA',        leads:162, disbursed:'₹58Cr', rating:4.9, status:'Active'    },
    { name:'Arjun Das',     code:'COL-0007', type:'Co-lender',  leads:45,  disbursed:'₹85Cr', rating:4.6, status:'Active'    },
    { name:'Priya Nambiar', code:'DSA-0105', type:'DSA',        leads:38,  disbursed:'₹14Cr', rating:3.9, status:'Suspended' },
    { name:'Rekha Singh',   code:'CNT-0029', type:'Connector',  leads:51,  disbursed:'₹18Cr', rating:4.1, status:'Active'    },
  ],
  activity: [
    { icon:'📄', color:'rgba(222,31,38,0.1)', text:'<strong>Kavya Reddy</strong> submitted KYC documents for review', time:'2 min ago' },
    { icon:'✅', color:'rgba(46,125,50,0.1)',   text:'Lead <strong>L-2844</strong> disbursed — ₹68L (Home Loan)', time:'15 min ago' },
    { icon:'🔍', color:'rgba(222,31,38,0.08)', text:'PAN verification completed for <strong>Rohit Menon</strong>', time:'32 min ago' },
    { icon:'❌', color:'rgba(198,40,40,0.1)', text:'Lead <strong>L-2843</strong> rejected — CIBIL score low', time:'1 hr ago' },
    { icon:'👤', color:'rgba(239,108,0,0.1)',  text:'New DSA registered: <strong>Rajesh Verma</strong> (DSA-0142)', time:'2 hr ago' },
    { icon:'📋', color:'rgba(142,36,170,0.1)', text:'Monthly report generated for <strong>May 2026</strong>', time:'3 hr ago' },
  ],
  kanban: {
    'Lead In':    ['Rohit Menon|Home Loan|₹52L|high', 'Priya Roy|LAP|₹30L|medium', 'Ali Hassan|MSME|₹15L|low'],
    'Login Done': ['Nisha Gupta|LAP|₹42L|medium', 'Tanveer Khan|Home Loan|₹65L|high'],
    'KYC':        ['Deepak Sharma|MSME|₹18L|low', 'Pooja Singh|Home Loan|₹44L|medium', 'Rahul Dev|PL|₹6L|low'],
    'Sanctioned': ['Ananya Singh|LAP|₹35L|medium', 'Varun Khanna|Home Loan|₹75L|high'],
    'Disbursed':  ['Pooja Iyer|Home Loan|₹68L|high', 'Sunita Verma|LAP|₹28L|medium'],
  },
};

// ── Page Navigation ────────────────────────────────────────
function showDashboardPage(id) {
  document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  const pg = document.getElementById(id);
  if (pg) pg.classList.add('active');
  document.querySelector(`[data-page="${id}"]`)?.classList.add('active');
  const titles = {
    'page-overview':  'Overview Dashboard',
    'page-pipeline':  'Lead Pipeline',
    'page-kyc':       'KYC Queue',
    'page-partners':  'Partner Management',
    'page-analytics': 'Analytics',
  };
  const hdr = document.querySelector('.top-header-title');
  if (hdr) hdr.textContent = titles[id] || 'Dashboard';
}

// ── Render KPI Cards ───────────────────────────────────────
function renderKPIs() {
  const icons = ['🏦', '💸', '🔍', '👥'];
  const bg    = [
    'rgba(108,99,255,0.15)', 'rgba(0,229,160,0.12)',
    'rgba(255,184,48,0.12)', 'rgba(176,110,255,0.12)'
  ];
  const entries = Object.entries(DASHBOARD_DATA.kpi);
  const container = document.getElementById('kpi-grid');
  if (!container) return;
  container.innerHTML = entries.map(([, d], i) => `
    <div class="kpi-card anim-fade-up" style="animation-delay:${i * 0.08}s">
      <div class="kpi-top">
        <div class="kpi-icon" style="background:${bg[i]}">${icons[i]}</div>
        <span class="kpi-trend ${d.up ? 'up' : 'down'}">${d.up ? '▲' : '▼'} ${d.trend}</span>
      </div>
      <div class="kpi-value text-gradient">${d.value}</div>
      <div class="kpi-label">${['Total Leads','Amount Disbursed','Pending KYC','Active DSAs'][i]}</div>
      <div class="kpi-sub">vs last month</div>
    </div>
  `).join('');
}

// ── Bar Chart (Disbursement) ───────────────────────────────
function renderBarChart() {
  const container = document.getElementById('bar-chart');
  if (!container) return;
  const data = DASHBOARD_DATA.monthlyDisbursement;
  const maxVal = Math.max(...data.map(d => d.sanctioned));
  container.innerHTML = data.map(d => `
    <div class="bar-group">
      <div class="bar-wrap">
        <div class="bar bar-sanctioned" data-val="Sanc ₹${d.sanctioned}Cr"
             style="height:${(d.sanctioned / maxVal) * 100}%; width:10px; margin-bottom:2px;"></div>
        <div class="bar bar-disbursed" data-val="Disb ₹${d.disbursed}Cr"
             style="height:${(d.disbursed / maxVal) * 100}%; width:14px;"></div>
      </div>
      <div class="bar-label">${d.month.slice(0,3)}</div>
    </div>
  `).join('');
}

// ── Donut Chart ────────────────────────────────────────────
function renderDonut() {
  const svg = document.getElementById('donut-svg');
  if (!svg) return;
  const legend = document.getElementById('donut-legend');
  const data = DASHBOARD_DATA.productMix;
  const r = 70, cx = 90, cy = 90;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const segments = data.map(d => {
    const len = (d.pct / 100) * circumference;
    const gap = 3;
    const seg = `
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="none" stroke="${d.color}" stroke-width="18"
        stroke-dasharray="${len - gap} ${circumference - len + gap}"
        stroke-dashoffset="${-offset}"
        stroke-linecap="round"
        style="transform-origin:${cx}px ${cy}px; transition: stroke-dasharray 1s ease;">
        <title>${d.name}: ${d.pct}% (${d.amount})</title>
      </circle>`;
    offset += len;
    return seg;
  }).join('');

  svg.innerHTML = `
    <svg width="180" height="180" viewBox="0 0 180 180" class="donut-svg">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="18"/>
      ${segments}
      <text x="${cx}" y="${cy - 8}" text-anchor="middle" fill="#F0F4FF" font-size="22" font-weight="900" font-family="Outfit">₹184Cr</text>
      <text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="#8892B0" font-size="10" font-family="Inter">Total</text>
    </svg>`;

  if (legend) {
    legend.innerHTML = data.map(d => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${d.color}"></span>
        <span class="legend-label">${d.name}</span>
        <span class="legend-value" style="color:${d.color}">${d.pct}%</span>
      </div>`).join('');
  }
}

// ── Funnel Chart ───────────────────────────────────────────
function renderFunnel() {
  const container = document.getElementById('funnel-chart');
  if (!container) return;
  const colors = ['#DE1F26', '#FF5A60', '#FF8E92', '#FFA726', '#FFD54F'];
  container.innerHTML = DASHBOARD_DATA.funnel.map((d, i) => `
    <div class="funnel-bar-row">
      <div class="funnel-label">${d.label}</div>
      <div class="funnel-bar-wrap">
        <div class="funnel-bar" style="width:${d.pct}%; background:${colors[i]}">
          ${d.pct}%
        </div>
      </div>
      <div class="funnel-count">${d.count.toLocaleString('en-IN')}</div>
    </div>
  `).join('');
}

// ── Lead Table ─────────────────────────────────────────────
const STATUS_CONFIG = {
  'Processing':  { cls: 'badge-primary',  label: 'Processing'  },
  'Sanctioned':  { cls: 'badge-cyan',     label: 'Sanctioned'  },
  'KYC Pending': { cls: 'badge-warning',  label: 'KYC Pending' },
  'Disbursed':   { cls: 'badge-success',  label: 'Disbursed'   },
  'Rejected':    { cls: 'badge-danger',   label: 'Rejected'    },
  'Login':       { cls: 'badge-warning',  label: 'Login'       },
};

const PRIORITY_CLR = { high: '#FF6B6B', medium: '#FFB830', low: '#00E5A0' };
const AVATAR_COLORS = ['#DE1F26','#EF6C00','#2E7D32','#FBC02D','#9C27B0','#C62828'];

function renderLeadTable(filterStatus = 'all') {
  const tbody = document.getElementById('lead-tbody');
  if (!tbody) return;
  const leads = filterStatus === 'all'
    ? DASHBOARD_DATA.leads
    : DASHBOARD_DATA.leads.filter(l => l.status.toLowerCase().includes(filterStatus));

  tbody.innerHTML = leads.map((lead, i) => {
    const initials = lead.name.split(' ').map(w=>w[0]).join('').slice(0,2);
    const sc = STATUS_CONFIG[lead.status] || { cls:'badge-primary', label: lead.status };
    return `
    <tr class="anim-fade-up" style="animation-delay:${i*0.04}s">
      <td><div class="td-name">
        <div class="td-avatar" style="background:${AVATAR_COLORS[i%AVATAR_COLORS.length]}">${initials}</div>
        <div><div class="td-primary">${lead.name}</div><div class="td-secondary">${lead.id}</div></div>
      </div></td>
      <td>${lead.product}</td>
      <td style="font-weight:700;font-family:'Outfit',sans-serif">${lead.amount}</td>
      <td>${lead.dsa}</td>
      <td><span class="badge ${sc.cls}">${sc.label}</span></td>
      <td>${lead.date}</td>
      <td>
        <div class="kanban-priority" style="background:${PRIORITY_CLR[lead.priority]};width:8px;height:8px;border-radius:50%;display:inline-block"></div>
        ${lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
      </td>
      <td>
        <div class="table-actions">
          <div class="action-btn tooltip" data-tip="View">👁</div>
          <div class="action-btn tooltip" data-tip="Edit">✏️</div>
          <div class="action-btn tooltip" data-tip="More">⋯</div>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ── KYC Queue ──────────────────────────────────────────────
function renderKYCQueue() {
  const tbody = document.getElementById('kyc-tbody');
  if (!tbody) return;
  const statusBadge = { 'Pending':'badge-warning', 'Review':'badge-cyan', 'Rejected':'badge-danger', 'Approved':'badge-success' };
  tbody.innerHTML = DASHBOARD_DATA.kycQueue.map((k, i) => `
    <tr class="anim-fade-up" style="animation-delay:${i*0.05}s">
      <td><div class="td-name">
        <div class="td-avatar" style="background:${AVATAR_COLORS[i%AVATAR_COLORS.length]}">${k.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
        <div><div class="td-primary">${k.name}</div><div class="td-secondary">${k.type}</div></div>
      </div></td>
      <td>${k.submitted}</td>
      <td style="font-size:18px">${k.pan} ${k.aadhaar} ${k.selfie} ${k.bank}</td>
      <td><span class="badge ${statusBadge[k.status]||'badge-primary'}">${k.status}</span></td>
      <td><div class="table-actions">
        <div class="action-btn tooltip" data-tip="Review">🔍</div>
        <div class="action-btn tooltip" data-tip="Approve">✅</div>
        <div class="action-btn tooltip" data-tip="Reject">❌</div>
      </div></td>
    </tr>`).join('');
}

// ── Partner Table ──────────────────────────────────────────
function renderPartners() {
  const tbody = document.getElementById('partner-tbody');
  if (!tbody) return;
  const typeBadge = { DSA: 'badge-primary', Connector: 'badge-cyan', 'Co-lender': 'badge-purple' };
  tbody.innerHTML = DASHBOARD_DATA.partners.map((p, i) => {
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '☆' : '');
    return `
    <tr class="anim-fade-up" style="animation-delay:${i*0.04}s">
      <td><div class="td-name">
        <div class="td-avatar" style="background:${AVATAR_COLORS[i%AVATAR_COLORS.length]}">${p.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
        <div><div class="td-primary">${p.name}</div><div class="td-secondary">${p.code}</div></div>
      </div></td>
      <td><span class="badge ${typeBadge[p.type]||'badge-primary'}">${p.type}</span></td>
      <td style="font-weight:700">${p.leads}</td>
      <td style="font-weight:800;font-family:'Outfit',sans-serif">${p.disbursed}</td>
      <td><span style="color:#FFB830">${stars}</span> <span style="font-size:12px;color:var(--text-muted)">${p.rating}</span></td>
      <td><span class="badge ${p.status==='Active'?'badge-success':'badge-danger'}">${p.status}</span></td>
      <td><div class="table-actions">
        <div class="action-btn">👁</div>
        <div class="action-btn">✏️</div>
      </div></td>
    </tr>`;
  }).join('');
}

// ── Kanban Board ───────────────────────────────────────────
function renderKanban() {
  const board = document.getElementById('kanban-board');
  if (!board) return;
  const colColors = {
    'Lead In':'#DE1F26', 'Login Done':'#EF6C00', 'KYC':'#FBC02D', 'Sanctioned':'#9C27B0', 'Disbursed':'#2E7D32'
  };
  board.innerHTML = Object.entries(DASHBOARD_DATA.kanban).map(([col, cards]) => `
    <div class="kanban-col">
      <div class="kanban-col-header">
        <div class="kanban-col-title">
          <div class="status-dot" style="background:${colColors[col]};box-shadow:0 0 6px ${colColors[col]}"></div>
          ${col}
        </div>
        <span class="kanban-col-count">${cards.length}</span>
      </div>
      <div class="kanban-col-body">
        ${cards.map(c => {
          const [name, product, amount, priority] = c.split('|');
          return `
          <div class="kanban-card">
            <div class="kanban-card-name">${name}</div>
            <div class="kanban-card-meta">${product}</div>
            <div class="kanban-card-footer">
              <div class="kanban-card-amount" style="color:${colColors[col]}">${amount}</div>
              <div class="kanban-priority" style="background:${PRIORITY_CLR[priority]}"></div>
            </div>
          </div>`;
        }).join('')}
        <div style="height:36px;border:1.5px dashed rgba(255,255,255,0.06);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:18px;cursor:pointer">+</div>
      </div>
    </div>
  `).join('');
}

// ── Activity Feed ──────────────────────────────────────────
function renderActivity() {
  const feed = document.getElementById('activity-feed');
  if (!feed) return;
  feed.innerHTML = DASHBOARD_DATA.activity.map((a, i) => `
    <div class="activity-item anim-slide-right" style="animation-delay:${i*0.06}s">
      <div class="activity-icon" style="background:${a.color}">${a.icon}</div>
      <div class="activity-content">
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">🕐 ${a.time}</div>
      </div>
    </div>
  `).join('');
}

// ── Analytics Line Chart (SVG) ─────────────────────────────
function renderLineChart() {
  const container = document.getElementById('line-chart-container');
  if (!container) return;
  const data = DASHBOARD_DATA.monthlyDisbursement.map(d => d.disbursed);
  const W = 520, H = 160, pad = 20;
  const maxV = Math.max(...data);
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (W - 2*pad),
    H - pad - (v / maxV) * (H - 2*pad)
  ]);

  const pathD = pts.map((p, i) => `${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length-1][0]},${H} L${pts[0][0]},${H} Z`;

  const circles = pts.map(p =>
    `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="#DE1F26" stroke="#FFFFFF" stroke-width="2"/>`
  ).join('');

  const months = DASHBOARD_DATA.monthlyDisbursement.map(d => d.month.slice(0,3));
  const labels = pts.map((p, i) =>
    `<text x="${p[0].toFixed(1)}" y="${H+4}" text-anchor="middle" fill="#4A5568" font-size="9" font-family="Inter">${months[i]}</text>`
  ).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H+16}" preserveAspectRatio="none" style="width:100%;height:160px;overflow:visible">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#DE1F26" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#DE1F26" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#areaGrad)"/>
      <path d="${pathD}" fill="none" stroke="#DE1F26" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${circles}
      ${labels}
    </svg>`;
}

// ── Filter Pills ───────────────────────────────────────────
function initFilterPills() {
  document.querySelectorAll('.filter-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      pill.closest('.table-filters').querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderLeadTable(pill.dataset.filter);
    });
  });

  // Tab buttons
  document.querySelectorAll('.tab-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.tab-row').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ── Notification Panel ─────────────────────────────────────
function initNotifications() {
  const btn = document.getElementById('notif-btn');
  const panel = document.getElementById('notif-panel');
  if (!btn || !panel) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.toggle('visible');
  });
  document.addEventListener('click', () => panel.classList.remove('visible'));
  panel.addEventListener('click', e => e.stopPropagation());
}

// ── Animated Counters ──────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 1200;
  const start = performance.now();
  const isNum = typeof target === 'number';
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    if (isNum) el.textContent = Math.round(ease * target).toLocaleString('en-IN') + suffix;
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ── Top DSA List ───────────────────────────────────────────
function renderTopDSAs() {
  const container = document.getElementById('top-dsa-list');
  if (!container) return;
  const dsas = [
    ['Sanjay Mehta', '₹58Cr', 162, 95],
    ['Kavita Shah',  '₹42Cr', 128, 70],
    ['Raj Patel',    '₹38Cr', 96,  63],
    ['Arjun Das',    '₹35Cr', 85,  58],
    ['Meera Joshi',  '₹22Cr', 74,  37],
  ];
  container.innerHTML = dsas.map(([name, amount, leads, pct], i) => `
    <div style="display:flex;align-items:center;gap:12px" class="anim-fade-up" style="animation-delay:${i*0.08}s">
      <div style="width:24px;height:24px;border-radius:50%;background:var(--grad-primary);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;flex-shrink:0">${i+1}</div>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:12px;font-weight:600">${name}</span>
          <span style="font-size:12px;font-weight:800;font-family:'Outfit',sans-serif;color:var(--clr-emerald)">${amount}</span>
        </div>
        <div class="prog-bar-wrap" style="height:4px">
          <div class="prog-bar" style="width:${pct}%;background:var(--grad-primary)"></div>
        </div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:3px">${leads} leads</div>
      </div>
    </div>`).join('');
}

// ── Product Performance Table ──────────────────────────────
function renderProductTable() {
  const tbody = document.getElementById('product-tbody');
  if (!tbody) return;
  const products = [
    ['Home Loan',    1194, '₹77Cr', '24%', '1.2%', '#DE1F26'],
    ['LAP',          797,  '₹51Cr', '21%', '2.1%', '#EF6C00'],
    ['MSME Loan',    426,  '₹28Cr', '19%', '3.4%', '#8E24AA'],
    ['Personal Loan',284,  '₹17Cr', '18%', '2.8%', '#FBC02D'],
    ['Others',       146,  '₹11Cr', '16%', '1.9%', '#721C24'],
  ];
  tbody.innerHTML = products.map(([prod, leads, disb, conv, npa, color]) => `
    <tr>
      <td><span style="color:${color};font-weight:600">● </span>${prod}</td>
      <td style="font-weight:600">${leads}</td>
      <td style="font-weight:800;font-family:'Outfit',sans-serif">${disb}</td>
      <td style="color:var(--clr-emerald);font-weight:700">${conv}</td>
      <td style="color:var(--clr-coral);font-weight:700">${npa}</td>
    </tr>`).join('');
}

// ── State-wise Distribution ────────────────────────────────
function renderStateList() {
  const container = document.getElementById('state-list');
  if (!container) return;
  const states = [
    ['Maharashtra', '₹68Cr', 37, '#DE1F26'],
    ['Delhi / NCR', '₹42Cr', 23, '#EF6C00'],
    ['Karnataka',   '₹28Cr', 15, '#2E7D32'],
    ['Tamil Nadu',  '₹22Cr', 12, '#FBC02D'],
    ['Gujarat',     '₹14Cr',  8, '#9C27B0'],
    ['Others',      '₹10Cr',  5, '#721C24'],
  ];
  container.innerHTML = states.map(([state, amt, pct, color]) => `
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:5px">
        <span style="font-size:12px;font-weight:600">${state}</span>
        <div style="display:flex;gap:12px">
          <span style="font-size:12px;font-weight:800;font-family:'Outfit',sans-serif">${amt}</span>
          <span style="font-size:12px;color:var(--text-muted)">${pct}%</span>
        </div>
      </div>
      <div class="prog-bar-wrap">
        <div class="prog-bar" style="width:${pct * 2.5}%;background:${color}"></div>
      </div>
    </div>`).join('');
}

// ── Main Init ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderKPIs();
  renderBarChart();
  renderDonut();
  renderFunnel();
  renderLeadTable();
  renderKYCQueue();
  renderPartners();
  renderKanban();
  renderActivity();
  renderLineChart();
  renderTopDSAs();
  renderProductTable();
  renderStateList();
  initFilterPills();
  initNotifications();

  // Sidebar navigation
  document.querySelectorAll('.sidebar-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      showDashboardPage(item.dataset.page);
    });
  });

  // Default page
  showDashboardPage('page-overview');

  // Hamburger on mobile
  const burger = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (burger && sidebar) {
    burger.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // Resize handler for line chart
  window.addEventListener('resize', () => { renderLineChart(); renderBarChart(); });

  // Animate overview KPI numbers on load
  setTimeout(() => {
    const kpiVals = document.querySelectorAll('.kpi-value');
    const targets = [2847, 184, 143, 386];
    const suffixes = ['', 'Cr', '', ''];
    kpiVals.forEach((el, i) => {
      if (i < targets.length && typeof targets[i] === 'number') {
        if (i === 1) {
          el.textContent = '₹0Cr';
          const span = el;
          const start = performance.now();
          const dur = 1200;
          const tick = (now) => {
            const t = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            span.innerHTML = `<span style="background:var(--grad-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">₹${Math.round(ease * 184)}Cr</span>`;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        } else {
          animateCounter(el, targets[i]);
        }
      }
    });
  }, 400);
});
