"use client";
import { useEffect, useRef, useState } from "react";

const colors: Array<string> = [
  "red",
  "blue",
  "yellow",
  "orange",
  "purple",
  "green",
];

function generateColorsArray(lenght: number = 5) {
  const shuffledArray: Array<string> = [];

  while (shuffledArray.length < lenght) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (
      shuffledArray.length === 0 ||
      (shuffledArray[shuffledArray.length - 1] !== color &&
        shuffledArray[0] !== color)
    ) {
      shuffledArray.push(color);
    }
  }

  return shuffledArray;
}

export default function Spinner() {
  const canvasRef = useRef(null);
  const windowSize = useWindowSize();
  const [currentValue, setCurrentValue] = useState<string>("");
  const [entryColors, setEntryColors] =
    useState<Array<string>>(generateColorsArray);
  const [entries, setEntries] = useState<Array<string>>([
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
  ]);
  const [emptyInputError, setEmptyInputError] = useState<boolean>(false);

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function drawSlices(
      x: number,
      y: number,
      radius: number,
      numOfSlices: number
    ) {
      const sliceRadius = (Math.PI * 2) / numOfSlices;

      if (entries.length) {
        for (let i = 0; i < numOfSlices; i++) {
          ctx.beginPath();
          ctx.arc(x, y, radius, sliceRadius * i, sliceRadius * (i + 1));
          ctx.lineTo(x, y);
          ctx.fillStyle = entryColors[i];
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.lineTo(x, y);
        ctx.fillStyle = "grey";
        ctx.fill();
      }
      ctx.closePath();
    }

    drawSlices(
      canvas.width / 2,
      canvas.height / 2,
      canvas.height / 2,
      entries.length
    );
  }, [entries, windowSize]);

  return (
    <div className="flex items-start justify-center">
      <canvas
        ref={canvasRef}
        width={windowSize.width < 400 ? windowSize.width - 20 : 400}
        height={windowSize.width < 400 ? windowSize.width - 20 : 400}
        className="pt-8 mr-12"
      ></canvas>
      <div className="pt-14">
        <h3 className="font-bold text-xl mb-6">Entries:</h3>
        <label className="relative flex items-center w-60">
          <span className="sr-only">Search</span>
          <span
            className="absolute right-2 hover:bg-slate-200 hover:cursor-pointer transition-colors p-1"
            onClick={(e) => {
              if (currentValue !== "") {
                setEntries([currentValue, ...entries]);
                setEntryColors([...generateColorsArray(entries.length + 1)]);
                setCurrentValue("");
              } else {
                setEmptyInputError(true);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </span>
          <span
            className={`absolute bottom-10 text-xs text-red-600 transition-transform ${
              emptyInputError ? "scale-100" : "scale-0"
            }`}
          >
            You can't add an empty value
          </span>

          <input
            onChange={(e) => {
              setCurrentValue(e.target.value);
              setEmptyInputError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (currentValue !== "") {
                  setEntries([currentValue, ...entries]);
                  setEntryColors([...generateColorsArray(entries.length + 1)]);
                  console.log(entries);
                  setCurrentValue("");
                } else {
                  setEmptyInputError(true);
                }
              }
            }}
            className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            placeholder="Add value to spinner"
            type="text"
            name="search"
            value={currentValue}
          />
        </label>
        <ul>
          {entries.map((el, index) => (
            <li
              key={index}
              className="text-base w-60 flex items-center relative py-3 px-3 border-b-2"
            >
              <span
                className="h-5 w-5 mr-2"
                style={{ backgroundColor: entryColors[index] }}
              ></span>
              <span>{el}</span>
              <span
                onClick={() => {
                  const tempArray = [...entries];
                  tempArray.splice(index, 1);
                  setEntries([...tempArray]);
                  setEntryColors([...generateColorsArray(tempArray.length)]);
                }}
                className="absolute right-2 p-1 hover:bg-slate-200 hover:cursor-pointer transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  function handleResize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
