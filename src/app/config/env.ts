import dotenv from "dotenv"
dotenv.config()

interface EnvConfig {
  PORT: string
  DB_URL: string
  NODE_ENV: string
  ip_address: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  JWT_REFRESH_SECRET: string
  JWT_REFRESH_EXPIRES_IN: string
  REDIS_HOST: string
  REDIS_PORT: string
  REDIS_PASSWORD: string
  REDIS_USERNAME: string
  BACKEND_URL: string
  FRONTEND_URL: string
  FRONTEND_URL_DASHBOARD: string
  SUPER_ADMIN_EMAIL: string
  SUPER_ADMIN_PASSWORD: string
  BCRYPT_SALT_ROUTD: string

  TWILIO_ACCOUNT_SID: string
  TWILIO_AUTH_TOKEN: string
  TWILIO_VERIFY_SERVICE_SID: string

  EMAIL_SENDER: {
    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_USER: string
    SMTP_PASS: string
    SMTP_FROM: string
  }
  FIREBASE: {
    type: string
    projectId: string
    privateKeyId: string
    privateKey: string
    clientEmail: string
    clientId: string
    authUri: string
    tokenUri: string
    authProviderX509CertUrl: string
    clientX509CertUrl: string
    universeDomain: string
  }
  STRIPE: {
    STRIPE_SECRET_KEY: string
    STRIPE_WEBHOOK_SECRET: string
    STRIPE_SUCCESS_URL: string
    STRIPE_CANCEL_URL: string
  }
}

const loadEnvVariable = (): EnvConfig => {
  const requiredVariables = [
    "PORT",
    "DB_URL",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES_IN",
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_PASSWORD",
    "REDIS_USERNAME",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "FIREBASE_TYPE",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_PRIVATE_KEY_ID",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_CLIENT_ID",
    "FIREBASE_AUTH_URI",
    "FIREBASE_TOKEN_URI",
    "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
    "FIREBASE_CLIENT_X509_CERT_URL",
    "FIREBASE_UNIVERSE_DOMAIN",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_SUCCESS_URL",
    "STRIPE_CANCEL_URL",
    "BACKEND_URL",
    "FRONTEND_URL",
    "FRONTEND_URL_DASHBOARD",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "BCRYPT_SALT_ROUTD",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_VERIFY_SERVICE_SID"
  ]

  requiredVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  })

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as string,
    ip_address: process.env.ip_address as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    REDIS_USERNAME: process.env.REDIS_USERNAME as string,
    BACKEND_URL: process.env.BACKEND_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    FRONTEND_URL_DASHBOARD: process.env.FRONTEND_URL_DASHBOARD as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    BCRYPT_SALT_ROUTD: process.env.BCRYPT_SALT_ROUTD as string,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID as string,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string,
    TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID as string,
    EMAIL_SENDER: {
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_PASS: process.env.SMTP_PASS as string,
      SMTP_FROM: process.env.SMTP_FROM as string,
    },
    FIREBASE: {
      type: process.env.FIREBASE_TYPE as string,
      projectId: process.env.FIREBASE_PROJECT_ID as string,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID as string,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') as string,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
      clientId: process.env.FIREBASE_CLIENT_ID as string,
      authUri: process.env.FIREBASE_AUTH_URI as string,
      tokenUri: process.env.FIREBASE_TOKEN_URI as string,
      authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL as string,
      clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL as string,
      universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN as string,
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
      STRIPE_SUCCESS_URL: process.env.STRIPE_SUCCESS_URL as string,
      STRIPE_CANCEL_URL: process.env.STRIPE_CANCEL_URL as string,
    }
  }
}

export const envVar = loadEnvVariable()