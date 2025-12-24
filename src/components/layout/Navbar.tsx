import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, LayoutDashboard, FileText, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Shield },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reports", label: "Reports", icon: FileText },
];

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg group-hover:bg-primary/30 transition-colors" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <span className="font-display text-xl font-bold">
              FairHire<span className="text-primary">360</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "gap-2",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="hero">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-down">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border/50 mt-2">
                <Button variant="hero" className="w-full">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
