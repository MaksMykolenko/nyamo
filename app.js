/**
 * Nyamo Landing Page Interactive Scripts
 * Features:
 *  - Real-time RecipeMatcher Simulator with dynamic portion calculations & i18n
 *  - Interactive Showcase Tabs
 *  - Accessible FAQ Accordion
 *  - Mobile Navigation Drawer
 *  - Smooth Scrolling & Recipe Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initDirectionSwitcher();
  initNavbarMotion();
  initMobileNav();
  initFaqAccordion();
  initShowcaseTabs();
  initPlayground();
  initScrollReveal();
  initCameraScan();
  initGuidedCooking();
  initFoodDiscovery();
});

/* ==========================================================================
   0. DESIGN SYSTEM INITIALIZATION
   ========================================================================== */
function initDirectionSwitcher() {
  document.body.classList.remove('theme-kinetic', 'theme-minimalist', 'theme-editorial');
  document.body.classList.add('theme-dimension');
}

/* ==========================================================================
   0b. NAVBAR PREMIUM MOTION & ACTIVE PILL MORPH
   ========================================================================== */
function initNavbarMotion() {
  const header = document.getElementById('header');
  const desktopNav = document.getElementById('desktopNav');
  const pill = document.getElementById('navActivePill');
  if (!header || !desktopNav || !pill) return;

  const navLinks = Array.from(desktopNav.querySelectorAll('.nav-link'));
  const sectionIds = ['interactive-demo', 'features', 'recipes', 'faq'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  let activeSectionId = null;
  let hoveredLink = null;
  let lastScrollY = window.scrollY;
  let ticking = false;

  // Measure and position the active pill smoothly
  function movePillTo(link, animate = true) {
    if (!link) {
      pill.style.opacity = '0';
      return;
    }

    const navRect = desktopNav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    const left = linkRect.left - navRect.left;
    const top = linkRect.top - navRect.top;
    const width = linkRect.width;
    const height = linkRect.height;

    if (!animate) {
      pill.style.transition = 'none';
    } else {
      pill.style.transition = '';
    }

    pill.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    pill.style.width = `${width}px`;
    pill.style.height = `${height}px`;
    pill.style.opacity = '1';
  }

  // Update navbar morph, scroll direction, and active section
  function updateScrollState() {
    const currentScrollY = window.scrollY;

    // 1. Scroll Morph (tightens navbar padding, adjusts distance & blur)
    if (currentScrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // 2. Scroll Direction Nudge (subtle 8px shift up when scrolling down past hero, restore on scroll up)
    if (currentScrollY > 200) {
      if (currentScrollY > lastScrollY + 8) {
        header.classList.add('nav-scrolling-down');
      } else if (currentScrollY < lastScrollY - 4) {
        header.classList.remove('nav-scrolling-down');
      }
    } else {
      header.classList.remove('nav-scrolling-down');
    }
    lastScrollY = currentScrollY;

    // 3. Active Section Detection (Scroll spy)
    let currentSection = null;
    const scrollTriggerPoint = window.innerHeight * 0.35;

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= scrollTriggerPoint && rect.bottom >= scrollTriggerPoint) {
        currentSection = sec.id;
      }
    });

    // Camera Scan, Guided Cooking & Food Discovery Section continuity: map to interactive-demo
    const cameraSec = document.getElementById('camera-scan');
    const cookingSec = document.getElementById('cooking-mode');
    const discoverySec = document.getElementById('food-discovery');
    if (!currentSection && (cameraSec || cookingSec || discoverySec)) {
      if (cameraSec) {
        const cRect = cameraSec.getBoundingClientRect();
        if (cRect.top <= scrollTriggerPoint && cRect.bottom >= scrollTriggerPoint) {
          currentSection = 'interactive-demo';
        }
      }
      if (!currentSection && cookingSec) {
        const kRect = cookingSec.getBoundingClientRect();
        if (kRect.top <= scrollTriggerPoint && kRect.bottom >= scrollTriggerPoint) {
          currentSection = 'interactive-demo';
        }
      }
      if (!currentSection && discoverySec) {
        const dRect = discoverySec.getBoundingClientRect();
        if (dRect.top <= scrollTriggerPoint && dRect.bottom >= scrollTriggerPoint) {
          currentSection = 'interactive-demo';
        }
      }
    }

    // End-of-page fallback (FAQ)
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 80) {
      currentSection = 'faq';
    }

    if (currentSection !== activeSectionId) {
      activeSectionId = currentSection;

      navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === activeSectionId);
      });

      if (!hoveredLink) {
        const activeLink = navLinks.find(link => link.getAttribute('href') === `#${activeSectionId}`);
        movePillTo(activeLink);
      }
    } else if (!activeSectionId && !hoveredLink) {
      pill.style.opacity = '0';
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  // Hover Interactions on Nav Links
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      hoveredLink = link;
      movePillTo(link);
    });

    link.addEventListener('click', () => {
      const href = link.getAttribute('href').replace('#', '');
      activeSectionId = href;
      navLinks.forEach(l => l.classList.toggle('active', l === link));
      movePillTo(link);
    });
  });

  desktopNav.addEventListener('mouseleave', () => {
    hoveredLink = null;
    const activeLink = navLinks.find(link => link.getAttribute('href') === `#${activeSectionId}`);
    movePillTo(activeLink);
  });

  // Re-align pill on window resize / orientation change
  window.addEventListener('resize', () => {
    const targetLink = hoveredLink || navLinks.find(link => link.getAttribute('href') === `#${activeSectionId}`);
    if (targetLink) {
      movePillTo(targetLink, false);
    }
  }, { passive: true });

  // Initial layout calculation after fonts/DOM settle
  setTimeout(() => {
    updateScrollState();
  }, 100);
}

/* ==========================================================================
   1. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggle || !mobileDrawer) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   2. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherHeader = otherItem.querySelector('.accordion-header');
        const otherBody = otherItem.querySelector('.accordion-body');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   3. SHOWCASE TABS
   ========================================================================== */
function initShowcaseTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Update button states
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Switch active pane
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetId) {
          pane.classList.add('active');
        }
      });
    });
  });

  // Sub-screen switcher for recipe variants & recommendations
  const subScreenButtons = document.querySelectorAll('.btn-sub-screen');
  subScreenButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentPane = btn.closest('.tab-pane');
      if (!parentPane) return;
      const targetImgPath = btn.getAttribute('data-target-img');
      const phoneImg = parentPane.querySelector('.tab-phone-img');
      if (phoneImg && targetImgPath) {
        phoneImg.style.opacity = '0.3';
        phoneImg.style.transform = 'scale(0.97)';
        setTimeout(() => {
          phoneImg.src = targetImgPath;
          phoneImg.style.opacity = '1';
          phoneImg.style.transform = 'scale(1)';
        }, 150);
      }
      parentPane.querySelectorAll('.btn-sub-screen').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/* ==========================================================================
   4. MULTILINGUAL DATA & RECIPEMATCHER PLAYGROUND
   ========================================================================== */

