import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export default function SectionHeader({ title, viewAllLink, viewAllText = 'Xem tất cả' }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="text-green-600 hover:text-green-700 font-semibold text-sm md:text-base flex items-center gap-1 transition-colors"
        >
          {viewAllText}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
