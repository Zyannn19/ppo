function parseHashtagCommand(text) {
  const regex = /^\/hashtag\s+(.+?)\|(.+?)\|(\d+)$/;
  const match = text.match(regex);
  if (!match) return null;
  return {
    tag: match[1].trim(),
    comment: match[2].trim(),
    jumlah: parseInt(match[3], 10),
  };
}
module.exports = { parseHashtagCommand };
