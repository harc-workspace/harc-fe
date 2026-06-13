"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { PreferredLanguage } from "@/i18n";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Settings, LogOut } from "lucide-react";

interface SidebarSettingsProps {
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function SidebarSettings({ onLogout, isLoggingOut }: SidebarSettingsProps) {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  // Menü elemanına tıklandığında kapanmayı engelleyen fonksiyon
  const handleSelect = (e: Event) => {
    e.preventDefault();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" side="top">
        <DropdownMenuLabel>{t("common.settings.title", "Ayarlar")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Tema Seçimi */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal text-muted-foreground text-xs uppercase tracking-wider">
            {t("common.settings.theme", "Tema")}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
            value={theme}
          >
            <DropdownMenuRadioItem value="light" className="cursor-pointer" onSelect={handleSelect}>
              {t("common.settings.themeLight", "Açık")}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark" className="cursor-pointer" onSelect={handleSelect}>
              {t("common.settings.themeDark", "Koyu")}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system" className="cursor-pointer" onSelect={handleSelect}>
              {t("common.settings.themeSystem", "Sistem")}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Dil Seçimi */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal text-muted-foreground text-xs uppercase tracking-wider">
            {t("language.label", "Dil")}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(value) => setLanguage(value as PreferredLanguage)}
            value={language}
          >
            <DropdownMenuRadioItem value="tr" className="cursor-pointer" onSelect={handleSelect}>
              <span className="flex items-center gap-2">
                <span>🇹🇷</span>
                <span>{t("language.options.tr", "Türkçe")}</span>
              </span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="en" className="cursor-pointer" onSelect={handleSelect}>
              <span className="flex items-center gap-2">
                <span>🇬🇧</span>
                <span>{t("language.options.en", "English")}</span>
              </span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Çıkış Yap - (Çıkış butonunda bilerek engellemiyoruz, tıklanınca kapansın/işlem yapsın) */}
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50" 
          onClick={onLogout} 
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? t("dashboard.loggingOut", "Çıkış yapılıyor...") : t("dashboard.logout", "Çıkış Yap")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}