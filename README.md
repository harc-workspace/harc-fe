# HARC Frontend

Bu depo, HARC projesinin React tabanlı frontend uygulamasıdır. Uygulama modern bir SPA olarak kurulmuştur; Google OAuth ile giriş yapar, token bilgisini istemci tarafında saklar ve API üzerinden kullanıcı oturumunu doğrular. Temelde bir İnsan Kaynakları (HR) ve Çalışma Alanı yönetim panelidir.

## Teknoloji Özeti

- **React 19** — UI katmanı ve component mimarisi
- **TypeScript** — Tip güvenliği ve daha kontrollü geliştirme süreci
- **Vite** — Geliştirme sunucusu, hızlı HMR ve üretim build süreci
- **TanStack React Query** — Sunucu verisi alma, cache, yeniden deneme ve mutation yönetimi
- **TanStack React Router** — Type-safe route tanımı, korumalı sayfalar ve yönlendirme
- **Google OAuth** — Kullanıcı girişi ve ID token akışı
- **react-i18next + i18next** — Çok dilli UI metin yönetimi (TR/EN)
- **Tailwind CSS v4** — Utility-first stil sistemi ve yeni nesil konfigürasyon
- **Radix UI & shadcn/ui** — Erişilebilir, özelleştirilebilir UI bileşenleri ve gelişmiş Sidebar mimarisi
- **lucide-react** — İkon seti
- **Geist, Inter ve Roboto** — Özel tipografi paketleri

## Mimari ve Katmanlar

Uygulama katmanları sorumluluklarına göre şu şekilde ayrılmıştır:

- `src/main.tsx` uygulamanın giriş noktasıdır.
- `src/App.tsx` Google OAuth ve TanStack Router sağlayıcılarını başlatır.
- `src/router.ts` rota ağacını tanımlar; public (login) ve protected (dashboard) akışı burada yönetilir.
- `src/i18n.ts` çeviri kaynaklarını barındırır ve i18n başlangıç ayarlarını içerir.

### Context (Durum Yönetimi)
- `src/contexts/AuthContext.tsx`: Kullanıcı ve token durumunu yönetir, `localStorage` ile kalıcı hale getirir.
- `src/contexts/LanguageContext.tsx`: Aktif dili saklar, HTML `lang` niteliği ve i18next ile senkronize çalışır.
- `src/contexts/ThemeContext.tsx`: Koyu (Dark), Açık (Light) ve Sistem temalarını yönetir. FOUC (stil parlaması) sorununu engellemek için `index.html`'deki inline script ile entegre çalışır.

### API ve Veri Akışı
- `src/api/client.ts`: Ortak HTTP istemcisidir. Base URL, Bearer Auth header'ı ve kullanıcı diline göre `Accept-Language` header'ını merkezi olarak enjekte eder.
- `src/api/auth.ts`: Google token tabanlı giriş ve çıkış akışlarını backend ile haberleşerek soyutlar.
- `src/hooks/useGetMe.ts`: Uygulama açıldığında veya sayfa değiştiğinde mevcut token'ın geçerliliğini doğrular. 401 Unauthorized durumunda oturumu temizler.
- `src/hooks/useAuthMutations.ts`: Giriş ve çıkış işlemlerinin (mutations) yüklenme (loading) ve hata durumlarını yönetir.
- `src/components/AppInit.tsx`: `useGetMe` hook'unu dinleyerek, uygulama açılırken yetki doğrulamasının bitmesini bekler ve gerekli yönlendirmeleri yapar.

## Routing

Yönlendirme için TanStack React Router kullanılır. Route'lar kod içinde oluşturulur ve korumalı sayfalar `beforeLoad` metodu ile erişim doğrulamasından (Auth Guard) geçirilir.

Örnek rota yapısı:
- `/login` — Herkese açık giriş sayfası
- `/dashboard` — Kimlik doğrulaması gerektiren ana panel
  - `/dashboard/home` — Ana görünüm
  - `/dashboard/profile`, `/time-off`, `/payroll`, `/documents` — Alt modüller
- `*` — 404 Bulunamadı sayfası

## Veri ve Oturum Yönetimi

TanStack React Query bu projede sunucu verisi yönetimi için kullanılır. Özellikle:

