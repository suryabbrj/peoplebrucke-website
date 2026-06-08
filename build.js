const fs = require('fs');

const BRAND = {
  name: 'PeopleBrücke',
  shortName: 'People Brücke',
  tagline: 'Restoring recruitment, one hire at a time',
  domain: 'peoplebrucke.com',
  year: 2026,
  themeColor: '#1B63F2',
  logo: {
    style: 'wordmark',
    imageSrc: 'assets/images/logo.svg',
    wordmarkPrimary: 'People',
    wordmarkAccent: 'Brücke',
  },
};

const HERO_SRC = 'assets/images/hero-bg.jpg';

const NAV = [
  { label: 'Home', href: 'index.html', page: 'Home' },
  { label: 'Mission', href: 'index.html#mission', page: 'Mission' },
  { label: 'The Problem', href: 'index.html#problem', page: 'Problem' },
  { label: 'Process', href: 'index.html#process', page: 'Process' },
  { label: 'Careers', href: 'careers.html', page: 'Careers' },
  { label: 'Contact', href: 'index.html#contact', page: 'Contact' },
];

const metrics = [
  {
    stat: '74%',
    label: 'Regret Rate',
    desc: '74% of employers admit to making a bad hire due to rushed, automated screening. We focus on "regret-free" placements, securing the 26% of candidates who stay and perform.',
  },
  {
    stat: '300%',
    label: 'Replacement Cost',
    desc: 'Replacing a bad hire costs up to 3x their annual salary in lost productivity and training. We stop the "qualified stranger" cycle by prioritizing cultural vision over keywords.',
  },
  {
    stat: '66%',
    label: 'Backlash Rate',
    desc: '66% of elite talent avoid applications where AI is the primary gatekeeper. Our human-led approach unlocks the elite passive talent pool that algorithms alienate.',
  },
];

const processSteps = [
  { num: '01', title: 'High-Fidelity Vetting', desc: 'We replace keyword matching with deep-dive behavioral interviews to ensure technical and cultural synergy.' },
  { num: '02', title: 'Passive Talent Access', desc: "We reach the top 15% of professionals who aren't on job boards and refuse to be filtered by AI." },
  { num: '03', title: 'Regional Intelligence', desc: 'Our extensive ground-level expertise in the India-UAE corridor navigates nuances that data models miss.' },
  { num: '04', title: 'Retention-First Focus', desc: 'While others celebrate the "handshake," we measure our success by the "anniversary"—prioritizing longevity over speed.' },
];

const services = [
  { label: 'People Strategy', img: 'brand' },
  { label: 'Leadership Development', img: 'commerce' },
  { label: 'Organisational Design', img: 'websites' },
];

const workItems = [
  {
    title: 'National Talent Programme',
    color: '#1B63F2',
    desc: 'A comprehensive workforce and leadership strategy that strengthened organisational capability and employee experience across the UAE.',
    cats: ['People Strategy', 'Leadership Development', 'Organisational Design', 'Culture Transformation'],
  },
];

const engagements = [
  { title: 'Government Entity', type: 'Organisational Design', desc: 'We partnered with a leading government organisation in the UAE to redesign structures, clarify roles and build leadership capability for a new era of public service delivery.' },
  { title: 'Financial Services Group', type: 'Leadership Development / Executive Coaching', desc: 'We supported a regional financial institution to develop its senior leadership bench, align culture with strategy and accelerate performance across the GCC.' },
  { title: 'Hospitality & Retail Group', type: 'People Strategy / Talent Advisory', desc: 'We worked with a major UAE hospitality and retail group to define talent strategy, improve retention and create people experiences that reflect their brand on the ground.' },
];

const CAREER_AREAS = ['Recruitment', 'Consultancy', 'Operations', 'Business Development', 'Other'];
const EXPERIENCE_YEARS = ['0–1 years', '2–4 years', '5–7 years', '8–12 years', '12+ years'];

