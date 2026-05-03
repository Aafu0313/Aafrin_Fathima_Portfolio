// Three.js Tech Globe Implementation
class TechGlobe {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globe = null;
        this.animationId = null;
        this.globeMesh = null;
        this.techWaves = [];
        this.techParticles = [];
        this.glowRings = [];
        this.speechBubble = null;
        this.speechBubbleText = null;
        this.showingMessage = false;
        this.isPulsing = false;
        this.pulseAnimation = null;
        this.waveTime = 0;
        this.particleTime = 0;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.createTechGlobe();
        this.setupLighting();
        this.setupControls();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupScene() {
        const container = document.getElementById('robot-canvas');
        const containerWidth = container.parentElement.offsetWidth || 400;
        const containerHeight = 400;

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a051d);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            containerWidth / containerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 6);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: container,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(containerWidth, containerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    createTechGlobe() {
        this.globe = new THREE.Group();
        
        // Create materials for tech globe
        const globeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x9b59b6,
            metalness: 0.3,
            roughness: 0.2,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1,
            emissive: 0x9b59b6,
            emissiveIntensity: 0.15,
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
        });

        const purpleGlowMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8a2be2,
            metalness: 0.5,
            roughness: 0.1,
            clearcoat: 0.9,
            clearcoatRoughness: 0.05,
            emissive: 0x8a2be2,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });

        const pinkGlowMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff69b4,
            metalness: 0.5,
            roughness: 0.1,
            clearcoat: 0.9,
            clearcoatRoughness: 0.05,
            emissive: 0xff69b4,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });

        const gridMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff1493,
            metalness: 0.6,
            roughness: 0.05,
            clearcoat: 1.0,
            clearcoatRoughness: 0,
            emissive: 0xff1493,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });

        const coreMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.8,
            roughness: 0.05,
            clearcoat: 1.0,
            clearcoatRoughness: 0,
            emissive: 0xffffff,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });

        // Create main globe sphere
        const globeGeometry = new THREE.SphereGeometry(1.5, 64, 64);
        this.globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
        this.globeMesh.castShadow = true;
        this.globeMesh.receiveShadow = true;
        this.globe.add(this.globeMesh);

        // Create glowing core inside globe
        const coreGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.globe.add(core);

        // Create inner energy layers
        for (let i = 0; i < 3; i++) {
            const layerGeometry = new THREE.SphereGeometry(1.0 + i * 0.2, 32, 32);
            const layerMaterial = new THREE.MeshPhysicalMaterial({
                color: i % 2 === 0 ? 0x8a2be2 : 0xff69b4,
                metalness: 0.7,
                roughness: 0.05,
                clearcoat: 1.0,
                clearcoatRoughness: 0,
                emissive: i % 2 === 0 ? 0x8a2be2 : 0xff69b4,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            const layer = new THREE.Mesh(layerGeometry, layerMaterial);
            this.globe.add(layer);
        }

        // Create tech grid lines on globe surface
        const createGridLines = (latitudeCount, longitudeCount) => {
            for (let lat = 0; lat < latitudeCount; lat++) {
                const latAngle = (lat / latitudeCount) * Math.PI - Math.PI / 2;
                const y = Math.sin(latAngle) * 1.51;
                const radius = Math.cos(latAngle) * 1.51;
                
                for (let lon = 0; lon < longitudeCount; lon++) {
                    const lonAngle = (lon / longitudeCount) * Math.PI * 2;
                    const x = Math.cos(lonAngle) * radius;
                    const z = Math.sin(lonAngle) * radius;
                    
                    const lineGeometry = new THREE.SphereGeometry(0.02, 8, 8);
                    const line = new THREE.Mesh(lineGeometry, gridMaterial);
                    line.position.set(x, y, z);
                    this.globe.add(line);
                }
            }
        };

        createGridLines(8, 16);

        // Create glowing rings around the globe
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(1.6 + i * 0.3, 0.05, 16, 100);
            const ring = new THREE.Mesh(ringGeometry, i % 2 === 0 ? purpleGlowMaterial : pinkGlowMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = (i - 1) * 0.2;
            this.glowRings.push(ring);
            this.globe.add(ring);
        }

        // Create tech waves emanating from globe
        const createTechWave = (angle, height) => {
            const waveGroup = new THREE.Group();
            
            // Create wave using multiple spheres connected by lines
            const segments = 8;
            for (let i = 0; i < segments; i++) {
                const t = i / segments;
                const radius = 1.5 + t * 2;
                const waveHeight = Math.sin(t * Math.PI * 2) * 0.3;
                
                const segmentGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                const segment = new THREE.Mesh(segmentGeometry, Math.random() > 0.5 ? purpleGlowMaterial : pinkGlowMaterial);
                segment.position.set(
                    Math.cos(angle) * radius,
                    waveHeight + height,
                    Math.sin(angle) * radius
                );
                waveGroup.add(segment);
                
                // Add connecting line
                if (i > 0) {
                    const lineGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 6);
                    const line = new THREE.Mesh(lineGeometry, Math.random() > 0.5 ? purpleGlowMaterial : pinkGlowMaterial);
                    const prevT = (i - 1) / segments;
                    const prevRadius = 1.5 + prevT * 2;
                    const prevHeight = Math.sin(prevT * Math.PI * 2) * 0.3;
                    
                    line.position.set(
                        (Math.cos(angle) * radius + Math.cos(angle) * prevRadius) / 2,
                        (waveHeight + height + prevHeight + height) / 2,
                        (Math.sin(angle) * radius + Math.sin(angle) * prevRadius) / 2
                    );
                    line.lookAt(new THREE.Vector3(
                        Math.cos(angle) * prevRadius,
                        prevHeight + height,
                        Math.sin(angle) * prevRadius
                    ));
                    waveGroup.add(line);
                }
            }
            
            return waveGroup;
        };

        // Create multiple tech waves
        const waveCount = 8;
        for (let i = 0; i < waveCount; i++) {
            const angle = (i / waveCount) * Math.PI * 2;
            const height = Math.random() * 0.5 - 0.25;
            
            const wave = createTechWave(angle, height);
            this.techWaves.push(wave);
            this.globe.add(wave);
        }

        // Create floating tech particles
        const createTechParticle = () => {
            const particleGeometry = new THREE.OctahedronGeometry(0.05, 0, 1);
            const particle = new THREE.Mesh(particleGeometry, Math.random() > 0.5 ? purpleGlowMaterial : pinkGlowMaterial);
            
            // Random position around globe
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = 2 + Math.random() * 2;
            
            particle.position.set(
                Math.cos(theta) * Math.sin(phi) * radius,
                Math.sin(phi) * radius,
                Math.sin(theta) * Math.sin(phi) * radius
            );
            
            // Random rotation
            particle.rotation.x = Math.random() * Math.PI;
            particle.rotation.y = Math.random() * Math.PI;
            particle.rotation.z = Math.random() * Math.PI;
            
            return particle;
        };

        // Create multiple tech particles
        for (let i = 0; i < 50; i++) {
            const particle = createTechParticle();
            this.techParticles.push(particle);
            this.globe.add(particle);
        }

        // Add some orbiting tech elements
        const createOrbiter = (radius, speed, size, color) => {
            const orbiterGroup = new THREE.Group();
            
            const orbiterGeometry = new THREE.BoxGeometry(size, size, size);
            const orbiter = new THREE.Mesh(orbiterGeometry, color);
            orbiter.position.x = radius;
            orbiterGroup.add(orbiter);
            
            orbiterGroup.userData = { radius, speed, initialAngle: Math.random() * Math.PI * 2 };
            
            return orbiterGroup;
        };

        // Create orbiting elements
        for (let i = 0; i < 6; i++) {
            const radius = 2.2 + i * 0.3;
            const speed = 0.5 + Math.random() * 0.5;
            const size = 0.05 + Math.random() * 0.05;
            const color = Math.random() > 0.5 ? purpleGlowMaterial : pinkGlowMaterial;
            
            const orbiter = createOrbiter(radius, speed, size, color);
            this.globe.add(orbiter);
        }

        // Position globe in scene
        this.globe.position.set(0, 0, 0);
        this.globe.scale.set(1.2, 1.2, 1.2);

        // Create speech bubble
        this.createSpeechBubble();

        // Add globe to scene
        this.scene.add(this.globe);
    }

    createFlyPath() {
        // Create a dynamic flight pattern within container bounds
        this.flyPath = {
            radius: 1.2,
            height: 0.6,
            speed: 0.4,
            verticalSpeed: 0.25,
            pattern: 'figure8',
            changeTime: 0
        };
    }

    startFlying() {
        this.createFlyPath();
        this.isFlying = true;
        this.flyTime = 0;
    }

    updateFlight() {
        if (!this.isFlying || !this.flyPath) return;
        
        this.flyTime += 0.016; // ~60fps
        this.flyPath.changeTime += 0.016;
        
        // Change pattern occasionally for variety
        if (this.flyPath.changeTime > 15) { // Change every 15 seconds
            this.flyPath.pattern = this.flyPath.pattern === 'figure8' ? 'circle' : 'figure8';
            this.flyPath.changeTime = 0;
        }
        
        let x, y, z;
        const t = this.flyTime * this.flyPath.speed;
        
        if (this.flyPath.pattern === 'figure8') {
            // Figure-8 pattern
            x = Math.sin(t) * this.flyPath.radius;
            z = Math.sin(t * 2) * this.flyPath.radius * 0.6;
        } else {
            // Circle pattern
            x = Math.cos(t) * this.flyPath.radius;
            z = Math.sin(t) * this.flyPath.radius;
        }
        
        y = Math.sin(this.flyTime * this.flyPath.verticalSpeed) * this.flyPath.height + 1;
        
        // Constrain to container bounds
        const maxRadius = 1.8;
        const distance = Math.sqrt(x * x + z * z);
        if (distance > maxRadius) {
            x = (x / distance) * maxRadius;
            z = (z / distance) * maxRadius;
        }
        
        // Smooth position updates
        this.butterfly.position.x += (x - this.butterfly.position.x) * 0.03;
        this.butterfly.position.y += (y - this.butterfly.position.y) * 0.03;
        this.butterfly.position.z += (z - this.butterfly.position.z) * 0.03;
        
        // Make butterfly face direction of movement (only when not showing message)
        if (!this.showingMessage) {
            const nextT = (this.flyTime + 0.1) * this.flyPath.speed;
            let nextX, nextZ;
            
            if (this.flyPath.pattern === 'figure8') {
                nextX = Math.sin(nextT) * this.flyPath.radius;
                nextZ = Math.sin(nextT * 2) * this.flyPath.radius * 0.6;
            } else {
                nextX = Math.cos(nextT) * this.flyPath.radius;
                nextZ = Math.sin(nextT) * this.flyPath.radius;
            }
            
            const angle = Math.atan2(nextZ - z, nextX - x);
            this.butterfly.rotation.y = angle + Math.PI / 2;
            
            // Add slight banking during turns
            this.butterfly.rotation.z = Math.sin(t * 2) * 0.1;
        }
        
        // Continuous wing flapping during flight
        const flapSpeed = this.isFluttering ? 30 : 18;
        const flapAngle = Math.sin(this.flyTime * flapSpeed) * 0.6 + 0.2;
        
        if (this.leftUpperWing && this.rightUpperWing && this.leftLowerWing && this.rightLowerWing) {
            this.leftUpperWing.rotation.x = flapAngle;
            this.rightUpperWing.rotation.x = -flapAngle;
            this.leftLowerWing.rotation.x = flapAngle * 0.7;
            this.rightLowerWing.rotation.x = -flapAngle * 0.7;
        }
        
        // Antenna movement during flight
        this.antennae.forEach((antenna, index) => {
            const baseRotation = Math.PI / 6 + (index === 0 ? 0.1 : -0.1);
            antenna.rotation.z = baseRotation + Math.sin(this.flyTime * 20) * 0.08;
        });
    }

    createSpeechBubble() {
        // Create speech bubble group
        this.speechBubble = new THREE.Group();
        this.speechBubble.visible = false;

        // Create bubble geometry
        const bubbleGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const bubbleMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
            emissive: 0x8a2be2,
            emissiveIntensity: 0.2
        });
        
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        bubble.scale.set(1.3, 0.9, 1);
        bubble.position.set(0, 3.5, 0);
        this.speechBubble.add(bubble);

        // Create bubble tail
        const tailGeometry = new THREE.ConeGeometry(0.25, 0.4, 8);
        const tailMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
            emissive: 0xff69b4,
            emissiveIntensity: 0.2
        });
        
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(0, 3, 0);
        tail.rotation.z = Math.PI;
        this.speechBubble.add(tail);

        // Create text sprite for the message
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.fillStyle = '#1a051d';
        context.font = 'bold 36px Outfit';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Hi', canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.5
        });
        
        this.speechBubbleText = new THREE.Sprite(spriteMaterial);
        this.speechBubbleText.scale.set(1.3, 0.7, 1);
        this.speechBubbleText.position.set(0, 3.5, 0.1);
        this.speechBubble.add(this.speechBubbleText);

        // Add speech bubble to globe
        this.globe.add(this.speechBubble);
    }

    showMessage() {
        if (this.speechBubble && !this.showingMessage) {
            this.showingMessage = true;
            this.speechBubble.visible = true;
            
            // Start pulse animation
            this.startPulse();
            
            // Animate bubble appearance
            this.speechBubble.scale.set(0, 0, 0);
            const targetScale = 1;
            const animateIn = () => {
                if (this.speechBubble.scale.x < targetScale) {
                    this.speechBubble.scale.x += 0.1;
                    this.speechBubble.scale.y += 0.1;
                    this.speechBubble.scale.z += 0.1;
                    requestAnimationFrame(animateIn);
                }
            };
            animateIn();
            
            // Hide message after 3 seconds
            setTimeout(() => {
                this.hideMessage();
            }, 3000);
        }
    }

    startPulse() {
        if (!this.isPulsing && this.globe) {
            this.isPulsing = true;
            let pulseTime = 0;
            
            this.pulseAnimation = () => {
                if (this.isPulsing && pulseTime < 2) { // Pulse for 2 seconds
                    pulseTime += 0.016; // ~60fps
                    
                    // Enhanced pulsing motion
                    const pulseScale = 1 + Math.sin(pulseTime * 8) * 0.1;
                    this.globe.scale.set(1.2 * pulseScale, 1.2 * pulseScale, 1.2 * pulseScale);
                    
                    // Globe rotation
                    this.globe.rotation.y += 0.02;
                    this.globe.rotation.x = Math.sin(pulseTime * 3) * 0.05;
                    
                    // Enhanced glow effect
                    if (this.globeMesh) {
                        this.globeMesh.material.emissiveIntensity = 0.2 + Math.sin(pulseTime * 10) * 0.1;
                    }
                    
                    // Ring pulsing
                    this.glowRings.forEach((ring, index) => {
                        const ringPulse = 1 + Math.sin(pulseTime * 6 + index * 0.5) * 0.2;
                        ring.scale.set(ringPulse, ringPulse, ringPulse);
                    });
                    
                    // Tech wave animation
                    this.techWaves.forEach((wave, index) => {
                        const wavePulse = 1 + Math.sin(pulseTime * 8 + index * 0.3) * 0.3;
                        wave.scale.set(wavePulse, wavePulse, wavePulse);
                        wave.rotation.z += 0.05;
                    });
                    
                    // Particle movement
                    this.techParticles.forEach((particle, index) => {
                        particle.rotation.x += 0.02;
                        particle.rotation.y += 0.03;
                        particle.position.x += Math.sin(pulseTime * 4 + index * 0.1) * 0.02;
                        particle.position.y += Math.cos(pulseTime * 3 + index * 0.1) * 0.02;
                        particle.position.z += Math.sin(pulseTime * 5 + index * 0.1) * 0.02;
                    });
                    
                    requestAnimationFrame(this.pulseAnimation);
                } else {
                    // Return to normal state
                    this.resetPulsePosition();
                }
            };
            
            this.pulseAnimation();
        }
    }

    resetPulsePosition() {
        const resetAnimation = () => {
            let allReset = true;
            
            // Reset globe scale
            if (Math.abs(this.globe.scale.x - 1.2) > 0.01) {
                this.globe.scale.x += (1.2 - this.globe.scale.x) * 0.1;
                this.globe.scale.y += (1.2 - this.globe.scale.y) * 0.1;
                this.globe.scale.z += (1.2 - this.globe.scale.z) * 0.1;
                allReset = false;
            } else {
                this.globe.scale.set(1.2, 1.2, 1.2);
            }
            
            // Reset globe glow
            if (this.globeMesh) {
                if (Math.abs(this.globeMesh.material.emissiveIntensity - 0.2) > 0.01) {
                    this.globeMesh.material.emissiveIntensity += (0.2 - this.globeMesh.material.emissiveIntensity) * 0.1;
                    allReset = false;
                } else {
                    this.globeMesh.material.emissiveIntensity = 0.2;
                }
            }
            
            // Reset rings
            this.glowRings.forEach((ring) => {
                if (Math.abs(ring.scale.x - 1) > 0.01) {
                    ring.scale.x += (1 - ring.scale.x) * 0.1;
                    ring.scale.y += (1 - ring.scale.y) * 0.1;
                    ring.scale.z += (1 - ring.scale.z) * 0.1;
                    allReset = false;
                } else {
                    ring.scale.set(1, 1, 1);
                }
            });
            
            // Reset tech waves
            this.techWaves.forEach((wave) => {
                if (Math.abs(wave.scale.x - 1) > 0.01) {
                    wave.scale.x += (1 - wave.scale.x) * 0.1;
                    wave.scale.y += (1 - wave.scale.y) * 0.1;
                    wave.scale.z += (1 - wave.scale.z) * 0.1;
                    allReset = false;
                } else {
                    wave.scale.set(1, 1, 1);
                }
            });
            
            if (!allReset) {
                requestAnimationFrame(resetAnimation);
            } else {
                this.isPulsing = false;
            }
        };
        
        resetAnimation();
    }

    hideMessage() {
        if (this.speechBubble && this.showingMessage) {
            const animateOut = () => {
                if (this.speechBubble.scale.x > 0) {
                    this.speechBubble.scale.x -= 0.1;
                    this.speechBubble.scale.y -= 0.1;
                    this.speechBubble.scale.z -= 0.1;
                    requestAnimationFrame(animateOut);
                } else {
                    this.speechBubble.visible = false;
                    this.showingMessage = false;
                }
            };
            animateOut();
        }
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);

        // Purple point light
        const purplePointLight = new THREE.PointLight(0x8a2be2, 2, 15);
        purplePointLight.position.set(-3, 3, 3);
        this.scene.add(purplePointLight);

        // Pink point light
        const pinkPointLight = new THREE.PointLight(0xff69b4, 2, 15);
        pinkPointLight.position.set(3, -3, 3);
        this.scene.add(pinkPointLight);

        // Core light from inside
        const coreLight = new THREE.PointLight(0xffffff, 3, 8);
        coreLight.position.set(0, 0, 0);
        this.scene.add(coreLight);

        // Spotlight from above
        const spotLight = new THREE.SpotLight(0xffffff, 1.5, 20, Math.PI / 6, 0.1, 1);
        spotLight.position.set(0, 8, 0);
        spotLight.target.position.set(0, 0, 0);
        spotLight.castShadow = true;
        this.scene.add(spotLight);
        this.scene.add(spotLight.target);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0xff69b4, 0.8);
        rimLight.position.set(-5, 2, -5);
        this.scene.add(rimLight);
    }

    setupControls() {
        // Mouse interaction for rotation
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;

        const handleMouseMove = (event) => {
            const container = document.getElementById('robot-canvas');
            const rect = container.getBoundingClientRect();
            
            mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            targetRotationY = mouseX * 0.5;
            targetRotationX = mouseY * 0.3;
        };

        const container = document.getElementById('robot-canvas');
        container.addEventListener('mousemove', handleMouseMove);

        // Smooth rotation
        this.updateRotation = () => {
            if (this.globe) {
                this.globe.rotation.y += (targetRotationY - this.globe.rotation.y) * 0.05;
                this.globe.rotation.x += (targetRotationX - this.globe.rotation.x) * 0.05;
            }
        };
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Continuous tech globe animations
        if (this.globe && !this.isPulsing) {
            this.waveTime += 0.016;
            this.particleTime += 0.016;
            
            // Gentle rotation
            this.globe.rotation.y += 0.005;
            this.globe.rotation.x = Math.sin(this.waveTime * 0.3) * 0.02;
            
            // Subtle pulsing
            const subtlePulse = 1 + Math.sin(this.waveTime * 2) * 0.02;
            this.globe.scale.set(1.2 * subtlePulse, 1.2 * subtlePulse, 1.2 * subtlePulse);
            
            // Globe glow effect
            if (this.globeMesh) {
                this.globeMesh.material.emissiveIntensity = 0.2 + Math.sin(this.waveTime * 5) * 0.05;
            }
            
            // Ring rotation
            this.glowRings.forEach((ring, index) => {
                ring.rotation.x += 0.01;
                ring.rotation.y += 0.015 * (index % 2 === 0 ? 1 : -1);
            });
            
            // Tech wave movement
            this.techWaves.forEach((wave, index) => {
                wave.rotation.z += 0.02;
                const wavePulse = 1 + Math.sin(this.waveTime * 4 + index * 0.2) * 0.1;
                wave.scale.set(wavePulse, wavePulse, wavePulse);
            });
            
            // Particle movement
            this.techParticles.forEach((particle, index) => {
                particle.rotation.x += 0.01;
                particle.rotation.y += 0.02;
                particle.position.x += Math.sin(this.particleTime * 2 + index * 0.1) * 0.01;
                particle.position.y += Math.cos(this.particleTime * 3 + index * 0.1) * 0.01;
                particle.position.z += Math.sin(this.particleTime * 4 + index * 0.1) * 0.01;
            });
            
            // Orbiting elements
            this.globe.children.forEach(child => {
                if (child.userData && child.userData.radius) {
                    const orbiterAngle = child.userData.initialAngle + this.waveTime * child.userData.speed;
                    child.rotation.y = orbiterAngle;
                    child.position.x = Math.cos(orbiterAngle) * child.userData.radius;
                    child.position.z = Math.sin(orbiterAngle) * child.userData.radius;
                }
            });
        }

        // Update rotation based on mouse (only when not showing message)
        if (this.updateRotation && !this.showingMessage) {
            this.updateRotation();
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const container = document.getElementById('robot-canvas');
        const containerWidth = container.parentElement.offsetWidth || 400;
        const containerHeight = 400;

        this.camera.aspect = containerWidth / containerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(containerWidth, containerHeight);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Clean up geometries and materials
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}

// Initialize tech globe when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    let techGlobe = null;
    
    // Initialize tech globe after a short delay
    setTimeout(() => {
        const canvas = document.getElementById('robot-canvas');
        if (canvas) {
            techGlobe = new TechGlobe();
            
            // Show 3D message after tech globe is initialized
            setTimeout(() => {
                techGlobe.showMessage();
            }, 1500);
        }
    }, 500);
    
    // Show message on hover
    const canvasContainer = document.getElementById('robot-canvas-container');
    if (canvasContainer) {
        canvasContainer.addEventListener('mouseenter', () => {
            if (techGlobe) {
                techGlobe.showMessage();
            }
        });
        
        canvasContainer.addEventListener('mouseleave', () => {
            if (techGlobe) {
                setTimeout(() => {
                    techGlobe.hideMessage();
                }, 2000);
            }
        });
        
        // Also show message on click for mobile
        canvasContainer.addEventListener('click', () => {
            if (techGlobe) {
                techGlobe.showMessage();
            }
        });
    }
});
