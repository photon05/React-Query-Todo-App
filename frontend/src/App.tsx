import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import "./App.css";
import PostCard from "./components/PostCard";
import { ThemeProvider } from "./components/ThemeProvider";
import { ModeToggle } from "./components/mode-toggle";
import PostTodo from "./components/PostTodo";
import { MouseFollower } from "./components/MouseFollower";
import { motion } from "motion/react";
import { AuthProvider, useAuth } from "./lib/AuthProvider";
import Login from "./components/Login";
import React from "react";

const url = "https://react-query-todo-app.onrender.com/api/todos";
// const url = "https://react-query-todo-app-ymly.vercel.app/api/todos";
// const url = "http://localhost:5000/api/todos";

const fetchPosts = async () => {
  const response = await fetch(url);
  return response.json();
};

function InnerApp() {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchPosts,
  });

  const { user, logout } = useAuth();

  // show only todos owned by logged-in user
  const filtered = React.useMemo(() => {
    if (!data) return [];
    if (!user) return [];
    return data.filter((t: any) => {
      // match by username or numeric userId (legacy)
      return String(t.userId) === String(user.username) || String(t.userId) === String(user.id);
    });
  }, [data, user]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MouseFollower />
      <div className="p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex gap-2"><ModeToggle/>{user ? <div className="text-xl">{user.username}</div> : <Login />}</div>
          <div className="flex items-center gap-2">
            <Button onClick={() => refetch()}>Refresh</Button>
            {user && <Button variant="ghost" onClick={logout}>Logout</Button>}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <PostTodo />
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-4">
          {isPending && (
            <motion.div
              animate={{ x: [-100, 100, -100] }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="loader bg-gray-800 dark:bg-gray-200 w-8 h-8 rounded-full shadow-[0_0_15px_4px_rgba(0,0,0,0.3)] dark:shadow-[0_0_15px_4px_rgba(255,255,255,0.2)]"
            />
          )}

          {filtered && filtered.map((todo: any) => (
            <PostCard
              key={todo.id}
              userId={todo.userId}
              id={todo.id}
              title={todo.title}
              completed={todo.completed}
            />
          ))}
          {/* show message if logged in but no todos */}
          {user && filtered && filtered.length === 0 && (
            <div className="mt-8 text-center w-full">No todos for {user.username} yet.</div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

export default App;
