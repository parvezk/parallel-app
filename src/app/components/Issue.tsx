"use client";

import React, { useState } from "react";
import { useMutation } from "urql";
import { Card, CardBody, Button, Chip, Select, SelectItem } from "@heroui/react";
import { UPDATE_ISSUE_STATUS_MUTATION } from "@/gql/UPDATE_ISSUE_STATUS_MUTATION";
import { DELETE_ISSUE_MUTATION } from "@/gql/DELETE_ISSUE_MUTATION";
import { IssueStatus } from "@/db/schema";
import { Trash2 } from "lucide-react";

const STATUS_OPTIONS = [
  { value: IssueStatus.BACKLOG, label: "Backlog" },
  { value: IssueStatus.TODO, label: "To do" },
  { value: IssueStatus.IN_PROGRESS, label: "In progress" },
  { value: IssueStatus.DONE, label: "Done" },
];

const STATUS_COLOR: Record<IssueStatus, "default" | "primary" | "secondary" | "success" | "warning"> = {
  [IssueStatus.BACKLOG]: "default",
  [IssueStatus.TODO]: "secondary",
  [IssueStatus.IN_PROGRESS]: "primary",
  [IssueStatus.DONE]: "success",
};

interface IssueProps {
  issue: {
    id: string;
    title: string;
    content: string | null;
    status: IssueStatus;
  };
}

export default function Issue({ issue }: IssueProps) {
  const [issueStatus, setIssueStatus] = useState(issue.status);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [, updateIssueStatus] = useMutation(UPDATE_ISSUE_STATUS_MUTATION);
  const [, deleteIssue] = useMutation(DELETE_ISSUE_MUTATION);

  const handleStatusChange = (value: string | null) => {
    if (!value) return;
    const newStatus = value as IssueStatus;
    setIssueStatus(newStatus);
    updateIssueStatus({ id: issue.id, status: newStatus });
  };

  const onDelete = async () => {
    setDeleteError(null);
    const result = await deleteIssue({ id: issue.id });
    if (result.error) {
      setDeleteError("Failed to delete issue. Please try again.");
      console.error("Failed to delete issue", result.error);
    }
  };

  let preview = "—";
  if (issue.content) {
    preview = issue.content.length > 80 ? issue.content.slice(0, 80) + "…" : issue.content;
  }

  return (
    <Card className="border border-sky-500/25 bg-sky-500/10">
      <CardBody className="flex flex-row flex-wrap items-center gap-2 gap-y-1 py-2 px-3">
        <div className="min-w-0 flex-1 basis-0">
          <h4 className="font-heading truncate text-sm font-medium text-foreground">
            {issue.title}
          </h4>
          <p className="truncate text-xs text-default-500">{preview}</p>
        </div>
        <div className="flex items-center gap-2">
          <Chip size="sm" color={STATUS_COLOR[issueStatus]} variant="flat">
            {STATUS_OPTIONS.find((o) => o.value === issueStatus)?.label || issueStatus}
          </Chip>
          <Select
            size="sm"
            selectedKeys={[issueStatus]}
            onSelectionChange={(keys) => {
              const v = Array.from(keys)[0];
              handleStatusChange(v as string);
            }}
            className="w-36"
            aria-label="Change status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} textValue={opt.label}>
                {opt.label}
              </SelectItem>
            ))}
          </Select>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            aria-label="Delete issue"
            onPress={onDelete}
          >
            <Trash2 size={16} />
          </Button>
        </div>
        {deleteError && (
          <p className="w-full text-xs text-danger">{deleteError}</p>
        )}
      </CardBody>
    </Card>
  );
}
