import InfoTable from "../InfoTable/InfoTable";

interface InfoSectionProps {
  title: string;
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
}

export default function InfoSection({ title, headers, rows }: InfoSectionProps) {
  return (
    <section style={{ marginBottom: 20 }}>
      <h3>{title}</h3>
      <InfoTable headers={headers} rows={rows} />
    </section>
  )
}
