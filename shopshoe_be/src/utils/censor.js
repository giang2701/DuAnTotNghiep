// utils/censor.js
export const censorComment = (comment) => {
  const forbiddenWords = ["bậy bạ", "đéo", "xấu", "cứt", "ngu", "điên"];
  let censoredComment = comment;

  forbiddenWords.forEach((word) => {
    const regex = new RegExp(word, "gi");
    censoredComment = censoredComment.replace(regex, "***");
  });

  return censoredComment;
};
