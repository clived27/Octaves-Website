/* ─── script.js ─── */

/* ════════════════════════════════════════
   Navigation: scroll-aware header
════════════════════════════════════════ */
(function () {
  var header = document.getElementById('site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ════════════════════════════════════════
   Hero: Typewriter for tagline
════════════════════════════════════════ */
(function () {
  var el    = document.getElementById('hero-tagline');
  if (!el) return;

  var text  = "VNIT's Hottest Club";
  var delay = 1200;
  var speed = 72;

  var cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');

  var i = 0;
  setTimeout(function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      el.appendChild(cursor);
      i++;
      setTimeout(type, speed);
    }
  }, delay);
})();

/* ════════════════════════════════════════
   Hero entrance animation
════════════════════════════════════════ */
(function () {
  var heroCenter = document.querySelector('.hero-center');
  if (!heroCenter) return;

  Array.from(heroCenter.children).forEach(function (child, i) {
    child.style.opacity = '0';
    child.style.transform = 'translateY(22px)';
    child.style.transition =
      'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)';
    child.style.transitionDelay = (i * 0.14) + 's';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      });
    });
  });
})();

/* ════════════════════════════════════════
   Profile pictures — inject into avatars
   Tries: jpg → JPG → jpeg → JPEG → png → webp
════════════════════════════════════════ */
(function () {
  document.querySelectorAll('.member-card[data-member-id]').forEach(function (card) {
    var id = card.dataset.memberId;
    if (!id) return;

    var placeholder = card.querySelector('.avatar-placeholder');
    if (!placeholder) return;

    var exts = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'webp'];
    var tried = 0;

    function tryNext() {
      if (tried >= exts.length) return;
      var img = document.createElement('img');
      img.className = 'avatar-profpic';
      img.alt = '';
      img.src = 'photos/' + id + '/profpic.' + exts[tried];
      tried++;

      img.onload = function () {
        placeholder.appendChild(img);
      };
      img.onerror = tryNext;
    }

    tryNext();
  });
})();

/* ════════════════════════════════════════
   Scroll-reveal animation
════════════════════════════════════════ */
(function () {
  var targets = document.querySelectorAll(
    '.member-card, .section-label, .section-title, .section-subtitle, .about-text, .body-text, .contact-item'
  );

  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    var d = i % 4;
    if (d > 0) el.classList.add('reveal-delay-' + d);
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(function (el) { observer.observe(el); });
})();
