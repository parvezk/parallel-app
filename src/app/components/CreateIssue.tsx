"use client";

import React, { useState } from "react";
import { useMutation } from "urql";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import { CREATE_ISSUE_MUTATION } from "@/gql/CREATE_ISSUE_MUTATION";
import { IssueStatus } from "@/db/schema";

interface CreateIssueProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function CreateIssue({ isOpen, onOpenChange }: CreateIssueProps) {
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [, createNewIssue] = useMutation(CREATE_ISSUE_MUTATION);

  const reset = () => {
    setIssueTitle("");
    setIssueDescription("");
    setTitleError("");
  };

  const handleClose = () => {
    reset();
    onOpenChange();
  };

  const handleCreate = async () => {
    if (!issueTitle.trim()) {
      setTitleError("Title is required");
      return;
    }
    setTitleError("");

    const result = await createNewIssue({
      input: {
        title: issueTitle.trim(),
        content: issueDescription.trim(),
        status: IssueStatus.BACKLOG,
      },
    });

    if (result.error) {
      setTitleError(result.error.message);
      return;
    }
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="font-heading font-semibold">
          New Issue
        </ModalHeader>
        <ModalBody>
          <Input
            label="Title"
            placeholder="Issue title"
            value={issueTitle}
            onValueChange={(v) => {
              setIssueTitle(v);
              if (titleError) setTitleError("");
            }}
            isInvalid={!!titleError}
            errorMessage={titleError}
            isRequired
            autoFocus
            variant="faded"
          />
          <Textarea
            label="Description"
            placeholder="Issue description (optional)"
            value={issueDescription}
            onValueChange={setIssueDescription}
            minRows={3}
            variant="faded"
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button color="warning" className="text-warning-foreground" onPress={handleCreate}>
            Create Issue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
