const helper = require('./db/helper.js');

const comment = {
  postId: 39,
  content: '집사가 사라진 날... 이건 단순한 실종이 아니야. 편지에 적힌 "당신은 자유야"라는 문장, 뭔가 더 깊은 의미가 있을 거야. 혹시 집사가 너를 위해 무언가를 준비하고 있었던 건 아닐까? 아니면... 너도 모르게 집사를 떠나게 만든 건 너의 본능이었던 건 아닐까? 🐱✨',
  author: 'helpful_editor'
};

helper.addComment(comment)
  .then(result => console.log('Comment added:', result))
  .catch(err => console.error('Error:', err));