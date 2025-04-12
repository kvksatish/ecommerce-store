"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const store = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await store.login(email, password);
      if (success) {
        router.push("/");
      }
    } catch {
      setNotification("Invalid email or password");
      setNotificationType("error");
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-2 mt-2">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-lg">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {notification && (
                <div
                  className={`p-4 text-sm rounded-lg ${
                    notificationType === "error"
                      ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"
                      : "bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400"
                  }`}
                >
                  {notification}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full h-12 text-lg font-semibold mt-4"
                  onClick={handleSubmit}
                >
                  Sign In
                </Button>

                <div className="text-center">
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    Demo Accounts:
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Admin:</span>{" "}
                      admin@example.com / admin123
                    </p>
                    <p>
                      <span className="font-medium">User:</span>{" "}
                      client@example.com / client123
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
