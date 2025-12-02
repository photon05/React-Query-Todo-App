import {
    Card,
    CardHeader,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {motion} from "motion/react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PostCardProps {
    userId: string | number;
    id: number;
    title: string;
    completed: boolean;
    refetch?: () => void;
}

const url = "https://react-query-todo-app.onrender.com/api/todos";
// const url = "https://react-query-todo-app-ymly.vercel.app/api/todos";
// const url = "http://localhost:5000/api/todos";

const deleteTodo = async (id: number) => {
  const response = await fetch(`${url}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete todo");
  return response.json();
};

const PostCard = ({ userId, id, title, completed, refetch }: PostCardProps) => {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteTodo(id),
    onSuccess: () => {
      // prefer parent refetch if provided, otherwise invalidate react-query cache
      if (refetch) refetch();
      else qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const onDelete = () => {
    if (!confirm("Delete this todo?")) return;
    mutation.mutate();
  };

  return (
    <motion.div
    whileHover={{
        scale:1.025,
        boxShadow:"0 4px 24px rgba(250,250,250,0.2)"
    }}
    className='rounded-xl'
    >
        <Card className="w-[350px]">
            <CardHeader className='text-left'>
                <CardDescription>User: {String(userId)}</CardDescription>   
            </CardHeader>
            <CardContent>
                <p className="text-sm text-left">Title: {title}</p>
            </CardContent>
            <CardFooter>
                <CardDescription className='text-left mr-auto'>Completed: {completed ? "Yes" : "No"}</CardDescription>
                <div className="ml-4">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={onDelete}
                    disabled={mutation.isPending}
                    aria-label={`Delete todo ${id}`}
                  >
                    {mutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
            </CardFooter>
        </Card>
    </motion.div>
  )
}

export default PostCard