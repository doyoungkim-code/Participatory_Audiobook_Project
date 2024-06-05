
BASIC[2] = "basic1.mp3", "basic2.mp3"
EXPLAIN[2] = "explain1.mp3", "explain2.mp3"
CHOICE[4] = "choice1-1", "choice1-2", "choice2-1" , "choice2-2"

async function PLAY()
{
    var audio = new Audio(BASIC[index]);
    audio.play(); // 내장 함수임.
    // Audio(BASIC[index]).play(); -> 이게 된다면 제일 best
    // 오디오 끝나면 다음 함수 실행되도록 설정해야 함.
    audio = new Audio(EXPLAIN[index]);
    audio.play();
    result = playwebcam();
    palyaudio(CHO[index*2 + result]); //H전 천재, if 문을 없앴다
    intdx++
    PLAY();
}

playwebcam() 
{  
    if (1)
        return 0
    else
        return 1 
}