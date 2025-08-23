
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { generatePdf } from '@/components/pdf-generator';
import { OperationalPlanningPDFView } from '@/components/planning/operational-planning-pdf-view';
import { Button } from '@/components/ui/button';
import { getOperationalPlanningById } from '@/lib/operational-planning-management';
import { getUserById } from '@/lib/user-management';
import type { OperationalPlanning } from '@/types/operational-planning';
import { OperationalPlanningDisplay } from '@/components/planning/operational-planning-display';

export default function OperationalPlanningDetailPage() {
  const params = useParams();
  const router = useRouter();

  if (!params || !params.id) {
    notFound();
  }

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [planning, setPlanning] = useState<OperationalPlanning | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPlanning = async () => {
      try {
        const data = await getOperationalPlanningById(id);
        if (!data) {
          notFound();
        } else {
          setPlanning(data);
        }
      } catch (error) {
        console.error('Failed to fetch planning data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanning();
  }, [id]);

  useEffect(() => {
    if (planning?.createdBy) {
      const fetchCreator = async () => {
        try {
          const user = await getUserById(planning.createdBy.id);
          setCreatorName(user?.name || "Desconhecido");
        } catch (error) {
          console.error("Failed to fetch creator name:", error);
          setCreatorName("Erro ao carregar");
        }
      };
      fetchCreator();
    } else {
      setCreatorName("");
    }
  }, [planning?.createdBy]);

  const handleGeneratePdf = async () => {
    if (!planning) return;

    setIsGeneratingPdf(true);
    try {
      await generatePdf(
        <OperationalPlanningPDFView planning={planning} />,
        `planejamento-${planning.introduction?.serviceOrderNumber}.pdf`,
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!planning) {
    return null; // Or a more user-friendly not found component
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-4xl mx-auto bg-background p-6 rounded-lg 
      shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-primary">
            {planning.introduction?.operationType} -
            {planning.introduction?.serviceOrderNumber}
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">
          {planning.introduction?.operationDate} às
          {planning.introduction?.operationTime} -
          {planning.introduction?.supportUnit}
        </p>


        <div className="mb-6">
          <Button onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
            {isGeneratingPdf ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              'Gerar Relatório PDF'
            )}
          </Button>
        </div>

        <OperationalPlanningDisplay planning={planning} />

        {/* Metadata */}
        <div className="pt-4 border-t space-y-2 mt-6">
          <div className="text-xs text-muted-foreground">
            Criado por {creatorName} em
            {planning.createdAt.toLocaleDateString('pt-BR')}
          </div>
          <div className="text-xs text-muted-foreground">
            Última atualização: {planning.updatedAt.toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    </div>

  );
}