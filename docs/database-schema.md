# Appwrite Marketplace Database Schema

Tài liệu này mô tả chi tiết cấu trúc các bảng (Collections/Tables) trong Database `marketplace` phục vụ dự án Sàn Thương mại Điện tử.

**Database ID**: `marketplace`

---

## 1. Table: `products` (Sản phẩm)
Quản lý thông tin chi tiết các sản phẩm được bày bán trên sàn.

| Cột (Key) | Kiểu dữ liệu | Bắt buộc | Mặc định | Ghi chú |
| :--- | :--- | :---: | :---: | :--- |
| `shop_id` | `varchar(36)` | ✅ | - | Liên kết với ID của gian hàng (`shops`) |
| `category_id` | `varchar(36)` | ✅ | - | Liên kết với ID danh mục (`categories`) |
| `name` | `varchar(255)` | ✅ | - | Tên hiển thị của sản phẩm |
| `description` | `longtext` | ❌ | - | Mô tả chi tiết (không giới hạn độ dài) |
| `price` | `integer` | ✅ | - | Giá bán (Đơn vị nhỏ nhất, ví dụ: VNĐ) |
| `stock` | `integer` | ✅ | `0` | Số lượng tồn kho hiện tại |
| `images` | `varchar(255)[]`| ❌ | - | Mảng chứa các File ID ảnh sản phẩm |
| `attributes` | `longtext` | ❌ | - | Lưu cấu trúc JSON cho màu sắc, kích cỡ... |

---

## 2. Table: `shops` (Gian hàng) - *Planned*
Mỗi người bán (Seller) sẽ sở hữu 1 gian hàng.

| Cột (Key) | Kiểu dữ liệu | Bắt buộc | Ghi chú |
| :--- | :--- | :---: | :--- |
| `owner_id` | `varchar(36)` | ✅ | ID của người dùng sở hữu Shop |
| `name` | `varchar(255)` | ✅ | Tên cửa hàng |
| `logo_id` | `varchar(36)` | ❌ | ID ảnh logo trong Storage |
| `description` | `text` | ❌ | Giới thiệu gian hàng |
| `status` | `boolean` | ✅ | `true` (Hoạt động) / `false` (Bị khóa) |

---

## 3. Table: `categories` (Danh mục) - *Planned*
Hệ thống phân cấp sản phẩm.

| Cột (Key) | Kiểu dữ liệu | Bắt buộc | Ghi chú |
| :--- | :--- | :---: | :--- |
| `name` | `varchar(100)` | ✅ | Tên danh mục |
| `parent_id` | `varchar(36)` | ❌ | ID danh mục cha (để tạo menu đa cấp) |
| `icon_id` | `varchar(36)` | ❌ | ID icon trong Storage |

---

## 4. Table: `orders` (Đơn hàng) - *Planned*

| Cột (Key) | Kiểu dữ liệu | Bắt buộc | Ghi chú |
| :--- | :--- | :---: | :--- |
| `user_id` | `varchar(36)` | ✅ | Người mua hàng |
| `total_amount`| `integer` | ✅ | Tổng giá trị đơn hàng |
| `payment_status`| `string` | ✅ | `pending`, `paid`, `failed` |
| `address` | `longtext` | ✅ | Địa chỉ giao hàng (JSON string) |

---

## 5. Table: `order_items` (Chi tiết đơn hàng) - *Planned*

| Cột (Key) | Kiểu dữ liệu | Bắt buộc | Ghi chú |
| :--- | :--- | :---: | :--- |
| `order_id` | `varchar(36)` | ✅ | Liên kết với ID đơn hàng tổng |
| `product_id` | `varchar(36)` | ✅ | Liên kết với sản phẩm |
| `shop_id` | `varchar(36)` | ✅ | Để Người bán lọc đơn của mình |
| `quantity` | `integer` | ✅ | Số lượng mua |
| `price` | `integer` | ✅ | Giá tại thời điểm mua |
| `status` | `string` | ✅ | `shipping`, `delivered`, `cancelled` |

---

## 6. Table: `cart_items` (Giỏ hàng) - *Planned*
Lưu giữ các sản phẩm người dùng đã thêm vào giỏ nhưng chưa thanh toán (đồng bộ liên thiết bị).

| Cột (Key) | Kiểu dữ liệu | Bắt buộc | Ghi chú |
| :--- | :--- | :---: | :--- |
| `user_id` | `varchar(36)` | ✅ | ID người dùng |
| `product_id`| `varchar(36)` | ✅ | Liên kết sản phẩm |
| `quantity` | `integer` | ✅ | Số lượng hiện tại trong giỏ |
| `shop_id` | `varchar(36)` | ✅ | Hỗ trợ gom nhóm shop trong giỏ hàng |

---

## 💡 Lưu ý triển khai:
1.  **Index**: Cần đánh index cho các trường `shop_id`, `category_id`, `name` (fulltext), và `user_id` (trong `cart_items`) để tăng tốc tìm kiếm.
2.  **Permissions**:
    *   `products`: Quyền Read cho tất cả (`any`), quyền Write cho chủ Shop.
    *   `orders`: Quyền Read cho người mua và Admin.
    *   `cart_items`: Quyền Read/Write cho chính người sở hữu (`owner`).
