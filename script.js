/* ==========================================================================
   PORTFOLIO INTERACTIVE SCRIPT - AAFRIN FATHIMA S
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize all custom features
    initCustomCursor();
    initHeroTypewriter();
    initParticleBackground();
    initNavbarScroll();
    initMobileMenu();
    initActiveNavLinkTracker();
    initProjectFiltering();
    initSkillsCardGlow();
    initAITerminalInteractive();
    initGSAPAnimations();
    initAchievementsCelebrations();
    initContactForm();
});

/* ==========================================================================
   HERO ROLE TYPEWRITER
   ========================================================================== */
function initHeroTypewriter() {
    const typedRole = document.getElementById('hero-typed-role');
    if (!typedRole) return;

    const roles = [
        'Full Stack Developer',
        'AI driven Web developer',
        'Problem Solver'
    ];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        typedRole.textContent = roles[0];
        return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeNextCharacter() {
        const currentRole = roles[roleIndex];
        typedRole.className = `typewriter-role role-color-${roleIndex % roles.length}`;
        typedRole.textContent = currentRole.slice(0, charIndex);

        if (!isDeleting && charIndex < currentRole.length) {
            charIndex++;
            setTimeout(typeNextCharacter, 72);
            return;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeNextCharacter, 1250);
            return;
        }

        if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeNextCharacter, 38);
            return;
        }

        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeNextCharacter, 280);
    }

    typeNextCharacter();
}

/* ==========================================================================
   CUSTOM DUAL-RING CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    // Mouse move event
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor dot tracking
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Elastic animation for outline cursor using requestAnimationFrame
    function animateOutline() {
        // Lerp (Linear Interpolation) formula: Current = Current + (Target - Current) * Ease
        const ease = 0.15;
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    }
    requestAnimationFrame(animateOutline);

    // Add hover effects for interactive elements
    const hoverables = 'a, button, input, textarea, .tab-btn, .project-card, .celebration-trigger';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverables)) {
            cursorDot.style.width = '12px';
            cursorDot.style.height = '12px';
            cursorDot.style.backgroundColor = 'var(--secondary-gold)';
            
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.borderColor = 'var(--primary-pink)';
            cursorOutline.style.backgroundColor = 'rgba(255, 75, 145, 0.05)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverables)) {
            cursorDot.style.width = '8px';
            cursorDot.style.height = '8px';
            cursorDot.style.backgroundColor = 'var(--primary-pink)';
            
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'var(--primary-pink)';
            cursorOutline.style.backgroundColor = 'transparent';
        }
    });
}

/* ==========================================================================
   CANVAS PARTICLE BACKGROUND
   ========================================================================== */
function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    if (typeof THREE !== 'undefined' && isWebGLAvailable()) {
        initThreeDBackground(canvas);
    } else {
        initTwoDBackgroundFallback(canvas);
    }
}

