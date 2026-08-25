"use client";

import { use, useState, useTransition } from "react";
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

export default function OrderDeleteDialog({ id }: { id: string }) {
	const [isPending, startTransaction] = useTransition();
	const [open, setOpen] = useState(false);

	const handleClick = async (id: string) => {
		startTransaction(async () => {
			const res = await deleteOrder(id);

			setOpen(false);

			toast.add({
				type: res.success ? "success" : "error",
				description: res.message,
			});
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				render={
					<Button variant="default" className="cursor-pointer">
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
