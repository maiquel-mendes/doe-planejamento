import { useFormContext, Controller } from 'react-hook-form';
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
import type { PlanningFormData } from '@/hooks/use-operational-planning-form';
import { useId } from 'react';

export function IntroductionFormSection() {
  const id = useId();
  const { register, control } = useFormContext<PlanningFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Introdução</CardTitle>
        <CardDescription>Informações básicas da operação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor={`${id}-service-order-number`}>Ordem de Serviço</Label>
            <Input
              id={`${id}-service-order-number`}
              placeholder="Ex: 013/2025 – DOE"
              {...register('introduction.serviceOrderNumber')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-operation-type`}>Tipo de Operação</Label>
            <Input
              id={`${id}-operation-type`}
              placeholder="Ex: Busca e Apreensão"
              {...register('introduction.operationType')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor={`${id}-support-unit`}>Unidade de Apoio</Label>
            <Input
              id={`${id}-support-unit`}
              placeholder="Ex: P11, DOE"
              {...register('introduction.supportUnit')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-mandate-type`}>Tipo de Mandado</Label>
            <Controller
              control={control}
              name="introduction.mandateType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <SelectTrigger id={`${id}-mandate-type`}>
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
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor={`${id}-operation-date`}>Data da Operação</Label>
            <Input
              id={`${id}-operation-date`}
              type="date"
              {...register('introduction.operationDate')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-operation-time`}>Horário da Operação</Label>
            <Input
              id={`${id}-operation-time`}
              type="time"
              {...register('introduction.operationTime')}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${id}-introduction-description`}>Descrição</Label>
          <Textarea
            id={`${id}-introduction-description`}
            placeholder="Descrição da introdução"
            rows={3}
            {...register('introduction.description')}
          />
        </div>
      </CardContent>
    </Card>
  );
}