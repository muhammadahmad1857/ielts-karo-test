"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { loginUser } from "@/dal/auth/login";
import GoogleButton from "./google";
import { login } from "@/dal";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();
  // Basic validation logic with email regex
  const validate = () => {
    const errors: { email?: string; password?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 5) {
      errors.password = "Password must be at least 5 characters.";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false); // Set loading state to false
      return;
    }
    console.log("Registration data:", { email, password });
    try {
      const user = await login({ username: email, password });
      if (user?.data?.access_token) {
        router.push("/");
        toast.success("Logged in successfully!", { richColors: true });
      } else {
        toast.error("Failed to login. Please try again later.", {
          richColors: true,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response.data.detail ||
          error.response.error ||
          "Failed to login. Please try again later.",
        {
          richColors: true,
        }
      );
    } finally {
      setLoading(false);
      setErrors({});
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
    >
      <form>
        <div className="space-y-4">
          <GoogleButton />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" className="p-0 h-auto text-xs">
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
