import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export type PreferredLanguage = 'tr' | 'en';

export const LANGUAGE_STORAGE_KEY = 'preferred_language';

const resources = {
  en: {
    common: {
       settings: {
        theme: 'Theme',
      },
      language: {
        label: 'Language',
        select: 'Select Language',
        options: {
          tr: 'Turkish',
          en: 'English',
        },
      },
      login: {
        title: 'Login to HARC',
        subtitle: 'Continue with Google to access the dashboard.',
        errorFallback: 'Login failed. Please try again.',
        authenticating: 'Authenticating...',
      },
      dashboard: {
        title: 'Dashboard',
        sidebar: {
          navigation: 'Navigation',
          sections: {
            home: 'Home',
            profile: 'Profile',
            timeOff: 'Time Off',
            payroll: 'Payroll',
            documents: 'Documents',
          },
        },
        logout: 'Logout',
        loggingOut: 'Logging out...',
        userInformation: 'User Information',
        quickStats: 'Quick Stats',
        workspaceSummary: 'Workspace Summary',
        homeDescription: 'Overview of your workspace and latest activity.',
        profileDescription: 'Your account details and role information.',
        timeOffDescription: 'Track your leave balance and requests.',
        payrollDescription: 'Review salary, payslips, and payment history.',
        documentsDescription: 'Access HR forms, policies, and files.',
        fields: {
          name: 'Name',
          email: 'Email',
          role: 'Role',
          roleDisplayName: 'Role Display Name',
          id: 'ID',
        },
      },
      notFound: {
        title: '404',
        message: 'Page not found',
        backToDashboard: 'Go back to dashboard',
      },
      appInit: {
        validatingSession: 'Validating session...',
        redirectingToLogin: 'Redirecting to login...',
      },
    },
  },
  tr: {
    common: {
      settings: {
        theme: 'Tema',
      },
      language: {
        label: 'Dil',
        select: 'Dil Seç',
        options: {
          tr: 'Türkçe',
          en: 'İngilizce',
        },
      },
      login: {
        title: 'HARC’e Giriş Yap',
        subtitle: 'Dashboard’a erişmek için Google ile devam et.',
        errorFallback: 'Giriş başarısız oldu. Lütfen tekrar deneyin.',
        authenticating: 'Doğrulanıyor...',
      },
      dashboard: {
        title: 'Kontrol Paneli',
        sidebar: {
          navigation: 'Gezinti',
          sections: {
            home: 'Ana Sayfa',
            profile: 'Profil',
            timeOff: 'İzin',
            payroll: 'Bordro',
            documents: 'Belgeler',
          },
        },
        logout: 'Çıkış Yap',
        loggingOut: 'Çıkış yapılıyor...',
        userInformation: 'Kullanıcı Bilgileri',
        quickStats: 'Hızlı Özeti',
        workspaceSummary: 'Çalışma Alanı Özeti',
        homeDescription: 'Çalışma alanının genel görünümü ve son aktiviteler.',
        profileDescription: 'Hesap bilgilerin ve rol detayların.',
        timeOffDescription: 'İzin bakiyeni ve taleplerini takip et.',
        payrollDescription: 'Maaş, bordro ve ödeme geçmişini görüntüle.',
        documentsDescription: 'İK formları, politikalar ve dosyalara eriş.',
        fields: {
          name: 'Ad',
          email: 'E-posta',
          role: 'Rol',
          roleDisplayName: 'Rolün Görünen Adı',
          id: 'Kimlik',
        },
      },
      notFound: {
        title: '404',
        message: 'Sayfa bulunamadı',
        backToDashboard: 'Kontrol paneline dön',
      },
      appInit: {
        validatingSession: 'Oturum doğrulanıyor...',
        redirectingToLogin: 'Giriş sayfasına yönlendiriliyor...',
      },
    },
  },
} as const;

export function getInitialLanguage(): PreferredLanguage {
  if (typeof window === 'undefined') {
    return 'tr';
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage === 'tr' || storedLanguage === 'en') {
    return storedLanguage;
  }

  const browserLanguage = window.navigator.language.toLowerCase();
  return browserLanguage.startsWith('tr') ? 'tr' : 'en';
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;