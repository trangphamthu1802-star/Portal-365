import { useNavigate } from "react-router-dom";

export default function PageForm() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tạo trang mới</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p>Form tạo/sửa trang tĩnh</p>
          <button onClick={() => navigate("/admin/pages")} className="mt-4 px-6 py-2 border rounded-lg">Quay lại</button>
        </div>
      </div>
    </div>
  );
}
