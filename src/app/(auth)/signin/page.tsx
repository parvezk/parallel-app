"use client";

import { SIGNIN_MUTATION } from "@/gql/SIGNIN_MUTATION";
import { setToken } from "@/utils/token";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "urql";
import Logo from "@/app/components/Logo";

const SigninPage = () => {
  const [{ error, fetching }, signin] = useMutation(SIGNIN_MUTATION);
  const [state, setState] = useState({ password: "", email: "" });
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signin({ input: state });

    if (result.data?.signin) {
      setToken(result.data.signin.token);
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 flex items-center gap-2 no-underline">
        <Logo size={32} className="text-primary" />
        <span className="font-heading text-xl font-semibold text-foreground">
          Parallel
        </span>
      </Link>
      <div className="w-full max-w-sm">
        <h1 className="font-heading mb-6 text-2xl font-semibold text-foreground">
          Sign in
        </h1>
        {error && (
          <div className="mb-4 rounded-lg border border-danger-200 bg-danger-50/50 p-3 text-sm text-danger">
            {error.message}
          </div>
        )}
        <form onSubmit={handleSignin} className="flex flex-col gap-4">
          <Input
            value={state.email}
            onValueChange={(v) => setState((s) => ({ ...s, email: v }))}
            variant="faded"
            label="Email"
            type="email"
            autoComplete="email"
            isRequired
          />
          <Input
            variant="faded"
            value={state.password}
            onValueChange={(v) => setState((s) => ({ ...s, password: v }))}
            label="Password"
            type="password"
            autoComplete="current-password"
            isRequired
          />
          <Button
            type="submit"
            variant="solid"
            color="primary"
            className="w-full"
            isLoading={fetching}
          >
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-default-500">
          No account?{" "}
          <Link href="/signup" className="text-primary underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
