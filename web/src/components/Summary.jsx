export default function Summary({ summary }) {
  if (!summary) return null;

  return (
    <div>
      <h2>Summary</h2>
      <ul>
        <li><b>Total Equipment:</b> {summary.total_equipment}</li>
        <li><b>Average Flowrate:</b> {summary.average_flowrate.toFixed(2)} kg/s</li>
        <li><b>Average Pressure:</b> {summary.average_pressure.toFixed(2)} bar</li>
        <li><b>Average Temperature:</b> {summary.average_temperature.toFixed(2)} °C</li>
      </ul>
    </div>
  );
}
