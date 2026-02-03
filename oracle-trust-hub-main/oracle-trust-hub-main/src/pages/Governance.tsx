import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Vote, 
  Clock, 
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ExternalLink
} from "lucide-react";

const proposals = [
  {
    id: "OIP-42",
    title: "Increase Node Operator Rewards by 15%",
    description: "Proposal to increase the base rewards for oracle node operators to incentivize network growth and reliability.",
    status: "active",
    votesFor: 2847234,
    votesAgainst: 892341,
    quorum: 75,
    timeLeft: "2 days 14 hours",
    author: "0x7a23...8f21",
    discussionCount: 47,
  },
  {
    id: "OIP-41",
    title: "Add Support for Arbitrum Nova",
    description: "Expand oracle network to support Arbitrum Nova L2 chain for gaming and social applications.",
    status: "active",
    votesFor: 1923847,
    votesAgainst: 234892,
    quorum: 82,
    timeLeft: "5 days 8 hours",
    author: "0x3b19...c4a2",
    discussionCount: 28,
  },
  {
    id: "OIP-40",
    title: "Implement Slashing Insurance Fund",
    description: "Create a community-funded insurance pool to protect against malicious slashing events.",
    status: "passed",
    votesFor: 4238471,
    votesAgainst: 128934,
    quorum: 100,
    timeLeft: "Ended",
    author: "0x9d4c...1e7b",
    discussionCount: 89,
  },
  {
    id: "OIP-39",
    title: "Reduce Minimum Stake Requirement",
    description: "Lower the minimum stake from 50,000 to 25,000 tokens to enable more node operators.",
    status: "rejected",
    votesFor: 892341,
    votesAgainst: 2384712,
    quorum: 100,
    timeLeft: "Ended",
    author: "0x5f8a...2d9c",
    discussionCount: 156,
  },
];

const formatVotes = (votes: number) => {
  if (votes >= 1000000) return `${(votes / 1000000).toFixed(2)}M`;
  if (votes >= 1000) return `${(votes / 1000).toFixed(1)}K`;
  return votes.toString();
};

export default function Governance() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="glow">Active</Badge>;
      case "passed":
        return <Badge variant="success">Passed</Badge>;
      case "rejected":
        return <Badge variant="failed">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                <span className="text-gradient-accent">Governance</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Shape the future of the oracle network through decentralized governance.
              </p>
            </div>
            <Button variant="hero" size="lg" className="gap-2">
              <Vote className="w-5 h-5" />
              Create Proposal
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="glass-card p-6">
              <p className="text-3xl font-heading font-bold text-primary">42</p>
              <p className="text-sm text-muted-foreground">Total Proposals</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-3xl font-heading font-bold text-success">2</p>
              <p className="text-sm text-muted-foreground">Active Votes</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-3xl font-heading font-bold text-accent">847K</p>
              <p className="text-sm text-muted-foreground">Token Holders</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-3xl font-heading font-bold">68.3%</p>
              <p className="text-sm text-muted-foreground">Avg Participation</p>
            </div>
          </div>

          {/* Proposals List */}
          <div className="space-y-6">
            {proposals.map((proposal) => {
              const totalVotes = proposal.votesFor + proposal.votesAgainst;
              const forPercentage = (proposal.votesFor / totalVotes) * 100;

              return (
                <div key={proposal.id} className="glass-card p-6 hover:border-primary/30 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Proposal Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-sm text-primary">{proposal.id}</span>
                        {getStatusBadge(proposal.status)}
                        {proposal.status === "active" && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {proposal.timeLeft}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-heading font-semibold mb-2">{proposal.title}</h3>
                      <p className="text-muted-foreground mb-4">{proposal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {proposal.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {proposal.discussionCount} comments
                        </span>
                      </div>
                    </div>

                    {/* Voting Stats */}
                    <div className="lg:w-80">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="flex items-center gap-1 text-success">
                            <ThumbsUp className="w-4 h-4" />
                            For: {formatVotes(proposal.votesFor)}
                          </span>
                          <span className="flex items-center gap-1 text-destructive">
                            Against: {formatVotes(proposal.votesAgainst)}
                            <ThumbsDown className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="h-3 bg-destructive/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success rounded-full transition-all"
                            style={{ width: `${forPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Quorum</span>
                          <span>{proposal.quorum}%</span>
                        </div>
                        <Progress value={proposal.quorum} className="h-2" />
                      </div>

                      {proposal.status === "active" ? (
                        <div className="flex gap-2">
                          <Button variant="success" className="flex-1 gap-2">
                            <ThumbsUp className="w-4 h-4" />
                            Vote For
                          </Button>
                          <Button variant="outline" className="flex-1 gap-2">
                            <ThumbsDown className="w-4 h-4" />
                            Against
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full gap-2">
                          <ExternalLink className="w-4 h-4" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
