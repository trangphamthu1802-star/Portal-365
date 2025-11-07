import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface BannerFormData {
  title: string;
  image_url: string;
  link_url: string;
  placement: string;
  sort_order: number;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

export default function BannerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    image_url: '',
    link_url: '',
    placement: 'home_top',
    sort_order: 0,
    is_active: true,
    start_date: '',
    end_date: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateImage = async (file: File): Promise<string | null> => {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return 'Kích thước file không được vượt quá 5MB';
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Chỉ chấp nhận file JPEG, PNG, hoặc WebP';
    }

    // Validate dimensions
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < 1200) {
          resolve('Chiều rộng ảnh phải >= 1200px (hiện tại: ' + img.width + 'px)');
        } else {
          resolve(null);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve('Không thể đọc file ảnh');
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    const error = await validateImage(file);
    if (error) {
      setErrors({ ...errors, image: error });
      return;
    }

    setSelectedFile(file);
    setErrors({ ...errors, image: '' });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-fill title if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      setFormData({ ...formData, title: fileName });
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', selectedFile.name);

      // Simulate upload with progress
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          setUploading(false);
          if (xhr.status === 201) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response.data.url);
            } catch (err) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          setUploading(false);
          reject(new Error('Network error'));
        });

        const token = localStorage.getItem('token');
        xhr.open('POST', 'http://localhost:8080/api/v1/admin/media/upload');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Debug logging
    console.log('Form submission - formData:', formData);
    console.log('Title value:', formData.title);
    console.log('Title trimmed:', formData.title.trim());
    console.log('Title length:', formData.title.length);

    // Validation
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
      console.error('Title validation failed!');
    }

    if (!selectedFile && !formData.image_url) {
      newErrors.image = 'Vui lòng chọn ảnh';
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.dates = 'Ngày bắt đầu phải trước ngày kết thúc';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Upload image first if new file selected
      let imageUrl = formData.image_url;
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Create/Update banner
      const bannerData = {
        ...formData,
        image_url: imageUrl,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      const token = localStorage.getItem('token');
      const url = id
        ? `http://localhost:8080/api/v1/admin/banners/${id}`
        : 'http://localhost:8080/api/v1/admin/banners';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bannerData),
      });

      if (!response.ok) {
        throw new Error('Failed to save banner');
      }

      alert(id ? 'Cập nhật banner thành công!' : 'Tạo banner thành công!');
      navigate('/admin/banners');
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Có lỗi xảy ra khi lưu banner');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Sửa Banner' : 'Tạo Banner Mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Image Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Hình ảnh <span className="text-red-500">*</span>
          </label>

          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border-2 border-gray-200">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                🗑️ Xóa ảnh
              </button>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-3">
                <div className="text-6xl">📷</div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">Chọn file</span> hoặc kéo thả vào đây
                </div>
                <div className="text-xs text-gray-500">
                  JPEG, PNG, WebP • Max 5MB • Tối thiểu 1200px chiều rộng
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          )}

          {uploading && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-gray-600">Đang tải lên...</span>
                <span className="font-semibold text-blue-600">{uploadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {errors.image && (
            <p className="mt-2 text-sm text-red-600">{errors.image}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              console.log('Title onChange - new value:', e.target.value);
              setFormData({ ...formData, title: e.target.value });
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            placeholder="Nhập tiêu đề banner"
            required
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Placement */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Vị trí hiển thị
          </label>
          <select
            value={formData.placement}
            onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="home_top">Home Top</option>
            <option value="sidebar">Sidebar</option>
          </select>
        </div>

        {/* Link URL */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Link URL (tùy chọn)
          </label>
          <input
            type="url"
            value={formData.link_url}
            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            placeholder="https://example.com"
          />
        </div>

        {/* Sort Order */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Thứ tự hiển thị
          </label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) =>
              setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="0"
          />
          <p className="mt-1 text-xs text-gray-500">Số nhỏ hơn sẽ hiển thị trước</p>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            />
          </div>
        </div>
        {errors.dates && (
          <p className="text-sm text-red-600">{errors.dates}</p>
        )}

        {/* Active Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Kích hoạt banner
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 border-t pt-6">
          <button
            type="submit"
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Đang tải lên...' : id ? 'Cập nhật' : 'Tạo Banner'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/banners')}
            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
