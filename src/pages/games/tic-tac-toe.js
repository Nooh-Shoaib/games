import { useRouter } from "next/router";
import TicTacToe from "@/components/TicTacToe";

export default function TicTacToePage() {
  const router = useRouter();

  const handleBackToGames = () => {
    router.push("/");
  };

  return <TicTacToe onBack={handleBackToGames} />;
}
