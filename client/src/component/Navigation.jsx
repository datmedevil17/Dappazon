import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from 'axios'
import {ethers} from "ethers"

const Navigation = ({ account, setAccount, state }) => {
    const {contract} = state;
  const [open, setOpen] = React.useState(false);
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [cost, setCost] = useState("")
  const [rating, setRating] = useState("")
  const [stock, setStock] = useState("")
  const [image, setImage]=useState("")

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };
  const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const tx = await contract.list(id,name,category,image,tokens(cost),rating,stock)
    await tx.wait()
    console.log(tx)
    handleClose()




  }
  const uploadToIPFS=async(e)=>{
    e.preventDefault()
    const file = e.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const formData = new FormData();
        formData.append("file", file);
        // console.log(formData)
        const res = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `35cb1bf7be19d2a8fa0d`,
            pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);
        const resData = await res.data;
        setImage(`https://ipfs.io/ipfs/${resData.IpfsHash}`);
        console.log(image)
      } catch (error) {
        window.alert("ipfs image upload error : ", error);
      }
    }


  }

  return (
    <nav>
      <div className="nav__brand">
        <h1>Dappazon</h1>
      </div>

      <input type="text" className="nav__search" />

      {account ? (
        <button type="button" className="nav__connect">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button type="button" className="nav__connect" onClick={connectWallet}>
          Connect
        </button>
      )}

      <ul className="nav__links">
        <li>
          <a href="#Clothing & Jewelry">Clothing & Jewelry</a>
        </li>
        <li>
          <a href="#Electronics & Gadgets">Electronics & Gadgets</a>
        </li>
        <li>
          <a href="#Toys & Gaming">Toys & Gaming</a>
        </li>
        <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
    
          onSubmit: (event) => {
            event.preventDefault();
            handleClose();
          },
        }}
      >
        <DialogTitle>Enlist Product</DialogTitle>
        <form onSubmit={handleSubmit}>
        <DialogContent>

          <TextField
            autoFocus
            required
            margin="dense"
            id="id"
            name="id"
            label="Id"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e)=>{setId(e.target.value)}}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e)=>{setName(e.target.value)}}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="category"
            name="category"
            label="Category"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e)=>{setCategory(e.target.value)}}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="image"
            name="image"            
            type="file"
            fullWidth
            variant="standard"
            onChange={uploadToIPFS}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="cost"
            name="cost"
            label="Cost"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e)=>{setCost(e.target.value)}}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="rating"
            name="rating"
            label="Rate out of 5"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e)=>{setRating(e.target.value)}}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="stock"
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e)=>{setStock(e.target.value)}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">List</Button>
        </DialogActions>
        </form>
      </Dialog>
      </ul>
    </nav>
  );
};

export default Navigation;
