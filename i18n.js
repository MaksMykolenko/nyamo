/**
 * Nyamo Internationalization (i18n) System
 * Supports:
 *  - Ukrainian (uk) [Default]
 *  - English (en)
 *  - Turkish (tr)
 * Automatic Region/Locale Detection:
 *  - Query param (?lang=)
 *  - LocalStorage
 *  - Browser languages (navigator.languages)
 *  - TimeZone heuristics (Intl.DateTimeFormat)
 */

const NyamoI18n = (() => {
  const STORAGE_KEY = 'nyamo_user_lang';
  const SUPPORTED_LANGS = ['uk', 'en', 'tr'];
  const DEFAULT_LANG = 'uk';

  const TRANSLATIONS = {
    uk: {
      meta: {
        title: "Nyamo («Нямо») — Смачне з того, що є | Розумний кулінарний Android-додаток",
        desc: "Nyamo допомагає знайти ідеальні рецепти з продуктів, які вже є на вашій кухні. 100% офлайн, без платних підписок, з точним алгоритмом підбору та AI-розпізнаванням за фото."
      },
      nav: {
        demo: "Спробувати онлайн",
        features: "Можливості",
        showcase: "Інтерфейс",
        recipes: "Рецепти",
        comparison: "Чому Nyamo",
        faq: "FAQ",
        download: "Завантажити"
      },
      styleSwitcher: {
        label: "Стиль лендінгу:",
        editorial: "A: Editorial Cookbook",
        kinetic: "B: Kinetic Studio",
        minimalist: "C: Sunlit Minimalist"
      },
      hero: {
        badgeMain: "✨ Розумний кулінарний помічник",
        title: "Твій холодильник<br>вже знає, що<br><span class=\"text-highlight\">на вечерю.</span>",
        titlePre: "Твій холодильник",
        titleHighlight: "вже знає, що на вечерю.",
        subtitle: "Покажи Nyamo, що є вдома. Отримай страви, які можеш приготувати просто зараз.",
        ctaDownload: "Завантажити Nyamo",
        ctaDemo: "Спробувати онлайн",
        trustFree: "Безкоштовно назавжди",
        trustOffline: "Працює без зв'язку",
        trustRecipes: "60+ автентичних рецептів",
        foodCardTitle: "Ароматна шакшука",
        foodCardTime: "15 хв",
        foodCardStatus: "✓ Всі продукти з холодильника",
        foodCardMissing: "0 докуплено",
        foodCardServings: "2 порції",
        badgeEggs: "Яйця курячі",
        badgeEggsSub: "3 шт. у наявності",
        badgeEggsPill: "3 яйця у наявності",
        badgeTomatoes: "Стиглі томати",
        badgeTomatoesSub: "2 шт. на полиці",
        badgeCanCook: "✓ Можна приготувати",
        badgeShakshuka: "Шакшука з томатами",
        badgeAi: "AI-розпізнавання",
        badgeAiSub: "Google Gemini",
        badgeMissing: "Бракує: лише вершки"
      },
      playground: {
        badge: "✨ Інтерактивний симулятор",
        title: "Не шукай рецепт.<br>Готуй з того, що вже є.",
        desc: "Обери продукти та спеції, які маєш під рукою. Nyamo покаже страви, які можна зготувати негайно, та точно попередить, якщо чогось бракує.",
        fridgeLabel: "Твій віртуальний холодильник",
        selectedCount: "Вибрано: {n}",
        presetLabel: "Швидкі набори:",
        presetBreakfast: "Сніданок",
        presetPotato: "Деруни & Картопля",
        presetPasta: "Сирна паста",
        presetReset: "Очистити",
        resultsTitle: "Підібрані страви",
        resultsEmpty: "Оберіть інгредієнти вище, щоб побачити відповідні страви",
        resultsReady: "🟢 Готово до приготування: {n} {plural}",
        portionsLabel: "Порції:",
        portion2: "2 порції",
        portion4: "4 порції",
        cardReady: "Є всі інгредієнти",
        cardReadyText: "✓ Усі необхідні продукти є в наявності",
        cardMissing: "Бракує: {n}",
        cardMissingText: "Бракує: {items}",
        cardViewRecipe: "Переглянути рецепт",
        pluralOne: "страва",
        pluralFew: "страви",
        pluralMany: "страв"
      },
      camera: {
        tag: "Швидке сканування",
        title: "Не хочеш додавати вручну?<br>Просто сфотографуй.",
        desc: "Nyamo розпізнає продукти на фото, додасть їх у твій холодильник і одразу покаже, що можна приготувати.",
        labelTomatoes: "Помідори",
        labelEggs: "Яйця",
        labelCheese: "Сир",
        labelMilk: "Молоко",
        labelOnion: "Цибуля",
        labelHerbs: "Зелень",
        flowPhoto: "Фото",
        flowDetected: "Розпізнано 6 продуктів",
        readyDishes: "8 страв можна приготувати",
        recipe1Title: "Ароматна шакшука",
        recipe1Meta: "⏱ 25 хв • 🍳 Плита",
        recipe2Title: "Пишний молочний омлет",
        recipe2Meta: "⏱ 10 хв • 🍳 Сковорода",
        viewRecipe: "Переглянути рецепт",
        badgeReady: "✓ Є всі інгредієнти"
      },
      cooking: {
        tag: "Режим приготування",
        title: "Далі просто готуй.<br>Nyamo проведе<br>крок за кроком.",
        desc: "Один крок за раз, таймери під рукою та нічого зайвого перед очима.",
        handsFree: "Руки зайняті? Наступний крок завжди перед тобою.",
        recipeTitle: "Шакшука з томатами",
        stepCountLabel: "Крок {n} з {total}",
        step3Num: "Крок 3 з 7",
        step3Text: "Додай помідори та тушкуй 5–7 хвилин на середньому вогні.",
        step4Num: "Крок 4 з 7",
        step4Text: "Додай яйця та накрий сковороду.",
        timerRemaining: "Залишилось часу",
        btnBack: "← Назад",
        btnNext: "Далі →",
        floatingStep: "Крок 3 / 7",
        floatingStepNext: "Крок 4 / 7",
        floatingTimer: "05:42",
        floatingRemaining: "~18 хв залишилось"
      },
      discovery: {
        tag: "Що приготувати",
        title: "На сьогодні точно<br>є що приготувати.",
        subtitle: "Від швидкого сніданку до вечері з того, що вже лежить у холодильнику.",
        quote: "Менше думати.<br>Більше готувати.",
        readyBadge: "✓ Є всі продукти",
        recipeShakshuka: "Шакшука з томатами",
        recipeShakshukaMeta: "25 хв",
        recipePasta: "Вершкова паста",
        recipePastaMeta: "20 хв",
        recipePotatoes: "Хрустка картопля",
        recipePotatoesMeta: "35 хв",
        recipeSyrnyky: "Сирники",
        recipeSyrnykyMeta: "25 хв",
        recipeChicken: "Курка з травами",
        recipeChickenMeta: "30 хв",
        recipeOmelette: "Омлет на молоці",
        recipeOmeletteMeta: "10 хв"
      },
      features: {
        badge: "💡 Сучасний підхід",
        title: "Чому готувати з Nyamo — суцільне задоволення",
        desc: "Ми продумали кожну деталь кулінарного досвіду: від точних алгоритмів до дбайливого ставлення до вашого часу та приватності.",
        bento1Tag: "Ядро системи",
        bento1Title: "Точний алгоритм RecipeMatcher",
        bento1Text: "Більшість кулінарних додатків шукають рецепти за випадковими збігами слів. Nyamo розрізняє обов'язкові та опціональні інгредієнти, перевіряє одиниці виміру та дає 3 чіткі статуси:",
        bento1Status1Title: "Можна приготувати",
        bento1Status1Sub: "Усі обов'язкові продукти є",
        bento1Status2Title: "Уточни кількість",
        bento1Status2Sub: "Потрібно перевірити грами чи шт.",
        bento1Status3Title: "Бракує продуктів",
        bento1Status3Sub: "Точний перелік того, що треба докупити",
        bento2Tag: "Google Gemini AI",
        bento2Title: "Розпізнавання фото продуктів",
        bento2Text: "Не хочеш вводити вручну? Зроби знімок полиці холодильника чи продуктів на столі. Штучний інтелект запропонує список, а ти підтвердиш його в зручному діалозі перед пошуком.",
        bento2Note: "Фото не зберігаються на сервері після обробки",
        bento3Tag: "Зручність",
        bento3Title: "Комора постійних запасів",
        bento3Text: "Збережи свої постійні продукти (борошно, олія, спеції, сіль, гречка, крупи) в розділі «Комора». Під час нового приготування вивантажуй їх у пошук одним дотиком.",
        bento4Tag: "Режим приготування",
        bento4Title: "Покроковий фокус-режим",
        bento4Text: "Великий контрастний шрифт, фокус лише на одному поточному кроці та великі кнопки переходу. Стан приготування зберігається в базі: якщо екран згасне чи ти відповіси на дзвінок — прогрес не зникне.",
        bento5Tag: "Безпека даних",
        bento5Title: "100% Офлайн & Приватність",
        bento5Text: "Усі рецепти, словник на 170+ продуктів і ваші запаси зберігаються виключно на телефоні в локальній базі Room SQLite. Жодного примусового акаунта чи прихованого стеження за вами.",
        bento6Tag: "Гнучкість",
        bento6Title: "Динамічний перерахунок на будь-яку кількість порцій",
        bento6Text: "Готуєш тільки для себе чи чекаєш компанію з 6 друзів? Обирай потрібну кількість порцій від 1 до 10 — грами, ложки та штуки інгредієнтів адаптуються автоматично, включно з текстами кроків."
      },
      showcase: {
        badge: "📱 Інтерфейс у деталях",
        title: "Теплий, затишний та інтуїтивний",
        desc: "Дизайн Nyamo створений так, щоб готувати було легко та приємно. Погляньте на реальні екрани додатку.",
        tab1Btn: "Введення продуктів",
        tab2Btn: "Спеції та комора",
        tab3Btn: "Розумний підбір",
        tab4Btn: "Деталі рецепта",
        tab5Btn: "Покроковий режим",
        tab6Btn: "AI Фотоконтроль",
        tab1Badge: "Етап 1: Додавання",
        tab1Title: "Швидке введення без обмежень",
        tab1Desc: "Вводьте продукти списком через кому або новий рядок (*«3 яйця, картопля 500г, томати»*). Розумний словник на 170+ канонічних продуктів розуміє українські відмінки, синоніми та пропонує швидкі підказки.",
        tab1F1: "Швидкі підказки при введенні",
        tab1F2: "Обробка неоднозначностей (наприклад, вибір виду сиру)",
        tab1F3: "Підтримка грамів, мілілітрів, штук та ложок",
        tab2Badge: "Етап 2: Приправи",
        tab2Title: "Повний контроль спецій та запасів",
        tab2Desc: "Сіль, чорний перець, олія та спеції не вважаються наявними за замовчуванням. Зручна панель спецій дозволяє швидко відзначити те, що дійсно є у шафці, без потреби вказувати точні грами солі.",
        tab2F1: "26 популярних спецій та приправ",
        tab2F2: "Вибір одним тапом без ручного зважування",
        tab2F3: "Спеції не перевантажують список основних страв",
        tab3Badge: "Етап 3: Вибір страви",
        tab3Title: "Миттєві рекомендації з чіткими статусами",
        tab3Desc: "Застосунок одразу впорядковує страви за доступністю. Ви одразу бачите, що можна приготувати просто зараз, а для яких страв не вистачає лише одного доступного інгредієнта.",
        tab3F1: "Фільтри за часом (15, 30, 45 хв, будь-який)",
        tab3F2: "Фільтр кухонного обладнання (плита, духовка, мультиварка)",
        tab3F3: "Збереження страв у власне «Обране»",
        tab4Badge: "Етап 4: Рецепт",
        tab4Title: "Зручний перегляд рецепта та інгредієнтів",
        tab4Desc: "Кожен рецепт має апетитне зображення, точний час, список обладнання та деталізовані інгредієнти. Змінюйте кількість порцій на льоту!",
        tab4F1: "Автоматичний перерахунок грамів під порції",
        tab4F2: "Чіткий поділ на основні та опціональні продукти",
        tab4F3: "Перевірені покрокові поради шефа",
        tab5Badge: "Етап 5: Готування",
        tab5Title: "Покроковий кулінарний помічник",
        tab5Desc: "Забудьте про складні кулінарні простирадла тексту, де губишся, що робити далі. Nyamo показує кожен крок окремо з великим читабельним шрифтом.",
        tab5F1: "Зручно читати навіть з відстані на столі",
        tab5F2: "Прогрес зберігається локально в базі даних",
        tab5F3: "Продукти не списуються примусово без згоди",
        tab6Badge: "Етап 6: AI-контроль",
        tab6Title: "Прозоре розпізнавання за фото",
        tab6Desc: "Сфотографуйте вміст комори чи холодильника. Штучний інтелект Gemini визначить продукти та запропонує список, де ви зможете відредагувати кількість або видалити зайве одним рухом.",
        tab6F1: "Підтримка галереї та системної камери",
        tab6F2: "Повний контроль над списком перед збереженням",
        tab6F3: "Безпечна передача з видаленням EXIF-метаданих"
      },
      recipes: {
        badge: "🍲 Справжні смаки",
        title: "60+ перевірених домашніх рецептів",
        desc: "Від традиційного українського борщу та золотистих дерунів до швидкої пасти болоньєзе й ніжних сирників.",
        d1Category: "Плита · Традиційна кухня",
        d1Name: "Справжній український борщ",
        d1Desc: "Наваристий червоний борщ з буряком, картоплею, капустою та ароматною зеленню.",
        d2Category: "Плита · Сніданок",
        d2Name: "Домашні сирники",
        d2Desc: "Ніжні золотисті сирники з кисломолочного сиру з хрусткою скоринкою та сметаною.",
        d3Category: "Плита · Основна страва",
        d3Name: "Хрусткі деруни",
        d3Desc: "Апетитні картопляні оладки з цибулею та хрусткою рум'яною скоринкою.",
        d4Category: "Плита · Сніданок / вечеря",
        d4Name: "Ароматна шакшука",
        d4Desc: "Яйця, запечені в соковитому томатному соусі з солодким перцем, часником та травами.",
        d5Category: "Плита · Ситна вечеря",
        d5Name: "Паста болоньєзе по-домашньому",
        d5Desc: "Класична паста з ніжним м'ясним соусом, стиглими томатами та сиром.",
        d6Category: "Плита · Швидка страва",
        d6Name: "Соковите куряче філе",
        d6Desc: "Швидка підрум'янена куряча грудка зі спеціями та золотистою скоринкою."
      },
      comparison: {
        badge: "⚖️ Порівняння",
        title: "Чому саме Nyamo?",
        desc: "Погляньте, чим Nyamo відрізняється від звичайних кулінарних сайтів та додатків.",
        colCrit: "Критерій",
        colOther: "Звичайні кулінарні сайти",
        colNyamo: "Nyamo («Нямо»)",
        f1Title: "Підбір з того, що є",
        f1Other: "✕ Вимагають купити 15 нових інгредієнтів",
        f1Nyamo: "✓ Шукає рецепти суворо під ваші продукти",
        f2Title: "Розрахунок нестачі",
        f2Other: "✕ Незрозуміло, що є, а чого бракує",
        f2Nyamo: "✓ Точний список: наприклад, «бракує 1 яйця»",
        f3Title: "Доступ та монетизація",
        f3Other: "✕ Пейволи на рецепти, платні щомісячні підписки",
        f3Nyamo: "✓ Усі 60+ рецептів відкриті та безкоштовні, без платних підписок",
        f4Title: "Робота без інтернету",
        f4Other: "✕ Не працює без мережі",
        f4Nyamo: "✓ 100% офлайн (усі рецепти в базі Room)",
        f5Title: "Приватність & Дані",
        f5Other: "✕ Вимагають акаунт, збирають аналітику",
        f5Nyamo: "✓ Жодних акаунтів, усі дані тільки на пристрої",
        f6Title: "Перерахунок порцій",
        f6Other: "✕ Фіксовано (найчастіше на 4 особи)",
        f6Nyamo: "✓ Миттєво від 1 до 10 порцій у всіх кроках"
      },
      download: {
        badge: "🚀 Вже доступно для Android",
        title: "Почни готувати смачніше вже сьогодні",
        desc: "Завантажуй нативний Android-застосунок Nyamo абсолютно безкоштовно. Встановлюй APK або долучайся до закритої бети в Google Play.",
        btnApk: "Завантажити APK (13.4 МБ)",
        btnBeta: "Запит на Google Play Beta",
        metaOs: "📱 Android 8.0+ (API 26–36)",
        metaTrackers: "🔒 0 трекерів · Чистий білд",
        metaVersion: "⚡ Версія 1.0.0",
        qrCaption: "Наведи камеру смартфона для швидкого завантаження"
      },
      faq: {
        badge: "❓ Залишилися питання?",
        title: "Часті запитання",
        q1: "Чи справді додаток працює повністю без інтернету?",
        a1: "<strong>Так, на 100%!</strong> Увесь каталог перевірених домашніх рецептів, вбудований словник із понад 170 продуктів, база запасу «Комора» та розумний алгоритм RecipeMatcher зберігаються безпосередньо у локальній базі даних вашого смартфона. Інтернет потрібен виключно для опціональної функції AI-розпізнавання продуктів за фото.",
        q2: "Як працює розпізнавання фото і що стається з моїми знімками?",
        a2: "Ви обираєте фото або робите знімок через камеру. Перед надсиланням додаток автоматично очищає чутливі EXIF-метадані (геолокацію, модель камери) та передає стиснене зображення моделі Google Gemini. Сервер повертає список виявлених інгредієнтів, який ви власноруч перевіряєте та підтверджуєте. Сервер Nyamo не зберігає ваші фото у сховищі.",
        q3: "Чи платний Nyamo? Чи є приховані підписки?",
        a3: "<strong>Додаток є безкоштовним для кожного користувача.</strong> Усі рецепти та функції відкриті відразу, без платних підписок чи заблокованого контенту. Додаток підтримується за рахунок ненав'язливої реклами, яка органічно вбудована та не заважає готувати.",
        q4: "Як Nyamo розуміє, які спеції та сіль у мене є?",
        a4: "Ми не вважаємо сіль чи олію наявними автоматично — це часта помилка інших додатків. У Nyamo є окрема швидка шторка спецій, де можна відзначити сіль, перець та улюблені приправи в один клік, а також зберегти постійні запаси у розділ «Комора».",
        q5: "Чи списуються продукти після завершення готування?",
        a5: "Ні, Nyamo дбайливо ставиться до ваших записів і ніколи не видаляє інгредієнти самовільно. Ви самі вирішуєте, коли оновити список продуктів або очистити комору."
      },
      footer: {
        tagline: "Смачне з того, що є.",
        copyright: "© 2026 NeoFlux Technologies.<br>Зроблено з любов'ю до смачної домашньої їжі в Україні 🇺🇦",
        navHeading: "Навігація",
        navHome: "Головна",
        navDemo: "Спробувати онлайн",
        navFeatures: "Можливості",
        navRecipes: "Каталог страв",
        navDownload: "Завантажити",
        privacyHeading: "Конфіденційність",
        privacyPolicy: "Політика конфіденційності",
        support: "Підтримка розробника",
        feedback: "Відгуки та пропозиції",
        platformHeading: "Платформа",
        platformSpecs: "Android 8.0+ (Oreo, API 26) до Android 15/16 (API 36).<br>Jetpack Compose, Room SQLite, Material 3."
      },
      modal: {
        readyBadge: "🟢 Можна готувати",
        missingBadge: "🔴 Бракує інгредієнтів",
        portionsHeading: "Інгредієнти на {n} {plural}:",
        stepsHeading: "Покроковий процес:",
        btnCook: "Готувати у додатку Nyamo"
      }
    },

    en: {
      meta: {
        title: "Nyamo — Cook Great Meals With What You Have | Smart Recipe Matcher",
        desc: "Nyamo matches delicious home recipes with the ingredients already in your kitchen. 100% offline-first, no paywalls, smart RecipeMatcher & AI fridge photo scanner."
      },
      nav: {
        demo: "Try Online",
        features: "Features",
        showcase: "App Screens",
        recipes: "Recipes",
        comparison: "Why Nyamo",
        faq: "FAQ",
        download: "Download"
      },
      styleSwitcher: {
        label: "Visual Direction:",
        editorial: "A: Editorial Cookbook",
        kinetic: "B: Kinetic Studio",
        minimalist: "C: Sunlit Minimalist"
      },
      hero: {
        badgeMain: "✨ Smart Kitchen Companion",
        title: "Your fridge<br>already knows what's<br><span class=\"text-highlight\">for dinner.</span>",
        titlePre: "Your fridge",
        titleHighlight: "already knows what's for dinner.",
        subtitle: "Show Nyamo what you have at home. Instantly get dishes you can cook right now.",
        ctaDownload: "Download Nyamo",
        ctaDemo: "Try Online",
        trustFree: "100% Free Forever",
        trustOffline: "Works Completely Offline",
        trustRecipes: "60+ Tested Home Recipes",
        foodCardTitle: "Shakshuka with Toast",
        foodCardTime: "15 min",
        foodCardStatus: "✓ All items in your fridge",
        foodCardMissing: "0 items to buy",
        foodCardServings: "2 servings",
        badgeEggs: "Chicken eggs",
        badgeEggsSub: "3 pcs in fridge",
        badgeEggsPill: "3 eggs in stock",
        badgeTomatoes: "Ripe tomatoes",
        badgeTomatoesSub: "2 pcs on shelf",
        badgeCanCook: "✓ Ready to Cook",
        badgeShakshuka: "Shakshuka with tomatoes",
        badgeAi: "AI Recognition",
        badgeAiSub: "Google Gemini",
        badgeMissing: "Missing: only heavy cream"
      },
      playground: {
        badge: "✨ Interactive Simulator",
        title: "Don't look for recipes.<br>Cook with what you already have.",
        desc: "Pick ingredients and spices you have on hand. Nyamo instantly surfaces meals you can make right away and shows exactly what's missing.",
        fridgeLabel: "Your Virtual Pantry",
        selectedCount: "Selected: {n}",
        presetLabel: "Quick Sets:",
        presetBreakfast: "Breakfast",
        presetPotato: "Pancakes & Potato",
        presetPasta: "Cheesy Pasta",
        presetReset: "Clear All",
        resultsTitle: "Matched Dishes",
        resultsEmpty: "Select ingredients above to see matched dishes",
        resultsReady: "🟢 Ready to cook: {n} {plural}",
        portionsLabel: "Portions:",
        portion2: "2 portions",
        portion4: "4 portions",
        cardReady: "All ingredients available",
        cardReadyText: "✓ All required ingredients are available",
        cardMissing: "Missing: {n}",
        cardMissingText: "Missing: {items}",
        cardViewRecipe: "View recipe",
        pluralOne: "dish",
        pluralFew: "dishes",
        pluralMany: "dishes"
      },
      camera: {
        tag: "Quick Scan",
        title: "Don't want to enter ingredients manually?<br>Just take a photo.",
        desc: "Nyamo identifies ingredients in the photo, adds them to your fridge, and immediately shows what you can cook.",
        labelTomatoes: "Tomatoes",
        labelEggs: "Eggs",
        labelCheese: "Cheese",
        labelMilk: "Milk",
        labelOnion: "Onion",
        labelHerbs: "Herbs",
        flowPhoto: "Photo",
        flowDetected: "6 ingredients recognized",
        readyDishes: "8 dishes ready to cook",
        recipe1Title: "Fragrant Shakshuka",
        recipe1Meta: "⏱ 25 min • 🍳 Stove",
        recipe2Title: "Fluffy Milk Omelette",
        recipe2Meta: "⏱ 10 min • 🍳 Pan",
        viewRecipe: "View recipe",
        badgeReady: "✓ All ingredients available"
      },
      cooking: {
        tag: "Guided Cooking",
        title: "Now simply cook.<br>Nyamo guides you<br>step by step.",
        desc: "One step at a time, timers at hand, and zero clutter in sight.",
        handsFree: "Hands busy? The next step is always right before you.",
        recipeTitle: "Shakshuka with Tomatoes",
        stepCountLabel: "Step {n} of {total}",
        step3Num: "Step 3 of 7",
        step3Text: "Add tomatoes and simmer 5–7 minutes over medium heat.",
        step4Num: "Step 4 of 7",
        step4Text: "Crack in the eggs and cover the skillet.",
        timerRemaining: "Time remaining",
        btnBack: "← Back",
        btnNext: "Next →",
        floatingStep: "Step 3 / 7",
        floatingStepNext: "Step 4 / 7",
        floatingTimer: "05:42",
        floatingRemaining: "~18 min remaining"
      },
      discovery: {
        tag: "What to cook",
        title: "There’s definitely something<br>to cook today.",
        subtitle: "From a quick breakfast to dinner made with what’s already in your fridge.",
        quote: "Less thinking.<br>More cooking.",
        readyBadge: "✓ All ingredients ready",
        recipeShakshuka: "Shakshuka with Tomatoes",
        recipeShakshukaMeta: "25 min",
        recipePasta: "Creamy Pasta",
        recipePastaMeta: "20 min",
        recipePotatoes: "Crispy Potatoes",
        recipePotatoesMeta: "35 min",
        recipeSyrnyky: "Syrnyky Pancakes",
        recipeSyrnykyMeta: "25 min",
        recipeChicken: "Herb Roasted Chicken",
        recipeChickenMeta: "30 min",
        recipeOmelette: "Fluffy Milk Omelette",
        recipeOmeletteMeta: "10 min"
      },
      features: {
        badge: "💡 Modern Culinary Assistant",
        title: "Why Cooking With Nyamo Is a Pure Delight",
        desc: "We thought through every single detail: from strict ingredient matching to honoring your time, privacy, and peace of mind.",
        bento1Tag: "Core Engine",
        bento1Title: "Strict RecipeMatcher Algorithm",
        bento1Text: "Most recipe apps guess by random keywords. Nyamo distinguishes mandatory vs optional ingredients, checks units safely, and assigns 3 clear statuses:",
        bento1Status1Title: "Ready to cook",
        bento1Status1Sub: "All mandatory items are present",
        bento1Status2Title: "Check quantity",
        bento1Status2Sub: "Verify grams or piece counts",
        bento1Status3Title: "Missing items",
        bento1Status3Sub: "Clear breakdown of what to buy",
        bento2Tag: "Google Gemini AI",
        bento2Title: "Fridge Photo Recognition",
        bento2Text: "Don't want to type? Snap a picture of your fridge shelves or counter. AI suggests recognized items, and you confirm or adjust them in a clean review dialog.",
        bento2Note: "Photos are never stored on servers after processing",
        bento3Tag: "Convenience",
        bento3Title: "The Home Pantry",
        bento3Text: "Save your permanent household staples (flour, cooking oil, spices, salt, rice, pasta). Load them into recipe matching with a single tap whenever you cook.",
        bento4Tag: "Cooking Mode",
        bento4Title: "Step-by-Step Focus Mode",
        bento4Text: "High-contrast large text, showing only one step at a time with big touch targets. Cooking progress is saved locally — screen turns off or a call comes in, you won't lose your spot.",
        bento5Tag: "Data Privacy",
        bento5Title: "100% Offline & Private",
        bento5Text: "All recipes, the 170+ ingredient dictionary, and your pantry are saved locally in SQLite Room DB. No mandatory accounts, no analytics tracking, no spy SDKs.",
        bento6Tag: "Portions Scaling",
        bento6Title: "Dynamic Recalculation for 1 to 10 People",
        bento6Text: "Cooking solo or hosting a party of 6? Pick your desired portions — grams, spoons, and piece counts instantly update throughout the whole recipe, including cooking step text."
      },
      showcase: {
        badge: "📱 Intuitive Mobile Interface",
        title: "Warm, Cozy, and Distraction-Free",
        desc: "Nyamo is designed to make home cooking relaxing and seamless. Take a look at genuine native app screens.",
        tab1Btn: "Ingredient Input",
        tab2Btn: "Spices & Pantry",
        tab3Btn: "Smart Matching",
        tab4Btn: "Recipe Details",
        tab5Btn: "Cooking Mode",
        tab6Btn: "AI Photo Check",
        tab1Badge: "Step 1: Adding",
        tab1Title: "Flexible Input Without Rigid Forms",
        tab1Desc: "Type products as a comma-separated list or newline (*«3 eggs, 500g potatoes, tomatoes»*). The dictionary understands quantities, units, and synonyms with live autocomplete.",
        tab1F1: "Live autocomplete suggestions",
        tab1F2: "Disambiguation dialogs (e.g. choose cheese type)",
        tab1F3: "Safe handling of grams, milliliters, and pieces",
        tab2Badge: "Step 2: Seasonings",
        tab2Title: "Complete Control Over Spices & Staples",
        tab2Desc: "Cooking oil, salt, and spices are never assumed to be present by default. A dedicated spices sheet lets you quickly check off what's in your pantry without weighing pinches.",
        tab2F1: "26 popular spices and seasonings",
        tab2F2: "Single-tap toggle without manual weighing",
        tab2F3: "Spices stay neat without cluttering main ingredients",
        tab3Badge: "Step 3: Finding Dishes",
        tab3Title: "Instant Recommendations With Statuses",
        tab3Desc: "Nyamo ranks dishes by feasibility. You see what can be cooked immediately, and what needs just one quick grocery run.",
        tab3F1: "Time filters (15, 30, 45 min, or any)",
        tab3F2: "Cookware filters (stove, oven, microwave, multicooker)",
        tab3F3: "Save favorite dishes to your local Favorites list",
        tab4Badge: "Step 4: The Recipe",
        tab4Title: "Clear Recipe View With Smart Portions",
        tab4Desc: "Every recipe features appetizing photos, total prep time, required appliances, and portion-aware ingredient lists.",
        tab4F1: "Automatic grams & pieces portion recalculation",
        tab4F2: "Clear separation between core and optional ingredients",
        tab4F3: "Tested practical culinary tips",
        tab5Badge: "Step 5: Cooking",
        tab5Title: "Focused Step-by-Step Cooking Helper",
        tab5Desc: "Forget giant walls of text where you lose track of the next step. Nyamo presents one clear action at a time with readable typography.",
        tab5F1: "Effortlessly readable from kitchen table distance",
        tab5F2: "Progress safely persisted in Room database",
        tab5F3: "Ingredients are never removed without your permission",
        tab6Badge: "Step 6: AI Review",
        tab6Title: "Transparent AI Photo Scanner",
        tab6Desc: "Snap a photo of your fridge or counter. Google Gemini identifies visible food items and offers an editable review sheet before saving.",
        tab6F1: "Works with Photo Picker and system camera",
        tab6F2: "Full user control before any items are saved",
        tab6F3: "Privacy-focused transfer with stripped EXIF data"
      },
      recipes: {
        badge: "🍲 Authentic Recipes",
        title: "60+ Tested Home Cooked Meals",
        desc: "From traditional hearty Ukrainian borscht and golden potato deruny to quick homemade bolognese and fluffy cottage cheese syrnyky.",
        d1Category: "Stove · Traditional Cuisine",
        d1Name: "Authentic Ukrainian Borscht",
        d1Desc: "Rich, aromatic ruby borscht with tender beets, potatoes, cabbage, and fresh herbs.",
        d2Category: "Stove · Breakfast",
        d2Name: "Homemade Syrnyky (Cottage Cheese Pancakes)",
        d2Desc: "Delicate, golden cottage cheese pancakes with a crispy crust, served with sour cream.",
        d3Category: "Stove · Main Course",
        d3Name: "Crispy Potato Deruny",
        d3Desc: "Classic crispy potato latkes with grated onions, fried to a golden brown.",
        d4Category: "Stove · Breakfast / Dinner",
        d4Name: "Rich Tomato Shakshuka",
        d4Desc: "Eggs gently poached in a simmering spiced tomato sauce with sweet bell peppers and garlic.",
        d5Category: "Stove · Hearty Dinner",
        d5Name: "Home-Style Pasta Bolognese",
        d5Desc: "Comforting pasta tossed in a rich homemade meat and tomato sauce with melted cheese.",
        d6Category: "Stove · Quick Meal",
        d6Name: "Pan-Seared Chicken Breast",
        d6Desc: "Quick seared seasoned chicken fillet with a golden exterior and juicy tender center."
      },
      comparison: {
        badge: "⚖️ Comparison",
        title: "Why Choose Nyamo?",
        desc: "See how Nyamo contrasts with cluttered recipe websites and conventional cooking apps.",
        colCrit: "Feature",
        colOther: "Typical Recipe Websites",
        colNyamo: "Nyamo App",
        f1Title: "Cook from what you have",
        f1Other: "✕ Expect you to buy 15 new exotic items",
        f1Nyamo: "✓ Searches strictly from items in your kitchen",
        f2Title: "Missing items calculation",
        f2Other: "✕ Unclear what you have vs what you lack",
        f2Nyamo: "✓ Precise missing list: e.g. «needs 1 more egg»",
        f3Title: "Access & Monetization",
        f3Other: "✕ Expensive monthly paywalls, blocking videos",
        f3Nyamo: "✓ All 60+ recipes are 100% free with no paywalls",
        f4Title: "Offline availability",
        f4Other: "✕ Completely useless without fast Wi-Fi",
        f4Nyamo: "✓ 100% offline (Room SQLite database)",
        f5Title: "Privacy & Data",
        f5Other: "✕ Forced accounts, email tracking, ads telemetry",
        f5Nyamo: "✓ Zero accounts required, data stays on phone",
        f6Title: "Portions scaling",
        f6Other: "✕ Fixed (mostly for 4 servings only)",
        f6Nyamo: "✓ Seamless scale 1 to 10 portions across all steps"
      },
      download: {
        badge: "🚀 Now Available for Android",
        title: "Start Cooking Smarter and Tastier Today",
        desc: "Download the native Nyamo Android app for free. Install the APK directly or join the Google Play Closed Beta.",
        btnApk: "Download APK (13.4 MB)",
        btnBeta: "Request Google Play Beta Access",
        metaOs: "📱 Android 8.0+ (API 26–36)",
        metaTrackers: "🔒 0 trackers · Verified clean build",
        metaVersion: "⚡ Version 1.0.0",
        qrCaption: "Scan with your phone camera for instant download"
      },
      faq: {
        badge: "❓ Common Questions",
        title: "Frequently Asked Questions",
        q1: "Does the app truly work completely offline?",
        a1: "<strong>Yes, 100%!</strong> The full catalog of tested recipes, the 170+ ingredient dictionary, your Pantry, and the RecipeMatcher algorithm reside right on your phone's internal storage in SQLite Room DB. Internet connectivity is only needed for the optional AI photo recognition feature.",
        q2: "How does AI photo recognition work and are my photos stored?",
        a2: "You pick a photo from your gallery or snap one with your camera. Before sending, Nyamo strips sensitive EXIF metadata (GPS location, camera details) and transmits the compressed photo to Google Gemini. Gemini returns a suggested ingredient list that you review before adding. Nyamo does not store your photos on any server.",
        q3: "Is Nyamo free? Are there paid subscriptions?",
        a3: "<strong>The app is free for all users.</strong> All recipes and core capabilities are unlocked out of the box with zero subscriptions. Nyamo is supported through non-intrusive ads that never block your cooking screen.",
        q4: "How does Nyamo know what spices and salt I have?",
        a4: "We never assume you have salt or cooking oil by default. Nyamo provides a quick Spices Sheet where you can toggle salt, pepper, and herbs in one click, and store them permanently in your Pantry.",
        q5: "Are ingredients deducted automatically after cooking?",
        a5: "No. Nyamo respects your inventory records and never deletes ingredients automatically. You always decide when to update your list."
      },
      footer: {
        tagline: "Delicious meals from what you have.",
        copyright: "© 2026 NeoFlux Technologies.<br>Crafted with love for delicious homemade food 🇺🇦",
        navHeading: "Navigation",
        navHome: "Home",
        navDemo: "Try Online",
        navFeatures: "Features",
        navRecipes: "Recipes",
        navDownload: "Download",
        privacyHeading: "Privacy & Legal",
        privacyPolicy: "Privacy Policy",
        support: "Developer Support",
        feedback: "Beta Feedback",
        platformHeading: "Platform",
        platformSpecs: "Android 8.0+ (Oreo, API 26) through Android 15/16 (API 36).<br>Jetpack Compose, Room SQLite, Material 3."
      },
      modal: {
        readyBadge: "🟢 Ready to Cook",
        missingBadge: "🔴 Missing Ingredients",
        portionsHeading: "Ingredients for {n} {plural}:",
        stepsHeading: "Step-by-step instructions:",
        btnCook: "Cook in Nyamo App"
      }
    },

    tr: {
      meta: {
        title: "Nyamo — Evdeki Malzemelerle Lezzetli Yemekler | Akıllı Tarif Uygulaması",
        desc: "Nyamo, mutfağınızda olan malzemelerle harika ev yemekleri tarifleri bulur. %100 çevrimdışı, aboneliksiz, akıllı RecipeMatcher ve yapay zeka fotoğraf tarayıcısı."
      },
      nav: {
        demo: "Çevrimiçi Dene",
        features: "Özellikler",
        showcase: "Arayüz",
        recipes: "Tarifler",
        comparison: "Neden Nyamo",
        faq: "SSS",
        download: "İndir"
      },
      styleSwitcher: {
        label: "Tasarım Yönü:",
        editorial: "A: Editorial Cookbook",
        kinetic: "B: Kinetic Studio",
        minimalist: "C: Sunlit Minimalist"
      },
      hero: {
        badgeMain: "✨ Akıllı Ev Mutfak Asistanı",
        title: "Buzdolabınız<br>akşama ne pişireceğini<br><span class=\"text-highlight\">zaten biliyor.</span>",
        titlePre: "Buzdolabınız",
        titleHighlight: "akşam yemeğinde ne olduğunu zaten biliyor.",
        subtitle: "Evde hangi malzemelerin olduğunu Nyamo'ya göster. Hemen pişirebileceğin yemekleri anında keşfet.",
        ctaDownload: "Nyamo'yu İndir",
        ctaDemo: "Çevrimiçi Dene",
        trustFree: "Sonsuza Dek Ücretsiz",
        trustOffline: "%100 Çevrimdışı Çalışır",
        trustRecipes: "60+ Denenmiş Ev Tarifi",
        foodCardTitle: "Domatesli Şakşuka",
        foodCardTime: "15 dk",
        foodCardStatus: "✓ Buzdolabındaki tüm ürünler",
        foodCardMissing: "0 satın alınacak",
        foodCardServings: "2 porsiyon",
        badgeEggs: "Tavuk yumurtası",
        badgeEggsSub: "3 adet mevcut",
        badgeEggsPill: "3 yumurta mevcut",
        badgeTomatoes: "Olgun domates",
        badgeTomatoesSub: "2 adet rafta",
        badgeCanCook: "✓ Pişirmeye Hazır",
        badgeShakshuka: "Domatesli Şakşuka",
        badgeAi: "Yapay Zeka Tarama",
        badgeAiSub: "Google Gemini",
        badgeMissing: "Eksik: yalnızca krema"
      },
      playground: {
        badge: "✨ İnteraktif Simülatör",
        title: "Tarif arama.<br>Evde olanla hemen pişir.",
        desc: "Elinizdeki malzemeleri ve baharatları seçin. Nyamo hemen pişirebileceğiniz yemekleri göstersin ve eksikleri tam olarak belirtsin.",
        fridgeLabel: "Sanal Kileriniz",
        selectedCount: "Seçilen: {n}",
        presetLabel: "Hızlı Paketler:",
        presetBreakfast: "Kahvaltı",
        presetPotato: "Patates & Mücver",
        presetPasta: "Peynirli Makarna",
        presetReset: "Temizle",
        resultsTitle: "Eşleşen Yemekler",
        resultsEmpty: "Eşleşen tarifleri görmek için yukarıdan malzeme seçin",
        resultsReady: "🟢 Pişirmeye hazır: {n} {plural}",
        portionsLabel: "Porsiyon:",
        portion2: "2 porsiyon",
        portion4: "4 porsiyon",
        cardReady: "Tüm malzemeler var",
        cardReadyText: "✓ Tüm gerekli malzemeler mevcut",
        cardMissing: "Eksik: {n}",
        cardMissingText: "Eksik: {items}",
        cardViewRecipe: "Tarifi gör",
        pluralOne: "yemek",
        pluralFew: "yemek",
        pluralMany: "yemek"
      },
      camera: {
        tag: "Hızlı Tarama",
        title: "Malzemeleri tek tek girmek istemiyor musun?<br>Fotoğrafını çek yeter.",
        desc: "Nyamo fotoğraftaki malzemeleri tanır, dolabına ekler ve hemen pişirebileceğin yemekleri gösterir.",
        labelTomatoes: "Domates",
        labelEggs: "Yumurta",
        labelCheese: "Peynir",
        labelMilk: "Süt",
        labelOnion: "Soğan",
        labelHerbs: "Yeşillik",
        flowPhoto: "Fotoğraf",
        flowDetected: "6 malzeme tanımlandı",
        readyDishes: "8 yemek pişirmeye hazır",
        recipe1Title: "Baharatlı Şakşuka",
        recipe1Meta: "⏱ 25 dk • 🍳 Ocak",
        recipe2Title: "Kabarmış Sütlü Omlet",
        recipe2Meta: "⏱ 10 dk • 🍳 Tava",
        viewRecipe: "Tarifi gör",
        badgeReady: "✓ Tüm malzemeler var"
      },
      cooking: {
        tag: "Rehberli Pişirme",
        title: "Artık sadece pişir.<br>Nyamo adım adım<br>eşlik eder.",
        desc: "Tek seferde tek adım, elinin altında zamanlayıcılar ve göz yormayan sadelik.",
        handsFree: "Eller meşgul mü? Sıradaki adım her an karşında.",
        recipeTitle: "Domatesli Şakşuka",
        stepCountLabel: "Adım {n} / {total}",
        step3Num: "Adım 3 / 7",
        step3Text: "Domatesleri ekle ve orta ateşte 5–7 dakika soteleyin.",
        step4Num: "Adım 4 / 7",
        step4Text: "Yumurtaları kırın ve tavanın kapağını kapatın.",
        timerRemaining: "Kalan süre",
        btnBack: "← Geri",
        btnNext: "İleri →",
        floatingStep: "Adım 3 / 7",
        floatingStepNext: "Adım 4 / 7",
        floatingTimer: "05:42",
        floatingRemaining: "~18 dk kaldı"
      },
      discovery: {
        tag: "Ne pişirsem",
        title: "Bugün kesinlikle<br>pişirecek bir şey var.",
        subtitle: "Hızlı bir kahvaltıdan buzdolabında olanlarla sıcacık bir akşam yemeğine.",
        quote: "Daha az düşünce.<br>Daha çok yemek.",
        readyBadge: "✓ Tüm malzemeler var",
        recipeShakshuka: "Domatesli Şakşuka",
        recipeShakshukaMeta: "25 dk",
        recipePasta: "Kremalı Makarna",
        recipePastaMeta: "20 dk",
        recipePotatoes: "Kıtır Patates",
        recipePotatoesMeta: "35 dk",
        recipeSyrnyky: "Syrnyky (Lorlu Pankek)",
        recipeSyrnykyMeta: "25 dk",
        recipeChicken: "Otlu Tavuk",
        recipeChickenMeta: "30 dk",
        recipeOmelette: "Sütlü Omlet",
        recipeOmeletteMeta: "10 dk"
      },
      features: {
        badge: "💡 Modern Mutfak Asistanı",
        title: "Nyamo ile Yemek Yapmak Neden Keyifli?",
        desc: "Her detayı özenle tasarladık: hatasız malzeme eşleştirmeden gizliliğinize ve zamanınıza duyulan saygıya kadar.",
        bento1Tag: "Çekirdek Sistem",
        bento1Title: "Hassas RecipeMatcher Algoritması",
        bento1Text: "Çoğu yemek uygulaması rastgele kelimelere göre arar. Nyamo zorunlu ve isteğe bağlı malzemeleri ayırt eder, ölçü birimlerini kontrol eder ve 3 net durum sunar:",
        bento1Status1Title: "Pişirmeye hazır",
        bento1Status1Sub: "Tüm zorunlu malzemeler var",
        bento1Status2Title: "Miktarı netleştir",
        bento1Status2Sub: "Gram veya adet sayısını kontrol edin",
        bento1Status3Title: "Eksik malzemeler",
        bento1Status3Sub: "Neyi satın almanız gerektiğinin listesi",
        bento2Tag: "Google Gemini AI",
        bento2Title: "Fotoğraftan Malzeme Tanıma",
        bento2Text: "Yazmak istemiyor musunuz? Dolabınızın veya tezgahınızın fotoğrafını çekin. Yapay zeka malzemeleri listelesin, siz onaylayın.",
        bento2Note: "Fotoğraflar işlem sonrası sunucuda asla saklanmaz",
        bento3Tag: "Kolaylık",
        bento3Title: "Kiler / Stok Yönetimi",
        bento3Text: "Evdeki temel malzemeleri (un, yağ, tuz, pirinç, makarna) 'Kiler' bölümüne kaydedin. Her pişirmede tek dokunuşla aramaya ekleyin.",
        bento4Tag: "Pişirme Modu",
        bento4Title: "Adım Adım Odak Modu",
        bento4Text: "Büyük okunabilir yazı tipi, her seferinde yalnızca bir adım ve büyük düğmeler. İlerlemeniz veritabanında saklanır, ekran kapansa bile kaybolmaz.",
        bento5Tag: "Veri Güvenliği",
        bento5Title: "%100 Çevrimdışı & Gizlilik",
        bento5Text: "Tüm tarifler, 170+ ürünlük sözlük ve stoklarınız yalnızca telefonunuzda SQLite Room veritabanında saklanır. Zorunlu hesap veya takip yok.",
        bento6Tag: "Porsiyon Ölçekleme",
        bento6Title: "1'den 10'a Kadar Dinamik Porsiyon",
        bento6Text: "Yalnız mı yiyorsunuz yoksa 6 kişilik sofra mı kuruyorsunuz? Porsiyon sayısını seçin — gramlar ve adetler adım metinleri dahil anında güncellenir."
      },
      showcase: {
        badge: "📱 Arayüz Detayları",
        title: "Sıcak, Samimi ve Sezgisel",
        desc: "Nyamo yemek yapmayı stressiz ve keyifli kılmak için tasarlandı. Gerçek ekran görüntülerine göz atın.",
        tab1Btn: "Malzeme Girişi",
        tab2Btn: "Baharatlar & Kiler",
        tab3Btn: "Akıllı Eşleşme",
        tab4Btn: "Tarif Detayları",
        tab5Btn: "Pişirme Modu",
        tab6Btn: "Yapay Zeka Kontrol",
        tab1Badge: "Aşama 1: Ekleme",
        tab1Title: "Kısıtlama Olmadan Hızlı Giriş",
        tab1Desc: "Malzemeleri virgülle veya alt alta yazın (*«3 yumurta, 500g patates, domates»*). 170+ kelimelik sözlük anında tamamlama sunar.",
        tab1F1: "Canlı otomatik tamamlama ipuçları",
        tab1F2: "Belirsizlik giderme (örn. peynir türünü seçme)",
        tab1F3: "Gram, mililitre ve adet desteği",
        tab2Badge: "Aşama 2: Baharatlar",
        tab2Title: "Baharatlar ve Stoklar Elinizin Altında",
        tab2Desc: "Tuz, karabiber ve yağ otomatik olarak var kabul edilmez. Tek dokunuşla dolabınızdaki baharatları işaretleyin.",
        tab2F1: "26 popüler baharat ve çeşni",
        tab2F2: "Tartmadan tek dokunuşla seçim",
        tab2F3: "Baharatlar ana ürünleri kalabalıklaştırmaz",
        tab3Badge: "Aşama 3: Yemek Seçimi",
        tab3Title: "Net Durumlarla Anında Öneriler",
        tab3Desc: "Uygulama yemekleri hemen yapılabilirliğe göre sıralar. Neyin eksik olduğunu açıkça görürsünüz.",
        tab3F1: "Zaman filtreleri (15, 30, 45 dk veya hepsi)",
        tab3F2: "Mutfak aleti filtreleri (ocak, fırın, mikrodalga)",
        tab3F3: "Tarifleri 'Favoriler'e kaydetme",
        tab4Badge: "Aşama 4: Tarif",
        tab4Title: "Akıllı Porsiyonlu Tarif Ekranı",
        tab4Desc: "Her tarifte iştah açıcı görsel, hazırlama süresi, gerekli ekipman ve porsiyona göre hesaplanan malzemeler bulunur.",
        tab4F1: "Porsiyona göre otomatik miktar hesabı",
        tab4F2: "Zorunlu ve isteğe bağlı malzemelerin ayrımı",
        tab4F3: "Pratik şef önerileri",
        tab5Badge: "Aşama 5: Pişirme",
        tab5Title: "Adım Adım Pişirme Asistanı",
        tab5Desc: "Kaybolduğunuz karmaşık uzun metinleri unutun. Nyamo büyük yazılarla her seferinde tek bir adımı gösterir.",
        tab5F1: "Tezgah mesafesinden rahatça okunabilir",
        tab5F2: "İlerleme Room veritabanına kaydedilir",
        tab5F3: "Malzemeler izniniz olmadan silinmez",
        tab6Badge: "Aşama 6: Yapay Zeka",
        tab6Title: "Şeffaf Fotoğraf Tarama",
        tab6Desc: "Dolabınızın fotoğrafını çekin. Gemini yapay zekası malzemeleri tanısın, siz listeyi kontrol edip onaylayın.",
        tab6F1: "Galeri ve sistem kamerası desteği",
        tab6F2: "Kaydetmeden önce tam kontrol",
        tab6F3: "EXIF verileri temizlenerek güvenli aktarım"
      },
      recipes: {
        badge: "🍲 Lezzetli Tarifler",
        title: "60+ Denenmiş Ev Yemeği Tarifi",
        desc: "Geleneksel borş çorbasından çıtır patates mücverine, hızlı bolonez makarnadan enfes peynirli krep ve şakşukaya kadar.",
        d1Category: "Ocak · Geleneksel Mutfak",
        d1Name: "Geleneksel Ukrayna Borş Çorbası",
        d1Desc: "Pancar, patates, lahana ve taze otlarla zengin kırmızı ev çorbası.",
        d2Category: "Ocak · Kahvaltı",
        d2Name: "Ev Yapımı Syrnyky (Lor Peynirli Pankek)",
        d2Desc: "İçi yumuşacık, dışı altın sarısı çıtır lor peynirli pankekler.",
        d3Category: "Ocak · Ana Yemek",
        d3Name: "Çıtır Patatesli Deruny (Mücver)",
        d3Desc: "Rendelenmiş patates ve soğanla hazırlanan çıtır kızarmış lezzet.",
        d4Category: "Ocak · Kahvaltı / Akşam Yemeği",
        d4Name: "Soslu Domatesli Şakşuka",
        d4Desc: "Biber ve sarımsakla pişen zengin domates sosunda göz yumurta.",
        d5Category: "Ocak · Doyurucu Yemek",
        d5Name: "Ev Usulü Bolonez Makarna",
        d5Desc: "Kıymalı domates sosu ve eriyen peyniriyle klasik lezzet.",
        d6Category: "Ocak · Hızlı Yemek",
        d6Name: "Tavada Sulu Tavuk Göğsü",
        d6Desc: "Baharatlarla marine edilmiş, dışı kızarmış sulu tavuk fileto."
      },
      comparison: {
        badge: "⚖️ Karşılaştırma",
        title: "Neden Nyamo?",
        desc: "Nyamo'nun sıradan yemek sitelerinden ve uygulamalarından farkını görün.",
        colCrit: "Özellik",
        colOther: "Klasik Yemek Siteleri",
        colNyamo: "Nyamo Uygulaması",
        f1Title: "Evdeki malzemelerle pişirme",
        f1Other: "✕ 15 yeni egzotik malzeme almanızı ister",
        f1Nyamo: "✓ Kesinlikle evinizdeki malzemelere göre arar",
        f2Title: "Eksik malzeme hesabı",
        f2Other: "✕ Neyin eksik olduğu belirsizdir",
        f2Nyamo: "✓ Net liste: örn. «1 yumurta eksik»",
        f3Title: "Erişim & Monetizasyon",
        f3Other: "✕ Ücretli abonelikler, kilitli tarifler",
        f3Nyamo: "✓ 60+ tarifin tamamı ücretsiz ve kilitsiz",
        f4Title: "İnternetsiz çalışma",
        f4Other: "✕ İnternet olmadan çalışmaz",
        f4Nyamo: "✓ %100 çevrimdışı (Room SQLite veritabanı)",
        f5Title: "Gizlilik & Veriler",
        f5Other: "✕ Zorunlu hesap açma, veri takibi",
        f5Nyamo: "✓ Hesap gerekmez, veriler telefonda kalır",
        f6Title: "Porsiyon ölçekleme",
        f6Other: "✕ Sabit (genelde sadece 4 kişilik)",
        f6Nyamo: "✓ Tüm adımlarda 1'den 10'a kadar anında uyarlanır"
      },
      download: {
        badge: "🚀 Android İçin Yayında",
        title: "Bugün Daha Lezzetli Pişirmeye Başlayın",
        desc: "Nyamo Android uygulamasını tamamen ücretsiz indirin. APK'yı doğrudan kurun veya Google Play Kapalı Beta'ya katılın.",
        btnApk: "APK İndir (13.4 MB)",
        btnBeta: "Google Play Beta Talebi",
        metaOs: "📱 Android 8.0+ (API 26–36)",
        metaTrackers: "🔒 Sıfır izleyici · Temiz kurulum",
        metaVersion: "⚡ Sürüm 1.0.0",
        qrCaption: "Hemen indirmek için telefon kameranızı doğrultun"
      },
      faq: {
        badge: "❓ Sorularınız mı Var?",
        title: "Sıkça Sorulan Sorular",
        q1: "Uygulama gerçekten tamamen internetsiz çalışıyor mu?",
        a1: "<strong>Evet, kesinlikle!</strong> Denenmiş tüm tarifler, 170+ ürünlük sözlük, Kiler verileri ve RecipeMatcher algoritması doğrudan telefonunuzun hafızasındaki Room SQLite veritabanında saklanır. İnternet sadece isteğe bağlı yapay zeka fotoğraf taraması için gereklidir.",
        q2: "Yapay zeka fotoğraf taraması nasıl çalışır, fotoğraflarım saklanır mı?",
        a2: "Galerinizden bir fotoğraf seçersiniz veya kamerayla çekersiniz. Nyamo hassas EXIF meta verilerini temizler ve sıkıştırılmış görüntüyü Google Gemini'ye iletir. Yapay zeka malzemeleri listeler ve siz onaylarsınız. Nyamo fotoğraflarınızı asla sunucuda saklamaz.",
        q3: "Nyamo ücretli mi? Gizli abonelik var mı?",
        a3: "<strong>Uygulama tüm kullanıcılar için tamamen ücretsizdir.</strong> Tüm tarifler ve özellikler abonelik gerekmeden açıktır. Nyamo, pişirme deneyiminizi bölmeyen göze batmayan reklamlarla desteklenir.",
        q4: "Nyamo hangi baharatlarım olduğunu nasıl anlar?",
        a4: "Tuz veya yağı asla varsayılan olarak var kabul etmiyoruz. Özel Baharat Paneli sayesinde dolabınızdaki baharatları tek tıkla seçebilir ve 'Kiler'e kalıcı olarak kaydedebilirsiniz.",
        q5: "Pişirme bittiğinde malzemeler otomatik olarak silinir mi?",
        a5: "Hayır. Nyamo kayıtlarınıza saygı duyar ve ürünlerinizi asla kendi kendine silmez. Stoklarınızı ne zaman güncelleyeceğinize her zaman siz karar verirsiniz."
      },
      footer: {
        tagline: "Evdeki malzemelerle lezzetli yemekler.",
        copyright: "© 2026 NeoFlux Technologies.<br>Ev yapımı lezzetlere sevgiyle geliştirildi 🇺🇦",
        navHeading: "Gezinme",
        navHome: "Ana Sayfa",
        navDemo: "Çevrimiçi Dene",
        navFeatures: "Özellikler",
        navRecipes: "Tarifler",
        navDownload: "İndir",
        privacyHeading: "Gizlilik",
        privacyPolicy: "Gizlilik Politikası",
        support: "Geliştirici Desteği",
        feedback: "Beta Geri Bildirimi",
        platformHeading: "Platform",
        platformSpecs: "Android 8.0+ (Oreo, API 26) - Android 15/16 (API 36).<br>Jetpack Compose, Room SQLite, Material 3."
      },
      modal: {
        readyBadge: "🟢 Pişirmeye Hazır",
        missingBadge: "🔴 Eksik Malzemeler",
        portionsHeading: "{n} {plural} için malzemeler:",
        stepsHeading: "Adım Adım Talimatlar:",
        btnCook: "Nyamo Uygulamasında Pişir"
      }
    }
  };

  /**
   * Detects the visitor's ideal language:
   * 1. URL search param (?lang=)
   * 2. localStorage saved preference
   * 3. Browser languages (navigator.languages / navigator.language)
   * 4. User timezone heuristics (Europe/Kyiv, Europe/Istanbul, etc.)
   */
  function detectLanguage() {
    // 1. URL parameter
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang')?.toLowerCase();
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) {
      return urlLang;
    }

    // 2. localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      return saved;
    }

    // 3. Timezone heuristic (regional detection)
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (timeZone.includes('Kyiv') || timeZone.includes('Kiev') || timeZone.includes('Uzhgorod') || timeZone.includes('Zaporozhye')) {
        return 'uk';
      }
      if (timeZone.includes('Istanbul')) {
        return 'tr';
      }
    } catch (e) {
      // ignore
    }

    // 4. Browser language headers / preferences
    const browserLangs = navigator.languages || [navigator.language || ''];
    for (const raw of browserLangs) {
      const code = raw.toLowerCase().split('-')[0];
      if (code === 'uk' || code === 'ru' || code === 'be') {
        return 'uk';
      }
      if (code === 'tr') {
        return 'tr';
      }
      if (code === 'en') {
        return 'en';
      }
    }

    // Fallback: If not recognized, default to 'uk' or 'en'
    return DEFAULT_LANG;
  }

  let currentLang = DEFAULT_LANG;

  function init() {
    currentLang = detectLanguage();
    applyLanguage(currentLang, false);
    setupLanguageSwitcher();
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLanguage(lang, true);
  }

  function getLanguage() {
    return currentLang;
  }

  function t(path, params = {}) {
    const keys = path.split('.');
    let current = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];
    for (const k of keys) {
      if (!current || current[k] === undefined) {
        // Fallback to default language
        let fallback = TRANSLATIONS[DEFAULT_LANG];
        for (const fk of keys) {
          if (!fallback || fallback[fk] === undefined) return path;
          fallback = fallback[fk];
        }
        current = fallback;
        break;
      }
      current = current[k];
    }

    if (typeof current === 'string') {
      let text = current;
      for (const [pk, pv] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${pk}\\}`, 'g'), pv);
      }
      return text;
    }
    return current;
  }

  function applyLanguage(lang, triggerRender = true) {
    document.documentElement.lang = lang;

    // Update document title & meta description
    const metaTitle = t('meta.title');
    const metaDesc = t('meta.desc');
    if (metaTitle) document.title = metaTitle;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl && metaDesc) descEl.setAttribute('content', metaDesc);

    // Apply data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val) {
        el.innerHTML = val;
      }
    });

    // Update active state in switcher UI
    updateSwitcherUI(lang);

    // Notify any subscribers (e.g. app.js to re-render recipes/chips)
    if (triggerRender && typeof window.onNyamoLanguageChanged === 'function') {
      window.onNyamoLanguageChanged(lang);
    }
  }

  function updateSwitcherUI(lang) {
    const flags = { uk: '🇺🇦', en: '🇬🇧', tr: '🇹🇷' };
    const codes = { uk: 'UA', en: 'EN', tr: 'TR' };

    const flagEl = document.querySelector('.lang-current-flag');
    const codeEl = document.querySelector('.lang-current-code');
    if (flagEl) flagEl.textContent = flags[lang] || '🇺🇦';
    if (codeEl) codeEl.textContent = codes[lang] || 'UA';

    document.querySelectorAll('.lang-option').forEach(opt => {
      const optLang = opt.getAttribute('data-lang');
      opt.classList.toggle('active', optLang === lang);
    });

    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      btn.classList.toggle('active', btnLang === lang);
    });
  }

  function setupLanguageSwitcher() {
    const dropdownBtn = document.getElementById('langDropdownBtn');
    const dropdown = document.getElementById('langDropdown');

    if (dropdownBtn && dropdown) {
      dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('open');
        dropdownBtn.setAttribute('aria-expanded', isOpen);
      });

      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      });
    }

    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const lang = opt.getAttribute('data-lang');
        setLanguage(lang);
        if (dropdown) dropdown.classList.remove('open');
        if (dropdownBtn) dropdownBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
      });
    });
  }

  return {
    init,
    setLanguage,
    getLanguage,
    t,
    TRANSLATIONS
  };
})();

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', NyamoI18n.init);
} else {
  NyamoI18n.init();
}
