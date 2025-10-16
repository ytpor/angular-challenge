export const environment = {
  production: false,
  environment: 'development',
  apiUrl: 'http://apisix.local:9080/prod',
  keycloakUrl: 'http://keycloak.local:8080',
  keycloakRealm: 'my-challenge-realm',
  keycloakClientId: 'my-angular-client',
  tokenRefreshBuffer: 10,
  idleSecond: 1800,
  timeoutSecond: 5
};
