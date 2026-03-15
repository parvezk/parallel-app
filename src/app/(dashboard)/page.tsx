"use client";

import { Tooltip, useDisclosure, Button, Skeleton } from "@heroui/react";
import { useQuery } from "urql";
import { PlusIcon } from "lucide-react";

import Issue from "@/app/components/Issue";
import CreateIssue from "@/app/components/CreateIssue";
import { ISSUES_QUERY } from "@/gql/ISSUES_QUERY";
import { IssueStatus } from "@/db/schema";

export default function IssuesPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [{ data, fetching, error }] = useQuery({
    query: ISSUES_QUERY,
  });

  const issues = data?.issues ?? [];
  const isEmpty = !fetching && !error && issues.length === 0;

  return (
    <div className="flex flex-col p-4 md:p-6">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          All Issues
        </h1>
        <Tooltip content="New Issue">
          <Button
            color="warning"
            variant="solid"
            startContent={<PlusIcon size={18} />}
            onPress={onOpen}
            className="text-black"
          >
            New Issue
          </Button>
        </Tooltip>
      </header>

      {error && (
        <div className="rounded-lg border border-danger-200 bg-danger-50/50 p-4 text-danger">
          <p className="font-medium">Error loading issues</p>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
      )}

      {fetching && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      )}

      {!fetching && !error && isEmpty && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-default-300 bg-default-50/50 px-6 py-16 text-center">
          <p className="text-default-600">No issues yet.</p>
          <Button
            color="warning"
            variant="solid"
            className="mt-4 text-black"
            onPress={onOpen}
          >
            Create your first issue
          </Button>
        </div>
      )}

      {!fetching && !error && issues.length > 0 && (
        <ul className="flex flex-col gap-2 list-none p-0 m-0">
          {issues.map((issue: { id: string; title: string; content: string | null; status: string }) => (
            <li key={issue.id}>
              <Issue issue={{ ...issue, status: issue.status as IssueStatus }} />
            </li>
          ))}
        </ul>
      )}

      <CreateIssue isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
