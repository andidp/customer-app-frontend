import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import "./style.css";
// import CategoryTable from './components/CategoryTable';
import CustomerTable from './components/CustomersTable';
// import OrdersTable from './components/OrdersTable';
const { Header, Content, Footer } = Layout;

export default class Home extends Component {
    constructor(props) {
        super(props);
        document.title = "Entity Framework Example";
        this.state = {
            selectedMenu: "categories"
        }
    }

    handleMenuClick = (e) => {
        this.setState({
            selectedMenu: e.key
        });
    }
    render() {
        return (
            <Layout className="layout" style={{ minHeight: "100vh" }}>
                <Header>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['categories']}
                        style={{ lineHeight: '64px' }}
                        onClick={this.handleMenuClick}
                    >
                        <Menu.Item key="customers">Customers</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '50px 50px' }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        
                        {this.state.selectedMenu === "customers" && <CustomerTable />}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Customers App</Footer>
            </Layout>
        );
    }
}