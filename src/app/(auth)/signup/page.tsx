"use client";

import { SIGNUP_MUTATION } from "@/gql/SIGNUP_MUTATION";
import { setToken } from "@/utils/token";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "urql";

const SignupPage = () => {
  const [_, signup] = useMutation(SIGNUP_MUTATION);
  const [state, setState] = useState({ password: "", email: "" });
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await signup({ input: state });

    if (result.data.createUser) {
      setToken(result.data.createUser.token);
      router.push("/");
    }
  };

  return (
    <div>
      <div>Sign up</div>
      <form onSubmit={handleSignup}>
        <div>
          <Input
            value={state.email}
            onValueChange={(v) => setState((s) => ({ ...s, email: v }))}
            variant="faded"
            label="Email"
          />
        </div>
        <div>
          <Input
            variant="faded"
            value={state.password}
            onValueChange={(v) => setState((s) => ({ ...s, password: v }))}
            label="Password"
            type="password"
          />
        </div>
        <div className="text-end">
          <Button type="submit" variant="solid" color="primary">
            Signup
          </Button>
        </div>
      </form>
      <div className="text-center mt-4">
        <p>
          Already have an account?{" "}
          <Link href="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
