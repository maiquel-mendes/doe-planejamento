"use client";

import {
  AlertTriangle,
  Calendar,
  CheckSquare,
  Clock,
  Heart,
  MapPin,
  Navigation,
  Radio,
  Route,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OperationalPlanning } from "@/types/operational-planning";

interface OperationalPlanningDisplayProps {
  planning: OperationalPlanning;
}

export function OperationalPlanningDisplay({
  planning,
}: OperationalPlanningDisplayProps) {
  return (
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
              <span className="text-sm font-medium">Horário da Operação</span>
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
              {planning.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{assignment.operatorName}</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.assignedFunctions.map((f) => f.name).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{assignment.vehiclePrefix}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ordem: {assignment.order}
                    </p>
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
            <div className="space-y-3">
              {planning.medical.medic ? (
                <div className="flex flex-wrap items-center gap-2">
                  {planning.medical.medic.split(", ").map((name, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum socorrista APH definido.</p>
              )}
            </div>
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
              {planning.complementaryMeasures.length > 0 ? (
                planning.complementaryMeasures.map((measure, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{measure}</span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma medida complementar definida.</p>
              )}
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
                  <div key={route.id} className="p-3 bg-muted/50 rounded-lg">
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
  );
}
