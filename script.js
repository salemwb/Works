// ============ معرض أعمال — JavaScript للتفاعلية ============

// 1) السنة الحالية في الفوتر
document.getElementById('year').textContent = new Date().getFullYear();

// التأكد من ظهور صور المعرض، مع معالجة واضحة لأي صورة لا يمكن تحميلها
document.querySelectorAll('.gallery-item img, .project-screenshot').forEach(img => {
  img.addEventListener('error', () => img.classList.add('image-error'));
  if (img.complete && img.naturalWidth === 0) img.classList.add('image-error');
});

// 2) الوضع الليلي / النهاري مع الحفظ
const themeBtn = document.getElementById('themeBtn');
const themeIcon = themeBtn.querySelector('i');

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('theme', theme);
}
applyTheme(localStorage.getItem('theme') || 'light');
themeBtn.addEventListener('click', () => {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
});

// 3) قائمة الجوال
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  menuBtn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}
menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 960) setMenu(false);
});

// 4) تظليل الرابط النشط عند التمرير
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  const y = window.scrollY + 140;
  let current = 'home';
  sections.forEach(s => { if (y >= s.offsetTop) current = s.id; });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

  // زر الصعود
  topBtn.style.display = window.scrollY > 500 ? 'grid' : 'none';
  // ظل للهيدر
  document.getElementById('header').style.boxShadow =
    window.scrollY > 10 ? '0 8px 24px rgba(0,0,0,.07)' : 'none';
});

// 5) تأثير الكتابة الآلية في الواجهة
const words = ['تطوير المواقع', 'تصميم الواجهات', 'التصميم الجرافيكي'];
const typingEl = document.getElementById('typing');
let wi = 0, ci = 0, deleting = false;

(function type() {
  const word = words[wi];
  typingEl.textContent = word.slice(0, ci);
  if (!deleting && ci < word.length) { ci++; }
  else if (!deleting && ci === word.length) { deleting = true; setTimeout(type, 1400); return; }
  else if (deleting && ci > 0) { ci--; }
  else { deleting = false; wi = (wi + 1) % words.length; }
  setTimeout(type, deleting ? 45 : 90);
})();

// 6) عدّاد إحصائيات متحركة
const counters = document.querySelectorAll('[data-count]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    let n = 0;
    const step = () => {
      n += Math.max(1, Math.round(target / 60));
      if (n >= target) { el.textContent = target; }
      else { el.textContent = n; requestAnimationFrame(step); }
    };
    step();
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObs.observe(c));

// 7) أشرطة المهارات تتحرك عند الظهور
const fills = document.querySelectorAll('.fill');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width;
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
fills.forEach(f => barObs.observe(f));

// 8) ظهور العناصر عند التمرير
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// 9) فلترة المشاريع
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('hide', !show);
      if (show) { c.classList.remove('show'); requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('show'))); }
    });
  });
});

// 10) نموذج التواصل — تحقق بسيط ورسالة نجاح
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (name.length < 2) return showNote('فضلاً اكتب اسمك بشكل صحيح.', false);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showNote('البريد الإلكتروني غير صحيح.', false);
  if (message.length < 10) return showNote('اكتب تفاصيل أكثر عن مشروعك (10 أحرف على الأقل).', false);

  const subject = document.getElementById('subject').value.trim() || 'تواصل بخصوص مشروع تقني';
  const mailto = 'mailto:saleemw2007@gmail.com?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent('الاسم: ' + name + '\nالبريد الإلكتروني: ' + email + '\n\n' + message);
  showNote('سيتم فتح تطبيق البريد لإكمال إرسال رسالتك.', true);
  window.location.href = mailto;
});
function showNote(msg, ok) {
  note.textContent = msg;
  note.className = 'form-note ' + (ok ? 'ok' : 'err');
}

// 11) زر العودة للأعلى
const topBtn = document.getElementById('topBtn');
topBtn.style.display = 'none';
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
