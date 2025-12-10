# Book-Nest
## BookNest
Nền tảng thương mại điện tử dành cho ebook, hỗ trợ nhiều vai trò người dùng (Customer, Seller, Admin) và tích hợp các mẫu thiết kế phần mềm như Facade, Factory Method, Singleton và Observer.

### Tính năng chính
- Đăng ký, đăng nhập, tự động phát hành JWT và lưu phiên bằng cookie an toàn.
- Quản lý hồ sơ cá nhân, cập nhật avatar thông qua Cloudinary.
- Cửa hàng có thể đăng sách mới, tải file/ảnh, gắn thể loại và thông báo tới người theo dõi.
- Người mua theo dõi shop, nhận thông báo sách mới và duyệt danh mục sách.
- Admin theo dõi toàn bộ người dùng, shop và hoạt động mua bán.

### Kiến trúc và công nghệ
- **Backend**: Node.js, Express, Prisma (MongoDB), Cloudinary SDK, JWT, bcrypt, cookie-parser.
- **Frontend**: React 19, Vite, React Router, Zustand, Tailwind CSS, DaisyUI, Axios.
- **Patterns**: Facade (xử lý luồng auth), Factory Method (khởi tạo user theo vai trò), Singleton (quản lý `ERole`), Observer (thông báo khi shop đăng sách mới).

### Cấu trúc thư mục
```text
BookNest/
├─ backend/          # API Express, Prisma client, services & patterns
├─ frontend/         # Ứng dụng React (Vite + Tailwind)
├─ prisma/           # Định nghĩa schema Prisma cho MongoDB
└─ package.json      # Script tiện ích dùng chung
```

### Yêu cầu hệ thống
- Node.js >= 18 và npm >= 10.
- Tài khoản MongoDB (chuỗi kết nối `mongodb+srv://...`).
- Tài khoản Cloudinary để lưu trữ ảnh/file sách.
- (Tuỳ chọn) Công cụ Prisma CLI: cài đặt thông qua `npm install`.

### Thiết lập môi trường
1. Clone dự án: `git clone https://github.com/<user>/Book-Nest.git`.
2. Cài đặt phụ thuộc:
	```powershell
	npm install --prefix backend
	npm install --prefix frontend
	npm install
	```
3. Khởi tạo Prisma client và đồng bộ schema tới MongoDB:
	```powershell
	npx prisma generate --schema prisma/schema.prisma
	npx prisma db push --schema prisma/schema.prisma
	```
4. Tạo file `backend/.env` và điền các biến sau (giữ bí mật, không commit lên Git):
	```ini
	DATABASE_URL=mongodb+srv://nhat292020:59vDJSAW98mUq0Vu@cluster0.vbxyrhh.mongodb.net/book_db?retryWrites=true&w=majority&appName=Cluster0

    PORT=3000

    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=dniwqlnvz
    CLOUDINARY_API_KEY=152756236268211
    CLOUDINARY_API_SECRET=16_J6_f3mswwYzL6lm7eunPD_3M
    NODE_ENV=development
	```

### Chạy ứng dụng ở môi trường development
Mở hai cửa sổ terminal (PowerShell):

```powershell
# Terminal 1: khởi động backend API
npm run dev --prefix backend

# Terminal 2: khởi động frontend Vite
npm run dev --prefix frontend
```

Frontend mặc định chạy tại `http://localhost:5173` và backend tại `http://localhost:3000`. Cấu hình `frontend/src/lib/axios.js` nếu cần thay đổi `baseURL`.

### Build & deploy
- Build frontend: `npm run build --prefix frontend` (kết quả tại `frontend/dist`).
- Chạy backend ở chế độ production: `npm run start --prefix backend` (phục vụ cả API và bundle frontend nếu `NODE_ENV=production`).

### Kiểm thử thủ công gợi ý
- Đăng ký tài khoản mới theo từng role và xác nhận JWT cookie được tạo.
- Seller đăng sách mới, kiểm tra file/ảnh được tải lên Cloudinary và người theo dõi nhận notification.
- Xác minh quyền truy cập khi truy cập API protected không có cookie.

