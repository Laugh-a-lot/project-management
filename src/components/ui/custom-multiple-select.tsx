import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from ".";
import { PlusIcon } from "~/static/icons";
import { type Dispatch, type SetStateAction } from "react";


export interface Option {
  label: string;
  value: string;
  checked: boolean;
}
type Props = {
  options: Option[];
  placeholder: string;
  setOptions: Dispatch<SetStateAction<Option[]>>;
};

export function MultiSelectInput({ options, placeholder, setOptions }: Props) {
  function handleCheckChange(checked: boolean, value: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    setOptions( options.map((option) => {
        if (option.value == value) option.checked = checked;
        return option;
      }),
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          <PlusIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96">
        <DropdownMenuLabel>{placeholder}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(({ label, value, checked }) => (
          <DropdownMenuCheckboxItem
            key={value}
            checked={checked}
            onCheckedChange={(checked) => handleCheckChange(checked, value)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
