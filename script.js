'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const projects = [
  {
    title: 'Shred', category: 'Motion design', type: 'Published animation', color: '#c9939f', tab: '10%',
    image: 'shred', alt: 'Black Shred mark on a bright lime background',
    description: 'A motion graphics project for Shred, created in Adobe After Effects. Watch the published animation to see the identity in motion.',
    highlights: [['Motion', 'Creative discipline'], ['After Effects', 'Production tool'], ['Published', 'Project video']],
    tags: ['Motion graphics', 'After Effects'],
    url: 'https://x.com/SHREDfi/status/2013583895313424615', action: 'Watch the published animation'
  },
  {
    title: '3D Showreel', category: '3D & CGI', type: 'Showreel', color: '#7bb6c8', tab: '70%',
    image: 'showreel', alt: 'A selection of rendered scenes from Aniket’s 3D showreel',
    description: 'A selection of my 3D work in Blender and Maya, featuring character modelling, hard-surface assets, texturing, lighting, rendering and motion graphics.',
    highlights: [['Model', 'Characters and assets'], ['Light', 'Textures and scenes'], ['Render', 'Motion and finishing']],
    tags: ['Blender', 'Maya', '3D environments', 'Rendering'],
    url: 'https://youtu.be/H8IWXvfaXg4', action: 'Watch the full showreel'
  },
  {
    title: 'Money Flow', category: 'Mobile app', type: 'Personal project', color: '#92b9d5', tab: '38%',
    image: 'money-flow', alt: 'Money Flow expense tracking interface on three phones',
    description: 'A personal Android project for tracking income and expenses. The interface brings spending categories, budgets and financial insights together in one place.',
    highlights: [['Track', 'Income and expenses'], ['Budget', 'Plan spending'], ['Insights', 'Understand cash flow']],
    tags: ['Android', 'App design', 'Personal project']
  },
  {
    title: 'Arcos', category: 'Architecture', type: 'Interactive software', color: '#a8a1cc', tab: '79%',
    description: 'At ShyftX, I contribute to Arcos, an interactive architectural platform designed to help people visualize and explore built spaces.',
    highlights: [['Arcos', 'Architectural software'], ['ShyftX', 'Team project'], ['Interactive', 'Experience']],
    tags: ['Architecture', 'Visualization', 'ShyftX']
  },
  {
    title: 'ShyftX', category: 'Brand & visual', type: 'Professional work', color: '#cbb677', tab: '17%',
    image: 'shyftx', alt: 'ShyftX project cover',
    description: 'My work at ShyftX spans brochures, flyers, newsletters, photography and architectural walkthroughs. I also work on 3D scanning and virtual tours and use AI tools in production.',
    highlights: [['Design', 'Marketing materials'], ['Capture', 'Photography and video'], ['Explore', 'Walkthroughs and tours']],
    tags: ['Brand & marketing', 'Photography', '3D scanning', 'Virtual tours']
  },
  {
    title: 'Skywards', category: 'Animation', type: 'Collaborative film', color: '#a0ba90', tab: '57%',
    image: 'skywards', alt: 'Skywards animation project cover',
    description: 'A collaborative 3D animation film nominated at International MAAC 24FPS 2023. The project earned a silver medal in MAAC Motion Graphic.',
    highlights: [['Silver', 'MAAC Motion Graphic'], ['24FPS', 'International competition'], ['2023', 'Competition year']],
    tags: ['3D animation', 'Motion graphics', 'Collaborative film'],
    url: 'https://www.youtube.com/watch?v=-2SLLWH7QMI&t=22s', action: 'Watch Skywards'
  }
];

const stages = [
  ['Brief received', 'Event', 'Project goals', 'Clarify what the project needs to communicate and where the work will be seen.', '#c9939f'],
  ['Explore', '01', 'References · ideas', 'Explore references and visual directions. Use AI tools when they help generate or compare ideas.', '#d3a789'],
  ['Design', '02', 'Layout · storyboards', 'Develop the layout, storyboard or scene composition for the chosen direction.', '#a8a1cc'],
  ['Produce', '03', 'Frames · scenes', 'Build the graphics, animate the shots or model, light and render the 3D environment.', '#92b9d5'],
  ['Review', '04', 'Feedback · revisions', 'Review the work with collaborators and refine the design, timing or render.', '#cbb677'],
  ['Deliver', '05', 'Files · outputs', 'Prepare the final design, video or visualization for its intended use.', '#a0ba90']
];

