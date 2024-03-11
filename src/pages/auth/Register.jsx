import React, { useState, useContext} from 'react';
import './Register.scss'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CHATBOT_BACKEND_URL } from '../../constants'
import Agreement from '../../components/Agreement/Agreement';
import StoredUserContext from '../../context/StoredUserContext';
import { createClient, createUser } from '../../requests/authRequest';
import { errorHandler } from '../../requests/errorHandler';
import { Spin, message } from 'antd';

function Register(props) {
  const navigate = useNavigate();
  const [checkbox, setCheckbox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const globalUser = useContext(StoredUserContext);
  console.log('props', props)
  const {setGlobalUser} = props;

  const apiUrl = CHATBOT_BACKEND_URL
  
  const [user, setUser] = useState({
    username:"",
    password:"",
    email:"",
    rePassword:"",
  })

  const handleRegister = async (e) => {
    console.log('checkbox',checkbox)
    e.preventDefault();
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(user.username.indexOf('@') !== -1){
      alert('Please do not include @ in your Username.')
    }else if (!regex.test(user.email) || user.email === '') {
      alert('Please input correct email address!')
    }else if (user.password !== user.rePassword) {
      alert("Password and Re-Password do not match.");
    }else if(!checkbox){
      alert("please check agreement first.");
    }else{
      try{
        setIsLoading(true);
        const data = await createClient({
          ...user,
          email:user.email.toLowerCase(), 
          username: user.username,
        })
        setIsLoading(false);
        messageApi.open({
          type: 'success',
          content: "Account created!",
          duration: 3
        })
        localStorage.setItem('user', JSON.stringify(data))
        setGlobalUser(data);
        setTimeout(() => {
          navigate('/home');
        }, 3000);
      }catch(err){
        errorHandler(err);
      }
    }
  }

  const handleChange = (e) => {
    let sanitizedValue = ""
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  return (
    <div className='d-flex flex-column justify-content-center align-items-center register'>
      {contextHolder}
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <div className='register-title'>
          Wei App Register</div>
          <Spin fullscreen spinning={isLoading}>Loading...</Spin>
        <div className='register-email'>
          <div className='register-tag'>Email</div>
          <div>
            <input name="email" className='register-input' type="text" onChange={handleChange}/>
          </div>
        </div>
        <div className='register-email'>
          <div className='register-tag'>Username</div>
          <div>
            <input name="username" className='register-input' type="text" onChange={handleChange}/>
          </div>
        </div>
        <div className='register-password'>
          <div className='register-tag'>Password</div>
          <div>
            <input name="password" className='register-input' type="password" onChange={handleChange}/>
          </div>
          <div>
          <div className='register-tag'>Re-Password</div>
            <input name="rePassword" className='register-input' type="password" onChange={handleChange}/>
          </div>
        </div>
        <div>
          <Agreement checkbox={checkbox} setCheckbox={setCheckbox}/>
        </div>
        <button onClick={handleRegister} className='register-button mt-5 mb-4 w-100'>Register</button>       

        <div className='d-flex justify-content-start'>
        </div>
        <div className='d-flex justify-content-start mt-3'>
          <a style={{textDecoration:"none"}} href='/login'>Already Have An Account?</a>
        </div>
      </div>
    </div>
  );
}

// const mapStateToProps = (state) => ({
//   loginUser: state.user,
// });

// const mapDispatchToProps = {
//   Login,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Register);
export default (Register);