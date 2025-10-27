// Backend API Configuration
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:6000';

export const API_ENDPOINTS = {
  // Auth
  auth: {
    signup: '/api/auth/auth',
    verify: '/api/auth/auth-verify',
    issueToken: '/api/auth/issue-token',
    createSuperAdmin: '/api/auth/create/super-admin',
    verifySuperAdmin: '/api/auth/create/verify-super-admin',
    createExecAdmin: '/api/auth/create/exec-admin',
    verifyExecAdmin: '/api/auth/create/verify-exec-admin',
    createClusterHead: '/api/auth/create/cluster-head',
    verifyClusterHead: '/api/auth/create/verify-cluster-head',
    createUserHead: '/api/auth/create/user-head',
    verifyUserHead: '/api/auth/create/verify-user-head',
    createNurse: '/api/auth/create/nurse',
    verifyNurse: '/api/auth/create/verify-nurse',
    createTechnician: '/api/auth/create/technician',
    verifyTechnician: '/api/auth/create/verify-technician',
    signinNonUser: '/api/auth/signin-non-user',
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
  // Model
  model: {
    add: '/api/model/add-model',
  },
  // Product
  product: {
    add: '/api/product/add-product',
    tests: (deviceCode: string) => `/api/product/product-tests/${deviceCode}`,
  },
} as const;
