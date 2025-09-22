import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query';
import './App.css'
import PostCard from './components/PostCard';
import { ThemeProvider } from './components/ThemeProvider';
import { ModeToggle } from './components/mode-toggle';
import PostTodo from './components/PostTodo';
import { motion } from "motion/react"

const url = "http://localhost:5000/api/todos"; // const url = "https://jsonplaceholder.typicode.com/todos";
const fetchPosts = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  const response = await fetch(url)
  return response.json();
}

function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { data, isPending, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchPosts,
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <motion.div
        className='fixed top-0 left-0 w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full -z-10 pointer-events-none'
        animate={{ x: mouse.x - 40, y: mouse.y - 40 }} // center the circle on cursor
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <ModeToggle/>

      <div className='flex flex-wrap justify-center gap-4 mt-4'>
        <PostTodo />
      </div>

      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button onClick={() => refetch()}>Refresh</Button>
      </div>
      <div className='flex flex-wrap justify-center gap-8 mt-4'>
        {isPending && <p>Loading...</p>}
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
