import React from 'react';
import './customers.styles.scss';

class Customers extends React.Component{
    constructor(){
        super();
        this.state = {
            result: [],
            addName: '',
            editName: {
                id: '',
                name: ''
            },
            openEdit: {
                id: '',
                status: false
            },
            pageNumber: 1,
            corseCount : 0
        }
    }
    myMath = (lastPage)=>{
        let page = lastPage                         // if true
            ?   ( lastPage / 10 ) % 1 === 0         // if int
                ? ( lastPage / 10 )                 // if int true   // 5
                : Math.trunc(( lastPage / 10 ) + 1) // if flout true // 5 + 1
            : 1;                                    // if false      // 1
        return page
    }
    handleClick = (lastPage) =>{
        let pageNumber1 = typeof(lastPage) == 'number' ? this.myMath(lastPage) : this.state.pageNumber;
        fetch(`http://localhost:3000/api/corse?page=${pageNumber1}`)
            .then(items => items.json())
            .then(item => {
                this.setState({corseCount : item.courseListCount})
                this.setState({result : item.courseList})
                this.setState({pageNumber : pageNumber1})
        });
    }
    handleNextPage = () =>{
        let pageNumber1 = this.state.pageNumber
        if (this.myMath(this.state.corseCount) > pageNumber1) {
            pageNumber1 = pageNumber1 + 1;
        }
        
        fetch(`http://localhost:3000/api/corse?page=${pageNumber1}`)
        .then(items => items.json())
        .then(item => {
            this.setState({result : item.courseList})
            this.setState({corseCount: item.courseListCount})
            this.setState({pageNumber: pageNumber1})
            })
    }


    handleEdit = (id) => {
        if(this.state.openEdit.status === false || this.state.openEdit.id !== id){
            return this.setState({openEdit: {id:id, status:true}})
        }
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: this.state.editName.name })
        };
        fetch(`http://localhost:3000/api/corse/${id}`, requestOptions)
            .then(response => response.json())
            .then(res => {
                if(!res.message) {this.handleClick(); this.setState({editName: {id:'', name:''}}) }
                else alert(res.message)})
    }


    handleEditChange = event => {
        const { id, value} = event.target;
        this.setState({editName: {id:id, name:value}})
    }


    handleChange = event => {
        const { value } = event.target;
        this.setState({addName: value})
    }


    handleAdd = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: this.state.addName })
        };
        fetch('http://localhost:3000/api/corse', requestOptions)
            .then(response => response.json())
            .then(res => {
                this.setState({addName: ''})
                this.handleClick(res.courseListCount);
            })
    }


    handleDelete = (id) => {
        fetch(`http://localhost:3000/api/corse/${id}`, { method: 'DELETE' })
        .then(response => {
            if(response.status === 200){
                this.handleClick();
            }
        })
    }


    test = ({id, name})=>{
        return (
        <div className='card'>
            <h3 id={id}>{name}</h3>
            <button id={id} onClick={this.handleEdit.bind(this, id)}>edit</button>
            <button id={id} onClick={this.handleDelete.bind(this, id)}>delete</button>
            {
                this.state.openEdit.status && this.state.openEdit.id === id ? 
                <input id={id} type="text" name="name" value={this.state.editName.name? this.state.editName.name : ''} onChange={this.handleEditChange} />
                : null
            }
        </div>
        )
    }


    Add = ()=>{
        return (
        <div className=''>
                <input type="text" autoFocus name='name' value={this.state.addName? this.state.addName : ''} onChange={this.handleChange} />
                <input type="button" value="submit" onClick={this.handleAdd} />
                <input type="button" value="next page" onClick={this.handleNextPage} />
        </div>
        )
    }

    render(){
        const {result} = this.state
        return(
            <div className='customers-div'>
                <this.Add />
                <button onClick={this.handleClick}>show list of customers</button>
                <div className='result'>
                    {
                        result ? 
                        <h2>{this.state.pageNumber}</h2>
                        : null
                    }
                    {
                        result ?
                        result.map( ({id, name}) => (
                            <this.test key={id} id={id} name={name}/>
                        ))
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Customers;