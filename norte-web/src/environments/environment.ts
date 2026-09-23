/**
 * Producao. No container o Angular e servido por nginx, que faz proxy de /api para a API,
 * entao a URL relativa evita ter de reconstruir o bundle a cada mudanca de host.
 */
export const environment = {
  production: true,
  apiUrl: '/api/v1',
};
