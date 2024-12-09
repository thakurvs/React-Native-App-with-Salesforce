import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { getRecordById } from './CRUDOperations'; // Import CRUD function
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Import your central type file

// Define the types for route and navigation
type DetailPageRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailPageNavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;

interface DetailPageProps {
  route: DetailPageRouteProp;
  navigation: DetailPageNavigationProp;
}

const DetailPage: React.FC<DetailPageProps> = ({ route, navigation }) => {
  const { recordId } = route.params; // Extract recordId from route params
  const [record, setRecord] = useState<{ Id: string; First_Name: string; Last_Name: string; Email: string; Phone: string } | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [firstname, setFirstName] = useState<string>('');
  const [lastname, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await getRecordById(recordId, 'Contact', ['Id', 'First_Name', 'Last_Name', 'Email', 'Phone']);
        setRecord(response);
        setFirstName(response.First_Name);
        setLastName(response.Last_Name);
        setEmail(response.Email);
        setPhone(response.Phone);
      } catch (error) {
        console.error('Error fetching record:', error);
      }
    };

    fetchRecord();
  }, [recordId]);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleDelete = () => navigation.navigate('CRUD', { recordId, action: 'delete' });
  const handleSave = () => navigation.navigate('CRUD', { recordId, action: 'update', record: { firstname, lastname, email, phone } });

  return (
    <View style={styles.container}>
      {record ? (
        <>
          <Text style={styles.title}>{editing ? 'Edit Contact' : record.First_Name}</Text>
          <TextInput
            style={styles.input}
            value={firstname}
            onChangeText={setFirstName}
            editable={editing}
            placeholder="First Name"
          />
          <TextInput
            style={styles.input}
            value={lastname}
            onChangeText={setLastName}
            editable={editing}
            placeholder="Last Name"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={editing}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            editable={editing}
            placeholder="Phone"
          />
          {editing ? (
            <>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={handleCancel} />
            </>
          ) : (
            <>
              <Button title="Edit" onPress={handleEdit} />
              <Button title="Delete" onPress={handleDelete} color="red" />
            </>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    fontSize: 18,
  },
});

export default DetailPage;
