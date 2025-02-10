import { useRouter } from "next/router";
import MemoryGame from "@/components/MemoryGame";

export default function MemoryGamePage() {
  const router = useRouter();

  return <MemoryGame />;
}
