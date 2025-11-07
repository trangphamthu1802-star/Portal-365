import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  placement: string;
  sort_order: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function BannersAdminList() {
  const [banners] = useState<Banner[]>([]);
  const [loading] = useState(false);
  const [placement, setPlacement] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filteredBanners = banners.filter((banner) => {
    if (placement && banner.placement !== placement) return false;
    if (activeFilter !== '' && banner.is_active !== (activeFilter === 'true')) return false;
    if (search && !banner.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredBanners.length / pageSize);
  const paginatedBanners = filteredBanners.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa banner này?')) return;
    // TODO: Implement delete mutation
    console.log('Delete banner', id);
  };

  const toggleActive = async (id: number, currentActive: boolean) => {
    // TODO: Implement update mutation
    console.log('Toggle active', id, !currentActive);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Banners</h1>
        <Link
          to="/admin/banners/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <span>+</span>
          Tạo Banner
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Placement</label>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">Tất cả</option>
            <option value="home_top">Home Top</option>
            <option value="sidebar">Sidebar</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Trạng thái</label>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">Tất cả</option>
            <option value="true">Kích hoạt</option>
            <option value="false">Tắt</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Tìm kiếm</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Placement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thời gian hiển thị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedBanners.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Không có banners nào
                    </td>
                  </tr>
                ) : (
                  paginatedBanners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{banner.title}</div>
                        {banner.link_url && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            → {banner.link_url}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="h-12 w-20 rounded object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{banner.placement}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{banner.sort_order}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>{formatDate(banner.start_date)}</div>
                        <div>→ {formatDate(banner.end_date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(banner.id, banner.is_active)}
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            banner.is_active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {banner.is_active ? 'Kích hoạt' : 'Tắt'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/banners/${banner.id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                            title="Sửa"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Xóa"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredBanners.length)} / {filteredBanners.length} banners
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
                >
                  Trước
                </button>
                <span className="flex items-center px-4 text-sm text-gray-700">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
