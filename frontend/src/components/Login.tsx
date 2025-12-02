import React, { useState } from "react";
import { useForm } from "react-hook-form";
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

const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginValues = z.infer<typeof LoginSchema>;

const baseUrl = "https://react-query-todo-app.onrender.com/api";
// const baseUrl = "https://react-query-todo-app-ymly.vercel.app/api/todos";
// const baseUrl = "http://localhost:5000/api";

const Login: React.FC = () => {
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.error || "Login failed");
        return;
      }

      // server returns { message, user: { id, username } }
      if (data?.user) {
        setUser({ id: data.user.id ?? data.user._id ?? String(data.user.id), username: data.user.username });
        setSuccess("Logged in successfully");
        form.reset();
      } else {
        setServerError("Unexpected response from server");
      }
    } catch {
      setServerError("Network error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {serverError && <div className="text-sm text-red-500">{serverError}</div>}
          {success && <div className="text-sm text-green-500">{success}</div>}
          <div className="flex items-center justify-between">
            <Button type="submit">Sign in</Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                // quick register helper for local testing
                const vals = form.getValues();
                if (!vals.username || !vals.password) {
                  setServerError("provide username & password to register");
                  return;
                }
                fetch(`${baseUrl}/auth/register`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username: vals.username, password: vals.password }),
                })
                  .then(async (r) => {
                    if (r.ok) setSuccess("Test registration successful — you may login");
                    else {
                      const j = await r.json();
                      setServerError(j?.error || "register failed");
                    }
                  })
                  .catch(() => setServerError("Network error"));
              }}
            >
              Register (test)
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;