import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { OperationalPlanning } from "@/types/operational-planning";

interface IntroductionFormSectionProps {
  introduction: OperationalPlanning["introduction"];
  onFieldChange: (field: keyof OperationalPlanning["introduction"], value: string) => void;
}

export function IntroductionFormSection({
  introduction,
  onFieldChange,
}: IntroductionFormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Introdução</CardTitle>
        <CardDescription>Informações básicas da operação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Ordem de Serviço</Label>
            <Input
              value={introduction.serviceOrderNumber}
              onChange={(e) => onFieldChange("serviceOrderNumber", e.target.value)}
              placeholder="Ex: 013/2025 – DOE"
            />
          </div>
          <div className="grid gap-2">
            <Label>Tipo de Operação</Label>
            <Input
              value={introduction.operationType}
              onChange={(e) => onFieldChange("operationType", e.target.value)}
              placeholder="Ex: Busca e Apreensão"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Unidade de Apoio</Label>
            <Input
              value={introduction.supportUnit}
              onChange={(e) => onFieldChange("supportUnit", e.target.value)}
              placeholder="Ex: P11, DOE"
            />
          </div>
          <div className="grid gap-2">
            <Label>Tipo de Mandado</Label>
            <Select
              value={introduction.mandateType}
              onValueChange={(value) => onFieldChange("mandateType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="busca-apreensao">
                  Busca e Apreensão
                </SelectItem>
                <SelectItem value="mandado-prisao">
                  Mandado de Prisão
                </SelectItem>
                <SelectItem value="busca-prisao">
                  Busca e Apreensão + Mandado de Prisão
                </SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Data da Operação</Label>
            <Input
              type="date"
              value={introduction.operationDate}
              onChange={(e) => onFieldChange("operationDate", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Horário da Operação</Label>
            <Input
              type="time"
              value={introduction.operationTime}
              onChange={(e) => onFieldChange("operationTime", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Descrição</Label>
          <Textarea
            value={introduction.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            placeholder="Descrição da introdução"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