function getLang() {
  if (typeof NyamoI18n !== 'undefined' && NyamoI18n.getLanguage) {
    return NyamoI18n.getLanguage();
  }
  return 'uk';
}

function i18nText(key, params = {}, fallback = '') {
  if (typeof NyamoI18n !== 'undefined' && NyamoI18n.t) {
    const res = NyamoI18n.t(key, params);
    if (res && res !== key) return res;
  }
  return fallback;
}

function getPluralWord(count, lang) {
  if (lang === 'uk') {
    if (count % 10 === 1 && count % 100 !== 11) return 'страва';
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'страви';
    return 'страв';
  } else if (lang === 'en') {
    return count === 1 ? 'dish' : 'dishes';
  } else {
    return 'yemek';
  }
}

function getPortionWord(count, lang) {
  if (lang === 'uk') {
    if (count % 10 === 1 && count % 100 !== 11) return 'порція';
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'порції';
    return 'порцій';
  } else if (lang === 'en') {
    return count === 1 ? 'portion' : 'portions';
  } else {
    return 'porsiyon';
  }
}

const INGREDIENTS = [
  { id: 'egg', names: { uk: 'Яйця курячі', en: 'Eggs', tr: 'Yumurta' }, emoji: '🥚', category: 'main' },
  { id: 'tomato', names: { uk: 'Помідори', en: 'Tomatoes', tr: 'Domates' }, emoji: '🍅', category: 'main' },
  { id: 'potato', names: { uk: 'Картопля', en: 'Potatoes', tr: 'Patates' }, emoji: '🥔', category: 'main' },
  { id: 'onion', names: { uk: 'Цибуля', en: 'Onions', tr: 'Soğan' }, emoji: '🧅', category: 'main' },
  { id: 'cottage_cheese', names: { uk: 'Кисломолочний сир', en: 'Cottage cheese', tr: 'Lor peyniri' }, emoji: '🧀', category: 'main' },
  { id: 'wheat_flour', names: { uk: 'Борошно', en: 'Flour', tr: 'Un' }, emoji: '🌾', category: 'main' },
  { id: 'hard_cheese', names: { uk: 'Твердий сир', en: 'Cheese', tr: 'Kaşar peyniri' }, emoji: '🧀', category: 'main' },
  { id: 'pasta', names: { uk: 'Макарони', en: 'Pasta', tr: 'Makarna' }, emoji: '🍝', category: 'main' },
  { id: 'chicken_fillet', names: { uk: 'Куряче філе', en: 'Chicken fillet', tr: 'Tavuk fileto' }, emoji: '🍗', category: 'main' },
  { id: 'garlic', names: { uk: 'Часник', en: 'Garlic', tr: 'Sarımsak' }, emoji: '🧄', category: 'spice' },
  { id: 'bell_pepper', names: { uk: 'Болгарський перець', en: 'Bell pepper', tr: 'Dolmalık biber' }, emoji: '🫑', category: 'main' },
  { id: 'sour_cream', names: { uk: 'Сметана', en: 'Sour cream', tr: 'Ekşi krema' }, emoji: '🍶', category: 'main' },
  { id: 'milk', names: { uk: 'Молоко', en: 'Milk', tr: 'Süt' }, emoji: '🥛', category: 'main' },
  { id: 'sunflower_oil', names: { uk: 'Олія', en: 'Vegetable oil', tr: 'Sıvı yağ' }, emoji: '🫒', category: 'spice' },
  { id: 'salt', names: { uk: 'Сіль & перець', en: 'Salt & pepper', tr: 'Tuz & karabiber' }, emoji: '🧂', category: 'spice' }
];

