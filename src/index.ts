import "./style.less";

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Vector2, Color3 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";

import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";

import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";


import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";

import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Layers/effectLayerSceneComponent";

import "@babylonjs/core/Materials/PBR/index";
import "@babylonjs/core/Materials/PBR/pbrMaterial";

import "@babylonjs/core/Materials/index";
import "@babylonjs/core/Loading/loadingScreen";

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent"
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
// import { GLTFFileLoader } from "babylonjs-loaders";
import "@babylonjs/loaders/glTF"
import { BoxBuilder } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Texture } from "@babylonjs/core/Materials/index";

// SceneLoader.RegisterPlugin(new GLTFFileLoader());

let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element 
let engine = new Engine(canvas, true, { stencil: true }); // Generate the BABYLON 3D engine
/******* Add the create scene function ******/
let createScene = function ()
{

    // Create the scene space
    let scene = new Scene(engine);
    scene.useRightHandedSystem = true;

    // // Add a camera to the scene and attach it to the canvas
    let camera = new ArcRotateCamera("Camera", 0, 0, 100, new Vector3(0, 0, 0), scene);
    camera.setPosition(new Vector3(0, 1000, 1000));
    camera.inputs;
    camera.attachControl(canvas, true);
    camera.wheelDeltaPercentage = 0.2;

    globalThis.camera = camera;
    globalThis.scene = scene;

    camera.inertia = 0;



    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed;
    camera.speed
    camera.lowerRadiusLimit = 15;
    camera.upperRadiusLimit = 180;

    camera.alpha = 0.8;


    let woodPlank = BoxBuilder.CreateBox("gg", { width: 65, height: 1, depth: 65 }, scene);

    var wood = new PBRMaterial("wood", scene);
    wood.environmentIntensity = 1;
    wood.specularIntensity = 0.3;

    wood.reflectivityTexture = new Texture("reflectivity.png", scene);
    wood.useMicroSurfaceFromReflectivityMapAlpha = true;

    wood.albedoColor = Color3.White();
    wood.albedoTexture = new Texture("albedo.png", scene);
    woodPlank.material = wood;

    // Load the model
    SceneLoader.ShowLoadingScreen = false;

    // scene.lights[0].dispose();
    var light = new DirectionalLight("light1", new Vector3(-2, -6, -2), scene);
    light.position = new Vector3(20, 60, 20);
    light.shadowMinZ = 30;
    light.shadowMaxZ = 180;
    light.intensity = 5;

    var generator = new ShadowGenerator(512, light);
    generator.useContactHardeningShadow = true;
    generator.bias = 0.01;
    generator.normalBias = 0.05;
    generator.contactHardeningLightSizeUVRatio = 0.08;

    for (var i = 0; i < scene.meshes.length; i++)
    {
        generator.addShadowCaster(scene.meshes[i]);
        scene.meshes[i].receiveShadows = true;
        //@ts-ignore
        if (scene.meshes[i].material && scene.meshes[i].material.bumpTexture)
        {
            //@ts-ignore
            scene.meshes[i].material.bumpTexture.level = 2;
        }
    }

    var helper = scene.createDefaultEnvironment({
        skyboxSize: 1500,
        groundShadowLevel: 0.5,
    });

    helper.setMainColor(Color3.Gray());

    scene.environmentTexture.lodGenerationScale = 0.6;

    console.log("end");

    // SceneLoader.Append("http://localhost:7779/", "FlightHelmet_Materials.gltf", scene, function (meshes)
    // {
    //     // Create a camera pointing at your model.
    //     scene.createDefaultCameraOrLight(true, true, true);
    //     let camera = scene.activeCamera as ArcRotateCamera;
    //     camera.useAutoRotationBehavior = true;
    //     camera.lowerRadiusLimit = 15;
    //     camera.upperRadiusLimit = 180;

    //     camera.alpha = 0.8;

    //     scene.lights[0].dispose();
    //     var light = new DirectionalLight("light1", new Vector3(-2, -6, -2), scene);
    //     light.position = new Vector3(20, 60, 20);
    //     light.shadowMinZ = 30;
    //     light.shadowMaxZ = 180;
    //     light.intensity = 5;

    //     var generator = new ShadowGenerator(512, light);
    //     generator.useContactHardeningShadow = true;
    //     generator.bias = 0.01;
    //     generator.normalBias = 0.05;
    //     generator.contactHardeningLightSizeUVRatio = 0.08;

    //     for (var i = 0; i < scene.meshes.length; i++)
    //     {
    //         generator.addShadowCaster(scene.meshes[i]);
    //         scene.meshes[i].receiveShadows = true;
    //         //@ts-ignore
    //         if (scene.meshes[i].material && scene.meshes[i].material.bumpTexture)
    //         {
    //             //@ts-ignore
    //             scene.meshes[i].material.bumpTexture.level = 2;
    //         }
    //     }

    //     var helper = scene.createDefaultEnvironment({
    //         skyboxSize: 1500,
    //         groundShadowLevel: 0.5,
    //     });

    //     helper.setMainColor(Color3.Gray());

    //     scene.environmentTexture.lodGenerationScale = 0.6;

    //     console.log("end");
    // });


    return scene;
};
/******* End of the create scene function ******/

let scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function ()
{
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function ()
{
    engine.resize();
});
