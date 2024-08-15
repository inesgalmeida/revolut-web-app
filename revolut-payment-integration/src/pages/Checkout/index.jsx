import React, { useState } from "react";
import RevolutCheckout from "@revolut/checkout";
import airpods from "../../assets/image.png";
import { getData } from "country-list";
import axios from "axios";

const Checkout = () => {
  const [itemTitle, setItemTitle] = useState("Airpods 3rd Generation");
  const [price, setPrice] = useState(1);
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
    region: "",
    city: "",
    streetLine1: "",
    streetLine2: "",
    postcode: "",
  });
  
  const [titleInputOpen, setTitleInputOpen] = useState(false);
  const [priceInputOpen, setPriceInputOpen] = useState(false);

  const changeHandler = e => {
    const { name, value } = e.target;
    if (name === "price") return setPrice(value);
    else if (name === "title") return setItemTitle(value);
    setBillingInfo({ ...billingInfo, [name]: value });
  };

  const submitHandler = async e => {
    e.preventDefault();
    
    const orderResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/order`,
      {
        amount: price,
        description: itemTitle,
        customer: {
          name: billingInfo.name,
          email: billingInfo.email,
          phone: billingInfo.phone,
        },
        billing_address: {
          country_code: billingInfo.countryCode,
          region: billingInfo.region,
          city: billingInfo.city,
          street_line1: billingInfo.streetLine1,
          street_line2: billingInfo.streetLine2,
          postcode: billingInfo.postcode,
        },
      }
    );

    const RC = await RevolutCheckout(orderResponse.data.token, "sandbox");
    // Open Payment Popup
    RC.payWithPopup({
      onSuccess() {
        console.log("success");
        setBillingInfo({
          name: "",
          email: "",
          phone: "",
          countryCode: "",
          region: "",
          city: "",
          streetLine1: "",
          streetLine2: "",
          postcode: "",
        });
      },
      onError(err) {
        console.log("error", err.message);
      },
      onCancel() {
        console.log("canceled");
      },
    });
  };
  const openTitleInput = () => setTitleInputOpen(true);
  const closeTitleInput = () => setTitleInputOpen(false);

  const openPriceInput = () => setPriceInputOpen(true);
  const closePriceInput = () => setPriceInputOpen(false);

  return (
    <div className='checkout'>
      <h1>Checkout</h1>
      <div className='checkout__item'>
        <img src={airpods} alt='Product' className='checkout__item-img' />
        <div className='checkout__itemDetails'>
          <div className='checkout__itemDetails__title'>
            {titleInputOpen ? (
              <input
                type='text'
                value={itemTitle}
                name='title'
                onChange={changeHandler}
                autoFocus
                onBlur={closeTitleInput}
              />
            ) : (
              <>
                <h3>{itemTitle}</h3>{" "}
                <i
                  className='fa-solid fa-pen-to-square'
                  onClick={openTitleInput}
                ></i>
              </>
            )}
          </div>

          <div className='checkout__itemDetails__price'>
            {priceInputOpen ? (
              <input
                type='number'
                value={price}
                name='price'
                onChange={changeHandler}
                min={1}
                onBlur={closePriceInput}
              />
            ) : (
              <>
                <h5>Price: £{price}</h5>
                <i
                  className='fa-solid fa-pen-to-square'
                  onClick={openPriceInput}
                ></i>
              </>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={submitHandler}>
        <input
          type='text'
          name='name'
          onChange={changeHandler}
          placeholder='Name'
          required
          value={billingInfo.name}
        />
        <input
          type='email'
          name='email'
          onChange={changeHandler}
          placeholder='Email'
          required
          value={billingInfo.email}
        />
        <input
          name='phone'
          autoComplete='tel'
          placeholder='Phone'
          onChange={changeHandler}
          required
          value={billingInfo.phone}
        />

        <select
          name='countryCode'
          required
          defaultValue=''
          value={billingInfo.countryCode}
          onChange={changeHandler}
        >
          <option disabled value=''>
            Select country
          </option>
          {getData().map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        <input
          type='text'
          name='region'
          placeholder='Region'
          onChange={changeHandler}
          required
          value={billingInfo.region}
        />
        <input
          type='text'
          name='city'
          placeholder='city'
          onChange={changeHandler}
          required
          value={billingInfo.city}
        />
        <input
          type='text'
          name='streetLine1'
          placeholder='Street Line 1'
          onChange={changeHandler}
          required
          value={billingInfo.streetLine1}
        />
        <input
          type='text'
          name='streetLine2'
          placeholder='Street Line 2'
          onChange={changeHandler}
          value={billingInfo.streetLine2}
        />
        <input
          type='text'
          name='postcode'
          placeholder='Postal Code'
          onChange={changeHandler}
          required
          value={billingInfo.postcode}
        />
        <button>Pay</button>
      </form>
    </div>
  );
};

export default Checkout;
