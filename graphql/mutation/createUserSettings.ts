import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreateUserSettings($userSettings: UserSettingsInput!){
  CreateUserSettings(userSettings: $userSettings) {
    currency
    locale
  }
}
`;
export default mutation;