const cards = [
  ['About me', 'One practice, many mediums.', 'At ShyftX, I design marketing materials, shoot and edit walkthroughs, and help build virtual experiences for architecture. My personal projects give me room to experiment with 3D, motion and AI.', ['Graphic design', '3D', 'Motion'], '#ff005d'],
  ['Graphic design', 'Design for brands and print.', 'I design brochures, flyers, newsletters, posters, pitch decks and other visual materials for brands and campaigns.', ['Brand & marketing', 'Print', 'Presentations'], '#9169f4'],
  ['Video & motion', 'Storytelling through moving images.', 'I work across motion graphics, video editing, cinematography and photography. Shred is one example of my work in After Effects.', ['Motion graphics', 'Editing', 'Cinematography', 'Photography'], '#00b0ff'],
  ['3D & architecture', 'From scenes to spaces.', 'I model, light and render 3D environments and work on architectural walkthroughs, 3D scanning and virtual tours.', ['3D environments', 'Lighting & rendering', 'Virtual tours'], '#dca544'],
  ['AI-assisted work', 'More ways to explore an idea.', 'I use AI for image and video generation and experiment with AI-assisted website and app development.', ['Image generation', 'Video generation', 'Web & app development'], '#55b98e'],
  ['Personal projects', 'An app for everyday expenses.', 'Money Flow is my personal Android project for tracking income, categorizing expenses and understanding spending.', ['Money Flow', 'Android', 'App design'], '#5e7aff'],
  ['Toolkit', 'Tools I use.', 'My toolkit spans design, editing, 3D, virtual tours and AI-assisted development.', ['Adobe Creative Suite', 'Illustrator', 'Photoshop', 'Premiere Pro', 'After Effects', 'Blender', 'Maya', 'Matterport', 'PowerPoint', 'ChatGPT', 'Claude', 'Antigravity', 'Magnific', 'Figma (Basic)', 'Unreal Engine (Basic)', 'Wix (Basic)'], '#ff568d']
];

function make(tag, text, className) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function setTags(element, labels) {
  element.replaceChildren(...labels.map(label => make('span', label)));
}

const root = document.documentElement;
const themeButton = $('.theme-button');
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  $('meta[name=theme-color]').content = theme === 'dark' ? '#101012' : '#f2f0ec';
}
try {
  setTheme(localStorage.getItem('aniket-theme') === 'light' ? 'light' : 'dark');
} catch {
  setTheme('dark');
}
themeButton.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
  try { localStorage.setItem('aniket-theme', theme); } catch { /* Local storage is optional. */ }
});

const menuButton = $('.menu-button');
const menu = $('#main-menu');
const drawerClose = $('.drawer-close');
function requestMenuClose() {
  if (menu.dispatchEvent(new Event('portfolio:menu-close', { cancelable: true }))) menu.close();
}
menuButton.addEventListener('click', () => {
  root.style.setProperty('--drawer-origin', scrollY + innerHeight / 2 - $('main').offsetTop + 'px');
  root.classList.add('drawer-open');
  menuButton.setAttribute('aria-expanded', 'true');
  menu.showModal();
  drawerClose.focus({ preventScroll: true });
  menu.dispatchEvent(new Event('portfolio:menu'));
});
function clearMenuState() {
  if (menu.open) return;
  root.classList.remove('drawer-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('close', clearMenuState);
menu.addEventListener('cancel', event => {
  event.preventDefault();
  requestMenuClose();
});
drawerClose.addEventListener('click', requestMenuClose);
menu.addEventListener('click', event => {
  if (event.target === menu) requestMenuClose();
});
$$('a', menu).forEach(link => link.addEventListener('click', () => {
  root.classList.add('drawer-navigating');
  menu.close();
  clearMenuState();
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('drawer-navigating')));
}));
matchMedia('(min-width: 861px)').addEventListener('change', event => { if (event.matches && menu.open) menu.close(); });

