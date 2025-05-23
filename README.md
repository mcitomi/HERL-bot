# HERL-bot
A Hungarian E-Racing League hivatalos Discord botja

HERL Discord: [https://discord.gg/xvfjbP7C](https://discord.gg/pBJph7kDjT)

<img src="https://imgur.com/YZKEpzl.png" width="200px">

## Config

`config.json` példa:
```json
{
    "token" : "..."
}
```
(A fő mappába kell elhelyezni, az index.ts-el egy szinten).

## Install
A projekt Bun runtime-ban készült, ezt kell feltelepíteni a számítógépre és ennek segítségével futtatni a botot. 
https://bun.sh/

**Csomagok (pl discord könyvtár telepítése):**

```bash
bun i
```

**Bot elindítása:**

```bash
bun run index.ts 
```
vagy
```bash
bun .
```

## Adatbázis
A Bun környezetbee beépített `bun:sqlite` drivert használja a program az adatbázis (SQLite) kezelésére.

Az adatbázis fájlt (`herl.sqlite`) a fő mappában, az `index.ts`-el egy szinten hozza létre.

### elements tábla:

| **name** | **id** |
| --- | --- |
| TEXT | TEXT |

Ebben a táblában a bot "elemeit", például az aktuális verseny embed azonosítóját, időpontját és a csatorna azonosítóját tárolja a program.

Ezek az adatok minden új verseny kiírásakor felülíródnak.

Lehetséges elemek (adatbázis felépítésben):
[name : id]
- `raceembed`: 'discord embed id'
- `racedate`: 'yyyy-MM-dd HH:mm'
- `threadch`: 'discord embed channel id' (ebben a csatornában fogja létrehozni a thread-et, ezt mindig abból a csatornából hozza létre, ahova az embed el lett küldve).

<hr>

### reactedUsers tábla:

| **race** | **userId** | **role** |
| --- | --- | --- |
| TEXT | TEXT | TEXT |

Ebben a táblában a felhasználók szerepét tárolja a bot az adott versenyhez.

Ebből a táblából nem törlődnek az adatok új verseny kiírása esetében sem, a `race` mezővel különböztetjük meg a versenyeket amely az adott verseny embed azonosítóját tartalmazza.

Lehetséges `role` értékek (adatbázis felépítésben):
- `elfogadva`
- `elutasitva`
- `kerdeses`
- `tartalek`

Ezeket a role értékeket a `src/commands/race` fájlban létrehozott gombok CustomId-je határozza meg, fontos hogy ezeket az azonosítókat ne változtassuk egyéb változtatások nélkül.

## Bugok / Tervek
- [ ] Ami után létrehozza a bot a threadet, ne lehessen változtatni a felhasználóknak a pozícióját, gombok eltűntetése (egyéb embed változtatások).
