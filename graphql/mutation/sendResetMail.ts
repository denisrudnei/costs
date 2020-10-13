import ggl from 'graphql-tag';

export const sendResetMail = ggl`
  mutation SendResetEmail ($email: String!, $url: String!){
    SendResetEmail(email: $email, url: $url)
  }
`;
