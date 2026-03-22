import { Wallet } from "lucide-react";

export default function Navbar({ account, onConnect }) {
  const label = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet";

  return (
    <header className="navbar">
      <h2>Oracle Dashboard</h2>
      <button className="wallet" onClick={onConnect}>
        <Wallet size={18} />
        {label}
      </button>
    </header>
  );
}
