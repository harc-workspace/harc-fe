import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">{t('notFound.message')}</p>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 underline">
          {t('notFound.backToDashboard')}
        </Link>
      </div>
    </div>
  );
}