const RECIPES = [
  {
    id: 'scrambled_eggs_tomato',
    image: 'assets/images/dishes/recipe_scrambled_eggs_tomato.webp',
    required: ['egg', 'tomato', 'sunflower_oil', 'salt'],
    optional: ['onion', 'garlic'],
    loc: {
      uk: {
        title: 'Яєчня з помідорами',
        description: 'Швидкий і соковитий сніданок зі свіжими томатами та ароматною пательнею.',
        prepTime: '15 хв',
        equipment: 'Плита',
        portions: {
          2: ['3 курячі яйця', '2 стиглі помідори', '1 ст. л. олії', 'дрібка солі та перцю'],
          4: ['6 курячих яєць', '4 стиглі помідори', '2 ст. л. олії', 'дрібка солі та перцю']
        },
        steps: [
          'Помийте помідори та наріжте їх середніми шматочками.',
          'Розігрійте пательню з олією на середньому вогні.',
          'Обсмажте помідори 2–3 хвилини до легкого розм\'якшення.',
          'Вбийте яйця, посоліть за смаком і смажте 3–4 хвилини до готовності білка.'
        ]
      },
      en: {
        title: 'Scrambled Eggs with Tomatoes',
        description: 'Quick and juicy breakfast with fresh tomatoes in a sizzling pan.',
        prepTime: '15 min',
        equipment: 'Stove',
        portions: {
          2: ['3 eggs', '2 ripe tomatoes', '1 tbsp vegetable oil', 'pinch of salt & pepper'],
          4: ['6 eggs', '4 ripe tomatoes', '2 tbsp vegetable oil', 'pinch of salt & pepper']
        },
        steps: [
          'Wash tomatoes and slice into medium pieces.',
          'Heat skillet with vegetable oil over medium heat.',
          'Sauté tomatoes for 2–3 minutes until soft.',
          'Crack in eggs, season with salt and fry 3–4 minutes until whites set.'
        ]
      },
      tr: {
        title: 'Domatesli Yumurta',
        description: 'Taze domateslerle tavada hızlı ve sulu lezzetli bir kahvaltı.',
        prepTime: '15 dk',
        equipment: 'Ocak',
        portions: {
          2: ['3 yumurta', '2 olgun domates', '1 yemek kaşığı sıvı yağ', 'bir tutam tuz ve karabiber'],
          4: ['6 yumurta', '4 olgun domates', '2 yemek kaşığı sıvı yağ', 'bir tutam tuz ve karabiber']
        },
        steps: [
          'Domatesleri yıkayın ve orta boy dilimleyin.',
          'Tavada sıvı yağı orta ateşte ısıtın.',
          'Domatesleri 2–3 dakika hafifçe yumuşayana kadar soteleyin.',
          'Yumurtaları kırın, tuz ekleyin ve aklar pişene kadar 3–4 dakika pişirin.'
        ]
      }
    }
  },
  {
    id: 'shakshuka',
    image: 'assets/images/dishes/recipe_shakshuka.webp',
    required: ['egg', 'tomato', 'bell_pepper', 'onion', 'sunflower_oil', 'salt'],
    optional: ['garlic'],
    loc: {
      uk: {
        title: 'Ароматна шакшука',
        description: 'Яйця, томлені у насиченому пряному соусі зі стиглих помідорів та болгарського перцю.',
        prepTime: '25 хв',
        equipment: 'Плита',
        portions: {
          2: ['3 яйця', '2 томати', '1 болгарський перець', '1 цибуля', '1 ст. л. олії', 'сіль та спеції'],
          4: ['6 яєць', '4 томати', '2 болгарські перці', '2 цибулі', '2 ст. л. олії', 'сіль та спеції']
        },
        steps: [
          'Дрібно наріжте цибулю, перець та томати.',
          'Обсмажте цибулю та перець 5–7 хв до м\'якості.',
          'Додайте томати, сіль та тушкуйте до утворення густого соусу.',
          'Зробіть ложкою заглиблення, обережно випустіть яйця та готуйте 5 хв під кришкою.'
        ]
      },
      en: {
        title: 'Fragrant Shakshuka',
        description: 'Eggs poached in a spiced, rich sauce of ripe tomatoes and bell peppers.',
        prepTime: '25 min',
        equipment: 'Stove',
        portions: {
          2: ['3 eggs', '2 tomatoes', '1 bell pepper', '1 onion', '1 tbsp oil', 'salt and spices'],
          4: ['6 eggs', '4 tomatoes', '2 bell peppers', '2 onions', '2 tbsp oil', 'salt and spices']
        },
        steps: [
          'Finely dice onion, bell pepper, and tomatoes.',
          'Sauté onion and pepper for 5–7 minutes until tender.',
          'Add tomatoes and salt, simmer into a thick fragrant sauce.',
          'Make wells with a spoon, crack in eggs and cook 5 minutes covered.'
        ]
      },
      tr: {
        title: 'Baharatlı Şakşuka',
        description: 'Olgun domates ve dolmalık biber sosunda pişen nefis poşe yumurtalar.',
        prepTime: '25 dk',
        equipment: 'Ocak',
        portions: {
          2: ['3 yumurta', '2 domates', '1 dolmalık biber', '1 soğan', '1 yemek kaşığı yağ', 'tuz ve baharatlar'],
          4: ['6 yumurta', '4 domates', '2 dolmalık biber', '2 soğan', '2 yemek kaşığı yağ', 'tuz ve baharatlar']
        },
        steps: [
          'Soğan, biber ve domatesleri küp şeklinde doğrayın.',
          'Soğan ve biberi yumuşayana kadar 5–7 dakika soteleyin.',
          'Domates ve tuz ekleyip koyu bir sos oluşana kadar kısık ateşte pişirin.',
          'Kaşıkla yuvalar açıp yumurtaları kırın, kapağı kapalı 5 dakika pişirin.'
        ]
      }
    }
  },
  {
    id: 'deruny',
    image: 'assets/images/dishes/recipe_potato_pancakes_deruny.webp',
    required: ['potato', 'onion', 'egg', 'wheat_flour', 'sunflower_oil', 'salt'],
    optional: ['sour_cream', 'garlic'],
    loc: {
      uk: {
        title: 'Хрусткі деруни',
        description: 'Апетитні золотисті картопляні оладки з хрумкими рум\'яними краями.',
        prepTime: '30 хв',
        equipment: 'Плита',
        portions: {
          2: ['500 г картоплі', '1 цибулина', '1 яйце', '2 ст. л. борошна', 'олія для смаження', 'сіль'],
          4: ['1 кг картоплі', '2 цибулини', '2 яйця', '4 ст. л. борошна', 'олія для смаження', 'сіль']
        },
        steps: [
          'Очистіть картоплю та цибулю, натріть на дрібній тертці.',
          'Злийте зайвий сік, додайте яйце, борошно та сіль, ретельно вимішайте.',
          'Розігрійте олію на пательні та викладайте тісто столовою ложкою.',
          'Обсмажуйте по 3–4 хвилини з кожного боку до красивої скоринки. Подавайте зі сметаною.'
        ]
      },
      en: {
        title: 'Crispy Deruny (Potato Pancakes)',
        description: 'Golden, crispy traditional potato pancakes with lacy browned edges.',
        prepTime: '30 min',
        equipment: 'Stove',
        portions: {
          2: ['500g potatoes', '1 onion', '1 egg', '2 tbsp flour', 'frying oil', 'salt'],
          4: ['1kg potatoes', '2 onions', '2 eggs', '4 tbsp flour', 'frying oil', 'salt']
        },
        steps: [
          'Peel potatoes and onion, finely grate them.',
          'Drain excess liquid, mix with egg, flour and salt.',
          'Heat oil in a skillet and drop spoonfuls of batter.',
          'Fry 3–4 minutes per side until crisp and golden. Serve with sour cream.'
        ]
      },
      tr: {
        title: 'Çıtır Deruny (Patates Mücveri)',
        description: 'Dışı çıtır çıtır, içi yumuşacık altın sarısı patates mücveri.',
        prepTime: '30 dk',
        equipment: 'Ocak',
        portions: {
          2: ['500g patates', '1 soğan', '1 yumurta', '2 yemek kaşığı un', 'kızartma yağı', 'tuz'],
          4: ['1kg patates', '2 soğan', '2 yumurta', '4 yemek kaşığı un', 'kızartma yağı', 'tuz']
        },
        steps: [
          'Patates ve soğanı soyup ince rendeleyin.',
          'Fazla suyunu sıkın, yumurta, un ve tuz ekleyip karıştırın.',
          'Tavada yağı kızdırın ve karışımdan kaşık kaşık tavaya dökün.',
          'Her iki tarafını 3–4 dakika altın sarısı olana kadar kızartın. Ekşi krema ile servis yapın.'
        ]
      }
    }
  },
  {
    id: 'syrnyky',
    image: 'assets/images/dishes/recipe_cottage_cheese_pancakes.webp',
    required: ['cottage_cheese', 'egg', 'wheat_flour', 'sunflower_oil'],
    optional: ['sour_cream'],
    loc: {
      uk: {
        title: 'Домашні сирники',
        description: 'Ніжні всередині та рум\'яні зовні сирники з домашнього кисломолочного сиру.',
        prepTime: '25 хв',
        equipment: 'Плита',
        portions: {
          2: ['350 г кисломолочного сиру', '1 яйце', '50 г борошна', '1 ст. л. олії', 'цукор за смаком'],
          4: ['700 г кисломолочного сиру', '2 яйця', '100 г борошна', '2 ст. л. олії', 'цукор за смаком']
        },
        steps: [
          'У глибокій мисці розімніть кисломолочний сир з яйцем та цукром.',
          'Додайте борошно та замісіть пластичне тісто.',
          'Сформуйте круглі шайбочки та злегка обкачайте в борошні.',
          'Обсмажте на олії по 3 хвилини з кожного боку до рум\'яності.'
        ]
      },
      en: {
        title: 'Homemade Syrnyky (Cottage Cheese Pancakes)',
        description: 'Tender on the inside and delicately golden on the outside.',
        prepTime: '25 min',
        equipment: 'Stove',
        portions: {
          2: ['350g cottage cheese', '1 egg', '50g flour', '1 tbsp oil', 'sugar to taste'],
          4: ['700g cottage cheese', '2 eggs', '100g flour', '2 tbsp oil', 'sugar to taste']
        },
        steps: [
          'Mash cottage cheese with egg and sugar in a bowl.',
          'Add flour and knead into a soft, pliable dough.',
          'Shape into small patties and lightly dust with flour.',
          'Fry in oil for 3 minutes per side until golden. Serve warm.'
        ]
      },
      tr: {
        title: 'Ev Yapımı Sırniki (Lor Peynirli Pankek)',
        description: 'İçi yumuşacık, dışı nar gibi kızarmış geleneksel lor peynirli pankekler.',
        prepTime: '25 dk',
        equipment: 'Ocak',
        portions: {
          2: ['350g lor peyniri', '1 yumurta', '50g un', '1 yemek kaşığı sıvı yağ', 'damak tadına göre şeker'],
          4: ['700g lor peyniri', '2 yumurta', '100g un', '2 yemek kaşığı sıvı yağ', 'damak tadına göre şeker']
        },
        steps: [
          'Bir kasede lor peynirini yumurta ve şeker ile ezin.',
          'Unu ekleyip yumuşak bir hamur yoğurun.',
          'Küçük yuvarlak köfteler yapıp hafifçe una bulayın.',
          'Tavada orta ateşte her iki tarafını 3 dakika kızartın.'
        ]
      }
    }
  },
  {
    id: 'pasta_cheese',
    image: 'assets/images/dishes/recipe_pasta_with_cheese.webp',
    required: ['pasta', 'hard_cheese', 'sunflower_oil', 'salt'],
    optional: ['garlic'],
    loc: {
      uk: {
        title: 'Паста з твердим сиром',
        description: 'Затишна та швидка гаряча паста з тягучим ароматним сиром.',
        prepTime: '20 хв',
        equipment: 'Плита',
        portions: {
          2: ['200 г макаронів', '120 г твердого сиру', '1 ст. л. олії', 'сіль за смаком'],
          4: ['400 г макаронів', '240 г твердого сиру', '2 ст. л. олії', 'сіль за смаком']
        },
        steps: [
          'Відваріть макарони у киплячій підсоленій воді до стану al dente.',
          'Натріть сир на дрібній або середній тертці.',
          'Злийте воду, додайте ложку олії та гарячу пасту змішайте з сиром.',
          'Подавайте відразу, доки сир тане та тягнеться.'
        ]
      },
      en: {
        title: 'Pasta with Melted Cheese',
        description: 'Comforting, quick hot pasta with rich, gooey melted cheese.',
        prepTime: '20 min',
        equipment: 'Stove',
        portions: {
          2: ['200g pasta', '120g cheese', '1 tbsp oil', 'salt to taste'],
          4: ['400g pasta', '240g cheese', '2 tbsp oil', 'salt to taste']
        },
        steps: [
          'Boil pasta in salted boiling water until al dente.',
          'Finely or coarsely grate the cheese.',
          'Drain pasta, toss with oil and immediately fold in cheese.',
          'Serve piping hot while cheese is stretchy and fragrant.'
        ]
      },
      tr: {
        title: 'Eriyen Kaşarlı Makarna',
        description: 'Sıcak, hızlı ve uzayan lezzetli peynirli pratik makarna.',
        prepTime: '20 dk',
        equipment: 'Ocak',
        portions: {
          2: ['200g makarna', '120g kaşar peyniri', '1 yemek kaşığı sıvı yağ', 'tuz'],
          4: ['400g makarna', '240g kaşar peyniri', '2 yemek kaşığı sıvı yağ', 'tuz']
        },
        steps: [
          'Makarnayı tuzlu kaynar suda al dente haşlayın.',
          'Kaşar peynirini rendeleyin.',
          'Makarnayı süzün, yağ ve peynirle karıştırın.',
          'Peynir erirken hemen sıcak servis yapın.'
        ]
      }
    }
  },
  {
    id: 'omelette',
    image: 'assets/images/dishes/recipe_fluffy_milk_omelette.webp',
    required: ['egg', 'milk', 'sunflower_oil', 'salt'],
    optional: ['hard_cheese'],
    loc: {
      uk: {
        title: 'Пишний омлет на молоці',
        description: 'Класичний ніжний сніданок з повітряною текстурою.',
        prepTime: '15 хв',
        equipment: 'Плита',
        portions: {
          2: ['3 яйця', '120 мл молока', '1 ч. л. олії', 'дрібка солі'],
          4: ['6 яєць', '240 мл молока', '1 ст. л. олії', 'дрібка солі']
        },
        steps: [
          'Збийте яйця з молоком і сіллю вінчиком до однорідної піни.',
          'Змастіть пательню олією та розігрійте на середньому вогні.',
          'Вилийте яєчну суміш, накрийте щільною кришкою.',
          'Готуйте на повільному вогні 8–10 хвилин, не відкриваючи кришку.'
        ]
      },
      en: {
        title: 'Fluffy Milk Omelette',
        description: 'A classic breakfast with an airy, cloud-like tender texture.',
        prepTime: '15 min',
        equipment: 'Stove',
        portions: {
          2: ['3 eggs', '120ml milk', '1 tsp oil', 'pinch of salt'],
          4: ['6 eggs', '240ml milk', '1 tbsp oil', 'pinch of salt']
        },
        steps: [
          'Whisk eggs with milk and salt until light and frothy.',
          'Grease skillet with oil and warm over medium heat.',
          'Pour in egg mixture and cover tightly with lid.',
          'Cook on low heat for 8–10 minutes without lifting lid.'
        ]
      },
      tr: {
        title: 'Kabarık Sütlü Omlet',
        description: 'Hafif, yumuşacık ve bulut gibi kabaran klasik bir kahvaltı omleti.',
        prepTime: '15 dk',
        equipment: 'Ocak',
        portions: {
          2: ['3 yumurta', '120ml süt', '1 tatlı kaşığı sıvı yağ', 'bir tutam tuz'],
          4: ['6 yumurta', '240ml süt', '1 yemek kaşığı sıvı yağ', 'bir tutam tuz']
        },
        steps: [
          'Yumurtaları süt ve tuzla köpürene kadar çırpın.',
          'Tavayı hafifçe yağlayıp orta ateşte ısıtın.',
          'Karışımı tavaya döküp kapağını kapatın.',
          'Kısık ateşte kapağını açmadan 8–10 dakika pişirin.'
        ]
      }
    }
  },
  {
    id: 'chicken_fillet',
    image: 'assets/images/dishes/recipe_pan_seared_chicken_fillet.webp',
    required: ['chicken_fillet', 'sunflower_oil', 'salt'],
    optional: ['garlic'],
    loc: {
      uk: {
        title: 'Соковите куряче філе',
        description: 'Апетитна куряча грудка зі спеціями та золотистою скоринкою.',
        prepTime: '20 хв',
        equipment: 'Плита',
        portions: {
          2: ['400 г курячого філе', '1 ст. л. олії', 'сіль та перець за смаком'],
          4: ['800 г курячого філе', '2 ст. л. олії', 'сіль та перець за смаком']
        },
        steps: [
          'Промийте філе, обсушіть і розріжте горизонтально на пластини.',
          'Натріть сіллю, перцем та за бажанням подрібненим часником.',
          'Розігрійте олію та обсмажуйте філе по 3–4 хвилини з кожного боку.',
          'Дайте м\'ясу відпочити 2 хвилини перед нарізкою.'
        ]
      },
      en: {
        title: 'Juicy Pan-Seared Chicken Fillet',
        description: 'Tender chicken breast with savory herbs and a crisp golden crust.',
        prepTime: '20 min',
        equipment: 'Stove',
        portions: {
          2: ['400g chicken fillet', '1 tbsp oil', 'salt & pepper to taste'],
          4: ['800g chicken fillet', '2 tbsp oil', 'salt & pepper to taste']
        },
        steps: [
          'Rinse and dry chicken fillets, slice horizontally into even cutlets.',
          'Rub with salt, pepper, and minced garlic.',
          'Heat oil in pan and sear fillets for 3–4 minutes per side.',
          'Rest meat 2 minutes before carving.'
        ]
      },
      tr: {
        title: 'Tavada Sulu Tavuk Fileto',
        description: 'Baharatlarla lezzetlenmiş, dışı kızarmış sulu tavuk göğsü.',
        prepTime: '20 dk',
        equipment: 'Ocak',
        portions: {
          2: ['400g tavuk fileto', '1 yemek kaşığı sıvı yağ', 'damak tadına göre tuz ve karabiber'],
          4: ['800g tavuk fileto', '2 yemek kaşığı sıvı yağ', 'damak tadına göre tuz ve karabiber']
        },
        steps: [
          'Tavuk filetolarını yıkayıp kurulayın ve enlemesine ikiye kesin.',
          'Tuz, karabiber ve isteğe göre sarımsakla ovalayın.',
          'Tavada yağı kızdırıp her iki tarafını 3–4 dakika pişirin.',
          'Dilimlemeden önce 2 dakika dinlendirin.'
        ]
      }
    }
  },
  {
    id: 'baked_potatoes',
    image: 'assets/images/dishes/recipe_baked_potatoes_garlic.webp',
    required: ['potato', 'garlic', 'sunflower_oil', 'salt'],
    optional: ['sour_cream'],
    loc: {
      uk: {
        title: 'Запечена картопля з часником',
        description: 'Ароматні скибочки картоплі в духовці з рум\'яною скоринкою.',
        prepTime: '40 хв',
        equipment: 'Духовка',
        portions: {
          2: ['500 г картоплі', '3 зубчики часнику', '2 ст. л. олії', 'сіль за смаком'],
          4: ['1 кг картоплі', '6 зубчиків часнику', '3 ст. л. олії', 'сіль за смаком']
        },
        steps: [
          'Ретельно вимийте картоплю та наріжте великими дольками.',
          'Змішайте картоплю з олією, сіллю та подрібненим часником.',
          'Викладіть на деко в один шар і запікайте при 200°C 35–40 хвилин.'
        ]
      },
      en: {
        title: 'Garlic Herb Baked Potatoes',
        description: 'Fragrant golden potato wedges roasted to crispy perfection.',
        prepTime: '40 min',
        equipment: 'Oven',
        portions: {
          2: ['500g potatoes', '3 garlic cloves', '2 tbsp oil', 'salt to taste'],
          4: ['1kg potatoes', '6 garlic cloves', '3 tbsp oil', 'salt to taste']
        },
        steps: [
          'Scrub potatoes clean and cut into wedges.',
          'Toss potato wedges with vegetable oil, salt and minced garlic.',
          'Spread in a single layer on baking sheet and roast at 200°C (400°F) for 35–40 minutes.'
        ]
      },
      tr: {
        title: 'Sarımsaklı Fırın Patates',
        description: 'Fırında nar gibi kızarmış, kokusuyla iştah kabartan sarımsaklı patates dilimleri.',
        prepTime: '40 dk',
        equipment: 'Fırın',
        portions: {
          2: ['500g patates', '3 diş sarımsak', '2 yemek kaşığı sıvı yağ', 'tuz'],
          4: ['1kg patates', '6 diş sarımsak', '3 yemek kaşığı sıvı yağ', 'tuz']
        },
        steps: [
          'Patatesleri iyice yıkayıp elma dilim şeklinde doğrayın.',
          'Sıvı yağ, ezilmiş sarımsak ve tuzla harmanlayın.',
          'Fırın tepsisine tek kat dizip 200°C fırında 35–40 dakika pişirin.'
        ]
      }
    }
  }
];

