# Papers — project history

## 2026-10-10 — Nematicity reading-room publication

### Objective and authorization

Publish the completed six-paper Nematicity reading room in the user's existing Papers repository, with a durable GitHub Pages website link. The user explicitly authorized upload and publication, extending the previous local-only scope for this topic. Other library topics remain outside this installment.

### Decisions and files

The repository already held exactly the six reviewed PDFs. Verified all six against the local source SHA-256 hashes and reused them without changing or duplicating them. Added the production `index.html`, `app.js`, `styles.css`, six attributed figure images, public source/coverage metadata, `.nojekyll` and this README/history. Rebased the 72 PDF links onto the existing repository-root files. Replaced the local library-catalog link with the repository link and clarified online versus downloaded reading.

No full local library, extracted full text, staging batches, private local archival notes, credentials or machine-specific paths are included in the publication package. Existing repository visibility and history are preserved.

### Tools and validation

Prepared on Windows with Python, Git and GitHub CLI. The first restricted-network authentication check failed; the authorized network-enabled check confirmed access. The fresh checkout lacked a Git author identity; reused the identity from its existing commit for this checkout only, without changing global Git settings. No credential values are recorded. Static preflight verifies six summaries, all relative source links/assets and unchanged PDF hashes. The original local site passed offline interaction, mobile, no-script and visual checks. Hosted validation is recorded separately in the local publication audit after deployment.

### Coverage and limits

All substantive body sections were reviewed. The 2010 review bibliography was checked for structure, not every cited paper independently reviewed. Nie's external Supporting Information is absent and unreviewed. The guide records source versions, conditions, approximation limits and distinctions between teaching models, author results and our synthesis. PDF page-fragment behavior depends on the reader's viewer.

### Publication setup and next action

Use GitHub Pages from the `main` branch root, with `.nojekyll`. Expected website: https://manilaladarsh-hash.github.io/Papers/. Completion requires a successful Pages build and direct checks of the deployed HTML, assets and all six source PDF targets. Maintain the relative paths and reviewed source limits during future updates; process another topic only after an explicit request.
