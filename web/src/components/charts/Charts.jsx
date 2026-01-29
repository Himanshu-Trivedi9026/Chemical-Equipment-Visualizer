import AveragesChart from "./AveragesChart";
import EquipmentTypeChart from "./EquipmentTypeChart";

export default function Charts({ summary }) {
  if (!summary) return null;

  return (
    <>
      <h2>Average Parameters</h2>
      <AveragesChart summary={summary} />

      {summary.type_distribution && (
        <>
          <h2 style={{ marginTop: "30px" }}>
            Equipment Type Distribution
          </h2>
          <EquipmentTypeChart data={summary.type_distribution} />
        </>
      )}
    </>
  );
}
