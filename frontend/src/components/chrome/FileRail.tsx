import type { ReactNode } from "react";

type Node =
  | { type: "folder"; name: string; open: boolean; children: Node[] }
  | { type: "file"; name: string; section?: string; muted?: boolean };

const TREE: Node[] = [
  {
    type: "folder",
    name: "src",
    open: true,
    children: [
      { type: "file", name: "about.md", section: "about" },
      { type: "file", name: "experience.json", section: "experience" },
      {
        type: "folder",
        name: "projects",
        open: true,
        children: [
          { type: "file", name: "kafka-stream-svc", section: "projects" },
          { type: "file", name: "rest-api-gateway", section: "projects" },
          { type: "file", name: "react-platform-ui", section: "projects" },
          { type: "file", name: "+ 3 more", section: "projects", muted: true },
        ],
      },
      { type: "file", name: "stack.toml", section: "stack" },
      { type: "file", name: "certs.lock", section: "certs" },
      { type: "file", name: "contact.sh", section: "contact" },
    ],
  },
  { type: "folder", name: ".git", open: false, children: [] },
  { type: "file", name: "README.md", section: "about" },
  { type: "file", name: ".env.local", muted: true },
];

interface Props {
  active: string;
}

export function FileRail({ active }: Props): React.ReactElement {
  const renderNode = (node: Node, depth: number): ReactNode => {
    if (node.type === "folder") {
      return (
        <div key={node.name + depth}>
          <div className="rail-row" style={{ paddingLeft: depth * 12 + 10 }}>
            <span className="rail-chev">{node.open ? "▾" : "▸"}</span>
            <span className="rail-folder">{node.name}/</span>
          </div>
          {node.open && node.children.map((c) => renderNode(c, depth + 1))}
        </div>
      );
    }
    const isActive = node.section !== undefined && node.section === active;
    return (
      <div
        key={node.name + depth}
        className={
          "rail-row rail-file" +
          (isActive ? " rail-active" : "") +
          (node.muted ? " rail-muted" : "")
        }
        style={{ paddingLeft: depth * 12 + 10 }}
      >
        <span className="rail-dot">·</span>
        <span>{node.name}</span>
      </div>
    );
  };

  return (
    <aside className="file-rail" aria-hidden="true">
      <div className="rail-header">EXPLORER</div>
      <div className="rail-tree">{TREE.map((n) => renderNode(n, 0))}</div>
      <div className="rail-foot">
        <div className="rail-row rail-muted">
          <span className="rail-dot">⌥</span>
          <span>OUTLINE</span>
        </div>
        <div className="rail-row rail-muted">
          <span className="rail-dot">⌥</span>
          <span>TIMELINE</span>
        </div>
      </div>
    </aside>
  );
}
