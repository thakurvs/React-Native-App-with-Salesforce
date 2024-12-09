export const presets = ['module:metro-react-native-babel-preset'];
export const plugins = [
    [
        'module:react-native-dotenv',
        {
            moduleName: '@env', // This specifies the module name to import environment variables
            path: '.env', // The path to your .env file
        },
    ],
];
  