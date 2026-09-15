# Beszélgetésnapló — PHP interjúfelkészítő

*2026. szeptember 9–10.*

Ez a napló azért készült, hogy a munka máshol is folytatható legyen ugyanabból a pontból: minden kérés, a rá adott döntés, és ami elkészült.

---

## 1. kör — A kiinduló kérés

> **Laslow:** „I want to be prepared for a PHP interview. Give me concise descriptions and simple code examples of all major object oriented concepts in php and PSRs.”

**Tisztázó kérdések, és a válaszaid:**

| Kérdés | Választott opció |
|---|---|
| Milyen szintre lőjük be? | **Senior / architect** — SOLID, tervezési minták, DI-konténerek, késői statikus kötés, kovariancia, readonly, enumok, teljes PSR-lista PSR-11/14/15/20-szal és middleware-példákkal |
| Melyik PHP-verziót célozzák a példák? | **PHP 8.3+** — konstruktoros promóció, enumok, readonly, névvel ellátott argumentumok, first-class callable-ök, típusos konstansok |

**Ellenőrzés készítés előtt:** a PSR-státuszok visszaellenőrizve a php-fig.org jegyzékéből, mert a PSR-12 / PER Coding Style viszonya változott, és emlékezetből könnyű elrontani.

Megállapított tények:
- 14 elfogadott, 4 tervezet, 3 elvetett, 2 elavult PSR
- A PSR-12 **formálisan elfogadott marad**, de a PER-CS (akkor **3.1**) „kiterjeszti, kibővíti és leváltja”
- A PSR-8 (Huggable) áprilisi tréfa, elvetett

**Elkészült:** az első artifact, „PHP OOP & PSR Field Guide” — objektummodell (19 téma), tervezés (3 téma), szabványok (9 téma), gyorstűz (12 válasz). Ragadós tartalomjegyzék, témaszűrő, világos/sötét téma, minden témán „Asked as” blokk.

---

## 2. kör — Szemétgyűjtés

> **Laslow:** „i'm missing the concept of garbage collection”

**Bekerült** az objektummodell záró témájaként, plusz két gyorstűz-sor.

A lényeg, ahogy a doksiban szerepel:
- A **referenciaszámlálás** végzi a munka nagy részét; nullánál azonnal felszabadít — ezért determinisztikus a `__destruct()` a PHP-ban, a Javával vagy C#-pal ellentétben. Az `unset()` csak csökkent.
- A **ciklusgyűjtő** kizárólag azt kezeli, amit a refcount nem tud: az egymásra hivatkozó objektumokat. Mark-and-sweep egy gyökérpufferen (alapból 10 000 gyökér, Bacon–Rajan algoritmus), tehát a szünet a puffer méretével arányos, nem a heapével.
- A **`WeakReference` (7.4) / `WeakMap` (8.0)** az igazi megoldás: nem növelik a refcountot, így a ciklus létre sem jön.
- A **hol fáj** rész: FPM alatt a kérés végén minden lebomlik; hosszan futó workerekben (Swoole, RoadRunner, queue worker) a ciklus addig halmozódik, míg a `memory_limit` le nem lövi a folyamatot — ezért indít újra a Horizon és a Messenger N feladat után.

---

## 3. kör — Active Record és adatszerkezetek

> **Laslow:** „add to design: active record and implementation of data structures compared to python”

**Két új téma a Tervezés részben:**

**Active Record vs Data Mapper** — összehasonlító panel, az Eloquent és a Doctrine hívási helye egymás mellett, majd egy kézzel írt minimális `ActiveRecord` ősosztály, mert ez gyakori táblás feladat. A példa szándékosan három korábbi témát használ újra: LSB a `new static()`-hoz, `__get`/`__set` az attribútumokhoz, és piszkos mezők követése, hogy a `save()` csak a változott oszlopokat írja. Külön kiemelve az N+1 probléma mint a megnevezendő hibamód.

