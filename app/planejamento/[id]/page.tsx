
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import {
  AlertTriangle,
  Calendar,
  CheckSquare,
  Clock,
  Heart,
  Loader2,
  MapPin,
  Navigation,
  Radio,
  Route,
  Users,
} from 'lucide-react';

import { generatePdf } from '@/components/pdf-generator';
import { OperationalPlanningPDFView } from '@/components/planning/operational-planning-pdf-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOperationalPlanningById } from '@/lib/operational-planning-management';
import type { OperationalPlanning } from '@/types/operational-planning';

export default function OperationalPlanningDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [planning, setPlanning] = useState<OperationalPlanning | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPlanning = async () => {
      try {
        const data = await getOperationalPlanningById(id);
        if (!data) {
          notFound();
        } else {
          setPlanning(data);
        }
      } catch (error) {
        console.error('Failed to fetch planning data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanning();
  }, [id]);

  const handleGeneratePdf = async () => {
    if (!planning) return;

    setIsGeneratingPdf(true);
    try {
      await generatePdf(
        <OperationalPlanningPDFView planning={planning} />,
        `planejamento-${planning.introduction.serviceOrderNumber}.pdf`,
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!planning) {
    return null; // Or a more user-friendly not found component
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-4xl mx-auto bg-background p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {planning.introduction.operationType} -
          {planning.introduction.serviceOrderNumber}
        </h1>
        <p className="text-muted-foreground mb-6">
          {planning.introduction.operationDate} às
          {planning.introduction.operationTime} -
          {planning.introduction.supportUnit}
        </p>

        <div className="mb-6">
          <Button onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
            {isGeneratingPdf ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              'Gerar Relatório PDF'
            )}
          </Button>
        </div>

        <Tabs defaultValue="introduction" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="introduction">Introdução</TabsTrigger>
            <TabsTrigger value="targets">Alvos</TabsTrigger>
            <TabsTrigger value="functions">Funções</TabsTrigger>
            <TabsTrigger value="schedule">Horários</TabsTrigger>
            <TabsTrigger value="communications">Comunicações</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          <TabsContent value="introduction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informações da Operação
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Ordem de Serviço</span>
                  <p className="text-sm text-muted-foreground">
                    {planning.introduction.serviceOrderNumber}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Tipo de Operação</span>
                  <p className="text-sm text-muted-foreground">
                    {planning.introduction.operationType}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Unidade de Apoio</span>
                  <p className="text-sm text-muted-foreground">
                    {planning.introduction.supportUnit}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Tipo de Mandado</span>
                  <p className="text-sm text-muted-foreground">
                    {planning.introduction.mandateType}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Data da Operação</span>
                  <p className="text-sm text-muted-foreground">
                    {planning.introduction.operationDate}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">
                    Horário da Operação
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {planning.introduction.operationTime}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="targets" className="space-y-4">
            <div className="grid gap-4">
              {planning.targets.map((target) => (
                <Card key={target.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {target.name}
                    </CardTitle>
                    {target.alias && (
                      <CardDescription>{target.alias}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">{target.description}</p>
                    {target.observations && (
                      <p className="text-sm text-muted-foreground">
                        {target.observations}
                      </p>
                    )}
                    {planning.targets
                      .filter((addr) => addr.id === target.id)
                      .map((address) => (
                        <div
                          key={address.id}
                          className="mt-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Endereço</span>
                          </div>
                          <p className="text-sm">{address.address}</p>
                          {address.address && (
                            <p className="text-sm text-muted-foreground">
                              {address.description}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {address.description} - {address.alias}
                          </p>
                          {address.coordinates && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {address.coordinates}
                            </p>
                          )}
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="functions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Quadro de Funções
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {planning.assignments.map((func) => (
                    <div
                      key={func.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{func.operatorName}</p>
                          <p className="text-sm text-muted-foreground">
                            {func.functionName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{func.vehiclePrefix}</Badge>
                        {func.functionId && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {func.order}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Cronograma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {planning.schedule.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                    >
                      <Badge variant="outline" className="font-mono">
                        {item.time}
                      </Badge>
                      <p className="text-sm">{item.activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  Comunicações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">
                        {planning.communications.frequency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {planning.communications.vehicleCall}
                      </p>
                    </div>
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Peculiaridades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">
                        {planning.peculiarities.observations}
                      </span>
                    </li>
                  }
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  APH - Médico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3"></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Medidas Complementares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{planning.medical.medic}</span>
                    </li>
                  }
                </ul>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Rotas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {planning.routes.map((route) => (
                      <div
                        key={route.id}
                        className="p-3 bg-muted/50 rounded-lg"
                      >
                        <p className="font-medium">
                          {route.origin} → {route.destination}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {route.distance} / {route.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Localizações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {planning.locations.map((location) => (
                      <div
                        key={location.id}
                        className="p-3 bg-muted/50 rounded-lg"
                      >
                        <p className="font-medium">{location.name}</p>
                        {location.coordinates && (
                          <p className="text-xs text-muted-foreground">
                            {location.coordinates}
                          </p>
                        )}
                        {location.phone && (
                          <p className="text-xs text-muted-foreground">
                            Tel: {location.phone}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Metadata */}
        <div className="pt-4 border-t space-y-2 mt-6">
          <div className="text-xs text-muted-foreground">
            Criado por {planning.createdBy} em
            {planning.createdAt.toLocaleDateString('pt-BR')}
          </div>
          <div className="text-xs text-muted-foreground">
            Última atualização: {planning.updatedAt.toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
}