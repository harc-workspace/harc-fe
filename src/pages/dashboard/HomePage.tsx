import { useTranslation } from 'react-i18next';
import * as card from "@/components/ui/card"
import { LeaveBalanceCard } from '@/components/dashboard/LeaveBalanceCard';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6">

        <card.Card className="w-full rounded-sm">
          <card.CardHeader>
            <card.CardTitle>Sol Üst Kart</card.CardTitle>
            <card.CardDescription>%70'lik Geniş Alan</card.CardDescription>
          </card.CardHeader>
          <card.CardContent>
            Buraya genellikle geniş veri tabloları veya zaman çizelgesi grafikleri (Line Chart) yakışır.
          </card.CardContent>
        </card.Card>

        <LeaveBalanceCard />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <card.Card className="w-full rounded-sm">
          <card.CardHeader>
            <card.CardTitle>Sol Alt Kart</card.CardTitle>
            <card.CardDescription>%50'lik Yarı Alan</card.CardDescription>
          </card.CardHeader>
          <card.CardContent>
            Onay bekleyen izin talepleri gibi ikili listeler için idealdir.
          </card.CardContent>
        </card.Card>

        <card.Card className="w-full rounded-sm">
          <card.CardHeader>
            <card.CardTitle>Sağ Alt Kart</card.CardTitle>
            <card.CardDescription>%50'lik Yarı Alan</card.CardDescription>
          </card.CardHeader>
          <card.CardContent>
            Yaklaşan doğum günleri veya şirket duyuruları yer alabilir.
          </card.CardContent>
        </card.Card>
      </div>

    </div>
  );
}