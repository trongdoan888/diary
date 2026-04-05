// DỮ LIỆU MẪU (Có Lyrics)
const defaultDiaryPages = [
    {
        id: 1,
        image: "assets/img/bubu_dudu_concept.png", 
        message: "Hôm nay hai đứa cùng nhau vẽ tranh, Bubu vẽ trái tim thật đẹp. Tự hào về bản thân vì đã luôn cố gắng.",
        music: "assets/music/music_1.mp3",
        lyrics: "♪ Từng nhịp đập con tim...\n♪ Bubu và Dudu mãi bên nhau."
    },
    {
        id: 2,
        image: "assets/img/bubu_dudu_concept.png", 
        message: "Step 1: Gắn Thẻ... Hãy ghi lại kỷ niệm mới của bạn. Quyển nhật ký khổng lồ này thật tuyệt!",
        music: "assets/music/music_1.mp3",
        lyrics: "♪ La la la...\n♪ Một ngày mới nắng lên."
    }
];

// Khôi phục từ localStorage
let diaryPages = JSON.parse(localStorage.getItem('bubuDuduDiary')) || defaultDiaryPages;
let currentPageIndex = 0;

// Lấy DOM
const pageImage = document.getElementById('page-image');
const pageMessageDisplay = document.getElementById('page-message-display');
const pageLyricsDisplay = document.getElementById('page-lyrics-display');
const pageNumberLeft = document.getElementById('page-number-display-left');
const pageNumberRight = document.getElementById('page-number-display-right');

const editBtn = document.getElementById('edit-btn');
const editTextarea = document.getElementById('edit-textarea');
const editImageUrl = document.getElementById('edit-image-url');
const editLyrics = document.getElementById('edit-lyrics');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const addPageBtn = document.getElementById('add-page-btn');

