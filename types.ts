export type RootStackParamList = {
    Login: undefined; // No parameters for Login screen
    Home: undefined;  // No parameters for Home screen
    Detail: { recordId: string };
    CRUD: { action: string; recordId?: string; record?: { firstname: string; lastname: string; email: string; phone: string } }; // Params for CRUDPage
  };
  