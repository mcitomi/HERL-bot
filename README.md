# HERL-bot
A Hungarian E-Racing League hivatalos Discord botja

HERL Discord: https://discord.gg/xvfjbP7C

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

Csomagok (pl discord könyvtár telepítése):

```bash
bun i
```

Bot elindítása:

```bash
bun run index.ts 
```
vagy
```bash
bun .
```

## Adatbázis
### elements tábla:

| **name** | **id** |
| --- | --- |
| TEXT | TEXT |

Ebben a táblában a bot "elemeit", például az aktuális verseny embed azonosítóját, időpontját és a csatorna azonosítóját tárolja a program.

Ezek az adatok minden új verseny kiírásakor felülíródnak.

Lehetséges elemek:
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

Lehetséges `role` értékek:
- `elfogadva`
- `elutasitva`
- `kerdeses`
- `tartalek`
