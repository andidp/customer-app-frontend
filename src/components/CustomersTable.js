import React, { Component } from 'react';
import { Modal } from 'antd';
import "../style.css";
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import { EditableContext } from "./EditableContext";
import EditableTableCell from './EditableTableCell';
// import { API_URL } from '../API';

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends React.Component {
    fetchNewData = () => {
        fetch("customers")
            .then(response => response.json())
            .then(response => {
                let mapped = response.map(e => {
                    e.key = e.firstName;
                    e.key = e.lastName;
                    e.key = e.phoneNumber;
                    e.key = e.email;
                    return e;
                })
                this.setState({
                    dataSource: mapped
                })
            });
    }

    constructor(props) {
        super(props);

        this.fetchNewData();

        this.columns = [
            {
                title: 'Name',
                dataIndex: 'firstName',
                width: '15%',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                editable: true,
            },
            {
                title: 'Operation',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record)}>
                            <a href="http://domain.com">Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];

        this.state = {
            dataSource: [],
            count: 0,
        };
    }

    onChange = (e) => {
        this.setState({
            firstName: e.target.value,
            lasttName: e.target.value,
            phoneNumber: e.target.value,
            email: e.target.value,
        })
    }

    showModal = () => {
        this.setState({
            newCompanyDialogVisible: true,
        });
    };

    dismissModal = () => {
        this.setState({
            newCompanyDialogVisible: false,
        });
    };

    handleDelete = record => {
        fetch("customers/" + record.id,
            {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.status === 204) {
                    this.fetchNewData();
                }
            })
    };

    handleAdd = () => {
        this.setState({
            newCompanyDialogVisible: false,
        });
        fetch("customers/",
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    phoneNumber: this.state.phoneNumber,
                    email: this.state.email
                })
            })
            .then(response => {
                if (response.status === 204) {
                    this.fetchNewData();
                }
            })
    };

    handleSave = (oldRow, newValues, newRow) => {
        var data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email
        }
        fetch("customers/" + oldRow.id,
            {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status === 204) {
                    this.fetchNewData();
                }
            })
    };

    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableTableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Modal
                    title="Add new customer"
                    visible={this.state.newCompanyDialogVisible}
                    onOk={this.handleAdd}
                    onCancel={this.dismissModal}
                >
                    <Input
                        placeholder="First Name"
                        size="large"
                        value={this.state.firstName || ''}
                        onChange={this.onChange}
                    />
                    <Input
                        placeholder="Last Name"
                        size="large"
                        value={this.state.lastName || ''}
                        onChange={this.onChange}
                    />
                    <Input
                        placeholder="Email"
                        size="large"
                        value={this.state.email || ''}
                        onChange={this.onChange}
                    />
                    <Input
                        placeholder="Phone Number"
                        size="large"
                        value={this.state.phoneNumber || ''}
                        onChange={this.onChange}
                    />
                </Modal>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
                <Button onClick={this.showModal} type="primary" style={{ marginBottom: 16 }}>
                    Add new customer
                </Button>
            </div>
        );
    }
}

export default class CustomerTable extends Component {
    render() {
        return <EditableTable />
    }
}