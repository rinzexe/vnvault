"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Menu, Search, User, X, BookOpen, LogIn, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import useDebouncedSearch from "@/hooks/use-debounced-search"
import { IVN } from "@/types/vn"
import { getVnBySearch } from "@/lib/vndb/search"
import { IUser } from "@/types/user"
import { useAuth } from "@/components/auth-provider"
import ThemeToggle from "@/components/theme-toggle"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<IVN[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [userData, setUserData] = useState<IUser>()

  const search = useDebouncedSearch(searchQuery)

  const auth = useAuth()

  useEffect(() => {
    async function fetchData() {
      if (search !== "") {
        const res = await getVnBySearch(search, {}, { type: "rating", asc: false })
        setSearchResults(res.slice(0, 3))
      } else {
        setSearchResults([])
      }
    }

    fetchData()
  }, [search])

  useEffect(() => {
    async function fetchData() {
      if (auth.user) {
        const userRes = await auth.db.users.getUserInfoById(auth.user.id)
        setUserData(userRes)
      }
    }

    fetchData()

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [auth.user, auth.db.users])

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const closeSheet = () => {
    setIsSheetOpen(false)
  }

  const renderSearchResults = () => (
    <Card className="absolute mt-2 w-full z-50">
      <CardContent className="p-2">
        {searchResults.map((result) => (
          <Link key={result.id} href={`/novel/${result.id}`} className="flex items-center p-2 hover:bg-accent rounded-md" onClick={clearSearch}>
            <Image
              src={result.cover.url}
              alt={result.title}
              width={40}
              height={60}
              className="object-cover rounded mr-3"
            />
            <div>
              <p className="font-medium">{result.title}</p>
              <p className="text-sm text-muted-foreground">Rating: {result.rating}</p>
            </div>
          </Link>
        ))}
        <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} className="block text-center hover:bg-accent text-sm text-primary rounded mt-2" onClick={closeSheet}>
          See all results
        </Link>
      </CardContent>
    </Card>
  )

  const renderSearchInput = () => (
    <form className="relative">
      <Input
        type="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className="w-full md:w-96 bg-background/50 border-input/50 focus:border-primary pr-8"
      />
      {searchQuery && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 bottom-0"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  )

  const renderUserMenu = () => {
    if (auth.user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{userData?.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className="hover:cursor-pointer" href={"/profile/" + userData?.username}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="hover:cursor-pointer" href={"/profile/" + userData?.username + "/vault/"}>Vault</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className="hover:cursor-pointer" href={"/settings/"}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button className="hover:cursor-pointer w-full" onClick={() => auth.signOut()}>Log out</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    } else {
      return (
        <div className="hidden md:flex space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/signin">
              <LogIn className="h-5 w-5 mr-2" />
              Log in
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      )
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/search" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-primary">VNVault</span>
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link href="/search/" className="text-muted-foreground hover:text-primary transition-colors">
                Browse
              </Link>
              <Link href="/changelog" className="text-muted-foreground hover:text-primary transition-colors">
                Changelog
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block" ref={searchRef}>
              {renderSearchInput()}
              {searchResults.length > 0 && renderSearchResults()}
            </div>
            <ThemeToggle />
            {renderUserMenu()}

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full pt-8">
                  <div className="flex-grow">
                    <nav className="flex flex-col space-y-4">
                      <Link href="/search" className="text-muted-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                        Browse
                      </Link>
                      <Link href="/changelog" className="text-muted-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                        Changelog
                      </Link>
                      <Separator className="my-4" />
                      {auth.user ? (
                        <div className="space-y-4">
                          <Link href={"/profile/" + userData?.username} className="block text-muted-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                            Profile
                          </Link>
                          <Link href={"/profile/" + userData?.username + "/vault/"} className="block text-muted-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                            Vault
                          </Link>
                          <Separator className="my-4" />
                          <Link href={"/settings/"} className="block text-muted-foreground hover:text-primary transition-colors" onClick={closeSheet}>
                            Settings
                          </Link>
                          <Separator className="my-4" />
                          <button onClick={() => { auth.signOut(); closeSheet(); }} className="w-full text-left text-muted-foreground hover:text-primary transition-colors">
                            Log out
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="/signin" onClick={closeSheet}>
                              <LogIn className="h-5 w-5 mr-2" />
                              Log in
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href="/signup" onClick={closeSheet}>Sign up</Link>
                          </Button>
                        </div>
                      )}
                    </nav>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" className="mt-auto mb-4" onClick={closeSheet}>
                      Close menu
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}