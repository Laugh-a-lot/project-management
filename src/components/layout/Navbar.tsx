import React from "react";
import { Input } from "../ui/input";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { Package2Icon, SearchIcon } from "~/static/icons";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { api } from "~/utils/api";

const Navbar = () => {
  const { data: user } = api.user.me.useQuery();
  return (
    <header className="flex h-14 basis-full items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
      <Link className="lg:hidden" href="#">
        <Package2Icon className="h-6 w-6" />
        <span className="sr-only">Home</span>
      </Link>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              className="w-full appearance-none bg-white pl-8 shadow-none dark:bg-gray-950 md:w-2/3 lg:w-1/3"
              placeholder="Search products..."
              type="search"
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-12 w-12 rounded-full border border-gray-200 dark:border-gray-800"
            size="icon"
            variant="ghost"
          >
            <Image
              alt="Avatar"
              className="rounded-full"
              height="50"
              src={user?.image ?? ""}
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="50"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.name ?? user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/profile-settings">
            <DropdownMenuItem>Profile settings</DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Navbar;