const hero = $('.hero');
const layerToggle = $('.layer-toggle');
const selection = $('.selection');
let drag = null;
let offset = [0, 0];
function moveSelection(x, y) {
  offset = [x, y];
  selection.style.setProperty('--drag-x', x + 'px');
  selection.style.setProperty('--drag-y', y + 'px');
}
layerToggle.addEventListener('click', () => {
  const enabled = layerToggle.getAttribute('aria-checked') === 'true';
  layerToggle.setAttribute('aria-checked', String(!enabled));
  hero.classList.toggle('layer-off', enabled);
  if (enabled) moveSelection(0, 0);
});
selection.addEventListener('pointerdown', event => {
  if (event.button !== 0 || event.pointerType === 'touch' || hero.classList.contains('layer-off')) return;
  drag = { id: event.pointerId, x: event.clientX - offset[0], y: event.clientY - offset[1] };
  selection.setPointerCapture(event.pointerId);
});
selection.addEventListener('pointermove', event => {
  if (drag?.id !== event.pointerId) return;
  const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
  moveSelection(clamp(event.clientX - drag.x, innerWidth * .18), clamp(event.clientY - drag.y, 110));
});
selection.addEventListener('lostpointercapture', () => { drag = null; });
selection.addEventListener('dblclick', () => moveSelection(0, 0));

const projectDialog = $('#project-dialog');
const projectVisual = $('#project-visual');
const projectLink = $('#project-link');
const folderTray = $('#folder-tray');
let currentProject = 0;
let projectOrigin;
function showProject(index) {
  const opening = !projectDialog.open;
  const direction = Math.sign(index - currentProject) || 1;
  currentProject = (index + projects.length) % projects.length;
  const project = projects[currentProject];
  $('#project-title').textContent = project.title;
  $('#project-description').textContent = project.description;
  projectVisual.classList.toggle('arc-cover', !project.image);
  if (project.image) {
    const image = make('img');
    image.src = 'assets/projects/' + project.image + '.webp';
    image.alt = project.alt;
    projectVisual.replaceChildren(image);
  } else {
    const title = make('span', project.title);
    title.append(make('small', 'Interactive architectural software'));
    projectVisual.replaceChildren(title);
  }
  $('#project-highlights').replaceChildren(...project.highlights.map(([label, caption]) => {
    const tile = make('div');
    tile.append(make('strong', label), make('span', caption));
    return tile;
  }));
  setTags($('#project-tags'), project.tags);
  projectLink.hidden = !project.url;
  if (project.url) {
    projectLink.href = project.url;
    const arrow = make('span', '→');
    arrow.setAttribute('aria-hidden', 'true');
    projectLink.replaceChildren(project.action, arrow);
  } else {
    projectLink.removeAttribute('href');
  }
  folderTray.classList.add('project-open');
  $$('.folder', folderTray).forEach((folder, i) => folder.classList.toggle('project-active', i === currentProject));
  if (opening) {
    const workStart = scrollY + $('#work').getBoundingClientRect().top;
    projectDialog.show();
    $('.close-project').focus({ preventScroll: true });
    if (root.classList.contains('has-motion') && scrollY < workStart - 1) {
      window.scrollTo({ top: workStart, behavior: 'instant' });
    }
  }
  if (projectLink.hidden && document.activeElement === projectLink) $('.close-project').focus({ preventScroll: true });
  projectDialog.scrollTop = 0;
  projectDialog.dispatchEvent(new CustomEvent('portfolio:project', { detail: { opening, direction } }));
}
const folders = $('#folders');
projects.forEach((project, index) => {
  const folder = make('button', '', 'folder');
  folder.type = 'button';
  folder.setAttribute('aria-label', 'Open ' + project.title);
  folder.setAttribute('aria-haspopup', 'dialog');
  folder.style.setProperty('--folder', project.color);
  folder.style.setProperty('--tab', project.tab);
  folder.style.setProperty('--inset', (12.6 - index * 1.9) + '%');
  folder.style.setProperty('--position', (12.1 + index * 15.3) + '%');
  const row = make('span', '', 'folder-row');
  row.append(make('small', String(index + 1).padStart(2, '0')), make('span', project.title), make('em', project.type));
  const face = make('span', '', 'folder-face');
  const preview = make('span', '', 'folder-preview');
  preview.setAttribute('aria-hidden', 'true');
  const visual = make('span', '', 'folder-preview-visual');
  if (project.image) {
    const thumbnail = make('img');
    thumbnail.src = 'assets/projects/' + project.image + '.webp';
    thumbnail.alt = '';
    thumbnail.loading = 'lazy';
    visual.append(thumbnail);
  } else {
    visual.textContent = project.title;
  }
  const teaser = make('span', '', 'folder-preview-copy');
  teaser.append(make('b', project.title), make('i'), make('i'), make('small', project.tags.slice(0, 2).join(' · ')));
  preview.append(visual, teaser);
  face.append(make('span', project.category, 'folder-tab'), row);
  folder.append(preview, face);
  folder.addEventListener('click', () => {
    projectOrigin = folder;
    showProject(index);
  });
  folders.append(folder);
});
function closeProject() {
  if (!projectDialog.open) return;
  if (projectDialog.dispatchEvent(new Event('portfolio:close-project', { cancelable: true }))) projectDialog.close();
}
$('.close-project').addEventListener('click', closeProject);
$('#project-back').addEventListener('click', () => showProject(currentProject - 1));
$('#project-next').addEventListener('click', () => showProject(currentProject + 1));
projectDialog.addEventListener('close', () => {
  folderTray.classList.remove('project-open');
  $$('.folder.project-active', folderTray).forEach(folder => folder.classList.remove('project-active'));
  if (projectOrigin && folderTray.getBoundingClientRect().bottom > 0 && folderTray.getBoundingClientRect().top < innerHeight) {
    projectOrigin.focus({ preventScroll: true });
  }
});
document.addEventListener('click', event => {
  if (projectDialog.open && !event.target.closest('.project-dialog,.folder')) closeProject();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.open) closeProject(); });

