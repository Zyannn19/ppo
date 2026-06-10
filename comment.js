function generateCommentVariations(baseComment) {
  return [
    baseComment,
    `${baseComment} 🔥`,
    `${baseComment} ✨`,
    `${baseComment}!!`,
    `🔥 ${baseComment}`,
    `Nice! ${baseComment}`
  ];
}
function getRandomComment(baseComment) {
  const v = generateCommentVariations(baseComment);
  return v[Math.floor(Math.random() * v.length)];
}
module.exports = { getRandomComment };
