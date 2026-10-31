/* Galatians Insurance Services - guided chat assistant
   Self-contained: no external services, no cost. Answers common questions
   and sends visitors to the quote form or email. */
(function () {
  'use strict';
  if (window.__galChat) return;
  window.__galChat = true;

  var EMAIL = 'connect@galatians-insurance-services.com';
  var NAVY = '#002B49', TEAL = '#0E9AA7', AMBER = '#F5A623';

  var LINKS = {
    hmo: { label: 'See HMO plans', href: 'hmo.html' },
    life: { label: 'See Life insurance', href: 'life.html' },
    nonlife: { label: 'See Non-Life insurance', href: 'non-life.html' },
    micro: { label: 'See Micro-Insurance', href: 'micro-insurance.html' },
    quote: { label: 'Request a free quote', href: '#quote-section' },
    email: { label: 'Email us', href: 'mailto:' + EMAIL }
  };

  function quoteHref() {
    return document.getElementById('quote-section') ? '#quote-section' : 'index.html#quote-section';
  }

  var REPLIES = {
    greet: {
      text: "Hi! I'm the Galatians virtual assistant. I can tell you about our Life, Non-Life and HMO coverage, and help you request a quote. What would you like to know?",
      links: []
    },
    hmo: {
      text: "We offer HMO plans for companies, and also for individuals and families. Plans usually cover inpatient and outpatient care, emergency care and annual check-ups. Exact benefits, limits and exclusions depend on the plan.",
      links: ['hmo', 'quote']
    },
    life: {
      text: "Our Life coverage includes term life, whole life, critical illness protection, estate planning and key-person coverage for businesses. The right plan depends on your goals, budget and who depends on you.",
      links: ['life', 'quote']
    },
    nonlife: {
      text: "Non-Life covers your vehicles, property and business: motor, fire and property, marine cargo, liability, travel and personal accident. Tell us what you want to protect and we will prepare options.",
      links: ['nonlife', 'quote']
    },
    micro: {
      text: "Embedded Micro-Insurance is simple, low-cost protection offered inside an app, platform or customer program, such as e-commerce, fintech or membership groups.",
      links: ['micro', 'quote']
    },
    quote: {
      text: "Prices depend on the plan, the people or assets covered, and your needs, so we prepare a quote for you. It is free. Fill in the short form and we will get back to you.",
      links: ['quote']
    },
    contact: {
      text: "You can reach a member of our team by email at " + EMAIL + ", or send us the quote form and we will reply.",
      links: ['quote', 'email']
    },
    claim: {
      text: "We help guide our clients through the claims process. Please email us your name, policy details and what happened, and our team will get back to you.",
      links: ['email']
    },
    where: {
      text: "We serve clients across the Philippines. For office and contact details, please email us or send the quote form.",
      links: ['email', 'quote']
    },
    license: {
      text: "For licensing and accreditation details, please email us and our team will answer directly.",
      links: ['email']
    },
    thanks: {
      text: "You're welcome! If you would like a quote, the form is just a tap away.",
      links: ['quote']
    },
    fallback: {
      text: "I'm not sure I can answer that one. I can help with Life, Non-Life, HMO and Micro-Insurance, or you can send your question to our team and they will reply.",
      links: ['quote', 'email']
    }
  };

  var RULES = [
    ['thanks', /\b(thanks|thank you|salamat|ty)\b/],
    ['greet', /^(hi|hello|hey|good (morning|afternoon|evening)|kumusta|hola)\b/],
    ['claim', /\b(claim|claims|file a claim|reimburse)/],
    ['license', /\b(licen[sc]e|accredit|ic number|insurance commission|legit|registered)/],
    ['contact', /\b(contact|email|e-mail|phone|call|number|talk|speak|human|person|agent|someone|representative|viber|whatsapp|messenger)/],
    ['quote', /\b(quote|quotation|price|prices|cost|how much|premium|rate|rates|afford|cheap|apply|sign up|enroll)/],
    ['hmo', /\b(hmo|health|medical|hospital|doctor|dental|check-?up|maxicare|inpatient|outpatient|emergency|senior|family plan)/],
    ['life', /\b(life|term|whole life|critical|illness|estate|key-?person|death|funeral|legacy|retire|education|vul|investment)/],
    ['nonlife', /\b(non-?life|motor|car|vehicle|fleet|fire|property|house|home|building|marine|cargo|liability|travel|accident|business insurance|commercial|ctpl)/],
    ['micro', /\b(micro|embedded|fintech|platform|api|e-?commerce|wallet|loyalty|app)\b/],
    ['where', /\b(where|location|office|address|located|area|serve)/]
  ];

  function answerFor(text) {
    var t = (text || '').toLowerCase().trim();
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][1].test(t)) return REPLIES[RULES[i][0]];
    }
    return REPLIES.fallback;
  }

  /* ---------- styles ---------- */
  var css = [
    '#galchat-btn{position:fixed;right:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:8px;padding:12px 16px;border:0;border-radius:999px;background:linear-gradient(135deg,' + NAVY + ',' + TEAL + ');color:#fff;font:700 13px/1 "Plus Jakarta Sans",system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,43,73,.35);cursor:pointer}',
    '#galchat-btn:focus-visible,#galchat-panel button:focus-visible,#galchat-panel input:focus-visible,#galchat-panel a:focus-visible{outline:3px solid ' + AMBER + ';outline-offset:2px}',
    '#galchat-btn svg{width:18px;height:18px}',
    '#galchat-panel{position:fixed;right:16px;bottom:76px;z-index:2147483001;width:min(380px,calc(100vw - 32px));height:min(540px,calc(100vh - 110px));display:none;flex-direction:column;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 20px 50px rgba(0,27,46,.35);font:14px/1.45 "Plus Jakarta Sans",system-ui,sans-serif;color:#1e293b}',
    '#galchat-panel.open{display:flex}',
    '#galchat-head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:linear-gradient(135deg,' + NAVY + ',' + TEAL + ');color:#fff}',
    '#galchat-head img{width:34px;height:34px;border-radius:8px;background:#fff;padding:2px;object-fit:contain}',
    '#galchat-head b{display:block;font-size:14px}',
    '#galchat-head span{display:block;font-size:11px;opacity:.85}',
    '#galchat-close{margin-left:auto;background:transparent;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:4px 8px}',
    '#galchat-log{flex:1;overflow-y:auto;padding:14px;background:#f1f5f9;display:flex;flex-direction:column;gap:10px}',
    '.galchat-msg{max-width:86%;padding:10px 12px;border-radius:14px;word-wrap:break-word;overflow-wrap:anywhere}',
    '.galchat-bot{align-self:flex-start;background:#fff;border:1px solid #e2e8f0;border-bottom-left-radius:4px}',
    '.galchat-user{align-self:flex-end;background:' + NAVY + ';color:#fff;border-bottom-right-radius:4px}',
    '.galchat-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}',
    '.galchat-links a{display:inline-block;padding:6px 10px;border-radius:999px;background:' + TEAL + ';color:#fff;text-decoration:none;font-weight:700;font-size:12px}',
    '#galchat-chips{display:flex;gap:6px;overflow-x:auto;padding:8px 12px;background:#f1f5f9;border-top:1px solid #e2e8f0}',
    '#galchat-chips button{flex:0 0 auto;padding:6px 11px;border-radius:999px;border:1px solid ' + TEAL + ';background:#fff;color:' + NAVY + ';font:700 12px "Plus Jakarta Sans",system-ui,sans-serif;cursor:pointer}',
    '#galchat-form{display:flex;gap:8px;padding:10px 12px;background:#fff;border-top:1px solid #e2e8f0}',
    '#galchat-input{flex:1;min-width:0;padding:10px 12px;border:1px solid #cbd5e1;border-radius:12px;font:14px "Plus Jakarta Sans",system-ui,sans-serif}',
    '#galchat-send{padding:0 14px;border:0;border-radius:12px;background:' + NAVY + ';color:#fff;font-weight:700;cursor:pointer}',
    '#galchat-note{padding:0 12px 8px;background:#fff;font-size:10.5px;color:#64748b}',
    '@media (prefers-reduced-motion:no-preference){#galchat-panel.open{animation:galchat-in .18s ease-out}}',
    '@keyframes galchat-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- DOM ---------- */
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }

  var btn = el('button', { id: 'galchat-btn', type: 'button', 'aria-label': 'Open chat assistant', 'aria-expanded': 'false', 'aria-controls': 'galchat-panel' });
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>';
  btn.appendChild(el('span', null, 'Chat with us'));

  var panel = el('div', { id: 'galchat-panel', role: 'dialog', 'aria-label': 'Galatians chat assistant' });
  var head = el('div', { id: 'galchat-head' });
  var logo = el('img', { src: 'icon.png', alt: '' });
  logo.addEventListener('error', function () { logo.style.display = 'none'; });
  var title = el('div');
  title.appendChild(el('b', null, 'Galatians Assistant'));
  title.appendChild(el('span', null, 'Virtual assistant'));
  var close = el('button', { id: 'galchat-close', type: 'button', 'aria-label': 'Close chat' }, '×');
  head.appendChild(logo); head.appendChild(title); head.appendChild(close);

  var log = el('div', { id: 'galchat-log', role: 'log', 'aria-live': 'polite' });
  var chips = el('div', { id: 'galchat-chips' });
  var form = el('form', { id: 'galchat-form', autocomplete: 'off' });
  var input = el('input', { id: 'galchat-input', type: 'text', placeholder: 'Type your question...', 'aria-label': 'Type your question', maxlength: '300' });
  var send = el('button', { id: 'galchat-send', type: 'submit' }, 'Send');
  form.appendChild(input); form.appendChild(send);
  var note = el('div', { id: 'galchat-note' }, 'Automated assistant. It gives general information, not personal advice. Coverage details depend on the plan.');

  panel.appendChild(head); panel.appendChild(log); panel.appendChild(chips); panel.appendChild(form); panel.appendChild(note);
  document.body.appendChild(panel);
  document.body.appendChild(btn);

  var CHIPS = [
    ['HMO plans', 'hmo'], ['Life insurance', 'life'], ['Non-Life', 'nonlife'],
    ['Micro-Insurance', 'micro'], ['Get a quote', 'quote'], ['Talk to a person', 'contact']
  ];
  CHIPS.forEach(function (c) {
    var b = el('button', { type: 'button' }, c[0]);
    b.addEventListener('click', function () {
      addUser(c[0]);
      reply(REPLIES[c[1]]);
    });
    chips.appendChild(b);
  });

  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function addUser(text) {
    log.appendChild(el('div', { 'class': 'galchat-msg galchat-user' }, text));
    scrollDown();
  }

  function addBot(r) {
    var m = el('div', { 'class': 'galchat-msg galchat-bot' });
    m.appendChild(el('div', null, r.text));
    if (r.links && r.links.length) {
      var box = el('div', { 'class': 'galchat-links' });
      r.links.forEach(function (key) {
        var L = LINKS[key];
        var href = key === 'quote' ? quoteHref() : L.href;
        var a = el('a', { href: href }, L.label);
        a.addEventListener('click', function () {
          if (href.charAt(0) === '#') closePanel();
        });
        box.appendChild(a);
      });
      m.appendChild(box);
    }
    log.appendChild(m);
    scrollDown();
  }

  function reply(r) { setTimeout(function () { addBot(r); }, 350); }

  function openPanel() {
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    if (!log.childNodes.length) addBot(REPLIES.greet);
    setTimeout(function () { input.focus(); }, 50);
  }
  function closePanel() {
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }

  btn.addEventListener('click', function () {
    if (panel.classList.contains('open')) closePanel(); else openPanel();
  });
  close.addEventListener('click', closePanel);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    addUser(v);
    input.value = '';
    reply(answerFor(v));
  });
})();
