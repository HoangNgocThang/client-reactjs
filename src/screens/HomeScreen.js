import React, { Component } from 'react';
import axios from 'axios';
import '../../src/assets/styles/home.css';
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import Constant from '../constant';

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            categoies: [],
            products: [],
            total: 0,
            totalOrder: 0
        };
    }

    componentDidMount() {
        this.getAuth();
        this.getCategory();
        this.getProducts();
        this.getTotalItemInCart();
        this.getTotalOrder();
    }

    getAuth = async () => {
        try {
            let user = await localStorage.getItem('user');
            this.setState({ user: JSON.parse(user) })
        } catch (error) {
            console.log(error);
        }
    }

    getCategory = async () => {
        try {
            const res = await axios.get(`${Constant.BASE_URL}/category`);
            this.setState({ categoies: [{ id: 4, name: "Tất cả", slug: '', selected: true }].concat(res.data.data) });
        } catch (e) {
            console.log(e);
        }
    }

    getProducts = async () => {
        try {
            const res = await axios.get(`${Constant.BASE_URL}/products/index`);
            this.setState({ products: res.data.data });
        } catch (e) {
            console.log(e);
        }
    }

    getTotalItemInCart = async () => {
        try {
            const user = await localStorage.getItem('user');
            const userPar = JSON.parse(user);
            const res = await axios.get(`${Constant.BASE_URL}/cart/item/total`, {
                headers: {
                    'Authorization': `Bearer ${userPar && userPar.access_token}`
                }
            });
            console.log('getTotalItemInCart:', res);
            this.setState({
                total: res.data.total
            })
        } catch (error) {
            console.log(error);
        }
    }

    getTotalOrder = async () => {
        try {
            const user = await localStorage.getItem('user');
            const userPar = JSON.parse(user);
            const res = await axios.get(`${Constant.BASE_URL}/order/total-order`, {
                headers: {
                    'Authorization': `Bearer ${userPar && userPar.access_token}`
                }
            })
            console.log('getTotalOrder:', res);
            this.setState({
                totalOrder: res.data.total
            });
        } catch (e) {
            console.log(e);
        }
    }

    handleClickItem = (e) => {
        if (e.id == 4) {
            this.getProducts();
            return;
        }
        this.getProductsBySlug(e.slug);
    }

    getProductsBySlug = async (slug) => {
        try {
            const res = await axios.get(`${Constant.BASE_URL}/products/show/${slug}`);
            this.setState({ products: res.data.data });
        } catch (error) {
            console.log(error);
        }
    }

    renderMenu = () => {
        const { categoies } = this.state;
        return (
            categoies.map((e, i) => {
                return (
                    <li
                        className="menu"
                        key={e.id} className="menu-item" onClick={() => this.handleClickItem(e)}>
                        <li>{e.name}</li>
                    </li>
                )
            }))
    }

    onAdd = async (item) => {
        if (this.state.user == null) {
            alert('Vui lòng đăng nhập');
            return;
        }
        console.log('item11:', item);
        try {
            console.log("pa:", item, this.state.user);
            const res = await axios.post(`${Constant.BASE_URL}/cart/item/add`, item, {
                headers: {
                    'Authorization': `Bearer ${this.state.user && this.state.user.access_token}`
                }
            });
            console.log("resadd:", res);
            if (res.data.status != 200) {
                alert(res.data.message);
                return;
            }
            this.getTotalItemInCart();
            setTimeout(() => { alert(res.data.message) }, 250)
        } catch (error) {
            console.log(error);
        }
    }

    renderProducts = () => {
        const { products } = this.state;
        return (
            products.map((e, i) => {
                return (
                    <li className="product-item" key={e.id}>
                            <img src={e.image} className="image-product" alt="product" />
                            <span className="title-product">{e.name}</span>
                            <span style={{ alignSelf: 'center', marginTop: 10, color: '#BF081F' }}>Giá: {e.price} VNĐ</span>
                            <div
                                style={{ marginTop: 10, alignSelf: 'center', backgroundColor: '#46A049', padding: 8 }}
                                onClick={() => this.onAdd(e)}
                            >
                                <span style={{ color: 'white' }}>Thêm vào giỏ hàng</span>
                            </div>
                    </li>
                )
            })
        )
    }

    logout = () => {
        this.setState({
            user: null
        }, () => {
            localStorage.clear();
        })
    }

    onClickCart = () => {
        if (this.state.user == null) {
            alert('Vui lòng đăng nhập');
            return;
        }
        this.props.history.push('/cart');
    }

    onClickOrder = () => {
        if (this.state.user == null) {
            alert('Vui lòng đăng nhập');
            return;
        }
        this.props.history.push('/order');
    }

    onClickAccount = () => {
        if (this.state.user == null) {
            alert('Vui lòng đăng nhập');
            return;
        }
        this.props.history.push('/account');
    }

    render() {
        return (
            <div>
                <h1>Trang chủ</h1>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div
                        onClick={this.onClickCart}
                        style={{
                            padding: 10,
                            margin: 4,
                            backgroundColor: 'yellow',
                        }}>
                        {this.state.user && <span style={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}>Hiện có {this.state.total} sản phẩm</span>}
                        <img src="https://www.flaticon.com/svg/static/icons/svg/833/833314.svg"
                            style={{ width: 24, height: 24, objectFit: 'contain', marginLeft: 4 }} />
                    </div>

                    <div
                        onClick={this.onClickOrder}
                        style={{
                            padding: 10,
                            margin: 4,
                            backgroundColor: 'green'
                        }}>
                        {this.state.user && <span style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Hiện có {this.state.totalOrder} đơn hàng</span>}
                        <img src="https://www.flaticon.com/svg/static/icons/svg/3144/3144422.svg"
                            style={{ width: 24, height: 24, objectFit: 'contain', marginLeft: 4 }} />
                    </div>

                    <div
                        onClick={this.onClickAccount}
                        style={{
                            padding: 10,
                            margin: 4,
                            backgroundColor: 'blue'
                        }}>
                        {this.state.user && <span style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Tài khoản</span>}
                        <img src="https://www.flaticon.com/svg/static/icons/svg/2521/2521782.svg"
                            style={{ width: 24, height: 24, objectFit: 'contain', marginLeft: 4 }} />
                    </div>
                </div>

                <div style={{ position: 'fixed', right: 0 }}>
                    {
                        this.state.user ?
                            <span style={{ fontWeight: 'bold' }}>Hello {this.state.user.username}</span> :
                            <Link
                                to={'/login'}
                                style={{
                                    padding: 10,
                                    margin: 4,
                                    backgroundColor: 'yellow'
                                }}>
                                <span>Đăng nhập</span>
                            </Link>
                    }
                    {
                        this.state.user ?
                            <div
                                onClick={this.logout}
                                style={{
                                    margin: 4,
                                    padding: 10,
                                    backgroundColor: 'pink'
                                }}>
                                <span>Đăng xuất</span>
                            </div> :
                            <Link
                                to={'/register'}
                                style={{
                                    margin: 4,
                                    padding: 10,
                                    backgroundColor: 'green'
                                }}>
                                <span>Đăng ký</span>
                            </Link>
                    }
                </div>
                <ul className="menu">
                    {this.renderMenu()}
                </ul>
                <ul className="products">
                    {this.renderProducts()}
                </ul>
            </div>
        );
    }
}


export default function BaseHomeScreen() {
    let match = useRouteMatch();
    const history = useHistory();
    return <HomeScreen match={match.url} history={history} />
}

