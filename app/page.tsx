import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="container flex flex-col items-center gap-8 px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Manage your tasks and projects{' '}
              <span className="text-primary">efficiently</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Stay organized, collaborate with your team, and get things done with our
              powerful task management platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
}

const features = [
  {
    name: 'Project Management',
    description: 'Organize tasks into projects and track progress with ease.',
  },
  {
    name: 'Real-time Collaboration',
    description: 'Get instant notifications and updates on task changes.',
  },
  {
    name: 'Task Prioritization',
    description: 'Set priorities and due dates to stay on top of your work.',
  },
  {
    name: 'Team Assignments',
    description: 'Assign tasks to team members and track their progress.',
  },
];