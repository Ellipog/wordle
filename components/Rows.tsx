export default function Rows({
  rows,
  activeRow,
  guides,
}: {
  rows: string[][];
  activeRow: number;
  guides: string[][];
}) {
  return (
    <div className="flex gap-1 flex-col">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 flex-row">
          {row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              data-row={rowIndex}
              data-column={cellIndex}
              className={`
                  w-12 h-12 md:w-16 md:h-16 border-2 text-2xl md:text-3xl font-bold caret-transparent 
                  outline-none uppercase flex items-center justify-center
                  transition-all duration-300
                  ${
                    cell && rowIndex === activeRow
                      ? "animate-[popIn_0.1s_ease-in-out]"
                      : ""
                  }
                  ${
                    rowIndex === activeRow
                      ? "border-gray-400"
                      : "border-gray-200"
                  }
                  ${
                    guides[rowIndex]?.[cellIndex] === "g"
                      ? "bg-green-500 text-white border-green-500 animate-[flipInX_0.5s_ease-in-out]"
                      : ""
                  }
                  ${
                    guides[rowIndex]?.[cellIndex] === "o"
                      ? "bg-yellow-500 text-white border-yellow-500 animate-[flipInX_0.5s_ease-in-out]"
                      : ""
                  }
                  ${
                    guides[rowIndex]?.[cellIndex] === "r"
                      ? "bg-gray-500 text-white border-gray-500 animate-[flipInX_0.5s_ease-in-out]"
                      : ""
                  }
                  ${
                    !guides[rowIndex]?.[cellIndex] &&
                    cell === "" &&
                    rowIndex === activeRow
                      ? "hover:animate-[bounce_0.2s_ease-in-out]"
                      : ""
                  }
                `}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
