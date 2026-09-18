"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Review, ReviewMutationState } from "@/lib/validations/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createReviewAction,
  deleteReviewAction,
  updateReviewAction,
} from "../_actions/review-actions";
import {
  formatDashboardDate,
  formatDashboardRating,
} from "../_utils/dashboard-format";

const INITIAL_STATE: ReviewMutationState = {
  status: "idle",
  message: "",
};

/** Ratings are whole or half stars between 1 and 5; anything else starts empty. */
function initialRating(value: unknown) {
  const rating = Number(value);
  return Number.isInteger(rating * 2) && rating >= 1 && rating <= 5 ? rating : 0;
}

/** Toasts an action's outcome once per result. */
function useResultToast(state: ReviewMutationState) {
  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast.success(state.message);
    }
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);
}

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages?.length) return null;

  return (
    <p
      id={id}
      className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-signal"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      {messages[0]}
    </p>
  );
}

/**
 * Star rating plus comment, shared by the create and edit forms. `idPrefix`
 * keeps label/error ids unique when both could exist on one page.
 */
function ReviewFields({
  idPrefix,
  rating,
  onRatingChange,
  defaultComment,
  fieldErrors,
  disabled,
}: {
  idPrefix: string;
  rating: number;
  onRatingChange: (value: number) => void;
  defaultComment: string;
  fieldErrors: Record<string, string[] | undefined>;
  disabled: boolean;
}) {
  return (
    <>
      <fieldset disabled={disabled} className="max-w-sm">
        <legend className="text-sm font-bold">Rating out of 5</legend>
        <div
          className="mt-2 flex w-fit items-center gap-1 border border-ink/15 bg-card p-2"
          aria-invalid={Boolean(fieldErrors.rating)}
          aria-describedby={
            fieldErrors.rating ? `${idPrefix}-rating-error` : undefined
          }
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const fillPercentage =
              rating >= star ? 100 : rating === star - 0.5 ? 50 : 0;
            const choices =
              star === 1
                ? [{ value: 1, side: "full" as const }]
                : [
                    { value: star - 0.5, side: "left" as const },
                    { value: star, side: "right" as const },
                  ];

            return (
              <div key={star} className="relative size-10 shrink-0">
                <Star
                  aria-hidden="true"
                  className="absolute inset-0 size-10 text-ink/25"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden text-signal transition-[width] duration-150"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star className="size-10 min-w-10 fill-current" />
                </span>

                {choices.map((choice) => (
                  <label
                    key={choice.value}
                    title={`${choice.value} star${choice.value === 1 ? "" : "s"}`}
                    className={
                      choice.side === "full"
                        ? "absolute inset-0 z-10 cursor-pointer rounded-sm hover:bg-signal/10 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
                        : choice.side === "left"
                          ? "absolute inset-y-0 left-0 z-10 w-1/2 cursor-pointer rounded-l-sm hover:bg-signal/10 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
                          : "absolute inset-y-0 right-0 z-10 w-1/2 cursor-pointer rounded-r-sm hover:bg-signal/10 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
                    }
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={choice.value}
                      checked={rating === choice.value}
                      onChange={() => onRatingChange(choice.value)}
                      className="sr-only"
                    />
                    <span className="sr-only">
                      {choice.value} star{choice.value === 1 ? "" : "s"}
                    </span>
                  </label>
                ))}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs font-medium text-ink/60" aria-live="polite">
          {rating
            ? `${rating} of 5 stars selected`
            : "Select a star rating to continue. Half stars are supported."}
        </p>
        <FieldError
          id={`${idPrefix}-rating-error`}
          messages={fieldErrors.rating}
        />
      </fieldset>

      <div>
        <Label htmlFor={`${idPrefix}-comment`} className="font-bold">
          Field notes <span className="font-normal text-ink/50">(optional)</span>
        </Label>
        <Textarea
          id={`${idPrefix}-comment`}
          name="comment"
          minLength={3}
          maxLength={2000}
          disabled={disabled}
          defaultValue={defaultComment}
          aria-invalid={Boolean(fieldErrors.comment)}
          aria-describedby={
            fieldErrors.comment
              ? `${idPrefix}-comment-error`
              : `${idPrefix}-comment-hint`
          }
          className="mt-2 min-h-32 bg-card"
          placeholder="What worked well? What should another renter know?"
        />
        <p id={`${idPrefix}-comment-hint`} className="mt-1.5 text-xs text-ink/55">
          If provided, write 3–2,000 characters.
        </p>
        <FieldError
          id={`${idPrefix}-comment-error`}
          messages={fieldErrors.comment}
        />
      </div>
    </>
  );
}

function ActionError({ state }: { state: ReviewMutationState }) {
  if (state.status !== "error" || !state.message) return null;

  return (
    <p
      aria-live="polite"
      className="flex items-start gap-2 text-sm font-semibold text-signal"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      {state.message}
    </p>
  );
}

function CreateReviewForm({
  orderId,
  gearName,
  lookupMessage,
  onCreated,
}: {
  orderId: string;
  gearName: string;
  lookupMessage?: string;
  onCreated: (review: Review) => void;
}) {
  const [state, action, pending] = useActionState(
    async (previous: ReviewMutationState, formData: FormData) => {
      const next = await createReviewAction(orderId, previous, formData);
      if (next.status === "success" && next.data) onCreated(next.data);
      return next;
    },
    INITIAL_STATE,
  );
  const [rating, setRating] = useState(() => initialRating(state.values?.rating));
  useResultToast(state);

  return (
    <section className="border border-primary/30 bg-primary/5 p-5 sm:p-7">
      <p className="flex items-center gap-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-signal">
        <Star aria-hidden="true" className="size-4" />
        Returned order // customer review
      </p>
      <h2 className="mt-3 font-display text-3xl font-black uppercase">
        How did {gearName} perform?
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
        Your rating is attached to this returned order and published on the
        gear listing. Each order can be reviewed once; you can edit or delete it
        afterwards.
      </p>

      {lookupMessage && (
        <p className="mt-4 flex items-start gap-2 border border-signal/25 bg-card p-3 text-xs leading-5 text-ink/70">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-signal" />
          {lookupMessage} You can still submit here; the backend will verify
          whether this order already has a review.
        </p>
      )}

      <form action={action} noValidate className="mt-6 grid gap-5">
        <ReviewFields
          idPrefix={`review-${orderId}`}
          rating={rating}
          onRatingChange={setRating}
          defaultComment={state.values?.comment ?? ""}
          fieldErrors={state.fieldErrors ?? {}}
          disabled={pending}
        />
        <ActionError state={state} />
        <div className="border-t border-ink/12 pt-5">
          <Button type="submit" size="lg" disabled={pending || rating === 0}>
            <Star aria-hidden="true" />
            {pending ? "Publishing review…" : "Publish review"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function EditReviewForm({
  orderId,
  review,
  onSaved,
  onCancel,
}: {
  orderId: string;
  review: Review;
  onSaved: (review: Review) => void;
  onCancel: () => void;
}) {
  const [state, action, pending] = useActionState(
    async (previous: ReviewMutationState, formData: FormData) => {
      const next = await updateReviewAction(review.id, orderId, previous, formData);
      if (next.status === "success" && next.data) onSaved(next.data);
      return next;
    },
    INITIAL_STATE,
  );
  const [rating, setRating] = useState(() => initialRating(review.rating));
  useResultToast(state);

  return (
    <section className="border border-primary/30 bg-primary/5 p-5 sm:p-7">
      <p className="flex items-center gap-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-signal">
        <Pencil aria-hidden="true" className="size-4" />
        Editing your review
      </p>
      <h2 className="mt-3 font-display text-3xl font-black uppercase">
        Update your field report
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
        Clear the notes to keep just the star rating.
      </p>

      <form action={action} noValidate className="mt-6 grid gap-5">
        <ReviewFields
          idPrefix={`review-edit-${review.id}`}
          rating={rating}
          onRatingChange={setRating}
          defaultComment={state.values?.comment ?? review.comment ?? ""}
          fieldErrors={state.fieldErrors ?? {}}
          disabled={pending}
        />
        <ActionError state={state} />
        <div className="flex flex-wrap gap-3 border-t border-ink/12 pt-5">
          <Button type="submit" size="lg" disabled={pending || rating === 0}>
            <CheckCircle2 aria-hidden="true" />
            {pending ? "Saving…" : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={pending}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}

/** Two-step delete: the first click asks, the second removes the review. */
function DeleteReviewControl({
  orderId,
  reviewId,
  onDeleted,
}: {
  orderId: string;
  reviewId: string;
  onDeleted: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, action, pending] = useActionState(
    async (previous: ReviewMutationState, formData: FormData) => {
      const next = await deleteReviewAction(reviewId, orderId, previous, formData);
      if (next.status === "success") onDeleted();
      return next;
    },
    INITIAL_STATE,
  );
  useResultToast(state);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="destructive"
        size="compact"
        onClick={() => setConfirming(true)}
      >
        <Trash2 aria-hidden="true" />
        Delete review
      </Button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-wrap items-center gap-2 border border-signal/40 bg-signal/5 px-3 py-2"
    >
      <span className="text-xs font-bold text-signal">
        Delete this review? This can&apos;t be undone.
      </span>
      <Button type="submit" variant="destructive" size="compact" disabled={pending}>
        <Trash2 aria-hidden="true" />
        {pending ? "Deleting…" : "Yes, delete"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="compact"
        disabled={pending}
        onClick={() => setConfirming(false)}
      >
        Keep review
      </Button>
    </form>
  );
}

/**
 * The review step of a returned order, for its customer: write a review, then
 * view, edit or delete it. Each mutation's result becomes the card's local
 * state, so it changes view immediately; the actions also revalidate the page.
 */
export function OrderReviewCard({
  orderId,
  gearItemId,
  gearName,
  existingReview,
  lookupMessage,
}: {
  orderId: string;
  gearItemId: string;
  gearName: string;
  existingReview?: Review | null;
  lookupMessage?: string;
}) {
  const [review, setReview] = useState<Review | null>(existingReview ?? null);
  const [editing, setEditing] = useState(false);

  if (!review) {
    return (
      <CreateReviewForm
        orderId={orderId}
        gearName={gearName}
        lookupMessage={lookupMessage}
        onCreated={setReview}
      />
    );
  }

  if (editing) {
    return (
      <EditReviewForm
        orderId={orderId}
        review={review}
        onSaved={(saved) => {
          setReview(saved);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <section className="border border-success/35 bg-success/5 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-success">
            <CheckCircle2 aria-hidden="true" className="size-4" />
            Review submitted
          </p>
          <h2 className="mt-3 font-display text-3xl font-black uppercase">
            Your field report
          </h2>
        </div>
        <div className="border border-success/30 bg-card px-4 py-2 text-right">
          <p className="font-display text-2xl font-black">
            {formatDashboardRating(review.rating)} / 5
          </p>
          <p className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-ink/55">
            {review.updatedAt !== review.createdAt ? "Edited " : ""}
            {formatDashboardDate(review.updatedAt ?? review.createdAt)}
          </p>
        </div>
      </div>
      <p className="mt-5 max-w-2xl text-sm leading-6 text-ink/75">
        {review.comment || "You submitted a rating without a written comment."}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="compact">
          <Link href={`/gear/${gearItemId}`}>View {gearName}</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="compact"
          onClick={() => setEditing(true)}
        >
          <Pencil aria-hidden="true" />
          Edit review
        </Button>
        <DeleteReviewControl
          orderId={orderId}
          reviewId={review.id}
          onDeleted={() => setReview(null)}
        />
      </div>
    </section>
  );
}
