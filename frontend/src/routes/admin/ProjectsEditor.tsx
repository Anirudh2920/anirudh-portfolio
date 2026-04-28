import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/api/client";
import type { ProjectAdmin } from "@/types/portfolio";
import { ListEditor } from "./ListEditor";

export default function ProjectsEditor(): React.ReactElement {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<ProjectAdmin[]>({
    queryKey: ["admin", "projects"],
    queryFn: () => api.get<ProjectAdmin[]>("/api/admin/projects", true),
  });

  const reorder = useMutation({
    mutationFn: (orderedIds: string[]) =>
      api.post(
        "/api/admin/projects/reorder",
        {
          items: orderedIds.map((id, idx) => ({ id, sort_order: (idx + 1) * 10 })),
        },
        true,
      ),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/projects/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  if (isLoading || !data) return <div>loading…</div>;

  return (
    <div>
      <h2 className="admin-form-title">› projects</h2>
      <ListEditor
        items={data}
        onReorder={(ids) => reorder.mutate(ids)}
        renderRow={(p) => <ProjectRow item={p} onDelete={() => remove.mutate(p.id)} />}
      />
    </div>
  );
}

function ProjectRow({
  item,
  onDelete,
}: {
  item: ProjectAdmin;
  onDelete: () => void;
}): React.ReactElement {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<ProjectAdmin>(item);
  const [open, setOpen] = useState(false);

  const save = useMutation({
    mutationFn: () =>
      api.patch(`/api/admin/projects/${item.id}`, {
        filename: draft.filename,
        lang: draft.lang,
        description: draft.description,
        problem: draft.problem,
        outcome: draft.outcome,
        tech: draft.tech,
        stars: draft.stars,
        status: draft.status,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
      setOpen(false);
    },
  });

  return (
    <div className="admin-card">
      <div className="admin-card-head" onClick={() => setOpen((o) => !o)}>
        <div>
          <strong>{item.filename}</strong> · {item.lang}
        </div>
        <div className="admin-card-meta">{item.status}</div>
      </div>
      {open && (
        <div className="admin-card-body">
          <Field label="filename" v={draft.filename} on={(v) => setDraft({ ...draft, filename: v })} />
          <Field label="language" v={draft.lang} on={(v) => setDraft({ ...draft, lang: v })} />
          <Field
            label="description"
            v={draft.description}
            on={(v) => setDraft({ ...draft, description: v })}
          />
          <Area
            label="problem snippet"
            v={draft.problem}
            on={(v) => setDraft({ ...draft, problem: v })}
          />
          <Area
            label="outcome snippet"
            v={draft.outcome}
            on={(v) => setDraft({ ...draft, outcome: v })}
          />
          <Field
            label="tech (comma-separated)"
            v={draft.tech.join(", ")}
            on={(v) =>
              setDraft({ ...draft, tech: v.split(",").map((s) => s.trim()).filter(Boolean) })
            }
          />
          <Field label="stars" v={draft.stars} on={(v) => setDraft({ ...draft, stars: v })} />
          <Field label="status" v={draft.status} on={(v) => setDraft({ ...draft, status: v })} />
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

function Field({ label, v, on }: { label: string; v: string; on: (v: string) => void }): React.ReactElement {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      <input className="admin-input" value={v} onChange={(e) => on(e.target.value)} />
    </label>
  );
}

function Area({ label, v, on }: { label: string; v: string; on: (v: string) => void }): React.ReactElement {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      <textarea
        className="admin-textarea admin-textarea-sm"
        value={v}
        onChange={(e) => on(e.target.value)}
      />
    </label>
  );
}