const contactToggle = $('#contact-toggle');
const contactMenu = $('#contact-menu');
function setContactMenu(open) {
  contactMenu.hidden = !open;
  contactToggle.setAttribute('aria-expanded', String(open));
  if (open) contactMenu.dispatchEvent(new Event('portfolio:contact-menu'));
}
contactToggle.addEventListener('click', () => setContactMenu(contactMenu.hidden));
document.addEventListener('click', event => {
  if (!event.target.closest('.contact-choices') && !contactMenu.hidden) setContactMenu(false);
});
contactMenu.addEventListener('click', event => {
  if (event.target.closest('a')) setContactMenu(false);
});
$('.contact-choices').addEventListener('keydown', event => {
  if (event.key === 'Escape' && !contactMenu.hidden) {
    event.stopPropagation();
    setContactMenu(false);
    contactToggle.focus();
  }
});
$('#copy-email').addEventListener('click', async () => {
  const status = $('#copy-status');
  const label = $('#copy-email b');
  try {
    await navigator.clipboard.writeText($('.contact-email').textContent.trim());
    status.textContent = 'Email copied';
    label.firstChild.textContent = 'Email copied';
  } catch {
    status.textContent = 'Select the email address below to copy it.';
    label.firstChild.textContent = 'Copy the address below';
  }
  setTimeout(() => { label.firstChild.textContent = 'Copy email'; status.textContent = ''; }, 2200);
});

const flowTrack = $('#flow-track');
const flowScroll = $('#flow-scroll');
const flowProgress = $('#flow-progress');
const flowBack = $('#flow-back');
const flowNext = $('#flow-next');
const flowLight = $('#flow-light');
const flowWindow = $('.flow-window');
const processRun = $('.process-run');
const flowMeter = $('.flow-meter');
let currentStep = 0;
let manualFlow = false;
let flowTween;

