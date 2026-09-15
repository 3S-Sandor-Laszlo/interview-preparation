# PHP interjúfelkészítő csomag

*Készült: 2026. szeptember 9–10. · Laslow részére*

Ez a csomag egy senior szintű PHP állásinterjúra készült felkészítő anyagot tartalmaz, angolul és magyarul, valamint az elkészülés kontextusát: milyen kérések alapján épült, milyen döntések születtek, és mi maradt szándékosan kívül.

Négy témakör, mindegyik két nyelven — összesen **97 téma nyolc kézikönyvben**, egy közös nyitóoldalról elérhetően.

---

## A csomag tartalma

| Fájl | Mi ez |
|---|---|
| `index.html` | Nyitóoldal: kártyák mind a nyolc kézikönyvhöz, nyelv szerint csoportosítva. Innen érdemes indulni. |
| `guides/php-en.html` · `php-hu.html` | Az alapanyag. 46 téma, 7 fő rész. |
| `guides/http-api-en.html` · `http-api-hu.html` | HTTP és API-tervezés. 18 téma, 5 rész. |
| `guides/auth-en.html` · `auth-hu.html` | Autentikáció és jogosultságkezelés. 17 téma, 5 rész. |
| `guides/architecture-en.html` · `architecture-hu.html` | Architektúra a kódszint fölött. 16 téma, 5 rész. |
| `assets/` | A közös stíluslapok (`base.css`, `guide.css`, `index.css`) és a közös oldalszkript (`guide.js`). |
| `naplo.md` | A teljes munkamenet lépésről lépésre: mit kértél, mi készült el, milyen indoklással. |
| `README.md` | Ez a fájl. |

A HTML-ek dupla kattintással megnyílnak böngészőben, nem kell hozzájuk szerver — de a mappaszerkezetet **együtt kell tartani**, mert a stíluslapok és a szkript az `assets/` könyvtárból, relatív hivatkozással töltődnek. (Korábban minden egyetlen fájlban volt; a nyolc oldal közös megjelenése miatt lett külön.)

Minden kézikönyv tetején egy navigációs sáv áll: vissza a nyitóoldalra, és át a többi kézikönyvre — **csak az azonos nyelvűekre**, hogy egy magyar olvasás közben ne kerülj véletlenül angol oldalra.

**Offline korlát:** a betűtípus (Google Fonts) és a kódszínezés (Prism, cdnjs) hálózatról töltődik. Internet nélkül a szöveg rendszerbetűvel, a kódrészletek szín nélkül jelennek meg — minden más, a szerkezet, a szűrő és a témaváltás is, tökéletesen működik. Ha kell teljesen offline változat, szólj, és beágyazom mindegyiket.

**Online változatok:** a két eredeti oldal publikált artifactként is elérhető (a beszélgetésben lévő kártyákon keresztül), ott mindig a legfrissebb verzió van.

---

## Az alapanyag felépítése — PHP OOP és PSR

**1. Az objektummodell — 21 téma**
Osztályok és konstruktoros promóció · egységbezárás (a 8.4-es `private(set)`-tel) · öröklődés · polimorfizmus · absztrakt osztály vs interfész · trait-ek ütközésfeloldással · `self`/`static`/késői statikus kötés · mágikus metódusok teljes táblázattal · klónozás · enumok · típusrendszer és variancia · **strict mód Javával összevetve** · `readonly` · névterek · névtelen osztályok és closure-ök · kivételhierarchia · SPL interfészek · generátorok · attribútumok és reflexió · azonosság és összehasonlítás · **szemétgyűjtés**.

**2. Tervezés — 5 téma**
SOLID kidolgozott példával · függőséginjektálás vs service locator · a hét minta, ami tényleg előjön · **Active Record vs Data Mapper** (kézzel írt mini-ORM-mel) · **adatszerkezetek Pythonhoz mérve**.

**3. PHP-FIG szabványok — 9 téma**
A teljes PSR-jegyzék állapotokkal, majd kód a PSR-1/12-höz és a PER-CS-hez, 4, 3, 6 vs 16, a 7/15/17/18 HTTP-veremhez, 11, 14, 13 és 20.

**4. Biztonság — 4 téma**
SQL injection és PDO · jelszavak, tokenek, véletlenszerűség · XSS, escapelés, CSRF · munkamenet, fájlfeltöltés, `unserialize`.

