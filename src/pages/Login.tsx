import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { loginSchema } from "@/schemas/auth.schema";
import { z } from "zod";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      loginSchema.parse({ email, password });
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ form: "Invalid email or password" });
      }
    }
  };

  return (
    <div className="h-screen relative flex items-center justify-center w-screen bg-gradient-to-r from-[#251ee9]  to-[#3b70c4]  flex-col p-4">
      <Button
        onClick={() => navigate("/")}
        variant="outline"
        className="absolute top-4 left-4 mb-6 bg-slate-100 w-fit"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>
      <img
        src="/images/logo_header.png"
        alt="logo"
        className="w-1/3 md:w-1/6 mx-auto mb-8 "
      />
      <Card className="w-full max-w-md mx-auto  bg-slate-100">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {errors.form && (
              <p className="text-red-500 text-sm text-center">{errors.form}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="space-y-4">
              <Button type="submit" variant="outline" className="w-full">
                Login
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-slate-200 w-full"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