// Current State
let selectedIngredients = new Set(['egg', 'tomato', 'sunflower_oil', 'salt']);
let currentPortions = 2;
let activeModalRecipe = null;

function getIngredientName(ing, lang) {
  if (ing.names && ing.names[lang]) return ing.names[lang];
  return (ing.names && ing.names.uk) || ing.name || ing.id;
}

function getLocalizedRecipe(recipe, lang) {
  const loc = (recipe.loc && recipe.loc[lang]) ? recipe.loc[lang] : (recipe.loc && recipe.loc.uk ? recipe.loc.uk : {});
  return {
    id: recipe.id,
    image: recipe.image,
    required: recipe.required,
    optional: recipe.optional,
    title: loc.title || recipe.id,
    description: loc.description || '',
    prepTime: loc.prepTime || '',
    equipment: loc.equipment || '',
    portions: loc.portions || {},
    steps: loc.steps || []
  };
}

function initPlayground() {
  renderChips();
  renderResults();
  setupPresets();
  setupPortionsToggle();
  setupModal();

  // Listen for language changes from i18n switcher
  window.onNyamoLanguageChanged = () => {
    renderChips();
    renderResults();
    const modal = document.getElementById('recipeModal');
    if (modal && modal.classList.contains('open') && activeModalRecipe) {
      openRecipeModal(activeModalRecipe);
    }
    if (typeof updateCookingLanguage === 'function') {
      updateCookingLanguage();
    }
  };
}

