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
   Profile pictures — inject into .member-photo
   Tries: jpg → JPG → jpeg → JPEG → png → webp
════════════════════════════════════════ */
(function () {
  document.querySelectorAll('.member-card[data-member-id]').forEach(function (card) {
    var id = card.dataset.memberId;
    if (!id) return;

    // Target the new rectangular photo frame
    var photoFrame = card.querySelector('.member-photo');
    if (!photoFrame) return;

    var exts = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'webp'];
    var tried = 0;

    function tryNext() {
      if (tried >= exts.length) return;
      var img = document.createElement('img');
      img.alt = '';
      img.src = 'photos/' + id + '/profpic.' + exts[tried];
      tried++;

      img.onload = function () {
        // Hide the letter initial, show photo
        var initial = photoFrame.querySelector('.photo-initial');
        if (initial) initial.style.display = 'none';
        photoFrame.appendChild(img);
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

/* ════════════════════════════════════════
   GIG VAULT — Data + Interactive Renderer
════════════════════════════════════════ */

var GIG_VAULT_DATA = [
  {
    eventTitle: 'Aarohi 2026',
    date: 'February 2026 · VNIT Nagpur',
    youtubeId: 'dQw4w9WgXcQ',  /* replace with actual unlisted video ID */
    setlist: [
      {
        songTitle: 'Tum Se Hi',
        artist: 'Jab We Met',
        timestamp: '0m 00s',
        timestampSeconds: 0,
        lineup: ['🎤 Suhana — Vocals', '🎸 Prajjwal — Guitar', '🎹 Shreyansh — Keys']
      },
      {
        songTitle: 'Counting Stars',
        artist: 'OneRepublic',
        timestamp: '4m 35s',
        timestampSeconds: 275,
        lineup: ['🎤 Samriddhi — Vocals', '🎸 Pratham — Guitar', '🎹 Shreyansh — Keys']
      },
      {
        songTitle: 'Raataan Lambiyan',
        artist: 'Shershaah',
        timestamp: '9m 10s',
        timestampSeconds: 550,
        lineup: ['🎤 Aarushi — Vocals', '🎹 Harikrishna — Keys']
      },
      {
        songTitle: 'Viva La Vida',
        artist: 'Coldplay',
        timestamp: '13m 48s',
        timestampSeconds: 828,
        lineup: ['🎤 Suhana — Vocals', '🎸 Prajjwal — Guitar', '🎹 Shreyansh — Keys']
      },
      {
        songTitle: 'Kabira',
        artist: 'Yeh Jawaani Hai Deewani',
        timestamp: '18m 20s',
        timestampSeconds: 1100,
        lineup: ['🎤 Samriddhi — Vocals', '🎸 Pratham — Guitar']
      },
      {
        songTitle: 'Kesariya',
        artist: 'Brahmastra',
        timestamp: '22m 05s',
        timestampSeconds: 1325,
        lineup: ['🎤 Suhana — Vocals', '🎤 Aarushi — Vocals', '🎹 Shreyansh — Keys', '🎸 Prajjwal — Guitar']
      }
    ]
  }
];

(function () {
  var data    = GIG_VAULT_DATA[0];
  if (!data) return;

  var iframe   = document.getElementById('gig-iframe');
  var setlistEl = document.getElementById('gig-setlist');
  var pillsEl   = document.getElementById('gig-onstage-pills');
  var titleEl   = document.getElementById('gig-event-title');
  var dateEl    = document.getElementById('gig-event-date');

  if (!setlistEl || !iframe) return;

  /* Populate event meta */
  if (titleEl) titleEl.textContent = data.eventTitle;
  if (dateEl)  dateEl.textContent  = data.date;

  var activeIndex = 0;

  /* Build lineup pills */
  function renderLineup(lineup) {
    if (!pillsEl) return;
    pillsEl.innerHTML = '';
    lineup.forEach(function (person) {
      var pill = document.createElement('span');
      pill.className = 'gig-pill';
      pill.textContent = person;
      pillsEl.appendChild(pill);
    });
  }

  /* Set active item + update video src */
  function setActive(index) {
    activeIndex = index;
    var items = setlistEl.querySelectorAll('.gig-setlist-item');
    items.forEach(function (item, i) {
      item.classList.toggle('active', i === index);
    });
    renderLineup(data.setlist[index].lineup);

    /* Update YouTube iframe to seek to timestamp */
    var t = data.setlist[index].timestampSeconds;
    iframe.src = 'https://www.youtube.com/embed/' + data.youtubeId
      + '?start=' + t + '&autoplay=0&rel=0&modestbranding=1';
  }

  /* Build setlist */
  data.setlist.forEach(function (song, i) {
    var li = document.createElement('li');
    li.className = 'gig-setlist-item';
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', song.songTitle + ' by ' + song.artist);

    li.innerHTML =
      '<span class="gig-track-num">' + (i + 1) + '</span>' +
      '<div class="gig-song-info">' +
        '<p class="gig-song-title">' + song.songTitle + '</p>' +
        '<p class="gig-song-artist">' + song.artist + '</p>' +
      '</div>' +
      '<span class="gig-song-time">' + song.timestamp + '</span>' +
      '<button class="gig-play-btn" aria-label="Play ' + song.songTitle + '">&#9654;</button>';

    li.addEventListener('click', function () { setActive(i); });
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); }
    });

    setlistEl.appendChild(li);
  });

  /* Render initial state */
  setActive(0);
})();

/* ════════════════════════════════════════
   Scroll-Snap Sections: Reveal animation
   Fires .is-visible on text when section
   enters viewport; resets on exit so
   re-entering re-triggers the animation.
════════════════════════════════════════ */
(function () {
  var sections = document.querySelectorAll('.snap-section');
  if (!sections.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var inner = entry.target.querySelector('.snap-text-inner');
      if (!inner) return;

      if (entry.isIntersecting) {
        /* Small rAF delay so the snap animation has started */
        requestAnimationFrame(function () {
          setTimeout(function () {
            inner.classList.add('is-visible');
          }, 80);
        });
      } else {
        /* Reset so re-entry re-animates */
        inner.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.42 /* Fire when 42% of section is visible */
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
