'use strict';

(() => {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', context => {
    const listeners = new AbortController();
    const { signal } = listeners;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const page = document.documentElement;
    page.classList.add('has-motion');

    function listen(element, type, callback) {
      element.addEventListener(type, context.add(null, callback), { signal });
    }

    function hover(element, update) {
      listen(element, 'pointerenter', event => {
        if (finePointer.matches && event.pointerType !== 'touch') update(true);
      });
      listen(element, 'pointerleave', () => update(element.matches(':focus-visible')));
      listen(element, 'focus', () => {
        if (element.matches(':focus-visible')) update(true);
      });
      listen(element, 'blur', () => update(finePointer.matches && element.matches(':hover')));
    }

    function reveal(trigger, elements, vars = {}) {
      return gsap.fromTo(elements, { y: 35, opacity: .28, ...vars }, {
        y: 0, opacity: 1, duration: .85, stagger: .085, ease: 'power3.out',
        scrollTrigger: { trigger, start: 'top 89%', once: true }
      });
    }

    const hero = document.querySelector('.hero');
    const heroSelection = hero.querySelector('.selection');
    const layerButton = hero.querySelector('.layer-toggle');
    const designLayers = hero.querySelectorAll('.design-art, .handles');
    gsap.set(designLayers, { opacity: hero.classList.contains('layer-off') ? 0 : 1 });
    const studioPanels = hero.querySelectorAll('.studio-panel');
    const notes = gsap.timeline({ paused: true, repeat: -1 });
    const phrases = [
      ['Try a tighter layout.', 'Let the headline breathe.', 'The print version is ready.'],
      ['Adjust the timing on this shot.', 'Ease into the next frame.', 'Let the cut hold a beat.'],
      ['Checking light and texture.', 'The materials are ready.', 'Render pass is looking good.'],
      ['Exploring another variation.', 'Try a different direction.', 'The new draft is in.'],
      ['The latest cut is ready.', 'Checking the pacing.', 'One more pass on colour.'],
      ['Try another camera angle.', 'That light works.', 'Rolling on the next shot.']
    ];
    hero.querySelectorAll('.design-note').forEach((note, index) => {
      const message = note.querySelector('span') || note.appendChild(document.createElement('span'));
      const type = { count: 0 };
      notes.fromTo(note, { x: -13, y: -9 }, {
        x: 21, y: 14, duration: 2.7 + index * .3, ease: 'sine.inOut', repeat: 3, yoyo: true
      }, index * .36);
      phrases[index].forEach((line, turn) => {
        const start = .55 + index * .64 + turn * 5.4;
        notes.fromTo(message, { opacity: 0, y: -5 }, { opacity: 1, y: 0, duration: .27 }, start)
          .fromTo(type, { count: 0 }, {
            count: line.length, duration: .82, ease: 'none', immediateRender: false,
            onUpdate: () => { message.textContent = line.slice(0, Math.round(type.count)); }
          }, start)
          .to(message, { opacity: 0, y: -3, duration: .38 }, start + 3.1);
      });
    });
    notes.to('.print-book', { rotation: 1, y: -5, duration: 2.6, repeat: 7, yoyo: true, ease: 'sine.inOut' }, 0)
      .to('.render-mesh', { opacity: 0, duration: 2.2, repeat: 5, repeatDelay: 1.2, yoyo: true, ease: 'sine.inOut' }, 1)
      .to('.film-playhead', { left: '94%', duration: 4.8, repeat: 3, ease: 'none' }, .2)
      .to('.recording', { opacity: .34, duration: .65, repeat: 29, yoyo: true }, .2)
      .to('.variation-grid i', {
        scale: 1.15, filter: 'brightness(1.23)', duration: 1.6, stagger: .26, repeat: 11, yoyo: true, ease: 'sine.inOut'
      }, .5);

    const heroActivity = ScrollTrigger.create({
      trigger: hero,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: trigger => updateNotes(trigger.isActive)
    });
    function updateNotes(active) {
      notes.paused(document.hidden || !active || hero.classList.contains('layer-off'));
    }
    listen(document, 'visibilitychange', () => updateNotes(heroActivity.isActive));
    updateNotes(heroActivity.isActive);

    const introOverlay = document.querySelector('.intro-overlay');
    if (hero.getBoundingClientRect().bottom > 0 && ['', '#top'].includes(location.hash)) {
      introOverlay.hidden = false;
      gsap.timeline({ onComplete: () => { introOverlay.hidden = true; } })
        .from('.intro-orb', { scale: .87, opacity: 0, duration: .34, ease: 'power2.out' })
        .from('.intro-orb b', { opacity: .18, filter: 'blur(8px)', duration: .29 }, .1)
        .to(introOverlay, { opacity: 0, duration: .38, ease: 'power2.inOut' }, .53);
    }
    if (hero.getBoundingClientRect().bottom > 0) {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.nav', { y: -18, opacity: 0, duration: .55 }, 0)
        .from(studioPanels, { y: 34, opacity: 0, scale: .94, duration: .9, stagger: .07 }, .05)
        .from(layerButton, { y: 14, opacity: 0, duration: .55 }, .18)
        .from(heroSelection, { opacity: .24, duration: .75 }, .22)
        .from('.glyph', { y: 37, opacity: 0, duration: .76, stagger: .045 }, .25)
        .from('.hero-dot', { y: -24, scale: .4, opacity: 0, duration: .78, ease: 'back.out(2)' }, .51)
        .from('.hero-lede, .hero-actions .pill', { y: 25, opacity: 0, duration: .62, stagger: .12 }, .49);
    }

    const parallax = [...hero.querySelectorAll('.studio-art')].map(art => ({
      x: gsap.quickTo(art, 'x', { duration: .8, ease: 'power3.out' }),
      y: gsap.quickTo(art, 'y', { duration: .8, ease: 'power3.out' })
    }));
    const inspector = hero.querySelector('.glyph-inspector');
    const outline = inspector.querySelector('text');
    const measuring = document.createElement('canvas').getContext('2d');
    let activeGlyph;
    function clearInspection() {
      activeGlyph?.classList.remove('is-inspected');
      activeGlyph = null;
      inspector.hidden = true;
      heroSelection.classList.remove('inspecting');
    }
    function inspectGlyph(event) {
      if (!finePointer.matches || event.pointerType === 'touch' || hero.classList.contains('layer-off') || event.buttons) {
        clearInspection();
        return;
      }
      const frame = heroSelection.getBoundingClientRect();
      const inside = event.clientX >= frame.left && event.clientX <= frame.right && event.clientY >= frame.top && event.clientY <= frame.bottom;
      if (!inside) { clearInspection(); return; }
      heroSelection.classList.add('inspecting');
      const glyph = event.target.closest('.glyph');
      if (glyph === activeGlyph) return;
      activeGlyph?.classList.remove('is-inspected');
      activeGlyph = glyph;
      inspector.hidden = !glyph;
      if (!glyph || !measuring) return;
      const font = getComputedStyle(glyph);
      measuring.font = font.fontWeight + ' ' + font.fontSize + ' ' + font.fontFamily;
      const metric = measuring.measureText(glyph.textContent);
      const rect = glyph.getBoundingClientRect();
      const width = Math.max(1, metric.actualBoundingBoxLeft + metric.actualBoundingBoxRight);
      const height = Math.max(1, metric.actualBoundingBoxAscent + metric.actualBoundingBoxDescent);
      const scaleX = 1.06;
      const fontHeight = metric.fontBoundingBoxAscent + metric.fontBoundingBoxDescent;
      const baseline = rect.top + (rect.height - fontHeight) / 2 + metric.fontBoundingBoxAscent;
      inspector.style.left = (rect.left - frame.left - metric.actualBoundingBoxLeft * scaleX - 4) + 'px';
      inspector.style.top = (baseline - frame.top - metric.actualBoundingBoxAscent - 4) + 'px';
      inspector.style.width = (width * scaleX + 8) + 'px';
      inspector.style.height = (height + 8) + 'px';
      outline.textContent = glyph.textContent;
      outline.style.font = font.fontWeight + ' ' + font.fontSize + ' ' + font.fontFamily;
      outline.setAttribute('x', (metric.actualBoundingBoxLeft + 4 / scaleX).toString());
      outline.setAttribute('y', (metric.actualBoundingBoxAscent + 4).toString());
      outline.setAttribute('transform', 'scale(' + scaleX + ' 1)');
      inspector.querySelector('small').textContent = glyph.textContent + ' · ' + Math.round(width * scaleX) + ' × ' + Math.round(height);
      glyph.classList.add('is-inspected');
    }
    const pixels = hero.querySelector('.hero-pixels');
    const pixelContext = pixels.getContext('2d');
    const cells = new Map();
    let pointer;
    let painting = false;
    function paintPixels() {
      if (!pixelContext) return;
      pixelContext.clearRect(0, 0, pixels.width, pixels.height);
      const time = performance.now();
      cells.forEach((cell, key) => {
        const life = Math.max(0, 1 - (time - cell.time) / 820);
        if (!life) { cells.delete(key); return; }
        pixelContext.fillStyle = page.dataset.theme === 'light' ? 'rgba(39,33,51,' + life * .10 + ')' : 'rgba(230,226,237,' + life * .105 + ')';
        pixelContext.fillRect(cell.x * 56 + 1, cell.y * 56 + 1, 54, 54);
      });
      if (pointer) {
        const glow = pixelContext.createRadialGradient(pointer.x, pointer.y, 1, pointer.x, pointer.y, 68);
        glow.addColorStop(0, 'rgba(231,218,244,.075)');
        glow.addColorStop(1, 'rgba(231,218,244,0)');
        pixelContext.fillStyle = glow;
        pixelContext.fillRect(pointer.x - 68, pointer.y - 68, 136, 136);
      }
      if (!cells.size) {
        painting = false;
        gsap.ticker.remove(paintPixels);
      }
    }
    const pixelResize = new ResizeObserver(() => {
      pixels.width = pixels.clientWidth;
      pixels.height = pixels.clientHeight;
      clearInspection();
    });
    pixelResize.observe(pixels);
    hero.addEventListener('pointermove', event => {
      if (!finePointer.matches || event.pointerType === 'touch') return;
      const bounds = hero.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      const cellX = Math.floor(pointer.x / 56);
      const cellY = Math.floor(pointer.y / 56);
      cells.set(cellX + ',' + cellY, { x: cellX, y: cellY, time: performance.now() });
      if (!painting) {
        painting = true;
        gsap.ticker.add(paintPixels);
      }
      inspectGlyph(event);
      if (hero.classList.contains('layer-off')) return;
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      parallax.forEach((art, index) => {
        art.x(x * (index ? -32 : 32));
        art.y(y * 23);
      });
    }, { signal, passive: true });
    listen(hero, 'pointerleave', () => {
      pointer = null;
      if (!painting) paintPixels();
      clearInspection();
      parallax.forEach(art => { art.x(0); art.y(0); });
    });
    listen(layerButton, 'click', () => {
      const enabled = layerButton.getAttribute('aria-checked') === 'true';
      gsap.to(designLayers, { opacity: enabled ? 1 : 0, duration: .42, ease: 'power2.inOut', overwrite: 'auto' });
      if (!enabled) clearInspection();
      if (enabled) gsap.fromTo('.handles i', { scale: .25 }, { scale: 1, duration: .45, stagger: .033, ease: 'back.out(2)' });
      updateNotes(heroActivity.isActive);
    });

    function prepareRoll(control) {
      if (control.querySelector('.button-roll')) return;
      const label = [...control.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (!label) return;
      const roll = document.createElement('span');
      roll.className = 'button-roll';
      const front = document.createElement('span');
      const back = document.createElement('span');
      front.textContent = back.textContent = label.textContent.trim();
      back.setAttribute('aria-hidden', 'true');
      roll.append(front, back);
      label.replaceWith(roll);
    }
    const movingControls = '.pill, .circle, .layer-toggle, .nav-links a, .wordmark, .footer a, .contact-email, .experience-card a, #flow-light, .drawer-content nav a, .contact-menu > a, .contact-menu > button';
    document.querySelectorAll(movingControls).forEach(control => {
      if (control.matches('.pill:not(#card-pause),.circle,.layer-toggle')) control.classList.add('specular');
      if (control.matches('.pill:not(#card-pause)')) prepareRoll(control);
      control.addEventListener('pointermove', event => {
        const rect = control.getBoundingClientRect();
        control.style.setProperty('--shine-x', event.clientX - rect.left + 'px');
        control.style.setProperty('--shine-y', event.clientY - rect.top + 'px');
      }, { signal, passive: true });
      hover(control, active => {
        if (control.disabled) return;
        const compact = control.matches('.circle, .layer-toggle');
        const arrow = control.querySelector(':scope > span[aria-hidden=true]');
        const roll = control.querySelectorAll('.button-roll > span');
        if (roll.length) gsap.to(roll, { yPercent: active ? -100 : 0, duration: .33, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(control, { y: active && !roll.length ? -2 : 0, scale: active && compact ? 1.045 : 1, duration: .3, ease: 'power2.out', overwrite: 'auto' });
        if (arrow) gsap.to(arrow, { x: active ? 4 : 0, duration: .33, ease: 'power3.out', overwrite: 'auto' });
      });
      listen(control, 'pointerdown', () => {
        if (!control.disabled) gsap.fromTo(control, { scale: .95 }, { scale: 1, duration: .4, ease: 'back.out(2)', overwrite: 'auto' });
      });
    });
    const menu = document.querySelector('.mobile-drawer');
    const drawer = menu.querySelector('.drawer-content');
    let menuMotion;
    listen(menu, 'portfolio:menu', () => {
      menuMotion?.kill();
      menuMotion = gsap.timeline()
        .fromTo(drawer, { xPercent: 100 }, { xPercent: 0, duration: .44, ease: 'power3.out' }, 0)
        .fromTo(menu.querySelectorAll('nav a,.drawer-footer a'), { x: 19, opacity: 0 }, { x: 0, opacity: 1, duration: .32, stagger: .034, ease: 'power2.out' }, .14);
    });
    listen(menu, 'portfolio:menu-close', event => {
      event.preventDefault();
      menuMotion?.kill();
      menuMotion = gsap.to(drawer, { xPercent: 100, duration: .28, ease: 'power2.in', onComplete: () => menu.close() });
    });
    listen(document.querySelector('.theme-button'), 'click', () => {
      const icon = document.querySelector(page.dataset.theme === 'light' ? '.moon' : '.sun');
      gsap.fromTo(icon, { rotation: -85, scale: .45 }, { rotation: 0, scale: 1, duration: .55, ease: 'back.out(1.9)' });
    });

    const statement = document.querySelector('.statement');
    const statementCopy = statement.querySelector('p');
    if (!statementCopy.querySelector('.statement-word')) {
      for (const parent of [statementCopy, statementCopy.querySelector('em')]) {
        [...parent.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => {
          node.replaceWith(...node.textContent.split(/(\s+)/).filter(Boolean).map(word => {
            if (/^\s+$/.test(word)) return word;
            const span = document.createElement('span');
            span.className = 'statement-word';
            span.textContent = word;
            return span;
          }));
        });
      }
    }
    const workSequence = document.querySelector('.work-sequence');
    const workMotion = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: workSequence, start: 'top top', end: () => '+=' + workSequence.querySelector('.work-space').offsetHeight,
        scrub: true
      }
    });
    workMotion.fromTo(statement.querySelectorAll('.statement-word'), { opacity: .18 }, {
      opacity: 1, duration: .10, stagger: { amount: .47 }
    }, .03);
    statement.querySelectorAll('.statement-drawing').forEach(drawing => {
      const guide = drawing.querySelector('.ink-path');
      const tool = drawing.querySelector('.drawing-tool');
      const paths = guide.getAttribute('d').split(/(?=M)/).map(data => {
        const path = guide.cloneNode();
        path.setAttribute('d', data);
        path.classList.add('ink-segment');
        guide.before(path);
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        return { path, length };
      });
      guide.style.visibility = 'hidden';
      const length = paths.reduce((total, segment) => total + segment.length, 0);
      const drawingProgress = { value: 0 };
      const draw = () => {
        let distance = length * drawingProgress.value;
        let tip;
        for (const segment of paths) {
          const visibleLength = Math.max(0, Math.min(segment.length, distance));
          segment.path.style.strokeDashoffset = segment.length - visibleLength;
          if (!tip && distance <= segment.length) tip = segment.path.getPointAtLength(visibleLength);
          distance -= segment.length;
        }
        tip ||= paths.at(-1).path.getPointAtLength(paths.at(-1).length);
        tool.setAttribute('transform', 'translate(' + tip.x + ' ' + tip.y + ')');
      };
      draw();
      workMotion.to(drawingProgress, { value: 1, duration: .59, onUpdate: draw, onReverseComplete: draw }, 0);
    });
    workMotion.to('.work-track', { xPercent: -100, duration: .39 }, .61);

    const work = document.querySelector('.work');
    function bringSceneIntoView(panel, anchor) {
      if (Math.abs(panel.getBoundingClientRect().left) < 36) return;
      window.scrollTo({ top: scrollY + anchor.getBoundingClientRect().top, behavior: 'instant' });
    }
    listen(work, 'focusin', () => bringSceneIntoView(work, workSequence.querySelector('#work')));
    gsap.from(work.querySelectorAll('.section-head > *, .folder-hint'), {
      y: 23, opacity: .18, duration: .54, stagger: .06, ease: 'power2.out',
      scrollTrigger: { trigger: workSequence, start: () => 'top -' + workSequence.querySelector('.work-space').offsetHeight * .72 + 'px', once: true }
    });
    const tray = document.querySelector('.folder-tray');
    const folders = tray.querySelectorAll('.folder');
    folders.forEach(folder => {
      const face = folder.querySelector('.folder-face');
      const preview = folder.querySelector('.folder-preview');
      const label = folder.querySelector('.folder-tab');
      hover(folder, active => {
        gsap.to(face, { y: active ? (innerWidth <= 640 ? -5 : -12) : 0, duration: .4, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(preview, { y: active ? -4 : -12, yPercent: active ? -67 : 0, opacity: active ? 1 : 0, duration: .4, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(label, { filter: active ? 'brightness(1.1)' : 'brightness(1)', duration: .3, overwrite: 'auto' });
      });
    });

    const dialog = document.querySelector('.project-dialog');
    const projectSheet = dialog.querySelector('.project-sheet');
    const projectVisual = dialog.querySelector('.project-visual');
    const projectCopy = dialog.querySelector('.project-copy');
    let projectEntrance;
    let projectExit;
    let closingProject = false;
    listen(dialog, 'portfolio:project', event => {
      const { opening, direction } = event.detail;
      prepareRoll(dialog.querySelector('#project-link'));
      projectExit?.kill();
      projectEntrance?.kill();
      if (closingProject) {
        closingProject = false;
        gsap.set(dialog, { clearProps: 'opacity' });
        gsap.set(projectSheet, { clearProps: 'transform' });
      }
      projectEntrance = gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } });
      if (opening) {
        const sourceFolder = tray.querySelector('.project-active');
        const pullDistance = gsap.utils.clamp(48, innerWidth <= 640 ? 150 : 300, sourceFolder.offsetTop - dialog.offsetTop + 68);
        projectEntrance
          .fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: .4, clearProps: 'opacity' }, 0)
          .fromTo(projectSheet, { y: pullDistance, scale: .9 }, { y: 0, scale: 1, duration: .62, clearProps: 'transform' }, 0);
      }
      projectEntrance
        .fromTo(projectVisual, { x: opening ? -16 : direction * 28, opacity: .15 }, { x: 0, opacity: 1, duration: .48 }, .08)
        .fromTo([...projectCopy.children].filter(element => !element.hidden), { y: 19, opacity: .15 }, { y: 0, opacity: 1, duration: .45, stagger: .047 }, .11);
    });
    listen(dialog, 'portfolio:close-project', event => {
      event.preventDefault();
      if (closingProject) return;
      closingProject = true;
      projectEntrance?.kill();
      projectExit = gsap.timeline({
        defaults: { duration: .25, ease: 'power2.in', overwrite: 'auto' },
        onComplete: () => {
          closingProject = false;
          dialog.close();
          gsap.set(dialog, { clearProps: 'opacity' });
          gsap.set(projectSheet, { clearProps: 'transform' });
        }
      }).to(dialog, { opacity: 0 }, 0).to(projectSheet, { y: 42, scale: .98 }, 0);
    });

    function lightScene(canvas, trigger, makeRays, { end = 'bottom top', pointerTarget } = {}) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return () => {};
      const background = document.createElement('canvas');
      const backgroundContext = background.getContext('2d');
      let rays = [];
      let width = 0;
      let height = 0;
      let active = false;
      let playing = false;
      const pointer = { x: 0, y: 0, influence: 0 };
      const cursor = { x: 0, y: 0, influence: 0 };
      if (pointerTarget) {
        pointerTarget.addEventListener('pointermove', event => {
          if (event.pointerType === 'touch') return;
          const bounds = canvas.getBoundingClientRect();
          pointer.x = event.clientX - bounds.left;
          pointer.y = event.clientY - bounds.top;
          if (!pointer.influence) {
            cursor.x = pointer.x;
            cursor.y = pointer.y;
          }
          pointer.influence = 1;
        }, { signal, passive: true });
        listen(pointerTarget, 'pointerleave', () => { pointer.influence = 0; });
      }

      function pointAt(ray, progress) {
        const position = Math.max(0, Math.min(1, progress)) * (ray.points.length - 1);
        const index = Math.floor(position);
        const a = ray.points[index];
        const b = ray.points[index + 1] || a;
        const fraction = position - index;
        const x = a[0] + (b[0] - a[0]) * fraction;
        const y = a[1] + (b[1] - a[1]) * fraction;
        if (cursor.influence < .005) return [x, y];
        const dx = cursor.x - x;
        const dy = cursor.y - y;
        const pull = cursor.influence * .105 * Math.exp(-(dx * dx + dy * dy) / 55000);
        return [x + dx * pull, y + dy * pull];
      }

      function draw(time, delta = 16) {
        if (!width || !height) return;
        const smoothing = 1 - Math.exp(-Math.min(delta, 48) / 165);
        cursor.x += (pointer.x - cursor.x) * smoothing;
        cursor.y += (pointer.y - cursor.y) * smoothing;
        cursor.influence += (pointer.influence - cursor.influence) * smoothing;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(background, 0, 0, width, height);
        for (const ray of rays) {
          if (!ray.speed) continue;
          const phase = (time * ray.speed + ray.offset) % 1;
          const head = phase * (1.18 + ray.length) - .12;
          const tail = head - ray.length;
          if (head <= 0 || tail >= 1) continue;

          const start = pointAt(ray, tail);
          const tip = pointAt(ray, head);
          const visible = Math.min(1, head * 9, (1 - tail) * 10);
          const proximity = cursor.influence * Math.exp(-((cursor.x - tip[0]) ** 2 + (cursor.y - tip[1]) ** 2) / 49000);
          const alpha = Math.min(1, ray.brightness * visible * (1 + proximity * .24));
          if (Math.hypot(tip[0] - start[0], tip[1] - start[1]) < 1) continue;

          const points = Array.from({ length: 21 }, (_, i) => pointAt(ray, tail + ray.length * i / 20));
          ctx.beginPath();
          ctx.moveTo(...start);
          for (const point of points.slice(1)) ctx.lineTo(...point);

          const bloom = ctx.createLinearGradient(...start, ...tip);
          bloom.addColorStop(0, ray.color + '00');
          bloom.addColorStop(.38, ray.color + '39');
          bloom.addColorStop(.79, ray.color + 'd2');
          bloom.addColorStop(1, ray.color + (ray.star ? 'de' : '00'));
          ctx.strokeStyle = bloom;
          for (const [size, opacity] of [[26, .038], [17, .065], [10, .12], [5, .24]]) {
            ctx.lineWidth = size * ray.thickness;
            ctx.globalAlpha = alpha * opacity;
            ctx.stroke();
          }

          const core = ctx.createLinearGradient(...start, ...tip);
          core.addColorStop(0, ray.color + '00');
          core.addColorStop(.3, ray.color + '32');
          core.addColorStop(.64, ray.color + 'c7');
          core.addColorStop(.84, ray.star ? ray.color : ray.highlight);
          core.addColorStop(1, ray.star ? ray.highlight : ray.color + '00');
          // A tapered core keeps bright highlights from looking like uniform dashes.
          const edges = points.map(([x, y], index) => {
            const before = points[Math.max(0, index - 1)];
            const after = points[Math.min(points.length - 1, index + 1)];
            const dx = after[0] - before[0];
            const dy = after[1] - before[1];
            const progress = index / (points.length - 1);
            const taper = ray.star ? progress ** .7 : Math.sin(Math.PI * progress) ** .65;
            const weight = taper * (ray.star ? 1.05 : 1.55) * ray.thickness / (Math.hypot(dx, dy) || 1);
            return [[x - dy * weight, y + dx * weight], [x + dy * weight, y - dx * weight]];
          });
          ctx.beginPath();
          ctx.moveTo(...edges[0][0]);
          for (const edge of edges) ctx.lineTo(...edge[0]);
          for (let i = edges.length - 1; i >= 0; i--) ctx.lineTo(...edges[i][1]);
          ctx.closePath();
          ctx.fillStyle = core;
          ctx.globalAlpha = alpha;
          ctx.fill();

          if (ray.star && head <= 1) {
            const radius = (11 + proximity * 2) * ray.thickness;
            const halo = ctx.createRadialGradient(...tip, 0, ...tip, radius);
            halo.addColorStop(0, '#fff7ff');
            halo.addColorStop(.15, ray.highlight);
            halo.addColorStop(.27, ray.color + 'a8');
            halo.addColorStop(.52, ray.color + '2c');
            halo.addColorStop(1, ray.color + '00');
            ctx.fillStyle = halo;
            ctx.fillRect(tip[0] - radius, tip[1] - radius, radius * 2, radius * 2);
          }
        }
        ctx.globalAlpha = 1;
      }

      function resize() {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        if (!width || !height) return;
        const scale = Math.min(devicePixelRatio || 1, 1.75, Math.sqrt(3500000 / (width * height)));
        canvas.width = background.width = Math.round(width * scale);
        canvas.height = background.height = Math.round(height * scale);
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.lineCap = ctx.lineJoin = 'round';
        backgroundContext.setTransform(scale, 0, 0, scale, 0, 0);
        rays = makeRays(width, height);
        for (const ray of rays) {
          const guide = backgroundContext.createLinearGradient(...ray.points[0], ...ray.points.at(-1));
          const color = ray.star ? ray.color : '#a78faa';
          guide.addColorStop(0, color + '00');
          guide.addColorStop(.52, color + (ray.star ? '04' : '0d'));
          guide.addColorStop(1, color + (ray.star ? '0a' : '32'));
          backgroundContext.strokeStyle = guide;
          backgroundContext.lineWidth = ray.star ? .9 : 1.65;
          backgroundContext.beginPath();
          backgroundContext.moveTo(...ray.points[0]);
          for (const point of ray.points.slice(1)) backgroundContext.lineTo(...point);
          backgroundContext.stroke();
        }
        draw(gsap.ticker.time);
      }

      function sync() {
        const shouldPlay = active && !document.hidden;
        if (shouldPlay === playing) return;
        playing = shouldPlay;
        if (playing) gsap.ticker.add(draw);
        else {
          pointer.influence = 0;
          cursor.influence = 0;
          gsap.ticker.remove(draw);
        }
      }
      const activity = ScrollTrigger.create({
        trigger, start: 'top bottom', end,
        onToggle: self => { active = self.isActive; sync(); }
      });
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      listen(document, 'visibilitychange', sync);
      active = activity.isActive;
      sync();

      return () => {
        observer.disconnect();
        gsap.ticker.remove(draw);
        canvas.width = 0;
      };
    }

    function curvePoints(start, firstControl, secondControl, end) {
      return Array.from({ length: 65 }, (_, index) => {
        const t = index / 64;
        const u = 1 - t;
        return start.map((value, axis) => u ** 3 * value + 3 * u * u * t * firstControl[axis] +
          3 * u * t * t * secondControl[axis] + t ** 3 * end[axis]);
      });
    }

    const processRun = document.querySelector('.process-run');
    const processIntro = processRun.querySelector('.process-intro');
    const processLights = processRun.querySelector('.process-lights');
    const stopProcessLights = lightScene(processLights, processRun, (width, height) => {
      const random = randomStream(49);
      const cx = width * .504;
      const cy = height * .54;
      const count = width > 900 ? 42 : 34;
      return Array.from({ length: count }, (_, index) => {
        const angle = (index + .35) / count * Math.PI * 2;
        const x = Math.cos(angle) * width;
        const y = Math.sin(angle) * height;
        return {
          points: curvePoints([cx + x * .02, cy + y * .025], [cx + x * .24 + y * .25, cy + y * .23 - x * .085],
            [cx + x * .47 + y * .47, cy + y * .50 - x * .13], [cx + x * 1.03, cy + y * .96]),
          color: index % 4 ? '#ec398f' : '#a581c3', highlight: '#ffd0eb',
          thickness: .94 + random() * .55, brightness: .46 + random() * .39,
          length: .24 + random() * .22, offset: random(), speed: index % 3 === 0 ? 0 : .062 + random() * .062
        };
      });
    }, { end: () => '+=' + (innerHeight + processRun.querySelector('#process').offsetTop), pointerTarget: processIntro });
    gsap.fromTo('.process-track', { x: 0, xPercent: -100 }, {
      x: 0, xPercent: 0, ease: 'power1.inOut', scrollTrigger: {
        trigger: processRun, start: 'top top', end: () => '+=' + processRun.querySelector('#process').offsetTop,
        scrub: true
      }
    });
    const workflow = document.querySelector('.workflow');
    const workflowPanel = processRun.querySelector('.workflow-panel');
    listen(workflow, 'focusin', () => bringSceneIntoView(workflowPanel, processRun.querySelector('#process')));
    workflow.querySelectorAll('.flow-progress button').forEach(dot => {
      hover(dot, active => gsap.to(dot, {
        scale: active ? 1.24 : 1, duration: .26, ease: 'power2.out', overwrite: 'auto'
      }));
    });
    const flowTrack = document.querySelector('.flow-track');
    const stages = flowTrack.querySelectorAll('.flow-stage');
    listen(flowTrack, 'portfolio:flow-stage', event => {
      const stage = stages[event.detail];
      const line = stage.querySelector('.flow-connector path');
      gsap.fromTo(stage, { scale: .975 }, { scale: 1, duration: .54, ease: 'power2.out', overwrite: 'auto' });
      if (line) gsap.fromTo(line, { strokeDashoffset: 32 }, { strokeDashoffset: 0, duration: .85, ease: 'power2.out', overwrite: 'auto' });
      if (event.detail === 4) gsap.fromTo('.flow-loop path', { strokeDashoffset: 36 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(workflow, { '--board-hue': [205, 193, 298, 254, 328, 186][event.detail], duration: .76, overwrite: 'auto' });
      gsap.fromTo('#active-step', { y: 4, opacity: .35 }, { y: 0, opacity: 1, duration: .27, overwrite: 'auto' });
    });

    const about = document.querySelector('.about');
    const badge = about.querySelector('.badge');
    const badgeButton = badge.querySelector('.badge-flip');
    const badgeSwing = about.querySelector('.badge-swing');
    let angle = 0;
    let angularVelocity = 0;
    let extension = 0;
    let extensionVelocity = 0;
    let swingRunning = false;
    let badgeDrag;
    const rotateBadge = gsap.quickSetter(badgeSwing, 'rotation', 'deg');
    const tiltBadge = gsap.quickSetter(badge, 'rotationY', 'deg');
    function drawBadge() {
      rotateBadge(angle * 180 / Math.PI);
      tiltBadge(angle * -19);
      badgeSwing.style.setProperty('--badge-pull', extension.toFixed(2) + 'px');
    }
    function swingBadge(_, deltaMs) {
      const step = Math.min(deltaMs / 1000, .032);
      angularVelocity += (-13 * Math.sin(angle) - 3.6 * angularVelocity) * step;
      angle += angularVelocity * step;
      extensionVelocity += (-95 * extension - 13 * extensionVelocity) * step;
      extension += extensionVelocity * step;
      drawBadge();
      if (Math.abs(angle) + Math.abs(angularVelocity) < .004 && Math.abs(extension) + Math.abs(extensionVelocity) < .25) {
        angle = 0;
        extension = 0;
        drawBadge();
        swingRunning = false;
        gsap.ticker.remove(swingBadge);
      }
    }
    function releaseBadge() {
      if (!swingRunning) {
        swingRunning = true;
        gsap.ticker.add(swingBadge);
      }
    }
    drawBadge();
    ScrollTrigger.create({
      trigger: badge, start: 'top bottom', end: 'bottom top',
      onToggle: trigger => badgeSwing.classList.toggle('badge-visible', trigger.isActive)
    });
    ScrollTrigger.create({
      trigger: about, start: 'top 83%', once: true, onEnter: () => {
        if (badgeDrag) return;
        angle = -.055;
        angularVelocity = .11;
        releaseBadge();
      }
    });
    listen(badge, 'portfolio:badge-flip', () => {
      if (badgeDrag) return;
      angularVelocity += badge.classList.contains('is-flipped') ? .13 : -.13;
      releaseBadge();
    });
    listen(badgeButton, 'pointerdown', event => {
      if (event.button !== 0 || !event.isPrimary) return;
      badgeButton.dataset.dragged = 'false';
      badgeSwing.classList.add('badge-held');
      const parent = badgeSwing.offsetParent.getBoundingClientRect();
      const pivotDepth = parseFloat(getComputedStyle(badgeSwing).transformOrigin.split(' ')[1]);
      const pivotX = parent.left + badgeSwing.offsetLeft + badgeSwing.offsetWidth / 2;
      const pivotY = parent.top + badgeSwing.offsetTop + pivotDepth;
      const dx = event.clientX - pivotX;
      const dy = event.clientY - pivotY;
      badgeDrag = {
        id: event.pointerId, pivotX, pivotY, startAngle: angle + Math.atan2(dx, Math.max(90, dy)),
        startRadius: Math.hypot(dx, dy), startExtension: extension,
        x: event.clientX, y: event.clientY, at: performance.now()
      };
      angularVelocity = 0;
      extensionVelocity = 0;
      if (swingRunning) gsap.ticker.remove(swingBadge);
      swingRunning = false;
      badgeButton.setPointerCapture(event.pointerId);
    });
    badgeButton.addEventListener('pointermove', event => {
      if (!badgeDrag || badgeDrag.id !== event.pointerId) return;
      if (badgeButton.dataset.dragged !== 'true') {
        if (Math.hypot(event.clientX - badgeDrag.x, event.clientY - badgeDrag.y) < 7) return;
        badgeButton.dataset.dragged = 'true';
      }
      const now = performance.now();
      const dx = event.clientX - badgeDrag.pivotX;
      const dy = event.clientY - badgeDrag.pivotY;
      const mobile = innerWidth <= 640;
      const limit = mobile ? .25 : .46;
      const target = badgeDrag.startAngle - Math.atan2(dx, Math.max(90, dy));
      const next = gsap.utils.clamp(-limit, limit, target);
      const pull = (Math.hypot(dx, dy) - badgeDrag.startRadius) * .66 + badgeDrag.startExtension;
      const nextExtension = gsap.utils.clamp(-40, mobile ? 48 : 115, pull);
      const time = Math.max(16, now - badgeDrag.at) / 1000;
      angularVelocity = gsap.utils.clamp(-1.7, 1.7, (next - angle) / time);
      extensionVelocity = gsap.utils.clamp(-240, 240, (nextExtension - extension) / time);
      angle = next;
      extension = nextExtension;
      badgeDrag.at = now;
      drawBadge();
    }, { signal });
    listen(badgeButton, 'lostpointercapture', () => {
      if (!badgeDrag) return;
      if (performance.now() - badgeDrag.at > 85) {
        angularVelocity = 0;
        extensionVelocity = 0;
      }
      badgeDrag = null;
      badgeSwing.classList.remove('badge-held');
      releaseBadge();
    });
    reveal(about, about.querySelectorAll('.section-head > *, .profile-facts, .card-stack, .card-controls, .card-hint'));
    const skills = document.querySelector('.skills');
    reveal(skills, skills.querySelectorAll('.section-head > *, .skills-showcase'));
    const stack = about.querySelector('.card-stack');
    const deck = [...stack.querySelectorAll('.bio-card')];
    function cardPose(card) {
      const depth = Math.min(3, Number(card.dataset.depth));
      return { x: 0, y: depth * 16, rotation: [0, -2.2, 1.8, -1.4][depth], scale: 1 - depth * .032 };
    }
    deck.forEach(card => gsap.set(card, cardPose(card)));
    let deckMotion;
    listen(stack, 'portfolio:card', event => {
      const { from, direction } = event.detail;
      deckMotion?.kill();
      gsap.killTweensOf(deck);
      deck.forEach(card => gsap.set(card, { clearProps: 'opacity,visibility,zIndex' }));
      gsap.set(from, { zIndex: 8, visibility: 'visible' });
      deckMotion = gsap.timeline({ defaults: { ease: 'power3.out' } });
      deckMotion.to(from, { x: -direction * 177, y: -18, rotation: -direction * 13, scale: .965, duration: .32 }, 0)
        .to(from, { opacity: 0, duration: .17 }, .15)
        .set(from, { ...cardPose(from), clearProps: 'opacity,visibility,zIndex' });
      deck.filter(card => card !== from).forEach(card => {
        deckMotion.to(card, { ...cardPose(card), duration: .56 }, .05);
      });
    });
    listen(stack, 'portfolio:card-drag', event => {
      const card = stack.querySelector('[data-depth="0"]');
      const shift = gsap.utils.clamp(-140, 140, event.detail * .8);
      gsap.to(card, { x: shift, rotation: shift * .075, duration: .18, overwrite: 'auto' });
    });
    const cardRing = about.querySelector('.card-progress circle');
    let ringMotion;
    listen(stack, 'portfolio:slideshow', event => {
      ringMotion?.kill();
      gsap.set(cardRing, { strokeDashoffset: 1 });
      if (event.detail.running) ringMotion = gsap.to(cardRing, { strokeDashoffset: 0, duration: event.detail.duration, ease: 'none' });
    });

    const experience = document.querySelector('.experience');
    reveal(experience, experience.querySelectorAll('.section-head > *'));
    const entries = [...experience.querySelectorAll('.timeline-entry')];
    entries.forEach(entry => {
      const card = entry.querySelector('.experience-card');
      hover(card, active => gsap.to(card, {
        scale: active ? 1.015 : 1, duration: .35, ease: 'power2.out', overwrite: 'auto'
      }));
    });
    const timeline = experience.querySelector('.timeline');
    const trace = timeline.querySelector('.timeline-trace');
    const comet = timeline.querySelector('.timeline-comet');
    const markers = entries.map(entry => entry.querySelector('i'));
    const moveComet = gsap.quickSetter(comet, 'y', 'px');
    const milestonePositions = () => {
      const top = timeline.getBoundingClientRect().top;
      return markers.map(marker => {
        const bounds = marker.getBoundingClientRect();
        return bounds.top + bounds.height / 2 - top;
      });
    };
    const scrollPosition = { value: 0 };
    let illuminated = -1;
    let milestones = milestonePositions();
    function traceComet() {
      const start = Math.max(18, milestones[0] - 112);
      const position = start + scrollPosition.value * (timeline.clientHeight - start);
      moveComet(position);
      trace.style.setProperty('--untraced', Math.max(0, timeline.clientHeight - position) + 'px');
      comet.style.setProperty('--comet-size', (1 + scrollPosition.value * 1.1).toFixed(3));
      comet.style.setProperty('--comet-length', (1 + scrollPosition.value * .65).toFixed(3));
      const next = milestones.findLastIndex(marker => marker < position + 10);
      if (next === illuminated) return;
      illuminated = next;
      entries.forEach((entry, index) => entry.classList.toggle('comet-passed', index <= next));
    }
    ScrollTrigger.create({
      trigger: timeline, start: 'top bottom', end: 'bottom top',
      onToggle: trigger => timeline.classList.toggle('is-tracing', trigger.isActive)
    });
    traceComet();
    gsap.to(scrollPosition, {
      value: 1, ease: 'none', onUpdate: traceComet,
      scrollTrigger: {
        trigger: timeline, start: 'top 60%', end: 'bottom 60%', scrub: .52,
        onRefresh: () => {
          milestones = milestonePositions();
          traceComet();
        }
      }
    });

    const contact = document.querySelector('.contact');
    reveal(contact, contact.querySelectorAll('h2, .contact-content>p, .contact-actions, .contact-email'), { y: 44, opacity: .2 });
    const contactMenu = contact.querySelector('.contact-menu');
    listen(contactMenu, 'portfolio:contact-menu', () => {
      gsap.fromTo(contactMenu, { y: -9, opacity: .2, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: .36, ease: 'power3.out', overwrite: 'auto' });
      gsap.fromTo(contactMenu.querySelectorAll('a,button'), { y: -5, opacity: 0 }, { y: 0, opacity: 1, duration: .27, stagger: .038, overwrite: 'auto' });
    });
    const meteorLayer = contact.querySelector('.contact-meteors');
    const stopContactLights = lightScene(meteorLayer, contact, (width, height) => {
      const random = randomStream(77);
      const palette = [
        ['#e82f76', '#ffb9dc'], ['#7856e3', '#d8c9ff'], ['#efe6f3', '#fffcff'],
        ['#f33d81', '#ffe0ef'], ['#c2bfd6', '#fcf5ff']
      ];
      const count = Math.round(Math.max(36, Math.min(124, width / 14)));
      return Array.from({ length: count }, (_, index) => {
        const spread = (index / (count - 1) - .5) * width * 1.21;
        const origin = width / 2 + spread * .75 + (random() - .5) * 15;
        const endpoint = width / 2 + spread * 1.42;
        const [color, highlight] = palette[index % palette.length];
        return {
          points: curvePoints([origin, -height * .22], [origin + spread * .01, height * .23],
            [origin + spread * .20, height * .76], [endpoint, height * (1.03 + random() * .15)]),
          color, highlight, star: true, thickness: .68 + random() * .68, brightness: .61 + random() * .37,
          length: .22 + random() * .28, offset: random(), speed: .035 + random() * .059
        };
      });
    }, { pointerTarget: contact });
    redrawContactSky?.();

    const footer = document.querySelector('.footer');
    reveal(footer, footer.querySelectorAll('.footer-top > *'));
    reveal(footer.querySelector('.footer-name'), footer.querySelector('.footer-name'), { y: 63, opacity: .4 });
    document.fonts.ready.then(() => { if (!signal.aborted) ScrollTrigger.refresh(); });

    return () => {
      listeners.abort();
      page.classList.remove('has-motion');
      introOverlay.hidden = true;
      clearInspection();
      pixelResize.disconnect();
      gsap.ticker.remove(paintPixels);
      gsap.ticker.remove(swingBadge);
      badgeSwing.classList.remove('badge-visible', 'badge-held');
      badgeSwing.style.removeProperty('--badge-pull');
      delete badgeButton.dataset.dragged;
      comet.style.removeProperty('--comet-size');
      comet.style.removeProperty('--comet-length');
      trace.style.removeProperty('--untraced');
      timeline.classList.remove('is-tracing');
      entries.forEach(entry => entry.classList.remove('comet-passed'));
      pixelContext?.clearRect(0, 0, pixels.width, pixels.height);
      stopContactLights();
      stopProcessLights();
      redrawContactSky?.();
      statement.querySelectorAll('.ink-segment').forEach(path => path.remove());
      statement.querySelectorAll('.ink-path').forEach(path => { path.style.visibility = ''; });
      if (menu.open) menu.close();
      if (closingProject) dialog.close();
    };
  });
})();
