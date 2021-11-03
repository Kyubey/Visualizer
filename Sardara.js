
var canvas = document.getElementById("renderCanvas");
BABYLON.Database.IDBStorageEnabled = true;
var engine = null;
var scene = null;

var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

var createScene = function () {
    const scene = new BABYLON.Scene(engine);
    /*const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 4, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    camera.target=new BABYLON.Vector3(3,3,3);*/
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    //Save the variables of the different type of meshes
        function saveModel2(mesh){
            let i=0;
            for (i=1;i<6;i++){
                models[i-1]=scene.getNodeByName(''+i);
                modelsA[i-1]=scene.getNodeByName(''+i+'virtual_primitive0');
                modelsC[i-1]=scene.getNodeByName(''+i+'virtual_primitive1');
                
                holoAnim[i-1] = scene.getAnimationGroupByName("holo"+i);
               // modelsA[i-1]=scene.getNodeByName('Holo'+i);
                //modelsC[i-1]=scene.getNodeByName('Holo'+i);
                modelsA[i-1].setEnabled(false);           
                modelsC[i-1].setEnabled(false);
                modelsB[i-1]=scene.getNodeByName(''+i+'virtualB');
                terrainAnim[i-1] = scene.getAnimationGroupByName("terreno"+i);
                modelsB[i-1].setEnabled(false);
            }
        }


    const frameRates=30;
    //Add meshes
    let models= [];
    let modelsA= [];
    let modelsB= [];
    let modelsC= [];
    let holoAnim =[];
    let terrainAnim =[];
    const modKeys=[];
    
    let mode=0;
    let current=models;
    let number=0;
    var i=0;

    //Animation variables
    var animRotation = new BABYLON.Animation("modelRotation", "rotation", frameRates, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
   // BABYLON.SceneLoader.ImportMesh("", "https://gist.githubusercontent.com/zolex/9e28219fe1cdb782d279698c96816c71/raw/7bd14e10c712f0305f9c34fe0654a454b6793d41/", "viciious.gltf", scene,   function(newmeshes) {
    BABYLON.SceneLoader.ImportMesh("", "https://dl.dropbox.com/s/qlakzfl63cj7qcf/IncrocioSardara.glb", 'IncrocioSardara.glb', scene,   function(newmeshes, particleSystem, skeletons, animationGroups) {
    //    BABYLON.SceneLoader.ImportMesh("PerdaLiana", "asset/", 'PerdaLiana3d.glb', scene,   function(newmeshes) {       
        engine.displayLoadingUI();
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 4, new BABYLON.Vector3(2, 6, 12));
        camera.attachControl(canvas, true);
        camera.target=new BABYLON.Vector3(3,3,3);
        camera.minZ = 0.1;
        mode=0;
        current=models;
        number=0;
        newmeshes[0].scaling=new BABYLON.Vector3(2.0,2.0,2.0);
        //make particle effects for the start of the presentation
        function specialEffects(currentMesh, numberId, maximum, presentationTime){
             // Create a particle system
            var particleSystem = new BABYLON.ParticleSystem("particles", 100, scene);

            //Texture of each particle
            particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs.com/assets/Flare.png", scene);

            // Where the particles come from
            particleSystem.emitter = currentMesh; // the starting object, the emitter
            particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
            particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0); // To...

            // Colors of all particles
            particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

            // Size of each particle (random between...
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.5;

            // Life time of each particle (random between...
            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 1.5;

            // Emission rate
            particleSystem.emitRate = 1500;

            // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

            // Set the gravity of all particles
            particleSystem.gravity = new BABYLON.Vector3(0, -10, 0);

            // Direction of each particle after it has been emitted
            particleSystem.direction1 = new BABYLON.Vector3(-1, 4, 1);
            particleSystem.direction2 = new BABYLON.Vector3(1, 4, -1);

            // Angular speed, in radians
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;

            // Speed
            particleSystem.minEmitPower = 0;
            particleSystem.maxEmitPower = 0;
            particleSystem.updateSpeed = 0.005;

            // Noise
            var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
            noiseTexture.animationSpeedFactor = 5;
            noiseTexture.persistence = 2;
            noiseTexture.brightness = 0.5;
            noiseTexture.octaves = 2;

            particleSystem.noiseTexture = noiseTexture;
            particleSystem.noiseStrength = new BABYLON.Vector3(100, 100, 100);

            // Start the particle system
            particleSystem.start();
            particleSystem.targetStopDuration = (numberId/maximum)*presentationTime+0.1;
            particleSystem.disposeOnStop = true;

        }
        //Function to move the camera near the target 
        function cameraMove(camera, i){
            
            console.log("camera pos: ",camera.position.x,camera.position.y,camera.position.z);
            animMod = new BABYLON.Animation("modelMovement", "position", frameRates, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            aniKeys=[];
            
            newDirection= scene.getNodeByName('Node'+i);
            console.log("node pos: ",newDirection.position.x,newDirection.position.y,newDirection.position.z);
            aniKeys.push({
                frame: 0*frameRates,
                value:   new BABYLON.Vector3(camera.position.x,camera.position.y,camera.position.z)
        
            });
            aniKeys.push({
                frame: 1*frameRates,
                value: newDirection.absolutePosition  
                //new BABYLON.Vector3( newDirection.position.x,newDirection.position.y,newDirection.position.z)
        
            });
            animMod.setKeys(aniKeys); 
            console.log("key pos1: ",aniKeys[0].value.x,aniKeys[0].value.y,aniKeys[0].value.z);
            console.log("key pos2: ",aniKeys[1].value.x,aniKeys[1].value.y,aniKeys[1].value.z);
            console.log("node name: ",newDirection.name);
            scene.beginDirectAnimation(camera, [animMod],  0, 1*frameRates, false);
        }

        //Function to rotate the mesh aroundthemselves
        function wireFrameChange(mesh, numberId, maximum, presentationTime){//Animation variables
            var animWire = new BABYLON.Animation("animWire", "wireframe", frameRates, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            //setting wireframe animation
            wireKeys= [];
            finalTime=(numberId+2)/maximum*presentationTime*frameRates+1;
            //keys that passes from wireframe mode on to wireframe mode off
            wireKeys.push({
                frame: 0,
                value:   1
        
            });
            wireKeys.push({
                frame: finalTime,
                value:  0
            });
            
            animWire.setKeys(wireKeys); 
            
            scene.beginDirectAnimation(mesh.material, [animWire],  0, finalTime, false);
            
           /*  mesh.material.wireframe=true;
            finalTime=numberId/maximum*presentationTime+0.1;
            let cooldown=0;
           scene.registerAfterRender(function () {
                        cooldown++;
                        if(cooldown>finalTime*360)
                            mesh.material.wireframe=false;
                    
              });*/
        }
        //Function to rotate the mesh aroundthemselves
        function rotationAnimation(mesh){
            specialEffects(mesh,3,3,3);
            mesh.getChildMeshes(false).forEach((element,index) => {
                element.material.wireframe= 1.1;
                wireFrameChange(element, index, mesh.getChildMeshes(false).length, 3);
                //if(index%5==0)
            });
            //setting rotation animation
            rotationKeys= [];
            rotationKeys.push({
                frame: 0*frameRates,
                value:   new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z)
        
            });
            rotationKeys.push({
                frame: 0.5*frameRates,
                value:  new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y+Math.PI, mesh.rotation.z)
            });
            rotationKeys.push({
                frame: 1*frameRates,
                value:  new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y+Math.PI*2, mesh.rotation.z)
            });
            rotationKeys.push({
                frame: 1.5*frameRates,
                value:   new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y+Math.PI*3, mesh.rotation.z)
        
            });
            rotationKeys.push({
                frame: 2*frameRates,
                value:  new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y+Math.PI*4, mesh.rotation.z)
            });
            rotationKeys.push({
                frame: 2.5*frameRates,
                value:  new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y+Math.PI*5, mesh.rotation.z)
            });
            rotationKeys.push({
                frame: 3*frameRates,
                value:   new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y+Math.PI*6, mesh.rotation.z)
        
            });
            rotationKeys.push({
                frame: 3.5*frameRates,
                value:  new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y+Math.PI*7, mesh.rotation.z)
            });
            rotationKeys.push({
                frame: 4*frameRates,
                value:  new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y+Math.PI*8, mesh.rotation.z)
            });
            
            //console.log("rot1: ",rotationKeys[1].value.x,rotationKeys[1].value.y,rotationKeys[1].value.z);
            animRotation.setKeys(rotationKeys); 
            
            scene.beginDirectAnimation(mesh, [animRotation],  0, 4*frameRates, false);
        }
    function changeCurrent(current,number,mode,prev){
            modelsA[prev].setEnabled(false);
            modelsC[prev].setEnabled(false);
            modelsB[prev].setEnabled(false);
        if (mode==0){
            current=models[number];
            changeCamera(current);
        }
        if (mode==1){
            modelsA[number].setEnabled(true);
            modelsC[number].setEnabled(true);
            current=modelsA[number];
            changeCamera(current);
            holoAnim[number].start(false, 1.0, holoAnim.from, holoAnim.to, false);
        }
        if (mode==2){
            modelsB[number].setEnabled(true);
            current=modelsB[number];
            changeCamera(current);
            terrainAnim[number].start(false, 1.0, terrainAnim.from, terrainAnim.to, false);
        }
        
        console.log("nuovo target: ",current.name);
        return current;
    }
    //changes the camera focus
    function changeCamera(mesh){
        console.log("camera pos: ",camera.position.x,camera.position.y,camera.position.z);
            let cameraTargetAnim = new BABYLON.Animation("cameraTargetAnim", "lockedTarget", frameRates, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            let aniKeys=[];
            if(camera.lockedTarget==null)
                camera.lockedTarget=camera.lockedTarget;
            console.log("cosa mira la camera: ",camera.lockedTarget);
            aniKeys.push({
                frame: 0,
                value:   camera.lockedTarget
        
            });
            aniKeys.push({
                frame: 1*frameRates,
                value: mesh.absolutePosition
                //new BABYLON.Vector3( newDirection.position.x,newDirection.position.y,newDirection.position.z)
        
            });
            cameraTargetAnim.setKeys(aniKeys); 
            scene.beginDirectAnimation(camera, [cameraTargetAnim],  0, 1*frameRates, false);
            console.log("cosa mira la camera: ",camera.target);
            //camera.lockedTarget=mesh;
    }
        saveModel2();
        camera.lockedTarget=models[0].absolutePosition;
        camera.wheelDeltaPercentage=0.1;
        
        changeCamera(scene.getNodeByName('Sardara'));
        rotationAnimation(scene.getNodeByName('Sardara'));
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    if (kbInfo.event.key=='h' || kbInfo.event.key=='H' ){
                        mode=1;
                        prev=number;
                        current=changeCurrent(current,number,mode,prev);                        
                    }
                    if (kbInfo.event.key=='t' || kbInfo.event.key=='T' ){
                        mode=2;
                        prev=number;
                        current=changeCurrent(current,number,mode,prev);
                    }
                    if (kbInfo.event.key=='n' || kbInfo.event.key=='N' ){
                        mode=0;
                        prev=number;
                        current=changeCurrent(current,number,mode,prev);
                    }
                    //se premo un numero mi anima verso il centro il modello corrispondente su models[] , se premo f o 0 mi porta l'intero modello
                    if ((parseInt(kbInfo.event.key) <= models.length && parseInt(kbInfo.event.key) >0) ) {
                        prev=number;
                        number=parseInt(kbInfo.event.key)-1;
                        current=changeCurrent(current,number,mode,prev);
                        prev=number;
                        cameraMove(camera,number+1);
                    }
                break;
            }
            }); 
        engine.hideLoadingUI();
    });


    return scene;
};
var engine;
var scene;
initFunction = async function() {               
    var asyncEngineCreation = async function() {
    try {
                return createDefaultEngine();
        } catch(e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
        }
    }

engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
scene = createScene();};
initFunction().then(() => {sceneToRender = scene        
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});