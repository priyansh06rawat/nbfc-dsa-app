/* ============================================================
   NBFC DSA APP — Mobile App Logic
   ============================================================ */

'use strict';

// ── State ──────────────────────────────────────────────────
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
    { id: 'L001', name: 'Rahul Sharma',   product: 'Home Loan',  amount: '₹45L', status: 'Processing', color: '#DE1F26' },
    { id: 'L002', name: 'Priya Nair',     product: 'LAP',        amount: '₹28L', status: 'Approved',   color: '#2E7D32' },
    { id: 'L003', name: 'Amir Khan',      product: 'MSME Loan',  amount: '₹12L', status: 'Pending',    color: '#EF6C00' },
    { id: 'L004', name: 'Sunita Verma',   product: 'Home Loan',  amount: '₹62L', status: 'Disbursed',  color: '#FBC02D' },
    { id: 'L005', name: 'Rajesh Patel',   product: 'PL',         amount: '₹5L',  status: 'Rejected',   color: '#C62828' },
  ],
  checklist: [false, false, false],
  navHistory: [],
  kycStep: 0,
};

// ── Screen Navigation ──────────────────────────────────────
function showScreen(id, pushHistory = true) {
  if (AppState.currentScreen === id) return;         // no-op if already here

  const prev = document.querySelector('.screen.active');
  const next = document.getElementById(id);
  if (!next) return;

  if (prev && prev.id !== id) {
    if (pushHistory) AppState.navHistory.push(prev.id);
    // Mark exiting screen — CSS hides it instantly (visibility:hidden on exit-left)
    prev.classList.remove('active');
    prev.classList.add('exit-left');
    // Clean up exit-left after animation completes
    const onEnd = () => {
      prev.classList.remove('exit-left');
      prev.removeEventListener('transitionend', onEnd);
    };
    prev.addEventListener('transitionend', onEnd);
    // Safety fallback if transitionend never fires
    setTimeout(() => prev.classList.remove('exit-left'), 400);
  }

  // Activate the new screen (CSS transition handles fade+slide)
  next.classList.add('active');
  // Reset scroll position for the new screen
  next.scrollTop = 0;

  AppState.currentScreen = id;
  updateTime();
  updateSidebarSteps();
}

function goBack() {
  const hist = AppState.navHistory;
  if (!hist.length) return;
  const prevId = hist.pop();

  const curr = document.getElementById(AppState.currentScreen);
  const target = document.getElementById(prevId);
  if (!target) return;

  // Slide current screen out to the right
  if (curr) {
    curr.classList.remove('active');
    // Temporarily override transform for back-slide direction
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
}

// ── Status Bar Clock ──────────────────────────────────────
function updateTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.querySelectorAll('.status-bar-time').forEach(el => el.textContent = `${h}:${m}`);
}

setInterval(updateTime, 30000);

// ── Sidebar Steps Update ───────────────────────────────────
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

// ── OTP Input Logic ────────────────────────────────────────
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
        inputs[idx - 1].focus();
        inputs[idx - 1].value = '';
        AppState.otp[idx - 1] = '';
      }
      if (e.key === 'ArrowRight' && idx < inputs.length - 1) inputs[idx + 1].focus();
      if (e.key === 'ArrowLeft' && idx > 0) inputs[idx - 1].focus();
    });
    inp.addEventListener('paste', e => {
      const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      paste.split('').forEach((ch, i) => {
        if (inputs[idx + i]) {
          inputs[idx + i].value = ch;
          AppState.otp[idx + i] = ch;
        }
      });
      if (inputs[Math.min(idx + paste.length, inputs.length - 1)]) {
        inputs[Math.min(idx + paste.length, inputs.length - 1)].focus();
      }
      e.preventDefault();
    });
  });
}

// ── Partner Card Selection ─────────────────────────────────
function initPartnerCards() {
  document.querySelectorAll('.partner-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.partner-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      AppState.partnerType = card.dataset.type;
    });
  });
}

// ── File Upload Zones ──────────────────────────────────────
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
      // Track state
      const key = zone.dataset.doc;
      if (key && key in AppState.kyc) AppState.kyc[key] = file;
    });
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--clr-primary)'; });
    zone.addEventListener('dragleave', () => zone.style.borderColor = '');
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.style.borderColor = '';
      if (e.dataTransfer.files[0]) {
        input.files = e.dataTransfer.files;
        input.dispatchEvent(new Event('change'));
      }
    });
  });
}

// ── Signature Canvas ──────────────────────────────────────
function initSignaturePad() {
  const canvas = document.getElementById('sig-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.strokeStyle = 'rgba(222,31,38,0.9)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return { x, y };
  };

  canvas.addEventListener('mousedown', e => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
  canvas.addEventListener('mousemove', e => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
  canvas.addEventListener('mouseup',   () => { drawing = false; });
  canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }, { passive: false });
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }, { passive: false });
  canvas.addEventListener('touchend',  () => { drawing = false; });

  const clearBtn = document.getElementById('sig-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => { ctx.clearRect(0, 0, canvas.width, canvas.height); });

  const padLabel = document.querySelector('.signature-pad-label');
  canvas.addEventListener('mousedown', () => { if (padLabel) padLabel.style.display = 'none'; });
}

