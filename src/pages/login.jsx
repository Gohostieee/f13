import axios from "axios"
import {useRef, useState,useEffect} from "react";

const apiURL = "http://localhost:3001/"
export default function Login(props) {
    const user = useRef(), pass = useRef(), error = useRef();
    const [signup, useSignup] = useState("login");
    const userInfo = JSON.parse(localStorage.getItem("user"))
    const checklocal = async () => {
        await axios({
            url: `${apiURL}api/accounts/login?username=${userInfo['user']}&password=${userInfo['pass']}`,
            method: "get"
        }).then(x => {

            if (x.data) {

                props.state("charselect")

            } else {
                error.current.innerHTML = "Local data found but its wrong??"
            }
        })
    }
    useEffect(()=>{
        checklocal()
    },[])
    const checkSignUp = () => {
        switch (signup) {
            case "login":
                return (
                    <>
                        <p onClick={SwitchMode}
                           className="text-white cursor-pointer text-xl glitch text-center underline font-thin mt-16 ">Dont
                            have an account?</p>
                        <button onClick={() => {
                            checkLogin()
                        }}
                                className={"text-white bg-black transition-all hover:text-black hover:bg-white hover:scale-125 text-2xl font-thin border p-4 pl-16 pr-16 m-auto mt-4 mb-0 ]"}>Login
                        </button>
                    </>
                )
                break;
            case "signup":

                return (
                    <>
                        <p onClick={SwitchMode}
                           className="text-white cursor-pointer text-xl glitch text-center underline font-thin mt-16 ">Already
                            have an account?</p>
                        <button onClick={() => {
                            checkSignup()
                        }}
                                className={"text-white bg-black transition-all hover:text-black hover:bg-white hover:scale-125 text-2xl font-thin border p-4 pl-16 pr-16 m-auto mt-4 mb-0 ]"}>Signup
                        </button>

                    </>
                )
        }
    }
    const SwitchMode = () => {
        let mode;
        if (signup === "login") {
            mode = "signup"
        } else {
            mode = "login"
        }
        useSignup(mode)
    }
    const checkSignup = async () => {
        console.log(`${apiURL}users/signup?name=${user.current.value}&pass=${pass.current.value}`)
        await axios({
            url: `${apiURL}users/signup?name=${user.current.value}&pass=${pass.current.value}`
        }).then(x =>{
            window.localStorage.setItem("user", JSON.stringify({
                user: user.current.value,
                pass: pass.current.value
            }))
            props.state("charselect")
        }).catch(x=>{

            switch(x.response.data['reason']){
                case "userExists":
                    error.current.innerHTML = "USER ALREADY EXISTS!!"
                    break;

                default:
                    error.current.innerHTML = "Unknown error?? Notify the admemes!"
                    break
            }
        })

    }
    
    const checkLogin = async () => {

        await axios({
            url: `${apiURL}api/accounts/login?username=${user.current.value}&password=${pass.current.value}`,
            method: "get"
        }).then(x => {

            if (x.data) {
                window.localStorage.setItem("user", JSON.stringify({
                    user: user.current.value,
                    pass: pass.current.value
                }))
                props.state("charselect")

            } else {
                error.current.innerHTML = "Username or password incorrect!"
            }
        })
    }

    return (
        <div class="absolute overflow-x-hidden h-screen w-screen bg-black relative " data-theme="cyberpunk">
            <div class="relative sm:top-[5%]  h-[90%] flex flex-col">
                <h2 class="hero cyberpunk layers mt-8 text-white text-center text-8xl font-thin " data-text="EGO DEATH">
                    <span>LOGIN</span></h2>
                <p class="text-white text-xl glitch underline underline-offset-4 text-center font-medium">卡罗琳</p>
                <p class="text-white text-xl glitch underline underline-offset-4 text-center font-medium">执子之手，与子偕老</p>
                <p className="text-white text-xl glitch text-center font-thin mt-16">Username/Email</p>
                <input ref={user} placeholder={"Enter Email/Username"}
                       className={"bg-black border color-white text-2xl p-4 text-center m-auto md:w-[25%] w-[90%] mt-2 mb-0 font-light text-white"}/>
                <p className="text-white text-xl glitch text-center font-thin mt-16 text-white">Password</p>
                <input ref={pass} placeholder={"Enter Password"}
                       className={"bg-black border color-white text-2xl p-4 text-center m-auto md:w-[25%] mb-0 w-[90%] mt-2 font-light text-white"}/>
                <p ref={error}
                   className="text-red-500 text-xl glitch text-center underline font-thin mt-4 underline-offset-8"></p>
                {checkSignUp()}
                <button onClick={() => {
                    props.state("main")
                }}
                        className={"text-white m-auto mt-12 bg-black transition-all hover:text-black hover:bg-white hover:scale-125 text-xl font-thin border p-2 pl-12 pr-12"}>Back
                </button>

            </div>
        </div>
    )
}