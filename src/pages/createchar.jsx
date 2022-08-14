import {useRef, useState, useEffect} from "react";
import axios from "axios"

const apiURL = "http://localhost:3001/"

const CreateChar = () => {                        //s p e c i a l
    const [refresh,useRefresh] = useState(0);
    let special= useRef([5,5,5,5,5,5,5]), remainingPoints = useRef(10),remainingPointsRef = useRef(),race = useRef('0'), attributesRef = {age:useRef(),height:useRef(),name:useRef()},traits = useRef([]),selectOptRef = {"Gender":useRef(),"Body":useRef(),"Speech":useRef(),"Complexion":useRef()}, flavourtexts = {"OOC":useRef(),"LOWIC":useRef(), "HIGHIC":useRef()} ;
    const raceOpts = ["Human","Ghoul","Synth"];
    const traitsOpts = {"Survivalist":"PLACEHOLDER","Pacifist":"PLACEHOLDER","Raider":"PLACEHOLDER","Certified Hood Nigga":"PLACEHOLDER","Charismatic":"PLACEHOLDER","Jolly!":"PLACEHOLDER","Depressed":"PLACEHOLDER"}
    const specialRef = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];
    const ModifySpecial = (index,amount) => {
        if(special.current[index] + amount < 10 && special.current[index] + amount >= 0 && remainingPoints.current+amount*-1 >= 0) {
            special.current[index]+=amount
            specialRef[index].current.innerHTML=`${"\u00a0\u00a0"}${special.current[index]}`
            remainingPoints.current+=amount*-1;
            remainingPointsRef.current.innerHTML= `Remaining SPECIAL points: ${remainingPoints.current} `
        }

    }
    const ModifyRace = (x) => {
        race.current = x;
        useRefresh(refresh+1);
    }
    const ModifyTraits = (x,mode) => {
        switch(mode) {
            case "add":
                traits.current.push(x)

            break;
            case "remove":
                const index = traits.current.indexOf(x);
                traits.current.splice(index,1);

            break;
        }
        useRefresh(refresh+1)
        console.log(traits.current)
            
    }
    const parseRace = (x) => {
        let raceArr = [];
        for(let y in x) { 
            console.log(race.current,y)
            if(y === race.current){ 
                raceArr.push(<p className = "text-white font-thin text-2xl underline underline-offset-4 p-2 pr-4 pl-4 m-auto">{x[y]}</p>)
                continue
            }
            raceArr.push(<p onClick={()=>{ModifyRace(y)}}className = "text-white font-thin text-2xl select-none cursor-pointer border hover:bg-white hover:text-black transition-all p-2 pr-4 pl-4 m-auto">{x[y]}</p>)

        }
        return raceArr;
    }

    const parseTraits = () => {
        let traitArr = []
        for(let x in traitsOpts){
            if(!(traits.current.includes(x))){
              traitArr.push( 
                <div onClick = {()=> {ModifyTraits(x,"add")}}className = "flex m-4 text-center select-none cursor-pointer">
                        <p className = "text-white font-black text-xl border p-1 pl-4 pr-4">{"\u00a0"}</p>
                        <p className = "text-white font-thin text-2xl underline underline-offset-4 pl-2  ">{x}:  {traitsOpts[x]}</p>

                </div>
            )  
            }
            else{
                 traitArr.push( 
                <div onClick = {()=> {ModifyTraits(x,"remove")}}className = "flex m-4 text-center select-none cursor-pointer">
                        <p className = "text-white font-black text-xl border p-1 ">✔️</p>
                        <p className = "text-white font-thin text-2xl underline underline-offset-4 pl-2  ">{x}:  {traitsOpts[x]}</p>

                </div>
            )  
            }
            
        }
        return traitArr;
    }
    const parseSpecial = () => {
        let specialArr = []
        const specialStr = "SPECIAL"
        for (let x in specialStr) {
            specialArr.push(<>
                <div className={"flex flex-col m-2 select-none "}>

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
    const ageChange = () => {
        if(attributesRef["age"].current.value == "") {
            attributesRef["age"].current.value = 21;
        
        }
        else if(attributesRef["age"].current.value < 16) {
            attributesRef["age"].current.value = 16;
        }
        else if(attributesRef["age"].current.value > 99) {
            attributesRef["age"].current.value = 99;

        }
    }
    const heightChange = () => {
        if(attributesRef["height"].current.value == "") {
            attributesRef["height"].current.value = 120

        }
        else if(attributesRef["height"].current.value < 70) {
            attributesRef["height"].current.value = 70
        }
        else if (attributesRef["height"].current.value > 214) {
            attributesRef["height"].current.value = 214
        }
    }
    const nameChange = () => {
        if(attributesRef["name"].current.value==="") {
            attributesRef["name"].current.value="Jonah Rowsey"
        }
    }
    const submitData = () => {
        let character = {}
        character["name"] = attributesRef["name"].current.value;
        character["special"] = special.current;
        character["race"] = raceOpts[race.current];
        character["age"] = attributesRef["age"].current.value;
        character["height"] = attributesRef["height"].current.value
        character["gender"] = selectOptRef["Gender"].current.value;
        character["complexion"] = selectOptRef["Complexion"].current.value;
        character["body"] = selectOptRef["Body"].current.value;
        character["speech"] = selectOptRef["Speech"].current.value
        character["OOC"] = flavourtexts["OOC"].current.innerHTML
        character["LOWIC"] = flavourtexts["LOWIC"].current.innerHTML
        character["HIGHIC"] = flavourtexts["HIGHIC"].current.innerHTML
        character["traits"] = traits.current
        axios({
            url:`${apiURL}users/character/post`,
            method:"post"
        })
    }
    useEffect(()=>{
        ageChange()
        heightChange()
        nameChange()
    })
    return (
        <div className={"flex flex-col justify-center"}>
            <p className={"underline underline-offset-4 text-white font-thin mt-16 text-center text-4xl"}>Character Creator</p>
            <p className={"text-xl text-white font-light text-center mt-16"}>IC name</p>
            <input placeholder={"Name"} onBlur = {nameChange} ref = {attributesRef["name"]} className={"m-auto mt-2 bg-black border p-2 focus:ring-green-500 text-white font-thin text-2xl"}/>
            <p className={"text-xl text-white font-light text-center mt-16"}>WHAT MAKES YOU SPECIAL!! </p>
            <p ref = {remainingPointsRef} className={"text-lg text-white font-light text-center mt-2"}>Remaining SPECIAL points: {remainingPoints.current} </p>

            <div className={"flex justify-evenly mt-2 w-[20%] m-auto"}>

                    {parseSpecial()}
            </div>
            <p className={"text-2xl text-white font-light text-center mt-12 mb-4"}>Current Race: {raceOpts[race.current]} </p>

            <div className = "grid grid-cols-3 w-[25%] m-auto">
                {parseRace(raceOpts)}
            </div>
            <p className={"text-2xl text-white font-light text-center mt-12 mb-4"}>Attributes </p>
            <div className = "grid grid-cols-3 w-[25%] m-auto">

                <div className = "flex flex-col justify-center m-2">
                    <p className={"text-xl text-white font-light text-center "}>Age</p>
                    <input placeholder = "16" type = "number" onBlur = {ageChange} ref ={attributesRef["age"]}className={"m-auto mt-2 text-center w-full bg-black border p-1 focus:ring-green-500 text-white font-thin text-lg"}/>

                </div>
                <div className = "flex flex-col justify-center m-2">
                    <p className={"text-xl text-white font-light text-center"}>Gender</p>
                    <select ref = {selectOptRef["Gender"]} className = "bg-black border p-1 text-lg mt-2 text-white">
                        <option> Male </option>
                        <option> Female </option>
                        <option> None </option>
                    </select>
                </div>
                <div className = "flex flex-col justify-center m-2">
                    <p className={"text-xl text-white font-light text-center"}>Body build</p>
                    <select ref = {selectOptRef["Body"]} className = "bg-black border p-1 text-lg mt-2 text-white">
                        <option> Lean </option>
                        <option> Bulk </option>
                        <option> Chubby </option>
                        <option> Overweight </option>
                        <option> Average </option>
                        <option> Walkin' Stick </option>

                    </select>
                </div>
                <div className = "flex flex-col justify-center m-2">
                    <p className={"text-xl text-white font-light text-center "}>Height in CM</p>
                    <input placeholder={"Height"} type = "number" onBlur = {heightChange} ref ={attributesRef["height"]}className={"m-auto mt-2 text-center w-full bg-black border p-1 focus:ring-green-500 text-white font-thin text-lg"}/>

                </div>
                <div className = "flex flex-col justify-center m-2">
                    <p className={"text-xl text-white font-light text-center"}>Complexion</p>
                    <select ref = {selectOptRef["Complexion"]} className = "bg-black border p-1 text-lg mt-2 text-white">
                        <option> Albino </option>
                        <option> Light-skin Afro American </option>
                        <option> African American </option>
                        <option> Middle Eastern </option>
                        <option> Hispanic </option>
                        <option> Creole </option>
                        
                    </select>
                </div>
                <div className = "flex flex-col justify-center m-2">
                    <p className={"text-xl text-white font-light text-center"}>Speech verb</p>
                    <select ref = {selectOptRef["Speech"]} className = "bg-black border p-1 text-lg mt-2 text-white">
                        <option> Says </option>
                        <option> Chirps </option>
                        <option> Squeals </option>
                        <option> States </option>
                        <option> Declares </option>
                        <option> Rasps </option>
                        <option> Mumbles </option>
                        <option> Growls </option>
                        <option> Grumbles </option>
                    </select>
                </div>

            </div>
            <p className={"text-xl text-white font-light text-center mt-4"}>Basic flavor text</p>
            <div ref = {flavourtexts["LOWIC"]} contenteditable="true" className = {"w-[590px] text-white text-2xl font-thin border bg-black m-auto min-h-[20px] mb-8 caret-cyan-500"}/>
            <p className={"text-xl text-white font-light text-center mt-4"}>High perception text</p>
            <div ref = {flavourtexts["HIGHIC"]} contenteditable="true" className = {"w-[590px] text-white text-2xl font-thin border bg-black m-auto min-h-[20px] mb-8 caret-cyan-500"}/>
            <p className={"text-xl text-white font-light text-center mt-4"}>OOC notes   </p>
            <div ref = {flavourtexts["OOC"]} contenteditable="true" className = {"w-[590px] text-white text-2xl font-thin border bg-black m-auto min-h-[20px] mb-8 caret-cyan-500"}/>
            <div className = "m-auto flex flex-col w-[590px] justify-left">
                {parseTraits()}
            </div>
            <button onClick = {submitData} className = "text-white border font-light mt-12 bg-black hover:text-black hover:bg-white transition-all p-4 pr-12 pl-12 m-auto">CREATE</button>
        </div>
    )
}

export default CreateChar;