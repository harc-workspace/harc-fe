# HARC Frontend

Bu depo, HARC projesinin React tabanlı frontend uygulamasıdır. Uygulama modern bir SPA olarak kurulmuştur; Google OAuth ile giriş yapar, token bilgisini istemci tarafında saklar ve API üzerinden kullanıcı oturumunu doğrular.

## Teknoloji Özeti

- React 19 — UI katmanı ve component mimarisi
- TypeScript — Tip güvenliği ve daha kontrollü refactor süreci
- Vite — Geliştirme sunucusu, hızlı HMR ve üretim build süreci
- TanStack React Query — Sunucu verisi alma, cache, yeniden deneme ve session doğrulama
- TanStack React Router — Route tanımı, korumalı sayfalar ve yönlendirme
- Google OAuth — Kullanıcı girişi ve ID token akışı
- react-i18next + i18next — Çok dilli UI metin yönetimi
- Tailwind CSS 4 — Utility-first stil sistemi
- Radix UI — Erişilebilir düşük seviyeli UI primitifleri
- shadcn ekosistemi — Bileşen oluşturma yaklaşımı ve UI parçaları
- lucide-react — İkon seti
- class-variance-authority, clsx, tailwind-merge — Stil varyantları ve class birleştirme yardımcıları
- Geist ve Inter fontları — Tipografi

## Mimari

Uygulama katmanları kabaca şu şekilde ayrılmıştır:

- `src/main.tsx` uygulamanın giriş noktasıdır.
- `src/App.tsx` Google OAuth sağlayıcısını ve TanStack Router sağlayıcısını sarar.
- `src/i18n.ts` uygulamanın çeviri kaynaklarını ve i18n başlangıç ayarlarını içerir.
- `src/router.ts` rota ağacını tanımlar; login, dashboard ve 404 akışı burada yönetilir.
- `src/components/AppInit.tsx` uygulama açılırken token doğrulaması ve yönlendirme öncesi hazırlığı yapar.
- `src/contexts/AuthContext.tsx` kullanıcı ve token durumunu yönetir, bunları `localStorage` ile kalıcı hale getirir.
- `src/contexts/LanguageContext.tsx` aktif dili saklar, `localStorage` ile eşler ve i18n motorunu senkronize eder.
- `src/hooks/useGetMe.ts` oturum doğrulaması için API çağrısı yapar ve kullanıcı bilgisini günceller.
- `src/api/client.ts` ortak HTTP istemcisidir; base URL, auth header ve dil header'larını burada toplar.
- `src/api/auth.ts` Google token tabanlı giriş ve çıkış akışlarını soyutlar.
- `src/pages/` sayfa seviyesindeki ekranları içerir.
- `src/layouts/` uygulama yerleşimlerini barındırır.
- `src/components/ui/` tekrar kullanılan küçük UI parçalarını içerir.

## Routing

Bu projede yönlendirme için React Router yerine TanStack React Router kullanılır. Route'lar kod içinde oluşturulur ve korumalı sayfalar `beforeLoad` kontrolü ile erişim doğrulamasından geçirilir. Bu yaklaşım, rota mantığını uygulama koduyla birlikte tutar ve type-safe route yapısı sağlar.

Örnek rota yapısı:

- `/login` — herkese açık giriş sayfası
- `/dashboard` — kimlik doğrulaması gerektiren alan
- `*` — bulunamayan sayfalar için 404 ekranı

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
