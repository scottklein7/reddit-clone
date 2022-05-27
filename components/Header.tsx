import Image from "next/image"
import {
    HomeIcon,
    BellIcon,
    ChatIcon,
    GlobeIcon,
    PlusIcon,
    SparklesIcon,
    SpeakerphoneIcon,
    VideoCameraIcon
} from '@heroicons/react/outline'
import { BeakerIcon, SearchIcon, MenuIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { signIn, signOut, useSession } from 'next-auth/react'
function Header() {
    const { data: session } = useSession()
    return (
        <div className="flex bg-white px-4 shadow-sm sticky top-0 z-50">
            <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
                <Image
                    objectFit="contain"
                    src="https://links.papareact.com/fgy"
                    layout="fill"
                />
            </div>
            <div className="flex items-center m-7 xl:min-w-[300px]">
                <HomeIcon className="h-5 w-5" />
                <p className="flex-1 ml-2 hidden lg:inline">Home</p>
                <ChevronDownIcon className="h-5 w-5" />
            </div>
            <form className="flex flex-1 items-center space-x-2 rounded-sm border border-gray-200 bg-gray-100 px-3 py-3">
                <SearchIcon className="h-6 w-6 text-gray-400" />
                <input className="flex-1 bg-transparent outline-none" type="text" placeholder="Search reddit" />
                <button type="submit" hidden />
            </form>

            <div className="mx-5 items-center text-gray-500 space-x-2 hidden lg:inline-flex">
                <SparklesIcon className="icon" />
                <GlobeIcon className="icon" />
                <VideoCameraIcon className="icon" />
                <hr className="h-10 border border-gray-100" />
                <ChatIcon className="icon" />
                <BellIcon className="icon" />
                <PlusIcon className="icon" />
                <SpeakerphoneIcon className="icon" />
            </div>
            <div className="ml-5 flex items-center lg:hidden">
                <MenuIcon className="icon" />
            </div>
            {session ? (
                <div onClick={() => signOut()} className="cursor-pointer hidden items-center space-x-2 border border-gray-100 p-2 lg:flex">
                    <div className="relative h-5 w-5 flex-shrink-0">
                        <Image
                            objectFit="contain"
                            layout="fill"
                            src="https://links.papareact.com/23l" />
                    </div>
                    <div className="flex-1 text-xs">
                        <p className="truncate">{session?.user?.name}</p>
                        <p className="text-gray-400">Karma</p>
                    </div>

                    <ChevronDownIcon className="h-5 flex-shrink-0 text-gray" />
                </div>
            ) : (
                <div onClick={() => signIn()} className="cursor-pointer hidden items-center space-x-2 border border-gray-100 p-2 lg:flex">
                    <div className="relative h-5 w-5 flex-shrink-0">
                        <Image
                            objectFit="contain"
                            layout="fill"
                            src="https://links.papareact.com/23l" />
                    </div>
                    <p className="text-gray-400">Sign in</p>
                </div>
            )}
        </div>
    )
}

export default Header