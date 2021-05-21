import {API_PREFIX, APP_CONFIGURATION_ENDPOINT, CONFIGURATION_ENDPOINT, QUICKSEARCH_ENDPOINT} from '../steps/endpoints';

beforeEach(() => {
  // Activate serving by default
  cy.server();
  //
  // // this is some external resource which yasgui seems to be requesting
  // cy.route('GET', 'http://prefix.cc/popular/all.file.json', 'fixture:sparql-search/all.file.json');
  //
  // // Default 404 stub
  // cy.intercept(`**/${API_PREFIX}/**`, {statusCode: 404});
  //
  // // Default stubs
  // cy.route('GET', '/sockjs-node/info?t=*', 'fixture:sockjs-info.json');
  // cy.route('GET', '/assets/i18n/en.json', 'fixture:en.json');
  // cy.route('GET', '/assets/novasenta_w.png', 'fixture:novasenta_w.png');
  // cy.route('GET', `${QUICKSEARCH_ENDPOINT}?resultType=*`, 'fixture:search/quick-search-clinical-studies.json');
  // cy.intercept('GET', `**/${APP_CONFIGURATION_ENDPOINT}`, {fixture: 'app-configuration.json'});
  // cy.intercept('GET', `**/${CONFIGURATION_ENDPOINT}`, {fixture: 'search/search-configuration.json'});
  //
  // // default search stubs
  // cy.route('GET', `${API_PREFIX}/search/search/counter?resultType=*&q=*`, '50000');
  // cy.route('GET', `${API_PREFIX}/resource/node`, 'fixture:search/resource-roots-response.json');
  //
  // // never expires, adminЗ
  // localStorage.setItem('AUTH_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdhMzEwMzg3ZCJ9.eyJleHAiOjk5OTk5OTk5OTksImlhdCI6MTYxNDIzOTM4MCwiaXNzIjoiYWNtZS5jb20iLCJzdWIiOiIyNTJlMGZhYy1hNjY0LTQwYjQtOTA4OC01ZTcyNDI3ODY3NWQiLCJqdGkiOiI5MjM0NjRiNi0xMWQ3LTQ3YjctOTZiMi0zYjg1MTMxMjVjMDMiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsImVtYWlsIjoiYWRtaW5AMTIzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsImFwcGxpY2F0aW9uSWQiOiJlM2NkY2U4OC0xOWE0LTQwN2UtODIzMi1kZTliMjBhMDY2NWYiLCJyb2xlcyI6WyJzeXN0ZW1hZG1pbiJdfQ.tFv-dI_mdjcrLW8jPryi8jj2Y-LnNG99Jf7HDkyALT8');
  // localStorage.setItem('AUTH_REFRESH_KEY', 'RefreshKeyIsPresent');
});
