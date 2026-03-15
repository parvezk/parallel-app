"use client";

import { useUserContext } from "@/app/context/UserContext";

export default function ProjectsPage() {
  const { user } = useUserContext();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Projects
      </h1>
      <div className="rounded-lg border border-dashed border-default-300 bg-default-50/30 p-8 text-center">
        <p className="text-default-600">Projects coming soon.</p>
        {user?.createdAt && (
          <p className="mt-2 text-sm text-default-400">
            Account created: {new Date(user.createdAt).toDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
