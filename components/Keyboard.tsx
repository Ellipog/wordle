import { LetterStatus } from "@/app/page";
import { motion } from "framer-motion";

interface KeyboardProps {
  letterStatuses: LetterStatus;
  onKeyPress: (key: string) => void;
}

export default function Keyboard({
  letterStatuses,
  onKeyPress,
}: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

  const getKeyStatus = (key: string) => {
    if (key === "ENTER" || key === "⌫") return "bg-gray-200";

    const status = letterStatuses[key.toLowerCase()];
    switch (status) {
      case "correct":
        return "bg-green-500";
      case "present":
        return "bg-yellow-500";
      case "wrong":
        return "bg-gray-500";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 fixed bottom-1">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 my-1">
          {row.map((key) => (
            <motion.button
              key={key}
              onClick={() => onKeyPress(key)}
              whileTap={{ scale: 0.75 }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className={`
                ${
                  key === "⌫"
                    ? "w-14 text-md"
                    : key === "ENTER"
                    ? "w-14 text-xs"
                    : "w-10 text-sm"
                } py-4 rounded font-bold h-12
                ${getKeyStatus(
                  key
                )} hover:opacity-90 transition-opacity flex items-center justify-center`}
            >
              {key}
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
}