stages.forEach(([label, id, meta, description, color], index) => {
  const stage = make('article', '', 'flow-stage');
  stage.style.setProperty('--node', color);
  const heading = make('h3', '▸ ' + label);
  heading.append(make('small', id));
  const ports = make('span', '', 'node-ports');
  const [input, output] = meta.split(' · ');
  ports.append(make('span', index ? input : ''), make('span', output || input));
  stage.append(heading, ports, make('p', description));
  if (index === 1) {
    const sources = make('span', '', 'flow-inputs');
    sources.setAttribute('aria-hidden', 'true');
    sources.append(make('span', 'References'), make('span', 'Project goals'));
    stage.append(sources);
  }
  if (index < stages.length - 1) {
    const connector = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    connector.setAttribute('class', 'flow-connector');
    connector.setAttribute('viewBox', '0 0 80 120');
    connector.setAttribute('preserveAspectRatio', 'none');
    connector.setAttribute('aria-hidden', 'true');
    const wire = document.createElementNS(connector.namespaceURI, 'path');
    const shifts = [0, -46, 40, -46, 0, 40];
    const difference = shifts[index + 1] - shifts[index];
    wire.setAttribute('d', 'M0 55 C38 55 42 ' + (55 + difference) + ' 80 ' + (55 + difference));
    wire.setAttribute('fill', 'none');
    wire.setAttribute('stroke-dasharray', '5 5');
    connector.append(wire);
    stage.append(connector);
  }
  flowTrack.append(stage);
  const dot = make('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', label);
  dot.addEventListener('click', () => showStep(index));
  flowProgress.append(dot);
});
const flowLoop = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
flowLoop.setAttribute('class', 'flow-loop');
flowLoop.setAttribute('aria-hidden', 'true');
const loopPath = document.createElementNS(flowLoop.namespaceURI, 'path');
flowLoop.append(loopPath);
const loopLabel = make('span', 'Review · iterate', 'flow-loop-label');
loopLabel.setAttribute('aria-hidden', 'true');
flowTrack.append(flowLoop, loopLabel);

const flowStages = $$('.flow-stage');
const flowDots = $$('button', flowProgress);
const toolRows = $$('.flow-tools [data-use]');
const flowToolsToggle = $('.flow-tools-toggle');
flowToolsToggle.addEventListener('click', () => {
  const open = flowToolsToggle.getAttribute('aria-expanded') === 'false';
  flowToolsToggle.setAttribute('aria-expanded', String(open));
  flowToolsToggle.textContent = open ? 'Hide tools' : 'Show tools';
});
function layoutFlowLoop() {
  const produce = flowStages[3];
  const review = flowStages[4];
  const firstX = produce.offsetLeft + produce.offsetWidth - 6;
  const lastX = review.offsetLeft + review.offsetWidth - 6;
  const firstY = produce.offsetTop + produce.offsetHeight - 34;
  const lastY = review.offsetTop + review.offsetHeight - 8;
  const railY = flowTrack.clientHeight - 26;
  flowLoop.setAttribute('viewBox', '0 0 ' + flowTrack.scrollWidth + ' ' + flowTrack.clientHeight);
  loopPath.setAttribute('d', 'M' + lastX + ' ' + lastY + ' C' + (lastX + 56) + ' ' + lastY + ' ' + (lastX + 34) + ' ' + railY + ' ' + (lastX - 25) + ' ' + railY + ' H' + (firstX + 45) + ' Q' + firstX + ' ' + railY + ' ' + firstX + ' ' + firstY);
  loopLabel.style.left = (firstX + lastX) / 2 + 'px';
}
new ResizeObserver(layoutFlowLoop).observe(flowTrack);
const flowPositions = () => {
  const max = flowScroll.scrollWidth - flowScroll.clientWidth;
  return flowStages.map(stage => Math.max(0, Math.min(max, stage.offsetLeft + stage.offsetWidth / 2 - flowScroll.clientWidth / 2)));
};
function setStep(index) {
  currentStep = index;
  flowDots.forEach((dot, i) => dot.setAttribute('aria-current', i === index ? 'step' : 'false'));
  toolRows.forEach(row => row.classList.toggle('active', row.dataset.use.split(',').includes(String(index))));
  $('#active-step').textContent = stages[index][0].toUpperCase();
  flowBack.disabled = index === 0;
  flowNext.disabled = index === stages.length - 1;
  flowTrack.dispatchEvent(new CustomEvent('portfolio:flow-stage', { detail: index }));
}
function showStep(index) {
  manualFlow = true;
  const step = Math.max(0, Math.min(stages.length - 1, index));
  setStep(step);
  const left = flowPositions()[step];
  flowTween?.kill();
  if (root.classList.contains('has-motion')) {
    flowTween = gsap.to(flowScroll, { scrollLeft: left, duration: .65, ease: 'power3.inOut' });
  } else {
    flowScroll.scrollLeft = left;
  }
}
flowBack.addEventListener('click', () => showStep(currentStep - 1));
flowNext.addEventListener('click', () => showStep(currentStep + 1));
function useManualFlow() {
  manualFlow = true;
  flowTween?.kill();
}
flowScroll.addEventListener('pointerdown', useManualFlow);
flowScroll.addEventListener('wheel', event => {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) useManualFlow();
}, { passive: true });
flowScroll.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const target = { ArrowLeft: currentStep - 1, ArrowRight: currentStep + 1, Home: 0, End: stages.length - 1 };
  showStep(target[event.key]);
});
flowScroll.addEventListener('scroll', () => {
  const max = flowScroll.scrollWidth - flowScroll.clientWidth;
  flowMeter.style.setProperty('--flow-progress', max > 0 ? flowScroll.scrollLeft / max : 0);
  if (flowTween?.isActive()) return;
  const positions = flowPositions();
  const distance = index => Math.abs(positions[index] - flowScroll.scrollLeft);
  let closest = currentStep;
  positions.forEach((_, index) => { if (distance(index) < distance(closest)) closest = index; });
  if (closest !== currentStep) setStep(closest);
}, { passive: true });
flowLight.addEventListener('click', () => {
  const isLight = flowWindow.classList.contains('flow-light') ||
    (root.dataset.theme === 'light' && !flowWindow.classList.contains('flow-dark'));
  flowWindow.classList.toggle('flow-light', !isLight);
  flowWindow.classList.toggle('flow-dark', isLight);
  flowLight.setAttribute('aria-pressed', String(!isLight));
  flowLight.setAttribute('aria-label', isLight ? 'Switch workflow to plain light' : 'Switch workflow to dark');
});
setStep(0);

