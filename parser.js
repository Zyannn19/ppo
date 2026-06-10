function parseHashtagCommand(text) {
  const cleaned = text.trim();

  const regex = /^\/hashtag\s+(.+?)\|(.+?)\|(\d+)$/i;
  const match = cleaned.match(regex);

  if (!match) return null;

  return {
    tag: match[1].trim(),
    comment: match[2].trim(),
    jumlah: parseInt(match[3], 10),
  };
}
