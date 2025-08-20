import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  Location,
  OperationalPlanning,
  Route,
} from "@/types/operational-planning";

interface ComplementaryFormSectionProps {
  peculiarities: OperationalPlanning["peculiarities"];
  newSearchObject: string;
  setNewSearchObject: (value: string) => void;
  addSearchObject: () => void;
  removeSearchObject: (index: number) => void;
  medical: OperationalPlanning["medical"];
  handleMedicalChange: (field: keyof OperationalPlanning["medical"], value: string) => void;
  complementaryMeasures: OperationalPlanning["complementaryMeasures"];
  newMeasure: string;
  setNewMeasure: (value: string) => void;
  addMeasure: () => void;
  removeMeasure: (index: number) => void;
  routes: OperationalPlanning["routes"];
  newRoute: Route;
  setNewRoute: (route: Route) => void;
  addRoute: () => void;
  removeRoute: (id: string) => void;
  locations: OperationalPlanning["locations"];
  newLocation: Location;
  setNewLocation: (location: Location) => void;
  addLocation: () => void;
  removeLocation: (id: string) => void;
}

export function ComplementaryFormSection({
  peculiarities,
  newSearchObject,
  setNewSearchObject,
  addSearchObject,
  removeSearchObject,
  medical,
  handleMedicalChange,
  complementaryMeasures,
  newMeasure,
  setNewMeasure,
  addMeasure,
  removeMeasure,
  routes,
  newRoute,
  setNewRoute,
  addRoute,
  removeRoute,
  locations,
  newLocation,
  setNewLocation,
  addLocation,
  removeLocation,
}: ComplementaryFormSectionProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>8. Peculiaridades</CardTitle>
          <CardDescription>Informações específicas da operação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Objetos da Busca</Label>
            <div className="space-y-2">
              {peculiarities.searchObjects.map((object, index) => (
                <div key={object} className="flex items-center gap-2">
                  <Badge variant="outline" className="flex-1 justify-start">
                    {object}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSearchObject(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newSearchObject}
                  onChange={(e) => setNewSearchObject(e.target.value)}
                  placeholder="Adicionar objeto de busca"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSearchObject}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Observações</Label>
            <Textarea
              value={peculiarities.observations}
              onChange={(e) =>
                handleMedicalChange("observations", e.target.value)
              }
              placeholder="Observações gerais sobre a operação"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label>Riscos Identificados</Label>
            <Textarea
              value={peculiarities.risks}
              onChange={(e) => handleMedicalChange("risks", e.target.value)}
              placeholder="Riscos e precauções necessárias"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. APH – Médico</CardTitle>
          <CardDescription>
            Atendimento pré-hospitalar e suporte médico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Socorristas</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={medical.medic}
                  onChange={(e) => handleMedicalChange("medic", e.target.value)}
                  placeholder="Nome do socorrista"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Equipamentos / Procedimentos</Label>
            <Textarea
              value={medical.procedures}
              onChange={(e) =>
                handleMedicalChange("procedures", e.target.value)
              }
              placeholder="Procedimentos de atendimento"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Hospital de Referência</Label>
              <Input
                value={
                  locations.find((l) => l.type === "hospital")?.name || ""
                }
                onChange={(e) => {
                  const hospitalLocation = locations.find(
                    (l) => l.type === "hospital",
                  );
                  if (hospitalLocation) {
                    setNewLocation({ ...hospitalLocation, name: e.target.value });
                  } else {
                    // Handle case where hospital location doesn't exist yet
                    // This might require a more robust way to manage locations
                    // For now, just update the medical.hospitalContact
                    handleMedicalChange("hospitalContact", e.target.value);
                  }
                }}
                placeholder="Nome do hospital"
              />
            </div>
            <div className="grid gap-2">
              <Label>Telefone do Hospital</Label>
              <Input
                value={medical.hospitalContact}
                onChange={(e) =>
                  handleMedicalChange("hospitalContact", e.target.value)
                }
                placeholder="(61) 3550-8900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10. Medidas Complementares</CardTitle>
          <CardDescription>Ações adicionais necessárias</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {complementaryMeasures.map((measure, index) => (
              <div key={measure} className="flex items-center gap-2">
                <Badge variant="outline" className="flex-1 justify-start">
                  {measure}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMeasure(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={newMeasure}
                onChange={(e) => setNewMeasure(e.target.value)}
                placeholder="Adicionar medida complementar"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addMeasure}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>11. Resumo das Rotas</CardTitle>
          <CardDescription>Rotas e trajetos da operação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {routes.map((route, _index) => (
              <div
                key={route.id}
                className="flex items-center gap-2 p-3 border rounded"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {route.origin} → {route.destination}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {route.distance && `Distância: ${route.distance}`}
                    {route.duration && ` • Tempo: ${route.duration}`}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRoute(route.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newRoute.origin}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, origin: e.target.value })
                }
                placeholder="Origem"
              />
              <Input
                value={newRoute.destination}
                onChange={(e) =>
                  setNewRoute({
                    ...newRoute,
                    destination: e.target.value,
                  })
                }
                placeholder="Destino"
              />
              <Input
                value={newRoute.distance}
                onChange={(e) =>
                  setNewRoute({
                    ...newRoute,
                    distance: e.target.value,
                  })
                }
                placeholder="Distância"
              />
              <Input
                value={newRoute.duration}
                onChange={(e) =>
                  setNewRoute({
                    ...newRoute,
                    duration: e.target.value,
                  })
                }
                placeholder="Tempo estimado"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addRoute}
              className="w-full bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Rota
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>12. Resumo das Localizações</CardTitle>
          <CardDescription>Pontos importantes da operação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {locations.map((location) => (
              <div
                key={location.id}
                className="flex items-center gap-2 p-3 border rounded"
              >
                <div className="flex-1">
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {location.coordinates &&
                      `Coordenadas: ${location.coordinates}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {location.address && `Referência: ${location.address}`}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLocation(location.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="grid gap-2">
              <Input
                value={newLocation.name}
                onChange={(e) =>
                  setNewLocation({
                    ...newLocation,
                    name: e.target.value,
                  })
                }
                placeholder="Nome da localização"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={newLocation.coordinates}
                  onChange={(e) =>
                    setNewLocation({
                      ...newLocation,
                      coordinates: e.target.value,
                    })
                  }
                  placeholder="Coordenadas GPS"
                />
                <Input
                  value={newLocation.address}
                  onChange={(e) =>
                    setNewLocation({
                      ...newLocation,
                      address: e.target.value,
                    })
                  }
                  placeholder="Ponto de referência"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addLocation}
              className="w-full bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Localização
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
