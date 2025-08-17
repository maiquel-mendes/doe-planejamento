"use client"

import type { OperationalPlanning } from "@/types/operational-planning"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Radio,
  AlertTriangle,
  Heart,
  CheckSquare,
  Route,
  Navigation,
} from "lucide-react"

interface OperationalPlanningDetailModalProps {
  isOpen: boolean
  onClose: () => void
  planning: OperationalPlanning | null
}

export function OperationalPlanningDetailModal({ isOpen, onClose, planning }: OperationalPlanningDetailModalProps) {
  if (!planning) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {planning.introduction.operationType} - {planning.introduction.serviceOrder}
          </DialogTitle>
          <DialogDescription>
            {planning.introduction.operationDate} às {planning.introduction.operationTime} -{" "}
            {planning.introduction.supportUnit}
          </DialogDescription>
        </DialogHeader>

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
                  <label className="text-sm font-medium">Ordem de Serviço</label>
                  <p className="text-sm text-muted-foreground">{planning.introduction.serviceOrder}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo de Operação</label>
                  <p className="text-sm text-muted-foreground">{planning.introduction.operationType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Unidade de Apoio</label>
                  <p className="text-sm text-muted-foreground">{planning.introduction.supportUnit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo de Mandado</label>
                  <p className="text-sm text-muted-foreground">{planning.introduction.mandateType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Data da Operação</label>
                  <p className="text-sm text-muted-foreground">{planning.introduction.operationDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Horário da Operação</label>
                  <p className="text-sm text-muted-foreground">{planning.introduction.operationTime}</p>
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
                    {target.alias && <CardDescription>{target.alias}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">{target.description}</p>
                    {target.observations && <p className="text-sm text-muted-foreground">{target.observations}</p>}
                    {planning.addresses
                      .filter((addr) => addr.targetId === target.id)
                      .map((address) => (
                        <div key={address.id} className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Endereço</span>
                          </div>
                          <p className="text-sm">{address.address}</p>
                          {address.complement && <p className="text-sm text-muted-foreground">{address.complement}</p>}
                          <p className="text-sm text-muted-foreground">
                            {address.city} - {address.state}
                          </p>
                          {address.coordinates && (
                            <p className="text-xs text-muted-foreground mt-1">{address.coordinates}</p>
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
                  {planning.functionsBoard.map((func) => (
                    <div key={func.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{func.operatorName}</p>
                          <p className="text-sm text-muted-foreground">{func.functionName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{func.vehiclePrefix}</Badge>
                        {func.observations && <p className="text-xs text-muted-foreground mt-1">{func.observations}</p>}
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
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
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
                  {planning.communications.map((comm) => (
                    <div key={comm.id} className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">{comm.type}</p>
                      <p className="text-sm text-muted-foreground">{comm.description}</p>
                    </div>
                  ))}
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
                  {planning.peculiarities.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
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
                <ul className="space-y-2">
                  {planning.aph.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
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
                  {planning.complementaryMeasures.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
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
                          {route.from} → {route.to}
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
                      <div key={location.id} className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">{location.name}</p>
                        {location.coordinates && (
                          <p className="text-xs text-muted-foreground">{location.coordinates}</p>
                        )}
                        {location.phone && <p className="text-xs text-muted-foreground">Tel: {location.phone}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Metadata */}
        <div className="pt-4 border-t space-y-2">
          <div className="text-xs text-muted-foreground">
            Criado por {planning.createdBy} em {planning.createdAt.toLocaleDateString("pt-BR")}
          </div>
          <div className="text-xs text-muted-foreground">
            Última atualização: {planning.updatedAt.toLocaleDateString("pt-BR")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
