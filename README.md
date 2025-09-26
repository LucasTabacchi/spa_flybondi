# SPA Flybondi – Nelsona
Proyecto base **vanilla JS + Webpack** 

## Scripts
- `npm install`
- `npm run dev` – abre en `http://localhost:5173/`
- `npm run build` – genera `dist/`
- `npm run preview` – sirve `dist/`

## Cómo funciona
1. Carga `public/dataset.json`.
2. Con origen, presupuesto, personas y duraciones sugeridas, arma **ida + vuelta** y filtra por presupuesto y asientos.
3. Muestra tarjetas simples, accesibles y de alto contraste para Nelsona.

## Estructura
```
dist/
node_modules/
public/
  ├── index.html
  └── dataset.json
src/
  ├── app.js        
  ├── logic.js     
  └── utils.js     
.babelrc
.gitignore
index.js            # entry
package.json
webpack.config.cjs
```

> Si querés cambiar la moneda, ajustá `formatCurrency` en `src/utils.js`.
