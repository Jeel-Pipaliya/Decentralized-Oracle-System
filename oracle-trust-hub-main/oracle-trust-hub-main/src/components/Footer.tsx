import { Link } from "react-router-dom";
import { Hexagon, Github, Twitter, MessageCircle } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Data Feeds", href: "/data-feeds" },
    { name: "Node Operators", href: "/nodes" },
    { name: "Developers", href: "/developers" },
    { name: "Governance", href: "/governance" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Tutorials", href: "#" },
    { name: "Status", href: "#" },
  ],
  Community: [
    { name: "Discord", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "Forum", href: "#" },
    { name: "Blog", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Hexagon className="w-8 h-8 text-primary" />
              <span className="font-heading font-bold text-xl text-gradient-primary">
                OracleNet
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Decentralized oracle infrastructure for the next generation of smart contracts.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OracleNet. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
