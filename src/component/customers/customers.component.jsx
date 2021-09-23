import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import CustomButton from '../custom-button/custom-button.component';
import FormInput from '../form-input/form-input.component';
import './customers.styles.scss';
import { ReactComponent as EditIcon } from '../../assets/images/edit.svg';
import { ReactComponent as DeleteIcon } from '../../assets/images/delete.svg';
import moment from 'jalali-moment';

class Customers extends React.Component {
  constructor() {
    super();
    this.state = {
      result: [],
      addCustomer: {
        name: '',
        number: '',
        tags: '',
        wallet: '',
      },
      editCustomer: {
        name: '',
        number: '',
        tags: '',
        wallet: '',
      },
      openEdit: {
        id: '',
        status: false,
        fetch: false,
      },
      pageNumber: 1,
      customerCount: 0,
    };
  }
  front = {
    'front-auth-token':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmVhY3QiLCJkYXRlIjoiMTQwMC8wNi8zMCIsImlhdCI6MTYzMjIxNzY2OX0.Fio4N6WCdMkjLHxE-Gw5eksjlZa0WH3MEltzZXmANZk',
  };
  myMath = (lastPage) => {
    let page = lastPage // if true
      ? (lastPage / 10) % 1 === 0 // if int
        ? lastPage / 10 // if int true   // 5
        : Math.trunc(lastPage / 10 + 1) // if flout true // 5 + 1
      : 1; // if false      // 1
    return page;
  };
  componentDidMount() {
    fetch('http://localhost:3000/api/customer?page=1', {
      headers: this.front,
    })
      .then((items) => items.json())
      .then((item) => {
        this.setState({ customerCount: item.customerListCount });
      });
  }
  handleClick = (lastPage) => {
    let pageNumber1 =
      typeof lastPage == 'number' ? this.myMath(lastPage) : this.state.pageNumber;
    fetch(`http://localhost:3000/api/customer?page=${pageNumber1}`, {
      headers: this.front,
    })
      .then((items) => items.json())
      .then((item) => {
        this.setState({ customerCount: item.customerListCount });
        this.setState({ result: item.customerList });
        this.setState({ pageNumber: pageNumber1 });
      });
  };
  handleNextPage = () => {
    let pageNumber1 = this.state.pageNumber;
    if (this.myMath(this.state.customerCount) > pageNumber1) {
      pageNumber1 = pageNumber1 + 1;
    }
    fetch(`http://localhost:3000/api/customer?page=${pageNumber1}`, {
      headers: this.front,
    })
      .then((items) => items.json())
      .then((item) => {
        this.setState({ result: item.customerList });
        this.setState({ customerCount: item.customerListCount });
        this.setState({ pageNumber: pageNumber1 });
      });
  };