function logoMarkup() {
  const { logo } = BRAND;
  if (logo.style === 'image') {
    return `<img class="site-header__logo-image" src="${logo.imageSrc}" width="119" height="119" alt="" aria-hidden="true">`;
  }
  return `<span class="site-header__logo-wordmark" aria-hidden="true"><span class="site-header__logo-wordmark-primary">${logo.wordmarkPrimary}</span><span class="site-header__logo-wordmark-accent">${logo.wordmarkAccent}</span></span>`;
}

function navForPage(activePage) {
  return NAV.map((n) => ({
    ...n,
    active: n.page === activePage,
  }));
}

function navItems(items, sticky = false) {
  const cls = sticky ? 'site-header__menu-sticky' : 'site-header__menu';
  const menuFooter = sticky ? '' : `
        <div class="site-header__menu-footer">
          <p>&copy;${BRAND.year} ${BRAND.name}</p>
        </div>`;
  return `<div class="${cls}">${items.map((n) => `
    <div class="site-header__menu-item${n.active ? ' active' : ''}" data-to-page="${n.page}">
      <a class="link link--underline" href="${n.href}"${n.active ? ' aria-current="page"' : ''}>${n.label}</a>
    </div>`).join('')}${menuFooter}
  </div>`;
}

function headerBlock(activePage) {
  const items = navForPage(activePage);
  return `<div class="site-header">
  <div class="site-header__menu-bar">
    <div class="container-fluid">
      <div class="site-header__container">
        <div class="site-header__logo">
          <div class="component-logo component-logo--white">
            <a class="link link--white no-hover" aria-label="${BRAND.name}" href="index.html">${logoMarkup()}</a>
          </div>
        </div>
        <button type="button" aria-label="Main nav menu open" class="site-header__menu-toggle"><div></div><div></div></button>
        ${navItems(items)}
      </div>
    </div>
  </div>
  <div class="site-header__menu-bar-sticky">
    <div class="site-header__bg"></div>
    <div class="container-fluid">
      <div class="site-header__container">
        <div class="site-header__logo">
          <div class="component-logo component-logo--white">
            <a class="link link--white no-hover" aria-label="${BRAND.name}" href="index.html">${logoMarkup()}</a>
          </div>
        </div>
        <button type="button" aria-label="Sticky nav menu open" class="site-header__menu-toggle"><div></div><div></div></button>
        ${navItems(items, true)}
      </div>
    </div>
  </div>
</div>`;
}

function footerSecondaryLinks() {
  const socials = [
    { href: 'https://www.instagram.com/peoplebrucke', label: 'Instagram', external: true },
    { href: 'https://www.linkedin.com/company/peoplebrucke', label: 'LinkedIn', external: true },
    { href: '#', label: 'Facebook', external: false },
    { href: '#', label: 'Twitter', external: false },
  ];
  const socialMarkup = socials.map((s, i) => {
    const link = `<a href="${s.href}"${s.external ? ' rel="noreferrer" target="_blank"' : ''}>${s.label}</a>`;
    return i === 0 ? link : `<span class="site-footer__sep" aria-hidden="true">·</span>${link}`;
  }).join('');

  return `<ul class="site-footer__secondary-links">
            <li class="site-footer__copyright">&copy;${BRAND.year} ${BRAND.name}</li>
            <li class="site-footer__socials">${socialMarkup}</li>
            <li class="site-footer__legal"><a class="link" href="#">Privacy</a><span class="site-footer__sep" aria-hidden="true">·</span><a class="link" href="#">Terms</a></li>
          </ul>`;
}

