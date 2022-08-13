


const CharSelect = (props) => {
    const userInfo = JSON.parse(localStorage.getItem("user"))
    const parseChars = () => {
        let charArr = [<button onClick={()=>{props.state("createchar")}} className={"p-6 pt-4 pb-4 m-auto text-white font-thin text-3xl border transition-all hover:text-black hover:bg-white"}>NEW CHARACTER</button>];



        return charArr;
    }
    return(

        <div className={"flex flex-col justify-center"}>
            <p className={"text-4xl font-thin text-white underline text-center mt-16 underline-offset-4"}>CHARACTER SELECT</p>
            <p className={"text-2xl font-thin text-white text-center mt-4"}>Currently logged in as: {userInfo['user']}</p>
            <div className={"w-[50%] border-x grid grid-cols-3 m-auto mt-16 p-8"}>
                {parseChars()}

            </div>

        </div>
    )
}

export default  CharSelect;