import { ReactNode } from "react";

export function Section({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {intro ? (
          <p className="mt-2 text-muted-foreground max-w-2xl">{intro}</p>
        ) : null}
      </div>
      <div>{children}</div>
    </section>
  );
}
