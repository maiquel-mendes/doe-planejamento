import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext, useWatch, type Control, type UseFormRegister, type UseFormSetValue, type UseFormGetValues } from 'react-hook-form';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlanningFormData, blankLocation } from '@/hooks/use-operational-planning-form';
import type { Location } from '@/types/operational-planning';
import { ImageUploader } from "@/components/ui/image-uploader";
import { api } from "@/lib/api";

// Props for the new TargetRow component
interface TargetRowProps {
  index: number;
  control: Control<PlanningFormData>;
  register: UseFormRegister<PlanningFormData>;
  setValue: UseFormSetValue<PlanningFormData>;
  getValues: UseFormGetValues<PlanningFormData>;
  remove: (index: number) => void;
  locations: Location[];
}

// This is the new component that contains the hook call at the top level
function TargetRow({ index, control, register, setValue, getValues, remove, locations }: TargetRowProps) {
  const images = useWatch({ control, name: `targets.${index}.images` }) || [];

  const handleUploadSuccess = (data: { url: string; publicId: string }) => {
    const currentImages = getValues(`targets.${index}.images`) || [];
    // For new uploads, we don't have an ID from the DB yet, so we'll add it later if saved.
    setValue(`targets.${index}.images`, [...currentImages, { url: data.url, publicId: data.publicId }], { shouldValidate: true });
  };

  const handleRemoveImage = async (imageToRemove: { id?: string; url: string; publicId?: string }) => {
    const currentImages = getValues(`targets.${index}.images`) || [];
    const newImages = currentImages.filter(img => img.url !== imageToRemove.url);
    setValue(`targets.${index}.images`, newImages, { shouldValidate: true });

    // If the image has an ID, it means it's already saved in the DB, so we need to delete it from the backend.
    if (imageToRemove.id) {
      try {
        // Optimistic update: remove from UI first
        // This is already done by setValue above

        // Only attempt Cloudinary deletion if publicId is available
        if (imageToRemove.publicId) {
          const res = await api(`/api/images/${imageToRemove.id}`, {
            method: 'DELETE',
          });

          if (!res.ok) {
            // If deletion fails, revert the UI (or show an error message)
            setValue(`targets.${index}.images`, currentImages, { shouldValidate: true }); // Revert
            throw new Error('Failed to delete image from server.');
          }
        } else {
          // Image has an ID but no publicId (e.g., old data before publicId was added)
          // We still remove it from DB, but can't delete from Cloudinary via publicId
          // This scenario should ideally be handled by a data migration
          console.warn(`Image with ID ${imageToRemove.id} has no publicId. Cannot delete from Cloudinary.`);
          // Still proceed with DB deletion if needed, or just remove from UI if it's an old, unmanaged image.
          // For now, we assume the API will handle DB deletion based on ID.
          const res = await api(`/api/images/${imageToRemove.id}`, {
            method: 'DELETE',
          });
          if (!res.ok) {
            setValue(`targets.${index}.images`, currentImages, { shouldValidate: true }); // Revert
            throw new Error('Failed to delete image from server (no publicId).');
          }
        }
        // No need to do anything else, UI is already updated
      } catch (error) {
        console.error("Error deleting image:", error);
        // Optionally show a toast notification
      }
    }
  };

  const handleLocationSelect = (locationId: string) => {
    const selectedLocation = locations.find(loc => loc.id === locationId);
    if (selectedLocation) {
      setValue(`targets.${index}.location`, selectedLocation, { shouldValidate: true });
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4 relative">
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
          <Select onValueChange={(value) => handleLocationSelect(value)}>
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
            <Input id={`location-name-${index}`} {...register(`targets.${index}.location.name`)} placeholder="Ex: Residência Principal" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`location-address-${index}`}>Endereço</Label>
            <Input id={`location-address-${index}`} {...register(`targets.${index}.location.address`)} placeholder="Rua, Número, Bairro..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`location-lat-${index}`}>Latitude</Label>
            <Input id={`location-lat-${index}`} type="number" {...register(`targets.${index}.location.latitude`)} placeholder="-23.550520" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`location-lon-${index}`}>Longitude</Label>
            <Input id={`location-lon-${index}`} type="number" {...register(`targets.${index}.location.longitude`)} placeholder="-46.633308" />
          </div>
        </div>
      </div>

      <div className="p-3 bg-muted/50 rounded-md space-y-3">
        <h4 className="text-sm font-medium">Imagens do Alvo</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((image, imgIndex) => (
            <div key={image.url} className="relative group aspect-square">
              <Image src={image.url} alt={`Imagem do alvo ${index + 1}`} layout="fill" className="object-cover rounded-md" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveImage(image)}
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <ImageUploader onUploadSuccess={handleUploadSuccess} folder="planning_targets" />
      </div>
    </div>
  )
}


interface TargetsFormSectionProps {
  locations: Location[];
}

export function TargetsFormSection({ locations }: TargetsFormSectionProps) {
  const { control, register, setValue, getValues } = useFormContext<PlanningFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'targets',
  });

  const handleAddTarget = () => {
    append({
      targetName: '',
      description: '',
      location: blankLocation(),
      images: [], // Initialize images array
    });
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
            <TargetRow
              key={field.id}
              index={index}
              control={control}
              register={register}
              setValue={setValue}
              getValues={getValues}
              remove={remove}
              locations={locations}
            />
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