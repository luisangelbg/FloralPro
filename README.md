# FloralPro

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

**La flor, verticilo por verticilo.** Una aplicación para enseñar y aprender la estructura de la flor: fórmulas
florales, diagramas florales, la flor en 3D y en corte, un atlas de verticilos, 82 familias de angiospermas con énfasis
en México, una clave interactiva, autoevaluación, gimnospermas como contraste y un modo clase para proyectar e
imprimir. Los ocho bloques están completos (versión 1.0.0).

**Versión en línea:** https://luisangelbg.github.io/FloralPro/

*English summary below.*

## Cómo abrirla

1. Haz doble clic en **`index.html`**. Se abre en tu navegador, en la portada. Todo funciona desde la copia local, sin
   servidor y sin conexión a internet.
2. Si tu institución bloquea las páginas abiertas como archivo, o si quieres guardar muchas fotos propias con buena
   resolución, haz doble clic en **`Open FloralPro.bat`** (o ejecuta `server.ps1` con PowerShell): inicia un pequeño
   servidor en tu propia computadora y abre `http://localhost:9300`.
3. Las pruebas se abren igual: `tests/index.html` y `tests/block2.html` a `tests/block8.html`; todas deben salir en
   verde.

## Los ocho bloques

| Bloque | Contenido |
|---|---|
| 1 | Portada: la flor como brote de crecimiento limitado, sus verticilos, y un motor que dibuja cualquier flor desde su modelo: fórmula en la convención clásica o en la de Prenner, diagrama floral, flor en 3D y corte longitudinal enlazados |
| 2 | Arma una flor: constructor verticilo por verticilo, con fusiones, adnación, piezas desiguales, avisos de coherencia botánica, fórmula que se lee y se escribe, flores guardadas, archivo y enlace |
| 3 | Atlas de verticilos: 115 láminas de variantes (simetría, perianto, prefloración, androceo, anteras, gineceo, placentación, estilos, inflorescencias) y un glosario de 188 términos que aparece en toda la app |
| 4 | Familias y especies: 82 familias ordenadas según APG IV, 278 especies con su estatus en México (endémica, nativa, domesticada, cultivada, introducida) y 357 flores; filtros, ficha de familia y comparador |
| 5 | Clave interactiva: clave de acceso múltiple con 29 caracteres de la flor, la planta y el fruto, y clave dicotómica generada con los mismos datos |
| 6 | Autoevaluación: retos de fórmula floral, de términos del atlas y de gimnospermas, con calificación pieza por pieza; práctica con corrección inmediata y exámenes del profesor con comprobante verificable, sin servidor |
| 7 | Gimnospermas: la flor frente al estróbilo; cícadas, Ginkgo, coníferas y Ephedra con 28 estróbilos en 3D, en corte, desde arriba y pieza por pieza, ficha de caracteres y 24 especies de México con su categoría en la NOM-059-SEMARNAT-2010 |
| 8 | Modo clase: presentaciones para proyectar que preguntan al grupo antes de revelar la respuesta; fichas de familia, hojas de trabajo con clave, fichas de estróbilo y tarjetas de estudio para imprimir; fotos propias con sus datos |

## Tus fotos

En el Bloque 8 («Mis fotos») cada profesor guarda sus fotos con familia, especie, pie, autor y licencia; aparecen en
las fichas de familia, en las láminas del atlas, en las presentaciones y en las hojas impresas. Se guardan solo en tu
navegador. «Exportar paquete» descarga un archivo `floralpro-fotos.js`; copiado como **`fotos/fotos.js`** dentro de la
carpeta de FloralPro, las fotos viajan con la app (también en la versión publicada). Publica solo fotos propias o con
una licencia que lo permita.

## Qué corre dónde

Todo se calcula y se dibuja en el navegador con JavaScript simple: no hay servidor, no se sube nada y nada de lo que
escribes, guardas o fotografías sale de tu computadora. No usa bibliotecas de terceros: los diagramas, los cortes y
las flores y conos en 3D los genera el propio código a partir de los modelos.

## Fuentes

Los datos botánicos (familias, especies, estatus, estructura de las flores y de los estróbilos) se revisaron contra
APG IV, obras de sistemática y morfología floral, floras regionales, las bases de datos de plantas del mundo y de
México, y la NOM-059-SEMARNAT-2010. Son material de enseñanza: las fórmulas de familia describen la flor típica y sus
variantes principales, no toda la variación de la familia.

## Cómo citarla

Barrera-Guzmán, L. Á. (2026). *FloralPro: la flor, verticilo por verticilo* (versión 1.0.0) [Software].
https://github.com/luisangelbg/FloralPro

Véase también `CITATION.cff`.

## Licencia

GNU General Public License, versión 3 o posterior (`LICENSE`).

---

## English summary

**FloralPro — the flower, whorl by whorl** is a browser-based teaching app about the structure of the flower. It draws
any flower from a whorl-by-whorl model as a floral formula (classic and Prenner conventions), a floral diagram, a 3D
flower and a longitudinal section, all linked. It includes a flower builder, an atlas of 115 variant plates with a
188-term glossary, 82 angiosperm families (APG IV) with 278 species and their status in Mexico, a multi-access and a
dichotomous key, self-assessment with verifiable teacher exams, gymnosperms as a contrast (28 strobili in 3D and 24
Mexican species) and a classroom mode to project presentations, print sheets, worksheets and study cards, and keep
the teacher's own photos. The interface is in Spanish by default and also in English, with light and dark themes.
Open `index.html` with a double click; it runs entirely offline.
