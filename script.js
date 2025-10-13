const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');

let viewMin = -10;
let viewMax = 10;

// Karakter lucu
const charRed = "🐰"; // bilangan pertama
const charBlue = "🐱"; // bilangan kedua

function drawNumberLine(min = viewMin, max = viewMax) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Garis horizontal
  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(850, 150);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  const totalNumbers = max - min;
  const step = 800 / totalNumbers;

  // Skala dan bilangan
  ctx.font = "16px Arial";
  for (let i = min; i <= max; i++) {
    const x = 50 + (i - min) * step;
    ctx.beginPath();
    ctx.moveTo(x, 145);
    ctx.lineTo(x, 155);
    ctx.stroke();
    ctx.fillText(i, x - 5, 170);
  }

  return step;
}

// Garis putus-putus dengan label kecil di atas
function drawDashedLineWithLabel(start, end, color, step, min, label, yOffset) {
  const xStart = 50 + (start - min) * step;
  const xEnd = 50 + (end - min) * step;

  ctx.beginPath();
  ctx.setLineDash([5,5]);
  ctx.moveTo(xStart, yOffset);
  ctx.lineTo(xEnd, yOffset);
  ctx.strokeStyle
