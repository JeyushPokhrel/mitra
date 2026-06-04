import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-surface to-secondary/40">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-[var(--shadow-elevated)]">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-[var(--shadow-glow)]">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-lg leading-none">MITRA</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Customer OS</p>
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to continue to your workspace.</p>

        <div className="space-y-3 mt-6">
          <Button variant="outline" className="w-full rounded-xl">Continue with Google</Button>
          <Button variant="outline" className="w-full rounded-xl">Continue with Apple</Button>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" placeholder="you@company.com" className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="mt-1.5 rounded-xl" />
          </div>
          <Link to="/dashboard">
            <Button className="w-full rounded-xl mt-2">Sign in</Button>
          </Link>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Don't have an account? <Link to="/dashboard" className="text-primary font-medium hover:underline">Create one</Link>
        </p>
      </Card>
    </div>
  );
}
