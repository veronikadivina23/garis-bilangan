const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');

let viewMin = -10;
let viewMax = 10;

// Fungsi menggambar garis bilangan dan skala
function drawNumberLine(min = viewMin, max = viewMax) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Garis horizontal
  ctx.beginPath();
  ctx.moveTo(50, 60);
  ctx.lineTo(750, 60);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  const totalNumbers = max - min;
  const step = 700 / totalNumbers;

  for (let i = min; i <= max; i++) {
    const x = 50 + (i - min) * step;
    ctx.beginPath();
    ctx.moveTo(x, 55);
    ctx.lineTo(x, 65);
    ctx.stroke();

    ctx.fillText(i, x - 5, 80);
  }

  return step;
}

// Fungsi menggambar garis putus-putus + panah
function drawDashedLine(start, end, color, step, min) {
  const xStart = 50 + (start - min) * step;
  const xEnd = 50 + (end - min) * step;

  // Garis putus-putus
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(xStart, 60);
  ctx.lineTo(xEnd, 60);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.setLineDash([]);

  // Panah
  ctx.beginPath();
  ctx.moveTo(xEnd, 60);
  ctx.lineTo(xEnd - 5 * Math.sign(xEnd - xStart), 55);
  ctx.lineTo(xEnd - 5 * Math.sign(xEnd - xStart), 65);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// Fungsi animasi titik bergerak
function animateDot(start, end, color, step, min, callback) {
  let current = start;
  const increment = (end > start) ? 0.1 : -0.1;

  function animate() {
    drawNumberLine(viewMin, viewMax);
    ctx.beginPath();
    const x = 50 + (current - min) * step;
    ctx.arc(x, 60, 8, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    if ((increment > 0 && current < end) || (increment < 0 && current > end)) {
      current += increment;
      requestAnimationFrame(animate);
    } else {
      // Pastikan titik di akhir posisi
      current = end;
      ctx.beginPath();
      const xFinal = 50 + (current - min) * step;
      ctx.arc(xFinal, 60, 8, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      callback();
    }
  }

  animate();
}

// Fungsi untuk menyesuaikan view jika angka keluar dari tampilan
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
    alert("Masukkan angka antara -25 hingga 25.");
    return;
  }

  adjustView(num1, num2);
  const step = drawNumberLine(viewMin, viewMax);

  // Animasi titik merah → angka pertama
  animateDot(0, num1, "red", step, viewMin, () => {
    // Setelah titik merah selesai, titik biru → angka pertama - angka kedua
    animateDot(num1, num1 - num2, "blue", step, viewMin, () => {
      // Setelah selesai, gambar garis putus-putus + panah
      drawDashedLine(0, num1, "red", step, viewMin);
      drawDashedLine(num1, num1 - num2, "blue", step, viewMin);
    });
  });
});

document.getElementById('refreshBtn').addEventListener('click', () => {
  viewMin = -10;
  viewMax = 10;
  document.getElementById('num1').value = "";
  document.getElementById('num2').value = "";
  drawNumberLine();
});

// Inisialisasi awal
drawNumberLine();

