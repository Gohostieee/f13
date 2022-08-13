import './App.css';
import {CharSelect, Home, Login} from "./pages/pageindex.jsx"
import {useState} from "react"
function App() {
  const [page,usePage] = useState("login");
  switch(page){

    case "main":
      return(<Home state = {usePage}/>)
    break;
      case "login":
        return(<Login state = {usePage}/>)
      break;
    case "charselect":
        return(<CharSelect state = {usePage}/>)

  }

  
}

export default App;
