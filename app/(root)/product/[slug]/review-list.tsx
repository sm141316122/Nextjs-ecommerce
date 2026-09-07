"use client";

import { Button } from "@/components/ui/button";
import { Review } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReviewForm from "./review-form";
import {
	getAllReviews,
	getCurrentUserReviewByProuctId,
} from "@/lib/actions/review.actions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/shared/rating";

export default function ReviewList({
	userId,
	productId,
	productSlug,
}: {
	userId: string;
	productId: string;
	productSlug: string;
}) {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [reviewed, setReviewed] = useState<Review | null>(null);

	const reload = async () => {
		const reviews = await getAllReviews(productId);
		if (!reviews) throw new Error("Fetching reviews failed");

		const currentUserReview = await getCurrentUserReviewByProuctId(productId);
		if (currentUserReview) setReviewed(currentUserReview);

		setReviews([...reviews]);
	};

	useEffect(() => {
		const loadReviews = async () => {
			const reviews = await getAllReviews(productId);

			setReviews(reviews);

			const currentUserReview = await getCurrentUserReviewByProuctId(productId);
			if (currentUserReview) setReviewed(currentUserReview);
		};

		loadReviews();
	}, [productId]);

	return (
		<div className="space-y-4">
			{reviews.length === 0 && <div>No reviews yet</div>}
			{userId ? (
				<ReviewForm
					userId={userId}
					productId={productId}
					onReviewSubmitted={reload}
					currentUserReview={reviewed}
				/>
			) : (
				<div>
					Please{" "}
					<Button
						nativeButton={false}
						render={
							<Link href={`/sign-in?callbackUrl=/product/${productSlug}`} />
						}
					>
						sign in
					</Button>{" "}
					to write a review
				</div>
			)}
			<div className="flex flex-col gap-3">
				{reviews.map((review) => (
					<Card key={review.id}>
						<CardHeader>
							<div className="flex-between">
								<CardTitle>{review.title}</CardTitle>
							</div>
							<CardDescription>{review.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex space-x-4 text-sm text-muted-foreground">
								<Rating value={review.rating} />
								<div className="flex items-center">
									<User className="mr-1 w-3 h-3" />
									{review.user ? review.user.name : "User"}
								</div>
								<div className="flex items-center">
									<Calendar className="mr-1 w-3 h-3" />
									{formatDateTime(review.createdAt).dateTime}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