const pageAudio = document.getElementById('page-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressContainer = document.querySelector('.progress-container');
const progressFill = document.getElementById('progress-fill');
const progressSeeker = document.getElementById('progress-seeker');

const imageDropZone = document.getElementById('image-drop-zone');
const musicDropZone = document.getElementById('music-drop-zone');

// HÀM HIỂN THỊ
function renderPage(index) {
    if (diaryPages.length === 0) {
        pageImage.src = "assets/img/bubu_dudu_concept.png";
        pageMessageDisplay.textContent = "Chưa có trang nhật ký nào. Nhấn Thêm trang mới nhé!";
        pageLyricsDisplay.textContent = "";
        pageNumberLeft.textContent = "";
        pageNumberRight.textContent = "";
        pageAudio.src = "";
        return;
    }

    const page = diaryPages[index];
    
    pageImage.src = page.image || "assets/img/bubu_dudu_placeholder.png";
    pageMessageDisplay.textContent = page.message;
    pageLyricsDisplay.textContent = page.lyrics || "♪ Chưa có lời bài hát ♪";
    
    pageNumberLeft.textContent = `Page ${index * 2 + 1}`;
    pageNumberRight.textContent = `Page ${index * 2 + 2}`;
    
    editTextarea.value = page.message;
    editImageUrl.value = page.image || "";
    editLyrics.value = page.lyrics || "";

    // Chế độ XEM
    pageMessageDisplay.classList.remove('hidden');
    editTextarea.classList.add('hidden');
    pageLyricsDisplay.classList.remove('hidden');
    editLyrics.classList.add('hidden');
    editImageUrl.classList.add('hidden');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';

    // Nhạc
    pageAudio.pause(); 
    pageAudio.currentTime = 0; 
    pageAudio.src = page.music || ""; 
    if(pageAudio.src) pageAudio.load(); 

    updatePlayPauseIcon(false);
    updateProgressBar(0);
}

// LOGIC ÂM NHẠC
playPauseBtn.addEventListener('click', () => {
    if (diaryPages.length === 0 || !pageAudio.src) return;
    if (pageAudio.paused) {
        pageAudio.play().then(() => updatePlayPauseIcon(true)).catch(e => console.error(e));
    } else {
        pageAudio.pause();
        updatePlayPauseIcon(false);
    }
});

function updatePlayPauseIcon(isPlaying) {
    playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-heart"></i>';
    if (isPlaying) playPauseBtn.classList.add('playing');
    else playPauseBtn.classList.remove('playing');
}

pageAudio.addEventListener('timeupdate', () => {
    if (!pageAudio.duration) return;
    updateProgressBar((pageAudio.currentTime / pageAudio.duration) * 100);
});

progressContainer.addEventListener('click', (e) => {
    if (!pageAudio.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    pageAudio.currentTime = ((e.clientX - rect.left) / rect.width) * pageAudio.duration;
});

// ĐIỀU HƯỚNG
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

// CHỈNH SỬA & LƯU
editBtn.addEventListener('click', () => {
    if (diaryPages.length === 0) return;

    const isEditing = !editTextarea.classList.contains('hidden');
    
    if (isEditing) {
        diaryPages[currentPageIndex].message = editTextarea.value.trim();
        diaryPages[currentPageIndex].image = editImageUrl.value.trim();
        diaryPages[currentPageIndex].lyrics = editLyrics.value.trim();
        
        try {
            localStorage.setItem('bubuDuduDiary', JSON.stringify(diaryPages));
        } catch (err) {
            alert("Lỗi: Dữ liệu quá lớn để lưu. (Trình duyệt giới hạn 5MB).");
        }
        renderPage(currentPageIndex); 
    } else {
        pageMessageDisplay.classList.add('hidden');
        editTextarea.classList.remove('hidden');
        pageLyricsDisplay.classList.add('hidden');
        editLyrics.classList.remove('hidden');
        editImageUrl.classList.remove('hidden'); 
        
        editBtn.innerHTML = '<i class="fas fa-save"></i> Lưu lại';
        editTextarea.focus();
    }
});

addPageBtn.addEventListener('click', () => {
    const defaultPage = {
        id: Date.now(),
        image: "assets/img/bubu_dudu_concept.png", 
        message: "Kỷ niệm mới của bạn...",
        music: "assets/music/music_1.mp3",
        lyrics: "♪ Nhập lời bài hát vào đây..."
    };
    diaryPages.push(defaultPage);
    localStorage.setItem('bubuDuduDiary', JSON.stringify(diaryPages));
    currentPageIndex = diaryPages.length - 1;
    renderPage(currentPageIndex);
});

// ==========================================
// DRAG & DROP FILE ẢNH VÀ NHẠC
// ==========================================
if (imageDropZone && musicDropZone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        imageDropZone.addEventListener(eventName, preventDefaults, false);
        musicDropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }

    ['dragenter', 'dragover'].forEach(eventName => {
        imageDropZone.addEventListener(eventName, () => imageDropZone.classList.add('drag-over'), false);
        musicDropZone.addEventListener(eventName, () => musicDropZone.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        imageDropZone.addEventListener(eventName, () => imageDropZone.classList.remove('drag-over'), false);
        musicDropZone.addEventListener(eventName, () => musicDropZone.classList.remove('drag-over'), false);
    });

    // XỬ LÝ ẢNH
    imageDropZone.addEventListener('drop', (e) => {
        if (diaryPages.length === 0) return;
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Data = event.target.result;
                pageImage.src = base64Data;
                if (!editImageUrl.classList.contains('hidden')) editImageUrl.value = base64Data;
                
                diaryPages[currentPageIndex].image = base64Data;
                try { localStorage.setItem('bubuDuduDiary', JSON.stringify(diaryPages)); } 
                catch (err) { alert("Lỗi: File ảnh quá lớn (vượt quá 5MB)."); }
            };
            reader.readAsDataURL(file);
        }
    });

    // XỬ LÝ NHẠC
    musicDropZone.addEventListener('drop', (e) => {
        if (diaryPages.length === 0) return;
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Audio = event.target.result;
                pageAudio.src = base64Audio;
                pageAudio.load();
                diaryPages[currentPageIndex].music = base64Audio;
                try { localStorage.setItem('bubuDuduDiary', JSON.stringify(diaryPages)); } 
                catch (err) { console.warn("Nhạc quá lớn để lưu."); }
            };
            reader.readAsDataURL(file);

            if (window.jsmediatags) {
                window.jsmediatags.read(file, {
                    onSuccess: function(tag) {
                        let extractedLyrics = "";
                        if (tag.tags.lyrics) extractedLyrics = tag.tags.lyrics.lyrics;
                        else if (tag.tags.USLT) extractedLyrics = tag.tags.USLT.text;
                        
                        if (extractedLyrics) {
                            pageLyricsDisplay.textContent = extractedLyrics;
                            if (!editLyrics.classList.contains('hidden')) editLyrics.value = extractedLyrics;
                            diaryPages[currentPageIndex].lyrics = extractedLyrics;
                            try { localStorage.setItem('bubuDuduDiary', JSON.stringify(diaryPages)); } catch(err) {}
                            
                            playPauseBtn.style.color = '#10b981';
                            setTimeout(() => playPauseBtn.style.color = '', 1500);
                        } else {
                            alert("File nhạc này không có gắn sẵn lời bài hát.");
                        }
                    },
                    onError: function(error) { console.log(error); }
                });
            }
        }
    });
}

// KHỞI ĐỘNG
renderPage(currentPageIndex);