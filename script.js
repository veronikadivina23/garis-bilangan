const MIN_VALUE = -25;
const MAX_VALUE = 25;
const PIXELS_PER_UNIT = 30; // 1 unit angka = 30px
const ORIGIN_LEFT = (0 - MIN_VALUE) * PIXELS_PER_UNIT; // Posisi Nol (0)

const numberLineDiv = document.getElementById('numberLine');
const hasilPerhitunganSpan = document.getElementById('hasilPerhitungan');

// Lebar total garis bilangan agar semua angka terlihat
const TOTAL_WIDTH = (MAX_VALUE - MIN_VALUE) * PIXELS_PER_UNIT + PIXELS_PER_UNIT; 
numberLineDiv.style.width = TOTAL_WIDTH + 'px';

// Fungsi untuk menggambar garis bilangan
function drawNumberLine() {
    numberLineDiv.innerHTML = ''; // Bersihkan garis bilangan yang lama

    // Membuat tanda dan label angka
    for (let i = MIN_VALUE; i <= MAX_VALUE; i++) {
        const position = (i - MIN_VALUE) * PIXELS_PER_UNIT;

        // Tanda (Tick)
        const tick = document.createElement('div');
        tick.className = 'tick-mark';
        tick.style.left = position + 'px';
        numberLineDiv.appendChild(tick);

        // Label Angka (Label)
        if (i % 5 === 0 || i === 1 || i === -1) { // Hanya tampilkan kelipatan 5 atau +/- 1 untuk kerapihan
            const label = document.createElement('div');
            label.className = 'tick-label';
            label.style.left = (position - 5) + 'px'; // Sesuaikan posisi untuk tengah
            label.textContent = i;
            numberLineDiv.appendChild(label);
        }
    }
}

// Fungsi utama untuk perhitungan dan visualisasi
function hitungPengurangan() {
    const a = parseInt(document.getElementById('bilangan1').value);
    const b = parseInt(document.getElementById('bilangan2').value);

    // Validasi range
    if (isNaN(a) || isNaN(b) || a < MIN_VALUE || a > MAX_VALUE || b < MIN_VALUE || b > MAX_VALUE) {
        alert('Masukkan bilangan bulat antara -25 dan 25.');
        return;
    }

    const hasil = a - b;
    hasilPerhitunganSpan.textContent = hasil;

    // Visualisasi
    visualizeMovement(a, b, hasil);
}

// Fungsi untuk visualisasi pergerakan di garis bilangan
function visualizeMovement(a, b, hasil) {
    // 1. Bersihkan panah lama (kecuali garis bilangan itu sendiri)
    document.querySelectorAll('.movement-arrow, .result-label').forEach(el => el.remove());

    // Hitung posisi awal dan akhir
    const startPos1 = ORIGIN_LEFT; // Selalu mulai dari Nol
    const endPos1 = ORIGIN_LEFT + a * PIXELS_PER_UNIT; // Berhenti di A

    // Posisi awal untuk langkah kedua
    const startPos2 = endPos1;
    const endPos2 = ORIGIN_LEFT + hasil * PIXELS_PER_UNIT; // Berhenti di Hasil (A-B)

    // --- Langkah 1: Pergerakan Bilangan Pertama (A) dari Nol ---
    // Arah pergerakan: Positif (kanan) atau Negatif (kiri)
    const arrow1 = createArrow(startPos1, endPos1, 'green', 60); // Warna Hijau untuk A, Top 60px

    // --- Langkah 2: Pergerakan Bilangan Kedua (-B) dari A ---
    // Pengurangan Bilangan Bulat: A - B sama dengan A + (-B)
    const arrow2 = createArrow(startPos2, endPos2, 'red', 30); // Warna Merah untuk -B, Top 30px

    // --- Hasil Akhir ---
    const resultLabel = document.createElement('div');
    resultLabel.className = 'result-label';
    resultLabel.textContent = hasil;
    resultLabel.style.left = (endPos2 - 10) + 'px'; // Posisikan label di atas hasil
    numberLineDiv.appendChild(resultLabel);

    // Atur scroll agar garis bilangan fokus ke area pergerakan
    scrollToResult(a, b, hasil);
}

// Fungsi pembantu untuk membuat elemen panah
function createArrow(start, end, color, topOffset) {
    const arrow = document.createElement('div');
    arrow.className = 'movement-arrow';
    arrow.style.backgroundColor = color;
    arrow.style.top = topOffset + 'px';

    if (end >= start) { // Bergerak ke kanan
        arrow.style.left = start + 'px';
        arrow.style.width = (end - start) + 'px';
    } else { // Bergerak ke kiri
        arrow.style.left = end + 'px';
        arrow.style.width = (start - end) + 'px';
    }

    // Tambahkan segitiga untuk ujung panah (Perlu CSS tambahan/pseudo-element)
    // Di sini hanya menambahkan garis
    numberLineDiv.appendChild(arrow);
    return arrow;
}

// Fungsi untuk mengatur posisi scroll agar panah terlihat
function scrollToResult(a, b, hasil) {
    const scrollContainer = document.querySelector('.number-line-container');
    const targetPos = ORIGIN_LEFT + Math.max(a, hasil) * PIXELS_PER_UNIT;
    // Scroll ke tengah-tengah garis bilangan, dekat dengan nol
    scrollContainer.scrollLeft = targetPos - scrollContainer.clientWidth / 2;
}

// Jalankan fungsi saat halaman dimuat
drawNumberLine();
hitungPengurangan(); // Panggil pertama kali untuk inisialisasi
