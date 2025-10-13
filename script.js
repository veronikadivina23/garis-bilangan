const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');

let viewMin = -10; // tampilan awal
let viewMax = 10;

// Gambar garis bilangan
function drawNumberLine(min = viewMin, max = viewMax) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(850, 150);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  const totalNumbers = max - min;
  const step = 800 / totalNumbers;

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

// Garis putus-putus dengan label
function drawDashedLineWithLabel(start, end, color, step, min, label, yOffset) {
  const xStart = 50 + (start - min) * step;
  const xEnd = 50 + (end - min) * step;

  ctx.beginPath();
  ctx.setLineDash([5,5]);
  ctx.moveTo(xStart, yOffset);
  ctx.lineTo(xEnd, yOffset);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
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

  // Label mepet
  ctx.fillStyle = color;
  ctx.font = "12px Arial";
  ctx.fillText(label, (xStart + xEnd)/2 - 6, yOffset - 5);
}

// Animasi bundaran kecil per langkah
function animateSteps(start, end, color, step, min, callback) {
  let current = start;
  const increment = (end > start) ? 1 : -1;

  function stepAnimation() {
    drawNumberLine(viewMin, viewMax);

    for (let pos = start; (increment>0) ? pos<=current : pos>=current; pos+=increment) {
      const xTrail = 50 + (pos - min) * step;
      ctx.beginPath();
      ctx.arc(xTrail, 150, 3, 0, 2*Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }

    if (current !== end) {
      current += increment;
      setTimeout(stepAnimation, 200);
    } else {
      callback();
    }
  }

  stepAnimation();
}

// Bundaran hijau hasil
function drawResultCircle(position, step, min) {
  const x = 50 + (position - min) * step;
  ctx.beginPath();
  ctx.arc(x, 150, 5, 0, 2*Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();
}

// Sesuaikan view agar angka selalu terlihat
function adjustView(num1, num2) {
  const result = num1 - num2;
  let minVisible = Math.min(-10, num1, result) - 2;
  let maxVisible = Math.max(10, num1, result) + 2;

  viewMin = minVisible;
  viewMax = maxVisible;
}

document.getElementById('startBtn').addEventListener('click', () => {
  let num1 = parseInt(document.getElementById('num1').value);
  let num2 = parseInt(document.getElementById('num2').value);

  if (isNaN(num1) || isNaN(num2) || num1 < -15 || num1 > 15 || num2 < -15 || num2 > 15) {
    alert("Masukkan bilangan antara -15 hingga 15.");
    return;
  }

  let displayNum2 = (num2 < 0) ? `(${num2})` : num2;

  adjustView(num1, num2);
  const step = drawNumberLine(viewMin, viewMax);

  animateSteps(0, num1, "red", step, viewMin, () => {
    animateSteps(num1, num1 - num2, "blue", step, viewMin, () => {
      drawDashedLineWithLabel(0, num1, "red", step, viewMin, num1, 135);
      drawDashedLineWithLabel(num1, num1 - num2, "blue", step, viewMin, displayNum2, 110);

      drawResultCircle(num1 - num2, step, viewMin);

      const resultDiv = document.getElementById('result');
      resultDiv.textContent = `${num1} - ${displayNum2} = ${num1 - num2}`;
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

drawNumberLine();
