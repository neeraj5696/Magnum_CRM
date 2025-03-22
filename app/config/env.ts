export const ENV = {
  API_UR1: process.env.API_UR1 ,
  API_UR12: process.env.API_UR2 ,
  // Add other environment variables here
} as const;

// Type for environment variables
export type Env = typeof ENV; 