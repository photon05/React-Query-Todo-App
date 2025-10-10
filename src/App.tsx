import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query';
import './App.css'
import PostCard from './components/PostCard';
import { ThemeProvider } from './components/ThemeProvider';
import { ModeToggle } from './components/mode-toggle';
import PostTodo from './components/PostTodo';
import { MouseFollower } from './components/MouseFollower';
import { motion } from "motion/react"

const url = "https://react-query-todo-app-ymly.vercel.app/api/todos"; // const url = "https://jsonplaceholder.typicode.com/todos";
const fetchPosts = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate network delay
  const response = await fetch(url)
  return response.json();
}

function App() {

  const { data, isPending, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchPosts,
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MouseFollower/>
      <ModeToggle/>

      <div className='flex flex-wrap justify-center gap-4 mt-4'>
        <PostTodo />
      </div>

      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button onClick={() => refetch()}>Refresh</Button>
      </div>
      <div className='flex flex-wrap justify-center gap-8 mt-4'>
        {isPending && <motion.div
        animate={{ x: [-100, 100, -100] }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="loader bg-gray-800 dark:bg-gray-200 w-8 h-8 rounded-full shadow-[0_0_15px_4px_rgba(0,0,0,0.3)] 
      dark:shadow-[0_0_15px_4px_rgba(255,255,255,0.2)]"
      />}
        {data && data.slice().reverse().map((todo:any) => (
          <PostCard key={todo.id}
            userId={todo.userId}
            id={todo.id}
            title={todo.title}
            completed={todo.completed}>
          </PostCard>
        ))}
      </div>
    </ThemeProvider>
  )
}

export default App
