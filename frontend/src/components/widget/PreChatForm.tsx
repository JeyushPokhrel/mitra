import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWidgetStore } from "@/store/widgetStore";
import { useChatStore } from "@/store/chatStore";

interface FormVals {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  department: string;
}

export function PreChatForm() {
  const setIdentity = useWidgetStore((s) => s.setIdentity);
  const setView = useWidgetStore((s) => s.setView);
  const receive = useChatStore((s) => s.receive);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormVals>({
    defaultValues: { department: "support" },
  });

  const onSubmit = (v: FormVals) => {
    setIdentity({ name: v.name, email: v.email, phone: v.phone, subject: v.subject });
    receive({
      sender: "system",
      kind: "system",
      body: `Visitor identified as ${v.name} · ${v.email}`,
    });
    toast.success("Lead created in CRM", { description: `${v.name} → New stage` });
    setView("chat");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3 overflow-y-auto">
      <div>
        <h3 className="font-semibold text-sm">Before we start</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Help us route your message to the right team.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-xs">Name *</Label>
        <Input
          id="name"
          {...register("name", { required: "Required", maxLength: 100 })}
          className="rounded-xl h-9"
          placeholder="Your full name"
        />
        {errors.name && <p className="text-[10px] text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            maxLength: 255,
          })}
          className="rounded-xl h-9"
          placeholder="you@company.com"
        />
        {errors.email && <p className="text-[10px] text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-xs">Phone</Label>
        <Input
          id="phone"
          {...register("phone", { maxLength: 30 })}
          className="rounded-xl h-9"
          placeholder="Optional"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject" className="text-xs">Subject</Label>
        <Input
          id="subject"
          {...register("subject", { maxLength: 200 })}
          className="rounded-xl h-9"
          placeholder="What's this about?"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Department</Label>
        <Select defaultValue="support">
          <SelectTrigger className="rounded-xl h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="support" className="text-xs">Support</SelectItem>
            <SelectItem value="sales" className="text-xs">Sales</SelectItem>
            <SelectItem value="billing" className="text-xs">Billing</SelectItem>
            <SelectItem value="partnerships" className="text-xs">Partnerships</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl h-9 mt-2">
        Start conversation
      </Button>
      <button
        type="button"
        onClick={() => setView("chat")}
        className="w-full text-[11px] text-muted-foreground hover:text-foreground"
      >
        Skip for now
      </button>
    </form>
  );
}
