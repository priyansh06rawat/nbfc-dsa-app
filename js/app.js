/* ============================================================
   NBFC DSA APP — Mobile App Logic (Production-Ready)
   India Shelter Home Loans
   ============================================================ */

'use strict';

// ── State ──────────────────────────────────────────────────────────────────
const AppState = {
  currentScreen: 'screen-splash',
  partnerType: null,
  otp: ['', '', '', '', '', ''],
  kyc: {
    pan: null, aadhaarFront: null, aadhaarBack: null,
    selfie: null, businessProof: null, bankDoc: null,
    panVerified: false, bankVerified: false, selfieVerified: false,
  },
  form: {
    name: '', phone: '', dob: '', email: '',
    pincode: '', experience: '', product: 'Home Loan',
  },
  leads: [
    { id: 'L001', name: 'Rahul Sharma',  product: 'Home Loan',  amount: '₹45L',  status: 'Processing', color: '#DE1F26', city: 'Mumbai',    date: '10 Jun 2026' },
    { id: 'L002', name: 'Priya Nair',    product: 'LAP',        amount: '₹28L',  status: 'Approved',   color: '#2E7D32', city: 'Pune',      date: '08 Jun 2026' },
    { id: 'L003', name: 'Amir Khan',     product: 'MSME Loan',  amount: '₹12L',  status: 'Pending',    color: '#EF6C00', city: 'Nagpur',    date: '07 Jun 2026' },
    { id: 'L004', name: 'Sunita Verma',  product: 'Home Loan',  amount: '₹62L',  status: 'Disbursed',  color: '#FBC02D', city: 'Delhi',     date: '05 Jun 2026' },
    { id: 'L005', name: 'Rajesh Patel',  product: 'PL',         amount: '₹5L',   status: 'Rejected',   color: '#C62828', city: 'Ahmedabad', date: '03 Jun 2026' },
    { id: 'L006', name: 'Meena Iyer',    product: 'Home Loan',  amount: '₹38L',  status: 'Approved',   color: '#1565C0', city: 'Bengaluru', date: '01 Jun 2026' },
    { id: 'L007', name: 'Deepak Gupta',  product: 'LAP',        amount: '₹75L',  status: 'Processing', color: '#6A1B9A', city: 'Jaipur',    date: '30 May 2026' },
    { id: 'L008', name: 'Kavita Singh',  product: 'Home Loan',  amount: '₹22L',  status: 'Disbursed',  color: '#00695C', city: 'Lucknow',   date: '28 May 2026' },
    { id: 'L009', name: 'Arjun Mehta',   product: 'MSME Loan',  amount: '₹18L',  status: 'Pending',    color: '#E65100', city: 'Surat',     date: '26 May 2026' },
    { id: 'L010', name: 'Pooja Reddy',   product: 'Home Loan',  amount: '₹51L',  status: 'Approved',   color: '#AD1457', city: 'Hyderabad', date: '24 May 2026' },
  ],
  payouts: [
    { id: 'P001', month: 'Jun 2026', amount: '₹84,200',    leads: 5, status: 'Pending', date: '15 Jun 2026', bank: 'HDFC ***4521' },
    { id: 'P002', month: 'May 2026', amount: '₹1,12,400',  leads: 6, status: 'Paid',    date: '15 May 2026', bank: 'HDFC ***4521' },
    { id: 'P003', month: 'Apr 2026', amount: '₹84,200',    leads: 4, status: 'Paid',    date: '15 Apr 2026', bank: 'HDFC ***4521' },
    { id: 'P004', month: 'Mar 2026', amount: '₹68,500',    leads: 3, status: 'Paid',    date: '15 Mar 2026', bank: 'HDFC ***4521' },
    { id: 'P005', month: 'Feb 2026', amount: '₹45,000',    leads: 2, status: 'Paid',    date: '15 Feb 2026', bank: 'HDFC ***4521' },
  ],
  activeLeadFilter: 'all',
  checklist: [false, false, false],
  navHistory: [],
  kycStep: 0,
};

