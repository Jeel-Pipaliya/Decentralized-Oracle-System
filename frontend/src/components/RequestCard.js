export default function RequestCard({ createRequest, loading }) {
  return (
    <section className="card">
      <h3>Create Oracle Request</h3>
      <p>Ask oracle nodes for the latest response round.</p>
      <button onClick={createRequest} disabled={loading}>
        {loading ? "Working..." : "Fetch Data"}
      </button>
    </section>
  );
}