**5. Futásidő és üzemeltetés — 3 téma**
Kérés-életciklus, OPcache, JIT, FPM-hangolás · párhuzamosság, sorok, Fiberek · adatbázisok, tranzakciók, izolációs szintek, indexelés.

**6. Eszközök — 2 téma**
Composer (megkötések, lock, autoloader) · tesztelés (PHPUnit attribútumokkal, teszthelyettesek, tesztelhetőség mint tervezési kérdés).

**7. Zárás — 2 téma**
PHP 8.0 → 8.5 kiadásonként · 14 gyorstűz-egysoros.

Minden témát egy **„Így kérdezik”** blokk zár: az a megfogalmazás, ahogy a kérdés általában elhangzik, és az a válasz, ami a peremesetet is lefedi, nem csak a definíciót.

---

## A három társkézikönyv

Ugyanaz a szerkezet, ugyanaz a hangnem, ugyanaz az „Így kérdezik” zárás minden témán. Ezek a korábban szándékosan kihagyott területek — lásd lentebb az „Amit érdemes még átnézni” szakaszt.

### HTTP és API-tervezés — 18 téma

**A protokoll (6):** kérés és válasz felépítése · metódusok és a biztonságos / idempotens / cache-elhető hármas · a státuszkódok, amiket tényleg kérdeznek (a 400 vs 422 és a 401 vs 403 párral) · tartalomegyeztetés · feltételes kérések és ETag · cache-fejlécek és a `Vary`-szivárgás.
**Erőforrás-tervezés (4):** erőforrás vs RPC · gyűjtemények, szűrés, **keyset lapozás** · kapcsolatok és a törzs alakja · Richardson-modell és a HATEOAS őszintén.
**Megbízhatóság (4):** **idempotencia-kulcsok** működő PHP-implementációval · optimista párhuzamosság (`If-Match` / `412` és verzióoszlop) · **rate limiting** token buckettel, Redisben, Luával · RFC 9457 problem details.
**Fejlődés (3):** verziózás és kivezetés (`Deprecation`, `Sunset`, `410`) · mi számít törő változtatásnak · a PSR-7/15/17/18 verem PHP-oldalról.
**Zárás (1):** 14 gyorstűz-egysoros.

### Autentikáció és jogosultságkezelés — 17 téma

**Alapok (4):** hitelesítés vs jogosultság és hogy a kettő az alkalmazás két különböző pontján dől el · jelszótárolás (`password_hash`, Argon2id, rehash) · munkamenetek PHP-ban, fixáció ellen · süti-jelzők, `SameSite`, `__Host-` előtag.
**Tokenek (5):** **munkamenet vs JWT** — a valódi kompromisszum, és miért árulkodó jel a feketelista · a JWT felépítése · a JWT-támadások táblázata (`alg: none`, algoritmus-összekeverés, `kid`-injektálás) · **refresh token rotáció újrafelhasználás-észleléssel** · hol tartsa a böngésző a tokent.
**OAuth 2 és OIDC (4):** szereplők · **Authorization Code + PKCE** végigvezetve · a többi grant, a kivezetettekkel · OpenID Connect, access token vs ID token.
**Jogosultság (3):** RBAC / ABAC / ReBAC · policy-alapú kikényszerítés PHP-ban, alapból tiltással · **IDOR / BOLA** és a bérlők közti szivárgás.
**Zárás (1):** 14 gyorstűz-egysoros.

### Architektúra a kódszint fölött — 16 téma

**Határok (5):** rétegek és a függőségi szabály · **portok és adapterek** · az alkalmazásréteg (use case-ek, nem controllerek) · entitások, értékobjektumok, aggregátumok · bounded contextek és a **moduláris monolit vs mikroszolgáltatások** döntés.
**Minták (5):** **CQRS pontosan** (és mi nem az) · domén- vs integrációs események · **outbox minta** és idempotens fogyasztó · **event sourcing** a költségeivel együtt · sagák és eventual consistency.
**PHP-kódbázisban (3):** modulszerkezet és a határok gépi kikényszerítése (Deptrac, architektúra-tesztek) · a keretrendszer mint részlet, Symfonyra és Laravelre képezve · tesztelési stratégia rétegenként.
**Döntés (3):** kompromisszumok, fitness functionök, **ADR-ek** · strangler fig, seamek, anti-corruption layer · 14 gyorstűz-egysoros.

---

## Milyen döntések alapján épült

