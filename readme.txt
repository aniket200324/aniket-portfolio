ANIKET CHAUHAN PORTFOLIO
======================

Final_web is the complete site. It uses HTML, CSS and JavaScript with
local copies of its images, fonts, resume and animation libraries.
There is no build step or package installation.

1. START THE LOCAL SERVER ON WINDOWS
------------------------------------
Install Node.js LTS from https://nodejs.org/ if "node --version" fails.
Open PowerShell and run:

  cd "C:\Users\anike\Downloads\Website\Final_web"
  node serve.cjs

Open http://127.0.0.1:4187/ in your browser. Port 4187 is for Final_web.
The earlier Reference Portfolio preview uses port 4186.
Keep PowerShell open. Refresh the browser after saving changes.
Press Ctrl+C in PowerShell to stop the server.

If you see "EADDRINUSE", port 4187 is already in use. Check whether
your Final_web preview is already running. If another app owns the
port, change the port number near the top of serve.cjs, restart the
server and open the new URL it prints.

2. EDIT THE SITE WITH CHATGPT
-----------------------------
In the ChatGPT desktop app, select Codex and open Final_web as a local
project folder. Start a chat in that project and describe the exact
change you want. Attach a screenshot if it helps. For example:

  In Final_web, update the About bio using the text below. Preserve
  the layout and animations. Preview the change on desktop and mobile
  at http://127.0.0.1:4187/ and tell me which files changed.

Start the server from step 1 or ask Codex to start it from Final_web.
Review the result locally before pushing it to GitHub. In regular
browser chat, attach the relevant files and save the returned edits
into Final_web yourself.

  index.html   Page copy, links, section structure and Skills
  style.css    Colors, typography and responsive layouts
  script.js    Project details, About cards and page interactions
  motion.js    Scroll effects and animations
  assets/      Images, fonts, software icons and downloadable resume
  vendor/      Bundled GSAP libraries
  serve.cjs    Local preview server

3. UPLOAD TO GITHUB
-------------------
Browser method

  1. Sign in at https://github.com/ and create a repository, such as
     aniket-portfolio. Initialize it with a README so its main branch
     has an initial commit. Choose your preferred repository visibility.
  2. Open the repository and choose Add file > Upload files.
  3. In File Explorer, open Final_web and drag its contents into the
     upload area. Include the assets and vendor folders with their
     directory structure. The repository root should show index.html,
     style.css, script.js, motion.js, serve.cjs, assets/ and vendor/.
  4. Commit the upload. If GitHub opens a pull request, merge it into
     main before importing the repository into Vercel.

Git method for a new, empty repository

  Create the GitHub repository without an initial README for this
  method. In PowerShell, run these commands. Replace YOUR-USERNAME
  and aniket-portfolio in the URL with your actual repository details.

  cd "C:\Users\anike\Downloads\Website\Final_web"
  git init -b main
  git add .
  git commit -m "Add portfolio website"
  git remote add origin https://github.com/YOUR-USERNAME/aniket-portfolio.git
  git push -u origin main

  Sign in when Git prompts you. Use one of the two upload methods for
  the first upload. Once a Git checkout is connected, use git status
  to review changes, then commit and push as shown in step 5.

4. LAUNCH ON VERCEL
-------------------
  1. Sign in at https://vercel.com/ with GitHub. From the dashboard,
     choose Add New > Project and import your portfolio repository.
     Grant Vercel access to that repository if prompted.
  2. Set Framework Preset to Other. Keep Root Directory at the
     repository root where index.html sits. Leave Build Command
     empty. Keep Output Directory at its default, or set it to "."
     if the dashboard asks for a value. No environment variables are
     required. The Vercel site serves the static files directly.
  3. Click Deploy. Once the deployment is Ready, open its .vercel.app
     URL. Check the homepage, Skills, project images and resume link.
  4. If you see a 404, confirm that index.html is at the selected
     Root Directory and that Output Directory points to that root.
     If images are missing, check that assets/ was uploaded with
     the original folder and file names.

5. PUBLISH LATER EDITS
----------------------
After testing locally, upload the changed files to the same paths in
GitHub and commit or merge them into main. If you used the Git method,
run these commands from the connected Final_web checkout:

  git status
  git add .
  git commit -m "Update portfolio"
  git push

Vercel automatically redeploys changes to the production branch.
Check the deployment status and open the live URL once it is Ready.

Official guides
---------------
GitHub file uploads
https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

GitHub command-line setup
https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github

Vercel GitHub integration and build settings
https://vercel.com/docs/git/vercel-for-github
https://vercel.com/docs/builds/configure-a-build

OpenAI guide to opening a local folder in Codex
https://developers.openai.com/blog/build-a-game-with-modretro-chromatic
