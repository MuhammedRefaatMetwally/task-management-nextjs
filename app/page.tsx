import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Users, 
  BarChart3,
  Lock,
  Smartphone,
  Globe
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">TaskFlow</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container grid place-items-center gap-8 px-4 py-24 md:py-32 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Badge className="w-fit" variant="secondary">
              ✨ Now with Real-time Collaboration
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Project management
              <span className="block text-primary">made simple</span>
            </h1>
            <p className="text-lg text-muted-foreground lg:text-xl">
              Organize, prioritize, and collaborate on projects with a beautiful
              Kanban board. Built for teams that want to move fast.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Free forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
              <div className="flex h-full items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-8">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 w-20 animate-pulse rounded-lg bg-primary/10"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/50">
          <div className="container px-4 py-24">
            <div className="text-center">
              <Badge className="mb-4" variant="secondary">Features</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to ship faster
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Powerful features to help your team collaborate and stay organized
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.name}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t">
          <div className="container px-4 py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of teams already using TaskFlow to manage their projects
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/register">
                  <Button size="lg">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">TaskFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    name: 'Kanban Boards',
    description: 'Visualize your workflow with beautiful drag-and-drop boards',
    icon: BarChart3,
  },
  {
    name: 'Real-time Collaboration',
    description: 'See changes instantly as your team works together',
    icon: Users,
  },
  {
    name: 'Fast & Responsive',
    description: 'Built for speed with optimistic updates and instant feedback',
    icon: Zap,
  },
  {
    name: 'Secure by Default',
    description: 'Your data is encrypted and protected with industry standards',
    icon: Lock,
  },
  {
    name: 'Mobile Friendly',
    description: 'Access your projects from any device, anywhere',
    icon: Smartphone,
  },
  {
    name: 'Team Management',
    description: 'Invite team members and collaborate seamlessly',
    icon: Globe,
  },
];