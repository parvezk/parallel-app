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
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export default function CreateIssue({ isOpen, onOpenChange }: CreateIssueProps) {
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, createNewIssue] = useMutation(CREATE_ISSUE_MUTATION);

  const reset = () => {
    setIssueTitle("");
    setIssueDescription("");
    setTitleError("");
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleCreate = async () => {
    if (!issueTitle.trim()) {
      setTitleError("Title is required");
      return;
    }
    setTitleError("");
    setIsSubmitting(true);

    const result = await createNewIssue({
      input: {
        title: issueTitle.trim(),
        content: issueDescription.trim(),
        status: IssueStatus.BACKLOG,
      },
    });

    setIsSubmitting(false);
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
          <Button
            variant="light"
            onPress={handleClose}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            color="warning"
            className="text-black"
            onPress={handleCreate}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Create Issue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
