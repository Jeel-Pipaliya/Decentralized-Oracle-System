import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Hexagon, 
  Menu, 
  X, 
  Wallet,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Data Feeds", path: "/data-feeds" },
  { name: "Nodes", path: "/nodes" },
  { name: "Developers", path: "/developers" },
  { name: "Governance", path: "/governance" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const location = useLocation();

  const handleConnect = () => {
    // Simulate wallet connection
    setIsConnected(true);
    setWalletAddress("0x1234...5678");
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Hexagon className="w-8 h-8 text-cyan-400 transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 w-8 h-8 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-heading font-bold text-xl text-cyan-400">
              OracleNet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="hidden lg:flex items-center gap-4">
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="glass" className="gap-2">
                    <Wallet className="w-4 h-4 text-success" />
                    <span className="text-sm">{walletAddress}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
                  <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer">
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="hero" onClick={handleConnect} className="gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-border/50">
              {isConnected ? (
                <Button 
                  variant="outline" 
                  onClick={handleDisconnect}
                  className="w-full"
                >
                  Disconnect ({walletAddress})
                </Button>
              ) : (
                <Button 
                  variant="hero" 
                  onClick={handleConnect}
                  className="w-full gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
