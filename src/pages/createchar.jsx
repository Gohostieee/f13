import {useRef, useState} from "react";


const CreateChar = () => {                        //s p e c i a l
    const [refresh,useRefresh] = useState();
    let special= useRef([5,5,5,5,5,5,5]), remainingPoints = useRef(10),remainingPointsRef = useRef();
    const specialRef = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];
    const ModifySpecial = (index,amount) => {
        if(special.current[index] + amount < 10 && special.current[index] + amount >= 0 && remainingPoints.current+amount*-1 >= 0) {
            special.current[index]+=amount
            specialRef[index].current.innerHTML=`${"\u00a0\u00a0"}${special.current[index]}`
            remainingPoints.current+=amount*-1;
            remainingPointsRef.current.innerHTML= `Remaining SPECIAL points: ${remainingPoints.current} `
        }

    }
    const parseSpecial = () => {
        let specialArr = []
        const specialStr = "SPECIAL"
        for (let x in specialStr) {
            specialArr.push(<>
                <div className={"flex flex-col"}>

                <button onClick={()=>{ModifySpecial(x,1)}} className={"border font-black text-xl p pr-2 pl-2 text-white hover:text-black hover:bg-white transition-all mb-2"}>🢁</button>
                <div className={"flex m-auto"}>
                    <p className={"text-white font-light text-xl"}>{specialStr[x]}{"\u00a0"}:</p>
                    <p ref = {specialRef[x]} className={"text-white font-light text-xl"}>{"\u00a0\u00a0"}{special.current[x]}</p>
                </div>
                <button onClick={()=>{ModifySpecial(x,-1)}} className={"border font-black text-xl p pr-2 pl-2 text-white hover:text-black hover:bg-white transition-all mt-2"}>🢃</button>
                </div>

            </>)
        }
        return specialArr;
    }
    return (
        <div className={"flex flex-col"}>
            <p className={"underline underline-offset-4 text-white font-thin mt-16 text-center text-4xl"}>Character Creator</p>
            <p className={"text-xl text-white font-light text-center mt-16"}>IC name</p>
            <input placeholder={"Name"} className={"m-auto mt-2 bg-black border p-2 focus:ring-green-500 text-white font-thin text-2xl"}/>
            <p className={"text-xl text-white font-light text-center mt-16"}>WHAT MAKES YOU SPECIAL!! </p>
            <p ref = {remainingPointsRef} className={"text-lg text-white font-light text-center mt-2"}>Remaining SPECIAL points: {remainingPoints.current} </p>

            <div className={"flex justify-evenly mt-2 w-[20%] m-auto"}>

                    {parseSpecial()}
            </div>
        </div>
    )
}

export default CreateChar;