import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/api/client";
import type { CertAdmin } from "@/types/portfolio";
import { ListEditor } from "./ListEditor";

export default function CertsEditor(): React.ReactElement {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<CertAdmin[]>({
    queryKey: ["admin", "certs"],
    queryFn: () => api.get<CertAdmin[]>("/api/admin/certs", true),
  });

  const reorder = useMutation({
    mutationFn: (orderedIds: string[]) =>
      api.post(
        "/api/admin/certs/reorder",
        {
          items: orderedIds.map((id, idx) => ({ id, sort_order: (idx + 1) * 10 })),
        },
        true,
      ),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "certs"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/certs/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "certs"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  if (isLoading || !data) return <div>loading…</div>;

  return (
    <div>
      <h2 className="admin-form-title">› certifications</h2>
      <ListEditor
        items={data}
        onReorder={(ids) => reorder.mutate(ids)}
        renderRow={(c) => <CertRow item={c} onDelete={() => remove.mutate(c.id)} />}
      />
    </div>
  );
}

function CertRow({
  item,
  onDelete,
}: {
  item: CertAdmin;
  onDelete: () => void;
}): React.ReactElement {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<CertAdmin>(item);
  const [open, setOpen] = useState(false);

  const save = useMutation({
    mutationFn: () =>
      api.patch(`/api/admin/certs/${item.id}`, {
        name: draft.name,
        issuer: draft.issuer,
        expiry: draft.expiry,
        glyph: draft.glyph,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "certs"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
      setOpen(false);
    },
  });

  return (
    <div className="admin-card">
      <div className="admin-card-head" onClick={() => setOpen((o) => !o)}>
        <div>
          <strong>{item.name}</strong> · {item.issuer}
        </div>
        <div className="admin-card-meta">{item.expiry}</div>
      </div>
      {open && (
        <div className="admin-card-body">
          <F label="name" v={draft.name} on={(v) => setDraft({ ...draft, name: v })} />
          <F label="issuer" v={draft.issuer} on={(v) => setDraft({ ...draft, issuer: v })} />
          <F label="expiry" v={draft.expiry} on={(v) => setDraft({ ...draft, expiry: v })} />
          <F label="glyph" v={draft.glyph} on={(v) => setDraft({ ...draft, glyph: v })} />
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

function F({ label, v, on }: { label: string; v: string; on: (v: string) => void }): React.ReactElement {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      <input className="admin-input" value={v} onChange={(e) => on(e.target.value)} />
    </label>
  );
}
