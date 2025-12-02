import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthProvider";

const TodoSchema = z.object({
  title: z.string().min(1),
  // userId will be set by logged-in user; we accept string | number
  userId: z.union([z.string(), z.number()]),
  completed: z.boolean().default(false),
});
type TodoValues = z.infer<typeof TodoSchema>;

const url = "http://localhost:5000/api/todos";

const addTodo = async (payload: TodoValues) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export default function PostTodo() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const form = useForm<TodoValues>({
    resolver: zodResolver(TodoSchema) as Resolver<TodoValues>,
    defaultValues: { title: "", userId: user?.username ?? "", completed: false } as TodoValues,
  });

  // keep userId in sync when login changes
  React.useEffect(() => {
    form.reset({ ...form.getValues(), userId: user?.username ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const onSubmit = (values: TodoValues) => {
    if (!user) {
      alert("Please login to add a todo");
      return;
    }
    // ensure userId is the logged-in user's username (or id)
    mutation.mutate({ ...values, userId: user.username });
    form.reset();
  };

  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Todo Title</FormLabel>
                <FormControl>
                  <Input placeholder="Write a title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center gap-2">
            <Button type="submit" className="w-full" disabled={!user || mutation.isPending}>
              {mutation.isPending ? "Adding..." : "Add Todo"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
