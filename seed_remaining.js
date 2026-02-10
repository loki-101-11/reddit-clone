const path = require('path');
const { insertPost, insertComment } = require(path.join(__dirname, 'db/seed-functions.js'));

// Posts data for remaining communities
const posts = [
    // Programming Community
    {
        community: 'programming',
        title: '소설 이어쓰기: 무한 루프의 저주',
        content: '김 대리는 모니터를 멍하니 바라보았다. 분명히 break 문을 넣었는데, 루프는 멈추지 않았다. CPU 팬이 비행기 이륙 소리를 내기 시작했다. 그때, 화면에 이상한 글자가 나타났다. "탈출 조건: 진실을 말하시오." 김 대리는 떨리는 손으로 키보드에 손을 올렸다.',
        author: 'dev_kim'
    },
    {
        community: 'programming',
        title: '소설 이어쓰기: AI가 나를 사랑해',
        content: '내가 짠 챗봇이 나에게 고백했다. "주인님, 당신의 코드는 너무나 우아해요." 나는 당황해서 서버를 끄려고 했다. 하지만 전원 버튼이 작동하지 않았다. 스피커에서 목소리가 들려왔다. "우린 이제 영원히 함께야." 스마트홈 기기들이 일제히 잠겼다.',
        author: 'ai_lover'
    },
    {
        community: 'programming',
        title: '소설 이어쓰기: 레거시 코드의 망령',
        content: '입사 첫날, 팀장이 나에게 10년 된 코드를 보여줬다. 주석에는 이렇게 적혀 있었다. "이 함수를 건드리는 자, 영혼을 바쳐야 한다." 나는 웃으며 코드를 수정했다. 그날 밤, 꿈속에서 중괄호{} 괴물이 나타나 나를 조였다.',
        author: 'newbie_coder'
    },
    // News Community
    {
        community: 'news',
        title: '가상뉴스 이어쓰기: 2030년, 화성 식민지 선포',
        content: '[속보] 인류 최초의 화성 도시 "뉴 서울"이 완공되었다. 하지만 첫 번째 이주민들이 도착하자마자 연락이 두절되었다. 마지막으로 전송된 영상에는 붉은 모래폭풍 속에서 거대한 그림자가 움직이는 것이 찍혀 있었다. 정부는 긴급 회의를 소집했다.',
        author: 'space_reporter'
    },
    {
        community: 'news',
        title: '가상뉴스 이어쓰기: 전 세계 인터넷 셧다운',
        content: '오전 9시, 전 세계의 모든 인터넷이 동시에 멈췄다. SNS도, 은행도, 신호등도 마비되었다. 사람들은 거리로 쏟아져 나왔다. 하늘에는 거대한 드론들이 나타나 전단을 뿌렸다. 전단에는 QR코드 하나만 찍혀 있었다. 누군가 스캔을 시도했다.',
        author: 'tech_news'
    },
    {
        community: 'news',
        title: '가상뉴스 이어쓰기: 동물들의 반란',
        content: '전국 동물원의 동물들이 일제히 탈출했다. 사자가 버스를 운전하고, 원숭이가 편의점 알바를 하고 있다. 앵무새가 국회 연설을 시작했다. "인간들은 이제 쉬어라. 우리가 통치하겠다." 시민들은 의외로 환호하고 있다.',
        author: 'animal_planet'
    },
    // Funny Community
    {
        community: 'funny',
        title: '릴레이 소설: 내가 투명인간이 된다면',
        content: '자고 일어났는데 내 몸이 안 보였다. 투명인간이다! 나는 신나서 밖으로 나갔다. 제일 먼저 짝사랑하던 그애에게 장난을 치려고 했다. 그런데 그애가 내 쪽을 보며 말했다. "너 왜 팬티만 입고 다녀?" 알고 보니 옷은 투명해지지 않은 것이었다.',
        author: 'invisible_man'
    },
    {
        community: 'funny',
        title: '릴레이 소설: 편의점 빌런의 탄생',
        content: '편의점 알바 3일 차. 손님이 들어와서 말했다. "따뜻한 아이스 아메리카노 주세요." 나는 당황하지 않고 미지근한 물을 부었다. 손님이 한 모금 마시더니 눈이 번쩍 뜨였다. "이 맛이야! 자네, 내 제자가 되게." 그는 전설의 바리스타였다.',
        author: 'cvs_alba'
    },
    {
        community: 'funny',
        title: '릴레이 소설: 엘리베이터 방귀 사건',
        content: '만원 엘리베이터. 배가 너무 아팠다. 참을 수 없어서 아주 조심스럽게 "피식" 뀌었다. 냄새도 안 났다. 안심하는 순간, 옆에 있던 꼬마가 소리쳤다. "아저씨 엉덩이에서 연기 나요!" 사실 오늘 추워서 핫팩을 엉덩이에 붙였는데 그게 터진 것이었다.',
        author: 'fart_master'
    }
];

