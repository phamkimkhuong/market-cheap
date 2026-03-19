# 📘 Hướng dẫn tích hợp & Quản trị Appwrite với MCP

Tài liệu này tổng hợp các kiến thức và thiết lập quan trọng trong quá trình phát triển dự án Next.js kết hợp Appwrite.

## 2. Hệ thống MCP (Model Context Protocol)

Việc tích hợp MCP giúp trợ lý AI có thể trực tiếp thao tác (Tạo User, Database, Table...) trên Appwrite Console của bạn.

### Cấu hình `mcp_config.json`:
Bạn có thể tìm thấy tệp này tại đường dẫn: `c:\Users\phamk\.gemini\antigravity\mcp_config.json`.

### Các Nhóm chức năng (Flags) khả dụng:

Để tối ưu số lượng câu lệnh (tránh vượt giới hạn 111 tool), bạn nên bật/tắt các cờ sau tùy theo nhu cầu:

| Cờ (Flag) | Chức năng | Nên dùng khi... |
| :--- | :--- | :--- |
| **`--users`** | Quản lý Users, Teams, Roles. | Cần tạo/quản lý tài khoản người dùng. |
| **`--tablesdb`** | Quản lý Databases, Tables, Rows. | Cần thiết kế cấu trúc dữ liệu, lưu dữ liệu. |
| **`--teams`** | Quản lý Đội nhóm, Thành viên. | Cần tạo Group, phân quyền nhóm. |
| **`--storage`** | Quản lý File Buckets. | Cần tải lên/xuống hình ảnh, tài liệu. |
| **`--functions`** | Quản lý Serverless Functions. | Cần viết logic xử lý phía server. |
| **`--messaging`** | Gửi Email, SMS, Push. | Cần gửi thông báo cho người dùng. |

### Các tính năng cụ thể khi bật cờ `--users`:

Khi có quyền truy cập này, trợ lý AI (tôi) có thể thực hiện thay bạn:
- **Quản lý User:** Tạo mới, cập nhật tên/email/mật khẩu, xóa người dùng.
- **Phân quyền (Roles/Labels):** Gán các nhãn (labels) như `admin`, `premium` để phân tầng quyền truy cập.
- **Bảo mật (MFA):** Bật/Tắt xác thực 2 yếu tố, tạo mã khôi phục cho người dùng.
- **Kiểm soát phiên (Sessions):** Kiểm tra thiết bị đăng nhập, địa chỉ IP và lịch sử hoạt động (Logs).
- **Targeting:** Thiết lập mục tiêu gửi thông báo (Email/SMS).

---

---

## 3. Các bước Publish Production

1.  **Backend (Appwrite):** Sử dụng **Appwrite Cloud** (nhanh) hoặc **Self-hosted** trên VPS via Docker (kiểm soát hoàn toàn).
2.  **Frontend:** Host trên **Vercel**, **Netlify** hoặc sử dụng trực tiếp tính năng **Appwrite Sites**.
3.  **Security:** Luôn thêm tên miền production vào **Appwrite Console > Settings > Platforms** để tránh lỗi CORS.

---

## 💡 Mẹo nhỏ:
Nếu bạn gặp lỗi `TypeError: Cannot read properties of undefined (reading 'startsWith')`, hãy kiểm tra xem tệp `.env` đã được tạo chưa hay mới chỉ có tệp `.env.example`.
