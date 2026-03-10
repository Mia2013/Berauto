# Bérautó projekt

## Indítási Útmutató
Ez a projekt két részből áll: egy ASP.NET Core (C#) backendből és egy React frontendből. Ahhoz, hogy minden működjön, mindkettőnek futnia kell.

### Előfeltételek
Mielőtt elkezded, győződj meg róla, hogy ezek telepítve vannak:

Node.js és npm: a frontendhez kell.

Visual Studio 2022: (a backend futtatásához) és .NET 9 SDK: (ezt a VS 2022 általában telepíti magával).

### 1. A Backend indítása (C# API)
A backendet a legegyszerűbben Visual Studio 2022-ből tudod elindítani.
Nyisd meg a backend/Berauto.Backend/ mappában található Berauto.Backend.sln fájlt.
A felső sávban kattints a zöld nyílra (Start) vagy nyomj egy F5-öt.
Automatikusan megnyílik a böngésző a Scalar dokumentációval.
Cím: https://localhost:7011/scalar/v1

### 2. A Frontend indítása (React)
A frontendhez egy terminálra (vagy a VS Code beépített termináljára) lesz szükséged.
Nyisd meg a terminált a frontend mappában.
Csak a legelső alkalommal (vagy ha új csomagot adtunk hozzá) futtasd ezt:

```Bash
npm install
```
(Ez letölti a szükséges modulokat a node_modules mappába).

Az indításhoz futtasd ezt:

```Bash
npm start
```
A böngésző magától megnyílik a http://localhost:3000 címen.

### Fontos infók
Sorrend: Mindig a Backendet indítsd el először, különben a React nem fogja látni az adatokat.


### Mappák felépítése röviden:
backend/ -> Itt van a C# kód, amit Visual Studio 2002-vel kezelsz.

frontend/ -> Itt van a React kód, amit VS Code-ban érdemes szerkeszteni és npm-mel tudod indítani.
