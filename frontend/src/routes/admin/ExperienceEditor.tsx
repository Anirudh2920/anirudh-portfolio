import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/api/client";
import type { ExperienceAdmin } from "@/types/portfolio";
import { ListEditor } from "./ListEditor";

export default function ExperienceEditor(): React.ReactElement {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<ExperienceAdmin[]>({
    queryKey: ["admin", "experience"],
    queryFn: () => api.get<ExperienceAdmin[]>("/api/admin/experience", true),
  });

  const reorder = useMutation({
    mutationFn: (orderedIds: string[]) =>
      api.post(
        "/api/admin/experience/reorder",
        {
          items: orderedIds.map((id, idx) => ({ id, sort_order: (idx + 1) * 10 })),
        },
        true,
      ),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "experience"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/experience/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "experience"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  if (isLoading || !data) return <div>loading…</div>;

  return (
    <div>
      <h2 className="admin-form-title">› experience</h2>
      <ListEditor
        items={data}
        onReorder={(ids) => reorder.mutate(ids)}
        renderRow={(it) => (
          <ExperienceRow item={it} onDelete={() => remove.mutate(it.id)} />
        )}
      />
    </div>
  );
}

function ExperienceRow({
  item,
  onDelete,
}: {
  item: ExperienceAdmin;
  onDelete: () => void;
}): React.ReactElement {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<ExperienceAdmin>(item);
  const [open, setOpen] = useState(false);

  const save = useMutation({
    mutationFn: () =>
      api.patch(`/api/admin/experience/${item.id}`, {
        hash: draft.hash,
        date_range: draft.date_range,
        author: draft.author,
        role: draft.role,
        company: draft.company,
        message: draft.message,
        bullets: draft.bullets,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "experience"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
      setOpen(false);
    },
  });

  return (
    <div className="admin-card">
      <div className="admin-card-head" onClick={() => setOpen((o) => !o)}>
        <div>
          <strong>{item.role}</strong> · {item.company}
        </div>
        <div className="admin-card-meta">{item.date_range}</div>
      </div>
      {open && (
        <div className="admin-card-body">
          <Field label="hash" value={draft.hash} onChange={(v) => setDraft({ ...draft, hash: v })} />
          <Field
            label="date range"
            value={draft.date_range}
            onChange={(v) => setDraft({ ...draft, date_range: v })}
          />
          <Field label="role" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} />
          <Field
            label="company"
            value={draft.company}
            onChange={(v) => setDraft({ ...draft, company: v })}
          />
          <Field
            label="summary"
            value={draft.message}
            onChange={(v) => setDraft({ ...draft, message: v })}
          />
          <label className="admin-field">
            <span className="admin-label">bullets (one per line)</span>
            <textarea
              className="admin-textarea admin-textarea-sm"
              value={draft.bullets.join("\n")}
              onChange={(e) =>
                setDraft({ ...draft, bullets: e.target.value.split("\n").filter(Boolean) })
              }
            />
          </label>
          <div className="admin-actions">
            <button
              className="cmd-btn cmd-btn-primary"
              onClick={() => save.mutate()}
              disabled={save.isPending}
            >
              <span className="cmd-bracket">[</span>
              <span className="cmd-content">{save.isPending ? "saving…" : "save"}</span>
              <span className="cmd-bracket">]</span>
            </button>
            <button className="cmd-btn admin-btn-danger" onClick={onDelete}>
              <span className="cmd-bracket">[</span>
              <span className="cmd-content">delete</span>
              <span className="cmd-bracket">]</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}): React.ReactElement {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
