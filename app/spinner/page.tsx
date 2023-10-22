"use client";
import { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDeviceScreen } from "@/app/_hooks/hooks";

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateColorsArray(length: number = 6): Array<string> {
  const colors = [
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

  for (let i = 0; i < length; i++) {
    const colorIndex = i % colors.length;
    i % 2
      ? newColors.push(colors[colorIndex])
      : newColors.unshift(colors[colorIndex]);
  }

  return newColors;
}

export default function Spinner() {
  const canvasRef = useRef(null);
  const windowSize = useDeviceScreen();
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
  const [inputError, setInputError] = useState<string>("");

  function handleEntryDeleteButton(index: number) {
    const tempArray = [...entries];
    tempArray.splice(index, 1);
    setEntries([...tempArray]);
    setEntryColors([...generateColorsArray(tempArray.length)]);
  }

  function handleEntryEdit(index: number, newValue: string) {
    const tempArray = [...entries];
    tempArray[index].value = newValue;
    setEntries(tempArray);
  }

  function addEntry() {
    try {
      if (currentValue !== "") {
        try {
          if (!entries.filter((el) => el.value === currentValue).length) {
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
            setInputError("Entry already exists");
            throw new Error("Entry already exists");
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setInputError("Entry name can't be empty");
        throw new Error("Entry name can't be empty");
      }
    } catch (e) {
      console.error(e);
    }
  }

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
  }, [entries, entryColors, windowSize]);

  return (
    <div className="flex items-start justify-center">
      <div className="pt-10 mr-4 flex flex-col items-center">
        <div className="relative flex flex-col" style={{ maxHeight: "31rem" }}>
          <h3 className="font-bold text-xl mb-3 ml-4 self-start">
            Spin history:
          </h3>
          <ul className="pb-4 h-full w-52 overflow-y-scroll overflow-x-visible px-4">
            {spinHistory.map((el) => (
              <li className="text-base w-full flex items-center relative py-3 border-b-2">
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
            onTransitionEnd={() => {
              const angle = wheelRotationAngle % 360;
              setSpinning(false);
              setWheelRotationAngle(angle);
              for (let i = 0; i < entries.length; i++) {
                if (
                  360 - angle >= entries[i].startingAngle &&
                  360 - angle < entries[i].startingAngle + 360 / entries.length
                ) {
                  setSpinHistory([
                    {
                      value: entries[i].value,
                      color: entryColors[i],
                    },
                    ...spinHistory,
                  ]);
                  break;
                }
              }
            }}
          ></canvas>

          <svg
            className="h-8 w-8 absolute -right-1"
            width="92"
            height="82"
            viewBox="0 0 92 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M89 41V78L7 41L89 4V41Z"
              fill="white"
              stroke="black"
              stroke-width="5"
            />
          </svg>
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
            onClick={() => addEntry()}
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

          <input
            disabled={spinning}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEntry()}
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
                color={entryColors[index]}
                spinning={spinning}
                value={el.value}
                entries={entries}
                onClick={handleEntryDeleteButton}
                onChange={handleEntryEdit}
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
      {createPortal(
        <div
          className={`fixed w-full z-50 h-full transition-opacity left-0 top-0 bg-black bg-opacity-20 ${
            inputError
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute py-6 rounded-md flex flex-col items-center top-10 bg-white w-80 shadow-md left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 justify-center text-red-700">
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
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>

              <span>{inputError}</span>
            </div>
            <button
              onClick={() => setInputError("")}
              className="bg-blue-500 rounded-sm text-white py-1 w-24 mt-4"
            >
              OK
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

const Entry = memo(function Entry({
  color,
  spinning,
  value,
  index,
  onClick,
  onChange,
}: any) {
  return (
    <li className="text-base w-full flex items-center relative py-3 border-b-2">
      <span
        className="h-5 w-5 mr-2 shrink-0"
        style={{ backgroundColor: color }}
      ></span>
      <input
        type="text"
        value={value}
        className="focus:outline-none w-full"
        onChange={(e) => onChange(index, e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      />

      <button
        className={`shrink-0 ${
          spinning ? "cursor-not-allowed" : "cursor-pointer"
        } right-1 p-1 rounded-md hover:bg-slate-200 transition-colors`}
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
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </button>
      <button
        disabled={spinning}
        onClick={() => onClick(index)}
        className={`${
          spinning ? "cursor-not-allowed" : "cursor-pointer"
        } right-1 p-1 rounded-md hover:bg-slate-200 transition-colors`}
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
  spinning,
  setSpinning,
  setWheelRotationAngle,
  wheelRotationAngle,
}: any) {
  return (
    <button
      disabled={spinning}
      onClick={() => {
        const angle = wheelRotationAngle + getRandomArbitrary(720, 1080);
        setSpinning(true);
        setWheelRotationAngle(angle);
      }}
      className={`rounded-md shadow-lg transition hover:scale-95 hover:shadow-none mt-6 ${
        spinning ? "cursor-not-allowed" : "cursor-pointer"
      } font-bold transition-transform h-14 text-2xl w-60 bg-green-500 text-white flex items-center justify-center`}
    >
      <span>SPIN</span>
    </button>
  );
}
