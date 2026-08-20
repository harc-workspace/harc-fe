# HARC Frontend Agent Instructions

Bu repository'de çalışırken `.github/copilot-instructions.md` ve `.github/instructions/` altındaki ortak talimatları uygula.

- React 19 + TypeScript + Vite yapısını koru.
- API server-state için TanStack React Query, global client-state için mevcut Context yapılarını kullan.
- API çağrılarını merkezi `apiClient` üzerinden yap.
- FormData için `Content-Type` header'ını manuel ayarlama.
- Route, translation, localStorage key ve React Query key convention'larını bozma.
- Doğrulama sonrası `bun run build` ve `bun run lint` çalıştır; mevcut toolchain hatalarını raporla.
