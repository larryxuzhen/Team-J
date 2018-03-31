import React, {Component} from 'react'
import PayrollContract from '../build/contracts/Payroll.json'
import getWeb3 from './utils/getWeb3'

import { Layout, Menu, Spin, Alert } from 'antd'
const { Content, Header, Footer } = Layout

import Employer from './components/Employer'
import Employee from './components/Employee'

import './App.css'
import 'antd/dist/antd.css'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            storageValue: 0,
            web3: null,   
            mode: 'employer',
            payroll : null,
            account: [],
        }
    }

    componentWillMount() {
        getWeb3
        .then(results => {
        this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
        this.instantiateContract()
    })
    .catch(() => {
        console.log('Error finding web3.')
    })
    }

    instantiateContract() {
        /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
        const contract = require('truffle-contract')
        const Payroll = contract(PayrollContract)
        Payroll.setProvider(this.state.web3.currentProvider)
        // Declaring this for later so we can chain functions on Payroll.
        var PayrollInstance

        // GET ACCOUNTS
        this.state.web3.eth.getAccounts(async(error, accounts) => {
        this.setState({
        account: accounts[0],
         });
        Payroll.deployed().then((instance) => {
            PayrollInstance = instance
            this.setState({
                payroll: instance
            });
        })
    })
}
        

    onSelectTab = ({key}) => {
        this.setState({
            mode: key
        })
    }

    renderContent() {
        const { account, payroll, web3, mode } = this.state
        if (!payroll) {
            return <Spin tip="Loading..." />
        }

        switch(mode) {
            case 'employer':
                return <Employer account={account} payroll={payroll} web3={web3}></Employer>
            case 'employee':
                return <Employee account={account} payroll={payroll} web3={web3}></Employee>
            default:
                return <Alert message="请选择一个模式" type="info" showIcon />
        }

    }

    render() {
        return (
            <Layout>
                <Header className="header">
                    <div className="logo">老董区块链员工薪酬系统</div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['employer']}
                        style={{ lineHeight: '64px' }}
                        onSelect={this.onSelectTab}>
                        <Menu.Item key="employer">雇主</Menu.Item>
                        <Menu.Item key="employee">雇员</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Layout style={{ padding: '24px 0', background: '#fff', minHeight: '540px'  }}>
                        { this.renderContent() }
                    </Layout>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                     @2018  老董区块链员工薪酬系统 COURSE
                </Footer>
            </Layout>
        );
    }
}

export default App