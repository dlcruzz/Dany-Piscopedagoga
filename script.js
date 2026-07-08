// Nexus Psicopedagogia — interactions
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- preloader ----------
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloader-fill');
  let progress = 0;
  const loadTimer = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) progress = 100;
    preloaderFill.style.width = progress + '%';
    if (progress >= 100) clearInterval(loadTimer);
  }, 120);
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloaderFill.style.width = '100%';
      setTimeout(() => preloader.classList.add('done'), 250);
    }, 500);
  });
  // safety net in case 'load' takes too long
  setTimeout(() => preloader && preloader.classList.add('done'), 3500);

  // ---------- dark mode ----------
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const stored = null; // no localStorage per platform rules — session-only toggle
  themeToggle.addEventListener('click', () => {
    root.classList.toggle('dark');
    document.dispatchEvent(new CustomEvent('themechange', { detail: { dark: root.classList.contains('dark') } }));
  });

  // ---------- custom cursor ----------
  if (window.matchMedia('(min-width:901px)').matches && window.matchMedia('(hover:hover)').matches) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let rx = 0, ry = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      tx = e.clientX; ty = e.clientY;
    });
    function ringLoop() {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();
    document.querySelectorAll('a, button, .tilt, summary').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  // ---------- scroll progress + nav + back-to-top ----------
  const nav = document.getElementById('nav');
  const scrollProgress = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');
  const toTopProgress = document.getElementById('toTopProgress');
  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
    scrollProgress.style.width = pct + '%';
    if (toTopProgress) toTopProgress.style.strokeDashoffset = (110 - (110 * pct / 100)).toFixed(1);

    if (scrollTop > 12) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    if (scrollTop > 500) toTop.classList.add('visible'); else toTop.classList.remove('visible');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---------- smooth anchor scroll offset for sticky nav ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ---------- scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 40);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));

  // ---------- hand-drawn scroll doodles ----------
  const doodles = document.querySelectorAll('.doodle');
  if (doodles.length) {
    if (reduceMotion) {
      doodles.forEach(el => el.classList.add('seen'));
    } else {
      const doodleIo = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('seen');
            doodleIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      doodles.forEach(el => doodleIo.observe(el));
    }
  }

  // ---------- parallax background blobs ----------
  const blobs = document.querySelectorAll('.blob');
  if (!reduceMotion && blobs.length) {
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      blobs.forEach((b, i) => {
        b.style.transform = `translateY(${s * (i % 2 ? 0.06 : -0.05)}px)`;
      });
    }, { passive: true });
  }

  // ---------- cursor ambient glow ----------
  if (!reduceMotion && window.matchMedia('(min-width:901px)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let raf = null;
    window.addEventListener('mousemove', (e) => {
      glow.classList.add('active');
      if (raf) return;
      raf = requestAnimationFrame(() => {
        glow.style.setProperty('--gx', e.clientX + 'px');
        glow.style.setProperty('--gy', e.clientY + 'px');
        raf = null;
      });
    });
    window.addEventListener('mouseleave', () => glow.classList.remove('active'));
  }

  // ---------- 3D tilt on cards ----------
  if (!reduceMotion) {
    document.querySelectorAll('.tilt').forEach((el) => {
      const strength = 10;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(700px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) translateZ(6px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ---------- magnetic buttons ----------
  if (!reduceMotion && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.28}px, ${y * 0.32}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ---------- testimonial carousel ----------
  const track = document.getElementById('quotesTrack');
  const dotsWrap = document.getElementById('quotesDots');
  const quotesPrev = document.getElementById('quotesPrev');
  const quotesNext = document.getElementById('quotesNext');
  if (track) {
    const slides = track.children.length; // real slides
    if (slides > 1) {
      const firstClone = track.children[0].cloneNode(true);
      const lastClone = track.children[slides - 1].cloneNode(true);
      firstClone.setAttribute('aria-hidden', 'true');
      lastClone.setAttribute('aria-hidden', 'true');
      track.appendChild(firstClone);
      track.insertBefore(lastClone, track.children[0]);
    }
    // real slides now sit at track positions 1..slides (0 and slides+1 are the wrap-around clones)
    let current = 1, timer = null, jumping = false;
    track.style.transition = 'none';
    track.style.transform = 'translateX(-100%)';
    void track.offsetWidth;
    track.style.transition = '';

    for (let i = 0; i < slides; i++) {
      const b = document.createElement('button');
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => { goTo(i + 1); restartAutoplay(); });
      dotsWrap.appendChild(b);
    }

    function setDots(realIdx) {
      [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx === realIdx));
    }
    function goTo(i) {
      current = i;
      track.style.transform = `translateX(-${current * 100}%)`;
      setDots(((current - 1) + slides) % slides);
      jumping = (current === 0 || current === slides + 1);
    }
    track.addEventListener('transitionend', () => {
      if (!jumping) return;
      jumping = false;
      track.style.transition = 'none';
      current = current === 0 ? slides : 1;
      track.style.transform = `translateX(-${current * 100}%)`;
      void track.offsetWidth;
      track.style.transition = '';
    });
    function randomStep() {
      const realIdx = ((current - 1) + slides) % slides;
      let next = realIdx;
      if (slides > 1) {
        while (next === realIdx) next = Math.floor(Math.random() * slides);
      }
      goTo(next + 1);
    }
    function autoplay() {
      timer = setInterval(randomStep, 5200);
    }
    function restartAutoplay() {
      clearInterval(timer);
      if (!reduceMotion) autoplay();
    }
    quotesPrev.addEventListener('click', () => { goTo(current - 1); restartAutoplay(); });
    quotesNext.addEventListener('click', () => { goTo(current + 1); restartAutoplay(); });
    if (!reduceMotion) autoplay();
    track.closest('.quotes-carousel').addEventListener('mouseenter', () => clearInterval(timer));
    track.closest('.quotes-carousel').addEventListener('mouseleave', () => { if (!reduceMotion) autoplay(); });
  }

  // ---------- gallery feature carousel ----------
  const galleryFeature = document.getElementById('galleryFeature');
  const gallerySlides = document.querySelectorAll('#galleryTrack .gallery-slide');
  const galleryDotsWrap = document.getElementById('galleryDots');
  const galleryProgressFill = document.getElementById('galleryProgressFill');
  const galleryScratch = document.getElementById('galleryScratch');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  if (galleryFeature && gallerySlides.length) {
    const total = gallerySlides.length;
    let current = 0;
    let galleryTimer = null;
    const wipeVariants = ['h', 'd', 'c'];
    let variantIndex = 0;

    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      if (i === 0) b.classList.add('active');
      b.setAttribute('aria-label', `Ir para foto ${i + 1}`);
      b.addEventListener('click', () => { goToGallery(i); restartAutoplay(); });
      galleryDotsWrap.appendChild(b);
    }
    const galleryDots = galleryDotsWrap.children;

    function restartProgress() {
      if (!galleryProgressFill) return;
      galleryProgressFill.classList.remove('run');
      void galleryProgressFill.offsetWidth;
      galleryProgressFill.classList.add('run');
    }

    function goToGallery(i) {
      current = (i + total) % total;
      const variant = wipeVariants[variantIndex % wipeVariants.length];
      variantIndex++;

      gallerySlides.forEach((s) => s.classList.remove('wipe-h', 'wipe-d', 'wipe-c'));
      gallerySlides.forEach((s, idx) => s.classList.toggle('is-active', idx === current));
      const activeSlide = gallerySlides[current];
      void activeSlide.offsetWidth;
      activeSlide.classList.add('wipe-' + variant);

      if (galleryScratch && !reduceMotion) {
        galleryScratch.classList.remove('play-h', 'play-d', 'play-c');
        void galleryScratch.offsetWidth;
        galleryScratch.classList.add('play-' + variant);
      }

      [...galleryDots].forEach((d, idx) => d.classList.toggle('active', idx === current));
      restartProgress();
    }

    function autoplay() {
      galleryTimer = setInterval(() => goToGallery(current + 1), 5500);
    }
    function restartAutoplay() {
      clearInterval(galleryTimer);
      if (!reduceMotion) autoplay();
    }

    galleryPrev.addEventListener('click', () => { goToGallery(current - 1); restartAutoplay(); });
    galleryNext.addEventListener('click', () => { goToGallery(current + 1); restartAutoplay(); });
    galleryFeature.addEventListener('mouseenter', () => clearInterval(galleryTimer));
    galleryFeature.addEventListener('mouseleave', () => { if (!reduceMotion) autoplay(); });

    restartProgress();
    if (!reduceMotion) autoplay();
  }

  // ---------- process timeline fill ----------
  const processList = document.getElementById('processList');
  const processFill = document.getElementById('processFill');
  if (processList && processFill) {
    window.addEventListener('scroll', () => {
      const r = processList.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height;
      const visible = Math.min(Math.max(vh * 0.75 - r.top, 0), total);
      const pct = total > 0 ? (visible / total) * 100 : 0;
      processFill.style.height = pct + '%';
    }, { passive: true });
  }

  // ---------- hero 3D scene (three.js) ----------
  const canvas = document.getElementById('hero-3d');
  if (canvas && window.THREE && !reduceMotion) {
    initHero3D(canvas);
  }

  function initHero3D(canvas) {
    const THREE = window.THREE;
    const parent = canvas.parentElement;
    let width = parent.clientWidth, height = parent.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const group = new THREE.Group();
    scene.add(group);

    const colorsLight = { main: 0x4F7A5E, wire: 0xF6F2EA, sat: [0x3E6259, 0x8FA084, 0xD8C8A6] };
    const colorsDark = { main: 0x7FBFA0, wire: 0x1B2622, sat: [0x8FC9B8, 0x9CC0A0, 0xE7DCC6] };
    let palette = document.documentElement.classList.contains('dark') ? colorsDark : colorsLight;

    // ---- build a classic jigsaw-puzzle-piece silhouette (2 tabs, 2 blanks) ----
    function puzzlePieceShape(s) {
      const shape = new THREE.Shape();
      const t = s * 0.22; // tab radius
      const h = s / 2;
      shape.moveTo(-h, -h);
      shape.lineTo(-t * 0.6, -h);
      shape.absarc(0, -h, t, Math.PI, 0, true);      // concave blank, bottom edge
      shape.lineTo(h, -h);
      shape.lineTo(h, -t * 0.6);
      shape.absarc(h, 0, t, -Math.PI / 2, Math.PI / 2, false); // convex tab, right edge
      shape.lineTo(h, h);
      shape.lineTo(t * 0.6, h);
      shape.absarc(0, h, t, 0, Math.PI, false);       // convex tab, top edge
      shape.lineTo(-h, h);
      shape.lineTo(-h, t * 0.6);
      shape.absarc(-h, 0, t, Math.PI / 2, -Math.PI / 2, true); // concave blank, left edge
      shape.lineTo(-h, -h);
      return shape;
    }

    function makePuzzlePiece(size, depth, color) {
      const shape = puzzlePieceShape(size);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth, bevelEnabled: true, bevelThickness: size * 0.045, bevelSize: size * 0.04, bevelSegments: 2, curveSegments: 12
      });
      geo.center();
      const mat = new THREE.MeshStandardMaterial({ color, flatShading: false, roughness: 0.5, metalness: 0.06 });
      const mesh = new THREE.Mesh(geo, mat);
      const edges = new THREE.EdgesGeometry(geo, 25);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: palette.wire, transparent: true, opacity: 0.35 }));
      mesh.add(line);
      mesh.userData.edgeLine = line;
      return mesh;
    }

    const mainMesh = makePuzzlePiece(2.6, 0.7, palette.main);
    group.add(mainMesh);
    const mainMat = mainMesh.material;
    const wireMat = mainMesh.userData.edgeLine.material;

    const satellites = [];
    const satSizes = [1.1, 0.85, 0.95];
    for (let i = 0; i < 3; i++) {
      const m = makePuzzlePiece(satSizes[i], 0.32, palette.sat[i % palette.sat.length]);
      const radius = 3.0 + i * 0.55;
      m.userData.radius = radius;
      m.userData.speed = 0.25 + i * 0.12;
      m.userData.offset = i * 2.1;
      m.userData.tilt = 0.3 + i * 0.15;
      m.userData.mat = m.material;
      satellites.push(m);
      scene.add(m);
    }

    document.addEventListener('themechange', (e) => {
      palette = e.detail.dark ? colorsDark : colorsLight;
      mainMat.color.setHex(palette.main);
      wireMat.color.setHex(palette.wire);
      satellites.forEach((m, i) => {
        m.userData.mat.color.setHex(palette.sat[i % palette.sat.length]);
        if (m.userData.edgeLine) m.userData.edgeLine.material.color.setHex(palette.wire);
      });
    });

    const hemi = new THREE.HemisphereLight(0xF6F2EA, 0x24322D, 1.1);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3, 4, 5);
    scene.add(key);

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    });

    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.22 + mouseX * 0.6;
      group.rotation.x = Math.sin(t * 0.3) * 0.15 + mouseY * 0.3;
      group.position.y = Math.sin(t * 0.6) * 0.15;

      satellites.forEach((m) => {
        const { radius, speed, offset, tilt } = m.userData;
        const a = t * speed + offset;
        m.position.set(Math.cos(a) * radius, Math.sin(a * 1.3) * tilt * radius * 0.4, Math.sin(a) * radius * 0.6);
        m.rotation.x = t * 0.8;
        m.rotation.y = t * 0.6;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      width = parent.clientWidth; height = parent.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }
});