// ── PAN Verification Simulation ───────────────────────────
function simulatePANVerify() {
  const inp = document.getElementById('pan-input');
  const badge = document.getElementById('pan-verify-badge');
  const btn = document.getElementById('pan-verify-btn');
  if (!inp || !badge || !btn) return;

  btn.addEventListener('click', () => {
    const val = inp.value.trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val)) {
      badge.innerHTML = '❌ Invalid PAN Format';
      badge.className = 'verify-badge';
      badge.style.background = 'rgba(255,107,107,0.15)';
      badge.style.color = 'var(--clr-coral)';
      badge.style.border = '1px solid rgba(255,107,107,0.3)';
      return;
    }
    badge.innerHTML = '<span class="processing-ring"></span> Verifying...';
    badge.className = 'verify-badge processing';
    btn.disabled = true;
    setTimeout(() => {
      badge.innerHTML = '✅ PAN Verified';
      badge.className = 'verify-badge success';
      AppState.kyc.panVerified = true;
      btn.disabled = false;
    }, 1800);
  });
}

// ── Bank Verification Simulation ──────────────────────────
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

// ── Checklist (Agreement) ──────────────────────────────────
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

// ── Amount Slider ──────────────────────────────────────────
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
  slider.addEventListener('input', () => { display.textContent = fmt(slider.value); });
  display.textContent = fmt(slider.value);
}

// ── Mobile Nav ────────────────────────────────────────────
function initMobileNav() {
  document.querySelectorAll('.nav-item[data-screen]').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      showScreen(item.dataset.screen);
    });
  });
}

// ── Progress Steps Indicator ───────────────────────────────
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

// ── Render Lead Cards ──────────────────────────────────────
function renderLeads() {
  const container = document.getElementById('lead-list');
  if (!container) return;
  container.innerHTML = AppState.leads.map(lead => {
    const initials = lead.name.split(' ').map(w => w[0]).join('').slice(0, 2);
    const statusClr = {
      Processing: 'var(--clr-primary-l)', Approved: 'var(--clr-emerald)',
      Pending: 'var(--clr-amber)', Disbursed: 'var(--clr-cyan)', Rejected: 'var(--clr-coral)'
    }[lead.status] || 'var(--text-muted)';
    return `
      <div class="lead-card anim-fade-up">
        <div class="lead-avatar" style="background:${lead.color}">${initials}</div>
        <div class="lead-info">
          <div class="lead-name">${lead.name}</div>
          <div class="lead-detail">${lead.product} · ${lead.id}</div>
        </div>
        <div class="lead-meta">
          <span class="lead-amount">${lead.amount}</span>
          <span style="font-size:11px;font-weight:600;color:${statusClr}">${lead.status}</span>
        </div>
      </div>`;
  }).join('');
}

// ── Splash Auto-transition ────────────────────────────────
function startSplash() {
  setTimeout(() => {
    showScreen('screen-login', false);
  }, 2800);
}

// ── Stepper Dots ──────────────────────────────────────────
function renderStepDots(containerId, total, current) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array.from({ length: total }, (_, i) =>
    `<div class="step-dot ${i === current ? 'active' : i < current ? 'done' : ''}"></div>`
  ).join('');
}

// ── Main Init ─────────────────────────────────────────────
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

  // Wire up all "next" buttons by data-next-screen attribute
  document.querySelectorAll('[data-next-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.nextScreen;
      // Update KYC step if entering a KYC screen
      const kycScreens = ['screen-kyc-pan','screen-kyc-aadhaar','screen-kyc-selfie','screen-kyc-business','screen-kyc-bank','screen-kyc-agreement'];
      const idx = kycScreens.indexOf(target);
      if (idx >= 0) updateKYCProgress(idx);
      showScreen(target);
    });
  });

  // Wire up back buttons
  document.querySelectorAll('[data-action="back"]').forEach(btn => {
    btn.addEventListener('click', goBack);
  });

  // Phone number send OTP
  const sendOtpBtn = document.getElementById('send-otp-btn');
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
      const phone = document.getElementById('phone-input');
      if (phone && phone.value.length >= 10) {
        showScreen('screen-otp');
        // Auto-fill OTP for demo
        setTimeout(() => {
          const digits = document.querySelectorAll('.otp-digit');
          '123456'.split('').forEach((d, i) => {
            if (digits[i]) digits[i].value = d;
          });
        }, 800);
      } else {
        phone && phone.classList.add('error');
        setTimeout(() => phone && phone.classList.remove('error'), 1000);
      }
    });
  }

  // Selfie animation
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
});
