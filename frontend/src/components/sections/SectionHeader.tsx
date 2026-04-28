interface Props {
  prefix: string;
  name: string;
  sub?: string;
}

export function SectionHeader({ prefix, name, sub }: Props): React.ReactElement {
  return (
    <header className="sec-h">
      <div className="sec-h-line">
        <span className="sec-h-prefix">{prefix}</span>
        <h2 className="sec-h-name">{name}</h2>
      </div>
      {sub && <div className="sec-h-sub">› {sub}</div>}
    </header>
  );
}
