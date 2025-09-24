import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "./ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "./ui/checkbox";
import { z } from "zod";

const url = "http://localhost:5000/api/todos";

const TodoSchema = z.object({
    userId: z.coerce.number().min(1, { message: "User ID must be a positive number." }),
    title: z.string().min(1, { message: "Title cannot be empty." }),
    completed: z.boolean().default(false),
});

type Todo = z.infer<typeof TodoSchema>

const addTodo = async (formData: Todo) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            return response.json();
        }
    } catch (error) {
        throw new Error("Error adding todo");
    }
};

const PostTodo = () => {

    const form = useForm<Todo>({
        resolver: zodResolver(TodoSchema) as any,
        defaultValues: {
            userId: 1,  // Set default userId to 1 as it should be a positive number
            title: "",
            completed: false,
        },
    });

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: addTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            console.log("Todo added successfully");
            form.reset();
        },
        onError: (error) => {
            console.error("Error adding todo:", error);
        },
    });

    const handleAddTodo = async (data: Todo) => {
        mutation.mutate(data);
    };

    return (
        <div>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Add a new Todo</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddTodo)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User ID</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="User ID" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="completed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Completed</FormLabel>
                                        <FormControl>
                                            {/* <Input placeholder="Completed" {...field} /> */}
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Add Todo</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostTodo;