function footerBlock() {
  return `<div class="site-footer__spacer" id="footer-spacer"></div>
    <footer class="site-footer color-white site-footer--contact" id="contact">
      <div class="container container--offset">
        <div class="site-footer__main-content">
          <ul class="site-footer__locations">
            <li class="site-footer__location"><h3>UAE</h3><address>Regional Operations</address></li>
            <li class="site-footer__location"><h3>Corridor</h3><address>India-UAE Market Corridor</address></li>
          </ul>
          <ul class="site-footer__contact">
            <li class="site-footer__contact-item">
              <div class="eyebrow">Contact</div>
              <p><a href="mailto:enquiry@${BRAND.domain}">enquiry@${BRAND.domain}</a></p>
              <p><a href="tel:+971561621021">+971 56 162 1021</a></p>
              <p><a href="https://www.${BRAND.domain}" rel="noreferrer" target="_blank">www.${BRAND.domain}</a></p>
            </li>
            <li class="site-footer__contact-item" id="careers">
              <div class="eyebrow">Careers</div>
              <p><a href="careers.html">Apply to join our team</a></p>
              <p><a href="mailto:careers@${BRAND.domain}">careers@${BRAND.domain}</a></p>
            </li>
          </ul>
          ${footerSecondaryLinks()}
        </div>
      </div>
    </footer>`;
}

