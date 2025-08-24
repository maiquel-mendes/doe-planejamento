import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { OperationalPlanning, OperationalFunction } from '@/types/operational-planning';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
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
    width: '48%',
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#333333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#e8ecef',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tableCell: {
    flex: 1,
    padding: 6,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#333333',
  },
  tableCellLast: {
    flex: 1,
    padding: 6,
    fontSize: 10,
  },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

interface OperationalPlanningPDFViewProps {
  planning: OperationalPlanning;
}

export const OperationalPlanningPDFView: React.FC<OperationalPlanningPDFViewProps> = ({ planning }) => {
  const creatorName = planning.createdBy?.name || 'Desconhecido';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Relatório de Planejamento Operacional</Text>
        <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 20 }}>
          {planning.introduction?.operationType} - {planning.introduction?.serviceOrderNumber}
        </Text>

        {/* Introduction */}
        {planning.introduction && (
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
        )}

        {/* Targets */}
        {planning.targets && planning.targets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>2. Alvos</Text>
            {planning.targets.map((target) => (
              <View key={target.id} style={{ marginBottom: 10, padding: 5, backgroundColor: '#F5F5F5', borderRadius: 3 }}>
                <Text style={styles.text}>Nome do Alvo: {target.targetName}</Text>
                {target.description && <Text style={styles.text}>Descrição: {target.description}</Text>}
                {target.location && (
                  <View style={{ marginLeft: 10, marginTop: 5 }}>
                    <Text style={styles.text}>Local: {target.location.name}</Text>
                    <Text style={styles.text}>Endereço: {target.location.address || 'N/A'}</Text>
                    <Text style={styles.text}>Coordenadas: Lat: {target.location.latitude}, Lon: {target.location.longitude}</Text>
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
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.headerText]}>Operador</Text>
                <Text style={[styles.tableCell, styles.headerText]}>Funções</Text>
                <Text style={[styles.tableCellLast, styles.headerText]}>Viatura</Text>
              </View>
              {/* Table Rows */}
              {planning.assignments.map((assignment) => (
                <View key={assignment.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{assignment.user.name}</Text>
                  <Text style={styles.tableCell}>
                    {(assignment.functions as OperationalFunction[]).map(f => f.name).join(' / ')}
                  </Text>
                  <Text style={styles.tableCellLast}>
                    {assignment.vehicle ? assignment.vehicle.prefix : '-'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Schedule */}
        {planning.scheduleItems && planning.scheduleItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>4. Cronograma</Text>
            {planning.scheduleItems.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.text}>
                  {new Date(item.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}: {item.activity}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Peculiarities */}
        {planning.peculiarities && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>5. Peculiaridades</Text>
            <Text style={styles.text}>{planning.peculiarities}</Text>
          </View>
        )}

        {/* Medical */}
        {planning.medicalPlan && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>6. Plano Médico</Text>
            <Text style={styles.text}>Procedimentos: {planning.medicalPlan.procedures || 'N/A'}</Text>
            {planning.assignments
              .filter(assignment => (assignment.functions as OperationalFunction[]).some(f => f.name === 'APH'))
              .map(item => (
                <View key={item.id} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.text}>
                    {item.user.name} - APH
                  </Text>
                </View>
              ))}
          </View>
        )}

        {/* Metadata */}
        <View style={{ ...styles.section, borderBottomWidth: 0, paddingTop: 10 }}>
          <Text style={{ fontSize: 8, color: '#666666' }}>
            Criado por {creatorName} em {new Date(planning.createdAt).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={{ fontSize: 8, color: '#666666' }}>
            Última atualização: {new Date(planning.updatedAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};