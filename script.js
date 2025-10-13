const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');

let viewMin = -10;
let viewMax = 10;

// Karakter lucu untuk animasi (emoji)
const charRed = "🐰"; // kelinci untuk bilangan pertama
const charBlue = "🐱"; // kucing untuk bilangan kedua

function drawNumberLine(min = viewMin, max = viewMax) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Garis horizontal
  ctx.beginPath();
  ctx.moveTo(50, 120);
  ctx.lineTo(850, 120);
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
    ctx.moveTo(x, 115);
    ctx.lineTo(x, 125);
    ctx.stroke();
    ctx.fillText(i, x - 5, 140);
  }

  return step;
}

// Garis putus-putus dengan label di atas
function drawDashedLineWithLabel(start, end, color, step, min, label, yOffset=90) {
  const xStart = 50 + (start - min) * step;
  const xEnd = 50 + (end - min) * step;

  ctx.beginPath();
  ctx.setLineDash([5,5]);
  ctx.moveTo(xStart, yOffset);
  ctx.lineTo(xEnd, yOffset);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.setLineDash([]);

  // Panah
  ctx.beginPath();
  ctx.moveTo(xEnd, yOffset);
  ctx.lineTo(xEnd - 5 * Math.sign(xEnd - xStart), yOffset - 5);
  ctx.lineTo(xEnd - 5 * Math.sign(xEnd - xStart), yOffset + 5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Label bilangan di atas
  ctx.fillStyle = color;
  ctx.font = "18px Arial";
  ctx.fillText(label, (xStart + xEnd)/2 - 10, yOffset - 15);
}

// Animasi lompat-lompat karakter
function animateCharacter(start, end, char, step, min, callback) {
  let current = start;
  const increment = (end > start) ? 1 : -1;

  function jump() {
    drawNumberLine(viewMin, viewMax);

    // Jejak titik karakter sebelumnya
    for (let pos = start; (increment>0) ? pos<=current : pos>=current; pos+=increment) {
      const xTrail = 50 + (pos - min) * step;
      ctx.fillText(char, xTrail-8, 115); 
    }

    // Titik karakter sekarang
    const x = 50 + (current - min) * step;
    ctx.fillText(char, x-8, 115);

    if (current !== end) {
      current += increment;
      setTimeout(jump, 300);
    } else {
      callback();
    }
  }

  jump();
}

// Sesuaikan view
function adjustView(num1, num2) {
  let minVisible = Math.min(0, num1, num1 - num2);
  let maxVisible = Math.max(0, num1, num1 - num2);

  if (minVisible < viewMin || maxVisible > viewMax) {
    viewMin = minVisible - 5;
    viewMax = maxVisible + 5;
  }
}

document.getElementById('startBtn').addEventListener('click', () => {
  const num1 = parseInt(document.getElementById('num1').value);
  const num2 = parseInt(document.getElementById('num2').value);

  if (isNaN(num1) || isNaN(num2) || num1 < -25 || num1 > 25 || num2 < -25 || num2 > 25) {
    alert("Masukkan bilangan antara -25 hingga 25.");
    return;
  }

  adjustView(num1, num2);
  const step = drawNumberLine(viewMin, viewMax);

  animateCharacter(0, num1, charRed, step, viewMin, () => {
    animateCharacter(num1, num1 - num2, charBlue, step, viewMin, () => {
      drawDashedLineWithLabel(0, num1, "red", step, viewMin, num1, 90);
      drawDashedLineWithLabel(num1, num1 - num2, "blue", step, viewMin, num2, 70);

      const resultDiv = document.getElementById('result');
      const hasil = num1 - num2;
      resultDiv.textContent = `${num1} - ${num2} = ${hasil}`;
    });
  });
});

document.getElementById('refreshBtn').addEventListener('click', () => {
  viewMin = -10;
  viewMax = 10;
  document.getElementById('num1').value = "";
  document.getElementById('num2').value = "";
  document.getElementById('result').textContent = "";
  drawNumberLine();
});

// Inisialisasi
drawNumberLine();
