# � Diary Web App (Nhật ký tương tác)

Ứng dụng nhật ký web hiện đại mô phỏng một quyển sổ nhật ký dễ thương, sống động với ảnh, nhạc và hiệu ứng. Dự án dùng HTML/CSS/JS thuần, lưu trữ bằng `localStorage`.

## 🌟 Tính năng cái tiến

- **Đăng nhập an toàn**: mật khẩu mặc định `1234`.
- **Bìa sách mở**: hiển thị bìa, click mở vào màn hình nhật ký.
- **Trang nhật ký chính**:
  - 100 trang (hiển thị `Trang x/100`).
  - Ảnh trang (kéo thả file image để cập nhật).
  - Nhạc nền (kéo thả file audio để cập nhật, tự phát ngay).
  - Thanh nhạc (progress bar + thời lượng bài hát).
  - Chỉnh sửa text trực tiếp (gõ xong nhấn Lưu).
  - Thêm trang và điều hướng mũi tên trái/phải.
- **Hiệu ứng đẹp**:
  - Nền galaxy sao băng.
  - Gáy sách, giấy kẻ, hiệu ứng hover và động cho tất cả nút.

## 📦 Cấu trúc file

- `index.html`: giao diện chính.
- `style.css`: toàn bộ style, animation.
- `script.js`: logic điều hướng, drag/drop, audio, localStorage.
- `image-library/`: folder lưu dữ liệu ảnh (mô phỏng, tin cậy lưu bằng localStorage cốt lõi).
- `audio-library/`: folder lưu dữ liệu audio (mô phỏng) .

## ⚙️ Cách chạy

1. Mở `index.html` bằng trình duyệt.
2. Nhập `1234` và bấm đăng nhập.
3. Ở màn hình bìa, bấm vào sách để vào phần chính.
4. Dùng `+ Thêm trang`, kéo thả ảnh/nhạc vào vùng trang.
5. Dùng mũi tên trái/phải để chuyển trang.
6. Bấm `▶ Phát nhạc` / `⏸ Dừng nhạc` để điều khiển audio.

## 🔧 Điều chỉnh nhanh

- Đổi password: sửa `script.js` -> `const PASSWORD`.
- Điều chỉnh số trang: `const TOTAL_PAGES = 100`.
- Thay theme: `style.css`.

## 💡 Lưu trữ

- Dữ liệu trang nhật ký lưu trong `localStorage` key `interactiveWebDiaryPages`.
- Ảnh/nhạc lưu (mô phỏng) trong `localStorage` key `interactiveDiaryImageFolder` + `interactiveDiaryAudioFolder`.

## 🛠️ Nâng cấp tiếp theo

- Danh sách thư viện ảnh/nhạc kèm preview + xóa.
- Export/import JSON backup.
- Nhiều tài khoản người dùng.
