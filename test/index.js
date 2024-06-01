// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL1 = "https://teachablemachine.withgoogle.com/models/22MfqGMGI/";
const URL2 = "https://teachablemachine.withgoogle.com/models/9XJIKg_I8/";
let index = 0;
let model1, webcam, labelContainer, maxPredictions, model2;
let model = [];


// Load the image model and setup the webcam
async function init() {
    const modelURL1 = URL1 + "model.json";
    const metadataURL1 = URL1 + "metadata.json";
    const modelURL2 = URL2 + "model.json";
    const metadateURL2 = URL2 + "metadata.json";
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)

    model1 = await tmImage.load(modelURL1, metadataURL1);
    model2 = await tmImage.load(modelURL2, metadateURL2);
    maxPredictions = model1.getTotalClasses();
    maxPredictions = model2.getTotalClasses();

    model[0] = model1;
    model[1] = model2;

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    //window.requestAnimationFrame(loop);
    setTimeout(function () {
        playaudio();
    }, 5000);
    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function playaudio() {
    window.requestAnimationFrame(loop);
}

async function loop() {
    webcam.update(); // update the webcam frame
    if (await predict() == 1) {
        if (index < 1)
            index++;
        else
            index--;
        setTimeout(function () {
            loop();
        }, 3000);
        return;
    }
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model[index].predict(webcam.canvas);

    //for (let i = 0; i < maxPredictions; i++) {
    //    const classPrediction =
    //        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    //    labelContainer.childNodes[i].innerHTML = classPrediction;
    //}

    if (prediction[0].probability.toFixed(2) == 1) {
        labelContainer.childNodes[0].innerHTML = prediction[0].className;
        document.getElementById("class1").style.display = "none";
        return (1);
    }
    else if (prediction[1].probability.toFixed(2) == 1) {
        labelContainer.childNodes[1].innerHTML = prediction[1].className;
        document.getElementById("class2").style.display = "none";
        return (2);
    }
}

   //시작 -- webcam.setup start --진행 -- /인식필요 구간   loop진입,  