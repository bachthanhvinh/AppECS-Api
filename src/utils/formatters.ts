export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Tách các ký tự dấu ra khỏi chữ cái gốc
    .replace(/[\u0300-\u036f]/g, "") // Xóa các ký tự dấu
    .replace(/[đĐ]/g, "d") // Chuyển đ/Đ thành d
    .replace(/([^0-9a-z-\s])/g, "") // Xóa ký tự đặc biệt
    .replace(/(\s+)/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-") // Xóa nhiều dấu gạch ngang liên tiếp
    .replace(/^-+|-+$/g, ""); // Xóa dấu gạch ngang ở đầu và cuối
};
