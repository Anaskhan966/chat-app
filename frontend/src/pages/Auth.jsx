import { SignIn, SignUp } from "@clerk/clerk-react";

export const SignInPage = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
    <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
  </div>
);

export const SignUpPage = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
    <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
  </div>
);
