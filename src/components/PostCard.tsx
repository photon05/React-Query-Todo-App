import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {motion} from "motion/react"


interface PostCardProps {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

const PostCard = ( todoData : PostCardProps ) => {
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
                <CardTitle>Todo ID: {todoData.id}</CardTitle>
                <CardDescription>User ID: {todoData.userId}</CardDescription>   
            </CardHeader>
            <CardContent>
                <p className="text-sm text-left">Title: {todoData.title}</p>
            </CardContent>
            <CardFooter>
                <CardDescription className='text-left mr-auto'>Status:</CardDescription>
                <p className="text-sm">Completed: {todoData.completed ? "Yes" : "No"}</p>
            </CardFooter>
        </Card>
    </motion.div>
  )
}

export default PostCard