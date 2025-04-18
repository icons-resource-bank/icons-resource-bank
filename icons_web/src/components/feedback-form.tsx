"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, MessageSquare } from "lucide-react";
import { feedbackApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth";

// Validation constants
const MIN_FEEDBACK_LENGTH = 10;
const MAX_FEEDBACK_LENGTH = 1000;

export function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { isAuthenticated } = useAuthStore();

  const submitMutation = useMutation({
    mutationFn: feedbackApi.submitFeedback,
    onSuccess: () => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
        variant: "success",
      });
      setFeedback("");
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to submit feedback: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (feedback.trim().length < MIN_FEEDBACK_LENGTH) {
      toast({
        title: "Error",
        description: `Feedback must be at least ${MIN_FEEDBACK_LENGTH} characters.`,
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate(feedback);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
          size="sm"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Submit Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            Share your thoughts, suggestions, or report issues with the iCons Resource Bank.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isAuthenticated ? (
            <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              Please sign in to submit feedback.
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="feedback" className="flex justify-between">
                  <span>Your Feedback</span>
                  <span
                    className={`text-xs ${
                      feedback.length < MIN_FEEDBACK_LENGTH || feedback.length > MAX_FEEDBACK_LENGTH * 0.9
                        ? "text-amber-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {feedback.length}/{MAX_FEEDBACK_LENGTH} characters
                  </span>
                </Label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value.slice(0, MAX_FEEDBACK_LENGTH))}
                  placeholder="Tell us what you think or suggest improvements..."
                  className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {feedback.trim().length > 0 && feedback.trim().length < MIN_FEEDBACK_LENGTH && (
                  <p className="text-xs text-red-500">Feedback must be at least {MIN_FEEDBACK_LENGTH} characters.</p>
                )}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="text-white hover:text-white dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
            onClick={handleSubmit}
            disabled={
              !isAuthenticated ||
              submitMutation.isPending ||
              feedback.trim().length < MIN_FEEDBACK_LENGTH ||
              feedback.trim().length > MAX_FEEDBACK_LENGTH
            }
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
