"use client"

import type { OperationalPlanning } from "@/types/operational-planning"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, Clock, Radio, Heart, CheckSquare, Route, Navigation } from "lucide-react"

interface PlanningDetailModalProps {
  isOpen: boolean
  onClose: () => void
  planning: OperationalPlanning | null
}

export function PlanningDetailModal({ isOpen, onClose, planning }: PlanningDetailModalProps) {
  if (!planning) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Operação {planning.introduction.operationName}</DialogTitle>
          <DialogDescription>
            {planning.introduction.operationType} - {planning.introduction.operationDate} às{" "}
            {planning.introduction.operationTime}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="introduction" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="introduction">Introdução</TabsTrigger>
            <TabsTrigger value="targets">Alvos</TabsTrigger>
            <TabsTrigger value="functions">Funções</TabsTrigger>
            <TabsTrigger value="schedules">Horários</TabsTrigger>
            <TabsTrigger value="communications">Comunicações</TabsTrigger>
            <TabsTrigger value="additional">Complementares</TabsTrigger>
          </TabsList>

          <TabsContent value="introduction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informações da Operação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Ordem de Serviço</label>
                    <p className="text-sm text-muted-foreground">{planning.introduction.serviceOrder}</p>
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
                    <label className="text-sm font-medium">Local</label>
                    <p className="text-sm text-muted-foreground">{planning.introduction.location}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <p className="text-sm text-muted-foreground">{planning.introduction.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="targets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Identificação dos Alvos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {planning.targets.map((target, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{target.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{target.description}</p>
                      <div className="mt-2">
                        <span className="text-sm font-medium">Endereço: </span>
                        <span className="text-sm text-muted-foreground">{target.address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="functions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Quadro de Funções
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {planning.functions.map((func, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{func.operatorName}</p>
                          <p className="text-sm text-muted-foreground">{func.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{func.vehicle}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quadro de Horários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {planning.schedules.map((schedule, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-16 text-center">
                        <Badge variant="secondary">{schedule.time}</Badge>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{schedule.activity}</p>
                      </div>
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
                  Comunicações e Peculiaridades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Comunicações durante Trajeto</h4>
                  <div className="space-y-2">
                    {planning.communications.map((comm, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {comm}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Peculiaridades</h4>
                  <div className="space-y-2">
                    {planning.peculiarities.map((peculiarity, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {peculiarity}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    APH - Médico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {planning.aph.map((item, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {item}
                      </p>
                    ))}
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
                  <div className="space-y-2">
                    {planning.complementaryMeasures.map((measure, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {measure}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Resumo das Rotas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {planning.routes.map((route, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {route}
                      </p>
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
                  <div className="space-y-2">
                    {planning.locations.map((location, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {location}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
