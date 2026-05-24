/* bioSite — interactive features (site.js) */

/* ── Lightbox ──────────────────────────────────────────────── */
(function () {
  'use strict';

  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image lightbox');

  var lbImg = document.createElement('img');
  lbImg.className = 'lightbox-img';
  lbImg.alt = '';

  var closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close lightbox');
  closeBtn.innerHTML = '&times;';

  overlay.appendChild(closeBtn);
  overlay.appendChild(lbImg);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    overlay.classList.add('open');
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
  });

  document.querySelectorAll('.card-img, .media-figure img').forEach(function (el) {
    el.addEventListener('click', function () { openLightbox(el.src, el.alt); });
  });
}());

/* ── Fun fact rotator ──────────────────────────────────────── */
(function () {
  'use strict';

  var rotator = document.getElementById('fact-rotator');
  if (!rotator) return;

  var facts = [
    'Jackson scored 7 goals at his last soccer practice! \u26BD',
    "Jackson's favorite food is steak \u2014 just like his big brother! \uD83E\uDD69",
    'Jackson wants to be a soldier when he grows up! \uD83C\uDF96\uFE0F',
    'Jackson loves going on adventures in the woods! \uD83C\uDF32',
    "Jackson's favorite subject is science \u2014 especially rocks! \uD83E\uDEA8",
    "Jackson's favorite vacation was Branson, Missouri! \uD83C\uDF61",
    'Jackson loves when Mom reads Little House on the Prairie at bedtime! \uD83D\uDCDA',
    "Jackson thinks outer space would be literally so cool \u2014 but he wouldn't stay too long! \uD83D\uDE80"
  ];

  var current = 0;
  var textEl  = document.getElementById('fact-text');
  var nextBtn = document.getElementById('fact-next');

  function showFact(i) {
    textEl.classList.add('fading');
    setTimeout(function () {
      textEl.textContent = facts[i];
      textEl.classList.remove('fading');
    }, 300);
  }

  nextBtn.addEventListener('click', function () {
    current = (current + 1) % facts.length;
    showFact(current);
  });

  setInterval(function () {
    current = (current + 1) % facts.length;
    showFact(current);
  }, 6000);
}());

/* ── Trivia quiz ───────────────────────────────────────────── */
(function () {
  'use strict';

  var container = document.getElementById('quiz-container');
  if (!container) return;

  var questions = [
    {
      q: "What is Jackson's favorite food?",
      options: ['Pizza', 'Steak', 'Tacos', 'Hot dogs'],
      answer: 1
    },
    {
      q: 'What does Jackson want to be when he grows up?',
      options: ['Astronaut', 'Teacher', 'Soldier', 'Doctor'],
      answer: 2
    },
    {
      q: "What is Jackson's favorite subject in school?",
      options: ['Math', 'Art', 'History', 'Science'],
      answer: 3
    },
    {
      q: 'Which book does Mom read to Jackson at bedtime?',
      options: ["Charlotte's Web", 'Harry Potter', 'Little House on the Prairie', 'Treasure Island'],
      answer: 2
    },
    {
      q: 'How many goals did Jackson score at his last soccer practice?',
      options: ['3', '5', '7', '10'],
      answer: 2
    }
  ];

  var selected = new Array(questions.length).fill(null);
  var wrap     = document.createElement('div');
  wrap.className = 'quiz-wrap';

  questions.forEach(function (q, qi) {
    var block = document.createElement('div');
    block.className = 'quiz-question';

    var prompt = document.createElement('p');
    prompt.textContent = (qi + 1) + '. ' + q.q;
    block.appendChild(prompt);

    var opts = document.createElement('div');
    opts.className = 'quiz-options';

    q.options.forEach(function (opt, oi) {
      var btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.dataset.qi  = qi;
      btn.dataset.oi  = oi;

      btn.addEventListener('click', function () {
        opts.querySelectorAll('.quiz-option').forEach(function (b) {
          b.style.borderColor = '';
          b.style.background  = '';
        });
        selected[qi] = oi;
        btn.style.borderColor = 'var(--color-accent)';
        btn.style.background  = 'rgba(0,122,255,0.1)';
        updateSubmit();
      });

      opts.appendChild(btn);
    });

    block.appendChild(opts);
    wrap.appendChild(block);
  });

  var submitBtn = document.createElement('button');
  submitBtn.className   = 'quiz-submit';
  submitBtn.textContent = 'Check my answers';
  submitBtn.disabled    = true;

  var result = document.createElement('div');
  result.className = 'quiz-result';

  function updateSubmit() {
    submitBtn.disabled = selected.some(function (s) { return s === null; });
  }

  submitBtn.addEventListener('click', function () {
    var score = 0;

    questions.forEach(function (q, qi) {
      wrap.querySelectorAll('[data-qi="' + qi + '"]').forEach(function (btn) {
        var oi = parseInt(btn.dataset.oi, 10);
        btn.disabled         = true;
        btn.style.borderColor = '';
        btn.style.background  = '';

        if (oi === q.answer) {
          btn.classList.add('correct');
        } else if (oi === selected[qi]) {
          btn.classList.add('incorrect');
        }
      });

      if (selected[qi] === q.answer) score++;
    });

    submitBtn.disabled   = true;
    result.style.display = 'block';

    var pct = Math.round((score / questions.length) * 100);

    if (pct === 100) {
      result.textContent = '\uD83C\uDFC6 Perfect score! ' + score + '/' + questions.length + ' \u2014 You know Jackson really well!';
    } else if (pct >= 60) {
      result.textContent = '\u2B50 Nice work! ' + score + '/' + questions.length + ' \u2014 Pretty good Jackson knowledge!';
    } else {
      result.textContent = '\uD83D\uDCDA ' + score + '/' + questions.length + ' \u2014 Read the other pages to learn more about Jackson!';
    }
  });

  wrap.appendChild(submitBtn);
  container.appendChild(wrap);
  container.appendChild(result);
}());