function renderChips() {
  const container = document.getElementById('chipsContainer');
  if (!container) return;

  const lang = getLang();
  container.innerHTML = '';

  const mainIngs = INGREDIENTS.filter(i => i.category === 'main');
  const spiceIngs = INGREDIENTS.filter(i => i.category === 'spice');

  const groupLabels = {
    uk: { main: '🛒 Продукти в наявності', spice: '🧂 Спеції та запаси (Комора)' },
    en: { main: '🛒 Ingredients available', spice: '🧂 Spices & staples (Pantry)' },
    tr: { main: '🛒 Mevcut malzemeler', spice: '🧂 Baharatlar ve kiler' }
  };
  const curLabels = groupLabels[lang] || groupLabels.uk;

  function createChip(ing) {
    const chip = document.createElement('button');
    chip.className = `ingredient-chip ${selectedIngredients.has(ing.id) ? 'active' : ''}`;
    chip.setAttribute('data-id', ing.id);
    const ingName = getIngredientName(ing, lang);
    chip.innerHTML = `
      <span class="chip-emoji">${ing.emoji}</span>
      <span class="chip-name">${ingName}</span>
      <span class="chip-check">✓</span>
    `;

    chip.addEventListener('click', () => {
      if (selectedIngredients.has(ing.id)) {
        selectedIngredients.delete(ing.id);
      } else {
        selectedIngredients.add(ing.id);
      }
      chip.classList.toggle('active', selectedIngredients.has(ing.id));
      updateSelectedCount();
      renderResults();
    });

    return chip;
  }

  // 1. Ingredients Available Group
  const mainGroup = document.createElement('div');
  mainGroup.className = 'chips-group';
  mainGroup.innerHTML = `<span class="chips-group-heading">${curLabels.main}</span>`;
  const mainSubgrid = document.createElement('div');
  mainSubgrid.className = 'chips-subgrid';
  mainIngs.forEach(ing => mainSubgrid.appendChild(createChip(ing)));
  mainGroup.appendChild(mainSubgrid);
  container.appendChild(mainGroup);

  // 2. Spices & Staples Group
  const spiceGroup = document.createElement('div');
  spiceGroup.className = 'chips-group chips-group-spices';
  spiceGroup.innerHTML = `<span class="chips-group-heading">${curLabels.spice}</span>`;
  const spiceSubgrid = document.createElement('div');
  spiceSubgrid.className = 'chips-subgrid';
  spiceIngs.forEach(ing => spiceSubgrid.appendChild(createChip(ing)));
  spiceGroup.appendChild(spiceSubgrid);
  container.appendChild(spiceGroup);

  updateSelectedCount();
}

