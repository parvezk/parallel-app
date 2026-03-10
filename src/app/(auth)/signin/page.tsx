"use client";

import { SIGNIN_MUTATION } from "@/gql/SIGNIN_MUTATION";
import { setToken } from "@/utils/token";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "urql";

const SigninPage = () => {
  const [_, signin] = useMutation(SIGNIN_MUTATION);
  const [state, setState] = useState({ password: "", email: "" });
  const router = useRouter();

  const handleSignin = async (e) => {
    e.preventDefault();
    const result = await signin({ input: state });

    if (result.data.signin) {
      setToken(result.data.signin.token);
      router.push("/");
    }
  };

  return (
    <div>
      <div>Sign in</div>
      <form onSubmit={handleSignin}>
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
            Signin
          </Button>
        </div>
      </form>
      <div className="text-center mt-4">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
