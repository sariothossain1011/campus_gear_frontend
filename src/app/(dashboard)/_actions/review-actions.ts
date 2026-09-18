"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { ReviewMutationState } from "@/lib/validations/types";
import { getZodFieldErrors } from "@/lib/validations/zod-errors";
import { createReview, deleteReview, updateReview } from "@/services/reviews";
import { requireDashboardRole } from "../_utils/dashboard-access";
import {
  createReviewFormSchema,
  reviewIdSchema,
  updateReviewFormSchema,
} from "../validation/review.schema";

function readTrimmed(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createReviewAction(
  orderId: string,
  _previousState: ReviewMutationState,
  formData: FormData,
): Promise<ReviewMutationState> {
  await requireDashboardRole("CUSTOMER", `/dashboard/orders/${orderId}`);

  const values = {
    rating: readTrimmed(formData, "rating"),
    comment: readTrimmed(formData, "comment"),
  };
  const parsed = createReviewFormSchema.safeParse({ orderId, ...values });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted review details and try again.",
      fieldErrors: getZodFieldErrors(parsed.error),
      values,
    };
  }

  const result = await createReview(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.error.message,
      fieldErrors: result.error.fieldErrors,
      values,
    };
  }

  updateTag("reviews");
  updateTag("gear");
  updateTag(`gear:${result.data.gearItemId}`);
  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/customer");

  return {
    status: "success",
    message: result.message,
    data: result.data,
  };
}

/** Everything that renders this review or its gear's rating. */
function invalidateReview(orderId: string, gearItemId: string) {
  updateTag("reviews");
  updateTag("gear");
  updateTag(`gear:${gearItemId}`);
  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/customer");
}

/** Customer-only: change the rating and/or comment of their own review. */
export async function updateReviewAction(
  reviewId: string,
  orderId: string,
  _previousState: ReviewMutationState,
  formData: FormData,
): Promise<ReviewMutationState> {
  await requireDashboardRole("CUSTOMER", `/dashboard/orders/${orderId}`);

  const values = {
    rating: readTrimmed(formData, "rating"),
    comment: readTrimmed(formData, "comment"),
  };
  const parsed = updateReviewFormSchema.safeParse({ reviewId, ...values });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted review details and try again.",
      fieldErrors: getZodFieldErrors(parsed.error),
      values,
    };
  }

  const { reviewId: id, ...input } = parsed.data;
  const result = await updateReview(id, input);
  if (!result.ok) {
    return {
      status: "error",
      message: result.error.message,
      fieldErrors: result.error.fieldErrors,
      values,
    };
  }

  invalidateReview(orderId, result.data.gearItemId);
  return { status: "success", message: result.message, data: result.data };
}

/**
 * Customer-only: remove their own review. The returned order becomes eligible
 * for a fresh review again.
 */
export async function deleteReviewAction(
  reviewId: string,
  orderId: string,
  _previousState: ReviewMutationState,
  _formData: FormData,
): Promise<ReviewMutationState> {
  void _formData;
  await requireDashboardRole("CUSTOMER", `/dashboard/orders/${orderId}`);

  const parsedId = reviewIdSchema.safeParse(reviewId);
  if (!parsedId.success) {
    return { status: "error", message: "This review reference is not valid." };
  }

  const result = await deleteReview(parsedId.data);
  if (!result.ok) {
    return { status: "error", message: result.error.message };
  }

  invalidateReview(orderId, result.data.gearItemId);
  return { status: "success", message: result.message };
}
