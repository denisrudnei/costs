import ggl from 'graphql-tag';

export const resetFromReceiveEmail = ggl`
  mutation ResetFromReceivedEmail ($token: String!, $newPassword: String!) {
    ResetFromReceivedEmail(token: $token, newPassword: $newPassword)
  }
`;
