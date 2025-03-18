
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrganizationCredits() {
  return (
    <>
      <Helmet>
        <title>Meus Créditos | Leadly</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Meus Créditos</h1>
          <p className="text-muted-foreground">Gerencie os créditos da sua organização</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meus Créditos</CardTitle>
            <CardDescription>Esta página está em construção</CardDescription>
          </CardHeader>
          <CardContent>
            <p>O conteúdo sobre os créditos da sua organização será exibido aqui em breve.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
