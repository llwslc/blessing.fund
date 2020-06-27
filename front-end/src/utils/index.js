export const cutMiddle = (text = '', left = 4, right = 4) => {
  if (typeof text !== 'string') return '';

  text = text.trim();
  if (text.length <= left + right) return text;
  return `${text.substring(0, left)}...${text.substring(text.length, text.length - right)}`;
};
