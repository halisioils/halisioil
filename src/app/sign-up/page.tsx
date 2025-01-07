import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

const SignUpPage = async () => {
  return (
    <section className="min-h-screen bg-bgGray">
      <LoginLink postLoginRedirectURL="/dashboard">Sign in</LoginLink>
      <RegisterLink postLoginRedirectURL="/welcome">Sign up</RegisterLink>
    </section>
  );
};

export default SignUpPage;
