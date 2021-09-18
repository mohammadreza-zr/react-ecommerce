import React from 'react';
import CustomButton from '../custom-button/custom-button.component';
import FormInput from '../form-input/form-input.component';
import './customers.styles.scss';

class Customers extends React.Component{
    constructor(){
        super();
        this.state = {
            result: [],
            addCustomer: {
                name: '',
                number: '',
                tags: '',
                wallet: ''
            },
            editCustomer: {
                id: '',
                value: {
                    name: '',
                    number: '',
                    tags: '',
                    wallet: ''
                }
            },
            openEdit: {
                id: '',
                status: false
            },
            pageNumber: 1,
            customerCount : 0,
            tags: {
                id: '',
                value: []
            }
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
        fetch(`http://localhost:3000/api/customer?page=${pageNumber1}`)
            .then(items => items.json())
            .then(item => {
                this.setState({customerCount : item.customerListCount})
                this.setState({result : item.customerList})
                this.setState({pageNumber : pageNumber1})
        });
    }
    handleNextPage = () =>{
        let pageNumber1 = this.state.pageNumber
        if (this.myMath(this.state.customerCount) > pageNumber1) {
            pageNumber1 = pageNumber1 + 1;
        }
        fetch(`http://localhost:3000/api/customer?page=${pageNumber1}`)
        .then(items => items.json())
        .then(item => {
            this.setState({result : item.customerList})
            this.setState({customerCount: item.customerListCount})
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
            body: JSON.stringify({ name: this.state.editCustomer.name })
        };
        fetch(`http://localhost:3000/api/customer/${id}`, requestOptions)
            .then(response => response.json())
            .then(res => {
                if(!res.message) {this.handleClick(); this.setState({editName: {id:'', name:''}}) }
                else alert(res.message)})
    }


    handleEditChange = event => {
        const { id, value } = event.target;
        // const current = this.state
        this.setState({editName: {id:id, value:value}})
    }
    // handleKeyDown = (e) => {
    //     if (e.key === 'Enter') {
    //         let value = this.state.tags.value
    //         value.push(e.target.value)
    //         this.setState({
    //             tags: {value:value}
    //         })
    //         e.target.value = ''
    //     }
    // }

    handleChange = event => {
        const current = this.state.addCustomer
        const { value, name } = event.target;
        current[name] = value.replace(/\s+/g, ' ')
        this.setState({addCustomer: current})
        const rtl_rx = /[\u0591-\u07FF]/;
        event.target.style.direction = rtl_rx.test(event.target.value) ? 'rtl' : 'ltr';
    }
    handleRemoveTag = (e) => {
        let id = e.target.id
        let value = this.state.addCustomer.tags.replace(/\s+/g, ' ').trim().split(' ')
        delete value[id]
        let newValue = value.toString().replace(/,/g, ' ').trim().replace(/\s+/g, ' ')
        this.setState({addCustomer:{
            tags: newValue
        }});
    }
    handleAdd = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {
                name : this.state.addCustomer.name,
                tags : [this.state.addCustomer.tags],
                number : this.state.addCustomer.number,
                wallet : this.state.addCustomer.wallet,
            } )
        };
        console.log(requestOptions);
        fetch('http://localhost:3000/api/customer', requestOptions)
            .then(response => response.json())
            .then(res => {
                this.setState({addCustomer: {
                    name: '',
                    number: '',
                    tags: '',
                    wallet: ''
                }})
                this.handleClick(res.CustomerListCount);
            })
    }


    handleDelete = (id) => {
        fetch(`http://localhost:3000/api/customer/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(res => {
            this.handleClick(res.CustomerListCount);
        })
    }


    test = ({id, ...other})=>{
        let {name, number, tags, wallet, completed, publishDate} = {...other.other};
        return (
        <div className='card text-center p-1 m-2'>
            <h3 id={id}>Name: <span style={{color:'#fca311'}}>{name}</span></h3>
            <div>
                <p id={id}>Number: {number}</p>
                <p id={id}>Wallet: {wallet}</p>
            </div>
            <div>
                <p id={id}>Tags: {tags.map(i => <span style={{margin:'5px'}}>{i}</span>)}</p>
                <p id={id}>Completed: {completed? 'true' : 'false'}</p>
                <p id={id}>Publish Date: {publishDate}</p>
            </div>
            <div className='flex justify-between'>
                <CustomButton className='bg-gray-900 hover:bg-red-500 px-20 py-4 rounded' id={id} onClick={this.handleEdit.bind(this, id)}>edit</CustomButton>
                <CustomButton id={id} onClick={this.handleDelete.bind(this, id)}>delete</CustomButton>
            </div>
            {
                this.state.openEdit.status && this.state.openEdit.id === id ? 
                <div className='flex'>
                    <FormInput label='Name' id={id} type="text" name="name" value={name} onChange={this.handleEditChange} />
                    <FormInput label='Number' id={id} type="number" name="number" value={number} onChange={this.handleEditChange} />
                    <FormInput label='Tags' id={id} type="text" name="tags" value={tags} onChange={this.handleEditChange} />
                    <FormInput label='Wallet' id={id} type="number" name="wallet" value={wallet} onChange={this.handleEditChange} />
                </div>
                : null
            }
        </div>
        )
    }


    Add = ()=>{
        const {name,tags ,number, wallet} = this.state.addCustomer;
        const tag = tags.trim().replace(/\s+/g, ' ').split(' ');
        return (
        <div className='addCustomer'>
                <div className='flex'>
                    <div className='mr-2'>
                        <FormInput label='Name' type="text" name='name' value={name ? name : ''} onChange={this.handleChange} />
                        <div className='relative '>
                            <FormInput label='Tags' type='text' name='tags' value={tags ? tags : ''} onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
                            <div className='flex flex-row relative m-0 p-0'>
                            {
                                tag[0].length >= 1 || tag[1] ?
                                tag.map((object, i) =>
                                    tag[i].length >= 1 ?
                                        <div>
                                            <div class="tooltip">
                                                <b onClick={this.handleRemoveTag} className='bg-green-500 tags' id={i} key={i}>{object}</b>
                                                <span className='tooltiptext'>Click to remove</span>
                                            </div>
                                        </div>
                                        :null
                                )
                                :null
                            }
                            </div>
                        </div>
                    </div>
                    <div className='ml-2'>
                        <FormInput label='Number' type="number" name='number' value={number ? number : ''} onChange={this.handleChange} />
                        <FormInput label='Wallet' type="number" name='wallet' value={wallet ? wallet : ''} onChange={this.handleChange} />
                    </div>
                </div>
                <div className='flex justify-between'>
                    <CustomButton type="button" className='custom-button' onClick={this.handleAdd}>Add</CustomButton>
                    <CustomButton type='button' className='custom-button' onClick={this.handleClick}>show customers</CustomButton>
                </div>
        </div>
        )
    }

    render(){
        const {result, pageNumber} = this.state
        return(
            <div className='customers-div'>
                <this.Add />
                <div className='result'>
                    {
                        result.length >= 1 ? 
                        <h2>Page: {pageNumber}</h2>
                        : null
                    }
                    {
                        result ?
                        result.map( ({_id, ...other}) => (
                            <this.test key={_id} id={_id} other={other} />
                        ))
                        : null
                    }{
                        result.length >= 1 ?
                        <CustomButton type="button" className='custom-button' onClick={this.handleNextPage}>Next Page</CustomButton>
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Customers;