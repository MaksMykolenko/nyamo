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
        step3Text: "Додай помідори та тушкуй на середньому вогні.",
        step3Sub: "Готуй на середньому вогні 5–7 хвилин.",
        step4Num: "Крок 4 з 7",
        step4Text: "Додай яйця та накрий сковороду.",
        step4Sub: "Готуй під кришкою 4–5 хвилин.",
        timerRemaining: "залишилось",
        btnBack: "← Назад",
        btnNext: "Далі →",
        floatingStep: "Крок 3 / 7",
        floatingStepNext: "Крок 4 / 7",
        floatingTimer: "05:36"
      },
      discovery: {
        tag: "Що приготувати",
        title: "На сьогодні точно<br>є що приготувати.",
        subtitle: "Від швидкого сніданку до вечері з того, що вже лежить у холодильнику. 60+ домашніх рецептів — і каталог постійно росте.",
        quote: "Менше думати.<br>Більше готувати.",
        readyBadge: "Є всі продукти",
        recipeShakshuka: "Шакшука з томатами",
        recipeShakshukaMeta: "25 хв",
        recipePasta: "Вершкова паста",
        recipePastaMeta: "20 хв",
        recipeSyrnyky: "Домашні сирники",
        recipeSyrnykyMeta: "25 хв",
        recipeChicken: "Курка з травами",
        recipeChickenMeta: "30 хв",
        recipePotatoes: "Хрустка картопля",
        recipePotatoesMeta: "35 хв",
        recipeOmelette: "Пишний омлет",
        recipeOmeletteMeta: "10 хв"
      },
      features: {
        badge: "💡 Переваги Nyamo",
        title: "Продумано для спокійного готування",
        desc: "Без зайвого шуму, складних налаштувань та перевантажених інтерфейсів.",
        b1Num: "01",
        b1Title: "Точно знає, чого не вистачає",
        b1Text: "Nyamo враховує не тільки назву продукту, а й кількість — і одразу показує, що вже можна готувати.",
        b2Num: "02",
        b2Title: "Просто покажи, що є",
        b2Text: "Сфотографуй продукти або додай їх вручну. Nyamo збере все в одному місці.",
        b3Num: "03",
        b3Title: "Твої дані залишаються твоїми",
        b3Text: "Ми не створюємо рекламний профіль і не продаємо твої дані."
      },
      brandStatement: {
        title: "Nyamo починає не з рецепта.<br>Nyamo починає з того, що вже є у тебе.",
        fact1: "Без обов’язкової підписки",
        fact2: "Працює з твоїми продуктами",
        fact3: "Основні рецепти доступні офлайн"
      },
      download: {
        badge: "📱 Додаток для кухні",
        title: "Що приготуєш сьогодні?",
        desc: "Покажи Nyamo, що є вдома — решту ми допоможемо перетворити на вечерю.",
        btnDownload: "Завантажити Nyamo",
        btnGooglePlay: "Google Play",
        metaOffline: "✓ Основні функції офлайн",
        metaFree: "✓ Без обов'язкової підписки",
        metaClean: "✓ Безпечно та без трекерів",
        qrCaption: "Наведи камеру смартфона для швидкого завантаження"
      },
      faq: {
        badge: "❓ Відповіді на питання",
        title: "Часті запитання",
        q1: "Чи працює Nyamo без інтернету?",
        a1: "Так. Рецепти, продукти та основні функції доступні офлайн. Інтернет потрібен лише для опціональної функції AI-розпізнавання продуктів за фотографією.",
        q2: "Чи безкоштовний Nyamo?",
        a2: "Так, Nyamo безкоштовний для кожного. Усі базові рецепти та функції доступні без обов'язкових платних підписок чи заблокованого контенту.",
        q3: "Як працює розпізнавання фото?",
        a3: "Ти робиш знімок полиці холодильника чи продуктів на столі. Nyamo визначає інгредієнти та показує список, де можна перевірити та уточнити кількість перед збереженням.",
        q4: "Що відбувається з моїми фотографіями?",
        a4: "Розпізнавання фото потребує інтернету, але фото не зберігаються після обробки. Додаток видаляє чутливі EXIF-метадані перед відправкою, а твої кулінарні дані залишаються на пристрої.",
        q5: "Чи можна змінювати кількість порцій?",
        a5: "Так. У кожному рецепті можна обрати потрібну кількість порцій від 1 до 10. Грами, ложки та штуки інгредієнтів адаптуються автоматично, включно з текстами кроків.",
        q6: "Як додати спеції та постійні продукти?",
        a6: "Сіль, олія та улюблені приправи відзначаються в окремій швидкій панелі спецій, а базові запаси зберігаються в розділі «Комора», щоб не вводити їх щоразу заново."
      },
      footer: {
        tagline: "Смачне з того, що є.",
        copyright: "© 2026 Nyamo. Усі права захищено.",
        navHeading: "Навігація",
        navDemo: "Спробувати онлайн",
        navFeatures: "Можливості",
        navRecipes: "Рецепти",
        navDownload: "Завантажити",
        privacyHeading: "Підтримка та приватність",
        privacyPolicy: "Політика конфіденційності",
        support: "Підтримка розробника"
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
        step3Text: "Add the tomatoes and simmer gently.",
        step3Sub: "Cook over medium heat for 5–7 minutes.",
        step4Num: "Step 4 of 7",
        step4Text: "Crack in the eggs and cover the skillet.",
        step4Sub: "Cook covered for 4–5 minutes.",
        timerRemaining: "remaining",
        btnBack: "← Back",
        btnNext: "Next →",
        floatingStep: "Step 3 / 7",
        floatingStepNext: "Step 4 / 7",
        floatingTimer: "05:36"
      },
      discovery: {
        tag: "What to cook",
        title: "There’s definitely something<br>to cook today.",
        subtitle: "From a quick breakfast to dinner made with what’s already in your fridge. 60+ home recipes — and the collection keeps growing.",
        quote: "Less thinking.<br>More cooking.",
        readyBadge: "All ingredients available",
        recipeShakshuka: "Shakshuka with Tomatoes",
        recipeShakshukaMeta: "25 min",
        recipePasta: "Creamy Pasta",
        recipePastaMeta: "20 min",
        recipeSyrnyky: "Homemade Syrnyky",
        recipeSyrnykyMeta: "25 min",
        recipeChicken: "Herb Roasted Chicken",
        recipeChickenMeta: "30 min",
        recipePotatoes: "Crispy Potatoes",
        recipePotatoesMeta: "35 min",
        recipeOmelette: "Fluffy Omelette",
        recipeOmeletteMeta: "10 min"
      },
      features: {
        badge: "💡 Nyamo Benefits",
        title: "Designed for Calm, Effortless Cooking",
        desc: "No clutter, no tedious configurations, and no overwhelming interfaces.",
        b1Num: "01",
        b1Title: "Knows Exactly What's Missing",
        b1Text: "Nyamo accounts for ingredient names and quantities — instantly showing what you can cook right away.",
        b2Num: "02",
        b2Title: "Simply Show What You Have",
        b2Text: "Snap a photo of your fridge or add items manually. Nyamo keeps everything in one neat place.",
        b3Num: "03",
        b3Title: "Your Data Stays Yours",
        b3Text: "We don't build ad profiles or sell your data. Your cooking stays on your device."
      },
      brandStatement: {
        title: "Nyamo doesn’t start with a recipe.<br>Nyamo starts with what you already have.",
        fact1: "No mandatory subscription",
        fact2: "Works with your ingredients",
        fact3: "Core recipes available offline"
      },
      download: {
        badge: "📱 Kitchen Companion App",
        title: "What will you cook today?",
        desc: "Show Nyamo what you have at home — we'll help you turn it into dinner.",
        btnDownload: "Download Nyamo",
        btnGooglePlay: "Google Play",
        metaOffline: "✓ Core features offline",
        metaFree: "✓ No mandatory subscription",
        metaClean: "✓ Safe & tracker-free",
        qrCaption: "Scan with your phone camera for instant download"
      },
      faq: {
        badge: "❓ Common Questions",
        title: "Frequently Asked Questions",
        q1: "Does Nyamo work offline?",
        a1: "Yes. Recipes, ingredients, and core features are available offline. Internet is only required for the optional AI fridge photo recognition.",
        q2: "Is Nyamo free?",
        a2: "Yes, Nyamo is free for everyone. All core recipes and features are unlocked without mandatory paid subscriptions or gated content.",
        q3: "How does photo recognition work?",
        a3: "Snap a photo of your fridge shelf or ingredients on the counter. Nyamo identifies items and presents an editable list so you can verify quantities before saving.",
        q4: "What happens to my photos?",
        a4: "Photo recognition requires an internet connection, but photos are never stored after processing. Sensitive EXIF metadata is stripped before sending, and your cooking data stays on your device.",
        q5: "Can I adjust the number of servings?",
        a5: "Yes. Every recipe scales smoothly from 1 to 10 servings. Grams, spoons, and piece counts automatically recalculate, including step-by-step cooking instructions.",
        q6: "How do I manage spices and pantry staples?",
        a6: "Salt, oil, and spices can be quickly toggled in a dedicated Spices sheet, and permanent staples stay in your Pantry so you never need to re-enter them."
      },
      footer: {
        tagline: "Delicious meals from what you have.",
        copyright: "© 2026 Nyamo. All rights reserved.",
        navHeading: "Navigation",
        navDemo: "Try Online",
        navFeatures: "Features",
        navRecipes: "Recipes",
        navDownload: "Download",
        privacyHeading: "Support & Privacy",
        privacyPolicy: "Privacy Policy",
        support: "Developer Support"
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
        step3Text: "Domatesleri ekle ve hafifçe pişir.",
        step3Sub: "Orta ateşte 5–7 dakika pişirin.",
        step4Num: "Adım 4 / 7",
        step4Text: "Yumurtaları kırın ve tavanın kapağını kapatın.",
        step4Sub: "Kapağı kapalı 4–5 dakika pişirin.",
        timerRemaining: "kaldı",
        btnBack: "← Geri",
        btnNext: "İleri →",
        floatingStep: "Adım 3 / 7",
        floatingStepNext: "Adım 4 / 7",
        floatingTimer: "05:36"
      },
      discovery: {
        tag: "Ne pişirsem",
        title: "Bugün kesinlikle<br>pişirecek bir şey var.",
        subtitle: "Hızlı bir kahvaltıdan buzdolabında olanlarla sıcacık bir akşam yemeğine. 60+ ev tarifi — ve katalog sürekli büyüyor.",
        quote: "Daha az düşünce.<br>Daha çok yemek.",
        readyBadge: "Tüm malzemeler var",
        recipeShakshuka: "Domatesli Şakşuka",
        recipeShakshukaMeta: "25 dk",
        recipePasta: "Kremalı Makarna",
        recipePastaMeta: "20 dk",
        recipeSyrnyky: "Ev Yapımı Syrnyky",
        recipeSyrnykyMeta: "25 dk",
        recipeChicken: "Otlu Tavuk",
        recipeChickenMeta: "30 dk",
        recipePotatoes: "Kıtır Patates",
        recipePotatoesMeta: "35 dk",
        recipeOmelette: "Kabarmış Omlet",
        recipeOmeletteMeta: "10 dk"
      },
      features: {
        badge: "💡 Nyamo Avantajları",
        title: "Huzurlu Yemek Pişirme İçin Tasarlandı",
        desc: "Gereksiz karmaşa, zor ayarlar ve göz yoran arayüzler olmadan.",
        b1Num: "01",
        b1Title: "Neyin Eksik Olduğunu Tam Olarak Bilir",
        b1Text: "Nyamo sadece malzeme adını değil miktarını da hesaba katar — ve hemen ne pişirebileceğinizi gösterir.",
        b2Num: "02",
        b2Title: "Sadece Elindekileri Göster",
        b2Text: "Malzemelerin fotoğrafını çek veya elle ekle. Nyamo her şeyi tek bir yerde toplasın.",
        b3Num: "03",
        b3Title: "Verileriniz Yalnızca Size Aittir",
        b3Text: "Reklam profili oluşturmuyoruz ve verilerinizi satmıyoruz."
      },
      brandStatement: {
        title: "Nyamo bir tarifle başlamaz.<br>Nyamo sizde olan malzemelerle başlar.",
        fact1: "Zorunlu abonelik yok",
        fact2: "Elinizdeki malzemelerle çalışır",
        fact3: "Temel tarifler internetsiz erişilebilir"
      },
      download: {
        badge: "📱 Mutfak Asistanı",
        title: "Bugün ne pişireceksin?",
        desc: "Evde ne olduğunu Nyamo'ya göster — gerisini akşam yemeğine dönüştürmene yardımcı olalım.",
        btnDownload: "Nyamo'yu İndir",
        btnGooglePlay: "Google Play",
        metaOffline: "✓ Temel özellikler internetsiz",
        metaFree: "✓ Zorunlu abonelik yok",
        metaClean: "✓ Güvenli ve izleyicisiz",
        qrCaption: "Hemen indirmek için telefon kameranızı doğrultun"
      },
      faq: {
        badge: "❓ Sorular ve Cevaplar",
        title: "Sıkça Sorulan Sorular",
        q1: "Nyamo internetsiz çalışır mı?",
        a1: "Evet. Tarifler, malzemeler ve temel özellikler çevrimdışı kullanılabilir. İnternet yalnızca isteğe bağlı fotoğraftan malzeme tanıma özelliği için gereklidir.",
        q2: "Nyamo ücretsiz mi?",
        a2: "Evet, Nyamo herkes için tamamen ücretsizdir. Tüm temel tarifler ve özellikler zorunlu ücretli abonelik veya kilitli içerik olmadan sunulur.",
        q3: "Fotoğraftan tanıma nasıl çalışır?",
        a3: "Buzdolabı rafının veya tezgahtaki malzemelerin fotoğrafını çekersiniz. Nyamo malzemeleri tanır ve kaydetmeden önce miktarları doğrulayabileceğiniz bir liste sunar.",
        q4: "Fotoğraflarıma ne olur?",
        a4: "Fotoğraf tanıma internet gerektirir ancak fotoğraflar işlemden sonra saklanmaz. Hassas EXIF meta verileri temizlenir ve yemek verileriniz cihazınızda kalır.",
        q5: "Porsiyon sayısı değiştirilebilir mi?",
        a5: "Evet. Her tarifte 1'den 10'a kadar porsiyon seçebilirsiniz. Gramlar, kaşıklar ve adetler adım metinleri dahil otomatik olarak uyarlanır.",
        q6: "Baharatlar ve temel stoklar nasıl eklenir?",
        a6: "Tuz, sıvı yağ ve sevdiğiniz baharatlar hızlı baharat panelinden işaretlenir; temel stoklar ise her seferinde yeniden yazmamanız için Kiler bölümünde saklanır."
      },
      footer: {
        tagline: "Evdeki malzemelerle lezzetli yemekler.",
        copyright: "© 2026 Nyamo. Tüm hakları saklıdır.",
        navHeading: "Gezinme",
        navDemo: "Çevrimiçi Dene",
        navFeatures: "Özellikler",
        navRecipes: "Tarifler",
        navDownload: "İndir",
        privacyHeading: "Destek ve Gizlilik",
        privacyPolicy: "Gizlilik Politikası",
        support: "Geliştirici Desteği"
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
