import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/api/client";
import type { ProfileAdmin } from "@/types/portfolio";

const profileSchema = z.object({
  name: z.string().min(1).max(120),
  full_name: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable(),
  github: z.string().max(120).optional().nullable(),
  linkedin: z.string().max(120).optional().nullable(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileEditor(): React.ReactElement {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<ProfileAdmin>({
    queryKey: ["admin", "profile"],
    queryFn: () => api.get<ProfileAdmin>("/api/admin/profile", true),
  });

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: (values: ProfileForm) => api.patch<ProfileAdmin>("/api/admin/profile", values),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "profile"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  if (isLoading || !data) return <div>loading…</div>;

  return (
    <form className="admin-form" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
      <h2 className="admin-form-title">› profile</h2>
      {([
        ["name", "name (handle)"],
        ["full_name", "full name"],
        ["role", "role"],
        ["location", "location"],
        ["email", "email"],
        ["phone", "phone"],
        ["github", "github username"],
        ["linkedin", "linkedin slug"],
      ] as const).map(([k, label]) => (
        <label key={k} className="admin-field">
          <span className="admin-label">{label}</span>
          <input className="admin-input" {...form.register(k)} />
          {form.formState.errors[k] && (
            <span className="admin-error">{form.formState.errors[k]?.message as string}</span>
          )}
        </label>
      ))}

      <div className="admin-actions">
        <button
          type="submit"
          className="cmd-btn cmd-btn-primary"
          disabled={mutation.isPending}
        >
          <span className="cmd-bracket">[</span>
          <span className="cmd-content">
            {mutation.isPending ? "saving…" : "save"}
          </span>
          <span className="cmd-bracket">]</span>
        </button>
        {mutation.isSuccess && <span className="admin-flash">✓ saved</span>}
        {mutation.isError && <span className="admin-flash admin-flash-err">✗ failed</span>}
      </div>
    </form>
  );
}
