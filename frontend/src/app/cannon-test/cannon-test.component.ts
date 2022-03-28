import { Component, OnInit } from '@angular/core';
import * as STATS from 'stats.ts';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
    * Create a ground plane to latter add physics to it
    */
    const groundGeo = new THREE.BoxGeometry(30, 0, 30);
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
    const sphereGeo = new THREE.SphereGeometry(2, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);







    /*************/
    /* CANNON.js */
    /*************/
    /*
    * Create world
    * The world defines the physics of the simulation
    */
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0) // simulate earth gravity m/s²
    });

    /*
    * Add physics to the ground
    */
    const groundBody = new CANNON.Body({
      // shape: new CANNON.Plane(), // (crea un suelo infinito)
      shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
      type: CANNON.Body.STATIC
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    /*
    * Add physics to the box
    */
    const boxBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
      position: new CANNON.Vec3(1, 20, 0)
    });
    world.addBody(boxBody);

    /*
    * Add physics to the sphere
    */
    const sphereBody = new CANNON.Body({
      mass: 10,
      shape: new CANNON.Sphere(2),
      position: new CANNON.Vec3(0, 15, 0)
    });
    world.addBody(sphereBody);








    /*
    * Start the simulation loop (locked to 60fps)
    */
    let clock = new THREE.Clock();
    let delta = 0; // time since last frame
    let interval = 1 / 60; // 60 fps

    function animate() {
      stats.begin(); // begin measuring fps

      world.fixedStep(1 / 60) // step the world (seconds per frame)

      // Update positions of the meshes
      // Position of the ground
      groundMesh.position.copy(groundBody.position);
      groundMesh.quaternion.copy(groundBody.quaternion);

      groundMesh.position.x = groundBody.position.x;
      groundMesh.position.y = groundBody.position.y;
      groundMesh.position.z = groundBody.position.z;
      // Position of the box
      boxMesh.position.x = boxBody.position.x;
      boxMesh.position.y = boxBody.position.y;
      boxMesh.position.z = boxBody.position.z;

      // Position of the sphere
      sphereMesh.position.x = sphereBody.position.x;
      sphereMesh.position.y = sphereBody.position.y;
      sphereMesh.position.z = sphereBody.position.z;

      requestAnimationFrame(animate); // request next frame
      delta += clock.getDelta(); // get time since last frame

      if (delta > interval) { // if enough time has passed
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
