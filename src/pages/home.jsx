import logo from '../img/fallout13.png';

const Home = (props) => {
	const ChangeState = () =>
	{
		props.state("login")
	}
	return (
	<div className="m-auto flex flex-col justify-center">
      <h1 className = "font-thin text-6xl text-center mt-16 text-white">GORE STATION</h1>
      <img src = {logo} className = "m-auto sm:h-[420px] sm:mt-24 mt-12 border-x p-8 pt-0 pb-0 select-none"/>
      <button onClick = {()=>{ChangeState()}} className = "m-auto border text-white font-thin mt-16 p-8 pt-2 pb-2 hover:bg-white hover:text-black hover:scale-125 transition-all">ENTER</button>
    </div>
	)
}

export default Home