import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTokens } from '../authUtils';
import { RootStackParamList } from '../types'; // Import navigation types
import { StackNavigationProp } from '@react-navigation/stack'; // Import the type for stack navigation

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>; // Typing for Home screen

const HomePage: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const navigation = useNavigation<HomePageNavigationProp>(); // Apply the type to useNavigation()

  // Fetch records from Salesforce
  const fetchRecords = async () => {
    try {
      const tokens = await getTokens();
      if (!tokens || !tokens.accessToken || !tokens.instanceUrl) {
        console.error('No valid tokens found. User needs to log in.');
        return;
      }

      // Salesforce REST API request
      const response = await fetch(`${tokens.instanceUrl}/services/data/v57.0/query?q=SELECT+Id,First_Name,Last_Name,Email,Phone+FROM+Contact`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecords(data.records || []);
      } else {
        const errorText = await response.text();
        console.error('Error fetching records:', errorText);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Detail', { recordId: item.Id })}
          >
            <Text style={styles.item}>{item.First_Name}</Text>
            <Text style={styles.item}>{item.Last_Name}</Text>
            <Text style={styles.item}>{item.Email}</Text>
            <Text style={styles.item}>{item.Phone}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default HomePage;
