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

  // Label bilangan kecil di atas garis
  ctx.fillStyle = color;
  ctx.font = "14px Arial";
  ctx.fillText(label, (xStart + xEnd)/2 - 10, yOffset - 12);
}

// Tambahkan panah/label untuk hasil di garis bilangan
function drawResultMarker(position, step, min) {
  const x = 50 + (position - min) * step;
  ctx.fillStyle = "green";
  ctx.font = "16px Arial";
  ctx.fillText("Hasil ↓", x - 15, 140);
}

// Animasi lompat-lompat karakter
function animateCharacter(start, end, char, step, min, callback) {
  let current = start;
  const increment = (end > start) ? 1 : -1;

  function jump() {
    drawNumberLine(viewMin, viewMax);

    // Jejak titik karakter
    for (let pos = start; (increment>0) ? pos<=current : pos>=current; pos+=increment) {
      const xTrail = 50 + (pos - min) * step;
      ctx.fillText(char, xTrail-8, 150); 
    }

    const x = 50 + (current - min) * step;
    ctx.fillText(char, x-8, 150);

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
  let num1 = parseInt(document.getElementById('num1').value);
  let num2 = parseInt(document.getElementById('num2').value);

  if (isNaN(num1) || isNaN(num2) || num1 < -25 || num1 > 25 || num2 < -25 || num2 > 25) {
    alert("Masukkan bilangan antara -25 hingga 25.");
    return;
  }

  // Jika bilangan kedua negatif, tampilkan dengan kurung
  let displayNum2 = (num2 < 0) ? `(${num2})` : num2;

  adjustView(num1, num2);
  const step = drawNumberLine(viewMin, viewMax);

  animateCharacter(0, num1, charRed, step, viewMin, () => {
    animateCharacter(num1, num1 - num2, charBlue, step, viewMin, () => {
      // Setelah animasi selesai, gambar garis putus-putus
      drawDashedLineWithLabel(0, num1, "red", step, viewMin, num1, 120);
      drawDashedLineWithLabel(num1, num1 - num2, "blue", step, viewMin, displayNum2, 90);

      // Hilangkan karakter setelah garis putus-putus muncul
      drawNumberLine(viewMin, viewMax);

      // Tampilkan hasil di garis
      drawResultMarker(num1 - num2, step, viewMin);

      // Tampilkan hasil di kotak menarik
      const resultDiv = document.getElementById('result');
      const hasil = num1 - num2;
      resultDiv.textContent = `${num1} - ${displayNum2} = ${hasil}`;
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
drawNumber
