import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { OperationalPlanning } from '@/types/operational-planning';
import { getUserById } from '@/lib/user-management';

// Register a font if needed (e.g., for special characters or consistent look)
// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/1.0.0/fonts/Roboto/roboto-light-webfont.ttf'
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica', // Default font
  },
  section: {
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  text: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.5,
  },
  badge: {
    fontSize: 8,
    backgroundColor: '#007bff', // Example color
    color: '#ffffff',
    padding: 3,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    backgroundColor: '#007bff',
    borderRadius: 3,
    marginRight: 8,
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // Approx half width for two columns
    marginBottom: 10,
  },
});

interface OperationalPlanningPDFViewProps {
  planning: OperationalPlanning;
}

export const OperationalPlanningPDFView: React.FC<OperationalPlanningPDFViewProps> = ({ planning }) => {
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    if (planning?.createdBy) {
      const fetchCreator = async () => {
        try {
          const user = await getUserById(planning.createdBy);
          setCreatorName(user?.name || "Desconhecido");
        } catch (error) {
          console.error("Failed to fetch creator name for PDF:", error);
          setCreatorName("Erro ao carregar");
        }
      };
      fetchCreator();
    } else {
      setCreatorName("");
    }
  }, [planning?.createdBy]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Relatório de Planejamento Operacional</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>
          {planning.introduction.operationType} - {planning.introduction.serviceOrderNumber}
        </Text>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>1. Informações da Operação</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.text}>Ordem de Serviço: {planning.introduction.serviceOrderNumber}</Text>
              <Text style={styles.text}>Tipo de Operação: {planning.introduction.operationType}</Text>
              <Text style={styles.text}>Unidade de Apoio: {planning.introduction.supportUnit}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.text}>Tipo de Mandado: {planning.introduction.mandateType}</Text>
              <Text style={styles.text}>Data: {planning.introduction.operationDate}</Text>
              <Text style={styles.text}>Horário: {planning.introduction.operationTime}</Text>
            </View>
          </View>
        </View>

        {/* Targets */}
        {planning.targets && planning.targets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>2. Alvos</Text>
            {planning.targets.map((target) => (
              <View key={target.id} style={{ marginBottom: 10 }}>
                <Text style={styles.text}>Nome: {target.name} {target.alias ? `(${target.alias})` : ''}</Text>
                <Text style={styles.text}>Descrição: {target.description}</Text>
                {target.observations && <Text style={styles.text}>Observações: {target.observations}</Text>}
                {target.address && (
                  <View style={{ marginLeft: 10, marginTop: 5, padding: 5, backgroundColor: '#F5F5F5', borderRadius: 3 }}>
                    <Text style={styles.text}>Endereço: {target.address}</Text>
                    {/* Assuming address.description and address.alias are part of target.address or related */}
                    {/* <Text style={styles.text}>{target.address.description} - {target.address.alias}</Text> */}
                    {target.coordinates && <Text style={styles.text}>Coordenadas: {target.coordinates}</Text>}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Assignments (Functions) */}
        {planning.assignments && planning.assignments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>3. Quadro de Funções</Text>
            {planning.assignments.map((assignment) => (
              <View key={assignment.id} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.text}>
                  {assignment.operatorName} - {assignment.assignedFunctions.map(f => f.name).join(", ")} ({assignment.vehiclePrefix})
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Schedule */}
        {planning.schedule && planning.schedule.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>4. Cronograma</Text>
            {planning.schedule.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.text}>
                  {item.time}: {item.activity}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Communications */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>5. Comunicações</Text>
          <Text style={styles.text}>Chamada Viatura: {planning.communications.vehicleCall}</Text>
          {planning.communications.operatorCall && <Text style={styles.text}>Chamada Operador: {planning.communications.operatorCall}</Text>}
        </View>

        {/* Peculiarities */}
        {planning.peculiarities && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>6. Peculiaridades</Text>
            {planning.peculiarities.observations && <Text style={styles.text}>Observações: {planning.peculiarities.observations}</Text>}
            {planning.peculiarities.risks && <Text style={styles.text}>Riscos: {planning.peculiarities.risks}</Text>}
            {planning.peculiarities.searchObjects && planning.peculiarities.searchObjects.length > 0 && (
              <View style={{ marginTop: 5 }}>
                <Text style={styles.text}>Objetos de Busca:</Text>
                {planning.peculiarities.searchObjects.map((obj, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.text}>{obj}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Medical */}
        {planning.medical && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>7. APH - Médico</Text>
            <Text style={styles.text}>Médico(s):</Text>
            {planning.medical.medic && planning.medical.medic.split(', ').map((name, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.text}>{name}</Text>
              </View>
            ))}
            {!planning.medical.medic && <Text style={styles.text}>Nenhum socorrista APH definido.</Text>}
            <Text style={styles.text}>Viatura para Transporte: {planning.medical.vehicleForTransport}</Text>
            <Text style={styles.text}>Contato Hospital: {planning.medical.hospitalContact}</Text>
            {planning.medical.procedures && <Text style={styles.text}>Procedimentos: {planning.medical.procedures}</Text>}
          </View>
        )}

        {/* Complementary Measures */}
        {planning.complementaryMeasures && planning.complementaryMeasures.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>8. Medidas Complementares</Text>
            {planning.complementaryMeasures.map((measure, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.text}>{measure}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Routes */}
        {planning.routes && planning.routes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>9. Rotas</Text>
            {planning.routes.map((route) => (
              <View key={route.id} style={{ marginBottom: 5 }}>
                <Text style={styles.text}>
                  {route.origin} → {route.destination} ({route.distance} / {route.duration})
                </Text>
                {route.mapUrl && <Text style={styles.text}>Mapa: {route.mapUrl}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Locations */}
        {planning.locations && planning.locations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>10. Localizações</Text>
            {planning.locations.map((location) => (
              <View key={location.id} style={{ marginBottom: 5 }}>
                <Text style={styles.text}>Nome: {location.name}</Text>
                {location.coordinates && <Text style={styles.text}>Coordenadas: {location.coordinates}</Text>}
                {location.phone && <Text style={styles.text}>Tel: {location.phone}</Text>}
                {location.mapUrl && <Text style={styles.text}>Mapa: {location.mapUrl}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Metadata */}
        <View style={{ ...styles.section, borderBottomWidth: 0, paddingTop: 10 }}>
          <Text style={{ fontSize: 8, color: '#666666' }}>
            Criado por {creatorName} em {planning.createdAt.toLocaleDateString('pt-BR')}
          </Text>
          <Text style={{ fontSize: 8, color: '#666666' }}>
            Última atualização: {planning.updatedAt.toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </Page>
    </Document>
  );
}