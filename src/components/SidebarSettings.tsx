"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { PreferredLanguage } from "@/i18n";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";

interface SidebarSettingsProps {
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function SidebarSettings({ onLogout, isLoggingOut }: SidebarSettingsProps) {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {t("language.label")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  onValueChange={(value) =>
                    setLanguage(value as PreferredLanguage)
                  }
                  value={language}
                >
                  <DropdownMenuRadioItem value="tr">
                    <span className="flex items-center gap-2">
                      <span>tr</span>
                      <span>{t("language.options.tr")}</span>
                    </span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="en">
                    <span className="flex items-center gap-2">
                      <span>en</span>
                      <span>{t("language.options.en")}</span>
                    </span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        <DropdownMenuItem>
          {t("settings.theme")}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer bg-red-400 text-red-foreground" onClick={onLogout} disabled={isLoggingOut}>
          {isLoggingOut ? t("dashboard.loggingOut") : t("dashboard.logout")}
        </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
