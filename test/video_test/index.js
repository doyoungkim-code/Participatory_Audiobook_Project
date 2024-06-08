// const video1 = "./"
// const video2 = document.querySelector('#video2');
let video = [];
video[0] = document.querySelector('#video1')
video[1] = document.querySelector('#video2')
// const video1 = document.querySelector('#video1')
let index=0;

// wait 함수 사용하기, sleep함수도 있는듯
async function bthPlay()
{
    // document.getElementById("video1").style.display="flex"
    video[index].style.display="flex"
    video[index].play();
    if (index == 0)
    {   
        test()
        index++;
    }
    else   
    {
        index--;
    }
}


async function bthPause()
{
    // video1.pause();
    if (video[index].paused)
        video[index].play();
    else
        video[index].pause();
}
