import bautroi from '@/assets/images/banners/bautroi.jfif';
import phao from '@/assets/images/banners/phao.jfif';
import tenlua from '@/assets/images/banners/tenlua.jfif';
import tenlua2 from '@/assets/images/banners/tenlua2.jfif';

export default function Banner() {
  const banners = [
    {
      id: 1,
      image: bautroi,
      title: 'Sẵn sàng chiến đấu bảo vệ bầu trời Tổ quốc',
      description: 'Lực lượng phòng không Sư đoàn 365 luôn trong tư thế sẵn sàng cao'
    },
    {
      id: 2,
      image: phao,
      title: 'Nâng cao khả năng chiến đấu',
      description: 'Huấn luyện bắn đạn thật đạt kết quả xuất sắc'
    },
    {
      id: 3,
      image: tenlua,
      title: 'Hiện đại hóa trang bị',
      description: 'Tên lửa phòng không hiện đại trang bị cho các đơn vị'
    },
    {
      id: 4,
      image: tenlua2,
      title: 'Quyết tâm chiến đấu thắng lợi',
      description: 'Huấn luyện chiến đấu với trang bị tên lửa tối tân'
    }
  ];

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="group relative h-48 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                  {banner.title}
                </h3>
                <p className="text-xs text-gray-200 line-clamp-1">
                  {banner.description}
                </p>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <span className="inline-block bg-red-600 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                HOT
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
