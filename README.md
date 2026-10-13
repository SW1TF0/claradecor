# Клара Декор – уебсайт

Статичен едностраничен сайт за **Клара Декор** – цветен бутик в Кърджали, лауреат на „Златна фирма“.
Без build стъпки: само `index.html`, `assets/` и `images/`.

Социални мрежи: [Facebook](https://www.facebook.com/KlaraDecor/) · [Instagram](https://www.instagram.com/butik_klaradecor/)

## Какво трябва да попълните

Facebook и Instagram не позволиха автоматично извличане, затова снимките трябва да се добавят ръчно:

- Снимки – вижте [`images/README.md`](images/README.md)

Проверете и текстовете в „За нас“ и „Колекции“ – написани са общо за бутик за декорация и подаръци; редактирайте според реалния асортимент.

## Локален преглед

Отворете `index.html` в браузър, или:

```sh
python3 -m http.server 8000
```

## Публикуване (GitHub Pages)

1. В GitHub: **Settings → Pages**
2. **Source:** Deploy from a branch → `main` / `(root)` → Save
3. Сайтът ще е достъпен на `https://sw1tf0.github.io/claradecor/`

Може да се добави и собствен домейн (напр. `klaradecor.bg`) от същата страница.

## Езици

Сайтът е на български, английски, турски и руски (бутоните BG / EN / TR / RU горе вдясно).
Българският текст е в `index.html`, преводите са в `assets/i18n.js` под същите ключове (`data-i18n="..."`).
Линк директно към език: `?lang=en`, `?lang=tr`, `?lang=ru`.

След промяна в `assets/style.css`, `assets/main.js` или `assets/i18n.js` сменете числото `?v=...` в `index.html`, за да не зареждат браузърите старата версия от кеша.
