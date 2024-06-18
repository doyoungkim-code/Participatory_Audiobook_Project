# Participatory_Audiobook_Project
**240601** / **[frontend]** added main page (index.html) and book_a page (book_a.html) <br>
**240602** / **[frontend]** added About page (about.html) and connected link <br>
**240605** / **[backend]** added test/cvtest(opencv image processing test) and audio_test.js <br>
**240607** / **[frontend]** added example image and modified the container location <br>
**240608** / **[backend]** 영상재생 함수 테스트 폴더 추가 (test/video_test)/영상 처음부터 끝까지 재생 가능. 티처블 모델이 2개 밖에 없어서 스토리 3번재생 후 분기하지 않고 정지. 모델이 불완전해서 인식은 2번으로 기본 인식. 스토리 1번 모델이 주먹, 빠 구분. 스토리 2번 모델이 손가락 1개, 손가락 2개 구분. 두개의 모델은 두 상황이 아닌경우 3번 출력 <br>
**240611** / **[backend]** AI 프레임워크 미디어파이프 사용. 신체부위를 나타내는 각 랜드마크 존재여부를 통해 사용자가 오디오 북 서비스에 참여할 수 있도록 신체가 나오게 하는 것에 활용할 수 있을 것 같습니다. <br>
**240612** / **[backend]** Separate functions, modify video file to fit story (remove 3-1.MOV, 3-2.MOV and add 3-0.MOV), and add EPIL.MOV <br>
**240612** / **[backend]** test_mediapipe 폴더 추가(기존 js + mediapipe 코드) <br>
**240613** / **[frontend]** intro image mapping for next page + mapping area : (410, 520, 614, 666) <br>
**240615** / **[book]** book 폴더 추가, 풍선 포포의 여행 내용 및 이미지 추가 <br>
**240615** / **[frontend]** modified book1 image <br>
**240616** / **[frontend]** thumbnail image completed (book1 ~ book4 : example image, book5 ~ book8 : default image) <br>
**240618** / **[backend]** (**240615** / **[backend]**) backend/ahrelee_video/index.js파일에 영상 시작 전 모션인식을 통해 사람이 카메라에 잡히는지 확인 후 시작, 영상을 눌러 일시정지/재생 추가.  video 경로 변겅(backend/video) book_a.html과 backend/ahrelee_video/index.js 연결. ahrelee_video/index.js를 기본으로 설정/ book_a.html연결 후 ahrelee_video 폴더 삭제. 실험 과정에 있었던 모든 파일을 hyeojeon_test폴더로 이동. <br>
