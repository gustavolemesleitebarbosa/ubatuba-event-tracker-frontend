import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err?.message);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#234683] flex flex-col p-4">
      <Button
        onClick={() => navigate("/")}
        variant="outline"
        className="mb-6 bg-slate-100 w-fit"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>
      
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-100">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-4">
                <Button type="submit" variant="outline" className="w-full">
                  Login
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-slate-200  w-full"
                  onClick={() => navigate("/signup")}
                >
                  Create Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 