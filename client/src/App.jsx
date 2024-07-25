import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers'

import Navigation from './component/Navigation'
import Section from './component/Section'
import Product from './component/Product'


import abi from "./contract/Dappazon.json"


const App = () => {
    const [state, setState] = useState({
        provider:"",
        signer:"",
        address:"",
        contract:""
      })
      const [account, setAccount] = useState(null)
      const [electronics, setElectronics]=useState([])
      const [toys, setToys]=useState([])
      const [clothing, setClothing]=useState([])
      const [item, setItem] = useState("")
      const [toggle, setToggle] = useState(false)
      const togglePop=async(item)=>{
        setItem(item)
        toggle ? setToggle(false):setToggle(true)

      }
    
      const loadBlockchainData = async()=>{
        window.ethereum.on("chainChanged", ()=>{
          window.location.reload()
        })
        window.ethereum.on("accountsChanged", ()=>{
          window.location.reload()
        })
        const contractAddress = "0xe2831F6B8aC387292341C94b9083E17D23a44F9f";
        const contractABI = abi.abi;
        try {
          const { ethereum } = window;
          if (!ethereum) {
            console.log("Metamask is not installed");
            return;
          }
    
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress()
          setAccount(address)
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          // console.log(signer)
    
          setState({ provider, signer, contract,address });
        } catch (error) {
          console.error("Error connecting to Metamask:", error);
        }

        const items = []

    for (var i = 0; i < 9; i++) {
      const item = await state.contract.items(i + 1)
      items.push(item)
    }
    

    const electronics = items.filter((item) => item.category === 'Electronics and Gadgets')
    const clothing = items.filter((item) => item.category === 'Clothing and Jewellery')
    const toys = items.filter((item) => item.category === 'Toys and Gaming')

    setElectronics(electronics)
    setClothing(clothing)
    // console.log(clothing)
    setToys(toys)
       
      
    
    }
    useEffect(()=>{
      loadBlockchainData()
    })
    
  return (
    <div>
        <Navigation account={account} setAccount={setAccount} state={state}/>
        <h2>Dappazon Best Sellers</h2>
        {electronics&&clothing&&toys&&(
          <div>
          <Section title={"Clothing & Jewellery"} items={clothing} togglePop={togglePop}/>
          <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop}/>
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop}/>
          </div>
    
        )}
        {toggle&&(
          <Product item={item} state={state} account={account} togglePop={togglePop}/>
        )}
      

    </div>
  )
}

export default App