function head({ title, description, page }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:url" content="https://www.${BRAND.domain}">
  <meta property="og:title" content="${BRAND.name}">
  <meta property="og:description" content="${description}">
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="stylesheet" href="/css/overrides.css">
  <link rel="stylesheet" href="/css/mobile.css">
  <meta name="theme-color" content="${BRAND.themeColor}">
</head>
<body data-page="${page}" data-header-theme="light" id="top">`;
}

function pageShell({ title, description, page, mainContent, extraScripts = '' }) {
  return `${head({ title, description, page })}
  <div class="layout layout-default">
    ${headerBlock(page)}
    <main>
      ${mainContent}
    </main>
    ${footerBlock()}
  </div>
  <script src="/js/main.js"></script>${extraScripts}
</body>
</html>`;
}

function homeMainContent() {
  return `<div class="tl-edges">
        <div class="tl-wrapper tl-wrapper--mount tl-wrapper-status--entered">
          <div class="page-home">
            <div class="page-mask">
              <section class="hero">
                <div class="hero__fade-trigger"><span style="font-size:0"></span></div>
                <div class="hero__content-wrap">
                  <img class="hero__video" src="${HERO_SRC}" alt="" loading="eager" fetchpriority="high">
                  <div class="hero__overlay"></div>
                </div>
                <div class="hero__text">
                  <div class="container container--offset">
                    <div class="reveal" data-revealed="false">
                      <div class="hero__text-content">
                        <div class="copy-block copy-block--dark">
                          <h2 class="copy-block__title h1-med hero__headline">Restoring recruitment, one hire at a time.</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="section-mission section--light" id="mission">
                <div class="container container--offset">
                  <div class="reveal" data-revealed="false">
                    <div class="copy-block copy-block--light">
                      <p class="copy-block__eyebrow eyebrow">Our Mission</p>
                      <h2 class="copy-block__title">Dissolving barriers between elite talent and visionary enterprises.</h2>
                      <div class="copy-block__description">We specialize in building sustainable professional bridges through high-touch consultancy, ensuring that every placement is a catalyst for long-term organizational growth and individual career excellence.</div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="section-problem section--light" id="problem">
                <div class="container container--offset">
                  <div class="section-problem__intro reveal" data-revealed="false">
                    <div class="copy-block copy-block--light">
                      <p class="copy-block__eyebrow eyebrow">The Market Crisis</p>
                      <h2 class="copy-block__title">The "Algorithm Gap" where talent gets lost in the machine.</h2>
                      <div class="copy-block__description">Modern hiring favors keyword speed over cultural fit, creating 'qualified strangers' who drive up turnover. AI is flooding HR with unvetted applications. In a crowded global market, businesses need a precise, high-touch filter to secure talent that actually stays and scales.</div>
                    </div>
                  </div>
                  <div class="metric-grid reveal" data-revealed="false">
                    ${metrics.map((m) => `
                    <article class="metric-card">
                      <p class="metric-card__stat">${m.stat}</p>
                      <h3 class="metric-card__label">${m.label}</h3>
                      <p class="metric-card__desc">${m.desc}</p>
                    </article>`).join('')}
                  </div>
                </div>
              </section>

              <section class="section-process" id="process">
                <div class="container container--offset">
                  <div class="section-process__heading">
                    <div class="reveal" data-revealed="false">
                      <div class="copy-block copy-block--dark">
                        <p class="copy-block__eyebrow eyebrow">Our Process</p>
                        <h2 class="copy-block__title">High-Fidelity Vetting</h2>
                        <div class="copy-block__description">In an era of automated noise, precision is the only sustainable competitive advantage.</div>
                      </div>
                    </div>
                  </div>
                  <div class="process-grid reveal" data-revealed="false">
                    ${processSteps.map((step) => `
                    <article class="process-card">
                      <span class="process-card__num">${step.num}</span>
                      <h3 class="process-card__title">${step.title}</h3>
                      <p class="process-card__desc">${step.desc}</p>
                    </article>`).join('')}
                  </div>
                </div>
              </section>

              <section class="section-philosophy">
                <div class="container container--offset">
                  <div class="reveal" data-revealed="false">
                    <blockquote class="philosophy-callout">
                      <p class="philosophy-callout__quote">"Bridging the gap between automated volume and human precision to build teams that don't just fit—they stay."</p>
                      <cite class="philosophy-callout__cite">~ The Peoplebrücke Solution</cite>
                    </blockquote>
                  </div>
                </div>
              </section>

              <section class="featured-services" id="services">
                <div class="container container--offset">
                  <div class="featured-services__heading">
                    <div>
                      <div class="reveal" data-revealed="false">
                        <div class="copy-block">
                          <p class="copy-block__eyebrow eyebrow">Our Focus</p>
                          <h2 class="copy-block__title">Connected People Experiences.</h2>
                          <div class="copy-block__description">We help organisations navigate the critical phases of people and organisational development — and build cultures, capabilities and structures that create value across the entire employee journey.</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="reveal" data-revealed="false">
                        <div class="numbered-list">
                          <ul>
                            <li><span>01.</span>People Strategy</li>
                            <li><span>02.</span>Organisational Transformation</li>
                            <li><span>03.</span>Leadership Excellence</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="reveal" data-revealed="false">
                    <div class="three-up-grid three-up-grid--dark three-up-grid--image">
                      <div class="three-up-grid__items">
                        ${services.map((s) => `
                        <div class="three-up-grid__item">
                          <a class="link three-up-grid__item-link" href="#">
                            <div class="three-up-grid__item-image">
                              <img class="image" alt="${s.label}" src="assets/images/services/${s.img}.svg" data-media="true" loading="lazy">
                            </div>
                            <span class="three-up-grid__item-link-label">${s.label}</span>
                          </a>
                        </div>`).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="featured-work">
                <div class="container container--offset">
                  <div class="featured-work__heading">
                    <div class="reveal" data-revealed="false">
                      <div class="copy-block copy-block--dark">
                        <p class="copy-block__eyebrow eyebrow">Featured Work</p>
                        <h2 class="copy-block__title">Strengthening organisations and elevating people across the region.</h2>
                      </div>
                    </div>
                  </div>
                  <ul class="featured-work__items">
                    ${workItems.map((w, i) => `
                    <li class="featured-work__item" data-scrollcolor="${w.color}">
                      <div class="featured-work__item-media">
                        <img class="image" alt="${w.title}" src="assets/images/work/work-${i + 1}.svg" data-media="true" loading="lazy">
                      </div>
                      <div class="featured-work__item-content">
                        <div><p class="featured-work__item-title">${w.title}</p></div>
                        <div><p class="featured-work__item-description">${w.desc}</p></div>
                        <div><ul class="featured-work__item-categories">${w.cats.map((c) => `<li>${c}</li>`).join('')}</ul></div>
                      </div>
                    </li>`).join('')}
                  </ul>
                </div>
              </section>

              <section class="featured-engagements section--light" id="insights">
                <div class="container container--offset">
                  <div class="featured-engagements__heading">
                    <div class="reveal" data-revealed="false">
                      <div class="copy-block">
                        <p class="copy-block__eyebrow eyebrow">Featured Engagements</p>
                        <h2 class="copy-block__title h4">Our collaborative approach turns clients into partners and engagements into lasting impact.</h2>
                      </div>
                    </div>
                  </div>
                  <div class="reveal" data-revealed="false">
                    <div class="three-up-grid three-up-grid--light">
                      <div class="three-up-grid__items">
                        ${engagements.map((e, i) => `
                        <div class="three-up-grid__item">
                          <div class="three-up-grid__item-content">
                            <div class="three-up-grid__item-logo">
                              <img class="image" alt="${e.title}" src="assets/images/engagements/client-${i + 1}.svg" loading="lazy">
                            </div>
                            <div class="three-up-grid__item-title">${e.title}</div>
                            <div class="three-up-grid__item-description">${e.type}\n${e.desc}</div>
                          </div>
                        </div>`).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>`;
}

function careersMainContent() {
  const areaOptions = CAREER_AREAS.map((a) => `<option value="${a}">${a}</option>`).join('');
  const expOptions = EXPERIENCE_YEARS.map((y) => `<option value="${y}">${y}</option>`).join('');

  return `<div class="page-careers">
        <section class="hero hero--careers">
          <div class="hero__content-wrap">
            <img class="hero__video" src="${HERO_SRC}" alt="" loading="eager" fetchpriority="high">
            <div class="hero__overlay"></div>
          </div>
          <div class="hero__text">
            <div class="container container--offset">
              <div class="reveal" data-revealed="false">
                <div class="hero__text-content">
                  <div class="copy-block copy-block--dark">
                    <p class="copy-block__eyebrow eyebrow">Careers</p>
                    <h1 class="copy-block__title hero__headline">Join PeopleBrücke</h1>
                    <div class="copy-block__description">We are building a team of sharp, human-centred professionals who believe recruitment is a craft — not a conveyor belt. If that resonates, we would like to hear from you.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="section-careers-form section--light">
          <div class="container container--offset">
            <div class="reveal" data-revealed="false">
              <form class="careers-form" id="careers-form" action="/api/careers" method="post" enctype="multipart/form-data" novalidate>
                <div class="careers-form__status" id="careers-form-status" role="status" aria-live="polite" hidden>
                  <p class="careers-form__status-message" id="careers-form-status-message"></p>
                  <button type="button" class="careers-form__submit-another" id="careers-submit-another" hidden>Submit another application</button>
                </div>

                <div class="careers-form__grid">
                  <div class="careers-form__field">
                    <label class="careers-form__label" for="firstName">First name <span aria-hidden="true">*</span></label>
                    <input class="careers-form__input" type="text" id="firstName" name="firstName" autocomplete="given-name" required>
                    <span class="careers-form__error" data-error-for="firstName"></span>
                  </div>
                  <div class="careers-form__field">
                    <label class="careers-form__label" for="lastName">Last name <span aria-hidden="true">*</span></label>
                    <input class="careers-form__input" type="text" id="lastName" name="lastName" autocomplete="family-name" required>
                    <span class="careers-form__error" data-error-for="lastName"></span>
                  </div>
                  <div class="careers-form__field">
                    <label class="careers-form__label" for="email">Email <span aria-hidden="true">*</span></label>
                    <input class="careers-form__input" type="email" id="email" name="email" autocomplete="email" required>
                    <span class="careers-form__error" data-error-for="email"></span>
                  </div>
                  <div class="careers-form__field">
                    <label class="careers-form__label" for="phone">Phone <span aria-hidden="true">*</span></label>
                    <input class="careers-form__input" type="tel" id="phone" name="phone" autocomplete="tel" required>
                    <span class="careers-form__error" data-error-for="phone"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full">
                    <label class="careers-form__label" for="location">Location <span aria-hidden="true">*</span></label>
                    <input class="careers-form__input" type="text" id="location" name="location" placeholder="City, country" autocomplete="address-level2" required>
                    <span class="careers-form__error" data-error-for="location"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full">
                    <label class="careers-form__label" for="linkedin">LinkedIn <span class="careers-form__optional">(optional)</span></label>
                    <input class="careers-form__input" type="url" id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/..." autocomplete="url">
                    <span class="careers-form__error" data-error-for="linkedin"></span>
                  </div>
                  <div class="careers-form__field">
                    <label class="careers-form__label" for="area">Area of interest <span aria-hidden="true">*</span></label>
                    <select class="careers-form__input careers-form__select" id="area" name="area" required>
                      <option value="" disabled selected>Select an area</option>
                      ${areaOptions}
                    </select>
                    <span class="careers-form__error" data-error-for="area"></span>
                  </div>
                  <div class="careers-form__field">
                    <label class="careers-form__label" for="experience">Years of experience <span aria-hidden="true">*</span></label>
                    <select class="careers-form__input careers-form__select" id="experience" name="experience" required>
                      <option value="" disabled selected>Select experience</option>
                      ${expOptions}
                    </select>
                    <span class="careers-form__error" data-error-for="experience"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full">
                    <label class="careers-form__label" for="message">Why PeopleBrücke? <span aria-hidden="true">*</span></label>
                    <textarea class="careers-form__input careers-form__textarea" id="message" name="message" rows="5" required></textarea>
                    <span class="careers-form__error" data-error-for="message"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full">
                    <label class="careers-form__label" for="resume">Resume <span aria-hidden="true">*</span></label>
                    <div class="careers-form__dropzone" id="resume-dropzone">
                      <input class="careers-form__file" type="file" id="resume" name="resume" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required>
                      <p class="careers-form__dropzone-text">Drag and drop your resume here, or <span>browse files</span></p>
                      <p class="careers-form__dropzone-hint">PDF, DOC, or DOCX — max 5 MB</p>
                      <p class="careers-form__file-name" id="resume-file-name" hidden></p>
                    </div>
                    <span class="careers-form__error" data-error-for="resume"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full careers-form__field--consent">
                    <label class="careers-form__checkbox-label">
                      <input class="careers-form__checkbox" type="checkbox" id="consent" name="consent" value="yes" required>
                      <span>I consent to PeopleBrücke processing my application and contacting me about this opportunity. <span aria-hidden="true">*</span></span>
                    </label>
                    <span class="careers-form__error" data-error-for="consent"></span>
                  </div>
                </div>

                <input type="text" name="website" class="careers-form__honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">

                <div class="careers-form__actions">
                  <button class="careers-form__submit" type="submit" id="careers-submit">
                    <span class="careers-form__submit-text">Submit application</span>
                    <span class="careers-form__submit-loading" hidden>Sending…</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>`;
}

const indexHtml = pageShell({
  title: `${BRAND.name} | ${BRAND.tagline}`,
  description: `${BRAND.name} — ${BRAND.tagline}. High-touch recruitment and talent consultancy across the UAE and India-UAE corridor.`,
  page: 'Home',
  mainContent: homeMainContent(),
});

const careersHtml = pageShell({
  title: `Careers | ${BRAND.name}`,
  description: `Apply to join ${BRAND.name}. Submit your application and resume to be part of our human-centred recruitment team.`,
  page: 'Careers',
  mainContent: careersMainContent(),
  extraScripts: '\n  <script src="/js/careers.js"></script>',
});

fs.writeFileSync('index.html', indexHtml);
fs.writeFileSync('careers.html', careersHtml);
console.log('Built index.html and careers.html for', BRAND.name);
