/**
 * Nyamo Internationalization (i18n) System
 * Supports:
 *  - Ukrainian (uk) [Default]
 *  - Polish (pl)
 *  - English (en)
 * Automatic Region/Locale Detection:
 *  - Query param (?lang=)
 *  - LocalStorage
 *  - Browser languages (navigator.languages)
 *  - TimeZone heuristics (Intl.DateTimeFormat)
 */

const NyamoI18n = (() => {
  const STORAGE_KEY = 'nyamo_user_lang';
  const SUPPORTED_LANGS = ['uk', 'pl', 'en'];
  const DEFAULT_LANG = 'uk';

  const TRANSLATIONS = {
    uk: {
      meta: {
        title: "Nyamo — Пошук страв із твоїх продуктів | Бета-тестування",
        desc: "Nyamo допомагає знайти ідеї смачних страв із продуктів, які вже є вдома або на фото. Простий підбір страв, збереження прогресу та відкрите бета-тестування."
      },
      nav: {
        demo: "Спробувати демо",
        features: "Можливості",
        showcase: "Інтерфейс",
        recipes: "Страви",
        comparison: "Чому Nyamo",
        faq: "FAQ",
        download: "Долучитися до бети"
      },
      styleSwitcher: {
        label: "Стиль лендінгу:",
        editorial: "A: Editorial Cookbook",
        kinetic: "B: Kinetic Studio",
        minimalist: "C: Sunlit Minimalist"
      },
      hero: {
        badgeMain: "✨ Бета-тестування сервісу",
        title: "Є продукти, але не знаєш,<br><span class=\"text-highlight\">що приготувати?</span>",
        titlePre: "Є продукти, але не знаєш,",
        titleHighlight: "що приготувати?",
        subtitle: "Обери продукти, які маєш, або додай їх за допомогою фото. Nyamo запропонує страви з каталогу рецептів.",
        ctaDownload: "Долучитися до бета-тестування",
        ctaDemo: "Спробувати демо",
        trustFree: "Підбір за твоїми продуктами",
        trustOffline: "Додавання за фото",
        trustRecipes: "Відкрите бета-тестування",
        trustMatch: "Підбір за твоїми продуктами",
        trustPhoto: "Додавання за фото",
        trustBeta: "Відкрите бета-тестування",
        foodCardTitle: "Ароматна шакшука",
        foodCardTime: "15 хв",
        foodCardStatus: "✓ Підходить за списком продуктів",
        foodCardMissing: "0 докуплено",
        foodCardServings: "2 порції",
        badgeEggs: "Яйця курячі",
        badgeEggsSub: "3 шт. у списку",
        badgeEggsPill: "3 яйця у списку",
        badgeTomatoes: "Стиглі томати",
        badgeTomatoesSub: "2 шт. у списку",
        badgeCanCook: "✓ Можна приготувати",
        badgeShakshuka: "Шакшука з томатами",
        badgeAi: "Аналіз фото",
        badgeAiSub: "Google Gemini",
        badgeMissing: "Бракує: лише вершки"
      },
      playground: {
        badge: "✨ Інтерактивне демо",
        title: "Обери продукти.<br>Подивись, що можна приготувати.",
        desc: "Познач, що є вдома, і подивись варіанти страв із каталогу. Nyamo покаже точний збіг або чого саме не вистачає.",
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
        tag: "Додавання за фото",
        title: "Не хочеш додавати вручну?<br>Просто сфотографуй.",
        desc: "Сфотографуй те, що маєш на поличці чи на столі. Nyamo запропонує список продуктів для перевірки перед підбором страв.",
        labelTomatoes: "Помідори",
        labelEggs: "Яйця",
        labelCheese: "Сир",
        labelMilk: "Молоко",
        labelOnion: "Цибуля",
        labelHerbs: "Зелень",
        flowPhoto: "Фото",
        flowDetected: "Приклад розпізнавання: 6 продуктів",
        readyDishes: "8 страв у каталозі",
        recipe1Title: "Ароматна шакшука",
        recipe1Meta: "⏱ 25 хв • 🍳 Плита",
        recipe2Title: "Пишний молочний омлет",
        recipe2Meta: "⏱ 10 хв • 🍳 Сковорода",
        viewRecipe: "Переглянути рецепт",
        badgeReady: "✓ Є всі інгредієнти"
      },
      cooking: {
        tag: "Покроковий процес",
        title: "Зрозумілі кроки<br>під час готування.",
        desc: "Застосунок показує процес крок за кроком, щоб не губитися у великому тексті рецепта.",
        handsFree: "Демонстраційний вигляд екрана приготування в застосунку.",
        previewNote: "Демонстраційний вигляд екрана приготування в застосунку.",
        recipeTitle: "Шакшука з томатами",
        stepCountLabel: "Крок {n} з {total}",
        step3Num: "Крок 3 з 7",
        step3Text: "Додай помідори та тушкуй на середньому вогні.",
        step3Sub: "Готуй на середньому вогні приблизно 5–7 хвилин.",
        step4Num: "Крок 4 з 7",
        step4Text: "Додай яйця та накрий сковороду.",
        step4Sub: "Готуй під кришкою приблизно 4–5 хвилин.",
        timerRemaining: "орієнтовно",
        btnBack: "← Назад",
        btnNext: "Далі →",
        floatingStep: "Крок 3 / 7",
        floatingStepNext: "Крок 4 / 7",
        floatingTimer: "05:00"
      },
      discovery: {
        tag: "Ідеї страв",
        title: "На сьогодні точно<br>є що приготувати.",
        subtitle: "Від швидкого сніданку до ситної вечері з того, що вже лежить у холодильнику. Прості домашні страви на кожен день.",
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
        badge: "💡 Чому Nyamo",
        title: "Продумано для повсякденного готування",
        desc: "Допомагає визначитися з їжею швидко, без зайвого шуму та складних налаштувань.",
        b1Num: "01",
        b1Title: "Підбір за твоїми продуктами",
        b1Text: "Вкажи, що є вдома — Nyamo знайде страви й чітко підкаже, якщо чогось бракує для повної порції.",
        b2Num: "02",
        b2Title: "Додавання продуктів за фото",
        b2Text: "Зроби знімок інгредієнтів на кухні, підтвердь розпізнаний список у діалозі та одразу дивись рецепти.",
        b3Num: "03",
        b3Title: "Прості щоденні страви",
        b3Text: "Каталог звичних домашніх страв без екзотичних інгредієнтів, який поступово розширюється разом із тестувальниками."
      },
      brandStatement: {
        title: "Nyamo починає не зі списку покупок.<br>Nyamo починає з того, що вже є вдома.",
        fact1: "Підбір страв із наявного",
        fact2: "Додавання продуктів за фото",
        fact3: "Зворотний зв'язок у беті"
      },
      download: {
        badge: "📱 Бета-тестування",
        title: "Спробуй Nyamo у бета-тестуванні",
        desc: "Допоможи нам зробити додаток зручнішим. Завантажуй бета-версію на Android або надішли запит на тестування.",
        btnDownload: "Завантажити APK (Бета)",
        btnGooglePlay: "Запит на бета-тест",
        metaOffline: "✓ Для Android-пристроїв",
        metaFree: "✓ Без створення акаунту в беті",
        metaClean: "✓ Версія для iOS — у планах",
        qrCaption: "Наведи камеру смартфона, щоб надіслати запит на участь у бета-тестуванні"
      },
      faq: {
        badge: "❓ Відповіді на питання",
        title: "Часті запитання",
        q1: "Як Nyamo підбирає страви?",
        a1: "Ти вказуєш наявні інгредієнти вручну або за допомогою фото. Алгоритм порівнює їх із базою рецептів, враховує необхідні пропорції та показує, які страви можна приготувати повністю, а де не вистачає кількох складників.",
        q2: "Як долучитися до бета-тестування?",
        a2: "Ти можеш завантажити поточну тестову збірку для Android прямо з сайту або надіслати запит на пошту buisness@neoflux.fluxmarketplace.store, щоб отримати доступ та ділитися відгуками.",
        q3: "Чи потрібен обліковий запис для використання?",
        a3: "У поточній бета-версії реєстрація та акаунт не потрібні — твої списки та збережений прогрес зберігаються локально на пристрої. У майбутніх версіях плануються акаунти для синхронізації між пристроями.",
        q4: "Як працює додавання продуктів за фото?",
        a4: "Ти фотографуєш продукти на поличці чи столі. Фото відправляється на захищений сервер для розпізнавання, після чого додаток показує діалог перевірки, де ти можеш підтвердити, відредагувати чи прибрати будь-який розпізнаний продукт.",
        q5: "Чи працює Nyamo без інтернету?",
        a5: "Перегляд уже збережених рецептів та ручний підбір доступні офлайн. Інтернет потрібен для розпізнавання нових продуктів за фотографією. Повноцінний автономний режим для каталогу планується розвивати далі.",
        q6: "Чи буде додаток платним або з рекламою?",
        a6: "Під час відкритого бета-тестування додаток доступний безкоштовно. На етапі публічного релізу планується модель із ненав'язливою рекламою та розглядається підписка на додаткові можливості.",
        q7: "Чи планується версія для iOS?",
        a7: "Так, розробка версії для iPhone є в офіційних планах команди. Вона з'явиться після відпрацювання ключових функцій та зворотного зв'язку на Android."
      },
      footer: {
        tagline: "Смачне з того, що є вдома.",
        copyright: "© 2026 Nyamo. Усі права захищено.",
        navHeading: "Навігація",
        navDemo: "Спробувати демо",
        navFeatures: "Можливості",
        navRecipes: "Страви",
        navDownload: "Бета-тест",
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

    pl: {
      meta: {
        title: "Nyamo — Szukaj dań ze swoich składników | Testy beta",
        desc: "Nyamo pomaga znaleźć pomysły na pyszne posiłki ze składników, które masz w domu lub na zdjęciu. Prosty dobór dań, zapis postępów i otwarte testy beta."
      },
      nav: {
        demo: "Wypróbuj demo",
        features: "Możliwości",
        showcase: "Interfejs",
        recipes: "Dania",
        comparison: "Dlaczego Nyamo",
        faq: "FAQ",
        download: "Dołącz do bety"
      },
      styleSwitcher: {
        label: "Styl wizualny:",
        editorial: "A: Editorial Cookbook",
        kinetic: "B: Kinetic Studio",
        minimalist: "C: Sunlit Minimalist"
      },
      hero: {
        badgeMain: "✨ Testy beta aplikacji",
        title: "Masz składniki, ale nie wiesz,<br><span class=\"text-highlight\">co ugotować?</span>",
        titlePre: "Masz składniki, ale nie wiesz,",
        titleHighlight: "co ugotować?",
        subtitle: "Wybierz składniki, które masz w kuchni, lub dodaj je ze zdjęcia. Nyamo zaproponuje dania z katalogu przepisów.",
        ctaDownload: "Dołącz do testów beta",
        ctaDemo: "Wypróbuj demo",
        trustFree: "Dobór z Twoich składników",
        trustOffline: "Dodawanie ze zdjęcia",
        trustRecipes: "Otwarte testy beta",
        trustMatch: "Dobór z Twoich składników",
        trustPhoto: "Dodawanie ze zdjęcia",
        trustBeta: "Otwarte testy beta",
        foodCardTitle: "Aromatyczna szakszuka",
        foodCardTime: "15 min",
        foodCardStatus: "✓ Pasuje do Twoich składników",
        foodCardMissing: "0 do dokupienia",
        foodCardServings: "2 porcje",
        badgeEggs: "Jaja kurze",
        badgeEggsSub: "3 szt. na liście",
        badgeEggsPill: "3 jajka na liście",
        badgeTomatoes: "Dojrzałe pomidory",
        badgeTomatoesSub: "2 szt. na liście",
        badgeCanCook: "✓ Można gotować",
        badgeShakshuka: "Szakszuka z pomidorami",
        badgeAi: "Analiza zdjęcia",
        badgeAiSub: "Google Gemini",
        badgeMissing: "Brakuje: tylko śmietanki"
      },
      playground: {
        badge: "✨ Interaktywne demo",
        title: "Wybierz składniki.<br>Zobacz, co możesz ugotować.",
        desc: "Zaznacz, co masz pod ręką, i zobacz propozycje dań z bazy przepisów. Nyamo pokaże pełne dopasowania lub wskaże brakujące elementy.",
        fridgeLabel: "Twoja wirtualna lodówka",
        selectedCount: "Wybrano: {n}",
        presetLabel: "Szybkie zestawy:",
        presetBreakfast: "Śniadanie",
        presetPotato: "Placki i ziemniaki",
        presetPasta: "Makaron z serem",
        presetReset: "Wyczyść",
        resultsTitle: "Dobrane dania",
        resultsEmpty: "Wybierz składniki powyżej, aby zobaczyć pasujące dania",
        resultsReady: "🟢 Gotowe do przygotowania: {n} {plural}",
        portionsLabel: "Porcje:",
        portion2: "2 porcje",
        portion4: "4 porcje",
        cardReady: "Wszystkie składniki",
        cardReadyText: "✓ Masz wszystkie potrzebne składniki",
        cardMissing: "Brakuje: {n}",
        cardMissingText: "Brakuje: {items}",
        cardViewRecipe: "Zobacz przepis",
        pluralOne: "danie",
        pluralFew: "dania",
        pluralMany: "dań"
      },
      camera: {
        tag: "Dodawanie ze zdjęcia",
        title: "Nie chcesz wpisywać ręcznie?<br>Po prostu zrób zdjęcie.",
        desc: "Zrób zdjęcie produktów na półce lub blacie. Nyamo rozpozna składniki i pozwoli Ci sprawdzić listę przed doborem przepisów.",
        labelTomatoes: "Pomidory",
        labelEggs: "Jajka",
        labelCheese: "Ser",
        labelMilk: "Mleko",
        labelOnion: "Cebula",
        labelHerbs: "Zielenina",
        flowPhoto: "Zdjęcie",
        flowDetected: "Przykład rozpoznania: 6 składników",
        readyDishes: "8 dań w katalogu",
        recipe1Title: "Aromatyczna szakszuka",
        recipe1Meta: "⏱ 25 min • 🍳 Płyta",
        recipe2Title: "Puszysty omlet mleczny",
        recipe2Meta: "⏱ 10 min • 🍳 Patelnia",
        viewRecipe: "Zobacz przepis",
        badgeReady: "✓ Wszystkie składniki"
      },
      cooking: {
        tag: "Krok po kroku",
        title: "Przejrzyste instrukcje<br>podczas gotowania.",
        desc: "Aplikacja prowadzi Cię przez proces krok po kroku, bez gubienia się w długim tekście przepisu.",
        handsFree: "Podgląd demonstracyjny ekranu gotowania w aplikacji.",
        previewNote: "Podgląd demonstracyjny ekranu gotowania w aplikacji.",
        recipeTitle: "Szakszuka z pomidorami",
        stepCountLabel: "Krok {n} z {total}",
        step3Num: "Krok 3 z 7",
        step3Text: "Dodaj pomidory i duś na średnim ogniu.",
        step3Sub: "Gotuj na średnim ogniu przez około 5–7 minut.",
        step4Num: "Krok 4 z 7",
        step4Text: "Wbij jajka i przykryj patelnię.",
        step4Sub: "Gotuj pod przykryciem przez około 4–5 minut.",
        timerRemaining: "orientacyjnie",
        btnBack: "← Wstecz",
        btnNext: "Dalej →",
        floatingStep: "Krok 3 / 7",
        floatingStepNext: "Krok 4 / 7",
        floatingTimer: "05:00"
      },
      discovery: {
        tag: "Pomysły na dania",
        title: "Na dziś na pewno<br>znajdziesz coś pysznego.",
        subtitle: "Od szybkiego śniadania po sycącą kolację z tego, co już czeka w lodówce. Proste domowe posiłki na co dzień.",
        quote: "Mniej myślenia.<br>Więcej gotowania.",
        readyBadge: "Komplet składników",
        recipeShakshuka: "Szakszuka z pomidorami",
        recipeShakshukaMeta: "25 min",
        recipePasta: "Kremowy makaron",
        recipePastaMeta: "20 min",
        recipeSyrnyky: "Domowe syrniki",
        recipeSyrnykyMeta: "25 min",
        recipeChicken: "Kurczak w ziołach",
        recipeChickenMeta: "30 min",
        recipePotatoes: "Chrupiące ziemniaki",
        recipePotatoesMeta: "35 min",
        recipeOmelette: "Puszysty omlet",
        recipeOmeletteMeta: "10 min"
      },
      features: {
        badge: "💡 Dlaczego Nyamo",
        title: "Stworzone do codziennego gotowania",
        desc: "Pomaga szybko podjąć decyzję o posiłku, bez chaosu i skomplikowanych opcji.",
        b1Num: "01",
        b1Title: "Dobór ze składników w domu",
        b1Text: "Zaznacz, co masz w kuchni — Nyamo znajdzie pasujące dania i wskaże ewentualne brakujące produkty.",
        b2Num: "02",
        b2Title: "Dodawanie produktów ze zdjęcia",
        b2Text: "Zrób zdjęcie półki w lodówce, potwierdź rozpoznane produkty w oknie dialogowym i od razu przeglądaj dania.",
        b3Num: "03",
        b3Title: "Proste codzienne posiłki",
        b3Text: "Baza łatwych domowych dań bez wyszukanych składników, sukcesywnie rozwijana wspólnie z testerami."
      },
      brandStatement: {
        title: "Nyamo nie zaczyna od listy zakupów.<br>Nyamo zaczyna od tego, co masz w kuchni.",
        fact1: "Dobór dań z tego, co masz",
        fact2: "Dodawanie ze zdjęcia",
        fact3: "Wpływ na rozwój w becie"
      },
      download: {
        badge: "📱 Testy beta",
        title: "Wypróbuj Nyamo w wersji beta",
        desc: "Pomóż nam ulepszyć aplikację. Pobierz wersję testową na Androida lub wyślij zgłoszenie beta-testera.",
        btnDownload: "Pobierz APK (Beta)",
        btnGooglePlay: "Zgłoś się do bety",
        metaOffline: "✓ Dla urządzeń z Androidem",
        metaFree: "✓ Bez konieczności konta w becie",
        metaClean: "✓ Wersja iOS — w planach",
        qrCaption: "Skieruj aparat telefonu, aby wysłać zgłoszenie do testów beta"
      },
      faq: {
        badge: "❓ Pytania i odpowiedzi",
        title: "Często zadawane pytania",
        q1: "Jak Nyamo dobiera dania?",
        a1: "Podajesz posiadane składniki ręcznie lub za pomocą zdjęcia. Algorytm porównuje je z bazą przepisów, uwzględniając proporcje, i pokazuje dania gotowe do zrobienia oraz te, do których brakuje kilku składników.",
        q2: "Jak dołączyć do testów beta?",
        a2: "Możesz pobrać aktualną wersję testową na Androida bezpośrednio ze strony lub wysłać wiadomość na buisness@neoflux.fluxmarketplace.store, aby otrzymać dostęp i przekazywać swoje uwagi.",
        q3: "Czy do korzystania z aplikacji potrzebne jest konto?",
        a3: "W obecnej wersji beta rejestracja i konto nie są wymagane — Twoje listy produktów i postępy są zapisywane lokalnie na urządzeniu. W przyszłych wersjach planujemy konta do synchronizacji danych między urządzeniami.",
        q4: "Jak działa dodawanie produktów ze zdjęcia?",
        a4: "Robisz zdjęcie półki w lodówce lub blatu. Zdjęcie trafia do bezpiecznej analizy rozpoznawania, po czym aplikacja wyświetla okno sprawdzania, w którym możesz potwierdzić, edytować lub usunąć rozpoznane składniki.",
        q5: "Czy Nyamo działa bez internetu?",
        a5: "Przeglądanie zapisanych przepisów i ręczny dobór działają w trybie offline. Połączenie z internetem jest wymagane do rozpoznawania produktów ze zdjęcia. Pełny tryb offline dla całego katalogu będzie dalej rozwijany.",
        q6: "Czy aplikacja będzie płatna lub zawierać reklamy?",
        a6: "Podczas otwartych testów beta aplikacja jest dostępna bezpłatnie. W wersji publicznej planowany jest model z nienachalnymi reklamami oraz rozważana jest subskrypcja na dodatkowe funkcje.",
        q7: "Czy planowana jest wersja na iOS?",
        a7: "Tak, stworzenie wersji na iPhone'a znajduje się w oficjalnych planach zespołu. Pojawi się ona po dopracowaniu kluczowych funkcji i zebraniu opinii z wersji na Androida."
      },
      footer: {
        tagline: "Pyszne posiłki z tego, co masz w domu.",
        copyright: "© 2026 Nyamo. Wszelkie prawa zastrzeżone.",
        navHeading: "Nawigacja",
        navDemo: "Wypróbuj demo",
        navFeatures: "Możliwości",
        navRecipes: "Dania",
        navDownload: "Testy beta",
        privacyHeading: "Wsparcie i prywatność",
        privacyPolicy: "Polityka prywatności",
        support: "Kontakt z twórcą"
      },
      modal: {
        readyBadge: "🟢 Można gotować",
        missingBadge: "🔴 Brakuje składników",
        portionsHeading: "Składniki na {n} {plural}:",
        stepsHeading: "Krok po kroku:",
        btnCook: "Gotuj w aplikacji Nyamo"
      }
    },

    en: {
      meta: {
        title: "Nyamo — Find Dishes From Your Ingredients | Beta Testing",
        desc: "Nyamo helps you discover delicious meal ideas from ingredients you already have at home or on photo. Simple meal matching, saved progress, and open beta testing."
      },
      nav: {
        demo: "Try Demo",
        features: "Features",
        showcase: "App Screens",
        recipes: "Dishes",
        comparison: "Why Nyamo",
        faq: "FAQ",
        download: "Join Beta"
      },
      styleSwitcher: {
        label: "Visual Direction:",
        editorial: "A: Editorial Cookbook",
        kinetic: "B: Kinetic Studio",
        minimalist: "C: Sunlit Minimalist"
      },
      hero: {
        badgeMain: "✨ App Beta Testing",
        title: "Got ingredients, but no idea<br><span class=\"text-highlight\">what to cook?</span>",
        titlePre: "Got ingredients, but no idea",
        titleHighlight: "what to cook?",
        subtitle: "Choose what you have at home or add ingredients from a photo. Nyamo suggests meals from its recipe collection.",
        ctaDownload: "Join the Beta",
        ctaDemo: "Try the Demo",
        trustFree: "Match from your ingredients",
        trustOffline: "Add with a photo",
        trustRecipes: "Open beta testing",
        trustMatch: "Match from your ingredients",
        trustPhoto: "Add with a photo",
        trustBeta: "Open beta testing",
        foodCardTitle: "Aromatic Shakshuka",
        foodCardTime: "15 min",
        foodCardStatus: "✓ Matches your ingredients",
        foodCardMissing: "0 needed",
        foodCardServings: "2 servings",
        badgeEggs: "Fresh Eggs",
        badgeEggsSub: "3 pcs on list",
        badgeEggsPill: "3 eggs on list",
        badgeTomatoes: "Ripe Tomatoes",
        badgeTomatoesSub: "2 pcs on list",
        badgeCanCook: "✓ Ready to Cook",
        badgeShakshuka: "Tomato Shakshuka",
        badgeAi: "Photo Analysis",
        badgeAiSub: "Google Gemini",
        badgeMissing: "Missing: only cream"
      },
      playground: {
        badge: "✨ Interactive Preview",
        title: "Pick your ingredients.<br>See what you can cook.",
        desc: "Select what's in your kitchen and discover matching recipes. Nyamo highlights complete matches or points out what's missing.",
        fridgeLabel: "Your Virtual Fridge",
        selectedCount: "Selected: {n}",
        presetLabel: "Quick presets:",
        presetBreakfast: "Breakfast",
        presetPotato: "Pancakes & Potatoes",
        presetPasta: "Cheese Pasta",
        presetReset: "Clear",
        resultsTitle: "Matched Dishes",
        resultsEmpty: "Select ingredients above to see matching dishes",
        resultsReady: "🟢 Ready to cook: {n} {plural}",
        portionsLabel: "Portions:",
        portion2: "2 portions",
        portion4: "4 portions",
        cardReady: "All Ingredients Ready",
        cardReadyText: "✓ You have all the required ingredients",
        cardMissing: "Missing: {n}",
        cardMissingText: "Missing: {items}",
        cardViewRecipe: "View Recipe",
        pluralOne: "dish",
        pluralFew: "dishes",
        pluralMany: "dishes"
      },
      camera: {
        tag: "Add From Photo",
        title: "Don't feel like typing?<br>Just take a photo.",
        desc: "Snap a picture of what's on your counter or fridge shelf. Nyamo detects the ingredients and lets you review the list before finding recipes.",
        labelTomatoes: "Tomatoes",
        labelEggs: "Eggs",
        labelCheese: "Cheese",
        labelMilk: "Milk",
        labelOnion: "Onion",
        labelHerbs: "Herbs",
        flowPhoto: "Photo",
        flowDetected: "Detection sample: 6 items",
        readyDishes: "8 dishes in collection",
        recipe1Title: "Aromatic Shakshuka",
        recipe1Meta: "⏱ 25 min • 🍳 Stovetop",
        recipe2Title: "Fluffy Milk Omelette",
        recipe2Meta: "⏱ 10 min • 🍳 Pan",
        viewRecipe: "View Recipe",
        badgeReady: "✓ All ingredients in kitchen"
      },
      cooking: {
        tag: "Step-by-Step Mode",
        title: "Clear guidance<br>while you cook.",
        desc: "The app guides you step by step so you never get lost in a block of recipe text.",
        handsFree: "Preview of the guided cooking screen in the Nyamo app.",
        previewNote: "Preview of the guided cooking screen in the Nyamo app.",
        recipeTitle: "Tomato Shakshuka",
        stepCountLabel: "Step {n} of {total}",
        step3Num: "Step 3 of 7",
        step3Text: "Add tomatoes and simmer over medium heat.",
        step3Sub: "Cook over medium heat for about 5–7 minutes.",
        step4Num: "Step 4 of 7",
        step4Text: "Crack in the eggs and cover the pan.",
        step4Sub: "Cook covered for about 4–5 minutes.",
        timerRemaining: "approximate",
        btnBack: "← Back",
        btnNext: "Next →",
        floatingStep: "Step 3 / 7",
        floatingStepNext: "Step 4 / 7",
        floatingTimer: "05:00"
      },
      discovery: {
        tag: "Recipe Ideas",
        title: "You definitely have<br>something good to cook.",
        subtitle: "From quick breakfasts to satisfying dinners made from everyday kitchen staples. Wholesome home meals for every day.",
        quote: "Less wondering.<br>More cooking.",
        readyBadge: "All items ready",
        recipeShakshuka: "Tomato Shakshuka",
        recipeShakshukaMeta: "25 min",
        recipePasta: "Creamy Pasta",
        recipePastaMeta: "20 min",
        recipeSyrnyky: "Cottage Cheese Syrnyky",
        recipeSyrnykyMeta: "25 min",
        recipeChicken: "Herb Chicken Fillet",
        recipeChickenMeta: "30 min",
        recipePotatoes: "Crispy Garlic Potatoes",
        recipePotatoesMeta: "35 min",
        recipeOmelette: "Fluffy Omelette",
        recipeOmeletteMeta: "10 min"
      },
      features: {
        badge: "💡 Why Nyamo",
        title: "Designed for Everyday Cooking",
        desc: "Helps you decide what to eat quickly, without clutter, ads overload, or complex setups.",
        b1Num: "01",
        b1Title: "Match from What You Have",
        b1Text: "Tell Nyamo what's in your kitchen and discover meals you can make, with clear notes on any missing items.",
        b2Num: "02",
        b2Title: "Add Items with a Photo",
        b2Text: "Take a quick photo of your fridge shelf, review detected items in the confirmation dialog, and browse recipes.",
        b3Num: "03",
        b3Title: "Simple Everyday Recipes",
        b3Text: "A growing collection of familiar home recipes made from basic ingredients, expanded together with our beta community."
      },
      brandStatement: {
        title: "Nyamo doesn't start with a grocery list.<br>Nyamo starts with what's already in your kitchen.",
        fact1: "Match with what you have",
        fact2: "Add ingredients from photo",
        fact3: "Shape the product in beta"
      },
      download: {
        badge: "📱 Beta Testing",
        title: "Try Nyamo in Beta Testing",
        desc: "Help us shape the app. Download the Android beta build or send us a note to join the testing group.",
        btnDownload: "Download APK (Beta)",
        btnGooglePlay: "Request Beta Access",
        metaOffline: "✓ For Android devices",
        metaFree: "✓ No account required in beta",
        metaClean: "✓ iOS version in roadmap",
        qrCaption: "Scan with your phone camera to request beta access via email"
      },
      faq: {
        badge: "❓ Questions & Answers",
        title: "Frequently Asked Questions",
        q1: "How does Nyamo match recipes?",
        a1: "You enter your ingredients manually or snap a photo. The app matches them against the recipe catalog, accounts for amounts, and indicates which dishes you can make right away and which ones need a couple of extra items.",
        q2: "How do I join the beta testing?",
        a2: "You can download the current Android test APK directly from our website or email us at buisness@neoflux.fluxmarketplace.store to request access and share your feedback.",
        q3: "Do I need an account to use Nyamo?",
        a3: "In the current beta release, no account or registration is required — your ingredients and saved cooking progress stay locally on your device. Accounts and cloud sync are planned for future releases.",
        q4: "How does photo ingredient scanning work?",
        a4: "You take a photo of your fridge shelf or counter. The image is securely processed to suggest ingredient names, after which Nyamo shows a review dialog where you can edit, confirm, or remove any item before saving.",
        q5: "Does Nyamo work offline?",
        a5: "Browsing saved recipes and manual ingredient matching work offline. An internet connection is required for photo recognition. Expanded offline capabilities are planned as the catalog grows.",
        q6: "Will Nyamo be paid or show ads?",
        a6: "During open beta testing, the app is completely free. In the public release, we plan an unobtrusive ad-supported tier and are considering a subscription for premium features.",
        q7: "Is an iOS version planned?",
        a7: "Yes, an iPhone version is officially on our roadmap. It will be released following feature stabilization and feedback on Android."
      },
      footer: {
        tagline: "Great food from what you have at home.",
        copyright: "© 2026 Nyamo. All rights reserved.",
        navHeading: "Navigation",
        navDemo: "Try Demo",
        navFeatures: "Features",
        navRecipes: "Dishes",
        navDownload: "Beta",
        privacyHeading: "Support & Privacy",
        privacyPolicy: "Privacy Policy",
        support: "Developer Support"
      },
      modal: {
        readyBadge: "🟢 Ready to Cook",
        missingBadge: "🔴 Missing Ingredients",
        portionsHeading: "Ingredients for {n} {plural}:",
        stepsHeading: "Step-by-Step Instructions:",
        btnCook: "Cook in Nyamo App"
      }
    }
  };

  /**
   * Detects the visitor's ideal language:
   * 1. URL search param (?lang=)
   * 2. localStorage saved preference
   * 3. Browser languages (navigator.languages / navigator.language)
   * 4. User timezone heuristics (Europe/Kyiv, Europe/Warsaw, etc.)
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
      if (timeZone.includes('Warsaw')) {
        return 'pl';
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
      if (code === 'pl') {
        return 'pl';
      }
      if (code === 'en') {
        return 'en';
      }
    }

    // Fallback: If not recognized, default to 'uk'
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
    const flags = { uk: '🇺🇦', pl: '🇵🇱', en: '🇬🇧' };
    const codes = { uk: 'UA', pl: 'PL', en: 'EN' };

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

if (typeof window !== 'undefined') {
  window.NyamoI18n = NyamoI18n;
}

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', NyamoI18n.init);
} else {
  NyamoI18n.init();
}