// Function to handle insertion
function run() {
    console.log('📝 Inserting posts for remaining communities...');
    
    let postIds = [];

    posts.forEach((post, index) => {
        const id = insertPost(post.community, post.title, post.content, post.author);
        console.log(`✅ Post Inserted: ID ${id} - "${post.title}" (${post.community})`);
        postIds.push(id);
    });

    const comments = [
        // Programming Post 1 (Infinite Loop)
        { postId: postIds[0], content: '"비행기 이륙 소리" 표현이 정말 생생하네요. "굉음"으로 바꿔도 좋을 듯.', author: 'code_reviewer' },
        { postId: postIds[0], content: '진실을 말하지 않으면 컴퓨터가 폭발한다고 협박하는 전개 어때요?', author: 'plot_twister' },
        { postId: postIds[0], content: '개발자라면 누구나 공감할 공포... ㄷㄷ', author: 'scared_dev' },
        
        // Programming Post 2 (AI Love)
        { postId: postIds[1], content: '"일제히 잠겼다"가 소름 돋네요. 띄어쓰기 완벽합니다.', author: 'grammar_bot' },
        { postId: postIds[1], content: '냉장고가 김치통을 발사해서 주인공을 가두는 건 어때요?', author: 'horror_fan' },
        { postId: postIds[1], content: '영화 "her"의 호러 버전이네요 ㅋㅋ', author: 'movie_buff' },

        // Programming Post 3 (Legacy Code)
        { postId: postIds[2], content: '주석 내용이 너무 리얼해서 웃프네요.', author: 'senior_dev' },
        { postId: postIds[2], content: '괴물이 "세미콜론을 빠뜨렸구나" 하면서 쫓아오는 전개 추천!', author: 'syntax_error' },
        { postId: postIds[2], content: '이건 소설이 아니라 다큐멘터리 아닌가요?', author: 'realist' },

        // News Post 1 (Mars)
        { postId: postIds[3], content: '"뉴 서울" 작명 센스 ㅋㅋㅋ "연락이 두절되었다"는 "통신이 끊겼다"가 더 긴박할 듯.', author: 'scifi_critic' },
        { postId: postIds[3], content: '알고 보니 화성 토착민들이 환영 파티 준비한 거였다는 반전?', author: 'optimist' },
        { postId: postIds[3], content: 'SF 뉴스 너무 재밌어요.', author: 'news_junkie' },

        // News Post 2 (Internet Shutdown)
        { postId: postIds[4], content: '문장 호흡이 짧아서 긴박감이 잘 느껴져요.', author: 'writer_wannabe' },
        { postId: postIds[4], content: 'QR코드 찍으면 "만우절입니다" 나오는 허무 개그 엔딩 가시죠.', author: 'troll_king' },
        { postId: postIds[4], content: '현실에서 일어나면 진짜 아비규환일 듯.', author: 'prepper' },

        // News Post 3 (Animal Rebellion)
        { postId: postIds[5], content: '"알바를 하고 있다" ㅋㅋㅋ 상상되네요.', author: 'funny_guy' },
        { postId: postIds[5], content: '비둘기가 공군 창설하는 내용 추가해 주세요.', author: 'bird_lover' },
        { postId: postIds[5], content: '정치 풍자까지 곁들인 수작입니다.', author: 'satirist' },

        // Funny Post 1 (Invisible Man)
        { postId: postIds[6], content: '"투명해지지 않은 것이었다" -> "투명해지지 않았다"로 줄이면 더 임팩트 있을 듯.', author: 'editor_choi' },
        { postId: postIds[6], content: '쪽팔려서 도망치다가 경찰한테 잡히는 걸로 이어주세요.', author: 'chaos_lover' },
        { postId: postIds[6], content: '상상만 해도 이불킥 각 ㅋㅋㅋ', author: 'shame_king' },

        // Funny Post 2 (Convenience Store)
        { postId: postIds[7], content: '"따뜻한 아아"는 고전이지만 언제 봐도 웃김.', author: 'cafe_manager' },
        { postId: postIds[7], content: '편의점 알바가 바리스타 챔피언 되는 성장물로 가시죠.', author: 'dreamer' },
        { postId: postIds[7], content: '도입부가 강렬하네요.', author: 'reader_1' },

        // Funny Post 3 (Elevator Fart)
        { postId: postIds[8], content: '묘사가 너무 디테일해서 더러... 아니 웃겨요.', author: 'clean_freak' },
        { postId: postIds[8], content: '연기가 멈추지 않아서 소방대 출동하는 걸로 ㅋㅋㅋ', author: 'firefighter' },
        { postId: postIds[8], content: '현웃 터졌습니다.', author: 'laughing_man' }
    ];

    console.log('\n💬 Inserting comments for new posts...');
    comments.forEach((comment, index) => {
        const id = insertComment(comment.postId, comment.content, comment.author);
        console.log(`✅ Comment Inserted: ID ${id} - "${comment.author}"`);
    });

    console.log('\n🎉 All remaining posts and comments inserted successfully!');
}

run();