// ── Screen Navigation ──────────────────────────────────────────────────────
function showScreen(id, pushHistory = true) {
  if (AppState.currentScreen === id) return;

  const prev = document.querySelector('.screen.active');
  const next = document.getElementById(id);
  if (!next) return;

  if (prev && prev.id !== id) {
    if (pushHistory) AppState.navHistory.push(prev.id);
    prev.classList.remove('active');
    prev.classList.add('exit-left');
    const onEnd = () => { prev.classList.remove('exit-left'); prev.removeEventListener('transitionend', onEnd); };
    prev.addEventListener('transitionend', onEnd);
    setTimeout(() => prev.classList.remove('exit-left'), 400);
  }

  next.classList.add('active');
  next.scrollTop = 0;
  AppState.currentScreen = id;
  updateTime();
  updateSidebarSteps();
  updateNavBar(id);
  closeLeadToast();
}

function goBack() {
  const hist = AppState.navHistory;
  if (!hist.length) return;
  const prevId = hist.pop();
  const curr = document.getElementById(AppState.currentScreen);
  const target = document.getElementById(prevId);
  if (!target) return;

  if (curr) {
    curr.classList.remove('active');
    curr.style.transform = 'translateX(30px)';
    curr.style.opacity = '0';
    curr.style.visibility = 'hidden';
    setTimeout(() => {
      curr.style.transform = '';
      curr.style.opacity = '';
      curr.style.visibility = '';
    }, 300);
  }

  target.classList.add('active');
  target.scrollTop = 0;
  AppState.currentScreen = prevId;
  updateTime();
  updateSidebarSteps();
  updateNavBar(prevId);
  closeLeadToast();
}

// ── Status Bar Clock ───────────────────────────────────────────────────────
function updateTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.querySelectorAll('.status-bar-time').forEach(el => el.textContent = `${h}:${m}`);
}

setInterval(updateTime, 30000);

// ── Sidebar Steps ──────────────────────────────────────────────────────────
const SCREEN_ORDER = [
  'screen-splash', 'screen-login', 'screen-otp', 'screen-partner-type',
  'screen-personal', 'screen-professional',
  'screen-kyc-pan', 'screen-kyc-aadhaar', 'screen-kyc-selfie',
  'screen-kyc-business', 'screen-kyc-bank', 'screen-kyc-agreement',
  'screen-review', 'screen-success', 'screen-home',
];

function updateSidebarSteps() {
  const idx = SCREEN_ORDER.indexOf(AppState.currentScreen);
  document.querySelectorAll('.sidebar-step').forEach((el, i) => {
    el.classList.remove('done', 'active', 'pending');
    if (i < idx) el.classList.add('done');
    else if (i === idx) el.classList.add('active');
    else el.classList.add('pending');
  });
}

// ── Mobile Bottom Nav ──────────────────────────────────────────────────────
const NAV_SCREENS = ['screen-home', 'screen-lead-form', 'screen-all-leads', 'screen-payouts', 'screen-profile'];

function updateNavBar(screenId) {
  const nav = document.getElementById('mobile-nav-bar');
  if (!nav) return;
  const isVisible = NAV_SCREENS.includes(screenId);
  nav.classList.toggle('visible', isVisible);
  const phoneFrame = document.querySelector('.phone-frame');
  if (phoneFrame) phoneFrame.classList.toggle('nav-visible', isVisible);
  nav.querySelectorAll('.nav-item[data-screen]').forEach(item => {
    // Home tab is active for 'screen-home'; Leads tab for lead-form and all-leads
    let isActive = item.dataset.screen === screenId;
    if (item.dataset.screen === 'screen-home' && screenId === 'screen-home') isActive = true;
    if (item.dataset.screen === 'screen-all-leads' && screenId === 'screen-lead-form') isActive = true;
    item.classList.toggle('active', isActive);
  });
}

function initMobileNav() {
  const nav = document.getElementById('mobile-nav-bar');
  if (!nav) return;
  nav.querySelectorAll('.nav-item[data-screen]').forEach(item => {
    item.addEventListener('click', () => showScreen(item.dataset.screen));
  });
  const fab = document.getElementById('nav-fab');
  if (fab) fab.addEventListener('click', () => showScreen('screen-lead-form'));
}

