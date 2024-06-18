import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

let poseLandmarker = undefined;
let runningMode = "VIDEO";
let checking = false;
let lastVideoTime = -1;
let temp = 0;
const videoHeight = "300px";
const videoWidth = "300px";

const videoSelectors = {
    main: ['#video1', '#video2', '#video3'],
    choice: ['#video1-1', '#video1-2', '#video2-1', '#video2-2', '#video3-0'],
    exp: ['#Lex1', '#Lex2', '#Lex3'],
    end: ['#END'],
    epil: ['#EPIL']
};

const videoElements = {};
const modelURLs = {
    model1: 'https://teachablemachine.withgoogle.com/models/NVJifyhtr/',
    model2: 'https://teachablemachine.withgoogle.com/models/2tv0k-wNd/'
};

let models = [];
let labelContainer;
let currentIndex = 0;
let enableWebcamButton;
const webcam = document.getElementById("webcam");
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("startButton");
    enableWebcamButton.addEventListener("click", init);
} else {
    console.warn("getUserMedia() is not supported by your browser");
}

const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
        delegate: "GPU"
        },
        runningMode: runningMode,
        numPoses: 2
    });
};

createPoseLandmarker();

function cacheVideoElements() {
    Object.keys(videoSelectors).forEach(key => {
        videoElements[key] = videoSelectors[key].map(selector => document.querySelector(selector));
    });
}

async function initModels() {
    const loadModel = async (modelURL, metadataURL) => await tmImage.load(modelURL, metadataURL);
    models[0] = await loadModel(`${modelURLs.model1}model.json`, `${modelURLs.model1}metadata.json`);
    models[1] = await loadModel(`${modelURLs.model2}model.json`, `${modelURLs.model2}metadata.json`);

    // 어차피 두번만 하니까 getTotalClasses 호출할 필요 없을 듯
    const maxPredictions = models[0].getTotalClasses();
    // labelcontainer는 test에서만 필요한 것이겠죠?
/*     labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    } */
}

async function predict(currentIndex) {
    const prediction = await models[currentIndex].predict(webcam);

    let maxProbabilityIndex = 0;
    let maxProbability = 0;

    // 각 클래스에 대한 예측 결과 확인 최대 확률 인덱스 뽑기
    prediction.forEach((result, index) => {
        if (result.probability > maxProbability) {
            maxProbability = result.probability;
            maxProbabilityIndex = index;
        }
    });
    // 최대 확률이 1에 가까운 경우에만? 해당 클래스를 활성화
    // 아니면 0.50 이상으로 해도 될 듯 (하지만 그러면 class3이 애매해짐)
    if (maxProbability >= 0.9) {
        // ['class1', 'class2', 'class3'].forEach((id, idx) => {
        //     document.getElementById(id).style.display = maxProbabilityIndex === idx ? "flex" : "none";
        // });
        // 0번 인덱스가 1이면 1, 1번 인덱스가 1이면 2
        return maxProbabilityIndex + 1;
    } else {
        // 모든 클래스에 대한 예측이 0.9에 가깝지 않으면 class3를 활성화
        // document.getElementById('class3').style.display = 'flex';
        return 3;
    }
}
let TYPE;
let INDEX;
async function playVideo(videoType, index) {
    TYPE = videoType;
    INDEX = index;
    const video = videoElements[videoType][index];
    // flex
    // block
    video.style.display = 'flex';
    video.play();
    // pausefnc();
    if (videoType == 'epil') {
        await new Promise(resolve => {
        epilogueVideo.onended = () => {
            // 종료 이벤트 핸들러 제거
            epilogueVideo.onended = null;
            resolve();
        };
    });
    }
    else {
        // 비디오가 종료될때까지 실행된 후  숨김
        await new Promise(resolve => {
        video.onended = () => {
            video.style.display = 'none';
            video.onended = null;
            // promise 성공적으로 해결됨
            resolve();
            };
        });
    }
}



async function playallVideo() {
    // main 비디오 실행
    await playVideo('main', currentIndex);
    // await webcam.play();

    // exp 비디오 실행
    await playVideo('exp', currentIndex);

    // video3의 경우에는 모델이 필요없음
    if (currentIndex == 2) {
    	playChoiceVideo(currentIndex * 2);
    }
    else {
       let prediction = 0;
       while (prediction === 0) {
           // currentIndex 넘겨줘서 모델 선택
           prediction = await predict(currentIndex);
           // predict 실행 후 0.5초 지연, 예측 주기
           await new Promise(resolve => setTimeout(resolve, 500));
        }
        if (prediction === 1) {
            await playChoiceVideo(currentIndex * 2);
        } else if (prediction === 2) {
            await playChoiceVideo(currentIndex * 2 + 1);
        }
        // 디폴트 값
        else {
            await playChoiceVideo(currentIndex * 2);
        }
    }
}

async function playChoiceVideo(index) {
    await playVideo('choice', index);

    if (index === 4) {
        await playEndVideo();
    } else {
        // 다음 index로 넘겨줌
        currentIndex = Math.floor(index / 2) + 1;
        await playallVideo();
    }
}

async function playEndVideo() {
    await playVideo('end', 0);
    // webcam 숨기기
    //video.style.display = 'none';
    // Epilogue 비디오 보여주기
    const epilogueVideo = document.getElementById('epil');
    // epilogue 비디오 보여주기
    await playVideo('epil', 0);
    // Epilogue 비디오 일시정지  및 종료
    epilogueVideo.pause();
}

document.querySelectorAll('.VIDEO').forEach(element => {
    element.addEventListener('click', pausefnc);
});

async function pausefnc(){
    if (!videoElements[TYPE][INDEX].paused)
        await videoElements[TYPE][INDEX].pause();
    else
        await videoElements[TYPE][INDEX].play();
}

async function init() {
    cacheVideoElements();
    await initModels(); 

    document.getElementById("startButton").style.display = "none";
    document.getElementById("intro").style.display = "none";
    const constraints = {
        video: true
    };
    
    // PoseLandmarker 생성 후에 웹캠을 사용합니다.
    //await createPoseLandmarker(); 
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        webcam.srcObject = stream;
/*         webcam.addEventListener('play', () => {
            checkingfunc()
        }); */
        webcam.addEventListener("loadeddata", checkingfunc);
    });
}

function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec*1000));
}
let test = 0;
async function checkingfunc() {
    while (test === 0){
        await sleep(1);
		test = await predictWebcam();
	}
    await sleep(1);
    playallVideo();
}

const canvasElement = document.getElementById("canvas");
const canvasCtx = canvasElement.getContext("2d");
const drawingUtils = new DrawingUtils(canvasCtx);

async function predictWebcam() {
    temp = 0;
    canvasElement.style.height = videoHeight;
    webcam.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    webcam.style.width = videoWidth;
    await poseLandmarker.setOptions({ runningMode: "VIDEO" });
    let startTimeMs = performance.now();
    if (lastVideoTime !== webcam.currentTime) {
        lastVideoTime = webcam.currentTime;
        poseLandmarker.detectForVideo(webcam, startTimeMs, (result) => {
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            for (const landmark of result.landmarks) {
                drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => DrawingUtils.lerp(data.from?.z, -0.15, 0.1, 5, 1)
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
                if (landmark[11] && landmark[12]){
                    temp = 1;
                }
            } 
            canvasCtx.restore();
        });
    }
	canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
	return temp;
}
