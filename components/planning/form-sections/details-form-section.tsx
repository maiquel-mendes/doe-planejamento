import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { PlanningFormData } from '@/hooks/use-operational-planning-form';
import type { Location, Vehicle, OperationalFunction } from '@/types/operational-planning';
import type { User } from '@/types/auth';

interface DetailsFormSectionProps {
  locations: Location[];
  vehicles: Vehicle[];
  users: User[];
  functions: OperationalFunction[];
}

export function DetailsFormSection({ locations, vehicles, users, functions }: DetailsFormSectionProps) {
  const { register, setValue, getValues, watch } = useFormContext<PlanningFormData>();

  const assignments = watch('assignments');

  const aphMedics = useMemo(() => {
    const aphFunctionCategory = 'APH';
    return assignments
      ?.map(assignment => {
        // Find if any of the assigned functions for this assignment are APH category
        const hasAphFunction = assignment.functionIds?.some(funcId => {
          const func = functions.find(f => f.id === funcId);
          return func?.category === aphFunctionCategory;
        });

        if (hasAphFunction) {
          return users.find(u => u.id === assignment.userId);
        }
        return null;
      })
      .filter((user): user is User => user !== null) || [];
  }, [assignments, users, functions]);


  const handleHospitalSelect = (locationId: string) => {
    const selectedLocation = locations.find(loc => loc.id === locationId);
    if (selectedLocation) {
      setValue('medicalPlan.hospitalLocation', selectedLocation, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Peculiaridades</CardTitle>
          <CardDescription>Informações específicas da operação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="peculiarities">Peculiaridades da Operação</Label>
            <Textarea
              id="peculiarities"
              placeholder="Descreva quaisquer peculiaridades, como objetos de busca, observações gerais ou riscos identificados."
              rows={5}
              {...register('peculiarities')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>APH – Médico</CardTitle>
          <CardDescription>Atendimento pré-hospitalar e suporte médico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid gap-2">
            <Label>Socorristas (Definidos no Quadro de Funções)</Label>
            <div className="p-3 bg-muted/50 rounded-md min-h-[40px] flex flex-wrap gap-2 items-center">
              {aphMedics.length > 0 ? (
                aphMedics.map(medic => (
                  <Badge key={medic.id} variant="secondary">{medic.name}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum operador com função APH atribuída.</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="medical-procedures">Procedimentos</Label>
            <Textarea
              id="medical-procedures"
              placeholder="Descreva os procedimentos de atendimento médico."
              rows={3}
              {...register('medicalPlan.procedures')}
            />
          </div>
          
          <div className="p-3 bg-muted/50 rounded-md space-y-3">
            <h4 className="text-sm font-medium">Hospital de Referência</h4>
            <div className="grid gap-2">
                <Label>Carregar Localização Existente (Opcional)</Label>
                <Select onValueChange={(value) => handleHospitalSelect(value)}>
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
                    <Label htmlFor="hospital-location-name">Nome do Local</Label>
                    <Input id="hospital-location-name" {...register('medicalPlan.hospitalLocation.name')} placeholder="Ex: Hospital Municipal"/>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="hospital-location-address">Endereço</Label>
                    <Input id="hospital-location-address" {...register('medicalPlan.hospitalLocation.address')} placeholder="Rua, Número, Bairro..."/>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="hospital-location-lat">Latitude</Label>
                    <Input id="hospital-location-lat" type="number" {...register('medicalPlan.hospitalLocation.latitude')} placeholder="-23.550520"/>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="hospital-location-lon">Longitude</Label>
                    <Input id="hospital-location-lon" type="number" {...register('medicalPlan.hospitalLocation.longitude')} placeholder="-46.633308"/>
                </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ambulance-vehicle">Viatura Ambulância</Label>
            <Select
              onValueChange={(value) => setValue('medicalPlan.ambulanceVehicleId', value)}
              value={getValues('medicalPlan.ambulanceVehicleId') || ''}
            >
              <SelectTrigger id="ambulance-vehicle">
                <SelectValue placeholder="Selecione a viatura" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.prefix} - {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}