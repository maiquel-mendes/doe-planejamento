import { Plus, Upload, X } from "lucide-react";
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
import type { OperationalPlanning, Target } from "@/types/operational-planning";

interface TargetsFormSectionProps {
  targets: OperationalPlanning["targets"];
  newTarget: Target;
  setNewTarget: (target: Target) => void;
  addTarget: () => void;
  removeTarget: (id: string) => void;
}

export function TargetsFormSection({
  targets,
  newTarget,
  setNewTarget,
  addTarget,
  removeTarget,
}: TargetsFormSectionProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>2. Alvos da Operação</CardTitle>
          <CardDescription>
            Adicione e gerencie os alvos envolvidos na operação.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {targets.map((target) => (
              <div
                key={target.id}
                className="flex items-center gap-2 p-3 border rounded"
              >
                <div className="flex-1">
                  <div className="font-medium">{target.name}</div>
                  {target.alias && (
                    <div className="text-sm text-muted-foreground">
                      ({target.alias})
                    </div>
                  )}
                  {target.address && (
                    <div className="text-sm text-muted-foreground">
                      {target.address}
                    </div>
                  )}
                  {target.description && (
                    <div className="text-sm text-muted-foreground">
                      {target.description}
                    </div>
                  )}
                  {target.observations && (
                    <div className="text-sm text-muted-foreground">
                      Obs: {target.observations}
                    </div>
                  )}
                  {target.coordinates && (
                    <div className="text-sm text-muted-foreground">
                      Coord: {target.coordinates}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTarget(target.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid gap-2">
            <Label>Nome do Alvo</Label>
            <Input
              value={newTarget.name}
              onChange={(e) =>
                setNewTarget({ ...newTarget, name: e.target.value })
              }
              placeholder="Nome completo do alvo"
            />
          </div>
          <div className="grid gap-2">
            <Label>Apelido (opcional)</Label>
            <Input
              value={newTarget.alias}
              onChange={(e) =>
                setNewTarget({ ...newTarget, alias: e.target.value })
              }
              placeholder="Apelido ou nome conhecido"
            />
          </div>
          <div className="grid gap-2">
            <Label>Endereço</Label>
            <Input
              value={newTarget.address}
              onChange={(e) =>
                setNewTarget({ ...newTarget, address: e.target.value })
              }
              placeholder="Endereço completo do alvo"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label>Coordenadas GPS (opcional)</Label>
              <Input
                value={newTarget.coordinates}
                onChange={(e) =>
                  setNewTarget({
                    ...newTarget,
                    coordinates: e.target.value,
                  })
                }
                placeholder="Ex: -15.7801, -47.9292"
              />
            </div>
            <div className="grid gap-2">
              <Label>Descrição / Observações (opcional)</Label>
              <Input
                value={newTarget.description}
                onChange={(e) =>
                  setNewTarget({
                    ...newTarget,
                    description: e.target.value,
                  })
                }
                placeholder="Detalhes adicionais sobre o alvo"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Observações Gerais (opcional)</Label>
            <Textarea
              value={newTarget.observations}
              onChange={(e) =>
                setNewTarget({
                  ...newTarget,
                  observations: e.target.value,
                })
              }
              placeholder="Observações gerais sobre o alvo"
              rows={2}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addTarget}
            className="w-full bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Alvo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Imagens</CardTitle>
          <CardDescription>Anexar imagens relevantes à operação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Clique para adicionar imagens ou arraste e solte aqui
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG até 10MB
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