  table = () => {
    return (
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tags
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Wallet
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Completed
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      publish Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Edit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {this.state.result
                    ? this.state.result.map(({ _id, ...other }) => (
                        <this.test key={_id} id={_id} other={other} />
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  handleEdit = (id) => {
    if (this.state.openEdit.status === false || this.state.openEdit.id !== id) {
      return this.setState({ openEdit: { id: id, status: true } });
    }
  };

  handleUpdate = () => {
    let id = this.state.openEdit.id,
      front = this.front;
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', front },
      body: JSON.stringify({
        name: this.state.editCustomer.name,
        tags: this.state.editCustomer.tags,
        number: this.state.editCustomer.number,
        wallet: this.state.editCustomer.wallet,
      }),
    };
    fetch(`http://localhost:3000/api/customer/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (!res.message) {
          this.handleClick();
          this.setState({
            openEdit: { id: '', status: false, fetch: false },
          });
          this.setState({
            editCustomer: {
              name: '',
              tags: '',
              number: '',
              wallet: '',
            },
          });
        } else alert(res.message);
      });
  };

  handleChangeEdit = (event) => {
    const current = this.state.editCustomer;
    const { value, name } = event.target;
    current[name] = value;
    this.setState({ editCustomer: current });
    const rtl_rx = /[\u0591-\u07FF]/;
    event.target.style.direction = rtl_rx.test(event.target.value) ? 'rtl' : 'ltr';
  };
  handleChange = (event) => {
    const current = this.state.addCustomer;
    const { value, name } = event.target;
    current[name] = value.replace(/\s+/g, ' ');
    this.setState({ addCustomer: current });
    const rtl_rx = /[\u0591-\u07FF]/;
    event.target.style.direction = rtl_rx.test(event.target.value) ? 'rtl' : 'ltr';
  };

  handleRemoveTag = (e) => {
    const { name, tags, number, wallet } = this.state.addCustomer;
    let id = e.target.id;
    let value = tags.replace(/\s+/g, ' ').trim().split(' ');
    delete value[id];
    let newValue = value.toString().replace(/,/g, ' ').trim().replace(/\s+/g, ' ');
    this.setState({
      addCustomer: {
        name: name,
        tags: newValue,
        number: number,
        wallet: wallet,
      },
    });
  };
  handleRemoveTagEdit = (e) => {
    const { name, tags, number, wallet } = this.state.editCustomer;
    let id = e.target.id;
    let value = tags.replace(/\s+/g, ' ').trim().split(' ');
    delete value[id];
    let newValue = value.toString().replace(/,/g, ' ').trim().replace(/\s+/g, ' ');
    this.setState({
      editCustomer: {
        name: name,
        tags: newValue,
        number: number,
        wallet: wallet,
      },
    });
  };
  handleAdd = () => {
    let front = this.front;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', front },
      body: JSON.stringify({
        name: this.state.addCustomer.name,
        tags: this.state.addCustomer.tags,
        number: this.state.addCustomer.number,
        wallet: this.state.addCustomer.wallet,
      }),
    };
    fetch('http://localhost:3000/api/customer', requestOptions)
      .then((response) => response.json())
      .then((res) => {
        this.setState({
          addCustomer: {
            name: '',
            number: '',
            tags: '',
            wallet: '',
          },
        });
        this.handleClick(res.CustomerListCount);
      });
  };

  handleDelete = (id) => {
    fetch(`http://localhost:3000/api/customer/${id}`, {
      method: 'DELETE',
      headers: this.front,
    })
      .then((response) => response.json())
      .then((res) => {
        this.handleClick(res.CustomerListCount);
      });
  };

  test = ({ id, ...other }) => {
    let { name, number, tags, wallet, completed, publishDate } = {
      ...other.other,
    };
    // let momentTime = moment().locale('fa').format('YYYY/MM/DD'),
    //     today = momentTime.toString(),
    //     b = publishDate,
    //     a = b.toString()

    // console.log(typeof(today),today, typeof(a),a, today===a)
    return (
      <tr key={id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {name.length > 20 ? name.substr(0, 20 - 1) + ' ...' : name}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {number.length > 10 ? number.substr(0, 10 - 1) + ' ...' : number}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {tags.length > 15 ? tags.substr(0, 15 - 1) + ' ...' : tags}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {wallet.length > 10 ? wallet.substr(0, 10 - 1) + ' ...' : wallet}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              completed ? 'greenColor' : 'redColor'
            }`}
          >
            {completed ? 'completed' : 'Not completed'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {publishDate === moment().locale('fa').format('YYYY/MM/DD')
            ? 'today'
            : publishDate}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <EditIcon
            className="cursor-pointer changeIcon"
            id={id}
            onClick={this.handleEdit.bind(this, id)}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <DeleteIcon
            className="cursor-pointer rounded changeIcon redColor"
            id={id}
            onClick={this.handleDelete.bind(this, id)}
          />
        </td>
      </tr>
    );
  };

  Add = () => {
    const { name, tags, number, wallet } = this.state.addCustomer;
    const tag = tags.trim().replace(/\s+/g, ' ').split(' ');
    return (
      <div className="addCustomer">
        <div className="flex">
          <div className="mr-2">
            <FormInput
              label="Name"
              type="text"
              name="name"
              value={name ? name : ''}
              onChange={this.handleChange}
            />
            <div className="relative ">
              <FormInput
                label="Tags"
                type="text"
                name="tags"
                value={tags ? tags : ''}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
              />
              <div className="flex flex-row tagDiv m-0 p-0">
                {tag[0].length >= 1 || tag[1]
                  ? tag.map((object, i) =>
                      tag[i].length >= 1 ? (
                        <div class="tooltip">
                          <b
                            onClick={this.handleRemoveTag}
                            className="tags"
                            id={i}
                            key={i}
                          >
                            {object}
                          </b>
                          <span className="tooltipText">Click to remove</span>
                        </div>
                      ) : null,
                    )
                  : null}
              </div>
            </div>
          </div>
          <div className="ml-2">
            <FormInput
              label="Number"
              type="number"
              name="number"
              value={number ? number : ''}
              onChange={this.handleChange}
            />
            <FormInput
              label="Wallet"
              type="number"
              name="wallet"
              value={wallet ? wallet : ''}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <CustomButton type="button" className="custom-button" onClick={this.handleAdd}>
            Add
          </CustomButton>
          <CustomButton
            type="button"
            className="custom-button"
            onClick={this.handleClick}
          >
            show customers
          </CustomButton>
        </div>
      </div>
    );
  };

  closeModal = () => {
    this.setState({
      openEdit: {
        id: '',
        status: false,
        fetch: false,
      },
    });
  };
  myModal = () => {
    let id = this.state.openEdit.id;
    let isOpen = this.state.openEdit.status;
    if (!this.state.openEdit.fetch) {
      fetch(`http://localhost:3000/api/customer/${id}`, {
        headers: this.front,
      })
        .then((response) => response.json())
        .then((res) => {
          this.setState({
            editCustomer: {
              name: res.name,
              tags: res.tags,
              number: res.number,
              wallet: res.wallet,
            },
          });
        });
      this.setState({
        openEdit: { id: id, status: true, fetch: true },
      });
    }
    let { name, tags, number, wallet } = this.state.editCustomer;
    let tag = tags.trim().replace(/\s+/g, ' ').split(' ');
    return (
      <>
        <div></div>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto bgFilter "
            onClose={this.closeModal}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div
                  className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform border
                     bg-white shadow-xl rounded-2xl"
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    edit: {name}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      <div className="editCustomer">
                        <div className="flex">
                          <div className="mr-2">
                            <FormInput
                              label="Name"
                              type="text"
                              name="name"
                              value={name ? name : ''}
                              onChange={this.handleChangeEdit}
                            />
                            <div className="relative">
                              <FormInput
                                label="Tags"
                                type="text"
                                name="tags"
                                value={tags ? tags : ''}
                                onChange={this.handleChangeEdit}
                              />
                              <div className="flex flex-row tagDiv m-0 p-0">
                                {tag[0].length >= 1 || tag[1]
                                  ? tag.map((object, i) =>
                                      tag[i].length >= 1 ? (
                                        <div className="tooltip">
                                          <b
                                            onClick={this.handleRemoveTagEdit}
                                            className="tags"
                                            id={i}
                                            key={i}
                                          >
                                            {object}
                                          </b>
                                          <span className="tooltipText">
                                            Click to remove
                                          </span>
                                        </div>
                                      ) : null,
                                    )
                                  : null}
                              </div>
                            </div>
                          </div>
                          <div className="ml-2">
                            <FormInput
                              label="Number"
                              type="text"
                              name="number"
                              value={number ? number : ''}
                              onChange={this.handleChangeEdit}
                            />
                            <FormInput
                              label="Wallet"
                              type="text"
                              name="wallet"
                              value={wallet ? wallet : ''}
                              onChange={this.handleChangeEdit}
                            />
                          </div>
                        </div>
                      </div>
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium btn border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={this.handleUpdate}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium btn border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={this.closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  };

  render() {
    const { result, pageNumber, customerCount, openEdit } = this.state;
    return (
      <div className="customers-div">
        <this.Add />
        {result.length >= 1 ? (
          openEdit.status ? (
            <this.myModal id={this.state.openEdit.id} />
          ) : null
        ) : null}
        {result.length >= 1 ? (
          <div className="result">
            <h2>Page: {pageNumber}</h2>
            <this.table />
            {pageNumber < this.myMath(customerCount) ? (
              <CustomButton
                type="button"
                className="custom-button"
                onClick={this.handleNextPage}
              >
                Next Page
              </CustomButton>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export default Customers;
