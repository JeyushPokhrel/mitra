import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Moon, Clock } from "lucide-react";

interface OfflineVals { name: string; email: string; message: string; }

export function OfflineForm({ createTicket = false }: { createTicket?: boolean }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<OfflineVals>();

  const onSubmit = (v: OfflineVals) => {
    toast.success(createTicket ? "Ticket created" : "Message received", {
      description: `We'll get back to ${v.email} shortly.`,
    });
    reset();
  };

  return (
    <div className="p-4 space-y-3 overflow-y-auto">
      <div className="flex items-start gap-3 p-3 rounded-xl bg-muted">
        <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Moon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">We're currently offline</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="h-3 w-3" />
            Typical reply: under 2 hours
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="oname" className="text-xs">Name</Label>
          <Input id="oname" {...register("name", { required: true, maxLength: 100 })} className="rounded-xl h-9" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="oemail" className="text-xs">Email</Label>
          <Input
            id="oemail"
            type="email"
            {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, maxLength: 255 })}
            className="rounded-xl h-9"
          />
          {errors.email && <p className="text-[10px] text-destructive">Valid email required</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="omsg" className="text-xs">How can we help?</Label>
          <Textarea
            id="omsg"
            {...register("message", { required: true, maxLength: 1000 })}
            className="rounded-xl min-h-[80px]"
            placeholder="Describe your issue…"
          />
        </div>
        <Button type="submit" className="w-full rounded-xl h-9">
          {createTicket ? "Create ticket" : "Send message"}
        </Button>
      </form>
    </div>
  );
}
