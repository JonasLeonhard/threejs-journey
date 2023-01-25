<img src="https://shields.io/badge/threejs--journey.com-online-green?style=flat-square&logo=statuspal" />

<img src="https://shields.io/badge/course-not_finished-red?style=flat-square&logo=github" />

<br/><br/>

# Description

> Lessons from threejs-journey.com course.

This projects contains lessons from threejs-journey.com, and some of my own three.js / webgl experiments aswell.

## Status

- [x] _in progress_
- [ ] _finished_
- [ ] _no longer continued_

_this application is currently beeing developed_

## Table of contents

- [Description](#description)
- [Status](#status)
- [Table of contents](#table-of-contents)
- [General Info](#general-info)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Setup](#setup)
- [Known Issues](#known-issues)

## General Info

This Project aims to help me learn about three.js and webgl.

---

</br></br></br>

## Screenshots

![Threejs-journey](./readme/threejs-journey.png)
![Debugging](./readme/debug-ui-min.gif)
![Texturing](./readme/texturing.gif)
![Materials](./readme/materials-min.gif)
![Text](./readme/text.gif)
![Lights](./readme/lights-min.gif)
![Shadows](./readme/shadows.gif)
![House Scene](./readme/haunted-house-min.gif)
![Particles](./readme/particles-min.gif)

## Technologies

Main Technologies used in the project:

- Three.js
  - Webgl
  - dat.gui
  - lil.gui
  - gsap
  - cannon-es

It covers the following aspects about three.js:

- basis (what is webgl, responsive canvas, groups, meshes (Cube, Torus, Box, Custom...), material, cameras, lights, textures, 3dtext, scene, properties eg. position, rotation..., animation, optimization)
- lights and shadows (AmbientLight, DirectionalLight, HemisphereLight, PointLight, RectAreaLight, Spotlight, Shadowmaps & sizes, Baking Shadows, Shadow Resolution, Shadow Blur, Shadow Camera)
- particles (PointsMesh, PointsMaterial, CustomGeometry, ColorMap, AlhpaMap, Alphatests, depthwrite, animations, )
- physics (w. cannon-es, rigidbody, collisions, collision-events, performance (sleep, removing components, Broadphase, as a worker), ContactMaterials, Applying Forces)
- importing models (gltf, draco, embedded, other formats, using animations)
- raycasting (mouse & originRays) & reacting to events: mouse -> scroll, click, mouse-enter, mouse-leave

## Setup

Run, to see a message:

```
yarn start
```

```
Project running at:
  - http://[local-ip]:8080
```

Navigate to the subfolder you want to view. eg. '/01-basic'.

## Known Issues

-