// ── OTP Input Logic ────────────────────────────────────────────────────────
function initOTPInputs() {
  const inputs = document.querySelectorAll('.otp-digit');
  inputs.forEach((inp, idx) => {
    inp.addEventListener('input', e => {
      const val = e.target.value.replace(/\D/g, '').slice(-1);
      inp.value = val;
      AppState.otp[idx] = val;
      if (val && idx < inputs.length - 1) inputs[idx + 1].focus();
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value && idx > 0) {
        inputs[idx - 1].focus(); inputs[idx - 1].value = ''; AppState.otp[idx - 1] = '';
      }
      if (e.key === 'ArrowRight' && idx < inputs.length - 1) inputs[idx + 1].focus();
      if (e.key === 'ArrowLeft' && idx > 0) inputs[idx - 1].focus();
    });
    inp.addEventListener('paste', e => {
      const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      paste.split('').forEach((ch, i) => { if (inputs[idx + i]) { inputs[idx + i].value = ch; AppState.otp[idx + i] = ch; } });
      inputs[Math.min(idx + paste.length, inputs.length - 1)]?.focus();
      e.preventDefault();
    });
  });
}

// ── Partner Card Selection ─────────────────────────────────────────────────
function initPartnerCards() {
  document.querySelectorAll('.partner-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.partner-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      AppState.partnerType = card.dataset.type;
    });
  });
}

// ── File Upload Zones ──────────────────────────────────────────────────────
function initUploadZones() {
  document.querySelectorAll('.upload-zone').forEach(zone => {
    const input = zone.querySelector('input[type="file"]');
    if (!input) return;
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      zone.classList.add('uploaded');
      const preview = zone.querySelector('.upload-preview');
      const iconWrap = zone.querySelector('.upload-icon-wrap');
      if (preview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => { preview.src = e.target.result; preview.style.display = 'block'; };
        reader.readAsDataURL(file);
        if (iconWrap) iconWrap.textContent = '✅';
      } else {
        if (iconWrap) iconWrap.textContent = '📄';
      }
      const key = zone.dataset.doc;
      if (key && key in AppState.kyc) AppState.kyc[key] = file;
    });
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--clr-primary)'; });
    zone.addEventListener('dragleave', () => zone.style.borderColor = '');
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.style.borderColor = '';
      if (e.dataTransfer.files[0]) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); }
    });
  });
}

// ── Signature Canvas ───────────────────────────────────────────────────────
function initSignaturePad() {
  const canvas = document.getElementById('sig-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.strokeStyle = 'rgba(222,31,38,0.9)';
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const pos = e => {
    const r = canvas.getBoundingClientRect();
    return { x: (e.touches ? e.touches[0].clientX : e.clientX) - r.left, y: (e.touches ? e.touches[0].clientY : e.clientY) - r.top };
  };
  canvas.addEventListener('mousedown', e => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
  canvas.addEventListener('mousemove', e => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }, { passive: false });
  canvas.addEventListener('touchmove', e => { e.preventDefault(); if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }, { passive: false });
  canvas.addEventListener('touchend', () => drawing = false);
  const clearBtn = document.getElementById('sig-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));
}

// ── PAN Verification Simulation ────────────────────────────────────────────
function simulatePANVerify() {
  const inp = document.getElementById('pan-input');
  const badge = document.getElementById('pan-verify-badge');
  const btn = document.getElementById('pan-verify-btn');
  if (!inp || !badge || !btn) return;
  btn.addEventListener('click', () => {
    const val = inp.value.trim().toUpperCase();
    badge.style.display = 'flex';
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val)) {
      badge.innerHTML = '❌ Invalid PAN Format';
      badge.className = 'verify-badge';
      badge.style.background = 'rgba(255,107,107,0.15)';
      badge.style.color = 'var(--clr-coral)';
      return;
    }
    badge.innerHTML = '<span class="processing-ring"></span> Verifying...';
    badge.className = 'verify-badge processing';
    btn.disabled = true;
    setTimeout(() => {
      badge.innerHTML = '✅ PAN Verified — Rajesh Kumar';
      badge.className = 'verify-badge success';
      AppState.kyc.panVerified = true;
      btn.disabled = false;
    }, 1800);
  });
}

// ── Bank Verification Simulation ───────────────────────────────────────────
function simulateBankVerify() {
  const btn = document.getElementById('bank-verify-btn');
  const status = document.getElementById('bank-verify-status');
  if (!btn || !status) return;
  btn.addEventListener('click', () => {
    btn.innerHTML = '<span class="processing-ring"></span> Verifying Penny Drop...';
    btn.disabled = true;
    status.style.display = 'none';
    setTimeout(() => {
      status.innerHTML = '✅ Bank Account Verified via Penny Drop';
      status.style.display = 'flex';
      btn.innerHTML = '✅ Verified';
      AppState.kyc.bankVerified = true;
    }, 2200);
  });
}

