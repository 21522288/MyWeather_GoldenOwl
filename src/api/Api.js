import client from "./client";

const getCurrentWeather = async (city, userIp)=>{
    try{
        const response = await client.get(`/weather/current?city=${city}&userIp=${userIp}`)
        return response.data
    }
    catch(error){
        console.log('error: ', error.message)
    }
}

const getForecastWeather = async (city, days, userIp)=>{
    try{
        const response = await client.get(`/weather/forecast?city=${city}&days=${parseInt(days)+1}&userIp=${userIp}`)
        return response.data
    }
    catch(error){
        console.log('error: ', error.message)
    }
}

const getWeatherHistory = async (userIp)=>{
    try{
        const response = await client.get(`/weather/history?userIp=${userIp}`)
        return response.data
    }
    catch(error){
        console.log('error: ', error.message)
    }
}

const sendcode = async (email,code)=>{
    try{
        const response = await client.post(`/mailer/send-email/verification`,{email:email,code:code})
        return response.data
    }
    catch(error){
        console.log('error: ', error.message)
    }
}
const saveNoti = async (email,city,time)=>{
    try{
        const response = await client.post(`/mailer/save`,{email:email,city:city,time:time})
        return response.data
    }
    catch(error){
        console.log('error: ', error.message)
    }
}
const unsubcribe = async (email)=>{
    try{
        const response = await client.delete(`/mailer/${email}`)
        return response.data
    }
    catch(error){
        console.log('error: ', error.message)
    }
}
const checkEmailExists = async (email) => {
    try {
      const response = await client.get(`/mailer/exists/${email}`);
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };
export default {
    getCurrentWeather,
    getForecastWeather,
    getWeatherHistory,
    sendcode,
    saveNoti,
    unsubcribe,
    checkEmailExists
}