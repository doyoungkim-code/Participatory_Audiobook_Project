let mainvideo = [];
mainvideo[0] = document.querySelector('#video1')
mainvideo[1] = document.querySelector('#video2')
mainvideo[2] = document.querySelector('#video3')

let choicevideo = [];
choicevideo[0] = document.querySelector('#video1-1')
choicevideo[1] = document.querySelector('#video1-2')
choicevideo[2] = document.querySelector('#video2-1')
choicevideo[3] = document.querySelector('#video2-2')
choicevideo[4] = document.querySelector('#video3-1')
choicevideo[5] = document.querySelector('#video3-2')

let expvideo = [];
expvideo[0] = document.querySelector('#Lex1');
expvideo[1]= document.querySelector('#Lex2');
expvideo[2]= document.querySelector('#Lex3');

let endvideo = [];
endvideo[0]= document.querySelector('#END');
//endvideo[1]

let index = 0;
let temp= 0;


// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

const URL1 = "https://teachablemachine.withgoogle.com/models/22MfqGMGI/";
const URL2 = "https://teachablemachine.withgoogle.com/models/9XJIKg_I8/";
let model1, webcam, labelContainer, maxPredictions, model2;
let model = [];

async function init() {
    const flip = true; 
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    document.getElementById("intro").style.display = "none";
    await webcam.play();
    //window.requestAnimationFrame(loop);
    initmodel();
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
    camloop();
    bthPlay();
}


async function initmodel() {
    const modelURL1 = URL1 + "model.json";
    const metadataURL1 = URL1 + "metadata.json";
    const modelURL2 = URL2 + "model.json";
    const metadateURL2 = URL2 + "metadata.json";

    model1 = await tmImage.load(modelURL1, metadataURL1);
    model2 = await tmImage.load(modelURL2, metadateURL2);
    maxPredictions = model1.getTotalClasses();
    maxPredictions = model2.getTotalClasses();

    model[0] = model1;
    model[1] = model2;
}

async function playaudio() {
     webcam.update();
    if (await predict() == 1) 
       return 1;
    else if (await predict() == 2)
        return 2;
    else return 3;
}

async function loop() {
   
    window.requestAnimationFrame(loop);
}

async function camloop(){
    webcam.update(); 
    window.requestAnimationFrame(camloop);
}

async function predict() {
    const prediction = await model[index].predict(webcam.canvas);

    if (prediction[0].probability.toFixed(2) == 1) {
        document.getElementById("class1").style.display = "flex";
        return (1);
    }
    else if (prediction[1].probability.toFixed(2) == 1) {
        document.getElementById("class2").style.display = "flex";
        return (2);
    }
    else{
        document.getElementById("class3").style.display = "flex";
        return (3);
    }
}

function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec*1000));
}

let smaple = 0;
async function bthPlay()
{
    document.getElementById("class1").style.display = "none";
    document.getElementById("class2").style.display = "none";
    document.getElementById("class3").style.display = "none";

    mainvideo[index].style.display="flex"
    mainvideo[index].play();

    while (!(mainvideo[index].paused)){
        await sleep(0.5);
    }
    mainvideo[index].style.display="none"

    expvideo[index].style.display="flex"
    expvideo[index].play();
    temp= 0;
    while (!(expvideo[index].paused)){
        await sleep(0.5);
        // 인식 시작
        if (await  playaudio() == 1){
            smaple = 1;
        }
        else if (await playaudio() == 2){
            smaple = 2;
        }
    } 
    expvideo[index].style.display="none"
    if (smaple == 1)
        playbtn1();
    else if (smaple == 2)
        playbtn2();
    else if (smaple == 0)
        playbtn1();
    //이제 디폴트로 넘어가도록?
}

async function test(){
    if (index % 2 == 0)
        return 1;
    else
        return 2;
}

/* async function btnfnc(){
    btn1 = document.querySelector('#btn1')
    btn2 = document.querySelector('#btn2')
    btn1.style.display="flex"
    btn2.style.display="flex"
} */

async function choicevideoPlay()
{
    choicevideo[index].style.display="flex"
    choicevideo[index].play();
    while (!(choicevideo[index].paused)){
        await sleep(0.5);
    }
    choicevideo[index].style.display="none"
    
    if (index == 4){
        endPlay()
    }
    else{
        index = Math.floor(index / 2) + 1;
        bthPlay()
    }
}

async function endPlay(){
    endvideo[0].style.display="flex"
    endvideo[0].play();
    while (!(endvideo[0].paused)){
        await sleep(0.5);
    }
    // endvideo[0].style.display="none"
}

async function playbtn1(){
    index = index * 2;
    choicevideoPlay();
}
async function playbtn2(){
    index = (index * 2) + 1;
    choicevideoPlay();
}






