# 📸 Explore Gallery — Next.js App

Explore Gallery là ứng dụng web xây dựng bằng [Next.js](https://nextjs.org), hỗ trợ tìm kiếm, lọc, sắp xếp, tạo item mới, và chuyển đổi giữa chế độ sáng/tối. Dự án sử dụng App Router, Tailwind CSS, và có cấu trúc hiện đại, dễ mở rộng.

---

## 🚀 Khởi động dự án

### 1. Cài đặt dependencies

```bash
npm install

2. Chạy server phát triển
npm run dev
Truy cập http://localhost:3000 để xem ứng dụng.

3. Unit test
Dự án sử dụng Jest và React Testing Library.
chạy: npx jest

4. Tính năng chính
Search: Tìm kiếm theo tiêu đề ảnh
Filter: Lọc theo danh mục (Nature, City, People…)
Sort: Sắp xếp theo lượt thích hoặc thời gian tạo
Infinite Scroll: Tải thêm ảnh khi cuộn xuống
Create Item: Tạo ảnh mới và lưu vào localStorage

5. framework UI sử dụng
Công nghệ:
Next.js (App Router): Framework React hiện đại, hỗ trợ routing, SSR, API routes
Tailwind CSS: Thư viện CSS tiện dụng, hỗ trợ dark mode qua class dark:
React: Thư viện UI chính, dùng cho component và state
Jest + React: Testing Library	

6. Demo: https://explore-gallery-kappa.vercel.app/