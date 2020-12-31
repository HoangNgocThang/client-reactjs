import Axios from 'axios';
import React, { Component } from 'react';
import { useRouteMatch, useHistory } from "react-router-dom";
import Constant from '../../src/constant';

class OrderScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.getOrders();
    }

    getOrders = async () => {
        try {
            const user = await localStorage.getItem('user');
            const userPar = JSON.parse(user);
            const res = await Axios.get(`${Constant.BASE_URL}/order/show`, {
                headers: {
                    'Authorization': `Bearer ${userPar && userPar.access_token}`
                }
            });
            console.log('getOrders:', res);
            if (res.data.status != 200) {
                alert(res.data.message);
                return;
            }
            this.setState({
                data: res.data.data
            });
        } catch (error) {
            console.log(error);
        }
    }

    renderListOrder = () => {
        const { data } = this.state;
        if (data.length == 0) {
            return <div>
                <span style={{ color: 'grey' }}>Đơn hàng trống</span>
            </div>
        }
        return (
            <ul>
                {
                    data.map((e, i) => {
                        return (
                            <li
                                key={e.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: 15,
                                    backgroundColor: 'yellow',
                                    width: 500
                                }}>
                                <span>Mã đơn hàng: {e.id}</span>
                                <span>Ngày tạo: {e.date}</span>
                                <span style={{ color: '#BF081F' }}>Tổng tiền: {e.amount} VNĐ</span>
                                {
                                    <ul>
                                        {e.items.map((ele, index) => {
                                            return <li
                                                style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#46A049', marginTop: 8 }}
                                                key={ele.id}>
                                                <span>Tên sản phẩm: {ele.name}</span>
                                                <span>Số lượng: {ele.quantity}</span>
                                            </li>
                                        })}
                                    </ul>

                                }
                            </li>
                        )
                    })
                }
            </ul>

        )
    }

    render() {
        return (
            <div>
                <h1>Đơn hàng</h1>
                {this.renderListOrder()}
            </div>
        );
    }
}

export default function BaseOrderScreen() {
    let match = useRouteMatch();
    const history = useHistory();
    return (<OrderScreen match={match} history={history} />)
} 