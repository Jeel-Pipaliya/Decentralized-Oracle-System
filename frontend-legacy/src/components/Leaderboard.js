export default function Leaderboard({ oracles }) {
  return (
    <section className="card">
      <h3>Oracle Reputation</h3>

      {oracles.length === 0 ? (
        <p>No leaderboard data yet</p>
      ) : (
        oracles.map((o, i) => (
          <div key={i} className="response">
            <span>{o.address.slice(0, 6)}...{o.address.slice(-4)}</span>
            <span>⭐ {o.score}</span>
          </div>
        ))
      )}
    </section>
  );
}