function updateSelectedCount() {
  const countEl = document.getElementById('selectedCount');
  if (countEl) {
    const text = i18nText('playground.selectedCount', { n: selectedIngredients.size }, `Вибрано: ${selectedIngredients.size}`);
    countEl.textContent = text;
  }
}

function renderResults() {
  const grid = document.getElementById('matchingRecipesGrid');
  const summaryEl = document.getElementById('resultsSummary');
  if (!grid) return;

  const lang = getLang();
  grid.innerHTML = '';

  // Calculate matching for all recipes
  const evaluatedRecipes = RECIPES.map(rawRecipe => {
    const locRecipe = getLocalizedRecipe(rawRecipe, lang);
    const missing = rawRecipe.required.filter(id => !selectedIngredients.has(id));
    const canCook = missing.length === 0;
    return {
      rawRecipe,
      recipe: locRecipe,
      canCook,
      missingCount: missing.length,
      missingNames: missing.map(id => {
        const found = INGREDIENTS.find(i => i.id === id);
        return found ? getIngredientName(found, lang) : id;
      })
    };
  });

  // Sort: Ready first, then by least missing
  evaluatedRecipes.sort((a, b) => {
    if (a.canCook && !b.canCook) return -1;
    if (!a.canCook && b.canCook) return 1;
    return a.missingCount - b.missingCount;
  });

  const readyCount = evaluatedRecipes.filter(r => r.canCook).length;
  if (summaryEl) {
    if (readyCount > 0) {
      const plural = getPluralWord(readyCount, lang);
      const readyMsg = i18nText('playground.resultsReady', { n: readyCount, plural }, `🟢 Готово до приготування: ${readyCount} ${plural}`);
      summaryEl.innerHTML = `<span style="color: var(--status-green-text); font-weight: 500;">${readyMsg}</span>`;
    } else {
      const emptyMsg = i18nText('playground.resultsEmpty', {}, 'Оберіть інгредієнти вище, щоб побачити відповідні страви');
      summaryEl.textContent = emptyMsg;
    }
  }

  const andMoreText = lang === 'uk' ? ' та ще...' : (lang === 'tr' ? ' ve diğer...' : ' and more...');
  const cardReadyBadge = i18nText('playground.cardReady', {}, 'Є всі інгредієнти');
  const cardReadyDesc = i18nText('playground.cardReadyText', {}, '✓ Усі необхідні продукти є в наявності');
  const btnActionText = i18nText('playground.cardViewRecipe', {}, 'Переглянути рецепт');

  evaluatedRecipes.forEach(({ rawRecipe, recipe, canCook, missingCount, missingNames }, index) => {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.style.animationDelay = `${index * 45}ms`;

    let badgeHtml = '';
    let statusTextHtml = '';

    if (canCook) {
      badgeHtml = `<span class="match-badge status-badge-ready"><span class="badge-check-icon">✓</span> ${cardReadyBadge}</span>`;
      statusTextHtml = `<div class="match-card-ready-text">${cardReadyDesc}</div>`;
    } else {
      const missingList = missingNames.slice(0, 2).join(', ') + (missingNames.length > 2 ? andMoreText : '');
      const missingBadge = i18nText('playground.cardMissing', { n: missingCount }, `Бракує: ${missingCount}`);
      const missingDesc = i18nText('playground.cardMissingText', { items: missingList }, `Бракує: ${missingList}`);
      badgeHtml = `<span class="match-badge status-badge-missing">${missingBadge}</span>`;
      statusTextHtml = `<div class="match-card-missing-text">${missingDesc}</div>`;
    }

    card.innerHTML = `
      <div class="match-card-top">
        <img src="${recipe.image}" alt="${recipe.title}" class="match-card-img" loading="lazy">
        ${badgeHtml}
      </div>
      <div class="match-card-body">
        <h4 class="match-card-title">${recipe.title}</h4>
        <div class="match-card-meta">
          <span>⏱ ${recipe.prepTime}</span>
          <span>•</span>
          <span>🍳 ${recipe.equipment}</span>
        </div>
        ${statusTextHtml}
        <div class="match-card-action">
          <button class="btn-card-action" data-recipe-id="${rawRecipe.id}">
            <span>${btnActionText}</span>
            <span class="card-action-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    `;

    card.querySelector('.btn-card-action').addEventListener('click', () => {
      openRecipeModal(rawRecipe);
    });

    grid.appendChild(card);
  });
}

