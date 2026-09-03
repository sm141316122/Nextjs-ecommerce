"use client";

import { useState, useTransition } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { deleteOrder } from "@/lib/actions/order.actions";
import { deleteProduct } from "@/lib/actions/product.actions";
import { deleterUser } from "@/lib/actions/user.actions";

export default function DeleteDialog({
	id,
	deleteType,
}: {
	id: string;
	deleteType: string;
}) {
	const [isPending, startTranition] = useTransition();
	const [open, setOpen] = useState(false);

	const handleClick = (id: string) => {
		if (deleteType === "order") {
			startTranition(async () => {
				const res = await deleteOrder(id);

				setOpen(false);

				toast.add({
					type: res.success ? "success" : "error",
					description: res.message,
				});
			});
		} else if (deleteType === "product") {
			startTranition(async () => {
				const res = await deleteProduct(id);

				setOpen(false);

				toast.add({
					type: res.success ? "success" : "error",
					description: res.message,
				});
			});
		} else if (deleteType === "user") {
			startTranition(async () => {
				const res = await deleterUser(id);

				setOpen(false);

				toast.add({
					type: res.success ? "success" : "error",
					description: res.message,
				});
			});
		} else {
			setOpen(false);

			toast.add({
				type: "error",
				description: "Invalid Delete Type",
			});
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				render={
					<Button variant="destructive" className="cursor-pointer">
						Delete
					</Button>
				}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutly sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action can not be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="cursor-pointer">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className="cursor-pointer"
						variant="destructive"
						onClick={() => handleClick(id)}
						disabled={isPending}
					>
						{isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
