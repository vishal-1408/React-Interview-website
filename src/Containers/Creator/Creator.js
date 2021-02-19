import React,{Component,createRef} from 'react';
import axios from 'axios';
import Spinner from '../../Components/UI/Spinner/Spinner'
import classes from './CreatorCSS.module.css'




class creator extends Component  {
    startTime = createRef();
    endTime = createRef();
    state = {
       participants:[],
       selectedParticipants:[],
       loading:false
   }

    async componentDidMount(){
        this.setState((state,props)=>{
            return {loading:true}
        })
       const data = await axios.get(process.env.REACT_APP_API_URL+"/participants");
       console.log(data.data)
       this.setState((state,props)=>{
           return {loading:false,participants:[...data.data]}
       })
   }
   
   submitHandler = async (e)=>{
             e.preventDefault();
             console.log(this.state.selectedParticipants.map(p=>p._id))
             const body = {
                 startTime:new Date(this.startTime.current.value).toUTCString(),
                 endTime:new Date(this.endTime.current.value).toUTCString(),
                 participants:this.state.selectedParticipants.map(p=>p._id)
             
             }
            this.setState((state,props)=>{
                return {participants:[...state.participants,...state.selectedParticipants],selectedParticipants:[],loading:true}
            })
            //  const data = await axios.post(process.env.REACT_APP_API_URL,{body});
            const data = await axios.post(process.env.gitREACT_APP_API_URL+"/interview",body);
            this.props.history.replace("/")
            this.setState((state,props)=>{
                return {loading:false}
            })

    
   }

   selectHandler = (index)=>{
            const participants = [...this.state.participants];
            const object = participants.splice(index,1);
            console.log(object);
            console.log([...this.state.selectedParticipants,...object])
            this.setState((state,props)=>{
                return {
                    participants:participants,
                    selectedParticipants:[...state.selectedParticipants,...object]
                }
            })

   }


   unselectHandler = (index)=>{
    
        const participants = [...this.state.selectedParticipants];
        const object = participants.splice(index,1);
        this.setState((state,props)=>{
            return {
                participants:[...state.participants.map(p=>{return {...p}}),...object],
                selectedParticipants:participants
            }
        })

   }
   render(){
       let data=this.state.loading?<Spinner/> : null;

       if(this.state.participants.length || this.state.selectedParticipants.length){
          data =  <form>
                
                <div>
                    <label>Start Time:</label>
                    <input ref={this.startTime} type="datetime-local" name="startTime" />
                </div>
                <div>
                    <label>
                      End Time :
                    </label>
                    <input ref={this.endTime} type="datetime-local" name="endTime" /> 
                </div>
                <div className={classes.participantsBox}>
                       <div className={classes.selected}>
                         <h4>SLECTED PARTICIPANTS</h4>
                         <ul>
                             {console.log(this.state.selectedParticipants)}
                             {this.state.selectedParticipants.map((q,i)=>{console.log(q.name,q.email); return<li onClick={this.unselectHandler.bind(this,i)} key={q._id+i+Math.random()*100}>Name: {q.name} & Email: {q.email}</li>})}
                         </ul>
                       </div>
                       <div className={classes.list}>
                       <h4>AVAILABLE PARTICIPANTS</h4>
                         <ul>
                             {this.state.participants.map((s,i)=>{console.log(s.name,s.email); return <li key={s._id+i+Math.random()*100} onClick={this.selectHandler.bind(this,i)}>Name: {s.name} & Email: {s.email}</li>})}
                         </ul>
                       </div>
                </div>


                <button onClick={this.submitHandler}>SUBMIT</button>
           </form>
       }else data= <h4 className={classes.noInterviews}>NO PARTICIPANTS PRESENT</h4>
       return (
           <div className={classes.main}>
               <h1>INTERVIEW CREATION-(CLICK ON THE NAMES TO SELECT AND UNSELECT)</h1>
               {data}
           </div>
       )

   }

}


export default creator;