- oturum doğrulama isteğini cache'ler,
- hata durumlarında yeniden deneme politikasını kontrol eder,
- token geçersizse kullanıcıyı login sayfasına yönlendirir,
- uygulama açılışında mevcut oturumu doğrular.

Auth tarafı ise React context ile tutulur. Kullanıcı ve token bilgisi `localStorage` içinde saklanır; sayfa yenilense bile oturum durumu korunur.

## API Katmanı

`src/api/client.ts` içinde tek bir HTTP istemci yaklaşımı kullanılır. Bu istemci:

- `VITE_GATEWAY_BASE_URL` ile gateway adresini okur,
- isteklerde `Authorization: Bearer ...` başlığı ekler,
- `Accept-Language` başlığı ile dil bilgisini gönderir,
- `GET`, `POST`, `PUT`, `DELETE` yardımcıları sağlar.

Google ile giriş akışında `@react-oauth/google` paketinden gelen ID token, backend/gateway tarafındaki `/api/identity/me` benzeri uç noktalara iletilir.

Çok dillilik tarafında kullanıcı dili `LanguageContext` ile yönetilir, `localStorage` içinde saklanır ve `i18next` üzerinden ekran metinlerine uygulanır. Böylece kullanıcı dil tercihi hem arayüzde hem de API isteklerindeki `Accept-Language` başlığında tutarlı kalır.

## Stil ve UI

Uygulamanın görünüm tarafında Tailwind CSS 4 temel stil motorudur. Üstünde Radix UI ve shadcn yaklaşımıyla oluşturulmuş bileşenler kullanılır. İkon tarafında lucide-react, class yönetiminde ise `clsx` ve `tailwind-merge` kullanılır.

Fontlar için `@fontsource-variable/geist` ve `@fontsource-variable/inter` paketleri eklenmiştir.

## Klasör Yapısı

- `src/api/` — HTTP istemcisi ve auth çağrıları
- `src/assets/` — statik dosyalar
- `src/components/` — tekrar kullanılabilir bileşenler
- `src/contexts/` — auth gibi uygulama çapındaki state katmanı
- `src/hooks/` — veri çekme ve auth yardımcı hook'ları
- `src/layouts/` — sayfa iskeletleri
- `src/pages/` — sayfalar
- `src/types/` — TypeScript tip tanımları
- `src/utils/` — küçük yardımcı fonksiyonlar

## Geliştirme Araçları

- `vite` — dev server, build ve preview
- `typescript` — derleme ve tip kontrolü
- `eslint` — lint kuralları
- `@vitejs/plugin-react` — React entegrasyonu
- `@tailwindcss/vite` — Tailwind 4 entegrasyonu

## Stil ve UI Tasarımı

Uygulamanın görünüm tarafında Tailwind CSS 4 kullanılmaktadır. `src/index.css` dosyasında `@theme inline` kullanılarak Shadcn UI ile tam uyumlu CSS değişkenleri (CSS variables) tanımlanmıştır. Tasarım "kompakt" bir yapıdadır; root font boyutu ayarlanarak ekran alanından tasarruf edilmiştir. Sol menü için Shadcn UI'ın modern, daraltılabilir (collapsible) `Sidebar` bileşeni kullanılmaktadır.

## Çalıştırma

Önkoşul olarak güncel bir Node.js LTS sürümü önerilir. Projede `bun`, `npm` veya `yarn` kullanılabilir.

```bash
bun install
# veya
npm install
# veya
yarn install
```

Geliştirme sunucusu:

```bash
bun run dev
# veya
npm run dev
```

Üretim build'i:

```bash
bun run build
```

Önizleme:

```bash
bun run preview
```

Lint:

```bash
bun run lint
```

## Ortam Değişkenleri

- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID
- `VITE_GATEWAY_BASE_URL` — API gateway adresi

## Notlar

- Bu projede klasik `react-router` kullanılmıyor; yönlendirme TanStack Router ile yapılıyor.
- React Query ve Router paketleri TanStack ekosisteminin bir parçası olarak birlikte kullanılıyor.
- Auth akışı localStorage, context ve sunucu doğrulaması kombinasyonuna dayanıyor.
- Uygulamanın dil tercihi `preferred_language` anahtarıyla localStorage içinde saklanır; bu değer `i18next` ile senkron tutulur.

## Lisans

Bu depoda ayrı bir lisans dosyası yoksa, kullanım öncesinde proje sahibinin lisans politikasını kontrol edin.
