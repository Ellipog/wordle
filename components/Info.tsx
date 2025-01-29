import { Info as InfoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Infinity } from "lucide-react";

export default function Info() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClick = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    document.addEventListener("keydown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
      document.removeEventListener("keydown", handleClick);
    };
  }, [isOpen]);

  return (
    <div className="fixed h-screen w-screen flex items-center justify-center top-0 left-0">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors fixed top-4 right-4 z-30"
        aria-label="Information"
      >
        <InfoIcon className="w-6 h-6 text-gray-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-80 bg-white rounded-xl shadow-lg z-50 p-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Lukk"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="font-bold text-lg mb-2">Hvordan fungerer det?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Gjett ordet på 6 forsøk</li>
                <li>• Hvert gjett må være et gyldig ord på 5 bokstaver</li>
                <li>• Fargefeedback etter hvert gjett:</li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-500 rounded-sm" />
                  <span>Bokstaven er riktig og på rett plass</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-yellow-500 rounded-sm" />
                  <span>Bokstaven er i ordet men på feil plass</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-gray-500 rounded-sm" />
                  <span>Bokstaven er ikke i ordet</span>
                </li>
                <li className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Hard mode</span>
                    <Infinity className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-xs leading-relaxed">
                    Aktiver hard mode ved å klikke på uendelighetsikonet ved
                    siden av tittelen.
                    <br />
                    • Du må bruke avslørte hint i neste gjett
                    <br />
                    • Grønne bokstaver må bli på samme plass
                    <br />
                    • Gule bokstaver må brukes
                    <br />• Grå bokstaver kan ikke brukes
                  </p>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
