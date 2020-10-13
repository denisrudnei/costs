import ggl from 'graphql-tag';

export const sendResetMail = ggl`
  mutation SendResetEmail ($email: String!){
    SendResetEmail(email: $email)
  }
`;
