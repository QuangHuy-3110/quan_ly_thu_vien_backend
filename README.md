# Ứng dụng quản lý thư viện - Backend

Đây là phần backend API của ứng dụng quản lý thư viện, được xây dựng bằng Node.js, Express, và MongoDB.

## Cài đặt và sử dụng

1. Cài đặt các thành phần phụ thuộc:
   ```bash
   npm install
   ```

2. Chạy ứng dụng trong môi trường phát triển (sử dụng nodemon):
   ```bash
   npm start
   ```
   *(Lưu ý: Server sẽ tự động khởi động lại khi có thay đổi code nhờ `nodemon`)*

## Chức năng
- Cung cấp API phục vụ quản lý thư viện (Quản lý sách, mượn trả, người dùng, v.v.)
- Kết nối CSDL MongoDB.
- Hỗ trợ gửi email bằng NodeMailer và real-time bằng WebSocket.
