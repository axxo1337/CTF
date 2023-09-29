import { useState } from "react";
import { Button, Input } from "@nextui-org/react";

export default function Challenge({
  id,
  name,
  desc,
  score,
  solved,
  onSend,
}: any) {
  const [flag, setFlag] = useState("");

  const onInput = (e) => {
    setFlag(e.target.value);
  };

  return (
    <div className="bg-[var(--second-color)] rounded-sm flex flex-col gap-0">
      <div className="flex items-center justify-between bg-[var(--custom-color)] rounded-t-sm p-4">
        <div className="flex gap-2 items-center">
          <b className="text-xl">{name}</b>
          <b className="text-2xl opacity-60">󰉀</b>
          <b className="text-md opacity-60">{score} Points</b>
        </div>
        {solved ? (
          <div className="flex gap-4 items-center">
            <b className="text-xl">SOLVED</b>
            <b className="text-3xl"></b>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="px-4 py-3 gap-3 flex flex-col">
        <p className="text-sm">{desc}</p>
        <div className="flex items-center gap-4 w-full">
          <Input
            disabled={solved}
            color="primary"
            variant="underlined"
            placeholder="Input Flag"
            onChange={onInput}
          />

          <Button
            disabled={solved}
            color="primary"
            variant="solid"
            onClick={() => onSend(id, flag)}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
