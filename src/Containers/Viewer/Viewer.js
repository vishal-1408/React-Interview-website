import React,{Component} from 'react';
import axios from 'axios';
import Spinner from '../../Components/UI/Spinner/Spinner'
import classes from './Viewer.module.css';




class viewer extends Component  {
    state = {
       interviews:[],
       loading:false
   }

    async componentDidMount(){
        this.setState((state,props)=>{
            return {loading:true}
        })
       const data = await axios.get(process.env.REACT_APP_API_URL+"/interviews");
       console.log(data.data)
       this.setState((state,props)=>{
           return {loading:false,interviews:[...data.data.interviews]}
       })
   }

   editHandler = (id)=>{
       console.log(id)
    this.props.history.push("/edit/"+id)
   }

   render(){
       let interviews=this.state.loading?<Spinner/> : null;

       if(this.state.interviews.length){
           interviews = this.state.interviews.map((i,index)=>
           <div key={i._id} className={classes.row}>
             <div className={classes.times}>
               <div>{index+1}) </div>
               <div><h4>StartTime: {i.startTime}</h4></div>
               <div><h4>EndTime: {i.endTime}</h4></div>
             </div >
             <div className={classes.participants}>
                 {i.participants.length>0? <React.Fragment><h3>participants: </h3><ul> { i.participants.map(p=><li key={p._id}>{p.email}</li>)}</ul></React.Fragment> : null }
             </div>
             <div><button onClick={this.editHandler.bind(this,i._id)}>EDIT</button></div>
           </div>)
       }else if(this.state.loading==false) interviews = <h4 className={classes.noInterviews}>NO INTERVIEWS CREATED</h4>
       return (
           <div className={classes.main}>
               <h1>INTERVIEWS</h1>
               {interviews}
           </div>
       )

   }

}


export default viewer;