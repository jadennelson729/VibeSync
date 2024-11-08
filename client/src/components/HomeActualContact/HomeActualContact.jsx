/* This folder is for the ACTUAL CONTACT section, the other one is for the redirect */

import React from 'react'
import './HomeActualContact.css'
import envelope from '../../assets/Envelope.png'
import mail from '../../assets/mail.png'
import call from '../../assets/call.png'
import dark_arrow from '../../assets/dark-arrow.png'

const HomeActualContact = () => {
    /* Uses script from Web3Forms: https://docs.web3forms.com/how-to-guides/js-frameworks/react-js/simple-react-contact-form */
    const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "80023ad0-7a2c-4744-8e72-247e3eedebbb");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      console.log("Sucess", data);
      setResult("Email Submitted Successfully!");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className='contact'>
        <div className="contact-col">
            <h3>Send us a message <img src={envelope} alt ="" /> </h3>
            <p> Want to leave feedback? Feel free to reach out through our contact form.
                Your feedback is crucial in the development of Vibesync!
            </p>
            <ul>
                <li> <img src={mail} alt ="" /> nickgionti1@gmail.com</li>
                <li> <img src={call} alt ="" /> +1 954-551-3555</li>
            </ul>
        </div>
        <div className="contact-col">
            <form onSubmit={onSubmit}>
                <label> Your name</label>
                <input type="text" name='name' placeholder='Enter your name' required/>
                <label> Phone Number </label>
                <input type="tel" name='phone' placeholder='Enter your phone number' required/>
                <label> Write your message here </label>
                <textarea name="message" rows="6" placeholder='Enter your message' required> </textarea>
                <button type='submit' className='btn'> Submit now <img src={dark_arrow} alt="" /> </button>
            </form>
            <span>{result} </span>
        </div>
    </div>
  )
}

export default HomeActualContact
