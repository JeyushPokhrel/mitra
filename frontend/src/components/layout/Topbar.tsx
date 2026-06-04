import { Search, Bell, Sparkles, Sun, Moon, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 backdrop-blur px-4 lg:px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 rounded-xl bg-card">
            <div className="h-5 w-5 rounded-md bg-primary" />
            <span className="hidden sm:inline">Acme Inc.</span>
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuItem>Acme Inc.</DropdownMenuItem>
          <DropdownMenuItem>Globex Co.</DropdownMenuItem>
          <DropdownMenuItem>Initech</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>+ Add organization</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="relative ml-2 flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search conversations, tickets, contacts…"
          className="pl-9 rounded-xl bg-card border-border"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 items-center rounded-md border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <Button variant="ghost" size="icon" className="rounded-xl">
        <Sparkles className="h-5 w-5 text-primary" />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-xl relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setDark((d) => !d)}>
        {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-xl pl-1 pr-2 py-1 hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">RK</AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold leading-none">Rohan K.</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Admin</p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Preferences</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
