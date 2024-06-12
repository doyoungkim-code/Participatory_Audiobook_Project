const videoSelectors = {
    main: ['#video1', '#video2', '#video3'],
    choice: ['#video1-1', '#video1-2', '#video2-1', '#video2-2', '#video3-0'],
    exp: ['#Lex1', '#Lex2', '#Lex3'],
    end: ['#END'],
    epil: ['#EPIL']
};

const videoElements = {};
const modelURLs = {
    // model1: 'https://teachablemachine.withgoogle.com/models/22MfqGMGI/',
    // model2: 'https://teachablemachine.withgoogle.com/models/9XJIKg_I8/'
    model1: 'https://teachablemachine.withgoogle.com/models/ZUaQeP4cP/',
    model2: 'https://teachablemachine.withgoogle.com/models/ZUaQeP4cP/'
};

let models = [];
let webcam;
let labelContainer;
let currentIndex = 0;

function cacheVideoElements() {
    Object.keys(videoSelectors).forEach(key => {
        videoElements[key] = videoSelectors[key].map(selector => document.querySelector(selector));
    });
}


async function initWebcam() {
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
	document.getElementById('webcam-container').style.display = 'flex';
    document.getElementById('webcam-container').appendChild(webcam.canvas);
}

async function initModels() {
    const loadModel = async (modelURL, metadataURL) => await tmImage.load(modelURL, metadataURL);
    models[0] = await loadModel(`${modelURLs.model1}model.json`, `${modelURLs.model1}metadata.json`);
    models[1] = await loadModel(`${modelURLs.model2}model.json`, `${modelURLs.model2}metadata.json`);

    // 어차피 두번만 하니까 getTotalClasses 호출할 필요 없을 듯
    const maxPredictions = models[0].getTotalClasses();
    // labelcontainer는 test에서만 필요한 것이겠죠?
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
    camloop();
}

async function camloop(){
    webcam.update();
    window.requestAnimationFrame(camloop);
}

async function predict(currentIndex) {
    const prediction = await models[currentIndex].predict(webcam.canvas);

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
        ['class1', 'class2', 'class3'].forEach((id, idx) => {
            document.getElementById(id).style.display = maxProbabilityIndex === idx ? "flex" : "none";
        });
        // 0번 인덱스가 1이면 1, 1번 인덱스가 1이면 2
        return maxProbabilityIndex + 1;
    } else {
        // 모든 클래스에 대한 예측이 0.9에 가깝지 않으면 class3를 활성화
        document.getElementById('class3').style.display = 'flex';
        return 3;
    }
}

async function playVideo(videoType, index) {
    const video = videoElements[videoType][index];
    // flex
    // block
    video.style.display = 'flex';
    video.play();

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
    webcam.canvas.style.display = 'none';
    // Epilogue 비디오 보여주기
    const epilogueVideo = document.getElementById('epil');
    // epilogue 비디오 보여주기
    await playVideo('epil', 0);
    // Epilogue 비디오 일시정지  및 종료
    epilogueVideo.pause();
}

async function init() {
    cacheVideoElements();
    await initWebcam();
    await initModels();
}

// 'startButton' 버튼이 클릭되면 다음에 정의된 비동기 함수가 실행
document.getElementById('startButton').addEventListener('click', async () => {
    await init();
    await playallVideo();
});
