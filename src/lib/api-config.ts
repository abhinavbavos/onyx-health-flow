export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://lia-unmilked-jagger.ngrok-free.dev';
// export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://13.203.86.159';
// export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    // User auth
    USER_AUTH: '/api/auth/auth',
    USER_AUTH_VERIFY: '/api/auth/auth-verify',
    
    // Super Admin
    CREATE_SUPER_ADMIN: '/api/auth/create/super-admin',
    VERIFY_SUPER_ADMIN: '/api/auth/create/verify-super-admin',
    
    // Executive Admin
    CREATE_EXEC_ADMIN: '/api/auth/create/exec-admin',
    VERIFY_EXEC_ADMIN: '/api/auth/create/verify-exec-admin',
    
    // Cluster Head
    CREATE_CLUSTER_HEAD: '/api/auth/create/cluster-head',
    VERIFY_CLUSTER_HEAD: '/api/auth/create/verify-cluster-head',
    
    // User Head
    CREATE_USER_HEAD: '/api/auth/create/user-head',
    VERIFY_USER_HEAD: '/api/auth/create/verify-user-head',
    
    // Nurse
    CREATE_NURSE: '/api/auth/create/nurse',
    VERIFY_NURSE: '/api/auth/create/verify-nurse',
    
    // Technician
    CREATE_TECHNICIAN: '/api/auth/create/technician',
    VERIFY_TECHNICIAN: '/api/auth/create/verify-technician',
    
    // Non-User
    SIGNIN_NON_USER: '/api/auth/signin-non-user',
    VERIFY_NON_USER: '/api/auth/verify-non-user',
    
    // Token
    ISSUE_TOKEN: '/api/auth/issue-token',

    REFRESH_TOKEN: '/api/auth/refresh-token',
  LOGOUT: '/api/auth/logout',
  },
  
  // Profile endpoints
  PROFILE: {
    CREATE: '/create/profile',
    GET_ALL: '/get/profile',
    VIEW: (id: string) => `/view/profile/${id}`,
    UPDATE: (id: string) => `/update/profile/${id}`,
    DELETE: (id: string) => `/delete/profile/${id}`,
  },
  
  // Session endpoints
  SESSION: {
    CREATE: '/create/session',
    GET_ALL: '/get/session',
    VIEW: (id: string) => `/view/session/${id}`,
    UPDATE: (id: string) => `/update/session/${id}`,
    DELETE: (id: string) => `/delete/session/${id}`,
  },
  
  // Session Item endpoints
  SESSION_ITEM: {
    ADD_RESULT: '/add/session-items-result',
    ADD_MEDIA: '/add/session-items-media',
    GET_MEDIA: (id: string, fileKey: string) => `/session-items/${id}/media/${fileKey}`,
  },
  
  // Test endpoints
  TEST: {
    ADD: '/api/test-details/add-test',
    LIST: '/api/test-details/list-tests',
  },
  
  // Model endpoints
  MODEL: {
    ADD: '/api/model/add-model',
  },
  
  // Product endpoints
  PRODUCT: {
    ADD: '/api/product/add-product',
    GET_TESTS: (deviceCode: string) => `/api/product/product-tests/${deviceCode}`,
  },
  
  // User endpoints
  USER: {
    VIEW: (id: string) => `/view/user/${id}`,
    UPDATE: (id: string) => `/update/user/${id}`,
  },
  
  // Organization endpoints
  ORGANIZATION: {
  CREATE: '/api/create/organization',
  LIST: '/api/list/organizations',
  VIEW: (id: string) => `/api/view/organization/${id}`,
  DELETE: (id: string) => `/api/delete/organization/${id}`,
},
};
