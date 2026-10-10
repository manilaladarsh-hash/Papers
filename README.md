# Cuprate reading library

**[Open the reading library](https://manilaladarsh-hash.github.io/Papers/)**

Seven connected topics, thirteen original papers and detailed visual study notes: cuprate reviews, pairing and superconductivity, pseudogap and thermodynamics, stripes and charge order, electronic nematicity, quantum criticality, and spinless impurities/Kondo-like physics.

Start with **Cuprate reviews** for the map, then follow the reading path. Search or filter the full paper catalog. Each topic links to original PDFs, explains the arguments and assumptions, and separates historical conclusions from interpretation. The seven added papers include essential equations, symbol explanations, figure-reading prompts and self-check questions with answers. The original six nematicity notes include additional argument walkthroughs.

Interactive views are labeled simplified teaching models; they do not reproduce measured data or the papers' numerical simulations. Attributed figure excerpts link to their complete source pages. Website branding contains no personal name.

## Reading online or offline

Bookmark the link above. No login is needed. For offline use, download this repository as a ZIP, extract it and open `index.html`. Keep the PDFs, `topics`, `assets`, styles, scripts and `evidence` beside it. No installation or server is needed. Original PDF filenames and bytes are preserved.

## Sources and coverage

The thirteen supplied files total 107 pages. All substantive body sections were reviewed, including visually reading the scanned Moriya paper. Bibliographies were inspected for structure; every cited work was not independently reviewed. Nie's external Supporting Information is absent and remains unreviewed. These notes explain the supplied historical versions and do not constitute an updated literature survey.

- **Cuprates:** Keimer et al. (2015).
- **Pairing:** Monthoux, Pines and Lonzarich (2007); Moriya, Takahashi and Ueda (1990).
- **Pseudogap:** Loram et al. (1998).
- **Stripes:** Robertson et al., supplied 2006 preprint v2.
- **Nematicity:** Kivelson–Fradkin–Emery (stored 1997 preprint), Oganesyan–Kivelson–Fradkin (2001 v2), Kivelson–Fradkin–Geballe (2004), Carlson et al. (2006), Fradkin et al. (2010), Nie–Tarjus–Kivelson (2014).
- **Criticality:** Sachdev and Keimer (2011).
- **Impurities:** Bobroff et al. (1999).

Source versions, page coverage and scientific limits appear in the notes and `evidence/coverage.json`. `evidence/sources.json` records source metadata and original SHA-256 hashes. The papers and author figures remain the work of their authors and publishers; this repository does not relicense them.

## Hosting and maintenance

GitHub Pages serves the `main` branch root with `.nojekyll`. The root page is the catalog and reading path; seven `topics/*/index.html` pages contain the study material. Shared `library.css` and `library.js` handle the expanded library. The nematicity chapter retains its original `styles.css` and `app.js`, plus `nematicity-deep.css`. Previous root links such as `#paper-35` redirect to the corresponding nematicity note.

All source links are relative for hosted and extracted-folder reading. PDF `#page=` handling depends on the viewer. The local authoring sources and detailed private test evidence are maintained separately. Rebuild through the expanded library builder; the old single-topic publisher refuses to overwrite a multi-topic publication.
