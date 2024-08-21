import AccentButton from "@/app/_components/accent-button"
import { useAuth } from "@/app/_components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

export default function VaultEditor({ isInVault, vid, setIsEditing, callback }: any) {
    const [selectedRating, setSelectedRating] = useState<number>(-1)
    const [selectedStatus, setSelectedStatus] = useState<number>(2)
    const [finishedEditing, setFinishedEditing] = useState<boolean>(false)

    const auth = useAuth()

    useEffect(() => {
        async function fetchVaultData() {
            const userData = await auth.getUserData(auth.user.id)
            const res = await auth.getVault(userData.username)

            const vaultVnData = res.find((entry: any) => entry.vid == vid)

            setSelectedRating(vaultVnData.rating - 1)
            setSelectedStatus(vaultVnData.status)
        }

        if (isInVault) {
            fetchVaultData()
        }
    }, [])

    function save() {
        auth.updateVault(auth.user.id, selectedRating != 0 ? selectedRating + 1 : null, selectedStatus, vid)
        setFinishedEditing(true)
        setTimeout(() => { setIsEditing(false); callback && callback() }, 1500)
    }

    function remove() {
        auth.updateVault(auth.user.id, selectedRating != 0 ? selectedRating + 1 : null, selectedStatus, vid, true)
        setFinishedEditing(true)
        setTimeout(() => { setIsEditing(false); callback && callback() }, 1500)
    }

    function onRatingChanged(i: any) {
        if (i >= 0) {
            setSelectedRating(i)
        }
        else {
            setSelectedRating(-1)
        }
    }

    var numbers = []
    for (var i = 0; i < 10; i++) {
        const y = i
        if (selectedRating == i) {
            numbers.push(
                <AccentButton className={"!w-8 h-8 !bg-white/10 !p-0 rounded-full  justify-center hover:*:!text-white *:duration-300 "}>
                    <p className="text-sm !text-white">
                        {i + 1}
                    </p>
                </AccentButton>

            )
        }
        else {
            numbers.push(
                <AccentButton onClick={(e: any) => onRatingChanged(y)} className={"!w-8 h-8 !text-center  !p-0 rounded-full *:!text-center justify-center hover:*:!text-white *:duration-300 "}>
                    <p className="text-sm group-hover:!text-white">
                        {i + 1}
                    </p>
                </AccentButton>

            )
        }
    }

    return (
        <div className="flex flex-col justify-center items-center">
            {finishedEditing ? (
                <h1 className="animate-fadeOut">
                    Saved
                </h1>
            ) : (
                <div className="flex flex-col panel items-center gap-4">
                    <div className="flex flex-col items-center *:text-center">
                        <h1>
                            Your vault
                        </h1>
                        <p className="text-xs text-neutral-500">
                            Select options to add to your vault
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h3>
                            Status:
                        </h3>
                        <div className="flex gap-2">
                            <StatusPill setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus} id={0} label="Finished" />
                            <StatusPill setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus} id={1} label="In progress" />
                            <StatusPill setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus} id={2} label="To-read" />
                            <StatusPill setSelectedStatus={setSelectedStatus} selectedStatus={selectedStatus} id={3} label="Dropped" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h3>
                            Rating:
                        </h3>
                        <div className="flex flex-col items-center gap-2">
                            <div className="grid grid-cols-10 gap-2">
                                {numbers}
                            </div>
                            <AccentButton onClick={(e: any) => onRatingChanged(-1)} className={" h-8 !text-center  !py-0 rounded-full *:!text-center justify-center hover:*:!text-white *:duration-300 "}>
                                <p className="text-sm group-hover:!text-white">
                                    Unrated
                                </p>
                            </AccentButton>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <AccentButton onClick={save}><h4>Save</h4></AccentButton>
                        <AccentButton onClick={remove}><h4>Remove</h4></AccentButton>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatusPill({ selectedStatus, setSelectedStatus, id, label }: any) {
    return (
        selectedStatus == id ? (
            <AccentButton className="rounded-full bg-white/10"><p className="text-sm text-white">{label}</p></AccentButton>
        ) : (
            <AccentButton onClick={() => setSelectedStatus(id)} className="rounded-full group-hover:*:!text-white *:duration-300"><p className="text-sm group-hover:!text-white">{label}</p></AccentButton>
        )
    )
}