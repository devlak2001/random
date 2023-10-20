"use client";
import { memo, useEffect, useRef, useState } from "react";

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateColorsArray(length: number = 6): Array<string> {
  const originalColors = [
    "#fff44d",
    "#dde45a",
    "#63b7e6",
    "#5588c7",
    "#9474b5",
    "#ed1b24",
    "#f1592a",
    "#3ab54a",
    "#283890",
  ];
  const newColors: Array<string> = [];
  let i = 0;
  do {
    if (
      newColors[newColors.length - 1] !==
        originalColors[i % originalColors.length] &&
      newColors[0] !== originalColors[i % originalColors.length]
    ) {
      if (newColors.length % 2) {
        newColors.push(originalColors[i % originalColors.length]);
        i++;
      } else {
        newColors.unshift(originalColors[i % originalColors.length]);
        i++;
      }
    }
  } while (newColors.length < length);
  return newColors;
}

export default function Spinner() {
  const canvasRef = useRef(null);
  const windowSize = useWindowSize();
  const [wheelRotationAngle, setWheelRotationAngle] = useState<number>(0);
  const [spinHistory, setSpinHistory] = useState<
    Array<{
      value: string;
      color: string;
    }>
  >([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string>("");
  const [entryColors, setEntryColors] =
    useState<Array<string>>(generateColorsArray);
  const [entries, setEntries] = useState<
    Array<{ value: string; startingAngle: number }>
  >([
    { value: "Option 1", startingAngle: 0 },
    { value: "Option 2", startingAngle: 60 },
    { value: "Option 3", startingAngle: 120 },
    { value: "Option 4", startingAngle: 180 },
    { value: "Option 5", startingAngle: 240 },
    { value: "Option 6", startingAngle: 300 },
  ]);
  const [emptyInputError, setEmptyInputError] = useState<boolean>(false);

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    console.log(entries);

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
        for (let i = 0; i < numOfSlices; i++) {
          ctx.beginPath();
          ctx.arc(x, y, radius, sliceRadius * i, sliceRadius * (i + 1));
          ctx.lineTo(x, y);
          ctx.lineWidth = radius / 50;
          ctx.strokeStyle = "white";
          if (numOfSlices > 1) {
            ctx.stroke();
          }
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
      <div className="pt-10 mr-4 flex flex-col items-center">
        <div className="relative max-h-96 flex flex-col">
          <h3 className="font-bold text-xl mb-3 ml-4 self-start">
            Spin history:
          </h3>
          <ul className="pb-4 h-full w-52 overflow-y-scroll overflow-x-visible px-4">
            {spinHistory.map((el) => (
              <li className="text-base w-full flex items-center relative py-3 px-3 border-b-2">
                <div
                  className="h-5 w-5 mr-2"
                  style={{ backgroundColor: el.color }}
                ></div>
                <span>{el.value}</span>
              </li>
            ))}
          </ul>
          <div className="absolute pointer-events-none bg-gradient-to-b from-transparent to-white h-10 bottom-0 left-0 w-full"></div>
        </div>
      </div>
      <div className="flex flex-col items-center mr-12">
        <div className="relative flex items-center mt-14">
          <canvas
            ref={canvasRef}
            width={windowSize.width < 400 ? windowSize.width - 20 : 400}
            height={windowSize.width < 400 ? windowSize.width - 20 : 400}
            className={`pointer-events-none ${
              spinning ? "transition-transform" : "transition-none"
            }`}
            style={{
              transitionDuration: "2s",
              transform: `rotate(${wheelRotationAngle}deg)`,
            }}
          ></canvas>
          <div className="h-4 w-4 absolute right-0 bg-black"></div>
        </div>

        <SpinButton
          entryColors={entryColors}
          entries={entries}
          spinning={spinning}
          setSpinning={setSpinning}
          setWheelRotationAngle={setWheelRotationAngle}
          wheelRotationAngle={wheelRotationAngle}
          setSpinHistory={setSpinHistory}
          spinHistory={spinHistory}
        />
      </div>

      <div className="pt-10 mr-4 flex flex-col items-center">
        <h3 className="font-bold text-xl mb-6 ml-4 self-start">Entries:</h3>
        <div className="relative flex items-center w-11/12">
          <span className="sr-only">Search</span>
          <button
            disabled={spinning}
            className={`absolute right-2 hover:bg-slate-200 ${
              spinning ? "cursor-not-allowed" : "cursor-pointer"
            } transition-colors p-1 rounded-md`}
            onClick={(e) => {
              if (currentValue !== "") {
                const tempEntries = entries.map((el, index) => {
                  return {
                    value: el.value,
                    startingAngle: (360 / (entries.length + 1)) * (index + 1),
                  };
                });
                setEntries([
                  {
                    value: currentValue,
                    startingAngle: 0,
                  },
                  ...tempEntries,
                ]);
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
          </button>
          <span
            className={`absolute bottom-12 text-xs text-red-600 transition-transform ${
              emptyInputError ? "scale-100" : "scale-0"
            }`}
          >
            You can't add an empty value
          </span>

          <input
            disabled={spinning}
            onChange={(e) => {
              setCurrentValue(e.target.value);
              setEmptyInputError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (currentValue !== "") {
                  const tempEntries = entries.map((el, index) => {
                    return {
                      value: el.value,
                      startingAngle: (360 / (entries.length + 1)) * (index + 1),
                    };
                  });
                  setEntries([
                    {
                      value: currentValue,
                      startingAngle: 0,
                    },
                    ...tempEntries,
                  ]);
                  setEntryColors([...generateColorsArray(entries.length + 1)]);
                  console.log(entries);
                  setCurrentValue("");
                } else {
                  setEmptyInputError(true);
                }
              }
            }}
            className="placeholder:italic h-11 placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            placeholder="Add value to spinner"
            type="text"
            name="search"
            value={currentValue}
          />
        </div>
        <div className="relative max-h-72 flex flex-col mt-3">
          <ul className="pb-4 h-full w-64 overflow-y-scroll overflow-x-visible px-4">
            {entries.map((el, index) => (
              <Entry
                spinning={spinning}
                value={el.value}
                entries={entries}
                setEntries={setEntries}
                entryColors={entryColors}
                setEntryColors={setEntryColors}
                index={index}
              />
            ))}
          </ul>
          <div className="absolute pointer-events-none bg-gradient-to-b from-transparent to-white h-10 bottom-0 left-0 w-full"></div>
        </div>
        <ClearAllEntriesButton
          disabled={spinning}
          entries={entries}
          setEntries={setEntries}
        />
      </div>
    </div>
  );
}

const Entry = memo(function Entry({
  spinning,
  value,
  entries,
  setEntries,
  entryColors,
  setEntryColors,
  index,
}: any) {
  return (
    <li className="text-base w-full flex items-center relative py-3 px-3 border-b-2">
      <span
        className="h-5 w-5 mr-2"
        style={{ backgroundColor: entryColors[index] }}
      ></span>
      <span>{value}</span>
      <button
        disabled={spinning}
        onClick={() => {
          const tempArray = [...entries];
          tempArray.splice(index, 1);
          setEntries([...tempArray]);
          setEntryColors([...generateColorsArray(tempArray.length)]);
        }}
        className={`absolute ${
          spinning ? "cursor-not-allowed" : "cursor-pointer"
        } right-2 p-1 rounded-md hover:bg-slate-200 transition-colors`}
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
      </button>
    </li>
  );
});

function ClearAllEntriesButton({ entries, setEntries, disabled }: any) {
  return (
    <button
      disabled={disabled}
      onClick={() => {
        setEntries([]);
      }}
      className={`rounded-md shadow-lg transition hover:scale-95 hover:shadow-none font-bold ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } transition-transform h-11 w-11/12 bg-red-600 text-white flex items-center justify-center ${
        entries.length ? "scale-100" : "scale-0"
      }`}
    >
      <span>Clear all entries</span>
    </button>
  );
}

function SpinButton({
  entryColors,
  entries,
  spinning,
  setSpinning,
  setWheelRotationAngle,
  spinHistory,
  setSpinHistory,
  wheelRotationAngle,
}: any) {
  return (
    <button
      disabled={spinning}
      onClick={() => {
        setSpinning(true);
        const angle = wheelRotationAngle + getRandomArbitrary(720, 1080);
        const angleSimplified = angle % 360;
        setWheelRotationAngle(angle);
        console.log(angleSimplified);
        setTimeout(() => {
          setSpinning(false);
          setWheelRotationAngle(angleSimplified);
          for (let index = 0; index < entries.length; index++) {
            if (
              360 - angleSimplified >= entries[index].startingAngle &&
              360 - angleSimplified <
                entries[index].startingAngle + 360 / entries.length
            ) {
              setSpinHistory([
                {
                  value: entries[index].value,
                  color: entryColors[index],
                },
                ...spinHistory,
              ]);
              break;
            }
          }
        }, 2000);
      }}
      className={`rounded-md shadow-lg transition hover:scale-95 hover:shadow-none mt-6 ${
        spinning ? "cursor-not-allowed" : "cursor-pointer"
      } font-bold transition-transform h-14 text-2xl w-60 bg-green-500 text-white flex items-center justify-center`}
    >
      <span>SPIN</span>
    </button>
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
