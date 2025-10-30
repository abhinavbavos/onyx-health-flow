// Backend API Configuration
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:6000';

export const API_ENDPOINTS = {
  // Auth
  auth: {
    // User
    signup: '/api/auth/auth',
    verify: '/api/auth/auth-verify',
    issueToken: '/api/auth/issue-token',
    // Super Admin
    createSuperAdmin: '/api/auth/create/super-admin',
    verifySuperAdmin: '/api/auth/create/verify-super-admin',
    // Exec Admin
    createExecAdmin: '/api/auth/create/exec-admin',
    verifyExecAdmin: '/api/auth/create/verify-exec-admin',
    // Cluster Head
    createClusterHead: '/api/auth/create/cluster-head',
    verifyClusterHead: '/api/auth/create/verify-cluster-head',
    // User Head
    createUserHead: '/api/auth/create/user-head',
    verifyUserHead: '/api/auth/create/verify-user-head',
    // Nurse
    createNurse: '/api/auth/create/nurse',
    verifyNurse: '/api/auth/create/verify-nurse',
    // Technician
    createTechnician: '/api/auth/create/technician',
    verifyTechnician: '/api/auth/create/verify-technician',
    // Non-User
    signinNonUser: '/api/auth/signin-non-user',
    verifyNonUser: '/api/auth/verify-non-user',
  },
  // Profile
  profile: {
    create: '/create/profile',
    list: '/get/profile',
    view: (id: string) => `/view/profile/${id}`,
    update: (id: string) => `/update/profile/${id}`,
    delete: (id: string) => `/delete/profile/${id}`,
  },
  // Session
  session: {
    create: '/create/session',
    list: '/get/session',
    view: (id: string) => `/view/session/${id}`,
    update: (id: string) => `/update/session/${id}`,
    delete: (id: string) => `/delete/session/${id}`,
  },
  // Session Items
  sessionItems: {
    addResult: '/add/session-items-result',
    addMedia: '/add/session-items-media',
    getMedia: (id: string, fileKey: string) => `/session-items/${id}/media/${fileKey}`,
  },
  // Test
  test: {
    add: '/api/test-details/add-test',
    list: '/api/test-details/list-tests',
  },
  // Model
  model: {
    add: '/api/model/add-model',
  },
  // Product
  product: {
    add: '/api/product/add-product',
    tests: (deviceCode: string) => `/api/product/product-tests/${deviceCode}`,
  },
  // User
  user: {
    view: (id: string) => `/view/user/${id}`,
    update: (id: string) => `/update/user/${id}`,
  },
  // Organization
  organization: {
    create: '/create/organization',
    list: '/list/organizations',
    view: (id: string) => `/view/organization/${id}`,
    delete: (id: string) => `/delete/organization/${id}`,
  },
} as const;
