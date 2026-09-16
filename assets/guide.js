// guide.js - table-of-contents scrollspy and topic filter, shared by every guide page.
(function () {
  // --- sticky top bar ----------------------------------------------------
  // The bar wraps to a second row on narrow screens, and does so at a different
  // width in each language, so the offset the sticky TOC and every anchor jump
  // depend on is measured rather than guessed. guide.css carries a static
  // fallback for the no-JS case.
  var topbar = document.querySelector('nav.topbar');
  if (topbar) {
    var measureTopbar = function () {
      document.documentElement.style.setProperty('--topbar-h', topbar.offsetHeight + 'px');
    };
    measureTopbar();
    if ('ResizeObserver' in window) {
      new ResizeObserver(measureTopbar).observe(topbar);
    } else {
      window.addEventListener('resize', measureTopbar);
    }
  }

  // --- table of contents scrollspy -------------------------------------
  var links = Array.prototype.slice.call(document.querySelectorAll('nav.toc a'));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

  var targets = Object.keys(byId)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { visible.add(e.target.id); } else { visible.delete(e.target.id); }
      });
      var first = targets.find(function (t) { return visible.has(t.id); });
      links.forEach(function (a) { a.classList.remove('current'); });
      if (first && byId[first.id]) { byId[first.id].classList.add('current'); }
    }, { rootMargin: '-8% 0px -70% 0px', threshold: 0 });
    targets.forEach(function (t) { io.observe(t); });
  }

  // --- topic filter ------------------------------------------------------
  var input = document.getElementById('filter');
  var topics = Array.prototype.slice.call(document.querySelectorAll('.topic'));
  var parts = Array.prototype.slice.call(document.querySelectorAll('.part'));

  // Guard: the quiz block below shares this IIFE, so a page without a filter
  // must not throw here.
  if (input) input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();

    topics.forEach(function (t) {
      t.hidden = q !== '' && t.textContent.toLowerCase().indexOf(q) === -1;
    });

    parts.forEach(function (p) {
      var any = p.querySelector('.topic:not([hidden])');
      p.hidden = q !== '' && !any;
    });

    links.forEach(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      var li = a.parentElement;
      if (el && el.classList.contains('topic')) { li.hidden = el.hidden; }
    });
  });

  // --- self-check quizzes ------------------------------------------------
  var quizzes = Array.prototype.slice.call(document.querySelectorAll('.quiz'));
  var page = (location.pathname.split('/').pop() || 'index');

  quizzes.forEach(function (quiz) {
    var storageKey = 'guide-quiz:' + page + ':' + (quiz.id || 'quiz');
    var questions = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-q'));
    var score = quiz.querySelector('.quiz-score');
    var reset = quiz.querySelector('.quiz-reset');
    var answers = {};

    // localStorage can be unavailable (private mode, blocked cookies) - never let that
    // break the quiz itself; it just stops remembering.
    try {
      answers = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (e) {
      answers = {};
    }

    function save() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(answers));
      } catch (e) { /* storage full or blocked: keep working in-memory */ }
    }

    function render(question, index) {
      var correct = question.getAttribute('data-answer');
      var chosen = answers[index];
      var explain = question.querySelector('.quiz-explain');
      var options = Array.prototype.slice.call(question.querySelectorAll('.quiz-option'));

      options.forEach(function (option) {
        var input = option.querySelector('input');
        option.classList.remove('is-correct', 'is-wrong', 'is-answer');
        input.checked = chosen != null && input.value === chosen;

        if (chosen == null) { return; }
        if (input.value === chosen) {
          option.classList.add(chosen === correct ? 'is-correct' : 'is-wrong');
        } else if (input.value === correct) {
          option.classList.add('is-answer');   // point at the right one after a miss
        }
      });

      explain.hidden = chosen == null || chosen === correct;
    }

    function renderScore() {
      var answered = 0;
      var right = 0;

      questions.forEach(function (question, index) {
        var chosen = answers[index];
        if (chosen == null) { return; }
        answered++;
        if (chosen === question.getAttribute('data-answer')) { right++; }
      });

      if (!score) { return; }

      // Wording comes from the markup so the shared script stays language-neutral.
      var empty = quiz.getAttribute('data-score-empty') || 'Not started.';
      var template = quiz.getAttribute('data-score') ||
        'Answered {answered} of {total} · {correct} correct';

      score.innerHTML = answered === 0
        ? empty
        : template.replace('{answered}', '<b>' + answered + '</b>')
                  .replace('{total}', questions.length)
                  .replace('{correct}', '<b>' + right + '</b>');
    }

    questions.forEach(function (question, index) {
      question.addEventListener('change', function (event) {
        if (!event.target.matches('input[type="radio"]')) { return; }
        answers[index] = event.target.value;
        save();
        render(question, index);
        renderScore();
      });

      render(question, index);
    });

    renderScore();

    // An answered quiz opens itself, so returning to the page shows the state.
    if (Object.keys(answers).length) { quiz.open = true; }

    if (reset) {
      reset.addEventListener('click', function () {
        answers = {};
        try { localStorage.removeItem(storageKey); } catch (e) {}
        questions.forEach(render);
        renderScore();
      });
    }
  });
})();