const skillHover = matchMedia('(min-width: 641px) and (any-hover: hover)');
$$('.skill-row summary').forEach(summary => {
  const row = summary.parentElement;
  let openTimer;
  let openedByHover = false;
  summary.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || !skillHover.matches || row.open) return;
    openTimer = setTimeout(() => {
      row.open = true;
      openedByHover = true;
    }, 95);
  });
  summary.addEventListener('pointerleave', () => {
    clearTimeout(openTimer);
    openedByHover = false;
  });
  summary.addEventListener('click', event => {
    clearTimeout(openTimer);
    if (event.detail && openedByHover) event.preventDefault();
    openedByHover = false;
  });
});

const cardStack = $('#card-stack');
const badgeButton = $('.badge-flip');
badgeButton.addEventListener('click', event => {
  if (event.detail && badgeButton.dataset.dragged === 'true') return;
  const flipped = badgeButton.getAttribute('aria-pressed') !== 'true';
  badgeButton.setAttribute('aria-pressed', String(flipped));
  badgeButton.setAttribute('aria-label', flipped ? 'Show front of Aniket’s designer pass' : 'Show reverse of Aniket’s designer pass');
  const badge = badgeButton.closest('.badge');
  badge.classList.toggle('is-flipped', flipped);
  $('.badge-front', badge).setAttribute('aria-hidden', String(flipped));
  $('.badge-back', badge).setAttribute('aria-hidden', String(!flipped));
  badge.dispatchEvent(new Event('portfolio:badge-flip'));
});
const pauseButton = $('#card-pause');
const cardCount = $('#card-count');
const cardDuration = 7600;
let currentCard = 0;
let slideInterval;
let playing = !reducedMotion.matches;
let inView = false;
const bioCards = cards.map(([label, title, copy, tags, color], index) => {
  const card = make('article', '', 'bio-card');
  const meta = make('div', '', 'card-meta');
  meta.append(make('span', label.toUpperCase()), make('span', String(index + 1).padStart(2, '0') + ' / 07'));
  const tagRow = make('div', '', 'tags');
  setTags(tagRow, tags);
  card.append(meta, make('h3', title), make('p', copy), tagRow);
  card.style.setProperty('--card-glow', color);
  return card;
});
cardStack.replaceChildren(...bioCards);
function setCardDepths() {
  bioCards.forEach((card, index) => {
    const depth = (index - currentCard + cards.length) % cards.length;
    card.dataset.depth = depth;
    card.setAttribute('aria-hidden', String(depth !== 0));
  });
}
function showCard(index) {
  const previous = currentCard;
  const direction = Math.sign(index - currentCard) || 1;
  currentCard = (index + cards.length) % cards.length;
  setCardDepths();
  cardCount.textContent = String(currentCard + 1).padStart(2, '0') + ' / 07';
  cardStack.dispatchEvent(new CustomEvent('portfolio:card', { detail: { from: bioCards[previous], direction } }));
  syncSlideshow();
}
function syncSlideshow() {
  clearTimeout(slideInterval);
  const running = playing && inView && !document.hidden && !reducedMotion.matches;
  if (running) slideInterval = setTimeout(() => showCard(currentCard + 1), cardDuration);
  cardStack.dispatchEvent(new CustomEvent('portfolio:slideshow', { detail: { running, duration: cardDuration / 1000 } }));
}
function setPlaying(enabled) {
  playing = enabled;
  pauseButton.textContent = enabled ? 'Ⅱ Pause' : '▷ Play';
  pauseButton.setAttribute('aria-label', enabled ? 'Pause card slideshow' : 'Play card slideshow');
  pauseButton.setAttribute('aria-pressed', String(!enabled));
  cardCount.setAttribute('aria-live', enabled ? 'off' : 'polite');
  syncSlideshow();
}
function changeCard(delta) {
  setPlaying(false);
  showCard(currentCard + delta);
}
$('#card-back').addEventListener('click', () => changeCard(-1));
$('#card-next').addEventListener('click', () => changeCard(1));
pauseButton.addEventListener('click', () => setPlaying(!playing));
let cardStart;
cardStack.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  if (playing) setPlaying(false);
  cardStart = [event.clientX, event.clientY];
  cardStack.setPointerCapture(event.pointerId);
});
cardStack.addEventListener('pointermove', event => {
  if (!cardStart) return;
  const dx = event.clientX - cardStart[0];
  const dy = event.clientY - cardStart[1];
  if (Math.abs(dx) > Math.abs(dy)) cardStack.dispatchEvent(new CustomEvent('portfolio:card-drag', { detail: dx }));
});
cardStack.addEventListener('pointerup', event => {
  if (!cardStart) return;
  const dx = event.clientX - cardStart[0];
  const dy = event.clientY - cardStart[1];
  cardStart = null;
  if (Math.abs(dy) > Math.max(15, Math.abs(dx))) {
    cardStack.dispatchEvent(new CustomEvent('portfolio:card-drag', { detail: 0 }));
    return;
  }
  changeCard(dx > 35 ? -1 : 1);
});
cardStack.addEventListener('pointercancel', () => {
  cardStart = null;
  cardStack.dispatchEvent(new CustomEvent('portfolio:card-drag', { detail: 0 }));
});
new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  syncSlideshow();
}, { threshold: .52 }).observe(cardStack);
document.addEventListener('visibilitychange', syncSlideshow);
reducedMotion.addEventListener('change', () => {
  setPlaying(!reducedMotion.matches);
  flowTween?.kill();
});
setCardDepths();
setPlaying(playing);

