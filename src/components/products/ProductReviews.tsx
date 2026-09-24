import React from "react";
import { ProductReview } from "@/types/product";
import { formatDate } from "@/lib/utils";
import { Star, MessageSquare } from "lucide-react";

interface ProductReviewsProps {
  reviews?: ProductReview[];
}

export function ProductReviews({ reviews = [] }: ProductReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50/75 rounded-2xl p-6 text-center border border-gray-200">
        <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-gray-700">No customer reviews yet</p>
        <p className="text-xs text-gray-500 mt-0.5">Be the first to leave a feedback on this product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        Customer Reviews
        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {reviews.length}
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-gray-900">{rev.reviewerName}</span>
                <span className="text-xs text-gray-400">{formatDate(rev.date)}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