**Adatszerkezetek Pythonhoz mérve** — teljes megfeleltetési táblázat, plusz a két fogalmi különbség, ami igazán számít:
1. A Python szétválasztja a `list`-et és a `dict`-et; a PHP-ban egyetlen `array` játssza mindkét szerepet (rendezett hash map, tömör alakra optimalizálva folytonos egész kulcsoknál).
2. **A PHP-tömb értéktípus copy-on-write-tal; a Python listája és szótára referencia.** `$b = $a; $b[] = 4;` után az `$a` érintetlen — a Python fordítottja. A PHP objektumai viselkednek úgy, mint a Python módosítható típusai.

Megjegyzendő komplexitási csapda: az `array_shift()` O(n), mert újraindexel, míg a `deque.popleft()` O(1) — ezért kell `SplQueue` egy worker ciklusban.

---

## 4. kör — Strict mód

> **Laslow:** „one last thing: strict mode in php (compared to Java)”

**Bekerült** a típusrendszer téma után, nyolcsoros Java-összevetéssel.

A három szabály:
1. **Fájlonként érvényes, és a hívó fájl dönt** — nem az, ahol a függvényt deklarálták.
2. **Csak skalárokra hat** (`int`, `float`, `string`, `bool`); az osztálytípusokat a PHP sosem konvertálta.
3. **Egyetlen bővítés marad:** `int` → `float`. Még a veszteségmentes `1500.0` sem megy `int` paraméterbe.

A megfogalmazás, ami leül: **a strict mód hangosan hibázóvá teszi a PHP-t a csendes helyett — statikusan típusossá nem.** A Java fordítási időben ellenőriz; a PHP futásidőben dob `TypeError`-t. És a PHP-ban nincs nyelvi generikus: a `list<User>` docblockban él, amit csak a PHPStan vagy a Psalm olvas.

Két csapda: semmi köze a JavaScript `"use strict"`-jéhez vagy a Java `strictfp`-jéhez; és tényleg a fájl első utasításának kell lennie.

---

## 5. kör — Mi hiányzik még?

> **Laslow:** „is there anything else worth to know about PHP for this interview?”

Felsorolt hiányterületek fontossági sorrendben: biztonság, futásidő/teljesítmény, tesztelés, Composer, adatbázisok, párhuzamosság, verziótörténet.

**Választásod:** mind a hét.

**Ellenőrzés készítés előtt:** a PHP 8.4 és 8.5 újdonságai, valamint a támogatottsági állapot visszaellenőrizve a php.net-ről.

Megállapított tények:
- **PHP 8.5 — 2025. november 20.:** pipe operátor `|>`, `clone with`, `#[\NoDiscard]`, URI kiterjesztés, closure-ök konstans kifejezésekben, `array_first()`/`array_last()`, perzisztens cURL share handle-ök
- **PHP 8.4 — 2024. november:** property hookok, aszimmetrikus láthatóság, `#[\Deprecated]`, új DOM API HTML5-tel, `BcMath\Number`, `array_find/any/all()`, lusta objektumok, átdolgozott JIT
- **Támogatottság 2026 szeptemberében:** 8.5 aktív 2027 végéig, 8.4 aktív 2026 végéig, 8.3 biztonsági javítás 2027 végéig, **8.0 és 8.1 lejárt**

**Elkészült:** négy új rész — Biztonság (4 téma), Futásidő és üzemeltetés (3), Eszközök (2), Zárás kibővítve a 8.0 → 8.5 idővonallal. Az anyag ezzel 46 témára nőtt.

---

## 6. kör — Magyar fordítás

> **Laslow:** „one final step: translate the whole doc to Hungarian”

**Elkészült** egy külön magyar artifact, „PHP OOP és PSR kézikönyv” — az angol változat érintetlenül megmaradt.

Fordítási döntések:
- **A kód angol marad** (azonosítók, osztálynevek, kulcsszavak), ahogy egy valódi kódbázisban lenne. Magyar lett viszont: a kommentek, a kivételüzenetek és a data provider címkéi.
- **Szakkifejezések:** ahol van bevett magyar alak, az szerepel (egységbezárás, öröklődés, késői statikus kötés, szemétgyűjtés, névtér, előkészített lekérdezés); ahol erőltetett lenne, marad az angol (trait, closure, middleware, factory, mock, stub).
- **„Asked as” → „Így kérdezik”**, státuszcímkék: Elfogadott / Elavult / Tervezet / Elvetett.
- Azonos horgonyok és szerkezet, hogy a két változat egymás mellett használható legyen.

