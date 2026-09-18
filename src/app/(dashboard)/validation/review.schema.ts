import { z } from "zod";

const ratingSchema = z.coerce
    .number<number>("Choose a rating between 1 and 5.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot exceed 5.")
    .multipleOf(0.1, "Rating can have at most one decimal place.");

const commentSchema = z
  .string()
  .trim()
  .max(2000, "Comment cannot exceed 2,000 characters.")
  .refine(
    (value) => value.length === 0 || value.length >= 3,
    "Comment must be at least 3 characters when provided.",
  );

export const createReviewFormSchema = z.object({
  orderId: z.uuid("This order reference is not valid."),
  rating: ratingSchema,
  comment: commentSchema.transform((value) => value || undefined),
});

/**
 * Editing sends both fields. An emptied comment becomes `null`, which the
 * backend treats as "remove the written comment" and keeps the rating.
 */
export const updateReviewFormSchema = z.object({
  reviewId: z.uuid("This review reference is not valid."),
  rating: ratingSchema,
  comment: commentSchema.transform((value) => value || null),
});

export const reviewIdSchema = z.uuid("This review reference is not valid.");
