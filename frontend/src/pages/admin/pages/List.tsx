import { Link } from "react-router-dom";

export default function PagesList() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quản lý Trang tĩnh</h1>
          <Link to="/admin/pages/new" className="bg-blue-600 text-white px-6 py-3 rounded-lg">+ Tạo trang mới</Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p>Danh sách các trang giới thiệu sẽ hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
}
