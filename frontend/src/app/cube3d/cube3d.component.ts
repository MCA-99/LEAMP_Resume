import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from "three";

@Component({
  selector: 'app-cube3d',
  templateUrl: './cube3d.component.html',
  styleUrls: ['./cube3d.component.css']
})
export class Cube3dComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
    /*
    * Create the basics
    */
    // Create the scene
    const scene = new THREE.Scene();
    // Create the camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Create the renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    /*
    * Cube
    */
    // (Create the cube) Create the geometry
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    // Create the skin
    const texture = new THREE.TextureLoader().load("/assets/texture.jpg");
    texture.generateMipmaps = false; // Prevent blurry texture on lateral view
    texture.minFilter = THREE.LinearFilter; // Prevent blurry texture on lateral view
    texture.needsUpdate = true; // Prevent blurry texture on lateral view
    const material = new THREE.MeshLambertMaterial({ map: texture });
    // Create the cube
    const cube: THREE.Mesh = new THREE.Mesh(cubeGeometry, material);
    // Smooth the cube
    cube.geometry.computeVertexNormals();
    // Allow the cube to cast shadows
    cube.castShadow = true;
    // Add the cube to the scene
    scene.add(cube);
    // Animate the cube
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0;
      cube.rotation.y += 0;
      cube.rotation.z += 0;
      renderer.render(scene, camera);
    }
    animate();

    /*
    * Floor
    */
    // (Create the floor) Create the geometry
    const floorGeometry = new THREE.BoxGeometry(7, 0.1, 7);
    // Create the skin
    const floorMaterial = new THREE.MeshLambertMaterial({ color: '#4287f5' });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // Set the position of the floor
    floor.position.y = -1.5;
    // Allow the floor to cast shadows
    floor.receiveShadow = true;
    // Add the floor to the scene
    scene.add(floor);

    /*
    * Light
    */
    // Ambient light
    // Create ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    // Add the ambient light to the scene
    scene.add(ambientLight);

    // Point light (points cube)
    // Create point light
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    // Set the position of the point light
    pointLight.position.set(10, 12, 5);
    // Allow the point light to cast shadows
    pointLight.castShadow = true;
    // Set distance between shadows and camera
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 25;
    // Quit pixelating shadows
    pointLight.shadow.mapSize.width = 3072;
    pointLight.shadow.mapSize.height = 3072;
    // Make shadow blurry
    pointLight.shadow.bias = -0.005;
    // Add the point light to the scene
    scene.add(pointLight);

    /*
    * Add car movement to cube
    */
    // Create the controls
    let direction = null;
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'w':
          cube.translateZ(-0.1);
          break;
        case 's': // S
          cube.translateZ(0.1);
          break;
        case 'a': // A
          cube.rotateY(0.1);
          break;
        case 'd': // D
          cube.rotateY(-0.1);
          break;
        default:
          direction = null;
      }
    });

    document.addEventListener('keyup', (event) => {
      direction = null;
    });

    /*
    * Define customizations for scene/camera/renderer
    */
    // Set the color of the scene
    scene.background = new THREE.Color(0xffffff);
    // Set the camera position
    camera.position.x = 0; // horizontal position of the camera
    camera.position.y = 4; // vertical position of the camera
    camera.position.z = 5; // depth position of the camera
    camera.lookAt(cube.position); // Look at the cube
    renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the renderer
    renderer.shadowMap.enabled = true; // Enable shadow casting

    /*
    * Render the final scene and add to the DOM
    */
    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement);
  }

  ngAfterViewInit() {
  }

}
