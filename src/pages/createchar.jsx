



const CreateChar = () => {

    const char = localStorage.getItem("character")
    return (
        <div className={"flex flex-col"}>
            <p className={"underline underline-offset-4 text-white font-thin mt-16 text-center text-4xl"}>{char}</p>
        </div>
    )
}