---

## 7. kör — Letöltés kontextussal

> **Laslow:** „szeretném ezeket letölteni kontextussal együtt.”

**Választásod:** kísérődokumentum **és** teljes beszélgetésnapló.

**Elkészült:** ez a négyfájlos csomag. A két HTML önálló dokumentummá lett alakítva (`<!doctype html>`, `<meta charset="utf-8">`, viewport), hogy fájlrendszerből megnyitva is helyesen jelenjen meg — az ékezetek miatt a charset itt nem opcionális.

---

## 8. kör — Nyitóoldal és a stílusok kiemelése

> **Laslow:** „create an index.html file. use styles from guides. create two cards with links to the guides.”
>
> **Laslow:** „extract styles, make it dry”

**Elkészült** az `index.html`: a kézikönyvek mellé egy nyitóoldal, kártyákkal.

Az első változat még saját `<style>` blokkot vitt, a guide-ok palettájából másolva. A második kérés ezt szedte szét — kiderült, hogy a két guide CSS-e **bájtra azonos** volt, tehát a duplikáció már előtte is megvolt:

- `assets/base.css` — design tokenek (világos/sötét/`data-theme`), reset, `body`, `.wrap`, fejléc, `.pill`, linkek, lábléc. Mind a kilenc oldal ezt tölti.
- `assets/guide.css` — csak a kézikönyv-oldalaké: elrendezés, ragadós tartalomjegyzék, szűrő, témablokkok, kód, táblázatok, `.versus`, `.rapid`.
- `assets/index.css` — csak a nyitóoldal kártyái.
- `assets/guide.js` — a tartalomjegyzék-követő és a témaszűrő, ami szintén azonos volt a két guide-ban.

Két apróság, ami a kiemeléssel javult: a `.wrap` szélessége tokenné vált (`--wrap`), így a nyitóoldal felülírja a szabály újradeklarálása helyett; a nyitóoldal nyelvi címkéje pedig a guide-ok meglévő `.pill.ok` módosítóját használja, nem egy második beégetett zöldet.

A betűtípus-`<link>` szándékosan maradt minden oldal `<head>`-jében: `@import`-tal a stíluslap mögé sorolódna a fontkérés.

---

## 9. kör — Három új kézikönyv angolul

> **Laslow:** „the readme.md has a section »Amit érdemes még átnézni az interjú előtt…«. following the english php guide, create separated guides for the http and api, the authentication, and the architect part in english first. update index.html with these card links.”

**Elkészült** a README kimaradt-listájának első három pontja, egy-egy önálló kézikönyvként, az angol PHP-guide szerkezetét követve: fejléc, ragadós és szűrhető tartalomjegyzék, részek témaszámmal, témánként egy legrövidebb működő példa, „Asked as” zárás, végül gyorstűz-rész.

| Kézikönyv | Témák | Súlypontok |
|---|---|---|
| HTTP & API Design | 18 | Keyset lapozás, idempotencia-kulcsok, optimista párhuzamosság, token bucket Redisben, RFC 9457, verziózás |
| Authentication & Authorization | 17 | Munkamenet vs JWT a valódi kompromisszummal, JWT-támadások, refresh rotáció újrafelhasználás-észleléssel, PKCE, policy-alapú kikényszerítés, IDOR |
| Architecture Above the Code | 16 | Függőségi szabály, portok és adapterek, aggregátumok, CQRS pontosan, outbox, event sourcing a költségeivel, sagák, ADR-ek, strangler fig |

Tartalmi döntés mindhárom anyagnál: nem a minta ismertetése a cél, hanem a **kompromisszum kimondása**. Ezért van külön téma arra, hogy mikor <em>ne</em> használj event sourcingot, miért árulkodó jel a JWT-feketelista, és miért nem válasz az, hogy „a mikroszolgáltatások jobban skálázódnak”.

