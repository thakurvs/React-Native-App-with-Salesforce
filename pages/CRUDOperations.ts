import { getTokens } from '../authUtils';

// Salesforce API version
const API_VERSION = 'v57.0';

// Helper to perform authenticated API requests
const performRequest = async (endpoint: string, method: string, data?: object) => {
  const tokens = await getTokens();
  if (!tokens || !tokens.accessToken || !tokens.instanceUrl) {
    throw new Error('No valid tokens found');
  }

  const url = `${tokens.instanceUrl}/services/data/${API_VERSION}/${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Salesforce API error: ${response.status} - ${errorText}`);
  }
  return response.json();
};

// Retrieve a record by ID
export const getRecordById = async (recordId: string, objectType: string, fields: string[]) => {
  const fieldsQuery = fields.join(',');
  const endpoint = `sobjects/${objectType}/${recordId}?fields=${fieldsQuery}`;
  return performRequest(endpoint, 'GET');
};

// Create a new record
export const createRecord = async (objectType: string, data: object) => {
  const endpoint = `sobjects/${objectType}`;
  return performRequest(endpoint, 'POST', data);
};

// Update an existing record
export const updateRecord = async (objectType: string, recordId: string, data: object) => {
  const endpoint = `sobjects/${objectType}/${recordId}`;
  return performRequest(endpoint, 'PATCH', data);
};

// Delete a record
export const deleteRecord = async (objectType: string, recordId: string) => {
  const endpoint = `sobjects/${objectType}/${recordId}`;
  return performRequest(endpoint, 'DELETE');
};
