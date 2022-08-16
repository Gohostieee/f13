import axios from "axios"
import {useEffect,useState} from "react"
const apiURL = "http://localhost:3001/"

const CharSelect = (props) => {
    const [chars,useChars] = useState([]);


    const SetCharData = (x) => {
        useChars(x);
    }


    const userInfo = JSON.parse(localStorage.getItem("user"))
    useEffect(()=>{
        axios({
            url:`${apiURL}users/character?username=${userInfo['user']}&password=${userInfo["pass"]}`,
            method:"get"
        }).then(x => {
            SetCharData(x.data)
        })
    },[])
    const parseChars = () => {
        console.log(chars)
        let charArr = [<button onClick={()=>{props.state("createchar")}} className={"p-6 w-[260px] mt-4 min-h-[50px] pt-2 pb-2 m-auto text-white font-thin text-3xl border transition-all hover:text-black hover:bg-white"}>NEW CHARACTER</button>];
        for(let x in chars) {
            charArr.push(<button onClick={()=>{props.state("createchar")}} className={"p-6 w-[260px] mt-4 min-h-[50px] pt-4 pb-4 m-auto text-white font-thin text-3xl border transition-all hover:text-black hover:bg-white"}>{chars[x]['name']}</button>)
        }


        return charArr;
    }
    return(

        <div className={"flex flex-col justify-center"}>
            <p className={"text-4xl font-thin text-white underline text-center mt-16 underline-offset-4"}>CHARACTER SELECT</p>
            <p className={"text-2xl font-thin text-white text-center mt-4"}>Currently logged in as: {userInfo['user']}</p>
            <div className={"w-[70%] border-x grid grid-cols-4 m-auto mt-16 p-8"}>
                {parseChars()}

            </div>

        </div>
    )
}

export default  CharSelect;