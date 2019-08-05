import "./style.less";

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Vector2, Color3, Matrix } from "@babylonjs/core/Maths/math";
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
import { Texture, DynamicTexture, StandardMaterial } from "@babylonjs/core/Materials/index";
import { Mesh } from "@babylonjs/core";

// SceneLoader.RegisterPlugin(new GLTFFileLoader());

let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element 
let engine = new Engine(canvas, true, { stencil: true }); // Generate the BABYLON 3D engine
/******* Add the create scene function ******/
let createScene = function ()
{

    // Create the scene space
    let scene = new Scene(engine);
    scene.useRightHandedSystem = true;
    Matrix.LookAtLHToRef

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
    camera.lowerRadiusLimit = 15;
    camera.upperRadiusLimit = 180;

    camera.alpha = 0.8;


    let woodPlank = BoxBuilder.CreateBox("gg", { width: 65, height: 1, depth: 65 }, scene);
    woodPlank.position.y = 50;

    var wood = new PBRMaterial("wood", scene);
    wood.environmentIntensity = 1;
    wood.specularIntensity = 0.3;

    wood.reflectivityTexture = new Texture("reflectivity.png", scene);
    wood.useMicroSurfaceFromReflectivityMapAlpha = true;

    wood.albedoColor = Color3.White();
    wood.albedoTexture = new Texture("albedo.png", scene);
    woodPlank.material = wood;
    let nd = woodPlank.clone();
    nd.position.y = 0;

    nd._worldMatrix

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


    // show axis
    var showAxis = function (size)
    {
        var makeTextPlane = function (text, color, size)
        {
            var dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
            var plane = Mesh.CreatePlane("TextPlane", size, scene, true);
            let mat = new StandardMaterial("TextPlaneMaterial", scene);
            plane.material = mat;
            mat.backFaceCulling = false;
            mat.specularColor = new Color3(0, 0, 0);
            mat.diffuseTexture = dynamicTexture;
            return plane;
        };

        var axisX = Mesh.CreateLines("axisX", [
            Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
            new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
        ], scene);
        axisX.color = new Color3(1, 0, 0);
        var xChar = makeTextPlane("X", "red", size / 10);
        xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);
        var axisY = Mesh.CreateLines("axisY", [
            Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
            new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
        ], scene);
        axisY.color = new Color3(0, 1, 0);
        var yChar = makeTextPlane("Y", "green", size / 10);
        yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
        var axisZ = Mesh.CreateLines("axisZ", [
            Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
            new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
        ], scene);
        axisZ.color = new Color3(0, 0, 1);
        var zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
    };

    showAxis(5);

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
