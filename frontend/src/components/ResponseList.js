import { motion } from "framer-motion";

export default function ResponseList({ responses, median }) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>Oracle Responses</h3>
        <span className="badge">Median: {median ?? "-"}</span>
      </div>

      {responses.length === 0 ? (
        <p>No responses yet</p>
      ) : (
        responses.map((r, i) => (
          <motion.div
            key={i}
            className="response"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.06 }}
          >
            <span>{r.node}</span>
            <span>{r.rainfall} mm</span>
          </motion.div>
        ))
      )}
    </section>
  );
}
