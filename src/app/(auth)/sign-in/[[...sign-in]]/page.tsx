import { SignIn } from "@clerk/nextjs";
import React from "react";

const Signin = () => {
  return (
    <SignIn 
      forceRedirectUrl="/dashboard"
      fallbackRedirectUrl="/dashboard"
    />
  );
};

export default Signin;