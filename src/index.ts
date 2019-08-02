import "./style.less";

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Vector2, Color3 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer"

import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Layers/effectLayerSceneComponent";


let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element 
let engine = new Engine(canvas, true, { stencil: true }); // Generate the BABYLON 3D engine

/******* Add the create scene function ******/
let createScene = function ()
{

    // Create the scene space
    let scene = new Scene(engine);
    scene.useRightHandedSystem = true;

    // Add a camera to the scene and attach it to the canvas
    let camera = new ArcRotateCamera("Camera", 0, 0, 100, new Vector3(0, 0, 0), scene);
    camera.setPosition(new Vector3(0, 0, 1000));
    camera.inputs;
    camera.attachControl(canvas, true);
    camera.wheelDeltaPercentage = 0.2;

    globalThis.camera = camera;

    camera.inertia = 0;

    // Add lights to the scene
    let light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

    let lp = new Vector3(0, 1, -1);
    let light2 = new PointLight("light2", lp, scene);

    // Add and manipulate meshes in the scene
    let myPoints = [
        new Vector3(0, 0, 0),
        new Vector3(100, 0, 0),
        new Vector3(100, 100, 0),
        new Vector3(0, 100, 0),
    ];

    let ptss = require("./pts.json");

    // Add the highlight layer.
    var hl = new HighlightLayer("hl1", scene);

    for (let pts of ptss)
    {
        for (let i = 0; i < 1; i++)
        {
            for (let j = 0; j < 1; j++)
            {
                let m = new Vector3(i * 1000, j * 1000);
                let line = MeshBuilder.CreateLines("lines", {
                    points: pts.map(p => new Vector3(p.x - 340204, p.y, p.z).multiplyByFloats(0.1, 0.1, 0.1).add(m))
                }, scene);

                // if (i === 0 && j === 0)
                //     hl.addMesh(line, Color3.Green());
            }
        }

    }

    // let gl = new GlowLayer("", scene);
    // gl.customEmissiveColorSelector = (mesh, subMesh, material, result) =>
    // {
    //     // if (mesh == lines)
    //     {
    //         result.r = 0;
    //         result.g = 10;
    //         result.b = 10;
    //     }
    // }

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
