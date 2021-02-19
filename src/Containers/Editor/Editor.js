import React,{Component,createRef} from 'react';
import axios from 'axios';
import Spinner from '../../Components/UI/Spinner/Spinner'
import classes from './Editor.module.css';

class editor extends Component  {
    startTime = createRef();
    endTime = createRef();
    state = {
       interviewId:null,
       participants:[],
       selectedParticipants:[],
       loading:false,
       startTime:null,
       endTime:null
   }

    async componentDidMount(){
        this.setState((state,props)=>{
            return {loading:true}
        })
        console.log(this.props.location,this.props.match)
       const data = await axios.get(process.env.REACT_APP_API_URL+"interview/"+this.props.match.params.id);
       console.log(data.data.interview)

    //    console.log(data.data.interview[0].startTime.replace(",",""));
    //    console.log(data.data.interview[0].endTime)
      //
    

       this.setState((state,props)=>{
           return {loading:false,selectedParticipants:[...data.data.interview[0].participants],interviewId:data.data.interview[0]._id,
                   participants:[...data.data.interview[0].allExceptParticipants],startTime:this.changeTime(data.data.interview[0].startTime.replace(",","")),
                endTime:this.changeTime(data.data.interview[0].endTime.replace(",",""))}
       })
       
    }
   
   changeTime = (dateString)=>{
    var dateVal = new Date(dateString);
    var day = dateVal.getDate().toString().padStart(2, "0");
    var month = (1 + dateVal.getMonth()).toString().padStart(2, "0");
    var hour = dateVal.getHours().toString().padStart(2, "0");
    var minute = dateVal.getMinutes().toString().padStart(2, "0");
    var sec = dateVal.getSeconds().toString().padStart(2, "0");
    var ms = dateVal.getMilliseconds().toString().padStart(3, "0");
    var inputDate = dateVal.getFullYear() + "-" + (month) + "-" + (day) + "T" + (hour) + ":" + (minute) + ":" + (sec) + "." + (ms);
    return inputDate;   
}

   onChangeStart = (e,number)=>{
       if(number===0){
        this.setState((state,props)=>{
            return {startTime:e.target.value}
        })
       }else{
        this.setState((state,props)=>{
            return {endTime:e.target.value}
        })
       }
       
    //    this.startTime.current.value=e.current.value
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
            const data = await axios.patch(process.env.REACT_APP_API_URL+"interview/"+this.state.interviewId,body);
            this.props.history.replace("/")

    
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
                    <input ref={this.startTime} onChange={(e)=>this.onChangeStart(e,0)}type="datetime-local" name="startTime" value={this.state.startTime}/>
                </div>
                <div>
                    <label>
                      End Time :
                    </label>
                    <input ref={this.endTime} onChange={(e)=>this.onChangeStart(e,1)}type="datetime-local" name="endTime" value={this.state.endTime}/> 
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
               <h1>INTERVIEW EDITING -(CLICK ON THE NAMES TO SELECT AND UNSELECT)</h1>
               {data}
           </div>
       )

   }

}


export default editor;