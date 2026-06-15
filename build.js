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

const CAREER_AREAS = [
  'Accounting and Finance',
  'Aerospace and Aviation',
  'Artificial Intelligence and Technology',
  'Construction and Civil Engineering',
  'Cybersecurity',
  'E-commerce and Logistics',
  'Education and Academia',
  'Event Management and Tourism',
  'Healthcare and Pharmaceuticals',
  'Hospitality and Culinary Arts',
  'Human Resources and Recruitment',
  'Legal and Compliance',
  'Luxury Retail and Fashion',
  'Marine and Shipping',
  'Marketing and Digital Media',
  'Oil, Gas, and Renewable Energy',
  'Real Estate and Property Management',
  'Supply Chain and Procurement',
  'Custom'
];

const DESIGNATIONS = [
  'Academic Advisor',
  'Accounts Payable Specialist',
  'AI/ML Engineer',
  'Automation Engineer',
  'Barista',
  'BIM Manager',
  'Business Development Manager',
  'Buyer',
  'Cashier',
  'Civil Engineer',
  'Cloud Architect',
  'Compliance Officer',
  'Content Strategist',
  'Credit Analyst',
  'Customer Service Agent',
  'Cybersecurity Specialist',
  'Data Analyst',
  'Data Entry Operator',
  'Data Scientist',
  'Delivery Driver',
  'Digital Marketing Specialist',
  'Distribution Manager',
  'E-commerce Manager',
  'Electrical Engineer',
  'Electrician',
  'Email Marketing Specialist',
  'Estimator',
  'Executive Chef',
  'Financial Analyst',
  'Freight Forwarder',
  'Full-Stack Developer',
  'Guest Service Assistant',
  'Healthcare Administrator',
  'Hotel Receptionist',
  'HR Generalist',
  'HR Officer',
  'HVAC Technician',
  'ICU Nurse',
  'Import/Export Specialist',
  'Interior Designer',
  'Inventory Controller',
  'Investment Banker',
  'IT Support Technician',
  'Key Account Manager',
  'Legal Assistant',
  'Logistics Coordinator',
  'Management Accountant',
  'Marketing Coordinator',
  'Mechanical Engineer',
  'Medical Laboratory Technician',
  'Merchandiser',
  'Network Engineer',
  'Office Administrator',
  'Paralegal',
  'Payroll Officer',
  'Performance Marketing Analyst',
  'Pharmacist',
  'Physiotherapist',
  'Procurement Specialist',
  'Product Manager',
  'Project Coordinator',
  'Project Engineer',
  'Project Manager',
  'QA/QC Engineer',
  'Quantity Surveyor',
  'Real Estate Agent',
  'Recruitment Consultant',
  'Renewable Energy Engineer',
  'Retail Sales Associate',
  'Risk Analyst',
  'Sales Coordinator',
  'Site Engineer',
  'Social Media Specialist',
  'Software Developer',
  'Store Manager',
  'Supply Chain Analyst',
  'Talent Acquisition Specialist',
  'Telecaller',
  'Treasury Analyst',
  'UI/UX Designer',
  'Visual Merchandiser',
  'Warehouse Supervisor',
  'Wealth Manager',
  'Custom'
];

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

              <section class="section-cta" id="join-team" style="padding: 100px 0; border-top: 1px solid rgba(255,255,255,0.05);">
                <div class="container container--offset">
                  <div class="reveal" data-revealed="false">
                    <div class="copy-block copy-block--dark">
                      <p class="copy-block__eyebrow eyebrow">Join Our Workforce</p>
                      <h2 class="copy-block__title">Be a part of the workforce with PeopleBrücke.</h2>
                      <div class="copy-block__description">We dissolve barriers between elite talent and visionary enterprises. If you want to work with a team that values human precision and high-touch consultancy, explore our open opportunities and apply to join us.</div>
                      <div style="margin-top: 2.5rem;">
                        <a class="button" href="careers.html" style="background-color: #1B63F2; color: #fff; padding: 14px 32px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: 600; font-size: 15px; transition: background-color 0.2s ease;">Join Our Workforce</a>
                      </div>
                    </div>
                  </div>
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
  const designationOptions = DESIGNATIONS.map((d) => `<option value="${d}">${d}</option>`).join('');
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
            <div>
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
                    <div style="display: flex; gap: 8px;">
                      <select class="careers-form__input careers-form__select" id="phoneCode" name="phoneCode" style="flex: 0 0 110px; min-width: 110px; padding: 12px 8px;" required>
                        <option value="+971" selected>+971 (UAE)</option>
                        <option value="+91">+91 (IN)</option>
                        <option value="+966">+966 (SA)</option>
                        <option value="+965">+965 (KW)</option>
                        <option value="+968">+968 (OM)</option>
                        <option value="+973">+973 (BH)</option>
                        <option value="+974">+974 (QA)</option>
                        <option value="+1">+1 (US/CA)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+65">+65 (SG)</option>
                        <option value="+61">+61 (AU)</option>
                        <option value="+33">+33 (FR)</option>
                        <option value="+49">+49 (DE)</option>
                      </select>
                      <input class="careers-form__input" type="tel" id="phone" name="phone" placeholder="50 123 4567" style="flex: 1;" autocomplete="tel" required>
                    </div>
                    <span class="careers-form__error" data-error-for="phone"></span>
                  </div>
                  <div class="careers-form__field">
                    <label class="careers-form__label" for="city">City <span aria-hidden="true">*</span></label>
                    <input class="careers-form__input" type="text" id="city" name="city" placeholder="e.g. Dubai" required>
                    <span class="careers-form__error" data-error-for="city"></span>
                  </div>
                  <div class="careers-form__field">
                    <label class="careers-form__label" for="country">Country <span aria-hidden="true">*</span></label>
                    <input class="careers-form__input" type="text" id="country" name="country" placeholder="e.g. UAE" required>
                    <span class="careers-form__error" data-error-for="country"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full">
                    <label class="careers-form__label" for="nationality">Nationality <span aria-hidden="true">*</span></label>
                    <input class="careers-form__input" type="text" id="nationality" name="nationality" placeholder="e.g. Emirati, British, Indian" required>
                    <span class="careers-form__error" data-error-for="nationality"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full">
                    <label class="careers-form__label" for="linkedin">LinkedIn <span class="careers-form__optional">(optional)</span></label>
                    <input class="careers-form__input" type="url" id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/..." autocomplete="url">
                    <span class="careers-form__error" data-error-for="linkedin"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full">
                    <label class="careers-form__label" for="designation">Designation <span aria-hidden="true">*</span></label>
                    <div class="careers-form__combobox">
                      <input class="careers-form__input combobox-input" type="text" id="designation" name="designation" placeholder="Select or type your designation" autocomplete="off" required>
                      <div class="combobox-dropdown" id="designation-dropdown" hidden>
                        ${DESIGNATIONS.filter(x => x !== 'Custom').map(d => `<div class="combobox-option" data-value="${d}">${d}</div>`).join('')}
                      </div>
                    </div>
                    <span class="careers-form__error" data-error-for="designation"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full">
                    <label class="careers-form__label" for="area">Area of interest <span aria-hidden="true">*</span></label>
                    <div class="careers-form__combobox">
                      <input class="careers-form__input combobox-input" type="text" id="area" name="area" placeholder="Select or type your area of interest" autocomplete="off" required>
                      <div class="combobox-dropdown" id="area-dropdown" hidden>
                        ${CAREER_AREAS.filter(x => x !== 'Custom').map(a => `<div class="combobox-option" data-value="${a}">${a}</div>`).join('')}
                      </div>
                    </div>
                    <span class="careers-form__error" data-error-for="area"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full">
                    <label class="careers-form__label" for="experience">Years of experience <span aria-hidden="true">*</span></label>
                    <select class="careers-form__input careers-form__select" id="experience" name="experience" required>
                      <option value="" disabled selected>Select experience</option>
                      ${expOptions}
                    </select>
                    <span class="careers-form__error" data-error-for="experience"></span>
                  </div>
                  <div class="careers-form__field careers-form__field--full">
                    <label class="careers-form__label" for="message">Remarks <span class="careers-form__optional">(optional)</span></label>
                    <textarea class="careers-form__input careers-form__textarea" id="message" name="message" rows="5"></textarea>
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
