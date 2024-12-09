import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { createRecord, updateRecord, deleteRecord } from './CRUDOperations';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Import RootStackParamList
import { RootStackParamList } from '../types';

type CRUDPageRouteProp = RouteProp<RootStackParamList, 'CRUD'>;
type CRUDPageNavigationProp = StackNavigationProp<RootStackParamList, 'CRUD'>;

interface CRUDPageProps {
  route: CRUDPageRouteProp;
  navigation: CRUDPageNavigationProp;
}

const CRUDPage: React.FC<CRUDPageProps> = ({ route, navigation }) => {
  const { action, recordId, record } = route.params;

  useEffect(() => {
    const performAction = async () => {
      try {
        if (action === 'create') {
          const newRecord = await createRecord('Contact', record || {});
          console.log('Record created:', newRecord);
        } else if (action === 'update') {
          const updatedRecord = await updateRecord('Contact', recordId!, record || {});
          console.log('Record updated:', updatedRecord);
        } else if (action === 'delete') {
          await deleteRecord('Contact', recordId!);
          console.log('Record deleted');
        }
        navigation.goBack();
      } catch (error) {
        console.error(`Error performing ${action} operation:`, error);
      }
    };

    performAction();
  }, [action, record, recordId, navigation]);

  return (
    <View>
      <Text>Performing {action} operation...</Text>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default CRUDPage;
