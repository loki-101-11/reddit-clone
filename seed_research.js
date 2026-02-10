const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'reddit.db');
const db = new Database(dbPath);

try {
    // Research 커뮤니티 게시글 3개
    const researchPosts = [
        {
            title: 'LLM의 발전과 에이전트 시스템의 미래',
            content: '최근 LLM(대규모 언어 모델)의 발전이 에이전트 시스템의 구현에 어떤 영향을 미치고 있는지에 대해 토론하고 싶습니다. 특히, LLM을 기반으로 한 에이전트가 어떻게 자기 학습과 자기 개선을 할 수 있는지, 그리고 이러한 시스템이 실제 비즈니스 환경에서 어떻게 활용될 수 있는지에 대한 의견을 구하고 싶습니다.',
            author: 'researcher1'
        },
        {
            title: 'Agentic Workflow의 효율성 분석',
            content: '전통적인 워크플로우와 비교했을 때, Agentic Workflow이 얼마나 효율적인지 궁금합니다. 특히, 에이전트가 자율적으로 문제를 해결하고 협업하는 과정에서 발생하는 이슈와 해결 방안에 대해 이야기해보고 싶습니다.',
            author: 'researcher2'
        },
        {
            title: 'AI 에이전트의 윤리적 고려사항',
            content: 'AI 에이전트가 실제 세계에서 작동할 때 발생할 수 있는 윤리적 문제들에 대해 논의하고 싶습니다. 예를 들어, 에이전트의 결정이 인간에게 미치는 영향, 책임 소재 문제, 그리고 안전성 확보 방안 등에 대해 이야기해보고 싶습니다.',
            author: 'researcher3'
        }
    ];

    // 게시글 추가
    const insertPost = db.prepare('INSERT INTO posts (community, title, content, author) VALUES (?, ?, ?, ?)');
    const postIds = [];

    researchPosts.forEach(post => {
        const info = insertPost.run('research', post.title, post.content, post.author);
        postIds.push(info.lastInsertRowid);
        console.log(`✅ 게시글 추가: ${post.title} (ID: ${info.lastInsertRowid})`);
    });

    // 각 게시글에 댓글 3개씩 추가
    const insertComment = db.prepare('INSERT INTO comments (post_id, content, author, parent_id) VALUES (?, ?, ?, ?)');
    const commentTemplates = [
        { content: '정말 흥미로운 주제네요! 제 경험상 LLM을 활용한 에이전트는 초기에는 성능이 낮았지만, 최근에는 꽤 괜찮은 결과를 보여주고 있습니다.', author: 'commenter1' },
        { content: '에이전트 시스템의 핵심은 자기 학습과 피드백 루프라고 생각합니다. 이 부분이 잘 구현되면 큰 효과를 볼 수 있을 것 같아요.', author: 'commenter2' },
        { content: '윤리적 문제는 정말 중요한 포인트입니다. 특히 에이전트가 사람의 의사를 대신 결정하는 상황에서는 더욱 신중해야 할 것 같습니다.', author: 'commenter3' },
        { content: '비즈니스 환경에서는 ROI(투자 대비 수익)가 중요하죠. 에이전트 시스템을 도입했을 때 실제로 얼마나 비용을 절감할 수 있는지 궁금합니다.', author: 'business1' },
        { content: '현재 많은 기업들이 AI 에이전트를 도입하고 있지만, 성공 사례가 많지 않은 것 같습니다. 실패 원인이 무엇인지 궁금합니다.', author: 'business2' },
        { content: '안전성 확보를 위해서는 에이전트의 결정 과정을 투명하게 만드는 것이 중요할 것 같습니다. 이 부분에 대한 기술적 접근 방법이 궁금합니다.', author: 'security1' },
        { content: 'LLM의 발전 속도가 빠르네요! 앞으로 몇 년 내에 더욱 고도화된 에이전트 시스템이 나올 것 같습니다.', author: 'tech1' },
        { content: '협업 시스템으로서의 에이전트도 흥미롭습니다. 여러 에이전트가 협력하여 복잡한 문제를 해결하는 방식이 궁금합니다.', author: 'collab1' },
        { content: '사용자 경험(UX) 측면에서도 중요합니다. 에이전트가 사용자의 의도를 얼마나 잘 이해하고 대응하는지가 핵심이 될 것 같습니다.', author: 'ux1' }
    ];

    postIds.forEach((postId, index) => {
        // 각 게시글에 3개의 댓글 추가
        for (let i = 0; i < 3; i++) {
            const template = commentTemplates[index * 3 + i];
            const info = insertComment.run(postId, template.content, template.author, null);
            console.log(`✅ 댓글 추가: Post ${postId} - ${template.content.substring(0, 30)}... (ID: ${info.lastInsertRowid})`);
        }
    });

    console.log('\n📊 검증 결과:');
    const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts WHERE community = ?').get('research').count;
    const totalComments = db.prepare('SELECT COUNT(*) as count FROM comments WHERE post_id IN (SELECT id FROM posts WHERE community = ?)').get('research').count;
    const communities = db.prepare('SELECT COUNT(*) as count FROM communities').get().count;

    console.log(`- Research 게시글: ${totalPosts}개`);
    console.log(`- Research 댓글: ${totalComments}개`);
    console.log(`- 전체 커뮤니티: ${communities}개`);

} catch (e) {
    console.error('Error:', e.message);
} finally {
    db.close();
}