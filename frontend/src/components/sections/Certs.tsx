import type { Cert } from "@/types/portfolio";
import { SectionHeader } from "./SectionHeader";

interface Props {
  items: Cert[];
}

export function Certs({ items }: Props): React.ReactElement {
  return (
    <>
      <SectionHeader
        prefix="05"
        name="Education & Certifications"
        sub="degrees, training, current credentials"
      />
      <div className="certs-row reveal-children">
        {items.map((c) => (
          <div key={c.id} className="cert-card">
            <div className="cert-badge">
              <span className="cert-glyph">{c.glyph}</span>
            </div>
            <div className="cert-name">{c.name}</div>
            <div className="cert-issuer">{c.issuer}</div>
            <div className="cert-expiry">{c.expiry}</div>
            <div className="cert-status">
              <span className="cert-led" /> active
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
