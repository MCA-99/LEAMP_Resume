import { Component, OnInit } from '@angular/core';
import * as STATS from 'stats.ts';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

@Component({
  selector: 'app-cannon-test',
  templateUrl: './cannon-test.component.html',
  styleUrls: ['./cannon-test.component.css']
})
export class CannonTestComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // Show fps
    var stats = new STATS.Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);


    /*************/
    /* THREE.js */
    /*************/
    /*
    * Create a renderer, a camera and a scene
    * The camera has a orbit controll added
    */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, // fov
      window.innerWidth / window.innerHeight, // aspect
      0.1, // near
      1000 // far
    );
    const orbit = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 20, -30);
    orbit.update();

    /*
    * Add light to the scene
    */
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(-5, 25, 8);
    const helper = new THREE.DirectionalLightHelper(directionalLight, 1);
    scene.add(directionalLight);
    scene.add(helper);

    /*
    * Create a ground plane to latter add physics to it
    */
    const groundGeo = new THREE.BoxGeometry(50, 50, 0);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    scene.add(groundMesh);

    /*
    * Create a box to latter add physics to it
    */

    const boxGeo = new THREE.BoxGeometry(2, 2, 2);
    const boxMat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    scene.add(boxMesh);

    /*
    * Create a sphere to latter add physics to it
    */
    const sphereGeo = new THREE.SphereGeometry(2, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    /*
    * Create a box with physics to add a custom 3d model to it
    */
    const boxGeo3d = new THREE.BoxGeometry(2, 2, 2);
    const boxMat3d = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true
    });
    const boxMesh3d = new THREE.Mesh(boxGeo3d, boxMat3d);

    const boxModel3d = new GLTFLoader();
    boxModel3d.load('assets/building_house.glb', (gltf) => {
      gltf.scene.scale.set(2, 2, 2);
      boxMesh3d.add(gltf.scene);
    });

    scene.add(boxMesh3d);






    /*************/
    /* CANNON.js */
    /*************/
    /*
    * Create world
    * The world defines the physics of the simulation
    */
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.81, 0) // simulate earth gravity m/s²
    });

    /*
    * Add physics to the ground
    */
    const groundPhysMat = new CANNON.Material();
    const objectPhysMat = new CANNON.Material();

    const groundBody = new CANNON.Body({
      // shape: new CANNON.Plane(), // (crea un suelo infinito)
      shape: new CANNON.Box(new CANNON.Vec3(25, 25, 0.1)),
      type: CANNON.Body.STATIC,
      material: groundPhysMat
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    /*
    * Add physics to the box
    */
    const boxBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
      position: new CANNON.Vec3(1, 20, 0),
      material: objectPhysMat
    });
    world.addBody(boxBody);
    boxBody.linearDamping = 0.05;
    boxBody.angularDamping = 0.05;
    boxBody.angularVelocity.set(0, 5, 0);

    /*
    * Add physics to the sphere
    */
    const sphereBody = new CANNON.Body({
      mass: 10,
      shape: new CANNON.Sphere(2),
      position: new CANNON.Vec3(0, 15, 0),
      material: objectPhysMat
    });
    world.addBody(sphereBody);
    sphereBody.linearDamping = 0.05;
    sphereBody.angularDamping = 0.05;

    /*
    * Add physics to the box with 3d model
    */
    const boxBody3d = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
      position: new CANNON.Vec3(21, 0, -1),
      material: objectPhysMat
    });
    world.addBody(boxBody3d);
    boxBody3d.linearDamping = 0.05;
    boxBody3d.angularDamping = 0.05;

    /*
    * Define physics properties for created materials
    */
    const contactMat = new CANNON.ContactMaterial(
      groundPhysMat,
      objectPhysMat,
      { friction: 0.05, restitution: 0.2 }
    );
    world.addContactMaterial(contactMat);







    /*
    * Update positions of the meshes with the bodies
    */
    function updatePhysics() {
      const listOfMesh = [groundMesh, boxMesh, sphereMesh, boxMesh3d]; // list of all meshes used in the scene
      const listOfBodies = [groundBody, boxBody, sphereBody, boxBody3d]; // list of all bodies used in the scene

      for (let i = 0; i < listOfMesh.length; i++) {
        listOfMesh[i].position.set(listOfBodies[i].position.x, listOfBodies[i].position.y, listOfBodies[i].position.z);
        listOfMesh[i].quaternion.set(listOfBodies[i].quaternion.x, listOfBodies[i].quaternion.y, listOfBodies[i].quaternion.z, listOfBodies[i].quaternion.w);
      }
    }

    /*
    * Start the simulation loop (locked to 60fps)
    */
    let clock = new THREE.Clock();
    let delta = 0; // time since last frame
    let interval = 1 / 60; // 60 fps

    function animate() {
      stats.begin(); // begin measuring fps

      world.fixedStep(1 / 60) // step the world (seconds per frame)

      requestAnimationFrame(animate); // request next frame
      delta += clock.getDelta(); // get time since last frame

      if (delta > interval) { // if enough time has passed
        updatePhysics();
        renderer.render(scene, camera); // render scene
        delta = delta % interval; // reset delta

        stats.end(); // end measuring fps
      }
    }
    renderer.setAnimationLoop(animate);

    /*
    * Check if the user resizes the window
    * If so, update the camera and the renderer
    */
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

}
