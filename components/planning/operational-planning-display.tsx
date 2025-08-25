"use client";

import {
  AlertTriangle,
  Calendar,
  CheckSquare,
  Clock,
  Heart,
  MapPin,
  Radio,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OperationalPlanning, OperationalFunction } from "@/types/operational-planning";

interface OperationalPlanningDisplayProps {
  planning: OperationalPlanning;
}

export function OperationalPlanningDisplay({
  planning,
}: OperationalPlanningDisplayProps) {
  return (
    <Tabs defaultValue="introduction" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="introduction">Introdução</TabsTrigger>
        <TabsTrigger value="targets">Alvos</TabsTrigger>
        <TabsTrigger value="functions">Funções</TabsTrigger>
        <TabsTrigger value="schedule">Horários</TabsTrigger>
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
                {planning.introduction?.serviceOrderNumber || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Tipo de Operação</span>
              <p className="text-sm text-muted-foreground">
                {planning.introduction?.operationType || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Unidade de Apoio</span>
              <p className="text-sm text-muted-foreground">
                {planning.introduction?.supportUnit || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Tipo de Mandado</span>
              <p className="text-sm text-muted-foreground">
                {planning.introduction?.mandateType || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Data da Operação</span>
              <p className="text-sm text-muted-foreground">
                {planning.introduction?.operationDate || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Horário da Operação</span>
              <p className="text-sm text-muted-foreground">
                {planning.introduction?.operationTime || "N/A"}
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
                  {target.targetName}
                </CardTitle>
                {target.description && (
                  <CardDescription>{target.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {target.location && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">
                        {target.location.name}
                      </span>
                    </div>
                    <p className="text-sm">{target.location.address || "Endereço não informado"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lat: {target.location.latitude}, Lon: {target.location.longitude}
                    </p>
                  </div>
                )}
                {target.images && target.images.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Imagens do Alvo</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {target.images.map((image) => (
                        <div key={image.id} className="relative group aspect-square">
                          <a href={image.url} target="_blank" rel="noopener noreferrer">
                            <Image
                              src={image.url}
                              alt={image.altText || `Imagem do alvo ${target.targetName}`}
                              layout="fill"
                              className="object-cover rounded-md transition-transform group-hover:scale-105"
                            />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}\
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
                      <p className="font-medium">{assignment.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(assignment.functions as OperationalFunction[]).map(f => f.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  {assignment.vehicle && (
                    <div className="text-right">
                      <Badge variant="outline">{assignment.vehicle.prefix}</Badge>
                    </div>
                  )}
                </div>
              ))}\
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
              {planning.scheduleItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                >
                  <Badge variant="outline" className="font-mono">
                    {new Date(item.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Badge>
                  <p className="text-sm">{item.activity}</p>
                </div>
              ))}\
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Peculiaridades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {planning.peculiarities || "Nenhuma peculiaridade definida."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Plano Médico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {planning.medicalPlan?.procedures || "Nenhum procedimento médico definido."}
            </p>
            {planning.assignments && planning.assignments.length > 0 && (() => {
              const aphOperators = planning.assignments
                .filter(assignment => (assignment.functions as OperationalFunction[]).some(f => f.name === 'APH'));
              return aphOperators.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm font-medium">Socorristas APH
                    :</span>
                  {aphOperators.map((assignment) => (
                    <Badge key={assignment.id} variant="secondary">
                      {assignment.user.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">Nenhum socorrista APH atribuído.</p>
              );
            })()}
            {planning.medicalPlan?.hospitalLocation && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Hospital de Referência:</span>
                </div>
                <p className="text-sm">{planning.medicalPlan.hospitalLocation.name}</p>
                <p className="text-xs text-muted-foreground">
                  {planning.medicalPlan.hospitalLocation.address || "Endereço não informado"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Lat: {planning.medicalPlan.hospitalLocation.latitude}, Lon: {planning.medicalPlan.hospitalLocation.longitude}
                </p>
              </div>
            )}
            {planning.medicalPlan?.ambulanceVehicle && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="h-4 w-4" /> {/* Placeholder icon */}
                  <span className="font-medium">Viatura Ambulância:</span>
                </div>
                <p className="text-sm">
                  {planning.medicalPlan.ambulanceVehicle.prefix} - {planning.medicalPlan.ambulanceVehicle.model}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}