A kódpéldák PHP-ban maradtak, mert az interjú PHP-s; a HTTP- és JSON-részletekhez a `prism-http` és `prism-json` komponens került be, plusz néhány token-szín a `guide.css`-be.

Az `index.html` ezzel öt kártyára nőtt, két csoportban: „The core guide” és „Beyond the language”.

---

## 10. kör — Felső navigációs sáv

> **Laslow:** „create a top navbar in the guides pointing to homepage and other guides (only same language guides)”

**Elkészült** a `.topbar` a `guide.css`-ben, és a jelölés minden kézikönyv-oldal tetején: balra vissza a nyitóoldalra, jobbra a testvérkézikönyvek, az aktuális oldal `aria-current="page"`-dzsel kiemelve.

A megkötés a nyelvi szűrés volt: az angol oldalak csak angol oldalakra mutatnak, a magyarok csak magyarokra. Ekkor még csak egy magyar guide létezett, tehát a magyar sáv egyetlen (önmagára mutató) elemmel indult — a 11. körben töltődött fel.

A sáv szándékosan **nem ragadós**: a tartalomjegyzék `position: sticky`, egy ragadós fejléc ráülne, és elrontaná a témák `scroll-margin-top`-ját.

---

## 11. kör — A három új kézikönyv magyarul

> **Laslow:** „now translate the three new guides to hungarian following 6th point in naplo.md”

**Elkészült** mindhárom magyar változat, a 6. körben rögzített fordítási szabályok szerint:

- **A kód angol maradt** — azonosítók, osztálynevek, SQL, Lua, HTTP-minták. Magyar lett a kommentek, a példák hibaüzenetei és a problem details példa `title`/`message` mezői.
- **Bevett magyar alak, ahol van:** munkamenet, hitelesítés, jogosultságkezelés, erőforrás, előfeltétel, kompenzáló művelet, aggregátum, értékobjektum, függőséginverzió, konzisztenciahatár. Ahol erőltetett lenne, marad az angol: token, scope, claim, middleware, policy, grant, PKCE, CQRS, event sourcing, saga, outbox, strangler fig, seam, bounded context (egyszer glosszázva: határolt kontextus).
- **„Asked as” → „Így kérdezik”** mind az 51 blokkban.
- **Azonos horgonyok és szerkezet:** géppel ellenőrizve, hogy a rész- és témaazonosítók sorrendhelyesen megegyeznek, és hogy a kódblokkok, táblázatok, `.versus` panelek, jegyzetek és „Így kérdezik” sorok darabszáma is egyezik az angol eredetivel.

A magyar navigációs sáv ezzel négyelemű lett, a nyitóoldal pedig nyolc kártyás — minden témakör mindkét nyelven.

---

## Ha máshol folytatnád

Amit érdemes átadni a következő beszélgetésnek:

1. Senior szintű PHP interjúra készülök, magyar anyanyelvvel, valószínűleg magyar cégnél.
2. Van egy **97 témás, négy témakörös** felkészítő anyagom, mind a négy két nyelven (nyolc HTML a `guides/` alatt, plusz az `index.html` nyitóoldal): PHP OOP és PSR (46) · HTTP és API-tervezés (18) · autentikáció és jogosultságkezelés (17) · architektúra a kódszint fölött (16).
3. A stílus, amit kérek: rövid leírás, a legkisebb működő kódpélda, és minden témánál az a kérdésforma, ahogy interjún elhangzik („Így kérdezik” / „Asked as”).
4. Példák PHP 8.3+ alapon, a 8.4/8.5 újdonságai külön jelölve.
5. Szerkezeti megkötések, ha új kézikönyv készül: a stíluslapok közösek az `assets/` alatt (ne kerüljön `<style>` blokk az oldalakba), a magyar és az angol változat horgonyai azonosak, és a felső navigációs sáv csak azonos nyelvű oldalakra mutat.

A `README.md` végén ott van az a lista is, ami továbbra is kimaradt (frontend-illesztés, a cég konkrét stackje, gyakorlati algoritmusok) — ha az álláshirdetés valamelyiket említi, azzal érdemes folytatni. A HTTP/API, az autentikáció és az architektúra időközben elkészült.