function initThreeDBackground(canvas) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07030d, 0.035);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionScale = prefersReducedMotion ? 0.38 : 1;
    
    // Create Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (THREE.ACESFilmicToneMapping) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.18;
    }
    if (THREE.sRGBEncoding) {
        renderer.outputEncoding = THREE.sRGBEncoding;
    }

    // Create Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, window.innerWidth < 768 ? 4.7 : 3.4, window.innerWidth < 768 ? 8.2 : 6.2);

    // Create Particle Glow Texture programmatically
    function createParticleTexture() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64;
        pCanvas.height = 64;
        const pCtx = pCanvas.getContext('2d');
        
        const gradient = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 240, 245, 0.9)');
        gradient.addColorStop(0.5, 'rgba(255, 75, 145, 0.35)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        pCtx.fillStyle = gradient;
        pCtx.fillRect(0, 0, 64, 64);
        
        return new THREE.CanvasTexture(pCanvas);
    }

    const particleTexture = createParticleTexture();

    // 3D Wave Setup
    let isMobile = window.innerWidth < 768;
    let gridRows = isMobile ? 28 : 56;
    let gridCols = isMobile ? 28 : 56;
    let numParticles = gridRows * gridCols;
    
    let geometry = new THREE.BufferGeometry();
    let positions = new Float32Array(numParticles * 3);
    let colors = new Float32Array(numParticles * 3);
    
    const colorPink = new THREE.Color('#ff4b91');
    const colorGold = new THREE.Color('#ffbfa3');
    const colorCyan = new THREE.Color('#55d6ff');
    
    let spacing = isMobile ? 0.36 : 0.24;
    let startX = -((gridCols - 1) * spacing) / 2;
    let startZ = -((gridRows - 1) * spacing) / 2;

    function buildWaveData() {
        positions = new Float32Array(numParticles * 3);
        colors = new Float32Array(numParticles * 3);
        startX = -((gridCols - 1) * spacing) / 2;
        startZ = -((gridRows - 1) * spacing) / 2;

        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                const idx = r * gridCols + c;
                const x = startX + c * spacing;
                const z = startZ + r * spacing;
                
                positions[idx * 3] = x;
                positions[idx * 3 + 1] = 0; // Height y starts at 0
                positions[idx * 3 + 2] = z;
                
                // Mix colors: pink to gold gradient
                const mixRatio = (c / (gridCols - 1) + r / (gridRows - 1)) / 2;
                const finalColor = colorPink.clone().lerp(colorGold, mixRatio);
                
                colors[idx * 3] = finalColor.r;
                colors[idx * 3 + 1] = finalColor.g;
                colors[idx * 3 + 2] = finalColor.b;
            }
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Generate indices for glowing wireframe lines
        const indices = [];
        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                const idx = r * gridCols + c;
                // Connect to right neighbor
                if (c < gridCols - 1) {
                    indices.push(idx, idx + 1);
                }
                // Connect to bottom neighbor
                if (r < gridRows - 1) {
                    indices.push(idx, idx + gridCols);
                }
            }
        }
        geometry.setIndex(indices);
    }

    buildWaveData();

    // Points Material
    const pointsMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.15 : 0.082,
        map: particleTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    const wavePoints = new THREE.Points(geometry, pointsMaterial);
    scene.add(wavePoints);

    // Glowing Wireframe lines
    const lineMaterial = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: isMobile ? 0.055 : 0.105,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });

    const waveLines = new THREE.LineSegments(geometry, lineMaterial);
    scene.add(waveLines);

    // Floating Starfield Setup
    const starCount = isMobile ? 60 : 200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 20;
        starPositions[i * 3 + 1] = (Math.random() - 0.3) * 12; // shifted slightly upwards
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const starCol = Math.random() < 0.5 ? colorPink : colorGold;
        starColors[i * 3] = starCol.r;
        starColors[i * 3 + 1] = starCol.g;
        starColors[i * 3 + 2] = starCol.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.1 : 0.065,
        map: particleTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // Nebula Cloud Setup
    const nebulaCount = isMobile ? 6 : 14;
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
        nebulaPositions[i * 3] = (Math.random() - 0.5) * 16;
        nebulaPositions[i * 3 + 1] = (Math.random() - 0.4) * 8;
        nebulaPositions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;

        const nebulaColor = Math.random() < 0.6 ? new THREE.Color('#9d4ede') : new THREE.Color('#ff4b91');
        nebulaColors[i * 3] = nebulaColor.r;
        nebulaColors[i * 3 + 1] = nebulaColor.g;
        nebulaColors[i * 3 + 2] = nebulaColor.b;
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    function createNebulaTexture() {
        const nCanvas = document.createElement('canvas');
        nCanvas.width = 128;
        nCanvas.height = 128;
        const nCtx = nCanvas.getContext('2d');
        
        const gradient = nCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        gradient.addColorStop(0.5, 'rgba(157, 78, 221, 0.04)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        nCtx.fillStyle = gradient;
        nCtx.fillRect(0, 0, 128, 128);
        
        return new THREE.CanvasTexture(nCanvas);
    }

    const nebulaMaterial = new THREE.PointsMaterial({
        size: isMobile ? 3.5 : 5.5,
        map: createNebulaTexture(),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    const nebulaSystem = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebulaSystem);

    // Premium orbital architecture: subtle rings, crystal wireframes, and light lanes
    const premiumGroup = new THREE.Group();
    scene.add(premiumGroup);

    const orbitRingGroup = new THREE.Group();
    const ringPalette = ['#ff4b91', '#ffbfa3', '#55d6ff'];
    for (let i = 0; i < 4; i++) {
        const ringGeometry = new THREE.TorusGeometry(2.1 + i * 0.62, 0.006, 8, 180);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: ringPalette[i % ringPalette.length],
            transparent: true,
            opacity: isMobile ? 0.08 : 0.13,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI * (0.38 + i * 0.08);
        ring.rotation.y = Math.PI * (0.08 + i * 0.11);
        ring.rotation.z = i * 0.45;
        ring.userData.spin = (i % 2 === 0 ? 1 : -1) * (0.035 + i * 0.009);
        orbitRingGroup.add(ring);
    }
    orbitRingGroup.position.set(isMobile ? 0.4 : 1.2, isMobile ? 0.7 : 0.35, -1.35);
    premiumGroup.add(orbitRingGroup);

    const crystalGroup = new THREE.Group();
    const crystalCount = isMobile ? 5 : 11;
    const crystalGeometries = [
        new THREE.IcosahedronGeometry(0.22, 1),
        new THREE.OctahedronGeometry(0.24, 0),
        new THREE.TetrahedronGeometry(0.26, 0)
    ];
    for (let i = 0; i < crystalCount; i++) {
        const baseGeometry = crystalGeometries[i % crystalGeometries.length];
        const edges = new THREE.EdgesGeometry(baseGeometry);
        const material = new THREE.LineBasicMaterial({
            color: ringPalette[i % ringPalette.length],
            transparent: true,
            opacity: isMobile ? 0.24 : 0.32,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const crystal = new THREE.LineSegments(edges, material);
        crystal.position.set(
            (Math.random() - 0.5) * (isMobile ? 8 : 12),
            (Math.random() - 0.2) * (isMobile ? 5 : 7),
            (Math.random() - 0.55) * 10
        );
        const scale = 0.7 + Math.random() * 1.45;
        crystal.scale.setScalar(scale);
        crystal.userData = {
            floatOffset: Math.random() * Math.PI * 2,
            rotateSpeed: 0.002 + Math.random() * 0.004
        };
        crystalGroup.add(crystal);
    }
    premiumGroup.add(crystalGroup);

    const constellationGroup = new THREE.Group();
    const constellationCount = isMobile ? 4 : 8;
    for (let i = 0; i < constellationCount; i++) {
        const pointCount = 4 + Math.floor(Math.random() * 4);
        const points = [];
        const anchorX = (Math.random() - 0.5) * (isMobile ? 8 : 13);
        const anchorY = (Math.random() - 0.05) * (isMobile ? 5 : 7);
        const anchorZ = -2 - Math.random() * 7;
        for (let p = 0; p < pointCount; p++) {
            points.push(new THREE.Vector3(
                anchorX + (Math.random() - 0.5) * 1.6,
                anchorY + (Math.random() - 0.5) * 1.1,
                anchorZ + (Math.random() - 0.5) * 1.3
            ));
        }
        const constellationGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const constellationMaterial = new THREE.LineBasicMaterial({
            color: i % 2 === 0 ? colorCyan : colorGold,
            transparent: true,
            opacity: isMobile ? 0.16 : 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const constellation = new THREE.Line(constellationGeometry, constellationMaterial);
        constellation.userData.floatOffset = Math.random() * Math.PI * 2;
        constellationGroup.add(constellation);
    }
    premiumGroup.add(constellationGroup);

    const lightLaneGroup = new THREE.Group();
    const laneCount = isMobile ? 3 : 6;
    for (let i = 0; i < laneCount; i++) {
        const y = -1.8 + i * 0.42;
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-6.8, y, -4.8),
            new THREE.Vector3(-2.2, y + Math.sin(i) * 0.35, -2.2),
            new THREE.Vector3(1.8, y + Math.cos(i) * 0.45, -3.5),
            new THREE.Vector3(7.2, y + 0.15, -5.8)
        ]);
        const laneGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(90));
        const laneMaterial = new THREE.LineBasicMaterial({
            color: i % 3 === 0 ? colorCyan : (i % 3 === 1 ? colorPink : colorGold),
            transparent: true,
            opacity: isMobile ? 0.08 : 0.13,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const lane = new THREE.Line(laneGeometry, laneMaterial);
        lane.userData.phase = i * 0.8;
        lightLaneGroup.add(lane);
    }
    premiumGroup.add(lightLaneGroup);

    // Forward motion color dots: glowing sprites travel from deep background to the screen.
    const depthDotGroup = new THREE.Group();
    scene.add(depthDotGroup);
    const depthDotPalette = ['#ff4b91', '#ffbfa3', '#55d6ff', '#9d4ede'];
    const depthDots = [];
    const depthDotCount = isMobile ? 34 : 58;

    function resetDepthDot(dot, initial = false) {
        const spreadX = isMobile ? 8.5 : 13.5;
        const spreadY = isMobile ? 6.5 : 8.5;
        dot.position.set(
            (Math.random() - 0.5) * spreadX,
            (Math.random() - 0.45) * spreadY,
            initial ? -18 + Math.random() * 21 : -18 - Math.random() * 6
        );

        const baseScale = isMobile ? 0.08 : 0.065;
        dot.userData = {
            baseScale,
            speed: (0.028 + Math.random() * 0.045) * (isMobile ? 1.18 : 1),
            driftX: (Math.random() - 0.5) * 0.0035,
            driftY: (Math.random() - 0.5) * 0.0028,
            phase: Math.random() * Math.PI * 2
        };
        dot.scale.setScalar(baseScale);
        dot.material.opacity = 0;
    }

    for (let i = 0; i < depthDotCount; i++) {
        const dotMaterial = new THREE.SpriteMaterial({
            map: particleTexture,
            color: depthDotPalette[i % depthDotPalette.length],
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const dot = new THREE.Sprite(dotMaterial);
        resetDepthDot(dot, true);
        depthDotGroup.add(dot);
        depthDots.push(dot);
    }

    // Ultra scene layer: aurora ribbons, a holographic portal, light beams, and prism shards.
    const ultraGroup = new THREE.Group();
    scene.add(ultraGroup);

    const auroraRibbons = [];
    function createAuroraRibbon(index) {
        const segments = isMobile ? 42 : 72;
        const ribbonWidth = isMobile ? 0.36 : 0.48;
        const ribbonGeometry = new THREE.BufferGeometry();
        const ribbonPositions = new Float32Array((segments + 1) * 2 * 3);
        const ribbonIndices = [];

        for (let i = 0; i < segments; i++) {
            const a = i * 2;
            ribbonIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }

        ribbonGeometry.setAttribute('position', new THREE.BufferAttribute(ribbonPositions, 3));
        ribbonGeometry.setIndex(ribbonIndices);

        const ribbonMaterial = new THREE.MeshBasicMaterial({
            color: depthDotPalette[index % depthDotPalette.length],
            transparent: true,
            opacity: isMobile ? 0.13 : 0.18,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const mesh = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        mesh.userData = {
            segments,
            width: ribbonWidth,
            phase: index * 1.45,
            baseY: -0.25 + index * 0.72,
            baseZ: -8.8 - index * 1.15,
            amplitude: 0.35 + index * 0.08,
            speed: 0.58 + index * 0.12,
            xDrift: (index - 1.5) * 0.42
        };
        ultraGroup.add(mesh);
        auroraRibbons.push(mesh);
    }

    const ribbonCount = isMobile ? 3 : 5;
    for (let i = 0; i < ribbonCount; i++) {
        createAuroraRibbon(i);
    }

    const portalGroup = new THREE.Group();
    portalGroup.position.set(isMobile ? 0 : 2.55, isMobile ? 1.05 : 0.8, -4.2);
    ultraGroup.add(portalGroup);

    const portalCore = new THREE.Sprite(new THREE.SpriteMaterial({
        map: particleTexture,
        color: '#55d6ff',
        transparent: true,
        opacity: isMobile ? 0.34 : 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    portalCore.scale.setScalar(isMobile ? 1.65 : 2.25);
    portalGroup.add(portalCore);

    const portalRings = [];
    for (let i = 0; i < 7; i++) {
        const ringGeometry = new THREE.TorusGeometry(0.82 + i * 0.23, 0.006 + i * 0.0015, 8, 160);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: depthDotPalette[i % depthDotPalette.length],
            transparent: true,
            opacity: isMobile ? 0.16 : 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const portalRing = new THREE.Mesh(ringGeometry, ringMaterial);
        portalRing.rotation.x = Math.PI * (0.5 + i * 0.022);
        portalRing.rotation.y = Math.PI * (0.08 + i * 0.035);
        portalRing.userData.spin = (i % 2 === 0 ? 1 : -1) * (0.0045 + i * 0.001);
        portalGroup.add(portalRing);
        portalRings.push(portalRing);
    }

    const beamGroup = new THREE.Group();
    ultraGroup.add(beamGroup);
    const beams = [];
    const beamCount = isMobile ? 8 : 14;
    for (let i = 0; i < beamCount; i++) {
        const beamGeometry = new THREE.BufferGeometry();
        const x = (Math.random() - 0.5) * (isMobile ? 8 : 13);
        const y = (Math.random() - 0.2) * (isMobile ? 5 : 7);
        const z = -16 - Math.random() * 8;
        const beamPositions = new Float32Array([
            x, y, z,
            x * 0.32, y * 0.45, z + 5.5 + Math.random() * 3
        ]);
        beamGeometry.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
        const beamMaterial = new THREE.LineBasicMaterial({
            color: depthDotPalette[i % depthDotPalette.length],
            transparent: true,
            opacity: isMobile ? 0.13 : 0.18,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const beam = new THREE.Line(beamGeometry, beamMaterial);
        beam.userData = {
            speed: 0.022 + Math.random() * 0.03,
            phase: Math.random() * Math.PI * 2,
            originalX: x,
            originalY: y
        };
        beamGroup.add(beam);
        beams.push(beam);
    }

    const prismGroup = new THREE.Group();
    ultraGroup.add(prismGroup);
    const prismCount = isMobile ? 5 : 10;
    for (let i = 0; i < prismCount; i++) {
        const prismGeometry = i % 2 === 0
            ? new THREE.IcosahedronGeometry(0.18 + Math.random() * 0.1, 0)
            : new THREE.OctahedronGeometry(0.2 + Math.random() * 0.12, 0);
        const prismMaterial = new THREE.MeshBasicMaterial({
            color: depthDotPalette[i % depthDotPalette.length],
            transparent: true,
            opacity: isMobile ? 0.12 : 0.16,
            wireframe: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const prism = new THREE.Mesh(prismGeometry, prismMaterial);
        prism.position.set(
            (Math.random() - 0.5) * (isMobile ? 8 : 12),
            (Math.random() - 0.2) * (isMobile ? 5 : 7),
            -4 - Math.random() * 8
        );
        prism.userData = {
            phase: Math.random() * Math.PI * 2,
            spin: 0.003 + Math.random() * 0.006
        };
        prismGroup.add(prism);
    }

    const tunnelGroup = new THREE.Group();
    tunnelGroup.position.set(isMobile ? 0 : -1.9, isMobile ? -0.25 : -0.45, -2.5);
    ultraGroup.add(tunnelGroup);
    const tunnelRings = [];
    const tunnelRingCount = isMobile ? 10 : 16;
    for (let i = 0; i < tunnelRingCount; i++) {
        const tunnelGeometry = new THREE.TorusGeometry(1.35 + i * 0.055, 0.0055, 8, 180);
        const tunnelMaterial = new THREE.MeshBasicMaterial({
            color: depthDotPalette[i % depthDotPalette.length],
            transparent: true,
            opacity: isMobile ? 0.085 : 0.12,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const tunnelRing = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
        tunnelRing.position.z = -2 - i * 0.88;
        tunnelRing.rotation.x = Math.PI * 0.04;
        tunnelRing.rotation.y = Math.PI * 0.12;
        tunnelRing.rotation.z = i * 0.31;
        tunnelRing.userData = {
            speed: 0.014 + i * 0.0009,
            spin: (i % 2 === 0 ? 1 : -1) * (0.003 + i * 0.00025)
        };
        tunnelGroup.add(tunnelRing);
        tunnelRings.push(tunnelRing);
    }

    const galaxyPointCount = isMobile ? 150 : 360;
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyPositions = new Float32Array(galaxyPointCount * 3);
    const galaxyColors = new Float32Array(galaxyPointCount * 3);
    for (let i = 0; i < galaxyPointCount; i++) {
        const arm = i % 4;
        const radius = Math.sqrt(Math.random()) * (isMobile ? 2.6 : 3.6);
        const angle = radius * 2.4 + arm * Math.PI * 0.5 + (Math.random() - 0.5) * 0.42;
        const jitter = (Math.random() - 0.5) * 0.22;
        galaxyPositions[i * 3] = Math.cos(angle) * radius + jitter;
        galaxyPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.48 + (Math.random() - 0.5) * 0.34;
        galaxyPositions[i * 3 + 2] = -5.8 + Math.sin(radius * 1.8) * 0.34 + (Math.random() - 0.5) * 0.55;

        const galaxyColor = new THREE.Color(depthDotPalette[(arm + i) % depthDotPalette.length]);
        galaxyColors[i * 3] = galaxyColor.r;
        galaxyColors[i * 3 + 1] = galaxyColor.g;
        galaxyColors[i * 3 + 2] = galaxyColor.b;
    }
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
    const galaxyMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.09 : 0.055,
        map: particleTexture,
        transparent: true,
        opacity: isMobile ? 0.36 : 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });
    const galaxySpiral = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxySpiral.position.set(isMobile ? 0 : 2.5, isMobile ? 1.05 : 0.8, -0.2);
    portalGroup.add(galaxySpiral);

    const haloOrbs = [];
    const haloOrbCount = isMobile ? 7 : 12;
    for (let i = 0; i < haloOrbCount; i++) {
        const haloOrb = new THREE.Sprite(new THREE.SpriteMaterial({
            map: particleTexture,
            color: depthDotPalette[i % depthDotPalette.length],
            transparent: true,
            opacity: isMobile ? 0.16 : 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        haloOrb.userData = {
            radius: 1.2 + Math.random() * (isMobile ? 1.2 : 1.8),
            phase: (i / haloOrbCount) * Math.PI * 2,
            speed: 0.28 + Math.random() * 0.24,
            height: (Math.random() - 0.5) * 1.25,
            baseScale: isMobile ? 0.16 : 0.2
        };
        haloOrb.scale.setScalar(haloOrb.userData.baseScale);
        portalGroup.add(haloOrb);
        haloOrbs.push(haloOrb);
    }

    const networkGlobeGroup = new THREE.Group();
    networkGlobeGroup.position.set(isMobile ? 0 : -3.1, isMobile ? -0.25 : 0.35, -5.6);
    ultraGroup.add(networkGlobeGroup);

    const globeRadius = isMobile ? 1.35 : 1.75;
    const globeNodeCount = isMobile ? 56 : 96;
    const globeNodePositions = new Float32Array(globeNodeCount * 3);
    const globeNodeColors = new Float32Array(globeNodeCount * 3);
    const globeNodes = [];

    for (let i = 0; i < globeNodeCount; i++) {
        const y = 1 - (i / (globeNodeCount - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = i * 2.399963229728653;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        const node = new THREE.Vector3(x * globeRadius, y * globeRadius, z * globeRadius);
        globeNodes.push(node);

        globeNodePositions[i * 3] = node.x;
        globeNodePositions[i * 3 + 1] = node.y;
        globeNodePositions[i * 3 + 2] = node.z;

        const nodeColor = new THREE.Color(depthDotPalette[i % depthDotPalette.length]);
        globeNodeColors[i * 3] = nodeColor.r;
        globeNodeColors[i * 3 + 1] = nodeColor.g;
        globeNodeColors[i * 3 + 2] = nodeColor.b;
    }

    const globeNodeGeometry = new THREE.BufferGeometry();
    globeNodeGeometry.setAttribute('position', new THREE.BufferAttribute(globeNodePositions, 3));
    globeNodeGeometry.setAttribute('color', new THREE.BufferAttribute(globeNodeColors, 3));
    const globeNodeMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.075 : 0.055,
        map: particleTexture,
        transparent: true,
        opacity: isMobile ? 0.62 : 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });
    const globeNodeSystem = new THREE.Points(globeNodeGeometry, globeNodeMaterial);
    networkGlobeGroup.add(globeNodeSystem);

    const globeLinePositions = [];
    const globeLineColors = [];
    for (let i = 0; i < globeNodes.length; i++) {
        for (let j = i + 1; j < globeNodes.length; j++) {
            const dist = globeNodes[i].distanceTo(globeNodes[j]);
            if (dist < globeRadius * 0.58 && Math.random() < 0.22) {
                globeLinePositions.push(
                    globeNodes[i].x, globeNodes[i].y, globeNodes[i].z,
                    globeNodes[j].x, globeNodes[j].y, globeNodes[j].z
                );
                const lineColor = new THREE.Color(depthDotPalette[(i + j) % depthDotPalette.length]);
                globeLineColors.push(
                    lineColor.r, lineColor.g, lineColor.b,
                    lineColor.r, lineColor.g, lineColor.b
                );
            }
        }
    }

    const globeLineGeometry = new THREE.BufferGeometry();
    globeLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(globeLinePositions, 3));
    globeLineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(globeLineColors, 3));
    const globeLineMaterial = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: isMobile ? 0.12 : 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
    });
    const globeLineSystem = new THREE.LineSegments(globeLineGeometry, globeLineMaterial);
    networkGlobeGroup.add(globeLineSystem);

    const globeShell = new THREE.Mesh(
        new THREE.SphereGeometry(globeRadius, 32, 18),
        new THREE.MeshBasicMaterial({
            color: '#55d6ff',
            transparent: true,
            opacity: isMobile ? 0.035 : 0.05,
            wireframe: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
    networkGlobeGroup.add(globeShell);

    const globeOrbitGroup = new THREE.Group();
    networkGlobeGroup.add(globeOrbitGroup);
    for (let i = 0; i < 3; i++) {
        const globeOrbit = new THREE.Mesh(
            new THREE.TorusGeometry(globeRadius * (1.1 + i * 0.11), 0.004, 8, 160),
            new THREE.MeshBasicMaterial({
                color: depthDotPalette[(i + 1) % depthDotPalette.length],
                transparent: true,
                opacity: isMobile ? 0.11 : 0.16,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        globeOrbit.rotation.x = Math.PI * (0.5 + i * 0.16);
        globeOrbit.rotation.y = Math.PI * (0.08 + i * 0.18);
        globeOrbit.userData.spin = (i % 2 === 0 ? 1 : -1) * (0.004 + i * 0.001);
        globeOrbitGroup.add(globeOrbit);
    }

    // Shooting Stars Setup
    const shootingStarGeometry = new THREE.BufferGeometry();
    const maxShootingStars = 3;
    const shootingStarPositions = new Float32Array(maxShootingStars * 2 * 3); // 2 vertices (x,y,z) * 3 stars
    shootingStarGeometry.setAttribute('position', new THREE.BufferAttribute(shootingStarPositions, 3));
    
    const shootingStarMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color('#ffbfa3'), // Rose gold streaking color
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const shootingStarSystem = new THREE.LineSegments(shootingStarGeometry, shootingStarMaterial);
    scene.add(shootingStarSystem);
    
    let activeShootingStars = [];
    for (let i = 0; i < maxShootingStars; i++) {
        activeShootingStars.push({
            active: false,
            x: 0, y: 0, z: 0,
            dx: 0, dy: 0, dz: 0,
            length: 1.8,
            speed: 0.22,
            progress: 0
        });
    }

    // Mouse Parallax coordinates
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollProgress = 0;
    let targetScrollProgress = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function updateScrollProgress() {
        if (!isMobile || prefersReducedMotion) {
            targetScrollProgress = 0;
            return;
        }

        const doc = document.documentElement;
        const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
        const rawProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        targetScrollProgress = rawProgress;
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // Click Ripple setup
    let clickRipples = [];
    window.addEventListener('click', (e) => {
        // Only trigger if clicking outside forms, buttons, nav, links, and cards
        if (e.target.closest('button, a, input, textarea, .glass-card, .floating-tech-badge, .navbar')) return;
        
        const clickX = (e.clientX / window.innerWidth) * 2 - 1;
        const clickY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        clickRipples.push({
            x: clickX * 6,
            z: -clickY * 6,
            startTime: clock.getElapsedTime(),
            duration: 2.2 // seconds duration
        });
    });

    // Handle viewport resizing
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Dynamically adjust grid size if transitioning mobile/desktop
        const nowMobile = width < 768;
        if (nowMobile !== isMobile) {
            isMobile = nowMobile;
            gridRows = nowMobile ? 28 : 56;
            gridCols = nowMobile ? 28 : 56;
            numParticles = gridRows * gridCols;
            spacing = nowMobile ? 0.36 : 0.24;
            
            buildWaveData();
            pointsMaterial.size = nowMobile ? 0.15 : 0.082;
            starMaterial.size = nowMobile ? 0.1 : 0.065;
            nebulaMaterial.size = nowMobile ? 3.5 : 5.5;
            lineMaterial.opacity = nowMobile ? 0.055 : 0.105;
        }

        updateScrollProgress();
    });

    // Clock for wave calculations
    const clock = new THREE.Clock();

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime() * motionScale;
        const posAttr = geometry.attributes.position;
        const positionsArr = posAttr.array;
        
        const colorAttr = geometry.attributes.color;
        const colorsArr = colorAttr.array;

        // Smooth mouse target lerping
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        scrollProgress += (targetScrollProgress - scrollProgress) * 0.065;
        const scrollEase = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
        const mobileScrollBoost = isMobile ? scrollEase : 0;

        // 1. Twinkling/pulsating stars
        starMaterial.size = (isMobile ? 0.1 : 0.065) * (1.0 + Math.sin(time * 2.5) * 0.3 + mobileScrollBoost * 0.28);

        // 2. Animate grid wave & dynamic colors
        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                const idx = r * gridCols + c;
                const x = positionsArr[idx * 3];
                const z = positionsArr[idx * 3 + 2];

                // Triple harmonic undulating wave
                const wave1 = Math.sin(x * 0.45 + time * 1.1) * 0.26;
                const wave2 = Math.cos(z * 0.45 + time * 0.85) * 0.26;
                const wave3 = Math.sin((x + z) * 0.25 + time * 1.4) * 0.15;
                const scrollSurge = mobileScrollBoost * Math.sin(z * 0.7 - time * 2.2 + scrollEase * 5.5) * 0.38;
                const baseWave = wave1 + wave2 + wave3 + scrollSurge;

                // Mouse hover interaction ripple
                const mouseWorldX = targetX * 5.5;
                const mouseWorldZ = -targetY * 5.5;
                const dx = x - mouseWorldX;
                const dz = z - mouseWorldZ;
                const dist = Math.sqrt(dx * dx + dz * dz);

                let hoverRipple = 0;
                if (dist < 3.2) {
                    const strength = (3.2 - dist) / 3.2; // 0 to 1
                    hoverRipple = Math.sin(dist * 4.5 - time * 5) * 0.22 * strength;
                }

                // Click ripple waves
                let clickRipple = 0;
                clickRipples.forEach(ripple => {
                    const elapsed = time - ripple.startTime;
                    if (elapsed < ripple.duration) {
                        const distToRipple = Math.sqrt((x - ripple.x)**2 + (z - ripple.z)**2);
                        // Wave propagates outwards
                        const waveFront = elapsed * 4.0;
                        const distFromFront = Math.abs(distToRipple - waveFront);
                        if (distFromFront < 1.2) {
                            const fade = (1.2 - distFromFront) * (1.0 - (elapsed / ripple.duration));
                            clickRipple += Math.sin(distToRipple * 7 - elapsed * 18) * 0.45 * fade;
                        }
                    }
                });

                positionsArr[idx * 3 + 1] = baseWave + hoverRipple + clickRipple;

                // 3. Dynamic color shifting gradient across the wave
                const mixRatio = (c / (gridCols - 1) + r / (gridRows - 1)) / 2;
                // Wave gradient color shifting over time
                const colorShift = (Math.sin(time * 0.6 + mixRatio * Math.PI) + 1) / 2;
                const finalColor = colorPink.clone().lerp(colorGold, colorShift);

                colorsArr[idx * 3] = finalColor.r;
                colorsArr[idx * 3 + 1] = finalColor.g;
                colorsArr[idx * 3 + 2] = finalColor.b;
            }
        }

        // Clean up finished ripples
        clickRipples = clickRipples.filter(ripple => (time - ripple.startTime) < ripple.duration);

        posAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;

        // 4. Subtle ellipsoidal camera orbital motion + mouse parallax
        const cameraBaseZ = isMobile ? 8.2 : 6.2;
        const cameraBaseY = isMobile ? 4.7 : 3.4;
        camera.position.x = Math.sin(time * 0.12) * 0.6 + targetX * (isMobile ? 0.55 : 1.35) + mobileScrollBoost * 0.24;
        camera.position.z = cameraBaseZ - mobileScrollBoost * 3.05 + Math.cos(time * 0.18) * 0.36;
        camera.position.y = cameraBaseY - mobileScrollBoost * 1.15 + Math.sin(time * 0.08) * 0.18 - targetY * (isMobile ? 0.45 : 0.95);
        camera.fov = isMobile ? 60 - mobileScrollBoost * 7 : 60;
        camera.updateProjectionMatrix();
        camera.lookAt(0, -mobileScrollBoost * 0.35, -mobileScrollBoost * 0.55);

        // Apply visual tilt/rotation to wavePoints
        wavePoints.position.z = mobileScrollBoost * 1.65;
        waveLines.position.z = wavePoints.position.z;
        wavePoints.rotation.y = targetX * 0.1 + mobileScrollBoost * 0.16;
        wavePoints.rotation.x = -targetY * 0.05 + 0.3 + mobileScrollBoost * 0.22;
        waveLines.rotation.copy(wavePoints.rotation);

        // Slow automatic starfield drift + mouse response
        starPoints.position.z = mobileScrollBoost * 2.45;
        nebulaSystem.position.z = mobileScrollBoost * 1.65;
        starPoints.rotation.y = targetX * 0.04 + time * 0.002;
        starPoints.rotation.x = -targetY * 0.03 + mobileScrollBoost * 0.12;
        starPoints.rotation.z = time * 0.0008 + mobileScrollBoost * 0.18;

        // Slow rotation and drift of nebula clouds
        nebulaSystem.rotation.y = time * 0.0008 + mobileScrollBoost * 0.1;
        nebulaSystem.rotation.x = time * 0.0004 - mobileScrollBoost * 0.08;

        // Premium elements drift independently so the background feels layered
        premiumGroup.position.z = mobileScrollBoost * 2.15;
        premiumGroup.position.y = -mobileScrollBoost * 0.32;
        premiumGroup.rotation.y = targetX * 0.025 + Math.sin(time * 0.08) * 0.015 + mobileScrollBoost * 0.32;
        premiumGroup.rotation.x = -targetY * 0.018 + mobileScrollBoost * 0.18;
        premiumGroup.rotation.z = mobileScrollBoost * -0.08;
        orbitRingGroup.children.forEach((ring, idx) => {
            ring.rotation.z += ring.userData.spin * 0.012 * motionScale;
            ring.position.y = Math.sin(time * 0.45 + idx) * 0.045;
            ring.material.opacity = (isMobile ? 0.075 : 0.12) + Math.sin(time * 0.7 + idx) * 0.025;
        });
        crystalGroup.children.forEach((crystal) => {
            crystal.rotation.x += crystal.userData.rotateSpeed * motionScale;
            crystal.rotation.y += crystal.userData.rotateSpeed * 1.4 * motionScale;
            crystal.position.y += Math.sin(time + crystal.userData.floatOffset) * 0.0009;
        });
        constellationGroup.children.forEach((constellation, idx) => {
            constellation.position.y = Math.sin(time * 0.38 + constellation.userData.floatOffset) * 0.08;
            constellation.material.opacity = (isMobile ? 0.12 : 0.18) + Math.sin(time * 0.9 + idx) * 0.045;
        });
        lightLaneGroup.children.forEach((lane) => {
            lane.position.x = Math.sin(time * 0.24 + lane.userData.phase) * 0.16;
            lane.position.y = Math.cos(time * 0.28 + lane.userData.phase) * 0.055;
        });

        depthDotGroup.rotation.y = targetX * 0.035 + mobileScrollBoost * 0.18;
        depthDotGroup.rotation.x = -targetY * 0.02;
        depthDots.forEach((dot) => {
            const nearZ = camera.position.z - 0.85;
            const farZ = -19;
            const progress = Math.min(1, Math.max(0, (dot.position.z - farZ) / (nearZ - farZ)));
            const easedProgress = progress * progress;

            dot.position.z += dot.userData.speed * motionScale * (1 + mobileScrollBoost * 3.8);
            dot.position.x += dot.userData.driftX * (1 + progress * 4) + Math.sin(time * 0.9 + dot.userData.phase) * 0.0009;
            dot.position.y += dot.userData.driftY * (1 + progress * 3) + Math.cos(time * 0.8 + dot.userData.phase) * 0.0007;

            const scale = dot.userData.baseScale * (1 + easedProgress * 10.5 + mobileScrollBoost * 2.2);
            dot.scale.setScalar(scale);
            dot.material.opacity = Math.min(0.72, Math.sin(progress * Math.PI) * 0.62 + mobileScrollBoost * 0.1);

            if (dot.position.z > nearZ || Math.abs(dot.position.x) > 9 || Math.abs(dot.position.y) > 7) {
                resetDepthDot(dot);
            }
        });

        ultraGroup.position.z = mobileScrollBoost * 2.65;
        ultraGroup.rotation.y = targetX * 0.035 + mobileScrollBoost * 0.22;
        ultraGroup.rotation.x = -targetY * 0.018;

        auroraRibbons.forEach((ribbon, ribbonIndex) => {
            const { segments, width, phase, baseY, baseZ, amplitude, speed, xDrift } = ribbon.userData;
            const attr = ribbon.geometry.attributes.position;
            const arr = attr.array;
            const totalWidth = isMobile ? 10 : 16;

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const x = (t - 0.5) * totalWidth + Math.sin(time * 0.22 + phase) * xDrift;
                const z = baseZ + Math.sin(t * Math.PI * 2 + time * 0.38 + phase) * 0.55 + mobileScrollBoost * 1.4;
                const y = baseY
                    + Math.sin(t * Math.PI * 3.2 + time * speed + phase) * amplitude
                    + Math.cos(t * Math.PI * 5.1 - time * 0.54 + phase) * 0.16
                    - mobileScrollBoost * 0.28;
                const ribbonPulse = width * (0.72 + Math.sin(t * Math.PI + time + ribbonIndex) * 0.18);
                const offset = i * 6;

                arr[offset] = x;
                arr[offset + 1] = y - ribbonPulse;
                arr[offset + 2] = z;
                arr[offset + 3] = x;
                arr[offset + 4] = y + ribbonPulse;
                arr[offset + 5] = z + 0.1;
            }

            attr.needsUpdate = true;
            ribbon.material.opacity = (isMobile ? 0.1 : 0.15) + Math.sin(time * 0.8 + ribbonIndex) * 0.035 + mobileScrollBoost * 0.035;
        });

        portalGroup.position.x = (isMobile ? 0 : 2.55) + targetX * (isMobile ? 0.2 : 0.55);
        portalGroup.position.y = (isMobile ? 1.05 : 0.8) - targetY * 0.18 - mobileScrollBoost * 0.28;
        portalGroup.position.z = -4.2 + mobileScrollBoost * 1.25;
        portalGroup.rotation.y = time * 0.045 + mobileScrollBoost * 0.45;
        portalGroup.rotation.x = Math.sin(time * 0.2) * 0.08;
        portalCore.scale.setScalar((isMobile ? 1.65 : 2.25) * (1 + Math.sin(time * 1.4) * 0.08 + mobileScrollBoost * 0.25));
        portalCore.material.opacity = (isMobile ? 0.28 : 0.36) + Math.sin(time * 1.6) * 0.06;
        portalRings.forEach((ring, idx) => {
            ring.rotation.z += ring.userData.spin * motionScale * (1 + mobileScrollBoost * 2);
            ring.rotation.y += ring.userData.spin * 0.36 * motionScale;
            ring.material.opacity = (isMobile ? 0.12 : 0.18) + Math.sin(time * 0.9 + idx) * 0.035 + mobileScrollBoost * 0.05;
        });

        beams.forEach((beam, idx) => {
            const arr = beam.geometry.attributes.position.array;
            const velocity = beam.userData.speed * motionScale * (1 + mobileScrollBoost * 3.2);
            arr[2] += velocity;
            arr[5] += velocity;
            arr[0] += Math.sin(time + beam.userData.phase) * 0.0015;
            arr[3] += Math.sin(time + beam.userData.phase) * 0.0009;
            arr[1] += Math.cos(time * 0.8 + beam.userData.phase) * 0.0012;
            arr[4] += Math.cos(time * 0.8 + beam.userData.phase) * 0.0008;

            if (arr[2] > camera.position.z - 1.2) {
                const newX = (Math.random() - 0.5) * (isMobile ? 8 : 13);
                const newY = (Math.random() - 0.2) * (isMobile ? 5 : 7);
                const newZ = -18 - Math.random() * 8;
                arr[0] = newX;
                arr[1] = newY;
                arr[2] = newZ;
                arr[3] = newX * 0.32;
                arr[4] = newY * 0.45;
                arr[5] = newZ + 5.5 + Math.random() * 3;
            }

            beam.geometry.attributes.position.needsUpdate = true;
            beam.material.opacity = (isMobile ? 0.1 : 0.15) + Math.sin(time * 1.1 + idx) * 0.035 + mobileScrollBoost * 0.05;
        });

        prismGroup.children.forEach((prism, idx) => {
            prism.rotation.x += prism.userData.spin * motionScale * (1 + mobileScrollBoost * 1.7);
            prism.rotation.y += prism.userData.spin * 1.35 * motionScale;
            prism.position.y += Math.sin(time + prism.userData.phase) * 0.001;
            prism.position.z += mobileScrollBoost * 0.0008;
            prism.material.opacity = (isMobile ? 0.1 : 0.14) + Math.sin(time * 0.75 + idx) * 0.035;
        });

        tunnelGroup.position.x = (isMobile ? 0 : -1.9) - targetX * (isMobile ? 0.18 : 0.36);
        tunnelGroup.position.y = (isMobile ? -0.25 : -0.45) + targetY * 0.16 + mobileScrollBoost * 0.18;
        tunnelGroup.rotation.y = Math.sin(time * 0.16) * 0.08 + mobileScrollBoost * -0.24;
        tunnelGroup.rotation.x = Math.cos(time * 0.18) * 0.05;
        tunnelRings.forEach((ring, idx) => {
            ring.position.z += ring.userData.speed * motionScale * (1 + mobileScrollBoost * 4.2);
            ring.rotation.z += ring.userData.spin * motionScale * (1 + mobileScrollBoost * 2.4);
            const depthPulse = Math.sin(time * 0.9 + idx * 0.58) * 0.025;
            ring.scale.setScalar(1 + mobileScrollBoost * 0.42 + depthPulse);
            ring.material.opacity = (isMobile ? 0.07 : 0.105) + Math.sin(time * 0.95 + idx) * 0.025 + mobileScrollBoost * 0.04;
            if (ring.position.z > camera.position.z - 2.3) {
                ring.position.z = -15 - Math.random() * 2.5;
            }
        });

        galaxySpiral.rotation.z = time * 0.13 + mobileScrollBoost * 0.85;
        galaxySpiral.rotation.y = Math.sin(time * 0.22) * 0.18 + targetX * 0.08;
        galaxySpiral.rotation.x = Math.cos(time * 0.2) * 0.08 - targetY * 0.04;
        galaxySpiral.scale.setScalar(1 + Math.sin(time * 0.7) * 0.035 + mobileScrollBoost * 0.24);
        galaxyMaterial.opacity = (isMobile ? 0.3 : 0.42) + Math.sin(time * 1.1) * 0.045 + mobileScrollBoost * 0.08;

        haloOrbs.forEach((orb, idx) => {
            const orbit = orb.userData.phase + time * orb.userData.speed + mobileScrollBoost * 1.2;
            const radius = orb.userData.radius * (1 + Math.sin(time * 0.6 + idx) * 0.04);
            orb.position.x = Math.cos(orbit) * radius;
            orb.position.y = orb.userData.height + Math.sin(orbit * 1.3) * 0.42;
            orb.position.z = Math.sin(orbit) * radius * 0.42;
            orb.scale.setScalar(orb.userData.baseScale * (1 + Math.sin(time * 1.4 + idx) * 0.2 + mobileScrollBoost * 0.7));
            orb.material.opacity = (isMobile ? 0.13 : 0.19) + Math.sin(time * 1.2 + idx) * 0.04 + mobileScrollBoost * 0.06;
        });

        networkGlobeGroup.position.x = (isMobile ? 0 : -3.1) - targetX * (isMobile ? 0.18 : 0.42);
        networkGlobeGroup.position.y = (isMobile ? -0.25 : 0.35) + targetY * 0.2 - mobileScrollBoost * 0.16;
        networkGlobeGroup.position.z = -5.6 + mobileScrollBoost * 1.45;
        networkGlobeGroup.rotation.y = time * 0.18 + targetX * 0.18 + mobileScrollBoost * 0.72;
        networkGlobeGroup.rotation.x = Math.sin(time * 0.24) * 0.12 - targetY * 0.08;
        networkGlobeGroup.rotation.z = Math.cos(time * 0.18) * 0.045;
        const globePulse = 1 + Math.sin(time * 1.05) * 0.025 + mobileScrollBoost * 0.18;
        globeNodeSystem.scale.setScalar(globePulse);
        globeLineSystem.scale.setScalar(globePulse);
        globeShell.scale.setScalar(1 + Math.sin(time * 0.85) * 0.018 + mobileScrollBoost * 0.12);
        globeNodeMaterial.size = (isMobile ? 0.075 : 0.055) * (1 + Math.sin(time * 1.6) * 0.16 + mobileScrollBoost * 0.5);
        globeNodeMaterial.opacity = (isMobile ? 0.56 : 0.66) + Math.sin(time * 1.2) * 0.06 + mobileScrollBoost * 0.08;
        globeLineMaterial.opacity = (isMobile ? 0.1 : 0.16) + Math.sin(time * 0.95) * 0.035 + mobileScrollBoost * 0.06;
        globeOrbitGroup.children.forEach((orbit, idx) => {
            orbit.rotation.z += orbit.userData.spin * motionScale * (1 + mobileScrollBoost * 2.2);
            orbit.rotation.y += orbit.userData.spin * 0.45 * motionScale;
            orbit.material.opacity = (isMobile ? 0.09 : 0.14) + Math.sin(time * 0.9 + idx) * 0.03 + mobileScrollBoost * 0.04;
        });

        // --- Shooting Stars Update Logic ---
        let anyActive = false;
        if (Math.random() < 0.012) {
            const inactiveStar = activeShootingStars.find(s => !s.active);
            if (inactiveStar) {
                inactiveStar.active = true;
                inactiveStar.x = (Math.random() - 0.7) * 12;
                inactiveStar.y = (Math.random() * 4) + 6;
                inactiveStar.z = (Math.random() - 0.5) * 8 - 4;
                inactiveStar.dx = 0.35 + Math.random() * 0.15;
                inactiveStar.dy = -0.25 - Math.random() * 0.15;
                inactiveStar.dz = 0.05 + Math.random() * 0.1;
                inactiveStar.speed = 0.25 + Math.random() * 0.15;
                inactiveStar.progress = 0;
            }
        }
        
        const shootPosArr = shootingStarGeometry.attributes.position.array;
        activeShootingStars.forEach((star, idx) => {
            if (star.active) {
                anyActive = true;
                star.progress += star.speed;
                
                const x1 = star.x + star.dx * star.progress;
                const y1 = star.y + star.dy * star.progress;
                const z1 = star.z + star.dz * star.progress;
                
                const x2 = x1 - star.dx * star.length;
                const y2 = y1 - star.dy * star.length;
                const z2 = z1 - star.dz * star.length;
                
                shootPosArr[idx * 6] = x1;
                shootPosArr[idx * 6 + 1] = y1;
                shootPosArr[idx * 6 + 2] = z1;
                shootPosArr[idx * 6 + 3] = x2;
                shootPosArr[idx * 6 + 4] = y2;
                shootPosArr[idx * 6 + 5] = z2;
                
                if (y1 < -6 || star.progress > 25) {
                    star.active = false;
                    for (let k = 0; k < 6; k++) shootPosArr[idx * 6 + k] = 0;
                }
            } else {
                for (let k = 0; k < 6; k++) shootPosArr[idx * 6 + k] = 0;
            }
        });
        
        if (anyActive) {
            shootingStarGeometry.attributes.position.needsUpdate = true;
            shootingStarMaterial.opacity = 0.8;
        } else {
            shootingStarMaterial.opacity = 0;
        }
        // ------------------------------------

        // Render scene
        renderer.render(scene, camera);
    }

    animate();
}

function initTwoDBackgroundFallback(canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Mouse coords for interaction
    const mouse = {
        x: null,
        y: null,
        radius: 120 // Interaction radius
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    window.addEventListener('resize', resizeCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle Object
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update position and check boundaries
        update() {
            // Check boundary collisions
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Mouse interaction (repelling effect)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 2;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 2;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 2;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 2;
                    }
                }
            }

            this.draw();
        }
    }

    // Initialize particles array
    function initParticles() {
        particlesArray = [];
        // Scale number of particles based on screen width
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
        const colorPalette = [
            'rgba(255, 75, 145, 0.25)', // Primary Pink
            'rgba(255, 191, 163, 0.18)', // Rose Gold
            'rgba(157, 78, 221, 0.15)',  // Deep Violet
        ];

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.8;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.5) - 0.25;
            let directionY = (Math.random() * 0.5) - 0.25;
            let color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect particles when close
    function connect() {
        let opacityValue = 1;
        const maxDistance = 100;
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx*dx + dy*dy);

                if (distance < maxDistance) {
                    opacityValue = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(255, 75, 145, ${opacityValue * 0.08})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

/* ==========================================================================
   NAVBAR SHOLD ON SCROLL
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   MOBILE BURGER MENU
   ========================================================================== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    hamburger.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on clicking outside (if menu is active)
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });
}

/* ==========================================================================
   ACTIVE NAV LINK TRACKER
   ========================================================================== */
function initActiveNavLinkTracker() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const options = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the mid-viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/* ==========================================================================
   PROJECT FILTERING LOGIC
   ========================================================================== */
function initProjectFiltering() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (tabButtons.length === 0 || projectCards.length === 0) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Switch active tab class
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-tab');

            // Toggle visibility of project cards with cinematic delay
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Reveal Card
                    card.style.display = 'flex';
                    // Retrigger animation state using GSAP
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(card, 
                            { opacity: 0, y: 30, scale: 0.95 },
                            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out', clearProps: 'transform' }
                        );
                    } else {
                        card.style.opacity = '1';
                    }
                } else {
                    // Hide Card
                    card.style.display = 'none';
                }
            });

            // Refresh ScrollTrigger positions because layout height changed
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
    });
}

/* ==========================================================================
   GSAP TIMELINES & SCROLLREVEALS
   ========================================================================== */
function initGSAPAnimations() {
    // If GSAP is not loaded, exit gracefully
    if (typeof gsap === 'undefined') return;

    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- Hero Animations ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTl.from('.navbar', { y: -80, opacity: 0, duration: 1.2 })
          .from('.hero-badge', { scale: 0.8, opacity: 0, duration: 0.6 }, '-=0.6')
          .from('.hero-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
          .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
          .from('.hero-ctas', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
          .from('.cyber-glass-card', { opacity: 0, x: 50, rotateY: -15, duration: 1 }, '-=0.8')
          .from('.floating-tech-badge', { opacity: 0, scale: 0.8, stagger: 0.15, duration: 0.8 }, '-=0.6')
          .from('.scroll-down-indicator', { opacity: 0, y: -20, duration: 0.6 }, '-=0.4');

    // Generic ScrollTrigger Reveal helper
    const revealItems = document.querySelectorAll('.reveal-item');
    
    revealItems.forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%', // Trigger when top of element is 85% down viewport
                toggleActions: 'play none none none',
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Special animation for skill categories (stagger)
    if (document.querySelector('.skills-grid')) {
        gsap.from('.skills-category-card', {
            scrollTrigger: {
                trigger: '.skills-grid',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out'
        });
    }

    // Special animation for projects container
    if (document.querySelector('.projects-grid')) {
        gsap.from('.projects-grid', {
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out'
        });
    }

    // Timeline marker expansion effect
    const timelineItems = document.querySelectorAll('.journey-card-wrapper');
    timelineItems.forEach(item => {
        const marker = item.querySelector('.journey-marker');
        const card = item.querySelector('.journey-card');
        
        gsap.from(marker, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
            },
            scale: 0.2,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(2)'
        });

        gsap.from(card, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
            },
            x: item.classList.contains('left') ? -60 : 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
}

/* ==========================================================================
   ACHIEVEMENTS CONFETTI CELEBRATIONS
   ========================================================================== */
function initAchievementsCelebrations() {
    const triggers = document.querySelectorAll('.celebration-trigger');
    
    if (triggers.length === 0 || typeof confetti === 'undefined') return;

    triggers.forEach(card => {
        // Fire confetti on Click
        card.addEventListener('click', () => {
            celebrateWithConfetti();
        });
        
        // Add mouseenter listener for a lighter burst
        let canBurst = true;
        card.addEventListener('mouseenter', () => {
            if (canBurst) {
                // A quick light confetti shower
                confetti({
                    particleCount: 25,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#ff4b91', '#ffbfa3', '#9d4ede']
                });
                confetti({
                    particleCount: 25,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#ff4b91', '#ffbfa3', '#9d4ede']
                });
                
                // Throttle hover confetti to prevent lag
                canBurst = false;
                setTimeout(() => { canBurst = true; }, 3000);
            }
        });
    });

    function celebrateWithConfetti() {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Confetti bursts from random angles
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#ff4b91', '#ff80a4', '#ffbfa3', '#ffffff']
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#ff4b91', '#ff80a4', '#ffbfa3', '#ffffff']
            }));
        }, 250);
    }
}

/* ==========================================================================
   CONTACT FORM INTEGRATION
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('portfolio-contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get Form Values
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const submitBtn = document.getElementById('form-submit-btn');

        // Check values
        if (!nameInput.value || !emailInput.value || !subjectInput.value) {
            return;
        }

        // Visual feedback for sending
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Sending...</span><i data-lucide="loader" class="animate-spin"></i>`;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        submitBtn.disabled = true;

        // Simulate network latency (1.5 seconds)
        setTimeout(() => {
            // Restore button
            submitBtn.innerHTML = `<span>Message Sent!</span><i data-lucide="check-circle"></i>`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            submitBtn.style.background = 'linear-gradient(135deg, #27c93f 0%, #a2f2a5 100%)';
            submitBtn.style.color = '#040106';

            // Confetti check
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#27c93f', '#a2f2a5', '#ff4b91', '#ffffff']
                });
            }

            // Reset fields
            contactForm.reset();

            // Restore button styling after 4 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 4000);

        }, 1500);
    });
}

/* ==========================================================================
   INTERACTIVE SKILLS MOUSE TRAIL GLOW
   ========================================================================== */
function initSkillsCardGlow() {
    const cards = document.querySelectorAll('.skills-category-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   AI TERMINAL CONSOLE INTERACTIVE SYSTEM
   ========================================================================== */
function initAITerminalInteractive() {
    const badges = document.querySelectorAll('.clickable-ai-badge');
    const termCommand = document.getElementById('terminal-command');
    const termOutput = document.getElementById('terminal-output');

    if (badges.length === 0 || !termCommand || !termOutput) return;

    // Console output database
    const consoleDatabase = {
        Copilot: {
            command: `copilot --generate "REST API for product search"`,
            output: `[GitHub Copilot] Generating Express router...

router.get('/search', async (req, res) => {
  const { query } = req.query;
  const results = await db.query('SELECT * FROM products WHERE name ILIKE $1', [\`%\${query}%\`]);
  res.json(results.rows);
});

[SUCCESS] Code block generated in 450ms.`
        },
        Antigravity: {
            command: `antigravity --optimise "LMS dashboard components"`,
            output: `[Antigravity] Analysing client codebases...
[INFO] Found 3 unoptimised layout blocks.
[PROCESS] Injecting glassmorphic css tokens & backdrop-filter buffers.
[SUCCESS] Responsive scaling active. Build completed in 18ms.`
        },
        Claude: {
            command: `claude --refactor "PostgreSQL database indexing"`,
            output: `[Claude] Suggested optimization:

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_category ON courses(category);

[INFO] Performance forecast: +240% read throughput.
[SUCCESS] SQL statements executed successfully.`
        },
        Lovable: {
            command: `lovable --prompt "add glowing neon theme buttons"`,
            output: `[Lovable] Applying pink accents:

button {
  background: linear-gradient(135deg, #ff4b91, #ffbfa3);
  box-shadow: 0 0 15px rgba(255, 75, 145, 0.4);
}

[SUCCESS] Styles updated in compiler cache.`
        },
        Kombai: {
            command: `kombai --vector "figma-design-spec"`,
            output: `[Kombai] Parsing vector structures...
[EXPORT] SVG layout compiled to semantic HTML5 and clean flexbox CSS styles.
[SUCCESS] Zero-pixel deviation layout created.`
        },
        Codex: {
            command: `codex --explain "RESTful API query execution plan"`,
            output: `[Codex] Execution Plan Analysis:
- Seq Scan detected on 'course_enrollments' (Size: 25k records).
- Recommendation: Replace with Index Scan using 'idx_enrollments_student_id'.
[SUCCESS] Execution profile mapped.`
        },
        Zencoder: {
            command: `zencoder --transcode "intro_video.mov" --target "h264_1080p"`,
            output: `[Zencoder] Starting transcode job #847291...
[STATUS] Audio channel mapping verified. Video stream configured.
[SUCCESS] Output uploaded to CDN storage block. Status: 200 OK.`
        },
        Replit: {
            command: `replit --deploy "vc3d-printing-server"`,
            output: `[Replit] Container creation sequence initialized...
[PORT] Routing server output to :http://localhost:8080.
[SUCCESS] App live on production sub-domains.`
        },
        Traycer: {
            command: `traycer --debug "qr-generator-exception"`,
            output: `[Traycer] Traceback inspection complete:
- Line 42: ReferenceError: 'QRCode' class not defined.
- Solution: Load 'qrcode-generator' client package.
[SUCCESS] Troubleshooting report generated.`
        }
    };

    let typingTimer = null;

    badges.forEach(badge => {
        badge.addEventListener('click', () => {
            const tool = badge.getAttribute('data-tool');
            const data = consoleDatabase[tool];

            if (!data) return;

            // Toggle active class on badges
            badges.forEach(b => b.classList.remove('active-badge'));
            badge.classList.add('active-badge');

            // Cancel running typing animation
            if (typingTimer) clearTimeout(typingTimer);

            // Print Command first
            termCommand.textContent = '';
            termOutput.textContent = '';

            let cmdCharIndex = 0;
            function typeCommand() {
                if (cmdCharIndex < data.command.length) {
                    termCommand.textContent += data.command.charAt(cmdCharIndex);
                    cmdCharIndex++;
                    typingTimer = setTimeout(typeCommand, 30);
                } else {
                    // Once command finishes typing, output results after a slight pause
                    typingTimer = setTimeout(() => {
                        termOutput.textContent = data.output;
                    }, 200);
                }
            }
            typeCommand();
        });
    });
}
