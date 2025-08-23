import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlanningFormData, blankLocation } from '@/hooks/use-operational-planning-form';
import type { Location } from '@/types/operational-planning';

interface TargetsFormSectionProps {
  locations: Location[];
}

export function TargetsFormSection({ locations }: TargetsFormSectionProps) {
  const { control, register, setValue } = useFormContext<PlanningFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'targets',
  });

  const handleAddTarget = () => {
    append({
      targetName: '',
      description: '',
      location: blankLocation(),
    });
  };

  const handleLocationSelect = (locationId: string, targetIndex: number) => {
    const selectedLocation = locations.find(loc => loc.id === locationId);
    if (selectedLocation) {
      setValue(`targets.${targetIndex}.location`, selectedLocation, { shouldValidate: true });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Alvos da Operação</CardTitle>
        <CardDescription>
          Adicione e gerencie os alvos. Para cada alvo, você pode carregar uma localização existente ou cadastrar uma nova.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`target-name-${index}`}>Nome do Alvo</Label>
                  <Input
                    id={`target-name-${index}`}
                    placeholder="Nome completo ou identificação do alvo"
                    {...register(`targets.${index}.targetName`)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`target-desc-${index}`}>Descrição do Alvo</Label>
                  <Textarea
                    id={`target-desc-${index}`}
                    placeholder="Detalhes sobre o alvo"
                    rows={1}
                    {...register(`targets.${index}.description`)}
                  />
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-md space-y-3">
                <h4 className="text-sm font-medium">Localização do Alvo</h4>
                <div className="grid gap-2">
                    <Label>Carregar Localização Existente (Opcional)</Label>
                    <Select onValueChange={(value) => handleLocationSelect(value, index)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione para carregar dados..." />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((loc) => (
                                <SelectItem key={loc.id} value={loc.id}>
                                    {loc.name} ({loc.address})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor={`location-name-${index}`}>Nome do Local</Label>
                        <Input id={`location-name-${index}`} {...register(`targets.${index}.location.name`)} placeholder="Ex: Residência Principal"/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={`location-address-${index}`}>Endereço</Label>
                        <Input id={`location-address-${index}`} {...register(`targets.${index}.location.address`)} placeholder="Rua, Número, Bairro..."/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={`location-lat-${index}`}>Latitude</Label>
                        <Input id={`location-lat-${index}`} type="number" {...register(`targets.${index}.location.latitude`)} placeholder="-23.550520"/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={`location-lon-${index}`}>Longitude</Label>
                        <Input id={`location-lon-${index}`} type="number" {...register(`targets.${index}.location.longitude`)} placeholder="-46.633308"/>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddTarget}
          className="w-full mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Alvo
        </Button>
      </CardContent>
    </Card>
  );
}