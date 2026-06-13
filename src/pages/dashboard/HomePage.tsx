import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sol Üst Kart</CardTitle>
            <CardDescription>%70'lik Geniş Alan</CardDescription>
          </CardHeader>
          <CardContent>
            Buraya genellikle geniş veri tabloları veya zaman çizelgesi grafikleri (Line Chart) yakışır.
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sağ Üst Kart</CardTitle>
            <CardDescription>%30'luk Dar Alan</CardDescription>
          </CardHeader>
          <CardContent>
            Buraya "Son Aktiviteler" listesi veya bir "Pasta Grafik (Pie Chart)" ekleyebilirsiniz.
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sol Alt Kart</CardTitle>
            <CardDescription>%50'lik Yarı Alan</CardDescription>
          </CardHeader>
          <CardContent>
            Onay bekleyen izin talepleri gibi ikili listeler için idealdir.
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sağ Alt Kart</CardTitle>
            <CardDescription>%50'lik Yarı Alan</CardDescription>
          </CardHeader>
          <CardContent>
            Yaklaşan doğum günleri veya şirket duyuruları yer alabilir.
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
