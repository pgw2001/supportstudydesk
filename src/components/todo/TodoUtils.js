export const TODO_SEED = 54321;

let sharedCanvas = null;
let sharedContext = null;

export const getLineCount = (text) => {
  if (!text) return 1;
  const maxWidth = 245; 
  if (!sharedCanvas) {
    sharedCanvas = document.createElement("canvas");
    sharedContext = sharedCanvas.getContext("2d");
  }
  sharedContext.font = "23.4px 'Comic Sans MS', cursive"; 
  
  const cleanText = text.replace(/\n/g, "");
  let lines = 1;
  let currentLineWidth = 0;

  for (let i = 0; i < cleanText.length; i++) {
    const charWidth = sharedContext.measureText(cleanText[i]).width;
    if (currentLineWidth + charWidth > maxWidth) {
      lines++;
      currentLineWidth = charWidth;
    } else {
      currentLineWidth += charWidth;
    }
  }
  return lines;
};