// ── Checklist (Agreement) ──────────────────────────────────────────────────
function initChecklist() {
  document.querySelectorAll('.custom-check').forEach((el, i) => {
    el.addEventListener('click', () => {
      AppState.checklist[i] = !AppState.checklist[i];
      el.classList.toggle('checked', AppState.checklist[i]);
      el.textContent = AppState.checklist[i] ? '✓' : '';
      const submitBtn = document.getElementById('agreement-submit');
      if (submitBtn) {
        submitBtn.disabled = !AppState.checklist.every(Boolean);
        submitBtn.style.opacity = AppState.checklist.every(Boolean) ? '1' : '0.5';
      }
    });
  });
}

// ── Amount Slider ──────────────────────────────────────────────────────────
function initAmountSlider() {
  const slider = document.getElementById('amount-slider');
  const display = document.getElementById('amount-display');
  if (!slider || !display) return;
  const fmt = v => {
    const n = parseInt(v);
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`;
    return `₹${n.toLocaleString('en-IN')}`;
  };
  slider.addEventListener('input', () => display.textContent = fmt(slider.value));
  display.textContent = fmt(slider.value);
}

// ── KYC Progress ──────────────────────────────────────────────────────────
function updateKYCProgress(step) {
  AppState.kycStep = step;
  document.querySelectorAll('.kyc-step-circle').forEach((el, i) => {
    el.classList.remove('done', 'active', 'pending');
    if (i < step) { el.classList.add('done'); el.textContent = '✓'; }
    else if (i === step) { el.classList.add('active'); el.textContent = i + 1; }
    else { el.classList.add('pending'); el.textContent = i + 1; }
  });
  document.querySelectorAll('.kyc-step-connector').forEach((el, i) => {
    el.classList.remove('done', 'active');
    if (i < step - 1) el.classList.add('done');
    else if (i === step - 1) el.classList.add('active');
  });
}

// ── Lead Card Renderer ─────────────────────────────────────────────────────
function leadStatusColor(status) {
  return {
    Processing: 'var(--clr-primary-l)',
    Approved:   'var(--clr-emerald)',
    Pending:    'var(--clr-amber)',
    Disbursed:  'var(--clr-cyan)',
    Rejected:   'var(--clr-coral)',
  }[status] || 'var(--text-muted)';
}

function renderLeadCard(lead) {
  const initials = lead.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const clr = leadStatusColor(lead.status);
  return `
    <div class="lead-card anim-fade-up" onclick="showLeadDetail('${lead.id}')" style="cursor:pointer">
      <div class="lead-avatar" style="background:${lead.color}">${initials}</div>
      <div class="lead-info">
        <div class="lead-name">${lead.name}</div>
        <div class="lead-detail">${lead.product} · ${lead.id}${lead.city ? ' · ' + lead.city : ''}</div>
        ${lead.date ? `<div style="font-size:10px;color:var(--text-muted);margin-top:1px">${lead.date}</div>` : ''}
      </div>
      <div class="lead-meta">
        <span class="lead-amount">${lead.amount}</span>
        <span style="font-size:11px;font-weight:600;color:${clr}">${lead.status}</span>
      </div>
    </div>`;
}

// Home screen — shows 5 most recent leads
function renderLeads() {
  const el = document.getElementById('lead-list');
  if (el) el.innerHTML = AppState.leads.slice(0, 5).map(renderLeadCard).join('');
}

// All leads screen — searchable + filterable
function renderAllLeads(filter, query) {
  filter = filter || AppState.activeLeadFilter;
  query  = query  || '';
  const el     = document.getElementById('all-lead-list');
  const countEl = document.getElementById('leads-count');
  if (!el) return;

  let list = AppState.leads;
  if (filter !== 'all') list = list.filter(l => l.status === filter);
  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.product.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      (l.city || '').toLowerCase().includes(q)
    );
  }

  if (countEl) countEl.textContent = `${list.length} lead${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    el.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
      <div style="font-size:40px;margin-bottom:12px">🔍</div>
      <div style="font-size:14px;font-weight:600">No leads found</div>
      <div style="font-size:12px;margin-top:4px">Try a different search or filter</div>
    </div>`;
    return;
  }
  el.innerHTML = list.map(renderLeadCard).join('');
}

// ── Lead Detail Toast ──────────────────────────────────────────────────────
function showLeadDetail(id) {
  const lead = AppState.leads.find(l => l.id === id);
  if (!lead) return;
  const clr = leadStatusColor(lead.status);
  const initials = lead.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  let toast = document.getElementById('lead-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lead-toast';
    toast.style.cssText = [
      'position:fixed',
      'bottom:100px',
      'left:50%',
      'transform:translateX(-50%) translateY(20px)',
      'background:#fff',
      'border-radius:18px',
      'padding:20px',
      'box-shadow:0 16px 48px rgba(0,0,0,0.22)',
      'z-index:9999',
      'width:320px',
      'max-width:90vw',
      'opacity:0',
      'transition:all 0.3s cubic-bezier(0.4,0,0.2,1)',
      'border:1px solid #E2E8F0',
    ].join(';');
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:40px;height:40px;border-radius:50%;background:${lead.color};display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:14px">${initials}</div>
        <div>
          <div style="font-weight:800;font-size:15px">${lead.name}</div>
          <div style="font-size:11px;color:#718096">${lead.id}${lead.city ? ' · ' + lead.city : ''}</div>
        </div>
      </div>
      <button onclick="closeLeadToast()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#718096;padding:0;line-height:1">×</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div style="background:#F8F9FA;border-radius:10px;padding:10px">
        <div style="font-size:10px;color:#718096;text-transform:uppercase;letter-spacing:0.5px">Product</div>
        <div style="font-size:13px;font-weight:700;margin-top:2px">${lead.product}</div>
      </div>
      <div style="background:#F8F9FA;border-radius:10px;padding:10px">
        <div style="font-size:10px;color:#718096;text-transform:uppercase;letter-spacing:0.5px">Amount</div>
        <div style="font-size:13px;font-weight:700;margin-top:2px;color:#DE1F26">${lead.amount}</div>
      </div>
      <div style="background:#F8F9FA;border-radius:10px;padding:10px">
        <div style="font-size:10px;color:#718096;text-transform:uppercase;letter-spacing:0.5px">Status</div>
        <div style="font-size:13px;font-weight:700;margin-top:2px;color:${clr}">${lead.status}</div>
      </div>
      <div style="background:#F8F9FA;border-radius:10px;padding:10px">
        <div style="font-size:10px;color:#718096;text-transform:uppercase;letter-spacing:0.5px">Date</div>
        <div style="font-size:13px;font-weight:700;margin-top:2px">${lead.date || 'N/A'}</div>
      </div>
    </div>
    <button onclick="closeLeadToast()" style="width:100%;padding:12px;background:linear-gradient(135deg,#DE1F26,#FF5A60);color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font-ui)">Close</button>
  `;

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
}

function closeLeadToast() {
  const t = document.getElementById('lead-toast');
  if (!t) return;
  t.style.opacity = '0';
  t.style.transform = 'translateX(-50%) translateY(20px)';
}

// ── Payouts Renderer ───────────────────────────────────────────────────────
function renderPayouts() {
  const el = document.getElementById('payout-list');
  if (!el) return;
  el.innerHTML = AppState.payouts.map(p => {
    const isPaid = p.status === 'Paid';
    return `
      <div style="background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:14px 16px;margin-bottom:10px;display:flex;align-items:center;gap:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
        <div style="width:44px;height:44px;background:${isPaid ? 'rgba(46,125,50,0.1)' : 'rgba(239,108,0,0.1)'};border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">
          ${isPaid ? '💳' : '⏳'}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:700;margin-bottom:2px">${p.month} Payout</div>
          <div style="font-size:11px;color:var(--text-muted)">${p.leads} disbursed leads · ${p.bank}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:1px">Date: ${p.date}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:15px;font-weight:900;color:${isPaid ? 'var(--clr-emerald)' : 'var(--clr-amber)'}">${p.amount}</div>
          <div style="font-size:10px;font-weight:700;margin-top:4px;padding:2px 8px;border-radius:20px;display:inline-block;background:${isPaid ? 'rgba(46,125,50,0.12)' : 'rgba(239,108,0,0.12)'};color:${isPaid ? 'var(--clr-emerald)' : 'var(--clr-amber)'}">${p.status}</div>
        </div>
      </div>`;
  }).join('');
}

// ── Splash Auto-transition ─────────────────────────────────────────────────
function startSplash() {
  setTimeout(() => showScreen('screen-login', false), 2800);
}

// ── Stepper Dots ───────────────────────────────────────────────────────────
function renderStepDots(containerId, total, current) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array.from({ length: total }, (_, i) =>
    `<div class="step-dot ${i === current ? 'active' : i < current ? 'done' : ''}"></div>`
  ).join('');
}

// ── Main Init ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateTime();
  startSplash();
  initOTPInputs();
  initPartnerCards();
  initUploadZones();
  initSignaturePad();
  simulatePANVerify();
  simulateBankVerify();
  initChecklist();
  initAmountSlider();
  initMobileNav();
  renderLeads();
  renderAllLeads();
  renderPayouts();

  // ── Wire all [data-next-screen] buttons ──────────────────────────────────
  document.querySelectorAll('[data-next-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.nextScreen;
      const kycScreens = [
        'screen-kyc-pan','screen-kyc-aadhaar','screen-kyc-selfie',
        'screen-kyc-business','screen-kyc-bank','screen-kyc-agreement'
      ];
      const idx = kycScreens.indexOf(target);
      if (idx >= 0) updateKYCProgress(idx);
      showScreen(target);
    });
  });

  // ── Back buttons ─────────────────────────────────────────────────────────
  document.querySelectorAll('[data-action="back"]').forEach(btn => {
    btn.addEventListener('click', goBack);
  });

  // ── View All leads ────────────────────────────────────────────────────────
  const viewAll = document.getElementById('view-all-leads');
  if (viewAll) viewAll.addEventListener('click', () => showScreen('screen-all-leads'));

  // ── Lead search ───────────────────────────────────────────────────────────
  const searchInput = document.getElementById('lead-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderAllLeads(AppState.activeLeadFilter, searchInput.value);
    });
  }

  // ── Filter chips ──────────────────────────────────────────────────────────
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.activeLeadFilter = chip.dataset.filter;
      const q = document.getElementById('lead-search');
      renderAllLeads(AppState.activeLeadFilter, q ? q.value : '');
    });
  });

  // ── Logout button ─────────────────────────────────────────────────────────
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      AppState.navHistory = [];
      showScreen('screen-login', false);
    });
  }

  // ── Phone: Send OTP ───────────────────────────────────────────────────────
  const sendOtpBtn = document.getElementById('send-otp-btn');
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
      const phone = document.getElementById('phone-input');
      if (phone && phone.value.length >= 10) {
        showScreen('screen-otp');
        setTimeout(() => {
          const digits = document.querySelectorAll('.otp-digit');
          '123456'.split('').forEach((d, i) => { if (digits[i]) digits[i].value = d; });
        }, 800);
      } else {
        phone && phone.classList.add('error');
        setTimeout(() => phone && phone.classList.remove('error'), 1000);
      }
    });
  }

  // ── Selfie capture ────────────────────────────────────────────────────────
  const selfieBtn = document.getElementById('selfie-capture-btn');
  if (selfieBtn) {
    selfieBtn.addEventListener('click', () => {
      selfieBtn.innerHTML = '<span class="processing-ring"></span> Capturing...';
      selfieBtn.disabled = true;
      setTimeout(() => {
        const inner = document.querySelector('.selfie-frame-inner');
        if (inner) inner.innerHTML = '<span style="font-size:80px">😊</span>';
        selfieBtn.innerHTML = '✅ Selfie Captured';
        const badge = document.getElementById('face-match-badge');
        if (badge) {
          badge.style.display = 'flex';
          badge.innerHTML = '✅ Face Match: 98.4%';
          badge.className = 'verify-badge success';
        }
        AppState.kyc.selfieVerified = true;
      }, 2000);
    });
  }

  // ── Close toast on screen tap ─────────────────────────────────────────────
  document.querySelector('.screen-container')?.addEventListener('touchstart', e => {
    const toast = document.getElementById('lead-toast');
    if (toast && toast.style.opacity === '1' && !toast.contains(e.target)) closeLeadToast();
  }, { passive: true });
});