- **Szint: senior / architect.** Ezért van benne SOLID, variancia, LSB, DI-konténer, tervezési minták, és ezért nem csak felsorolás van, hanem kompromisszumok is.
- **Célverzió: PHP 8.3+**, a 8.4 és 8.5 újdonságai külön jelölve. Így akkor is jó, ha a cégnél régebbi ág fut.
- **Az OOP-n túl is kiterjesztve**, mert egy senior interjú ritkán áll meg az objektummodellnél — a biztonsági, üzemeltetési és eszközismereti részek ezért kerültek bele.
- **A kód angol marad** a magyar változatban is (azonosítók, kulcsszavak); a kommentek, kivételüzenetek és a próza magyar.
- **Azonos horgonyok nyelvpáronként:** a magyar és az angol változat témaazonosítói megegyeznek, így a két oldal egymás mellett olvasható, és ugyanaz a `#horgony` mindkettőben működik.
- **Közös stíluslapok:** a nyolc oldal ugyanazt a `base.css` + `guide.css` párost használja, a nyitóoldal a `base.css` + `index.css` párost. Egy helyen kell változtatni, és minden oldal ugyanúgy néz ki.

---

## Ellenőrzött tények

Ezek nem emlékezetből származnak, hanem a php-fig.org és a php.net oldalról lettek visszaellenőrizve a készítés napján:

- **PSR-státuszok:** 14 elfogadott, 4 tervezet, 3 elvetett, 2 elavult. A PSR-12 **formálisan elfogadott**, de a PER Coding Style (jelenleg **3.1**) „kiterjeszti, kibővíti és leváltja”. Új projekt PER-CS-t célozzon.
- **PSR-8 (Huggable):** áprilisi tréfa, formálisan elvetett — beugratós kérdésként előfordul.
- **PHP 8.5:** 2025. november 20-án jelent meg. Pipe operátor, `clone with`, `#[\NoDiscard]`, URI kiterjesztés, `array_first()`/`array_last()`.
- **PHP 8.4:** 2024. november. Property hookok, aszimmetrikus láthatóság, új DOM API, `array_find/any/all()`.
- **Támogatottság (2026. szeptember):** 8.5 és 8.4 aktív; 8.3 csak biztonsági javítás 2027 végéig; **8.0 és 8.1 lejárt**.

Források: [php-fig.org/psr](https://www.php-fig.org/psr/) · [PER Coding Style meta](https://www.php-fig.org/per/coding-style/meta/) · [PHP 8.5](https://www.php.net/releases/8.5/en.php) · [PHP 8.4](https://www.php.net/releases/8.4/en.php) · [Supported versions](https://www.php.net/supported-versions.php)

---

## Amit érdemes még átnézni az interjú előtt

Ebből a listából az első három **azóta elkészült** — mindegyik saját kézikönyvet kapott, angolul és magyarul:

- ~~**HTTP és API-tervezés**~~ → `guides/http-api-hu.html` · `http-api-en.html` (18 téma)
- ~~**Autentikáció és jogosultság**~~ → `guides/auth-hu.html` · `auth-en.html` (17 téma)
- ~~**Architektúra a kódszint fölött**~~ → `guides/architecture-hu.html` · `architecture-en.html` (16 téma)

Ami továbbra is kívül maradt, mert erősen cégfüggő vagy nem PHP-specifikus — de senior interjún előfordulhat:

- **Frontend-illesztés:** ha a pozíció full-stack, a keretrendszer sablonozása, Livewire/Inertia/Turbo és az asset pipeline.
- **A cég konkrét stackje:** ha Laravel vagy Symfony a hirdetésben, érdemes annak a keretrendszernek a service containerét, middleware-ét és event rendszerét a dokumentumban lévő PSR-ekhez kötni — pontosan ez a fajta összekötés hangzik seniorosan.
- **Gyakorlati algoritmusok:** ha van élő kódolós kör, a PHP-tömb és az SPL szerkezetek komplexitása (a doksi „Adatszerkezetek vs Python” fejezete lefedi az alapot).

Ha bármelyiket kéred, ugyanebbe a szerkezetbe beilleszthető.

---


Ha az interjú angolul zajlik, a magyar változat a fogalmak rögzítéséhez jó, de a válaszokat érdemes angolul gyakorolni: „late static binding”, „shared-nothing”, „copy-on-write” — ezek fognak elhangozni, nem a magyar megfelelőik.
