import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { StackGroupAdmin, StackItemAdmin } from "@/types/portfolio";

export default function StackEditor(): React.ReactElement {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<StackGroupAdmin[]>({
    queryKey: ["admin", "stack"],
    queryFn: () => api.get<StackGroupAdmin[]>("/api/admin/stack/groups", true),
  });

  const updateItem = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<StackItemAdmin> }) =>
      api.patch(`/api/admin/stack/items/${id}`, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "stack"] });
      void qc.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  if (isLoading || !data) return <div>loading…</div>;

  return (
    <div>
      <h2 className="admin-form-title">› stack</h2>
      {data.map((g) => (
        <div key={g.id} className="admin-card admin-card-open">
          <div className="admin-card-head">
            <div>
              <strong>{g.label}</strong> <span className="admin-card-meta">/{g.slug}</span>
            </div>
          </div>
          <div className="admin-card-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>name</th>
                  <th>version</th>
                  <th>note</th>
                </tr>
              </thead>
              <tbody>
                {g.items.map((it) => (
                  <ItemRow
                    key={it.id}
                    item={it}
                    onSave={(body) => updateItem.mutate({ id: it.id, body })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function ItemRow({
  item,
  onSave,
}: {
  item: StackItemAdmin;
  onSave: (body: Partial<StackItemAdmin>) => void;
}): React.ReactElement {
  return (
    <tr>
      <td>
        <input
          className="admin-input admin-input-sm"
          defaultValue={item.name}
          onBlur={(e) =>
            e.target.value !== item.name && onSave({ name: e.target.value })
          }
        />
      </td>
      <td>
        <input
          className="admin-input admin-input-sm"
          defaultValue={item.version ?? ""}
          onBlur={(e) =>
            e.target.value !== (item.version ?? "") &&
            onSave({ version: e.target.value || null })
          }
        />
      </td>
      <td>
        <input
          className="admin-input admin-input-sm"
          defaultValue={item.note ?? ""}
          onBlur={(e) =>
            e.target.value !== (item.note ?? "") &&
            onSave({ note: e.target.value || null })
          }
        />
      </td>
    </tr>
  );
}