const navTargets = $$('.nav-links a,.drawer-content nav a').map(link => [link, $(link.getAttribute('href'))]);
let updatingScroll = false;
function syncScroll() {
  let active;
  navTargets.forEach(([, target]) => {
    const section = target.id === 'process' ? processRun : target;
    if (section.getBoundingClientRect().top <= 155) active = target;
  });
  navTargets.forEach(([link, target]) => {
    if (target === active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  if (root.classList.contains('has-motion')) {
    const bounds = processRun.getBoundingClientRect();
    const handoff = $('#process').offsetTop;
    const travel = processRun.offsetHeight - $('.process-pin').offsetHeight;
    const progress = Math.max(0, Math.min(1, (-handoff - bounds.top) / Math.max(1, travel - handoff)));
    if (bounds.top > 190 || bounds.bottom < 100) {
      manualFlow = false;
      flowTween?.kill();
    }
    if (!manualFlow) flowScroll.scrollLeft = progress * (flowScroll.scrollWidth - flowScroll.clientWidth);
  }
  updatingScroll = false;
}
function scheduleScrollSync() {
  if (updatingScroll) return;
  updatingScroll = true;
  requestAnimationFrame(syncScroll);
}
window.addEventListener('scroll', scheduleScrollSync, { passive: true });
window.addEventListener('resize', scheduleScrollSync);
$$('a[href="#process"]').forEach(link => link.addEventListener('click', () => {
  manualFlow = false;
  flowTween?.kill();
  scheduleScrollSync();
}));
scheduleScrollSync();

function randomStream(seed) {
  return () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function setupCanvas(canvas, draw) {
  const context = canvas.getContext('2d');
  if (!context) return;
  const render = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const scale = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    draw(context, width, height);
  };
  new ResizeObserver(render).observe(canvas);
  return render;
}

setupCanvas($('.experience-stars'), (ctx, width, height) => {
  const random = randomStream(23);
  const count = Math.ceil(width * height / 8700);
  const colors = ['213,210,239', '191,179,246', '146,210,248', '240,212,233'];
  for (let i = 0; i < count; i++) {
    const x = random() * width;
    const y = random() * height;
    const size = random();
    const radius = .24 + size ** 3 * 1.2;
    const opacity = .13 + random() * (size > .86 ? .68 : .34);
    const color = colors[i % colors.length];
    if (size > .92) {
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(' + color + ',.45)';
    }
    ctx.fillStyle = 'rgba(' + color + ',' + opacity + ')';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
});

const redrawContactSky = setupCanvas($('.contact-sky'), (ctx, width, height) => {
  const random = randomStream(61);
  const rays = Math.round(Math.max(32, width / 19));
  const colors = ['#ffe7fc', '#a581ff', '#ff237f', '#fff0e1', '#f151a6'];
  for (let i = 0; i < rays && !root.classList.contains('has-motion'); i++) {
    const spread = (i / (rays - 1) - .5) * width * 1.27;
    const endX = width / 2 + spread;
    const endY = height * (.24 + random() * .69);
    const originX = width / 2 + spread * .59;
    const color = colors[Math.floor(random() * colors.length)];
    const trail = ctx.createLinearGradient(0, 0, 0, endY);
    trail.addColorStop(0, color + '00');
    trail.addColorStop(.55, color + '0b');
    trail.addColorStop(.88, color + '58');
    trail.addColorStop(1, color + 'a6');
    ctx.lineWidth = .7 + random() * .7;
    ctx.strokeStyle = trail;
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.bezierCurveTo(originX, endY * .31, originX + spread * .19, endY * .79, endX, endY);
    ctx.stroke();
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(endX, endY, .6 + random() * 1.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  for (let row = 0; row < 3; row++) {
    for (let x = -8; x < width;) {
      const w = 25 + random() * 67;
      const h = 28 + random() * (row ? 103 - row * 22 : 160);
      const y = height - h;
      ctx.fillStyle = ['#211127', '#100a18', '#09060d'][row];
      ctx.fillRect(x, y, w, h);
      if (random() > .56) ctx.fillRect(x + w * .52, y - 10, 2, 11);
      if (random() > .63) ctx.fillRect(x + w * .18, y - 5, w * .54, 6);
      if (random() > .68 && w > 50) {
        ctx.fillStyle = '#523046';
        ctx.fillRect(x + 5, y + 7, w - 10, 3);
        ctx.fillStyle = '#efbc86';
        ctx.fillRect(x + 9, y + 8, w - 18, 1);
      }
      if (random() > .72 && h > 85) {
        ctx.fillStyle = '#b87e55';
        ctx.fillRect(x + w - 12, y + 13, 2, h - 20);
      }
      for (let wx = x + 7; wx < x + w - 7; wx += 10) {
        for (let wy = y + 10; wy < height - 4; wy += 12) {
          if (random() < .75) continue;
          ctx.fillStyle = random() > .84 ? '#f95a9e' : '#f2bd75';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 6;
          ctx.fillRect(wx, wy, 3, 4);
          ctx.shadowBlur = 0;
        }
      }
      x += w + 4;
    }
  }
});
