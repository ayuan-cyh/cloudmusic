export default {
  install(Vue){
    Vue.prototype.fromatData=(data)=>{
      if(data>10000&&data<100000000){
       data= (data/10000)
       return data.toFixed(1)+'万'
      }else if(data>100000000){
        data=data/100000000
        // data=Math.trunc(data/100000000)
        return data.toFixed(0)+'亿'
      }else{
        return data
      }
    }
  }
}