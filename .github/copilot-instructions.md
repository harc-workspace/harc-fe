# HARC Frontend Instructions

Bu repository HARC'ın React 19 + TypeScript + Vite frontend'idir. Ortak kurallar `.github/instructions/` altındaki coding, architecture, security ve documentation dosyalarındadır.

## Proje kuralları

- Başlangıç akışı `src/main.tsx` -> `App.tsx` şeklindedir.
- API server-state için TanStack React Query kullan; mevcut query key desenlerini koru.
- API çağrılarını merkezi `apiClient` üzerinden yap ve response tiplerini API sözleşmesiyle uyumlu tut.
- `preferred_language`, `google_id_token` ve `auth_user` localStorage key'lerini değiştirme.
- Route ve UI değişikliklerinde mevcut layout ve translation yaklaşımını koru.
- FormData için `Content-Type` header'ını elle yazma.
