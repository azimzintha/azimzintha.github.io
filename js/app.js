/**
 * ABDUL AZIM MASTHAN S - PORTFOLIO INTERACTION LOGIC
 * Features:
 * - Dynamic Spotlight Tracking
 * - Web Audio API Micro-SFX
 * - Dual-Dimension Perspective Switcher
 * - Interactive Terminal Console (CLI)
 * - Gallery Lightbox & Project Detail Modals
 * - Contact Copy & Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set Current Year in Footer
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

  /* ==========================================================================
     1. WEB AUDIO API SYNTHESIZER (MICRO-SFX)
     ========================================================================== */
  let sfxEnabled = true;
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.03) {
    if (!sfxEnabled || audioCtx.state === 'suspended') {
      if (sfxEnabled && audioCtx.state === 'suspended') {
        audioCtx.resume();
      } else {
        return;
      }
    }
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  const soundToggle = document.getElementById('soundToggle');
  soundToggle?.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    soundToggle.innerHTML = sfxEnabled 
      ? `<span class="sound-icon">🔊</span><span class="sound-text">SFX ON</span>`
      : `<span class="sound-icon">🔇</span><span class="sound-text">SFX OFF</span>`;
    if (sfxEnabled) playTone(587.33, 'sine', 0.1, 0.05); // D5
  });

  // Attach subtle click tone to interactive buttons
  document.querySelectorAll('button, .nav-link, .btn, .t-chip, .gallery-card').forEach(el => {
    el.addEventListener('mouseenter', () => playTone(880, 'sine', 0.04, 0.015));
    el.addEventListener('click', () => playTone(523.25, 'triangle', 0.08, 0.04));
  });

  /* ==========================================================================
     2. DYNAMIC SPOTLIGHT TRACKING (Cinematic Ambient Follower)
     ========================================================================== */
  const spotlightLayer = document.getElementById('spotlightLayer');
  window.addEventListener('mousemove', (e) => {
    if (!spotlightLayer) return;
    const x = e.clientX;
    const y = e.clientY;
    spotlightLayer.style.background = `radial-gradient(700px circle at ${x}px ${y}px, rgba(0, 136, 255, 0.09), transparent 70%)`;
  });

  /* ==========================================================================
     3. STICKY HEADER SCROLL STATE
     ========================================================================== */
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navMenu?.classList.remove('open'));
  });

  /* ==========================================================================
     4. PERSPECTIVE / DIMENSION CONTROLLER
     ========================================================================== */
  const dimButtons = document.querySelectorAll('.dim-btn');
  const heroBackdropSub = document.querySelector('.hero-backdrop-sub');

  dimButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dimButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const dim = btn.dataset.dim;
      document.body.setAttribute('data-dimension', dim);

      // Audio feedback tone
      playTone(659.25, 'sawtooth', 0.12, 0.03);

      if (heroBackdropSub) {
        if (dim === 'creative') {
          heroBackdropSub.textContent = 'CHIEF EXECUTIVE OFFICER • CINEMATOGRAPHER • MEDIA STUDIO';
        } else if (dim === 'tech') {
          heroBackdropSub.textContent = 'COMPUTER SCIENCE • APPLIED AI/ML • FULL-STACK WEB';
        } else {
          heroBackdropSub.textContent = 'ENTREPRENEUR • APPLIED AI • CINEMATIC MEDIA';
        }
      }
    });
  });

  /* ==========================================================================
     5. HERO METRIC COUNTERS
     ========================================================================== */
  const metricEls = document.querySelectorAll('.metric-val');
  let metricsAnimated = false;

  function animateMetrics() {
    metricEls.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const isPlus = el.textContent.includes('+');
      let current = 0;
      const step = Math.ceil(target / 20) || 1;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + (isPlus ? '+' : '');
          clearInterval(timer);
        } else {
          el.textContent = current + (isPlus ? '+' : '');
        }
      }, 40);
    });
  }

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        animateMetrics();
      }
    });
  }, { threshold: 0.3 });

  const heroSec = document.getElementById('hero');
  if (heroSec) heroObserver.observe(heroSec);

  /* ==========================================================================
     6. INTERACTIVE DEVELOPER TERMINAL (CLI)
     ========================================================================== */
  const terminalScreen = document.getElementById('terminalScreen');
  const terminalInput = document.getElementById('terminalInput');
  const terminalForm = document.getElementById('terminalForm');
  const quickChips = document.querySelectorAll('.t-chip');

  const COMMAND_REGISTRY = {
    help: () => `
<span class="t-brand">SUPPORTED COMMANDS:</span>
- <span class="t-hl">bio</span>        : Executive summary & background
- <span class="t-hl">skills</span>     : AI/ML, Web, and Media competencies
- <span class="t-hl">ai-model</span>   : Glaucoma Screening AI details
- <span class="t-hl">resume-ai</span>  : AI-Driven Resume Builder architecture
- <span class="t-hl">clickme</span>    : Click Me Photography (CEO role)
- <span class="t-hl">experience</span>: Career roadmap (internships & startup)
- <span class="t-hl">education</span> : Degree, college & NCC leadership
- <span class="t-hl">contact</span>   : Direct email, phone, and coordinates
- <span class="t-hl">socials</span>   : Social profiles (GitHub, LinkedIn, FB, IG, X)
- <span class="t-hl">hire</span>      : Open booking & collaboration prompt
- <span class="t-hl">clear</span>     : Wipe console screen`,

    bio: () => `
<strong class="t-hl">AZIM ZINTHA</strong> (Full Legal Name: <em>Abdul Azim Masthan S</em>)
Computer Science Engineering student bringing an unusual pairing of entrepreneurship and technical depth.
Serves as CEO of <strong>Click Me Photography</strong> (founded in 2014 by his father, Zintha A.S.) since June 2023, steering creative direction and studio operations.
Concurrently building hands-on depth across AI/ML engineering, responsive web platforms, and digital marketing.`,

    skills: () => `
<strong class="t-hl">TECHNICAL & CREATIVE SKILL MATRIX:</strong>
🧠 <strong>AI & Programming:</strong> Python, Machine Learning, Deep Learning (CNN), Data Preprocessing, Model Evaluation.
⚡ <strong>Web Development:</strong> Semantic HTML5, Modern Responsive CSS3, UI/UX, Performance & SEO.
🎥 <strong>Media Production:</strong> Cinematography, Directing, Lighting, Video Editing, DaVinci Resolve, CapCut.
🎨 <strong>Design & Grading:</strong> Adobe Photoshop, Adobe Lightroom, Canva.
🎖️ <strong>Leadership:</strong> NCC 'C' Certificate, All-Rounder Award, English & Tamil fluency.`,

    'ai-model': () => `
<strong class="t-hl">GLAUCOMA SCREENING AI DIAGNOSTIC MODEL [2026]</strong>
• <strong>Domain:</strong> Healthcare Diagnostic Intelligence & Computer Vision.
• <strong>Tech Stack:</strong> Python, Deep Learning / CNN, OpenCV, Preprocessing Pipeline.
• <strong>Functionality:</strong> Analyzes fundus retinal images to classify optical nerve head alterations and flag early markers of glaucoma risk.`,

    'resume-ai': () => `
<strong class="t-hl">AI-DRIVEN RESUME SYNTHESIZER [2026]</strong>
• <strong>Architecture:</strong> Python Backend + NLP Engine + Responsive Modern Frontend UI.
• <strong>Functionality:</strong> Dynamically ingests user profile metrics, maps industry skill taxonomies, and generates ATS-optimized resume outputs.`,

    clickme: () => `
<strong class="t-hl">CLICK ME PHOTOGRAPHY [EST. 2014 BY ZINTHA A.S.]</strong>
• <strong>Leadership:</strong> CEO (June 2023 - Present) / Cinematographer / Editor
• <strong>Legacy & Scaling:</strong> Established in 2014 by founder Zintha A.S. and expanded under CEO Abdul Azim into modern cinematic films and high-end productions.
• <strong>Services:</strong> High-end commercial cinematography, multi-camera shoots, event coverage, and master color grading with DaVinci Resolve.`,

    experience: () => `
<strong class="t-hl">PROFESSIONAL CAREER TIMELINE:</strong>
1. <strong>Click Me Photography (Est. 2014 by Zintha A.S. | CEO: 2023 - Present)</strong>
2. <strong>LITZ Tech, Coimbatore (July - Aug 2025):</strong> Web Development Intern (HTML/CSS)
3. <strong>Codework AI, Chennai (June - July 2026):</strong> Artificial Intelligence Intern (EDA, ML pipeline)
4. <strong>TVK Tech, Chennai (August 2026):</strong> Digital Marketing Intern (SEO, social content strategy)`,

    education: () => `
<strong class="t-hl">ACADEMIC CREDENTIALS & HONORS:</strong>
🎓 <strong>B.E. Computer Science and Engineering:</strong> Dr. G.U. Pope College of Engineering (Exp: 2027)
📚 <strong>Higher Secondary:</strong> Pope Memorial Higher Sec. School, Tuticorin (2023 - 70%)
🏫 <strong>SSLC:</strong> SMA Govt Higher Sec. School, Tuticorin (2021 - 80%)
🎖️ <strong>Awards:</strong> NCC 'C' Certificate Holder | Recognized All-Rounder with Leadership`,

    contact: () => `
<strong class="t-hl">CONNECT DIRECTLY:</strong>
📧 Email: <a href="mailto:azimzintha27@gmail.com" class="t-hl" style="text-decoration:underline;">azimzintha27@gmail.com</a>
📞 Phone / WhatsApp: <a href="tel:+919444415557" class="t-hl" style="text-decoration:underline;">+91 94444 15557</a>
🐙 GitHub: <a href="https://github.com/azimzintha" target="_blank" class="t-hl" style="text-decoration:underline;">github.com/azimzintha</a>
💼 LinkedIn: <a href="https://www.linkedin.com/in/abdul-azim27/" target="_blank" class="t-hl" style="text-decoration:underline;">linkedin.com/in/abdul-azim27/</a>
📘 Facebook: <a href="https://www.facebook.com/profile.php?id=61584407243679" target="_blank" class="t-hl" style="text-decoration:underline;">facebook.com/AzimZintha</a>
📸 Instagram: <a href="https://www.instagram.com/clickmephotography/" target="_blank" class="t-hl" style="text-decoration:underline;">@clickmephotography</a>
𝕏 X (Twitter): <a href="https://x.com/azim_zintha" target="_blank" class="t-hl" style="text-decoration:underline;">@azim_zintha</a>
📍 Location: Chennai, Tamil Nadu, India`,

    socials: () => `
<strong class="t-hl">OFFICIAL SOCIAL MEDIA CHANNELS:</strong>
• <strong>GitHub:</strong> <a href="https://github.com/azimzintha" target="_blank" class="t-hl">https://github.com/azimzintha</a>
• <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/abdul-azim27/" target="_blank" class="t-hl">https://www.linkedin.com/in/abdul-azim27/</a>
• <strong>Facebook:</strong> <a href="https://www.facebook.com/profile.php?id=61584407243679" target="_blank" class="t-hl">https://www.facebook.com/profile.php?id=61584407243679</a>
• <strong>Instagram:</strong> <a href="https://www.instagram.com/clickmephotography/" target="_blank" class="t-hl">https://www.instagram.com/clickmephotography/</a>
• <strong>X (Twitter):</strong> <a href="https://x.com/azim_zintha" target="_blank" class="t-hl">https://x.com/azim_zintha</a>`,

    hire: () => `
<strong class="t-hl">READY TO COLLABORATE?</strong>
Azim Zintha (Abdul Azim Masthan S) is open for AI engineering opportunities, web development contracts, and commercial cinematography shoots.
Scroll to the contact section or reach out at azimzintha27@gmail.com!`
  };

  function appendTerminalLine(content, type = 'output') {
    if (!terminalScreen) return;
    const line = document.createElement('div');
    line.className = `term-line ${type}`;
    line.innerHTML = content;
    terminalScreen.appendChild(line);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function handleTerminalCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    appendTerminalLine(`<span class="terminal-prompt-symbol">guest@azim-zintha:~$</span> ${escapeHtml(cmdRaw)}`, 'input-echo');

    if (cmd === 'clear') {
      terminalScreen.innerHTML = '';
      playTone(440, 'triangle', 0.05, 0.03);
      return;
    }

    if (COMMAND_REGISTRY[cmd]) {
      appendTerminalLine(COMMAND_REGISTRY[cmd]());
      playTone(520, 'sine', 0.08, 0.03);
    } else {
      appendTerminalLine(`Command not recognized: '<span style="color:#EF4444;">${escapeHtml(cmd)}</span>'. Type <strong class="t-hl">help</strong> for a list of commands.`, 'error');
      playTone(220, 'sawtooth', 0.1, 0.04);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  terminalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = terminalInput.value;
    terminalInput.value = '';
    handleTerminalCommand(val);
  });

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (cmd) handleTerminalCommand(cmd);
    });
  });

  /* ==========================================================================
     7. PROJECT DETAIL MODAL DATA & HANDLERS
     ========================================================================== */
  const projectModal = document.getElementById('projectModal');
  const projectModalBody = document.getElementById('projectModalBody');
  const projectModalClose = document.getElementById('projectModalClose');

  const PROJECT_DETAILS = {
    glaucoma: {
      title: 'Glaucoma Screening AI Diagnostic Model',
      category: 'Computer Vision & Deep Learning in Healthcare',
      year: '2026',
      description: `
        <p>Glaucoma is an irreversible ophthalmic disease often called the "silent thief of sight". This diagnostic system was created to provide high-confidence early screening from standard fundus retinal photographs.</p>
        <h4 style="margin: 18px 0 8px; color: var(--accent-gold);">Core Technical Architecture:</h4>
        <ul style="padding-left: 20px; line-height: 1.7; color: var(--text-muted);">
          <li><strong>Preprocessing Pipeline:</strong> Contrast Limited Adaptive Histogram Equalization (CLAHE), region-of-interest cropping around the optic disc, and artifact suppression.</li>
          <li><strong>CNN Classification:</strong> Deep Convolutional Neural Network trained to identify cup-to-disc ratio abnormalities and neuroretinal rim thinning.</li>
          <li><strong>Evaluation Metrics:</strong> Sensitivity, specificity, AUC-ROC verification to reduce false negatives in screening environments.</li>
        </ul>
        <h4 style="margin: 18px 0 8px; color: var(--accent-gold);">Tools & Libraries:</h4>
        <p style="color: var(--text-lead);">Python, TensorFlow / PyTorch, OpenCV, NumPy, Scikit-learn.</p>
      `
    },
    'resume-builder': {
      title: 'AI-Driven Resume Synthesizer & Career Suite',
      category: 'Natural Language Processing & Intelligent Web Architecture',
      year: '2026',
      description: `
        <p>A full-stack intelligent career assistant designed to solve the friction students and young professionals face when articulating technical depth and quantifiable outcomes.</p>
        <h4 style="margin: 18px 0 8px; color: var(--accent-gold);">System Highlights:</h4>
        <ul style="padding-left: 20px; line-height: 1.7; color: var(--text-muted);">
          <li><strong>NLP Skill Extraction:</strong> Analyzes raw career notes and projects to extract normalized industry skills and taxonomy tags.</li>
          <li><strong>Dynamic Format Engine:</strong> Synthesizes ATS-friendly formatted documents ready for recruiter submission.</li>
          <li><strong>Interactive Frontend:</strong> Clean responsive web UI with instant document preview and export functionality.</li>
        </ul>
        <h4 style="margin: 18px 0 8px; color: var(--accent-gold);">Tools & Libraries:</h4>
        <p style="color: var(--text-lead);">Python, Modern Web (HTML5/CSS3/JS), NLP text processing algorithms.</p>
      `
    },
    'web-platforms': {
      title: 'LITZ Tech Responsive Web Platforms',
      category: 'Client Frontend Engineering & UI Delivery',
      year: '2025',
      description: `
        <p>During the web development internship at LITZ Tech (Coimbatore), developed and tuned responsive web pages for diverse client requirements.</p>
        <h4 style="margin: 18px 0 8px; color: var(--accent-gold);">Key Contributions:</h4>
        <ul style="padding-left: 20px; line-height: 1.7; color: var(--text-muted);">
          <li>Built semantic HTML5 layouts with modern CSS3 Flexbox and Grid architectures.</li>
          <li>Implemented cross-browser compatibility fixes across mobile, tablet, and high-DPI desktop viewports.</li>
          <li>Enhanced page load times, image asset pipelines, and core web vitals.</li>
        </ul>
      `
    },
    'clickme-studio': {
      title: 'Click Me Photography Commercial Productions',
      category: 'Cinematography, Studio Direction & Business Operations',
      year: '2023-Present',
      description: `
        <p>Founded in 2014 by Zintha A.S. and driven under the executive direction of CEO Abdul Azim since June 2023, Click Me Photography has established a reputation for cinematic visual narratives across Tamil Nadu.</p>
        <h4 style="margin: 18px 0 8px; color: var(--accent-gold);">Executive Leadership:</h4>
        <ul style="padding-left: 20px; line-height: 1.7; color: var(--text-muted);">
          <li><strong>End-to-End Direction:</strong> Conceptualizing visual moods, camera movement, natural and artificial lighting setups.</li>
          <li><strong>Post-Production Master Grading:</strong> DaVinci Resolve Studio workflows for precision color grading and cinematic contrast.</li>
          <li><strong>Client Relations:</strong> Managing contracts, creative milestones, and maintaining long-term customer satisfaction.</li>
        </ul>
      `
    }
  };

  document.querySelectorAll('.open-detail-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const pKey = btn.dataset.project;
      const data = PROJECT_DETAILS[pKey];
      if (!data || !projectModal || !projectModalBody) return;

      projectModalBody.innerHTML = `
        <span class="eyebrow">${data.category} • ${data.year}</span>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-pure); margin-bottom: 16px;">${data.title}</h2>
        ${data.description}
      `;
      projectModal.classList.add('active');
      projectModal.setAttribute('aria-hidden', 'false');
    });
  });

  projectModalClose?.addEventListener('click', () => {
    projectModal?.classList.remove('active');
    projectModal?.setAttribute('aria-hidden', 'true');
  });

  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      projectModal.classList.remove('active');
      projectModal.setAttribute('aria-hidden', 'true');
    }
  });

  // ESC key to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      projectModal?.classList.remove('active');
      projectModal?.setAttribute('aria-hidden', 'true');
    }
  });

  /* ==========================================================================
     9. QUICK COPY TO CLIPBOARD BUTTONS
     ========================================================================== */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = btn.dataset.copy;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.backgroundColor = 'var(--accent-gold)';
        btn.style.color = 'var(--text-dark)';
        playTone(784, 'sine', 0.1, 0.04); // G5
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Clipboard copy failed: ', err);
      });
    });
  });

  /* ==========================================================================
     10. CONTACT FORM HANDLING
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName')?.value;
    const email = document.getElementById('senderEmail')?.value;
    const type = document.getElementById('collaborationType')?.value;
    const msg = document.getElementById('senderMessage')?.value;

    if (!name || !email || !msg) return;

    if (formStatus) {
      formStatus.innerHTML = `<span style="color: var(--accent-gold);">⚡ Encrypting and transmitting message to Azim Zintha...</span>`;
    }

    setTimeout(() => {
      if (formStatus) {
        formStatus.innerHTML = `<span style="color: #10B981; font-weight: 600;">✓ Message transmitted successfully! Azim Zintha will respond shortly.</span>`;
      }
      contactForm.reset();
      playTone(880, 'sine', 0.15, 0.05);
    }, 900);
  });

  // Smooth Scroll Trigger for CTAs
  const openContactBtn = document.getElementById('openContactBtn');
  const aboutTalkBtn = document.getElementById('aboutTalkBtn');

  [openContactBtn, aboutTalkBtn].forEach(btn => {
    btn?.addEventListener('click', () => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
