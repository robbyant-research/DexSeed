DexSeed project page — static website

Deployment
----------
GitHub Pages publishes the root of the gh-pages branch in
https://github.com/robbyant-research/DexSeed to
https://robbyant-research.github.io/DexSeed/.
The entry point is index.html. Keep the assets/ directory structure intact.
The old handoff ZIP symlink is excluded from Git and deployment.

This is a plain HTML/CSS/JavaScript website. No build step, package installation,
backend, or API key is required. All images, video posters, and videos used by
the page are included. Author links intentionally point to external homepages.

Local preview (optional)
------------------------
With Node.js installed, run from the extracted DexSeed directory:

    node serve.mjs --port 4390

Then visit http://localhost:4390/ on that machine. serve.mjs is only a local
preview helper and is not needed by GitHub Pages or other static hosting.

Editing
-------
index.html                     Page content, authors, section structure
assets/css/site.css            General page layout and styling
assets/css/method.css          Method animation and data-browser styling
assets/css/results.css         Simulation VLA ablation and data-scale charts
assets/js/site.js              Shared media player and result sections
assets/js/method.js            Animated method explanation and chapter navigation
assets/js/grasp-browser.js     G1–G8, source cases, and data-stage buttons
assets/js/data.js              Existing case and media references
assets/js/results.js           Table IV/VI values and interactive charts
assets/figures/                Standalone chart images for each evaluation setting

The arXiv entry in index.html currently shows "Coming soon". When its public
URL is available, replace the pending-link span with an anchor to that URL.
Code links to the official repository; Cite links to the on-page BibTeX.

Chart.js 4.5.1 is included locally under assets/vendor/chart.js/ with its MIT
license. Source: https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.js
Chart values are taken from the paper's Tables IV and VI. No external chart
service or network dependency is needed when viewing the website.

Method playback is fixed at two complete animation rounds per step. The
chapter labels 01–05 can be clicked to jump between steps. Pause and restart
controls remain available. The case browser below uses visible stage buttons.
