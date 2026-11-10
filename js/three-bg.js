// Three.js Animated Background - Automotive Grid (Light Theme)

document.addEventListener("preloaderDone", () => {
    const container = document.getElementById('three-canvas-container');
    if (!container) return; 

    // Scene Setup
    const scene = new THREE.Scene();
    
    // Soft fog to blend the horizon into the light background
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.02);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 5, 20); // Positioned above the "road"

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // Group for the road to move together
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);

    // 1. Create the Infinite Grid (Wireframe Plane)
    const gridGeometry = new THREE.PlaneGeometry(200, 400, 40, 80);
    // Add displacement to make it look like terrain/speed bumps on the sides
    const positionAttribute = gridGeometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        // Leave the center flat for the "road", elevate the sides
        if (Math.abs(x) > 10) {
            const z = Math.random() * 3 + (Math.abs(x) * 0.1);
            positionAttribute.setZ(i, z);
        }
    }
    gridGeometry.computeVertexNormals();

    const gridMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x2563eb, // Vibrant Blue
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -5;
    roadGroup.add(gridMesh);

    // 2. Add Center Road Lines (Glowing effect)
    const lineGeometry = new THREE.PlaneGeometry(1, 400, 1, 10);
    const lineMaterial = new THREE.MeshBasicMaterial({
        color: 0xf43f5e, // Vibrant Rose
        transparent: true,
        opacity: 0.5
    });
    
    // Create dashed line effect programmatically using multiple planes
    for(let i=0; i < 20; i++) {
        const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 5), lineMaterial);
        dash.rotation.x = -Math.PI / 2;
        dash.position.y = -4.9; // Slightly above grid
        dash.position.z = -200 + (i * 20);
        roadGroup.add(dash);
    }

    // 3. Floating "Data Nodes" (representing cars/sensors)
    const nodeGeometry = new THREE.OctahedronGeometry(0.3, 0);
    const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9, // Sky Blue
        wireframe: true
    });

    const nodes = [];
    for(let i = 0; i < 30; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(
            (Math.random() - 0.5) * 60,
            (Math.random() * 5) - 2,
            -Math.random() * 200
        );
        nodes.push(node);
        roadGroup.add(node);
    }

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    // Animation Loop
    const clock = new THREE.Clock();
    const speed = 30; // Speed of the car/road

    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // 1. Move the road forward to simulate driving
        // We move the texture/group towards the camera, and loop it back
        roadGroup.children.forEach(child => {
            if(child !== gridMesh) { // Move dashes and nodes
                child.position.z += speed * delta;
                if(child.position.z > 20) {
                    child.position.z = -200;
                }
            }
        });

        // Animate the grid vertices for a continuous scrolling effect
        const positions = gridMesh.geometry.attributes.position.array;
        for(let i = 1; i < positions.length; i+=3) { // Y values in plane geometry (Z in world)
            positions[i] -= speed * delta * 0.5;
            if(positions[i] < -200) {
                positions[i] = 200;
            }
        }
        gridMesh.geometry.attributes.position.needsUpdate = true;

        // Rotate nodes
        nodes.forEach(node => {
            node.rotation.x += 0.02;
            node.rotation.y += 0.02;
        });

        // Smooth camera movement based on mouse (steering effect)
        targetX = mouseX * 10;
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += ((-mouseY * 5 + 5) - camera.position.y) * 0.05;
        
        // Tilt camera slightly when steering
        camera.rotation.z = -camera.position.x * 0.02;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
