import React, { useState } from 'react'
import close from '../assets/close.svg'
import Rating from './Rating'
import {ethers} from 'ethers'

const Product = ({item, state, account, togglePop}) => {
  const [order,setOrder] = useState(null)
  const [hasBought,setHasBought]= useState(null)
  const fetchDetails = async()=>{
    const events = await contract.queryFilter("Buy")
    const orders = events.filter(
      (event)=>event.args.buyer === account && event.args.itemId.toString()===item.id.toString()
    )
      if(orders.length ===0) return
      const order = await contract.orders(account, orders[0].args.orderId)
      setOrder(order)
  }
  const {contract} = state
  const buyHandler = async()=>{
    let tx = await contract.buy(item.id,{value:item.cost})
    await tx.wait()
    setHasBought(true)


  }
  return (
    <div className='product'>
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt=""/>
        </div>
        <div className="product__overview">
          <h3>{item.name}</h3>
          <Rating value={item.rating}/>
          <hr />
          <p>{item.address}</p>
          <h2>{ethers.formatUnits(item.cost.toString(), 'ether')}ETH</h2>
          <hr />
          <h2>Overview</h2>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit similique sit iste incidunt praesentium nisi esse odio optio, fugiat dolorum? Inventore sit, laborum obcaecati commodi praesentium officia quia ut, nulla architecto repellat dignissimos ducimus iure ipsa. Eveniet, aspernatur in? Illum.</p>


        </div>
        <div className="product__order">
          <h1>{ethers.formatUnits(item.cost.toString(), 'ether')}ETH</h1>
          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now()+345600000).toLocaleDateString(undefined,{weekday:'long', month: 'long', day: 'numeric'})}
            </strong>

          </p>
          {item.stock>0?(<p>In Stock</p>):(<p>Out of Stock</p>)}
          <button className="product__buy" onClick={buyHandler}>Buy Now</button>
          <p><small>Ships from</small>Dappazon</p>
          <p><small>Sold By</small>Dappazon</p>
          {order && (
            <div className='product__bought'>
              Item bought on <hr />
              <strong>
                {new Date(Number(order.time.toString()+'000')).toLocaleDateString(
                  undefined,{weekday:'long', hour: 'numeric', minute: 'numeric', second: 'numeric'}
                )}
              </strong>
            </div>
          )}
        </div>
        <button onClick={togglePop} className='product__close'>
          <img src={close} alt="" />
        </button>
      </div>
      
      
    </div>
  )
}

export default Product
