# HARC Frontend

`harc-fe`, HARC’ın React 19, TypeScript ve Vite ile geliştirilmiş SPA frontend’idir.

## Teknoloji ve katmanlar

- React 19: UI ve component yapısı.
- TypeScript: tip güvenliği.
- Vite: dev server ve production build.
- TanStack Router: route tree, redirect ve protected dashboard.
- TanStack React Query: API verisi, cache, retry ve mutation.
- `@react-oauth/google`: Google OAuth popup akışı.
- i18next/react-i18next: Türkçe ve İngilizce metinler.
- Tailwind CSS 4, Radix/shadcn bileşenleri ve lucide-react: UI.

## Uygulama akışı

`src/main.tsx` React root’u oluşturur. `App.tsx` Google OAuth provider’ı ve router’ı başlatır. Login sonrası Google ID token ve kullanıcı modeli localStorage’a yazılır.

Uygulama açılışında `useGetMe`, token varsa gateway üzerinden `/api/identity/me` çağırır. 401 durumunda token ve kullanıcı temizlenir, `/login` sayfasına dönülür. Dashboard route’u ayrıca localStorage’da token ve kullanıcı olup olmadığını kontrol eder.

## Rotalar

- `/login`: public Google login sayfası.
- `/dashboard/home`: ana dashboard.
- `/dashboard/profile`: profil.
- `/dashboard/time-off`: izin ekranı.
- `/dashboard/payroll`: route mevcut; backend kapsamı tamamlanmamış.
- `/dashboard/documents`: route mevcut; backend kapsamı tamamlanmamış.
- `*`: 404.

## API istemcisi

`src/api/client.ts` merkezi `GET`, `POST`, `PUT` ve `DELETE` yardımcıları sağlar:

- Base URL `VITE_GATEWAY_BASE_URL` ile belirlenir.
- Token varsa `Authorization: Bearer ...` eklenir.
- `preferred_language` değerinden `Accept-Language` header’ı üretilir.
- FormData için `Content-Type` elle set edilmez; browser boundary ekler.

İzin API’si:

- `GET /api/leave/my-balance`
- `GET /api/leave/calendar?year=YYYY&month=M`
- `POST /api/leave` (`multipart/form-data`, tekrar eden `Documents` alanları)

## Global durum ve localStorage

- `google_id_token`: Google ID token.
- `auth_user`: son doğrulanmış kullanıcı modeli.
- `preferred_language`: `tr` veya `en`.
- `next-themes`/theme context: tema tercihi.

Auth ve language context’leri uygulama state’ini yönetir; React Query server-state içindir.

## Environment

`.env.example`:

```env
VITE_GATEWAY_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

`VITE_GOOGLE_CLIENT_ID` yoksa uygulama başlangıçta hata verir. `.env` dosyası source control’e alınmamalıdır.

## Kurulum ve komutlar

```bash
bun install
bun run dev
bun run build
bun run lint
bun run preview
```

NPM kullanılıyorsa eşdeğer `npm install`, `npm run dev`, `npm run build` ve `npm run lint` komutları kullanılabilir.

Gateway ve API’nin de çalışıyor olması gerekir. Standalone geliştirmede `VITE_GATEWAY_BASE_URL` gateway adresini göstermelidir; Aspire ile çalışırken AppHost bu değeri environment olarak sağlayabilir.

## Tasarım ve i18n

`src/index.css` Tailwind/shadcn CSS değişkenlerini tanımlar. `LanguageContext` dili localStorage’da saklar ve i18next ile senkronize eder. Theme context açık/koyu/sistem temasını yönetir.

## Bilinen sınırlamalar

- Frontend route’larının bir kısmı backend özellikleri tamamlanmadan hazırlanmıştır.
- Token browser localStorage’da tutulur; production güvenlik değerlendirmesinde XSS ve token saklama politikası ayrıca ele alınmalıdır.
- Route guard client-side localStorage bilgisine dayanır; gerçek güvenlik backend JWT doğrulamasıdır.
- Otomatik frontend test projesi yoktur.
- Mevcut TypeScript toolchain’i `tsconfig.app.json` içindeki kaldırılmış `baseUrl` seçeneğini reddedebildiği için `bun run build` önce config/sürüm uyumluluğu gerektirebilir.

Ayrıntılı mimari ve backend sözleşmesi için [kök AI_PROJECT_GUIDE.md](../AI_PROJECT_GUIDE.md) dosyasına bakın.