function setupPresets() {
  const presetButtons = document.querySelectorAll('.preset-btn[data-preset]');
  const resetBtn = document.getElementById('resetIngredients');

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      if (preset === 'breakfast') {
        selectedIngredients = new Set(['egg', 'tomato', 'milk', 'sunflower_oil', 'salt']);
      } else if (preset === 'potato') {
        selectedIngredients = new Set(['potato', 'onion', 'egg', 'wheat_flour', 'sunflower_oil', 'salt', 'sour_cream']);
      } else if (preset === 'pasta') {
        selectedIngredients = new Set(['pasta', 'hard_cheese', 'sunflower_oil', 'salt', 'garlic']);
      }
      renderChips();
      renderResults();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      selectedIngredients.clear();
      renderChips();
      renderResults();
    });
  }
}

function setupPortionsToggle() {
  const portionButtons = document.querySelectorAll('.portion-btn');
  portionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      portionButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPortions = parseInt(btn.getAttribute('data-portions'), 10) || 2;
      // If modal is open, re-render with new portion size
      const modal = document.getElementById('recipeModal');
      if (modal && modal.classList.contains('open') && activeModalRecipe) {
        openRecipeModal(activeModalRecipe);
      }
    });
  });
}

/* ==========================================================================
   5. RECIPE PREVIEW MODAL
   ========================================================================== */
