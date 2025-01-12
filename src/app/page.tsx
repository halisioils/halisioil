import { HydrateClient } from "~/trpc/server";
import LandingPage from "./_components/LandingPage";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="">
        <LandingPage />
      </main>
    </HydrateClient>
  );
}
