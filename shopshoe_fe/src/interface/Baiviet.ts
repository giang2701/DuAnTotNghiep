

export interface Baiviet {
    _id: string; // ID bài viết (do MongoDB tự sinh)
    title: string; // Tiêu đề bài viết
    content: string; // Nội dung bài viết, dạng mảng các block
    // images?: string; // Mảng URL ảnh (nếu có)
    images?: string[]; // Mảng URL ảnh (nếu có)
    isActive: boolean; // Trạng thái kích hoạt
    publishDate: Date; // Ngày đăng
  }
  
  