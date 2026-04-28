import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { api } from "@/api/client";

export default function AboutEditor(): React.ReactElement {
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");

  const { data, isLoading } = useQuery<{ raw: string }>({
    queryKey: ["admin", "about"],
    queryFn: () => api.get<{ raw: string }>("/api/admin/about", true),
  });

  useEffect(() => {
    if (data) setDraft(data.raw);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (raw: string) => api.patch<{ raw: string }>("/api/admin/about", { raw }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "about"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  const previewHtml = useMemo(() => {
    const html = marked.parse(draft, { async: false }) as string;
    return DOMPurify.sanitize(html);
  }, [draft]);

  if (isLoading) return <div>loading…</div>;

  return (
    <div className="admin-about">
      <div className="admin-about-head">
        <h2 className="admin-form-title">› about (markdown)</h2>
        <div className="admin-actions">
          <button
            className="cmd-btn cmd-btn-primary"
            onClick={() => mutation.mutate(draft)}
            disabled={mutation.isPending}
          >
            <span className="cmd-bracket">[</span>
            <span className="cmd-content">
              {mutation.isPending ? "saving…" : "save"}
            </span>
            <span className="cmd-bracket">]</span>
          </button>
          {mutation.isSuccess && <span className="admin-flash">✓ saved</span>}
        </div>
      </div>
      <div className="admin-about-grid">
        <textarea
          className="admin-textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
        />
        <div
          className="admin-md-preview"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </div>
  );
}
