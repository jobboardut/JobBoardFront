export const apiEndpoints = {
  dashboardOverview: '/dashboard/overview',
  usersDashboard: '/users/dashboard',
  validationOverview: '/validation/overview',
  managementOverview: '/management/overview',
  publicationsOverview: '/publications/overview',
  trackingOverview: '/tracking/overview',
  configurationOverview: '/configuration/overview',
} as const

export type ApiEndpointKey = keyof typeof apiEndpoints