function setupModal() {
  const modal = document.getElementById('recipeModal');
  const closeBtn = document.getElementById('modalClose');
  const backdrop = document.getElementById('modalBackdrop');

  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    activeModalRecipe = null;
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function openRecipeModal(rawRecipe) {
  const modal = document.getElementById('recipeModal');
  const modalBody = document.getElementById('modalBody');
  if (!modal || !modalBody || !rawRecipe) return;

  activeModalRecipe = rawRecipe;
  const lang = getLang();
  const recipe = getLocalizedRecipe(rawRecipe, lang);

  const missing = rawRecipe.required.filter(id => !selectedIngredients.has(id));
  const isReady = missing.length === 0;

  const portionsData = recipe.portions[currentPortions] || recipe.portions[2] || [];
  const ingredientsList = portionsData
    .map(item => `<li><span style="color: var(--color-violet-solid); font-weight: 600; margin-right: 8px;">•</span> ${item}</li>`)
    .join('');

  const stepsList = recipe.steps
    .map((step, idx) => `
      <div style="display: flex; gap: 14px; margin-bottom: 16px;">
        <div style="width: 26px; height: 26px; border-radius: 50%; background: rgba(255, 255, 255, 0.08); border: 1px solid var(--color-hairline); color: var(--color-bone); font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.8rem; font-family: var(--font-mono);">
          ${idx + 1}
        </div>
        <p style="margin: 0; font-size: 0.95rem; line-height: 1.55; color: var(--color-ash);">${step}</p>
      </div>
    `)
    .join('');

  const readyBadgeText = i18nText('modal.readyBadge', {}, '🟢 Можна готувати');
  const missingBadgeText = i18nText('modal.missingBadge', {}, '🔴 Бракує інгредієнтів');
  const portionWord = getPortionWord(currentPortions, lang);
  const portionsHeading = i18nText('modal.portionsHeading', { n: currentPortions, plural: portionWord }, `Інгредієнти на ${currentPortions} ${portionWord}:`);
  const stepsHeading = i18nText('modal.stepsHeading', {}, 'Покроковий процес:');
  const btnCookText = i18nText('modal.btnCook', {}, 'Готувати у додатку Nyamo');

  modalBody.innerHTML = `
    <div style="border-radius: 16px; overflow: hidden; height: 180px; margin-bottom: 20px; border: 1px solid var(--color-hairline);">
      <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
      <div>
        <h3 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 500; margin-bottom: 4px; color: var(--color-bone);">${recipe.title}</h3>
        <p style="font-family: var(--font-heading); font-size: 0.85rem; color: var(--color-ash); margin: 0;">⏱ ${recipe.prepTime} · 🍳 ${recipe.equipment}</p>
      </div>
      <span class="match-badge ${isReady ? 'status-badge-ready' : 'status-badge-missing'}" style="position: static;">
        ${isReady ? readyBadgeText : missingBadgeText}
      </span>
    </div>

    <p style="font-size: 0.95rem; color: var(--color-ash); margin-bottom: 20px; line-height: 1.6;">
      ${recipe.description}
    </p>

    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--color-hairline); border-radius: 16px; padding: 18px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <strong style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 500; color: var(--color-bone);">${portionsHeading}</strong>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem; color: var(--color-ash);">
        ${ingredientsList}
      </ul>
    </div>

    <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 500; color: var(--color-bone); margin-bottom: 16px;">${stepsHeading}</h4>
    <div>
      ${stepsList}
    </div>

    <div style="margin-top: 24px; text-align: center;">
      <a href="#download" class="btn btn-primary btn-block" onclick="document.getElementById('recipeModal').classList.remove('open')">
        ${btnCookText}
      </a>
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

/* ==========================================================================
   SCROLL REVEAL MOTION (Observer for staggered entrance)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-item');
  if (!revealElements.length) return;

  if (typeof IntersectionObserver === 'undefined') {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   CAMERA SCAN SHOWCASE (One-time scan sweep & recipe modal wiring)
   ========================================================================== */
function initCameraScan() {
  const cameraSection = document.getElementById('camera-scan');
  if (!cameraSection) return;

  // 1. Scroll-driven one-time scan sweep
  if (typeof IntersectionObserver === 'undefined') {
    cameraSection.classList.add('is-scanned');
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cameraSection.classList.add('is-scanned');
          obs.unobserve(cameraSection);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(cameraSection);
  }

  // 2. Wire recipe modal preview cards
  const recipeCards = cameraSection.querySelectorAll('[data-open-recipe]');
  recipeCards.forEach(card => {
    card.addEventListener('click', () => {
      const recipeId = card.getAttribute('data-open-recipe');
      const recipe = RECIPES.find(r => r.id === recipeId);
      if (recipe) {
        openRecipeModal(recipe);
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const recipeId = card.getAttribute('data-open-recipe');
        const recipe = RECIPES.find(r => r.id === recipeId);
        if (recipe) {
          openRecipeModal(recipe);
        }
      }
    });
  });
}

/* ==========================================================================
   GUIDED COOKING SHOWCASE (Step transition demo, live timer & parallax)
   ========================================================================== */
let updateCookingLanguage = null;

function initGuidedCooking() {
  const cookingSection = document.getElementById('cooking-mode');
  if (!cookingSection) return;

  const phoneFrame = document.getElementById('cookingPhoneFrame');
  const progressFill = document.getElementById('cookingProgressFill');
  const stepCounter = document.getElementById('cookingStepCounter');
  const instructionText = document.getElementById('cookingInstructionText');
  const timerCircleProgress = document.getElementById('timerCircleProgress');
  const timerTime = document.getElementById('cookingTimerTime');
  const btnBack = document.getElementById('cookingBtnBack');
  const btnNext = document.getElementById('cookingBtnNext');
  const floatStep = document.getElementById('cookingFloatStep');
  const floatStepText = document.getElementById('cookingFloatStepText');
  const floatTimer = document.getElementById('cookingFloatTimer');
  const floatTimerDigits = document.getElementById('cookingFloatTimerDigits');

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let currentStep = 3;
  let hasAutoTransitioned = false;
  let timerSeconds = 342; // 05:42
  let timerInterval = null;

  function renderStep(step, animate = true) {
    currentStep = step;
    const isStep4 = step === 4;

    const stepText = isStep4
      ? i18nText('cooking.step4Text', {}, 'Додай яйця та накрий сковороду.')
      : i18nText('cooking.step3Text', {}, 'Додай помідори та тушкуй 5–7 хвилин на середньому вогні.');

    const stepNumText = isStep4
      ? i18nText('cooking.step4Num', {}, 'Крок 4 з 7')
      : i18nText('cooking.step3Num', {}, 'Крок 3 з 7');

    const floatStepPillText = isStep4
      ? i18nText('cooking.floatingStepNext', {}, 'Крок 4 / 7')
      : i18nText('cooking.floatingStep', {}, 'Крок 3 / 7');

    const progressWidth = isStep4 ? '57%' : '43%';

    if (progressFill) {
      progressFill.style.width = progressWidth;
    }

    if (floatStepText) {
      floatStepText.textContent = floatStepPillText;
    }

    if (stepCounter) {
      stepCounter.textContent = stepNumText;
    }

    if (btnBack) {
      btnBack.style.opacity = isStep4 ? '1' : '0.85';
    }

    if (instructionText) {
      if (animate && !prefersReduced) {
        instructionText.style.transition = 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
        instructionText.style.opacity = '0';
        instructionText.style.transform = 'translateY(6px)';

        setTimeout(() => {
          instructionText.textContent = stepText;
          instructionText.style.opacity = '1';
          instructionText.style.transform = 'translateY(0)';
        }, 220);
      } else {
        instructionText.textContent = stepText;
      }
    }
  }

  updateCookingLanguage = () => {
    renderStep(currentStep, false);
  };

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        const mins = Math.floor(timerSeconds / 60);
        const secs = timerSeconds % 60;
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (timerTime) timerTime.textContent = timeStr;
        if (floatTimerDigits) floatTimerDigits.textContent = timeStr;

        if (timerCircleProgress) {
          const pct = Math.max(0, Math.round((timerSeconds / 342) * 72));
          timerCircleProgress.setAttribute('stroke-dasharray', `${pct}, 100`);
        }
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }, 1000);
  }

  // Interactive manual controls
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      hasAutoTransitioned = true;
      renderStep(4, true);
    });
  }

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      renderStep(3, true);
    });
  }

  // Entrance Observer (runs countdown & single-time step crossfade)
  if (typeof IntersectionObserver === 'undefined' || prefersReduced) {
    startTimer();
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTimer();

          // Single-run step transition demo after ~3s
          if (!hasAutoTransitioned) {
            setTimeout(() => {
              if (!hasAutoTransitioned && currentStep === 3) {
                hasAutoTransitioned = true;
                renderStep(4, true);
              }
            }, 3000);
          }

          obs.unobserve(cookingSection);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(cookingSection);
  }

  // Subtle Scroll Parallax (~15-20px depth)
  if (!prefersReduced && window.innerWidth > 768) {
    let ticking = false;

    function onScrollParallax() {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const rect = cookingSection.getBoundingClientRect();
        const winHeight = window.innerHeight;

        if (rect.top < winHeight && rect.bottom > 0) {
          const sectionCenter = rect.top + rect.height / 2;
          const viewportCenter = winHeight / 2;
          const diff = sectionCenter - viewportCenter;

          const phoneShift = Math.max(-20, Math.min(20, diff * -0.035));
          const pillShift = Math.max(-18, Math.min(18, diff * 0.045));

          if (phoneFrame) {
            phoneFrame.style.transform = `translate3d(0, ${phoneShift}px, 0)`;
          }
          if (floatStep) {
            floatStep.style.transform = `translate3d(0, ${pillShift * 0.8}px, 0)`;
          }
          if (floatTimer) {
            floatTimer.style.transform = `translate3d(0, ${-pillShift}px, 0)`;
          }
        }
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScrollParallax, { passive: true });
  }
}

/* ==========================================================================
   RECIPE DISCOVERY / FOOD MOMENT (Staggered scroll reveal & modal wiring)
   ========================================================================== */
function initFoodDiscovery() {
  const discoverySection = document.getElementById('food-discovery');
  if (!discoverySection) return;

  // 1. Wire recipe modals for cards
  const discoveryCards = discoverySection.querySelectorAll('[data-open-recipe]');
  discoveryCards.forEach(card => {
    card.addEventListener('click', () => {
      const recipeId = card.getAttribute('data-open-recipe');
      const recipe = RECIPES.find(r => r.id === recipeId);
      if (recipe) {
        openRecipeModal(recipe);
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const recipeId = card.getAttribute('data-open-recipe');
        const recipe = RECIPES.find(r => r.id === recipeId);
        if (recipe) {
          openRecipeModal(recipe);
        }
      }
    });
  });

  // 2. Short staggered scroll reveal (~65ms between cards)
  const revealCards = discoverySection.querySelectorAll('.discovery-card.reveal-item, .discovery-quote-card.reveal-item');
  if (!revealCards.length) return;

  if (typeof IntersectionObserver === 'undefined' || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    revealCards.forEach(c => c.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealCards.forEach((card, idx) => {
          setTimeout(() => {
            card.classList.add('is-revealed');
          }, idx * 65);
        });
        obs.unobserve(discoverySection);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  observer.observe(discoverySection);
}
