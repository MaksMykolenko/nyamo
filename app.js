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
  initPlayground();
  initScrollReveal();
  initCameraScan();
  initGuidedCooking();
  initFoodDiscovery();
  initHeroPinnedTransition();
  initSceneAtmosphere();
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
  const sectionIds = ['interactive-demo', 'features', 'food-discovery', 'faq'];
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

    // Camera Scan & Guided Cooking continuity: map to interactive-demo
    const cameraSec = document.getElementById('camera-scan');
    const cookingSec = document.getElementById('cooking-mode');
    if (!currentSection && (cameraSec || cookingSec)) {
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
  } else if (lang === 'pl') {
    if (count === 1) return 'danie';
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'dania';
    return 'dań';
  } else {
    return count === 1 ? 'dish' : 'dishes';
  }
}

function getPortionWord(count, lang) {
  if (lang === 'uk') {
    if (count % 10 === 1 && count % 100 !== 11) return 'порція';
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'порції';
    return 'порцій';
  } else if (lang === 'pl') {
    if (count === 1) return 'porcja';
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'porcje';
    return 'porcji';
  } else {
    return count === 1 ? 'portion' : 'portions';
  }
}

const INGREDIENTS = [
  { id: 'egg', names: { uk: 'Яйця курячі', pl: 'Jajka kurze', en: 'Eggs' }, emoji: '🥚', category: 'main' },
  { id: 'tomato', names: { uk: 'Помідори', pl: 'Pomidory', en: 'Tomatoes' }, emoji: '🍅', category: 'main' },
  { id: 'potato', names: { uk: 'Картопля', pl: 'Ziemniaki', en: 'Potatoes' }, emoji: '🥔', category: 'main' },
  { id: 'onion', names: { uk: 'Цибуля', pl: 'Cebula', en: 'Onions' }, emoji: '🧅', category: 'main' },
  { id: 'cottage_cheese', names: { uk: 'Кисломолочний сир', pl: 'Twaróg', en: 'Cottage cheese' }, emoji: '🧀', category: 'main' },
  { id: 'wheat_flour', names: { uk: 'Борошно', pl: 'Mąka pszenna', en: 'Flour' }, emoji: '🌾', category: 'main' },
  { id: 'hard_cheese', names: { uk: 'Твердий сир', pl: 'Ser żółty', en: 'Cheese' }, emoji: '🧀', category: 'main' },
  { id: 'pasta', names: { uk: 'Макарони', pl: 'Makaron', en: 'Pasta' }, emoji: '🍝', category: 'main' },
  { id: 'chicken_fillet', names: { uk: 'Куряче філе', pl: 'Filet z kurczaka', en: 'Chicken fillet' }, emoji: '🍗', category: 'main' },
  { id: 'garlic', names: { uk: 'Часник', pl: 'Czosnek', en: 'Garlic' }, emoji: '🧄', category: 'spice' },
  { id: 'bell_pepper', names: { uk: 'Болгарський перець', pl: 'Papryka', en: 'Bell pepper' }, emoji: '🫑', category: 'main' },
  { id: 'sour_cream', names: { uk: 'Сметана', pl: 'Śmietana', en: 'Sour cream' }, emoji: '🍶', category: 'main' },
  { id: 'milk', names: { uk: 'Молоко', pl: 'Mleko', en: 'Milk' }, emoji: '🥛', category: 'main' },
  { id: 'sunflower_oil', names: { uk: 'Олія', pl: 'Olej', en: 'Vegetable oil' }, emoji: '🫒', category: 'spice' },
  { id: 'salt', names: { uk: 'Сіль & перець', pl: 'Sól i pieprz', en: 'Salt & pepper' }, emoji: '🧂', category: 'spice' }
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
      pl: {
        title: 'Jajecznica z pomidorami',
        description: 'Szybkie i soczyste śniadanie ze świeżymi pomidorami z patelni.',
        prepTime: '15 min',
        equipment: 'Kuchenka',
        portions: {
          2: ['3 jajka', '2 dojrzałe pomidory', '1 łyżka oleju', 'szczypta soli i pieprzu'],
          4: ['6 jajek', '4 dojrzałe pomidory', '2 łyżki oleju', 'szczypta soli i pieprzu']
        },
        steps: [
          'Umyj pomidory i pokrój na średnie kawałki.',
          'Rozgrzej patelnię z olejem na średnim ogniu.',
          'Podsmażaj pomidory przez 2–3 minuty, aż lekko zmiękną.',
          'Wbij jajka, dopraw solą i smaż 3–4 minuty do ścięcia białek.'
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
      pl: {
        title: 'Aromatyczna szakszuka',
        description: 'Jajka duszone w aromatycznym sosie ze świeżych pomidorów i papryki.',
        prepTime: '25 min',
        equipment: 'Kuchenka',
        portions: {
          2: ['3 jajka', '2 pomidory', '1 papryka', '1 cebula', '1 łyżka oleju', 'sól i przyprawy'],
          4: ['6 jajek', '4 pomidory', '2 papryki', '2 cebule', '2 łyżki oleju', 'sól i przyprawy']
        },
        steps: [
          'Drobno posiekaj cebulę, paprykę i pomidory.',
          'Podsmaż cebulę i paprykę przez 5–7 minut do miękkości.',
          'Dodaj pomidory oraz sól i duś do uzyskania gęstego sosu.',
          'Zrób łyżką wgłębienia, wbij jajka i gotuj pod przykryciem przez 5 minut.'
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
      pl: {
        title: 'Chrupiące placki ziemniaczane',
        description: 'Złociste, chrupiące tradycyjne placki ziemniaczane.',
        prepTime: '30 min',
        equipment: 'Kuchenka',
        portions: {
          2: ['500 g ziemniaków', '1 cebula', '1 jajko', '2 łyżki mąki', 'olej do smażenia', 'sól'],
          4: ['1 kg ziemniaków', '2 cebule', '2 jajka', '4 łyżki mąki', 'olej do smażenia', 'sól']
        },
        steps: [
          'Obierz ziemniaki i cebulę, zetrzyj na drobnej tarce.',
          'Odsącz nadmiar płynu, dodaj jajko, mąkę i sól, dokładnie wymieszaj.',
          'Rozgrzej olej na patelni i nakładaj masę łyżką.',
          'Smaż po 3–4 minuty z każdej strony na złoty kolor. Podawaj ze śmietaną.'
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
      pl: {
        title: 'Domowe serniczki',
        description: 'Delikatne w środku i złociste z zewnątrz placki z twarogu.',
        prepTime: '25 min',
        equipment: 'Kuchenka',
        portions: {
          2: ['350 g twarogu', '1 jajko', '50 g mąki', '1 łyżka oleju', 'cukier do smaku'],
          4: ['700 g twarogu', '2 jajka', '100 g mąki', '2 łyżki oleju', 'cukier do smaku']
        },
        steps: [
          'W misce rozgnieć twaróg z jajkiem i cukrem.',
          'Dodaj mąkę i zagnieć miękkie ciasto.',
          'Uformuj niewielkie krążki i lekko obtocz w mące.',
          'Smaż na średnim ogniu po 3 minuty z każdej strony do zrumienienia.'
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
      pl: {
        title: 'Makaron z serem',
        description: 'Szybki, rozgrzewający makaron z ciągnącym się aromatycznym serem.',
        prepTime: '20 min',
        equipment: 'Kuchenka',
        portions: {
          2: ['200 g makaronu', '120 g sera żółtego', '1 łyżka oleju', 'sól do smaku'],
          4: ['400 g makaronu', '240 g sera żółtego', '2 łyżki oleju', 'sól do smaku']
        },
        steps: [
          'Ugotuj makaron w osolonej wodzie al dente.',
          'Zetrzyj ser na tarce o średnich oczkach.',
          'Odcedź makaron, wymieszaj z odrobiną oleju i gorący połącz z serem.',
          'Podawaj od razu, gdy ser apetycznie się topi.'
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
      pl: {
        title: 'Puszysty omlet mleczny',
        description: 'Klasyczne, delikatne śniadanie o lekkiej puszystej strukturze.',
        prepTime: '15 min',
        equipment: 'Kuchenka',
        portions: {
          2: ['3 jajka', '120 ml mleka', '1 łyżeczka oleju', 'szczypta soli'],
          4: ['6 jajek', '240 ml mleka', '1 łyżka oleju', 'szczypta soli']
        },
        steps: [
          'Roztrzep jajka z mlekiem i solą na jednolitą pianę.',
          'Posmaruj patelnię olejem i rozgrzej na średnim ogniu.',
          'Wlej masę jajeczną i przykryj szczelną pokrywką.',
          'Smaż na małym ogniu przez 8–10 minut bez podnoszenia pokrywki.'
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
      pl: {
        title: 'Soczysty filet z kurczaka',
        description: 'Aromatyczna pierś z kurczaka w ziołach ze złocistą skórką.',
        prepTime: '20 min',
        equipment: 'Kuchenka',
        portions: {
          2: ['400 g filetu z kurczaka', '1 łyżka oleju', 'sól i pieprz do smaku'],
          4: ['800 g filetu z kurczaka', '2 łyżki oleju', 'sól i pieprz do smaku']
        },
        steps: [
          'Opłucz i osusz filety, przekrój wzdłuż na cieńsze plastry.',
          'Natrzyj solą, pieprzem i opcjonalnie czosnkiem.',
          'Rozgrzej olej i smaż mięso po 3–4 minuty z każdej strony.',
          'Odstaw na 2 minuty przed pokrojeniem.'
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
      pl: {
        title: 'Pieczone ziemniaki z czosnkiem',
        description: 'Aromatyczne cząstki ziemniaków z piekarnika z chrupiącą skórką.',
        prepTime: '40 min',
        equipment: 'Piekarnik',
        portions: {
          2: ['500 g ziemniaków', '3 ząbki czosnku', '2 łyżki oleju', 'sól do smaku'],
          4: ['1 kg ziemniaków', '6 ząbków czosnku', '3 łyżki oleju', 'sól do smaku']
        },
        steps: [
          'Dokładnie umyj ziemniaki i pokrój w łódeczki.',
          'Wymieszaj ziemniaki z olejem, solą i posiekanym czosnkiem.',
          'Ułóż na blasze w jednej warstwie i piecz w 200°C przez 35–40 minut.'
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

// State for expandable demo controls
let isAllIngredientsExpanded = false;
let isMoreRecipesExpanded = false;
let isPantryExpanded = true;

const PRIMARY_MAIN_IDS = ['egg', 'tomato', 'potato', 'onion', 'cottage_cheese', 'hard_cheese', 'pasta', 'chicken_fillet'];
const EXTRA_MAIN_IDS = ['wheat_flour', 'bell_pepper', 'sour_cream', 'milk'];
const PANTRY_IDS = ['sunflower_oil', 'salt', 'garlic'];

function initPlayground() {
  renderChips();
  renderResults();
  setupPresets();
  setupExpandableToggles();
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

function createChipElement(ing, lang) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = `ingredient-chip ${selectedIngredients.has(ing.id) ? 'active' : ''}`;
  chip.setAttribute('data-id', ing.id);
  chip.setAttribute('aria-pressed', selectedIngredients.has(ing.id) ? 'true' : 'false');
  const ingName = getIngredientName(ing, lang);
  chip.innerHTML = `
    <span class="chip-emoji">${ing.emoji}</span>
    <span class="chip-name">${ingName}</span>
    <span class="chip-check" aria-hidden="true">✓</span>
  `;

  chip.addEventListener('click', (e) => {
    e.preventDefault();
    if (selectedIngredients.has(ing.id)) {
      selectedIngredients.delete(ing.id);
    } else {
      selectedIngredients.add(ing.id);
    }
    renderChips();
    renderResults();
  });

  return chip;
}

function renderChips() {
  const mainContainer = document.getElementById('chipsContainerMain');
  const extraContainer = document.getElementById('chipsContainerExtra');
  const pantryContainer = document.getElementById('chipsContainerPantry');
  const countEl = document.getElementById('selectedCount');
  const toggleAllBtn = document.getElementById('toggleAllIngredients');
  const toggleAllText = document.getElementById('toggleAllIngredientsText');
  const pantryStatus = document.getElementById('pantryStatus');

  if (!mainContainer || !extraContainer || !pantryContainer) return;

  const lang = getLang();

  // 1. Counter update
  if (countEl) {
    countEl.textContent = i18nText('playground.selectedCount', { n: selectedIngredients.size }, `Вибрано: ${selectedIngredients.size}`);
  }

  // 2. Primary 8 ingredients
  mainContainer.innerHTML = '';
  PRIMARY_MAIN_IDS.forEach(id => {
    const ing = INGREDIENTS.find(i => i.id === id);
    if (ing) mainContainer.appendChild(createChipElement(ing, lang));
  });

  // 3. Extra 4 ingredients
  extraContainer.innerHTML = '';
  EXTRA_MAIN_IDS.forEach(id => {
    const ing = INGREDIENTS.find(i => i.id === id);
    if (ing) extraContainer.appendChild(createChipElement(ing, lang));
  });

  extraContainer.hidden = !isAllIngredientsExpanded;
  if (toggleAllBtn) {
    toggleAllBtn.setAttribute('aria-expanded', isAllIngredientsExpanded ? 'true' : 'false');
    const extraSelectedCount = EXTRA_MAIN_IDS.filter(id => selectedIngredients.has(id)).length;
    if (isAllIngredientsExpanded) {
      if (toggleAllText) toggleAllText.textContent = i18nText('playground.showLess', {}, 'Згорнути');
    } else if (extraSelectedCount > 0) {
      if (toggleAllText) toggleAllText.textContent = i18nText('playground.allProductsWithSelected', { n: EXTRA_MAIN_IDS.length, sel: extraSelectedCount }, `Усі продукти (+${EXTRA_MAIN_IDS.length} · ${extraSelectedCount} вибрано)`);
    } else {
      if (toggleAllText) toggleAllText.textContent = i18nText('playground.allProducts', { n: EXTRA_MAIN_IDS.length }, `Усі продукти (+${EXTRA_MAIN_IDS.length})`);
    }
  }

  // 4. Pantry Essentials
  pantryContainer.innerHTML = '';
  PANTRY_IDS.forEach(id => {
    const ing = INGREDIENTS.find(i => i.id === id);
    if (ing) pantryContainer.appendChild(createChipElement(ing, lang));
  });

  if (pantryStatus) {
    const pantrySelectedCount = PANTRY_IDS.filter(id => selectedIngredients.has(id)).length;
    pantryStatus.textContent = pantrySelectedCount > 0 
      ? i18nText('playground.pantrySelected', { n: pantrySelectedCount }, `${pantrySelectedCount} вибрано`)
      : '';
  }
}

function setupExpandableToggles() {
  const toggleAllBtn = document.getElementById('toggleAllIngredients');
  const toggleMoreBtn = document.getElementById('toggleMoreRecipes');
  const togglePantryBtn = document.getElementById('togglePantryBtn');
  const pantryContainer = document.getElementById('chipsContainerPantry');

  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', () => {
      isAllIngredientsExpanded = !isAllIngredientsExpanded;
      renderChips();
    });
  }

  if (toggleMoreBtn) {
    toggleMoreBtn.addEventListener('click', () => {
      isMoreRecipesExpanded = !isMoreRecipesExpanded;
      renderResults();
    });
  }

  if (togglePantryBtn && pantryContainer) {
    togglePantryBtn.addEventListener('click', () => {
      if (window.innerWidth <= 640) {
        isPantryExpanded = !isPantryExpanded;
        pantryContainer.style.display = isPantryExpanded ? 'flex' : 'none';
        togglePantryBtn.setAttribute('aria-expanded', isPantryExpanded ? 'true' : 'false');
      }
    });
  }
}

function renderResults() {
  const primaryContainer = document.getElementById('primaryRecommendation');
  const secondaryContainer = document.getElementById('secondaryRecommendations');
  const moreContainer = document.getElementById('moreRecommendations');
  const toggleMoreBtn = document.getElementById('toggleMoreRecipes');
  const toggleMoreText = document.getElementById('toggleMoreRecipesText');
  const summaryEl = document.getElementById('resultsSummary');

  if (!primaryContainer || !secondaryContainer || !moreContainer) return;

  const lang = getLang();

  // Evaluate recipes matching
  const evaluatedRecipes = RECIPES.map(rawRecipe => {
    const recipe = getLocalizedRecipe(rawRecipe, lang);
    const scaledReq = rawRecipe.required;
    const missing = scaledReq.filter(id => !selectedIngredients.has(id));
    const canCook = missing.length === 0;
    const missingNames = missing.map(id => {
      const found = INGREDIENTS.find(i => i.id === id);
      return found ? getIngredientName(found, lang) : id;
    });

    return {
      rawRecipe,
      recipe,
      canCook,
      missingCount: missing.length,
      missingNames
    };
  });

  // Sort: Ready first, then by least missing
  evaluatedRecipes.sort((a, b) => {
    if (a.canCook && !b.canCook) return -1;
    if (!a.canCook && b.canCook) return 1;
    return a.missingCount - b.missingCount;
  });

  const readyCount = evaluatedRecipes.filter(r => r.canCook).length;

  // 1. Factual results summary
  if (summaryEl) {
    if (selectedIngredients.size === 0) {
      summaryEl.textContent = i18nText('playground.resultsEmpty', {}, 'Оберіть продукти ліворуч або скористайтеся готовим набором');
    } else if (readyCount > 0) {
      const plural = getPluralWord(readyCount, lang);
      const readyMsg = i18nText('playground.resultsReady', { n: readyCount, plural }, `🟢 Готово до приготування: ${readyCount} ${plural}`);
      summaryEl.innerHTML = `<span style="color: #15803d; font-weight: 550;">${readyMsg}</span>`;
    } else {
      const plural = getPluralWord(evaluatedRecipes.length, lang);
      const partialMsg = i18nText('playground.resultsPartial', { n: evaluatedRecipes.length, plural }, `🟡 Підібрано ${evaluatedRecipes.length} ${plural} (бракує кількох продуктів)`);
      summaryEl.innerHTML = `<span style="color: #9a3412; font-weight: 550;">${partialMsg}</span>`;
    }
  }

  // 2. Primary recommendation (Index 0)
  primaryContainer.innerHTML = '';
  const primary = evaluatedRecipes[0];
  if (primary) {
    let statusBadgeHtml = '';
    if (primary.canCook) {
      statusBadgeHtml = `<span class="rec-status-badge rec-status-ready">${i18nText('playground.cardReadyStatus', {}, '✓ Усі інгредієнти вибрано')}</span>`;
    } else if (primary.missingCount === 1) {
      statusBadgeHtml = `<span class="rec-status-badge rec-status-missing">${i18nText('playground.cardMissingSingle', { item: primary.missingNames[0] }, `Бракує: ${primary.missingNames[0]}`)}</span>`;
    } else {
      statusBadgeHtml = `<span class="rec-status-badge rec-status-missing">${i18nText('playground.cardMissingMultiple', { n: primary.missingCount }, `Потрібно ще ${primary.missingCount} продукти`)}</span>`;
    }

    const card = document.createElement('div');
    card.className = 'primary-rec-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('data-recipe-id', primary.rawRecipe.id);
    card.innerHTML = `
      <div class="primary-rec-img-wrap">
        <img src="${primary.recipe.image}" alt="${primary.recipe.title}" class="primary-rec-img" loading="lazy">
      </div>
      <div class="primary-rec-content">
        <h4 class="primary-rec-title">${primary.recipe.title}</h4>
        <div class="primary-rec-meta">
          <span>⏱ ${primary.recipe.prepTime}</span>
          <span>•</span>
          <span>🍳 ${primary.recipe.equipment}</span>
        </div>
        <div>${statusBadgeHtml}</div>
        <div class="primary-rec-action">
          <span>${i18nText('playground.cardOpenRecipe', {}, 'Відкрити рецепт →')}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openRecipeModal(primary.rawRecipe));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openRecipeModal(primary.rawRecipe);
      }
    });

    primaryContainer.appendChild(card);
  }

  // 3. Secondary recommendations (Index 1 and 2)
  secondaryContainer.innerHTML = '';
  const secondaryRecipes = evaluatedRecipes.slice(1, 3);
  secondaryRecipes.forEach(item => {
    let secStatusHtml = '';
    if (item.canCook) {
      secStatusHtml = `<span class="secondary-rec-status rec-status-ready">${i18nText('playground.cardReadyStatus', {}, '✓ Усі інгредієнти вибрано')}</span>`;
    } else if (item.missingCount === 1) {
      secStatusHtml = `<span class="secondary-rec-status rec-status-missing">${i18nText('playground.cardMissingSingle', { item: item.missingNames[0] }, `Бракує: ${item.missingNames[0]}`)}</span>`;
    } else {
      secStatusHtml = `<span class="secondary-rec-status rec-status-missing">${i18nText('playground.cardMissingMultiple', { n: item.missingCount }, `Потрібно ще ${item.missingCount} продукти`)}</span>`;
    }

    const row = document.createElement('div');
    row.className = 'secondary-rec-card';
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.setAttribute('data-recipe-id', item.rawRecipe.id);
    row.innerHTML = `
      <img src="${item.recipe.image}" alt="${item.recipe.title}" class="secondary-rec-img" loading="lazy">
      <div class="secondary-rec-info">
        <h5 class="secondary-rec-title">${item.recipe.title}</h5>
        <div class="secondary-rec-meta-row">
          <span class="secondary-rec-meta">⏱ ${item.recipe.prepTime}</span>
          ${secStatusHtml}
        </div>
      </div>
      <span class="secondary-rec-arrow" aria-hidden="true">→</span>
    `;

    row.addEventListener('click', () => openRecipeModal(item.rawRecipe));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openRecipeModal(item.rawRecipe);
      }
    });

    secondaryContainer.appendChild(row);
  });

  // 4. Remaining recipes (Index 3+)
  moreContainer.innerHTML = '';
  const remainingRecipes = evaluatedRecipes.slice(3);
  if (remainingRecipes.length > 0) {
    remainingRecipes.forEach(item => {
      let remStatusHtml = '';
      if (item.canCook) {
        remStatusHtml = `<span class="secondary-rec-status rec-status-ready">${i18nText('playground.cardReadyStatus', {}, '✓ Усі інгредієнти вибрано')}</span>`;
      } else if (item.missingCount === 1) {
        remStatusHtml = `<span class="secondary-rec-status rec-status-missing">${i18nText('playground.cardMissingSingle', { item: item.missingNames[0] }, `Бракує: ${item.missingNames[0]}`)}</span>`;
      } else {
        remStatusHtml = `<span class="secondary-rec-status rec-status-missing">${i18nText('playground.cardMissingMultiple', { n: item.missingCount }, `Потрібно ще ${item.missingCount} продукти`)}</span>`;
      }

      const row = document.createElement('div');
      row.className = 'secondary-rec-card';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('data-recipe-id', item.rawRecipe.id);
      row.innerHTML = `
        <img src="${item.recipe.image}" alt="${item.recipe.title}" class="secondary-rec-img" loading="lazy">
        <div class="secondary-rec-info">
          <h5 class="secondary-rec-title">${item.recipe.title}</h5>
          <div class="secondary-rec-meta-row">
            <span class="secondary-rec-meta">⏱ ${item.recipe.prepTime}</span>
            ${remStatusHtml}
          </div>
        </div>
        <span class="secondary-rec-arrow" aria-hidden="true">→</span>
      `;

      row.addEventListener('click', () => openRecipeModal(item.rawRecipe));
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openRecipeModal(item.rawRecipe);
        }
      });

      moreContainer.appendChild(row);
    });

    if (toggleMoreBtn) {
      toggleMoreBtn.hidden = false;
      toggleMoreBtn.setAttribute('aria-expanded', isMoreRecipesExpanded ? 'true' : 'false');
      moreContainer.hidden = !isMoreRecipesExpanded;
      if (toggleMoreText) {
        toggleMoreText.textContent = isMoreRecipesExpanded
          ? i18nText('playground.showLess', {}, 'Згорнути')
          : i18nText('playground.showMoreRecipes', { n: remainingRecipes.length }, `Показати ще ${remainingRecipes.length}`);
      }
    }
  } else if (toggleMoreBtn) {
    toggleMoreBtn.hidden = true;
    moreContainer.hidden = true;
  }
}

function setupPresets() {
  const presetButtons = document.querySelectorAll('.preset-btn[data-preset]');
  const resetBtn = document.getElementById('resetIngredients');

  presetButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
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
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedIngredients.clear();
      renderChips();
      renderResults();
    });
  }
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <strong style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 500; color: var(--color-bone);">${portionsHeading}</strong>
        <div class="modal-portions-toggle">
          <button type="button" class="modal-portion-btn ${currentPortions === 2 ? 'active' : ''}" data-modal-portions="2">2 ${i18nText('playground.portion2', {}, '2 порції').split(' ')[1] || 'порції'}</button>
          <button type="button" class="modal-portion-btn ${currentPortions === 4 ? 'active' : ''}" data-modal-portions="4">4 ${i18nText('playground.portion4', {}, '4 порції').split(' ')[1] || 'порції'}</button>
        </div>
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

  // Wire portions buttons inside modal
  modalBody.querySelectorAll('.modal-portion-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentPortions = parseInt(btn.getAttribute('data-modal-portions'), 10) || 2;
      openRecipeModal(rawRecipe);
    });
  });

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
  const instructionSub = document.getElementById('cookingInstructionSub');
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
  let timerSeconds = 336; // 05:36
  let timerInterval = null;

  function renderStep(step, animate = true) {
    currentStep = step;
    const isStep4 = step === 4;

    const stepText = isStep4
      ? i18nText('cooking.step4Text', {}, 'Додай яйця та накрий сковороду.')
      : i18nText('cooking.step3Text', {}, 'Додай помідори та тушкуй на середньому вогні.');

    const stepSub = isStep4
      ? i18nText('cooking.step4Sub', {}, 'Готуй під кришкою 4–5 хвилин.')
      : i18nText('cooking.step3Sub', {}, 'Готуй на середньому вогні 5–7 хвилин.');

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

    if (instructionSub) {
      if (animate && !prefersReduced) {
        instructionSub.style.transition = 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
        instructionSub.style.opacity = '0';
        instructionSub.style.transform = 'translateY(4px)';

        setTimeout(() => {
          instructionSub.textContent = stepSub;
          instructionSub.style.opacity = '1';
          instructionSub.style.transform = 'translateY(0)';
        }, 220);
      } else {
        instructionSub.textContent = stepSub;
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
          const pct = Math.max(0, Math.round((timerSeconds / 336) * 72));
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

  const header = discoverySection.querySelector('.discovery-header');
  const tiles = Array.from(discoverySection.querySelectorAll('.discovery-tile.reveal-item'));
  const statements = Array.from(discoverySection.querySelectorAll('.discovery-editorial-statement.reveal-item'));
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Wire recipe modals for clickable tiles and cards
  const clickableItems = discoverySection.querySelectorAll('[data-open-recipe]');
  clickableItems.forEach(item => {
    item.addEventListener('click', () => {
      const recipeId = item.getAttribute('data-open-recipe');
      const recipe = RECIPES.find(r => r.id === recipeId);
      if (recipe) {
        openRecipeModal(recipe);
      }
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const recipeId = item.getAttribute('data-open-recipe');
        const recipe = RECIPES.find(r => r.id === recipeId);
        if (recipe) {
          openRecipeModal(recipe);
        }
      }
    });
  });

  // 2. Scroll Reveal Sequence (Header -> Tiles 60ms stagger -> Statement last)
  if (typeof IntersectionObserver === 'undefined' || prefersReduced) {
    if (header) header.classList.add('is-revealed');
    tiles.forEach(t => t.classList.add('is-revealed'));
    statements.forEach(s => s.classList.add('is-revealed'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 1 & 2. Headline and supporting copy
          if (header) header.classList.add('is-revealed');

          // 3. Recipe photography appears with subtle stagger (60ms)
          tiles.forEach((tile, idx) => {
            setTimeout(() => {
              tile.classList.add('is-revealed');
            }, 120 + idx * 60);
          });

          // 4. Editorial statement appears last
          const statementDelay = 120 + tiles.length * 60 + 60;
          statements.forEach(statement => {
            setTimeout(() => {
              statement.classList.add('is-revealed');
            }, statementDelay);
          });

          obs.unobserve(discoverySection);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(discoverySection);
  }

  // 3. Subtle Parallax on Shakshuka Hero image (15-20px across scroll range)
  const heroImg = document.getElementById('discoveryParallaxHero');
  if (heroImg && !prefersReduced && window.innerWidth > 768) {
    let ticking = false;
    function onDiscoveryParallax() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const rect = discoverySection.getBoundingClientRect();
        const winHeight = window.innerHeight;
        if (rect.top < winHeight && rect.bottom > 0) {
          const sectionCenter = rect.top + rect.height / 2;
          const viewportCenter = winHeight / 2;
          const diff = sectionCenter - viewportCenter;
          const shift = Math.max(-18, Math.min(18, diff * -0.032));
          heroImg.style.transform = `scale(1.035) translate3d(0, ${shift}px, 0)`;
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onDiscoveryParallax, { passive: true });
  }
}

/* ==========================================================================
   SCENE ATMOSPHERE: DELICATE PARALLAX & CONTINUOUS THEME TRANSITIONS
   - GPU-composited transform: translate3d for ambient glow layers (40-50px desktop)
   - Smooth normalized scroll progress (0..1) tied to real viewport boundaries
   - Zero layout thrashing, respects prefers-reduced-motion, dynamic resize observer
   ========================================================================== */
function initSceneAtmosphere() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const cameraSec = document.getElementById('camera-scan');
  const featuresSec = document.getElementById('features');

  const cameraGlowWarm = cameraSec ? cameraSec.querySelector('.camera-glow-layer .glow-orb--warm') : null;
  const cameraGlowCool = cameraSec ? cameraSec.querySelector('.camera-glow-layer .glow-orb--cool') : null;

  const featuresGlowWarm = featuresSec ? featuresSec.querySelector('.features-glow-layer .glow-orb--warm') : null;

  // Transition aprons (camera & features)
  const aprons = Array.from(document.querySelectorAll('.scene-transition-apron'));

  let ticking = false;
  let isMobile = window.innerWidth <= 768;

  function updateAtmosphere() {
    const winH = window.innerHeight;
    const maxShift = isMobile ? 16 : 48;
    const secShift = isMobile ? 8 : 22;

    // 1. Camera Scan Parallax
    if (cameraSec && (cameraGlowWarm || cameraGlowCool)) {
      const cRect = cameraSec.getBoundingClientRect();
      if (cRect.bottom > 0 && cRect.top < winH) {
        const t = Math.max(0, Math.min(1, (winH - cRect.top) / (winH + cRect.height)));
        const warmY = (t - 0.5) * maxShift;
        const coolY = (t - 0.5) * secShift;
        if (cameraGlowWarm) cameraGlowWarm.style.transform = `translate3d(0, ${warmY.toFixed(1)}px, 0)`;
        if (cameraGlowCool) cameraGlowCool.style.transform = `translate3d(0, ${coolY.toFixed(1)}px, 0)`;
      }
    }

    // 2. Features Parallax
    if (featuresSec && featuresGlowWarm) {
      const fRect = featuresSec.getBoundingClientRect();
      if (fRect.bottom > 0 && fRect.top < winH) {
        const t = Math.max(0, Math.min(1, (winH - fRect.top) / (winH + fRect.height)));
        const warmY = (t - 0.5) * (maxShift * 0.75);
        featuresGlowWarm.style.transform = `translate3d(-50%, ${warmY.toFixed(1)}px, 0)`;
      }
    }

    // 3. Subtle Apron Opacity Modulation across the viewport transition zone
    aprons.forEach(apron => {
      const parentSec = apron.parentElement;
      if (!parentSec) return;
      const pRect = parentSec.getBoundingClientRect();
      if (pRect.top <= winH && pRect.top >= winH * 0.2) {
        const progress = Math.max(0, Math.min(1, (winH - pRect.top) / (winH * 0.8)));
        const opacity = 0.85 + 0.15 * progress;
        apron.style.opacity = opacity.toFixed(2);
      } else if (pRect.top < winH * 0.2) {
        apron.style.opacity = '1';
      }
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateAtmosphere);
    }
  }

  function onResize() {
    isMobile = window.innerWidth <= 768;
    onScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  // Initial calculation on load
  updateAtmosphere();

  // ResizeObserver for dynamic height mutations
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      onScroll();
    });
    const faqList = document.getElementById('faqAccordion');
    if (faqList) ro.observe(faqList);
  }
}

/* ==========================================================================
   VARIANT 2: HERO CONTENT PINNING & BACKGROUND COLOR REVEAL
   - Controlled scroll travel distance (~70vh) while Hero content remains pinned
   - Background transitions from dark (#0a0a0a) to cream (#F6F2EC)
   - Dynamic contrast adaptation for headline, subtitle, buttons, trust pills
   - Once P = 1.0, hero unpins and smoothly exits into the interactive demo
   - Zero scroll-jacking, respects mobile eligibility and prefers-reduced-motion
   ========================================================================== */
function initHeroPinnedTransition() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const wrapper = document.getElementById('heroPinnedWrapper');
  const heroSec = document.getElementById('hero');
  const creamBg = document.getElementById('heroBgCream');

  if (!wrapper || !heroSec || !creamBg) return;

  function checkEligible() {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    return winW > 768 && winH >= 600;
  }

  let isEligible = checkEligible();
  if (isEligible) {
    document.documentElement.classList.add('js-pinned-active');
  }

  let ticking = false;

  function updatePinnedProgress() {
    if (!isEligible) {
      heroSec.classList.remove('theme-light');
      heroSec.style.removeProperty('--hero-theme-progress');
      heroSec.style.removeProperty('--hero-cream-opacity');
      ticking = false;
      return;
    }

    const winH = window.innerHeight;
    const wrapperRect = wrapper.getBoundingClientRect();
    const travelDistance = wrapper.offsetHeight - winH;

    if (travelDistance <= 0) {
      ticking = false;
      return;
    }

    // Scrolled distance inside the pinned wrapper
    const scrolled = -wrapperRect.top;
    const rawProgress = scrolled / travelDistance;
    const progress = Math.max(0, Math.min(1, rawProgress));

    // High-contrast text/button flip at 38% cream opacity for crisp readability at midpoint
    heroSec.classList.toggle('theme-light', progress >= 0.38);

    // Set CSS variables on hero element
    heroSec.style.setProperty('--hero-theme-progress', progress.toFixed(3));
    heroSec.style.setProperty('--hero-cream-opacity', progress.toFixed(3));

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updatePinnedProgress);
    }
  }

  function onResize() {
    const wasEligible = isEligible;
    isEligible = checkEligible();
    if (isEligible !== wasEligible) {
      if (isEligible) {
        document.documentElement.classList.add('js-pinned-active');
      } else {
        document.documentElement.classList.remove('js-pinned-active');
      }
    }
    onScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('hashchange', onScroll, { passive: true });

  // Initial calculation immediately on load
  updatePinnedProgress();

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      onScroll();
    });
    ro.observe(wrapper);
  }
}
