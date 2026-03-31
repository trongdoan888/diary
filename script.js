// DỮ LIỆU MẪU NHẬT KÝ KHỔNG LỒ
const defaultDiaryPages = [
    {
        id: 1,
        image: "assets/img/bubu_dudu_concept.png", // Bạn có thể thay bằng GIF động thực tế
        message: "Hôm nay hai đứa cùng nhau vẽ tranh, Bubu vẽ trái tim thật đẹp. Tự hào về bản thân vì đã luôn cố gắng.",
        music: "assets/music/music_1.mp3"
    },
    {
        id: 2,
        image: "assets/img/bubu_dudu_concept.png", 
        message: "Step 1: Gắn Thẻ... Hãy ghi lại kỷ niệm mới của bạn. Quyển nhật ký khổng lồ này thật tuyệt!",
        music: "assets/music/music_1.mp3"
    }
];

// Khôi phục từ localStorage hoặc sử dụng mặc định
let diaryPages = JSON.parse(localStorage.getItem('bubuDuduDiary')) || defaultDiaryPages;
let currentPageIndex = 0;

// Lấy các phần tử DOM
const pageImage = document.getElementById('page-image');
const pageMessageDisplay = document.getElementById('page-message-display');
const pageNumberLeft = document.getElementById('page-number-display-left');
const pageNumberRight = document.getElementById('page-number-display-right');
const editBtn = document.getElementById('edit-btn');
const editTextarea = document.getElementById('edit-textarea');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const addPageBtn = document.getElementById('add-page-btn');

// Phần tử thanh âm nhạc
const pageAudio = document.getElementById('page-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressContainer = document.querySelector('.progress-container');
const progressFill = document.getElementById('progress-fill');
const progressSeeker = document.getElementById('progress-seeker');

// HÀM HIỂN THỊ TRANG CHÍNH (Updated)
function renderPage(index) {
    if (diaryPages.length === 0) {
        pageImage.src = "assets/img/bubu_dudu_concept.png";
        pageMessageDisplay.textContent = "Chưa có trang nhật ký nào. Nhấn Thêm trang mới nhé!";
        pageNumberLeft.textContent = "";
        pageNumberRight.textContent = "";
        pageAudio.src = "";
        return;
    }

    const page = diaryPages[index];
    
    // Cập nhật nội dung
    pageImage.src = page.image;
    pageMessageDisplay.textContent = page.message;
    pageNumberLeft.textContent = `Page ${index + 1}`;
    pageNumberRight.textContent = `Page ${index + 2}`; // Konzeptually next page
    
    // Đảm bảo textarea chỉnh sửa được reset
    editTextarea.value = page.message;
    pageMessageDisplay.classList.remove('hidden');
    editTextarea.classList.add('hidden');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';

    // XỬ LÝ ÂM NHẠC KHI LẬT TRANG
    pageAudio.pause(); 
    pageAudio.currentTime = 0; 
    pageAudio.src = page.music; 
    pageAudio.load(); 

    updatePlayPauseIcon(false);
    updateProgressBar(0);
}

// === LOGIC THANH ÂM NHẠC TÙY CHỈNH ===

// Play/Pause
playPauseBtn.addEventListener('click', () => {
    if (diaryPages.length === 0 || !pageAudio.src) return;

    if (pageAudio.paused) {
        pageAudio.play()
            .then(() => updatePlayPauseIcon(true))
            .catch(error => console.error("Lỗi phát nhạc:", error));
    } else {
        pageAudio.pause();
        updatePlayPauseIcon(false);
    }
});

function updatePlayPauseIcon(isPlaying) {
    playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-heart"></i>';
    if (isPlaying) {
        playPauseBtn.classList.add('playing');
    } else {
        playPauseBtn.classList.remove('playing');
    }
}

// Cập nhật thanh progress
pageAudio.addEventListener('timeupdate', () => {
    if (!pageAudio.duration) return;
    const percentage = (pageAudio.currentTime / pageAudio.duration) * 100;
    updateProgressBar(percentage);
});

function updateProgressBar(percentage) {
    progressFill.style.width = `${percentage}%`;
    progressSeeker.style.left = `${percentage}%`;
}

// Logic khi kéo thanh progress
progressContainer.addEventListener('click', (e) => {
    if (!pageAudio.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    pageAudio.currentTime = percentage * pageAudio.duration;
});

// === LOGIC ĐIỀU HƯỚNG & CHỈNH SỬA ===

prevBtn.addEventListener('click', () => {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        renderPage(currentPageIndex);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPageIndex < diaryPages.length - 1) {
        currentPageIndex++;
        renderPage(currentPageIndex);
    }
});

editBtn.addEventListener('click', () => {
    if (diaryPages.length === 0) return;

    const isEditing = !editTextarea.classList.contains('hidden');
    
    if (isEditing) {
        const newMessage = editTextarea.value.trim();
        if (newMessage !== "") {
            diaryPages[currentPageIndex].message = newMessage;
            localStorage.setItem('bubuDuduDiary', JSON.stringify(diaryPages));
            pageMessageDisplay.textContent = newMessage;
        }
        pageMessageDisplay.classList.remove('hidden');
        editTextarea.classList.add('hidden');
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';
    } else {
        editTextarea.value = diaryPages[currentPageIndex].message;
        pageMessageDisplay.classList.add('hidden');
        editTextarea.classList.remove('hidden');
        editBtn.innerHTML = '<i class="fas fa-save"></i> Lưu trang này';
        editTextarea.focus();
    }
});

addPageBtn.addEventListener('click', () => {
    const defaultPage = {
        id: Date.now(),
        image: "assets/img/bubu_dudu_concept.png", // conceptual placeholder
        message: "Kỷ niệm mới của bạn. Quyển nhật ký này thật tuyệt!",
        music: "assets/music/music_1.mp3",
    };
    diaryPages.push(defaultPage);
    localStorage.setItem('bubuDuduDiary', JSON.stringify(diaryPages));
    currentPageIndex = diaryPages.length - 1;
    renderPage(currentPageIndex);
});

// Khởi tạo trang đầu tiên
renderPage(currentPageIndex);