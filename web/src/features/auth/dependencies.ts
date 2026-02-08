import { Amplify } from "aws-amplify";
import { cognitoAuthClient } from "@/features/auth/infra/cognitoAuthClient";
import { Authenticator } from "@/features/auth/usecases/authenticator";

const {
  VITE_COGNITO_USER_POOL_ID,
  VITE_COGNITO_CLIENT_ID,
  VITE_COGNITO_DOMAIN,
  VITE_COGNITO_REDIRECT_SIGN_IN,
  VITE_COGNITO_REDIRECT_SIGN_OUT,
} = import.meta.env;

if (!VITE_COGNITO_USER_POOL_ID || !VITE_COGNITO_CLIENT_ID || !VITE_COGNITO_DOMAIN) {
  throw new Error("Missing required Cognito environment variables. Please check your .env file.");
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: VITE_COGNITO_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: VITE_COGNITO_DOMAIN,
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [VITE_COGNITO_REDIRECT_SIGN_IN],
          redirectSignOut: [VITE_COGNITO_REDIRECT_SIGN_OUT],
          responseType: "code",
        },
      },
    },
  },
});

const authClient = cognitoAuthClient();
export const authenticator = new Authenticator(authClient);
